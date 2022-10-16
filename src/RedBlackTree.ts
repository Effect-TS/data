/**
 * @since 1.0.0
 */

import type { Sortable } from "@fp-ts/core/Sortable"
import type { Equal } from "@fp-ts/data/Equal"
import * as RBT from "@fp-ts/data/internal/RedBlackTree"
import * as RBTI from "@fp-ts/data/internal/RedBlackTree/iterator"
import type { List } from "@fp-ts/data/List"
import type { Option } from "@fp-ts/data/Option"

const TypeId: unique symbol = RBT.RedBlackTreeTypeId as TypeId

/**
 * @since 1.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * @since 1.0.0
 * @category constants
 */
export const Direction = RBTI.Direction

/**
 * A Red-Black Tree.
 *
 * @since 1.0.0
 * @category models
 */
export interface RedBlackTree<Key, Value> extends Iterable<readonly [Key, Value]>, Equal {
  readonly _id: TypeId
  readonly _Key: (_: never) => Key
  readonly _Value: (_: never) => Value
}

/**
 * @since 1.0.0
 */
export declare namespace RedBlackTree {
  export type Direction = number & {
    readonly Direction: unique symbol
  }
}

/**
 * @since 1.0.0
 * @category refinements
 */
export const isRedBlackTree: {
  <K, V>(u: Iterable<readonly [K, V]>): u is RedBlackTree<K, V>
  (u: unknown): u is RedBlackTree<unknown, unknown>
} = RBT.isRedBlackTree

/**
 * Creates an empty `RedBlackTree`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const empty: <K, V = never>(ord: Sortable<K>) => RedBlackTree<K, V> = RBT.empty

/**
 * Gets the `Ord<K>` that the `RedBlackTree<K, V>` is using.
 *
 * @since 1.0.0
 * @category getters
 */
export const getSortable: <K, V>(self: RedBlackTree<K, V>) => Sortable<K> = RBT.getSortable

/**
 * Constructs a new tree from an iterable of key-value pairs.
 *
 * @since 1.0.0
 * @category constructors
 */
export const from: <K, V>(
  ord: Sortable<K>
) => (
  entries: Iterable<readonly [K, V]>
) => RedBlackTree<K, V> = RBT.from

/**
 * Constructs a new `RedBlackTree` from the specified entries.
 *
 * @since 1.0.0
 * @category constructors
 */
export const make: <K, Entries extends Array<readonly [K, any]>>(
  ord: Sortable<K>
) => (
  ...entries: Entries
) => RedBlackTree<K, Entries[number] extends readonly [any, infer V] ? V : never> = RBT.make

/**
 * Get all the keys present in the tree.
 *
 * @since 1.0.0
 * @category getters
 */
export const keys: (
  direction?: RedBlackTree.Direction
) => <K, V>(
  self: RedBlackTree<K, V>
) => IterableIterator<K> = RBT.keys

/**
 * Get all values present in the tree.
 *
 * @since 1.0.0
 * @category getters
 */
export const values: (
  direction?: RedBlackTree.Direction
) => <K, V>(
  self: RedBlackTree<K, V>
) => IterableIterator<V> = RBT.values

/**
 * Returns the size of the tree.
 *
 * @since 1.0.0
 * @category getters
 */
export const size: <K, V>(self: RedBlackTree<K, V>) => number = RBT.size

/**
 * Returns the first entry in the tree, if it exists.
 *
 * @since 1.0.0
 * @category getters
 */
export const first: <K, V>(tree: RedBlackTree<K, V>) => Option<readonly [K, V]> = RBT.first

/**
 * Returns the last entry in the tree, if it exists.
 *
 * @since 1.0.0
 * @category getters
 */
export const last: <K, V>(tree: RedBlackTree<K, V>) => Option<readonly [K, V]> = RBT.last

/**
 * Finds the item with key, if it exists.
 *
 * @since 1.0.0
 * @category elements
 */
export const has: <K>(key: K) => <V>(self: RedBlackTree<K, V>) => boolean = RBT.has

/**
 * Returns the element at the specified index within the tree or `None` if the
 * specified index does not exist.
 *
 * @since 1.0.0
 * @category elements
 */
export const getAt: (
  index: number
) => <K, V>(
  self: RedBlackTree<K, V>
) => Option<readonly [K, V]> = RBT.getAt

/**
 * Finds all values in the tree associated with the specified key.
 *
 * @since 1.0.0
 * @category elements
 */
export const find: <K>(key: K) => <V>(self: RedBlackTree<K, V>) => List<V> = RBT.find

/**
 * Finds the value in the tree associated with the specified key, if it exists.
 *
 * @since 1.0.0
 * @category elements
 */
