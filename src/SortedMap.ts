/**
 * @since 1.0.0
 */
import * as Dual from "@effect/data/Dual"
import * as Equal from "@effect/data/Equal"
import * as Hash from "@effect/data/Hash"
import * as RBT from "@effect/data/RedBlackTree"
import { pipe } from "@fp-ts/core/Function"
import * as Option from "@fp-ts/core/Option"
import type { Order } from "@fp-ts/core/typeclass/Order"

const TypeId: unique symbol = Symbol.for("@effect/data/SortedMap")

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
    return pipe(Hash.hash(this.tree), Hash.combine(Hash.hash("@effect/data/SortedMap")))
  }

  [Equal.symbol](that: unknown): boolean {
    return isSortedMap(that) && Equal.equals(this.tree, that.tree)
  }

  [Symbol.iterator](): Iterator<readonly [K, V]> {
    return this.tree[Symbol.iterator]()
  }

  toString() {
    return `SortedMap(${Array.from(this).map(([k, v]) => `[${String(k)}, ${String(v)}]`).join(", ")})`
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
export const empty = <K, V = never>(ord: Order<K>): SortedMap<K, V> => new SortedMapImpl<K, V>(RBT.empty<K, V>(ord))

/**
 * @since 1.0.0
 * @category constructors
 */
export const fromIterable = <K>(ord: Order<K>) =>
  <V>(iterable: Iterable<readonly [K, V]>): SortedMap<K, V> => new SortedMapImpl(RBT.fromIterable<K, V>(ord)(iterable))

/**
 * @since 1.0.0
 * @category constructors
 */
export const make = <K>(ord: Order<K>) =>
  <Entries extends ReadonlyArray<readonly [K, any]>>(...entries: Entries): SortedMap<
    K,
    Entries[number] extends (readonly [any, infer V]) ? V : never
  > => fromIterable(ord)(entries)

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
export const entries = <K, V>(self: SortedMap<K, V>): Iterator<readonly [K, V]> => self[Symbol.iterator]()

/**
 * @since 1.0.0
 * @category elements
 */
export const get: {
  <K, V>(self: SortedMap<K, V>, key: K): Option.Option<V>
  <K>(key: K): <V>(self: SortedMap<K, V>) => Option.Option<V>
} = Dual.dual<
  <K, V>(self: SortedMap<K, V>, key: K) => Option.Option<V>,
  <K>(key: K) => <V>(self: SortedMap<K, V>) => Option.Option<V>
>(2, (self, key) => RBT.findFirst(self.tree, key))

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
export const has: {
  <K, V>(self: SortedMap<K, V>, key: K): boolean
  <K>(key: K): <V>(self: SortedMap<K, V>) => boolean
} = Dual.dual<
  <K, V>(self: SortedMap<K, V>, key: K) => boolean,
  <K>(key: K) => <V>(self: SortedMap<K, V>) => boolean
>(2, (self, key) => Option.isSome(get(self, key)))

/**
 * @since 1.0.0
 * @category elements
 */
export const headOption = <K, V>(self: SortedMap<K, V>): Option.Option<readonly [K, V]> => RBT.first(self.tree)

/**
 * @since 1.0.0
 * @category mapping
 */
export const map: {
  <K, A, B>(self: SortedMap<K, A>, f: (a: A) => B): SortedMap<K, B>
  <A, B>(f: (a: A) => B): <K>(self: SortedMap<K, A>) => SortedMap<K, B>
} = Dual.dual<
  <K, A, B>(self: SortedMap<K, A>, f: (a: A) => B) => SortedMap<K, B>,
  <A, B>(f: (a: A) => B) => <K>(self: SortedMap<K, A>) => SortedMap<K, B>
>(2, (self, f) => mapWithIndex(self, (a) => f(a)))

/**
 * @since 1.0.0
 * @category mapping
 */
export const mapWithIndex: {
  <K, A, B>(self: SortedMap<K, A>, f: (a: A, k: K) => B): SortedMap<K, B>
  <A, K, B>(f: (a: A, k: K) => B): (self: SortedMap<K, A>) => SortedMap<K, B>
} = Dual.dual<
  <K, A, B>(self: SortedMap<K, A>, f: (a: A, k: K) => B) => SortedMap<K, B>,
  <A, K, B>(f: (a: A, k: K) => B) => (self: SortedMap<K, A>) => SortedMap<K, B>
>(2, <K, A, B>(self: SortedMap<K, A>, f: (a: A, k: K) => B) =>
  reduceWithIndex(
    self,
    empty<K, B>(RBT.getOrder(self.tree)),
    (acc, v, k) => set(acc, k, f(v, k))
  ))

/**
 * @since 1.0.0
 * @category getters
 */
export const keys = <K, V>(self: SortedMap<K, V>): IterableIterator<K> => RBT.keys(self.tree)

/**
 * @since 1.0.0
 * @category folding
 */
export const reduce: {
  <K, V, B>(self: SortedMap<K, V>, zero: B, f: (accumulator: B, value: V) => B): B
  <V, B>(zero: B, f: (accumulator: B, value: V) => B): <K>(self: SortedMap<K, V>) => B
} = Dual.dual<
  <K, V, B>(self: SortedMap<K, V>, zero: B, f: (accumulator: B, value: V) => B) => B,
  <V, B>(zero: B, f: (accumulator: B, value: V) => B) => <K>(self: SortedMap<K, V>) => B
>(3, (self, zero, f) => RBT.reduce(self.tree, zero, f))

/**
 * @since 1.0.0
 * @category folding
 */
export const reduceWithIndex: {
  <K, A, B>(self: SortedMap<K, A>, zero: B, f: (acc: B, value: A, key: K) => B): B
  <B, A, K>(zero: B, f: (acc: B, value: A, key: K) => B): (self: SortedMap<K, A>) => B
} = Dual.dual<
  <K, A, B>(self: SortedMap<K, A>, zero: B, f: (acc: B, value: A, key: K) => B) => B,
  <B, A, K>(zero: B, f: (acc: B, value: A, key: K) => B) => (self: SortedMap<K, A>) => B
>(3, (self, zero, f) => RBT.reduceWithIndex(self.tree, zero, f))

/**
 * @since 1.0.0
 * @category elements
 */
export const remove: {
  <K, V>(self: SortedMap<K, V>, key: K): SortedMap<K, V>
  <K>(key: K): <V>(self: SortedMap<K, V>) => SortedMap<K, V>
} = Dual.dual<
  <K, V>(self: SortedMap<K, V>, key: K) => SortedMap<K, V>,
  <K>(key: K) => <V>(self: SortedMap<K, V>) => SortedMap<K, V>
>(2, (self, key) => new SortedMapImpl(RBT.removeFirst(self.tree, key)))

/**
 * @since 1.0.0
 * @category elements
 */
export const set: {
  <K, V>(self: SortedMap<K, V>, key: K, value: V): SortedMap<K, V>
  <K, V>(key: K, value: V): (self: SortedMap<K, V>) => SortedMap<K, V>
} = Dual.dual<
  <K, V>(self: SortedMap<K, V>, key: K, value: V) => SortedMap<K, V>,
  <K, V>(key: K, value: V) => (self: SortedMap<K, V>) => SortedMap<K, V>
>(3, (self, key, value) =>
  RBT.has(self.tree, key)
    ? new SortedMapImpl(RBT.insert(RBT.removeFirst(self.tree, key), key, value))
    : new SortedMapImpl(RBT.insert(self.tree, key, value)))

/**
 * @since 1.0.0
 * @category getters
 */
export const size = <K, V>(self: SortedMap<K, V>): number => RBT.size(self.tree)

/**
 * @since 1.0.0
 * @category getters
 */
export const values = <K, V>(self: SortedMap<K, V>): IterableIterator<V> => RBT.values(self.tree)
