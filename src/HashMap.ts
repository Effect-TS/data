/**
 * @since 1.0.0
 */

import type { Equal } from "@fp-ts/data/Equal"
import type { HashSet } from "@fp-ts/data/HashSet"
import * as HM from "@fp-ts/data/internal/HashMap"
import * as _keySet from "@fp-ts/data/internal/HashMap/keySet"
import type { Option } from "@fp-ts/data/Option"
import type { Predicate, Refinement } from "@fp-ts/data/Predicate"

const TypeId: unique symbol = HM.HashMapTypeId as TypeId

/**
 * @since 1.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * @since 1.0.0
 * @category models
 */
export interface HashMap<Key, Value> extends Iterable<readonly [Key, Value]>, Equal {
  readonly _id: TypeId
}

/**
 * @since 1.0.0
 * @category refinements
 */
export const isHashMap: {
  <K, V>(u: Iterable<readonly [K, V]>): u is HashMap<K, V>
  (u: unknown): u is HashMap<unknown, unknown>
} = HM.isHashMap

/**
 * Creates a new `HashMap`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const empty: <K = never, V = never>() => HashMap<K, V> = HM.empty

/**
 * Constructs a new `HashMap` from an array of key/value pairs.
 *
 * @since 1.0.0
 * @category constructors
 */
export const make: <Entries extends ReadonlyArray<readonly [any, any]>>(
  ...entries: Entries
) => HashMap<
  Entries[number] extends readonly [infer K, any] ? K : never,
  Entries[number] extends readonly [any, infer V] ? V : never
> = HM.make

/**
 * Constructs a new `HashMap` from an array of key/value pairs.
 *
 * @since 1.0.0
 * @category constructors
 */
export const from: <K, V>(entries: Iterable<readonly [K, V]>) => HashMap<K, V> = HM.from

/**
 * Checks if the `HashMap` contains any entries.
 *
 * @since 1.0.0
 * @category elements
 */
export const isEmpty: <K, V>(self: HashMap<K, V>) => boolean = HM.isEmpty

/**
 * Safely lookup the value for the specified key in the `HashMap` using the
 * internal hashing function.
 *
 * @since 1.0.0
 * @category elements
 */
export const get: <K, V>(key: K) => (self: HashMap<K, V>) => Option<V> = HM.get

/**
 * Lookup the value for the specified key in the `HashMap` using a custom hash.
 *
 * @since 1.0.0
 * @category elements
 */
export const getHash: <K, V>(key: K, hash: number) => (
  self: HashMap<K, V>
) => Option<V> = HM.getHash

/**
 * Unsafely lookup the value for the specified key in the `HashMap` using the
 * internal hashing function.
 *
 * @since 1.0.0
 * @category unsafe
 */
export const unsafeGet: <K, V>(key: K) => (self: HashMap<K, V>) => V = HM.unsafeGet

/**
 * Checks if the specified key has an entry in the `HashMap`.
 *
 * @since 1.0.0
 * @category elements
 */
export const has: <K, V>(key: K) => (self: HashMap<K, V>) => boolean = HM.has

/**
 * Checks if the specified key has an entry in the `HashMap` using a custom
 * hash.
 *
 * @since 1.0.0
 * @category elements
 */
export const hasHash: <K, V>(key: K, hash: number) => (self: HashMap<K, V>) => boolean = HM.hasHash

/**
 * Sets the specified key to the specified value using the internal hashing
 * function.
 *
 * @since 1.0.0
 * @category mutations
 */
export const set: <K, V>(key: K, value: V) => (self: HashMap<K, V>) => HashMap<K, V> = HM.set

/**
 * Returns an `IterableIterator` of the keys within the `HashMap`.
 *
 * @since 1.0.0
 * @category getters
 */
export const keys: <K, V>(self: HashMap<K, V>) => IterableIterator<K> = HM.keys

/**
 * Returns a `HashSet` of keys within the `HashMap`.
 *
 * @since 1.0.0
 * @category getter
 */
