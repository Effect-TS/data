/**
 * @since 1.0.0
 */

import { pipe } from "@fp-ts/core/Function"
import * as O from "@fp-ts/core/Option"
import type { Order } from "@fp-ts/core/typeclass/Order"
import * as Equal from "@fp-ts/data/Equal"
import * as Hash from "@fp-ts/data/Hash"
import * as RBT from "@fp-ts/data/RedBlackTree"

const TypeId: unique symbol = Symbol.for("@fp-ts/data/SortedMap")

/**
 * @since 1.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * @since 1.0.0
 * @category models
 */
export interface SortedMap<K, V> extends Iterable<readonly [K, V]>, Equal.Equal {
  readonly _id: TypeId
  /** @internal */
  readonly tree: RBT.RedBlackTree<K, V>
}

/** @internal */
class SortedMapImpl<K, V> implements Iterable<readonly [K, V]>, Equal.Equal {
  readonly _id: TypeId = TypeId

  constructor(readonly tree: RBT.RedBlackTree<K, V>) {}

  [Hash.symbol](): number {
    return pipe(Hash.hash(this.tree), Hash.combine(Hash.hash("@fp-ts/data/SortedMap")))
  }

  [Equal.symbol](that: unknown): boolean {
    return isSortedMap(that) && Equal.equals(this.tree, that.tree)
  }

  [Symbol.iterator](): Iterator<readonly [K, V]> {
    return this.tree[Symbol.iterator]()
  }

  toString() {
    return `SortedMap(${
      Array.from(this).map(([k, v]) => `[${String(k)}, ${String(v)}]`).join(", ")
    })`
  }

  toJSON() {
    return {
      _tag: "SortedMap",
      values: Array.from(this)
    }
  }

  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toJSON()
  }
}

/**
 * @since 1.0.0
 * @category refinements
 */
export const isSortedMap: {
  <K, V>(u: Iterable<readonly [K, V]>): u is SortedMap<K, V>
  (u: unknown): u is SortedMap<unknown, unknown>
} = (u: unknown): u is SortedMap<unknown, unknown> =>
  typeof u === "object" && u != null && "_id" in u && u["_id"] === TypeId

/**
 * @since 1.0.0
 * @category constructors
 */
export const empty = <K, V = never>(ord: Order<K>): SortedMap<K, V> =>
  new SortedMapImpl<K, V>(RBT.empty<K, V>(ord))

/**
 * @since 1.0.0
 * @category constructors
 */
export const from = <K>(ord: Order<K>) =>
  <V>(
    iterable: Iterable<readonly [K, V]>
  ): SortedMap<K, V> => new SortedMapImpl(RBT.from<K, V>(ord)(iterable))

/**
 * @since 1.0.0
 * @category constructors
 */
export const make = <K>(ord: Order<K>) =>
  <Entries extends ReadonlyArray<readonly [K, any]>>(...entries: Entries): SortedMap<
    K,
    Entries[number] extends (readonly [any, infer V]) ? V : never
  > => from(ord)(entries)

/**
 * @since 1.0.0
 * @category getters
 */
export const entries = <K, V>(self: SortedMap<K, V>): Iterator<readonly [K, V]> =>
  self[Symbol.iterator]()

/**
 * @since 1.0.0
 * @category elements
 */
export const get = <K>(key: K) =>
  <V>(self: SortedMap<K, V>): O.Option<V> => RBT.findFirst(key)(self.tree)

/**
 * Gets the `Order<K>` that the `SortedMap<K, V>` is using.
 *
 * @since 1.0.0
 * @category getters
 */
export const getOrder = <K, V>(self: SortedMap<K, V>): Order<K> => RBT.getOrder(self.tree)

/**
 * @since 1.0.0
 * @category elements
 */
export const set = <K, V>(key: K, value: V) =>
  (self: SortedMap<K, V>): SortedMap<K, V> => {
    if (RBT.has(key)(self.tree)) {
      return new SortedMapImpl(pipe(self.tree, RBT.removeFirst(key), RBT.insert(key, value)))
    } else {
      return new SortedMapImpl(RBT.insert(key, value)(self.tree))
    }
  }

/**
 * @since 1.0.0
 * @category elements
 */
export const remove = <K>(key: K) =>
  <V>(self: SortedMap<K, V>): SortedMap<K, V> => new SortedMapImpl(RBT.removeFirst(key)(self.tree))

/**
 * @since 1.0.0
 * @category elements
 */
export const has = <K>(key: K) => <V>(self: SortedMap<K, V>): boolean => O.isSome(get(key)(self))

/**
 * @since 1.0.0
 * @category elements
 */
export const headOption = <K, V>(self: SortedMap<K, V>): O.Option<readonly [K, V]> =>
  RBT.first(self.tree)

/**
 * @since 1.0.0
 * @category getters
 */
export const size = <K, V>(self: SortedMap<K, V>): number => RBT.size(self.tree)

/**
 * @since 1.0.0
 * @category predicates
 */
export const isEmpty = <K, V>(self: SortedMap<K, V>): boolean => size(self) === 0

/**
 * @since 1.0.0
 * @category predicates
 */
export const isNonEmpty = <K, V>(self: SortedMap<K, V>): boolean => size(self) > 0

/**
 * @since 1.0.0
 * @category getters
 */
export const keys = <K, V>(self: SortedMap<K, V>): IterableIterator<K> => RBT.keys()(self.tree)

/**
 * @since 1.0.0
 * @category getters
 */
export const values = <K, V>(self: SortedMap<K, V>): IterableIterator<V> => RBT.values()(self.tree)

/**
 * @since 1.0.0
 * @category folding
 */
export const reduce = <V, B>(zero: B, f: (accumulator: B, value: V) => B) =>
  <K>(self: SortedMap<K, V>): B => RBT.reduce(zero, f)(self.tree)

/**
 * @since 1.0.0
 * @category folding
 */
export const reduceWithIndex = <B, A, K>(b: B, f: (b: B, value: A, key: K) => B) =>
  (self: SortedMap<K, A>): B => RBT.reduceWithIndex(b, f)(self.tree)

/**
 * @since 1.0.0
 * @category mapping
 */
export const mapWithIndex = <A, K, B>(f: (a: A, k: K) => B) =>
  (self: SortedMap<K, A>): SortedMap<K, B> =>
    pipe(
      self,
      reduceWithIndex(empty<K, B>(RBT.getOrder(self.tree)), (b, v, k) => set(k, f(v, k))(b))
    )

/**
 * @since 1.0.0
 * @category mapping
 */
export const map = <A, B>(f: (a: A) => B) =>
  <K>(self: SortedMap<K, A>): SortedMap<K, B> => pipe(self, mapWithIndex(f))
