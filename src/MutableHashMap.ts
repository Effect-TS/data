/**
 * @since 1.0.0
 */
import * as Equal from "@effect/data/Equal"
import * as Dual from "@effect/data/Function"
import * as Hash from "@effect/data/Hash"
import * as Option from "@effect/data/Option"

const TypeId: unique symbol = Symbol.for("@effect/data/MutableHashMap") as TypeId

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
export interface MutableHashMap<K, V> extends Iterable<readonly [K, V]> {
  readonly _id: TypeId

  /** @internal */
  readonly backingMap: Map<number, Node<K, V>>
  /** @internal */
  length: number
}

/** @internal */
class MutableHashMapImpl<K, V> implements MutableHashMap<K, V> {
  readonly _id: TypeId = TypeId

  readonly backingMap = new Map<number, Node<K, V>>()

  length = 0;

  [Symbol.iterator](): Iterator<readonly [K, V]> {
    return Array.from(this.backingMap.values())
      .flatMap((node) => {
        const arr = [[node.k, node.v] as const]
        let next = node.next
        while (next) {
          arr.push([next.k, next.v])
          next = next.next
        }
        return arr
      })[Symbol.iterator]()
  }

  toString() {
    return `MutableHashMap(${Array.from(this).map(([k, v]) => `[${String(k)}, ${String(v)}]`).join(", ")})`
  }

  toJSON() {
    return {
      _tag: "MutableHashMap",
      values: Array.from(this)
    }
  }

  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toJSON()
  }
}

/**
 * @since 1.0.0
 * @category constructors
 */
export const empty = <K = never, V = never>(): MutableHashMap<K, V> => new MutableHashMapImpl<K, V>()

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
 * @category conversions
 */
export const fromIterable = <K, V>(entries: Iterable<readonly [K, V]>): MutableHashMap<K, V> => {
  const map = empty<K, V>()
  for (const entry of entries) {
    set(map, entry[0], entry[1])
  }
  return map
}

/**
 * @since 1.0.0
 * @category elements
 */
export const get: {
  <K>(key: K): <V>(self: MutableHashMap<K, V>) => Option.Option<V>
  <K, V>(self: MutableHashMap<K, V>, key: K): Option.Option<V>
} = Dual.dual<
  <K>(key: K) => <V>(self: MutableHashMap<K, V>) => Option.Option<V>,
  <K, V>(self: MutableHashMap<K, V>, key: K) => Option.Option<V>
>(2, <K, V>(self: MutableHashMap<K, V>, key: K) => {
  const hash = Hash.hash(key)
  const arr = self.backingMap.get(hash)
  if (arr === undefined) {
    return Option.none()
  }
  let c: Node<K, V> | undefined = arr
  while (c !== undefined) {
    if (Equal.equals(key, c.k)) {
      return Option.some(c.v)
    }
    c = c.next
  }
  return Option.none()
})

/**
 * @since 1.0.0
 * @category elements
 */
export const has: {
  <K>(key: K): <V>(self: MutableHashMap<K, V>) => boolean
  <K, V>(self: MutableHashMap<K, V>, key: K): boolean
} = Dual.dual<
  <K>(key: K) => <V>(self: MutableHashMap<K, V>) => boolean,
  <K, V>(self: MutableHashMap<K, V>, key: K) => boolean
>(2, (self, key) => Option.isSome(get(self, key)))

/**
 * Updates the value of the specified key within the `MutableHashMap` if it exists.
 *
 * @since 1.0.0
 * @category mutations
 */
export const modify: {
  <K, V>(key: K, f: (v: V) => V): (self: MutableHashMap<K, V>) => MutableHashMap<K, V>
  <K, V>(self: MutableHashMap<K, V>, key: K, f: (v: V) => V): MutableHashMap<K, V>
} = Dual.dual<
  <K, V>(key: K, f: (v: V) => V) => (self: MutableHashMap<K, V>) => MutableHashMap<K, V>,
  <K, V>(self: MutableHashMap<K, V>, key: K, f: (v: V) => V) => MutableHashMap<K, V>
