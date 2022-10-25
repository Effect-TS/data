/**
 * @since 1.0.0
 */

import type { Order } from "@fp-ts/core/typeclass/Order"
import * as Eq from "@fp-ts/data/Equal"
import { pipe } from "@fp-ts/data/Function"
import * as O from "@fp-ts/data/Option"
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
export interface SortedMap<K, V> extends Iterable<readonly [K, V]>, Eq.Equal {
  readonly _id: TypeId
  readonly _K: (_: never) => K
  readonly _V: (_: never) => V
  /** @internal */
  readonly tree: RBT.RedBlackTree<K, V>
}

/** @internal */
class SortedMapImpl<K, V> implements Iterable<readonly [K, V]>, Eq.Equal {
  readonly _id: TypeId = TypeId
  readonly _K: (_: never) => K = (_) => _
  readonly _V: (_: never) => V = (_) => _

  constructor(readonly tree: RBT.RedBlackTree<K, V>) {}

  [Eq.symbolHash](): number {
    return pipe(Eq.hash(this.tree), Eq.hashCombine(Eq.hash("@fp-ts/data/SortedMap")))
  }

  [Eq.symbolEqual](that: unknown): boolean {
    return isSortedMap(that) && Eq.equals(this.tree, that.tree)
  }

  [Symbol.iterator](): Iterator<readonly [K, V]> {
    return this.tree[Symbol.iterator]()
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
 * Gets the `Sortable<K>` that the `SortedMap<K, V>` is using.
 *
 * @since 1.0.0
 * @category getters
 */
export const getSortable = <K, V>(self: SortedMap<K, V>): Sortable<K> => RBT.getSortable(self.tree)

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
export const reduceWithIndex = <K, V, B>(zero: B, f: (accumulator: B, key: K, value: V) => B) =>
  (self: SortedMap<K, V>): B => RBT.reduceWithIndex(zero, f)(self.tree)

/**
 * @since 1.0.0
 * @category mapping
 */
export const mapWithIndex = <K, A, B>(f: (k: K, a: A) => B) =>
  (self: SortedMap<K, A>): SortedMap<K, B> =>
    pipe(
      self,
      reduceWithIndex(empty<K, B>(RBT.getOrder(self.tree)), (b, k, v) => set(k, f(k, v))(b))
    )

/**
 * @since 1.0.0
 * @category mapping
 */
export const map = <A, B>(f: (a: A) => B) =>
  <K>(self: SortedMap<K, A>): SortedMap<K, B> => pipe(self, mapWithIndex((_, v) => f(v)))
