---
title: RedBlackTree.ts
nav_order: 28
parent: Modules
---

## RedBlackTree overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constants](#constants)
  - [Direction](#direction)
- [constructors](#constructors)
  - [empty](#empty)
  - [from](#from)
  - [make](#make)
- [elements](#elements)
  - [find](#find)
  - [findFirst](#findfirst)
  - [getAt](#getat)
  - [has](#has)
- [folding](#folding)
  - [reduce](#reduce)
  - [reduceWithIndex](#reducewithindex)
- [getters](#getters)
  - [first](#first)
  - [getSortable](#getsortable)
  - [keys](#keys)
  - [last](#last)
  - [size](#size)
  - [values](#values)
- [models](#models)
  - [RedBlackTree (interface)](#redblacktree-interface)
- [mutations](#mutations)
  - [insert](#insert)
  - [removeFirst](#removefirst)
- [refinements](#refinements)
  - [isRedBlackTree](#isredblacktree)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)
- [traversing](#traversing)
  - [at](#at)
  - [backwards](#backwards)
  - [forEach](#foreach)
  - [forEachBetween](#foreachbetween)
  - [forEachGreaterThanEqual](#foreachgreaterthanequal)
  - [forEachLessThan](#foreachlessthan)
  - [greaterThan](#greaterthan)
  - [greaterThanEqual](#greaterthanequal)
  - [lessThan](#lessthan)
  - [lessThanEqual](#lessthanequal)

---

# constants

## Direction

**Signature**

```ts
export declare const Direction: { readonly Forward: RedBlackTree.Direction; readonly Backward: RedBlackTree.Direction }
```

Added in v1.0.0

# constructors

## empty

Creates an empty `RedBlackTree`.

**Signature**

```ts
export declare const empty: <K, V = never>(ord: Sortable<K>) => RedBlackTree<K, V>
```

Added in v1.0.0

## from

Constructs a new tree from an iterable of key-value pairs.

**Signature**

```ts
export declare const from: <K, V>(ord: Sortable<K>) => (entries: Iterable<readonly [K, V]>) => RedBlackTree<K, V>
```

Added in v1.0.0

## make

Constructs a new `RedBlackTree` from the specified entries.

**Signature**

```ts
export declare const make: <K, Entries extends (readonly [K, any])[]>(
  ord: Sortable<K>
) => (...entries: Entries) => RedBlackTree<K, Entries[number] extends readonly [any, infer V] ? V : never>
```

Added in v1.0.0

# elements

## find

Finds all values in the tree associated with the specified key.

**Signature**

```ts
export declare const find: <K>(key: K) => <V>(self: RedBlackTree<K, V>) => List<V>
```

Added in v1.0.0

## findFirst

Finds the value in the tree associated with the specified key, if it exists.

**Signature**

```ts
export declare const findFirst: <K>(key: K) => <V>(self: RedBlackTree<K, V>) => Option<V>
```

Added in v1.0.0

## getAt

Returns the element at the specified index within the tree or `None` if the
specified index does not exist.

**Signature**

```ts
export declare const getAt: (index: number) => <K, V>(self: RedBlackTree<K, V>) => Option<readonly [K, V]>
```

Added in v1.0.0

## has

Finds the item with key, if it exists.

**Signature**

```ts
export declare const has: <K>(key: K) => <V>(self: RedBlackTree<K, V>) => boolean
```

Added in v1.0.0

# folding

## reduce

Reduce a state over the map entries.

**Signature**

```ts
export declare const reduce: <Z, V>(zero: Z, f: (accumulator: Z, value: V) => Z) => <K>(self: RedBlackTree<K, V>) => Z
```

Added in v1.0.0

## reduceWithIndex

Reduce a state over the entries of the tree.

**Signature**

```ts
export declare const reduceWithIndex: <Z, K, V>(
  zero: Z,
  f: (accumulator: Z, key: K, value: V) => Z
) => (self: RedBlackTree<K, V>) => Z
```

Added in v1.0.0

# getters

## first

Returns the first entry in the tree, if it exists.

**Signature**

```ts
export declare const first: <K, V>(tree: RedBlackTree<K, V>) => Option<readonly [K, V]>
```

Added in v1.0.0

## getSortable

Gets the `Ord<K>` that the `RedBlackTree<K, V>` is using.

**Signature**

```ts
export declare const getSortable: <K, V>(self: RedBlackTree<K, V>) => Sortable<K>
```

Added in v1.0.0

## keys

Get all the keys present in the tree.

**Signature**

```ts
export declare const keys: (
  direction?: RedBlackTree.Direction | undefined
) => <K, V>(self: RedBlackTree<K, V>) => IterableIterator<K>
```

Added in v1.0.0

## last

Returns the last entry in the tree, if it exists.

**Signature**

```ts
export declare const last: <K, V>(tree: RedBlackTree<K, V>) => Option<readonly [K, V]>
```

Added in v1.0.0

## size

Returns the size of the tree.

**Signature**

```ts
export declare const size: <K, V>(self: RedBlackTree<K, V>) => number
```

Added in v1.0.0

## values

Get all values present in the tree.

**Signature**

```ts
export declare const values: (
  direction?: RedBlackTree.Direction | undefined
) => <K, V>(self: RedBlackTree<K, V>) => IterableIterator<V>
```

Added in v1.0.0

# models

## RedBlackTree (interface)

A Red-Black Tree.

**Signature**

```ts
export interface RedBlackTree<Key, Value> extends Iterable<readonly [Key, Value]>, Equal {
  readonly _id: TypeId
  readonly _Key: (_: never) => Key
  readonly _Value: (_: never) => Value
}
```

Added in v1.0.0

# mutations

## insert

Insert a new item into the tree.

**Signature**

```ts
export declare const insert: <K, V>(key: K, value: V) => (self: RedBlackTree<K, V>) => RedBlackTree<K, V>
```

Added in v1.0.0

## removeFirst

Removes the entry with the specified key, if it exists.

**Signature**

```ts
export declare const removeFirst: <K>(key: K) => <V>(self: RedBlackTree<K, V>) => RedBlackTree<K, V>
```

Added in v1.0.0

# refinements

## isRedBlackTree

**Signature**

```ts
export declare const isRedBlackTree: {
  <K, V>(u: Iterable<readonly [K, V]>): u is RedBlackTree<K, V>
  (u: unknown): u is RedBlackTree<unknown, unknown>
}
```

Added in v1.0.0

# symbol

## TypeId (type alias)

**Signature**

```ts
export type TypeId = typeof TypeId
```

Added in v1.0.0

# traversing

## at

Returns an iterator that points to the element at the spcified index of the
tree.

**Signature**

```ts
export declare const at: (
  index: number,
  direction?: RedBlackTree.Direction | undefined
) => <K, V>(self: RedBlackTree<K, V>) => Iterable<readonly [K, V]>
```

Added in v1.0.0

## backwards

Traverse the tree backwards.

**Signature**

```ts
export declare const backwards: <K, V>(self: RedBlackTree<K, V>) => Iterable<readonly [K, V]>
```

Added in v1.0.0

## forEach

Execute the specified function for each node of the tree, in order.

**Signature**

```ts
export declare const forEach: <K, V>(f: (key: K, value: V) => void) => (self: RedBlackTree<K, V>) => void
```

Added in v1.0.0

## forEachBetween

Visit each node of the tree in order with key lower than max and greater
than or equal to min.

**Signature**

```ts
export declare const forEachBetween: <K, V>(
  min: K,
  max: K,
  f: (key: K, value: V) => void
) => (self: RedBlackTree<K, V>) => void
```

Added in v1.0.0

## forEachGreaterThanEqual

Visit each node of the tree in order with key greater then or equal to max.

**Signature**

```ts
export declare const forEachGreaterThanEqual: <K, V>(
  min: K,
  f: (key: K, value: V) => void
) => (self: RedBlackTree<K, V>) => void
```

Added in v1.0.0

## forEachLessThan

Visit each node of the tree in order with key lower then max.

**Signature**

```ts
export declare const forEachLessThan: <K, V>(
  max: K,
  f: (key: K, value: V) => void
) => (self: RedBlackTree<K, V>) => void
```

Added in v1.0.0

## greaterThan

Returns an iterator that traverse entries with keys greater than the
specified key.

**Signature**

```ts
export declare const greaterThan: <K>(
  key: K,
  direction?: RedBlackTree.Direction | undefined
) => <V>(self: RedBlackTree<K, V>) => Iterable<readonly [K, V]>
```

Added in v1.0.0

## greaterThanEqual

Returns an iterator that traverse entries with keys greater than or equal to
the specified key.

**Signature**

```ts
export declare const greaterThanEqual: <K>(
  key: K,
  direction?: RedBlackTree.Direction | undefined
) => <V>(self: RedBlackTree<K, V>) => Iterable<readonly [K, V]>
```

Added in v1.0.0

## lessThan

Returns an iterator that traverse entries with keys less than the specified
key.

**Signature**

```ts
export declare const lessThan: <K>(
  key: K,
  direction?: RedBlackTree.Direction | undefined
) => <V>(self: RedBlackTree<K, V>) => Iterable<readonly [K, V]>
```

Added in v1.0.0

## lessThanEqual

Returns an iterator that traverse entries with keys less than or equal to
the specified key.

**Signature**

```ts
export declare const lessThanEqual: <K>(
  key: K,
  direction?: RedBlackTree.Direction | undefined
) => <V>(self: RedBlackTree<K, V>) => Iterable<readonly [K, V]>
```

Added in v1.0.0