>(3, <K, V>(self: MutableHashMap<K, V>, key: K, f: (v: V) => V) => {
  const hash = Hash.hash(key)
  const arr = self.backingMap.get(hash)
  if (arr === undefined) {
    return self
  }
  let c: Node<K, V> | undefined = arr
  while (c !== undefined) {
    if (Equal.equals(key, c.k)) {
      c.v = f(c.v)
      return self
    }
    c = c.next
  }
  return self
})

/**
 * Set or remove the specified key in the `MutableHashMap` using the specified
 * update function.
 *
 * @since 1.0.0
 * @category mutations
 */
export const modifyAt: {
  <K, V>(key: K, f: (value: Option.Option<V>) => Option.Option<V>): (self: MutableHashMap<K, V>) => MutableHashMap<K, V>
  <K, V>(self: MutableHashMap<K, V>, key: K, f: (value: Option.Option<V>) => Option.Option<V>): MutableHashMap<K, V>
} = Dual.dual<
  <K, V>(
    key: K,
    f: (value: Option.Option<V>) => Option.Option<V>
  ) => (self: MutableHashMap<K, V>) => MutableHashMap<K, V>,
  <K, V>(
    self: MutableHashMap<K, V>,
    key: K,
    f: (value: Option.Option<V>) => Option.Option<V>
  ) => MutableHashMap<K, V>
>(3, (self, key, f) => {
  const result = f(get(self, key))
  if (Option.isSome(result)) {
    set(self, key, result.value)
  } else {
    remove(self, key)
  }
  return self
})

/**
 * @since 1.0.0
 * @category mutations
 */
export const remove: {
  <K>(key: K): <V>(self: MutableHashMap<K, V>) => MutableHashMap<K, V>
  <K, V>(self: MutableHashMap<K, V>, key: K): MutableHashMap<K, V>
} = Dual.dual<
  <K>(key: K) => <V>(self: MutableHashMap<K, V>) => MutableHashMap<K, V>,
  <K, V>(self: MutableHashMap<K, V>, key: K) => MutableHashMap<K, V>
>(2, <K, V>(self: MutableHashMap<K, V>, key: K) => {
  const hash = Hash.hash(key)
  const arr = self.backingMap.get(hash)
  if (arr === undefined) {
    return self
  }
  if (Equal.equals(key, arr.k)) {
    if (arr.next !== undefined) {
      self.backingMap.set(hash, arr.next)
    } else {
      self.backingMap.delete(hash)
    }
    self.length = self.length - 1
    return self
  }
  let next: Node<K, V> | undefined = arr.next
  let curr = arr
  while (next !== undefined) {
    if (Equal.equals(key, next.k)) {
      curr.next = next.next
      self.length = self.length - 1
      return self
    }
    curr = next
    next = next.next
  }
  return self
})

/**
 * @since 1.0.0
 * @category mutations
 */
export const set: {
  <K, V>(key: K, value: V): (self: MutableHashMap<K, V>) => MutableHashMap<K, V>
  <K, V>(self: MutableHashMap<K, V>, key: K, value: V): MutableHashMap<K, V>
} = Dual.dual<
  <K, V>(key: K, value: V) => (self: MutableHashMap<K, V>) => MutableHashMap<K, V>,
  <K, V>(self: MutableHashMap<K, V>, key: K, value: V) => MutableHashMap<K, V>
>(3, <K, V>(self: MutableHashMap<K, V>, key: K, value: V) => {
  const hash = Hash.hash(key)
  const arr = self.backingMap.get(hash)
  if (arr === undefined) {
    self.backingMap.set(hash, new Node(key, value))
    self.length = self.length + 1
    return self
  }
  let c: Node<K, V> | undefined = arr
  let l = arr
  while (c !== undefined) {
    if (Equal.equals(key, c.k)) {
      c.v = value
      return self
    }
    l = c
    c = c.next
  }
  self.length = self.length + 1
  l.next = new Node(key, value)
  return self
})

/**
 * @since 1.0.0
 * @category elements
 */
export const size = <K, V>(self: MutableHashMap<K, V>): number => self.length
