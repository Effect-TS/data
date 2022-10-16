/**
 * @since 1.0.0
 */
import * as Equal from "@fp-ts/data/Equal"
import { pipe } from "@fp-ts/data/Function"
import * as Hash from "@fp-ts/data/Hash"
import * as O from "@fp-ts/data/Option"
import type { Option } from "@fp-ts/data/Option"

const TypeId: unique symbol = Symbol.for("@fp-ts/data/MutableHashMap") as TypeId

/**
 * @since 1.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/** @internal */
class Node<K, V> implements Iterable<readonly [K, V]> {
  constructor(readonly k: K, public v: V, public next?: Node<K, V>) {}

  [Symbol.iterator](): Iterator<readonly [K, V]> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let c: Node<K, V> | undefined = this
    let n = 0
    return {
      next: () => {
        if (c) {
          const kv = [c.k, c.v] as const
          c = c.next
          n++
          return {
            value: kv,
            done: false
          }
        } else {
          return {
            value: n,
            done: true
          }
        }
      }
    }
  }
}

/**
 * @since 1.0.0
 * @category models
 */
export interface MutableHashMap<K, V> extends Iterable<readonly [K, V]>, Equal.Equal {
  readonly _id: TypeId

  readonly _K: (_: K) => K
  readonly _V: (_: never) => V

  /** @internal */
  readonly backingMap: Map<number, Node<K, V>>
  /** @internal */
  length: number
}

/** @internal */
class MutableHashMapImpl<K, V> implements MutableHashMap<K, V> {
  readonly _id: TypeId = TypeId

  readonly _K: (_: K) => K = (_) => _
  readonly _V: (_: never) => V = (_) => _

  readonly backingMap = new Map<number, Node<K, V>>()
  length = 0;

  [Hash.Hash.symbol]() {
    return Hash.random(this)
  }

  [Equal.Equal.symbol](that: unknown) {
    return this === that
  }

  [Symbol.iterator](): Iterator<readonly [K, V]> {
    return Array.from(this.backingMap.values())
      .map((node) => [node.k, node.v] as const)[Symbol.iterator]()
  }
}

/**
 * @since 1.0.0
 * @category elements
 */
export const get = <K>(k: K) =>
  <V>(self: MutableHashMap<K, V>): Option<V> => {
    const hash = Hash.evaluate(k)
    const arr = self.backingMap.get(hash)

    if (arr == null) {
      return O.none
    }

    let c: Node<K, V> | undefined = arr

    while (c) {
      if (Equal.equals(k, c.k)) {
        return O.some(c.v)
      }
      c = c.next
    }

    return O.none
  }

/**
 * @since 1.0.0
 * @category elements
 */
export const has = <K>(k: K) =>
  <V>(self: MutableHashMap<K, V>): boolean =>
    pipe(
      self,
      get(k),
      O.isSome
    )

/**
 * @since 1.0.0
 * @category elements
 */
export const size = <K, V>(self: MutableHashMap<K, V>): number => {
  return self.length
}

/**
 * @since 1.0.0
 * @category mutations
 */
export const update = <K, V>(k: K, f: (v: V) => V) =>
  (self: MutableHashMap<K, V>): MutableHashMap<K, V> => {
    const hash = Hash.evaluate(k)
    const arr = self.backingMap.get(hash)

    if (arr == null) {
      return self
    }

    let c: Node<K, V> | undefined = arr

    while (c) {
      if (Equal.equals(k, c.k)) {
        c.v = f(c.v)
        return self
      }
      c = c.next
    }

    return self
  }

/**
 * @since 1.0.0
 * @category mutations
 */
export const set = <K, V>(k: K, v: V) =>
  (self: MutableHashMap<K, V>): MutableHashMap<K, V> => {
    const hash = Hash.evaluate(k)
    const arr = self.backingMap.get(hash)

    if (arr == null) {
      self.backingMap.set(hash, new Node(k, v))
      self.length = self.length + 1
      return self
    }

    let c: Node<K, V> | undefined = arr
    let l = arr

    while (c) {
      if (Equal.equals(k, c.k)) {
        c.v = v
        return self
      }
      l = c
      c = c.next
    }

    self.length = self.length + 1
    l.next = new Node(k, v)
    return self
  }

/**
 * @since 1.0.0
 * @category mutations
 */
export const modify = <K, V>(key: K, f: (value: Option<V>) => Option<V>) =>
  (self: MutableHashMap<K, V>) => {
    const result = f(pipe(self, get(key)))
    if (O.isSome(result)) {
      pipe(self, set(key, result.value))
    } else {
      pipe(self, remove(key))
    }
    return self
  }

/**
 * @since 1.0.0
 * @category mutations
 */
export const remove = <K>(k: K) =>
  <V>(self: MutableHashMap<K, V>): MutableHashMap<K, V> => {
    const hash = Hash.evaluate(k)
    const arr = self.backingMap.get(hash)

    if (arr == null) {
      return self
    }

    if (Equal.equals(k, arr.k)) {
      if (arr.next != null) {
        self.backingMap.set(hash, arr.next)
      } else {
        self.backingMap.delete(hash)
      }
      self.length = self.length - 1
      return self
    }

    let next: Node<K, V> | undefined = arr.next
    let curr = arr

    while (next) {
      if (Equal.equals(k, next.k)) {
        curr.next = next.next
        self.length = self.length - 1
        return self
      }
      curr = next
      next = next.next
    }

    return self
  }

/**
 * @since 1.0.0
 * @category constructors
 */
export const empty = <K = never, V = never>(): MutableHashMap<K, V> =>
  new MutableHashMapImpl<K, V>()

/**
 * @since 1.0.0
 * @category constructors
 */
export const make: <Entries extends Array<readonly [any, any]>>(
  ...entries: Entries
) => MutableHashMap<
  Entries[number] extends readonly [infer K, any] ? K : never,
  Entries[number] extends readonly [any, infer V] ? V : never
> = (...entries) => fromIterable(entries)

/**
 * @since 1.0.0
 * @category constructors
 */
export const MutableHashMap: <Entries extends Array<readonly [any, any]>>(
  ...entries: Entries
) => MutableHashMap<
  Entries[number] extends readonly [infer K, any] ? K : never,
  Entries[number] extends readonly [any, infer V] ? V : never
> = make

/**
 * @since 1.0.0
 * @category conversions
 */
export const fromIterable = <K, V>(
  entries: Iterable<readonly [K, V]>
): MutableHashMap<K, V> => {
  const map = empty<K, V>()

  for (const entry of entries) {
    pipe(map, set(entry[0], entry[1]))
  }

  return map
}