export const keySet: <K, V>(self: HashMap<K, V>) => HashSet<K> = _keySet.keySet

/**
 * Returns an `IterableIterator` of the values within the `HashMap`.
 *
 * @since 1.0.0
 * @category getters
 */
export const values: <K, V>(self: HashMap<K, V>) => IterableIterator<V> = HM.values

/**
 * Returns the number of entries within the `HashMap`.
 *
 * @since 1.0.0
 * @category getters
 */
export const size: <K, V>(self: HashMap<K, V>) => number = HM.size

/**
 * Marks the `HashMap` as mutable.
 *
 * @since 1.0.0
 * @category mutations
 */
export const beginMutation: <K, V>(self: HashMap<K, V>) => HashMap<K, V> = HM.beginMutation

/**
 * Marks the `HashMap` as immutable.
 *
 * @since 1.0.0
 * @category mutations
 */
export const endMutation: <K, V>(self: HashMap<K, V>) => HashMap<K, V> = HM.endMutation

/**
 * Mutates the `HashMap` within the context of the provided function.
 *
 * @since 1.0.0
 * @category mutations
 */
export const mutate: <K, V>(
  f: (self: HashMap<K, V>) => void
) => (
  self: HashMap<K, V>
) => HashMap<K, V> = HM.mutate

/**
 * Alter the value of the specified key in the `HashMap` using the specified
 * update function. The value of the specified key will be computed using the
 * provided hash.
 *
 * The update function will be invoked with the current value of the key if it
 * exists, or `None` if no such value exists.
 *
 * This function will always either update or insert a value into the `HashMap`.
 *
 * @since 1.0.0
 * @category mutations
 */
export const modify: <K, V>(
  key: K,
  f: (v: Option<V>) => Option<V>
) => (
  self: HashMap<K, V>
) => HashMap<K, V> = HM.modify

/**
 * Alter the value of the specified key in the `HashMap` using the specified
 * update function. The value of the specified key will be computed using the
 * provided hash.
 *
 * The update function will be invoked with the current value of the key if it
 * exists, or `None` if no such value exists.
 *
 * This function will always either update or insert a value into the `HashMap`.
 *
 * @since 1.0.0
 * @category mutations
 */
export const modifyHash: <K, V>(
  key: K,
  hash: number,
  f: (v: Option<V>) => Option<V>
) => (
  self: HashMap<K, V>
) => HashMap<K, V> = HM.modifyHash

/**
 * Updates the value of the specified key within the `HashMap` if it exists.
 *
 * @since 1.0.0
 * @category mutations
 */
export const update: <K, V>(
  key: K,
  f: (v: V) => V
) => (
  self: HashMap<K, V>
) => HashMap<K, V> = HM.update

/**
 * Performs a union of this `HashMap` and that `HashMap`.
 *
 * @since 1.0.0
 * @category mutations
 */
export const union: <K1, V1>(
  that: HashMap<K1, V1>
) => <K0, V0>(
  self: HashMap<K0, V0>
) => HashMap<K1 | K0, V1 | V0> = HM.union

/**
 * Remove the entry for the specified key in the `HashMap` using the internal
 * hashing function.
 *
 * @since 1.0.0
 * @category mutations
 */
export const remove: <K>(key: K) => <V>(self: HashMap<K, V>) => HashMap<K, V> = HM.remove

/**
 * Removes all entries in the `HashMap` which have the specified keys.
 *
 * @since 1.0.0
 * @category mutations
 */
export const removeMany: <K>(
  keys: Iterable<K>
) => <V>(
  self: HashMap<K, V>
) => HashMap<K, V> = HM.removeMany

/**
 * Maps over the values of the `HashMap` using the specified function.
 *
 * @since 1.0.0
 * @category mapping
 */
export const map: <V, A>(f: (value: V) => A) => <K>(self: HashMap<K, V>) => HashMap<K, A> = HM.map

/**
 * Maps over the entries of the `HashMap` using the specified function.
 *
 * @since 1.0.0
 * @category mapping
 */