export const findFirst: <K>(key: K) => <V>(self: RedBlackTree<K, V>) => Option<V> = RBT.findFirst

/**
 * Insert a new item into the tree.
 *
 * @since 1.0.0
 * @category mutations
 */
export const insert: <K, V>(
  key: K,
  value: V
) => (
  self: RedBlackTree<K, V>
) => RedBlackTree<K, V> = RBT.insert

/**
 * Removes the entry with the specified key, if it exists.
 *
 * @since 1.0.0
 * @category mutations
 */
export const removeFirst: <K>(
  key: K
) => <V>(
  self: RedBlackTree<K, V>
) => RedBlackTree<K, V> = RBT.removeFirst

/**
 * Returns an iterator that points to the element at the spcified index of the
 * tree.
 *
 * @since 1.0.0
 * @category traversing
 */
export const at: (
  index: number,
  direction?: RedBlackTree.Direction
) => <K, V>(
  self: RedBlackTree<K, V>
) => Iterable<readonly [K, V]> = RBT.at

/**
 * Traverse the tree backwards.
 *
 * @since 1.0.0
 * @category traversing
 */
export const backwards: <K, V>(
  self: RedBlackTree<K, V>
) => Iterable<readonly [K, V]> = RBT.backwards

/**
 * Returns an iterator that traverse entries with keys greater than the
 * specified key.
 *
 * @since 1.0.0
 * @category traversing
 */
export const greaterThan: <K>(
  key: K,
  direction?: RedBlackTree.Direction
) => <V>(
  self: RedBlackTree<K, V>
) => Iterable<readonly [K, V]> = RBT.greaterThan

/**
 * Returns an iterator that traverse entries with keys greater than or equal to
 * the specified key.
 *
 * @since 1.0.0
 * @category traversing
 */
export const greaterThanEqual: <K>(
  key: K,
  direction?: RedBlackTree.Direction
) => <V>(
  self: RedBlackTree<K, V>
) => Iterable<readonly [K, V]> = RBT.greaterThanEqual

/**
 * Returns an iterator that traverse entries with keys less than the specified
 * key.
 *
 * @since 1.0.0
 * @category traversing
 */
export const lessThan: <K>(
  key: K,
  direction?: RedBlackTree.Direction
) => <V>(
  self: RedBlackTree<K, V>
) => Iterable<readonly [K, V]> = RBT.lessThan

/**
 * Returns an iterator that traverse entries with keys less than or equal to
 * the specified key.
 *
 * @since 1.0.0
 * @category traversing
 */
export const lessThanEqual: <K>(
  key: K,
  direction?: RedBlackTree.Direction
) => <V>(
  self: RedBlackTree<K, V>
) => Iterable<readonly [K, V]> = RBT.lessThanEqual

/**
 * Execute the specified function for each node of the tree, in order.
 *
 * @since 1.0.0
 * @category traversing
 */
export const forEach: <K, V>(
  f: (key: K, value: V) => void
) => (
  self: RedBlackTree<K, V>
) => void = RBT.forEach

/**
 * Visit each node of the tree in order with key greater then or equal to max.
 *
 * @since 1.0.0
 * @category traversing
 */
export const forEachGreaterThanEqual: <K, V>(
  min: K,
  f: (key: K, value: V) => void
) => (
  self: RedBlackTree<K, V>
) => void = RBT.forEachGreaterThanEqual

/**
 * Visit each node of the tree in order with key lower then max.
 *
 * @since 1.0.0
 * @category traversing
 */
export const forEachLessThan: <K, V>(
  max: K,
  f: (key: K, value: V) => void
) => (
  self: RedBlackTree<K, V>
) => void = RBT.forEachLessThan

/**
 * Visit each node of the tree in order with key lower than max and greater
 * than or equal to min.
 *
 * @since 1.0.0
 * @category traversing
 */
export const forEachBetween: <K, V>(
  min: K,
  max: K,
  f: (key: K, value: V) => void
) => (
  self: RedBlackTree<K, V>
) => void = RBT.forEachBetween

/**
 * Reduce a state over the map entries.
 *
 * @since 1.0.0
 * @category folding
 */
export const reduce: <Z, V>(
  zero: Z,
  f: (accumulator: Z, value: V) => Z
) => <K>(
  self: RedBlackTree<K, V>
) => Z = RBT.reduce

/**
 * Reduce a state over the entries of the tree.
 *
 * @since 1.0.0
 * @category folding
 */
export const reduceWithIndex: <Z, K, V>(
  zero: Z,
  f: (accumulator: Z, key: K, value: V) => Z
) => (
  self: RedBlackTree<K, V>
) => Z = RBT.reduceWithIndex
