/**
 * @since 1.0.0
 */
import * as Equal from "@fp-ts/data/Equal"
import { identity } from "@fp-ts/data/Function"
import * as Hash from "@fp-ts/data/Hash"
import * as O from "@fp-ts/data/Option"

/**
 * An implementation of a weak map that supports the Iterable protocol.
 *
 * NOTE: the keys are compared via reference equality
 *
 * NOTE: this is truly weak only in the case FinalizationRegistry is available,
 * otherwise it is backed by a classical map and will not be weak (i.e. in
 * engines that don't natively support ES2021).
 *
 * @since 1.0.0
 * @category models
 */
export interface WeakIterableMap<K extends object, V>
  extends Iterable<readonly [K, V]>, Equal.Equal
{
  readonly _K: (_: K) => K
  readonly _V: (_: V) => V
  [Symbol.iterator](this: this): IterableIterator<readonly [K, V]>
  /** @internal */
  set(this: this, key: K, value: V): this
  /** @internal */
  get(this: this, key: K): V | undefined
  /** @internal */
  has(this: this, key: K): boolean
  /** @internal */
  delete(this: this, key: K): boolean
  /** @internal */
  entries(this: this): IterableIterator<readonly [K, V]>
  /** @internal */
  keys(this: this): IterableIterator<K>
  /** @internal */
  values(this: this): IterableIterator<V>
}

/**
 * @since 1.0.0
 * @category elements
 */
export const get: <K extends object>(key: K) => <V>(
  self: WeakIterableMap<K, V>
) => O.Option<V> = (key) => (self) => self.has(key) ? O.some(self.get(key)!) : O.none

/**
 * @since 1.0.0
 * @category unsafe
 */
export const unsafeGet: <K extends object>(key: K) => <V>(
  self: WeakIterableMap<K, V>
) => V = (key) =>
  (self) => {
    if (!has(key)(self)) {
      throw new Error("Expected map to contain key")
    }
    return self.get(key)!
  }

/**
 * @since 1.0.0
 * @category elements
 */
export const has: <K extends object>(key: K) => <V>(
  self: WeakIterableMap<K, V>
) => boolean = (key) => (self) => self.has(key)

/**
 * @since 1.0.0
 * @category elements
 */
export const remove: <K extends object>(key: K) => <V>(
  self: WeakIterableMap<K, V>
) => boolean = (
  key
) => (self) => self.delete(key)

/**
 * @since 1.0.0
 * @category elements
 */
export const entries: <K extends object, V>(
  self: WeakIterableMap<K, V>
) => IterableIterator<readonly [K, V]> = (self) => self.entries()

/**
 * @since 1.0.0
 * @category elements
 */
export const keys: <K extends object, V>(
  self: WeakIterableMap<K, V>
) => IterableIterator<K> = (self) => self.keys()

/**
 * @since 1.0.0
 * @category elements
 */
export const values: <K extends object, V>(
  self: WeakIterableMap<K, V>
) => IterableIterator<V> = (self) => self.values()

/**
 * @since 1.0.0
 * @category mutations
 */
export const set: <K extends object, V>(key: K, value: V) => (
  self: WeakIterableMap<K, V>
) => WeakIterableMap<K, V> = (key, value) => (self) => self.set(key, value)

/**
 * @since 1.0.0
 * @category constructors
 */
export const make: <K extends object, V>(
  iterable: Iterable<readonly [K, V]>
) => WeakIterableMap<K, V> = (iterable) => new ConcreteImpl(iterable)

class WeakImpl<K extends object, V> implements WeakIterableMap<K, V> {
  private readonly weakMap = new WeakMap<K, { value: V; ref: WeakRef<K> }>()
  private readonly refSet = new Set<WeakRef<K>>()
  private readonly finalizationGroup = new FinalizationRegistry<{
    ref: WeakRef<K>
    set: Set<WeakRef<K>>
  }>(WeakImpl.cleanup)

  private static cleanup<K extends object>({
    ref,
    set
  }: {
    ref: WeakRef<K>
    set: Set<WeakRef<K>>
  }) {
    set.delete(ref)
  }

  constructor(iterable: Iterable<readonly [K, V]>) {
    for (const [key, value] of iterable) {
      this.set(key, value)
    }
  }

  [Equal.symbol](that: unknown) {
    return this === that
  }

  [Hash.symbol]() {
    return Hash.random(this)
  }

  _K: (_: K) => K = identity
  _V: (_: V) => V = identity

  set(this: this, key: K, value: V): this {
    const ref = new WeakRef(key)

    this.weakMap.set(key, { value, ref })
    this.refSet.add(ref)
    this.finalizationGroup.register(
      key,
      {
        set: this.refSet,
        ref
      },
      ref
    )

    return this
  }

  get(this: this, key: K): V | undefined {
    const entry = this.weakMap.get(key)
    return entry && entry.value
  }

  delete(this: this, key: K): boolean {
    const entry = this.weakMap.get(key)
    if (!entry) {
      return false
    }

    this.weakMap.delete(key)
    this.refSet.delete(entry.ref)
    this.finalizationGroup.unregister(entry.ref)
    return true
  }

  [Symbol.iterator](this: this): IterableIterator<readonly [K, V]> {
    return this.entries()
  }

  *iterator(this: this): IterableIterator<readonly [K, V]> {
    for (const ref of this.refSet) {
      const key = ref.deref()
      if (!key) continue
      const { value } = this.weakMap.get(key)!
      yield [key, value]
    }
  }

  *entries(this: this): IterableIterator<readonly [K, V]> {
    for (const ref of this.refSet) {
      const key = ref.deref()
      if (!key) continue
      const { value } = this.weakMap.get(key)!
      yield [key, value]
    }
  }

  *keys(this: this): IterableIterator<K> {
    for (const [key] of this) {
      yield key
    }
  }

  *values(this: this): IterableIterator<V> {
    for (const [, value] of this) {
      yield value
    }
  }

  has(this: this, key: K) {
    return this.weakMap.has(key)
  }
}

class PlainImpl<K extends object, V> implements WeakIterableMap<K, V> {
  private readonly map = new Map<K, V>()

  constructor(iterable: Iterable<readonly [K, V]>) {
    this.map = new Map(iterable)
  }

  _K: (_: K) => K = identity
  _V: (_: V) => V = identity

  set(this: this, key: K, value: V): this {
    this.map.set(key, value)
    return this
  }

  get(this: this, key: K): V | undefined {
    return this.map.get(key)
  }

  delete(this: this, key: K): boolean {
    this.map.delete(key)
    return true
  }

  [Equal.symbol](that: unknown) {
    return this === that
  }

  [Hash.symbol]() {
    return Hash.random(this)
  }

  [Symbol.iterator](this: this): IterableIterator<readonly [K, V]> {
    return this.entries()
  }

  iterator(this: this): IterableIterator<readonly [K, V]> {
    return this.map[Symbol.iterator]()
  }

  entries(this: this): IterableIterator<readonly [K, V]> {
    return this.map.entries()
  }

  keys(this: this): IterableIterator<K> {
    return this.map.keys()
  }

  values(this: this): IterableIterator<V> {
    return this.map.values()
  }

  has(this: this, key: K) {
    return this.map.has(key)
  }
}

const ConcreteImpl: {
  new<K extends object, V>(iterable: Iterable<readonly [K, V]>): WeakIterableMap<K, V>
} = typeof FinalizationRegistry !== "undefined" ? WeakImpl : PlainImpl