export const mapWithIndex: <A, K, B>(
  f: (a: A, k: K) => B
) => (self: HashMap<K, A>) => HashMap<K, B> = HM.mapWithIndex

/**
 * Chains over the values of the `HashMap` using the specified function.
 *
 * **NOTE**: the hash and equal of both maps have to be the same.
 *
 * @since 1.0.0
 * @category sequencing
 */
export const flatMap: <K, A, B>(
  f: (value: A) => HashMap<K, B>
) => (
  self: HashMap<K, A>
) => HashMap<K, B> = HM.flatMap

/**
 * Chains over the entries of the `HashMap` using the specified function.
 *
 * **NOTE**: the hash and equal of both maps have to be the same.
 *
 * @since 1.0.0
 * @category sequencing
 */
export const flatMapWithIndex: <A, K, B>(
  f: (a: A, k: K) => HashMap<K, B>
) => (
  self: HashMap<K, A>
) => HashMap<K, B> = HM.flatMapWithIndex

/**
 * Applies the specified function to the values of the `HashMap`.
 *
 * @since 1.0.0
 * @category traversing
 */
export const forEach: <V>(f: (value: V) => void) => <K>(self: HashMap<K, V>) => void = HM.forEach

/**
 * Applies the specified function to the entries of the `HashMap`.
 *
 * @since 1.0.0
 * @category traversing
 */
export const forEachWithIndex: <A, K>(
  f: (a: A, k: K) => void
) => (
  self: HashMap<K, A>
) => void = HM.forEachWithIndex

/**
 * Reduces the specified state over the values of the `HashMap`.
 *
 * @since 1.0.0
 * @category folding
 */
export const reduce: <V, Z>(z: Z, f: (z: Z, v: V) => Z) => <K>(self: HashMap<K, V>) => Z = HM.reduce

/**
 * Reduces the specified state over the entries of the `HashMap`.
 *
 * @since 1.0.0
 * @category folding
 */
export const reduceWithIndex: <B, A, K>(
  b: B,
  f: (b: B, a: A, k: K) => B
) => (
  self: HashMap<K, A>
) => B = HM.reduceWithIndex

/**
 * Filters entries out of a `HashMap` using the specified predicate.
 *
 * @since 1.0.0
 * @category filtering
 */
export const filter: {
  <A, B extends A>(f: Refinement<A, B>): <K>(self: HashMap<K, A>) => HashMap<K, B>
  <A>(f: Predicate<A>): <K>(self: HashMap<K, A>) => HashMap<K, A>
} = HM.filter

/**
 * Filters entries out of a `HashMap` using the specified predicate.
 *
 * @since 1.0.0
 * @category filtering
 */
export const filterWithIndex: {
  <A, B extends A, K>(f: (a: A, k: K) => a is B): (self: HashMap<K, A>) => HashMap<K, B>
  <A, K>(f: (a: A, k: K) => boolean): (self: HashMap<K, A>) => HashMap<K, A>
} = HM.filterWithIndex

/**
 * Filters out `None` values from a `HashMap` of `Options`s.
 *
 * @since 1.0.0
 * @category filtering
 */
export const compact: <K, A>(self: HashMap<K, Option<A>>) => HashMap<K, A> = HM.compact

/**
 * Maps over the values of the `HashMap` using the specified partial function
 * and filters out `None` values.
 *
 * @since 1.0.0
 * @category filtering
 */
export const filterMap: <A, B>(
  f: (value: A) => Option<B>
) => <K>(
  self: HashMap<K, A>
) => HashMap<K, B> = HM.filterMap

/**
 * Maps over the entries of the `HashMap` using the specified partial function
 * and filters out `None` values.
 *
 * @since 1.0.0
 * @category filtering
 */
export const filterMapWithIndex: <A, K, B>(
  f: (a: A, k: K) => Option<B>
) => (
  self: HashMap<K, A>
) => HashMap<K, B> = HM.filterMapWithIndex
