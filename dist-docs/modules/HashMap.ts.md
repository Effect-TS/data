---
title: HashMap.ts
nav_order: 16
parent: Modules
---

## HashMap overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [empty](#empty)
  - [from](#from)
  - [make](#make)
- [elements](#elements)
  - [get](#get)
  - [getHash](#gethash)
  - [has](#has)
  - [hasHash](#hashash)
  - [isEmpty](#isempty)
- [filtering](#filtering)
  - [compact](#compact)
  - [filter](#filter)
  - [filterMap](#filtermap)
  - [filterMapWithIndex](#filtermapwithindex)
  - [filterWithIndex](#filterwithindex)
- [folding](#folding)
  - [reduce](#reduce)
  - [reduceWithIndex](#reducewithindex)
- [getter](#getter)
  - [keySet](#keyset)
- [getters](#getters)
  - [keys](#keys)
  - [size](#size)
  - [values](#values)
- [mapping](#mapping)
  - [map](#map)
  - [mapWithIndex](#mapwithindex)
- [models](#models)
  - [HashMap (interface)](#hashmap-interface)
- [mutations](#mutations)
  - [beginMutation](#beginmutation)
  - [endMutation](#endmutation)
  - [modify](#modify)
  - [modifyHash](#modifyhash)
  - [mutate](#mutate)
  - [remove](#remove)
  - [removeMany](#removemany)
  - [set](#set)
  - [setTree](#settree)
  - [union](#union)
  - [update](#update)
- [refinements](#refinements)
  - [isHashMap](#ishashmap)
- [sequencing](#sequencing)
  - [flatMap](#flatmap)
  - [flatMapWithIndex](#flatmapwithindex)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)
- [traversing](#traversing)
  - [forEach](#foreach)
  - [forEachWithIndex](#foreachwithindex)
- [unsafe](#unsafe)
  - [unsafeGet](#unsafeget)

---

# constructors

## empty

Creates a new `HashMap`.

**Signature**

```ts
export declare const empty: <K = never, V = never>() => HashMap<K, V>
```

Added in v1.0.0

## from

Constructs a new `HashMap` from an array of key/value pairs.

**Signature**

```ts
export declare const from: <K, V>(entries: Iterable<readonly [K, V]>) => HashMap<K, V>
```

Added in v1.0.0

## make

Constructs a new `HashMap` from an array of key/value pairs.

**Signature**

```ts
export declare const make: <Entries extends readonly (readonly [any, any])[]>(
  ...entries: Entries
) => HashMap<
  Entries[number] extends readonly [infer K, any] ? K : never,
  Entries[number] extends readonly [any, infer V] ? V : never
>
```

Added in v1.0.0

# elements

## get

Safely lookup the value for the specified key in the `HashMap` using the
internal hashing function.

**Signature**

```ts
export declare const get: <K, V>(key: K) => (self: HashMap<K, V>) => Option<V>
```

Added in v1.0.0

## getHash

Lookup the value for the specified key in the `HashMap` using a custom hash.

**Signature**

```ts
export declare const getHash: <K, V>(key: K, hash: number) => (self: HashMap<K, V>) => Option<V>
```

Added in v1.0.0

## has

Checks if the specified key has an entry in the `HashMap`.

**Signature**

```ts
export declare const has: <K, V>(key: K) => (self: HashMap<K, V>) => boolean
```

Added in v1.0.0

## hasHash

Checks if the specified key has an entry in the `HashMap` using a custom
hash.

**Signature**

```ts
export declare const hasHash: <K, V>(key: K, hash: number) => (self: HashMap<K, V>) => boolean
```

Added in v1.0.0

## isEmpty

Checks if the `HashMap` contains any entries.

**Signature**

```ts
export declare const isEmpty: <K, V>(self: HashMap<K, V>) => boolean
```

Added in v1.0.0

# filtering

## compact

Filters out `None` values from a `HashMap` of `Options`s.

**Signature**

```ts
export declare const compact: <K, A>(self: HashMap<K, Option<A>>) => HashMap<K, A>
```

Added in v1.0.0

## filter

Filters entries out of a `HashMap` using the specified predicate.

**Signature**

```ts
export declare const filter: {
  <A, B extends A>(f: Refinement<A, B>): <K>(self: HashMap<K, A>) => HashMap<K, B>
  <A>(f: Predicate<A>): <K>(self: HashMap<K, A>) => HashMap<K, A>
}
```

Added in v1.0.0

## filterMap

Maps over the values of the `HashMap` using the specified partial function
and filters out `None` values.

**Signature**

```ts
export declare const filterMap: <A, B>(f: (value: A) => Option<B>) => <K>(self: HashMap<K, A>) => HashMap<K, B>
```

Added in v1.0.0

## filterMapWithIndex

Maps over the entries of the `HashMap` using the specified partial function
and filters out `None` values.

**Signature**

```ts
export declare const filterMapWithIndex: <K, A, B>(
  f: (key: K, value: A) => Option<B>
) => (self: HashMap<K, A>) => HashMap<K, B>
```

Added in v1.0.0

## filterWithIndex

Filters entries out of a `HashMap` using the specified predicate.

**Signature**

```ts
export declare const filterWithIndex: {
  <K, A, B extends A>(f: (k: K, a: A) => a is B): (self: HashMap<K, A>) => HashMap<K, B>
  <K, A>(f: (k: K, a: A) => boolean): (self: HashMap<K, A>) => HashMap<K, A>
}
```

Added in v1.0.0

# folding

## reduce

Reduces the specified state over the values of the `HashMap`.

**Signature**

```ts
export declare const reduce: <V, Z>(z: Z, f: (z: Z, v: V) => Z) => <K>(self: HashMap<K, V>) => Z
```

Added in v1.0.0

## reduceWithIndex

Reduces the specified state over the entries of the `HashMap`.

**Signature**

```ts
export declare const reduceWithIndex: <K, V, Z>(
  zero: Z,
  f: (accumulator: Z, key: K, value: V) => Z
) => (self: HashMap<K, V>) => Z
```

Added in v1.0.0

# getter

## keySet

Returns a `HashSet` of keys within the `HashMap`.

**Signature**

```ts
export declare const keySet: <K, V>(self: HashMap<K, V>) => HashSet<K>
```

Added in v1.0.0

# getters

## keys

Returns an `IterableIterator` of the keys within the `HashMap`.

**Signature**

```ts
export declare const keys: <K, V>(self: HashMap<K, V>) => IterableIterator<K>
```

Added in v1.0.0

## size

Returns the number of entries within the `HashMap`.

**Signature**

```ts
export declare const size: <K, V>(self: HashMap<K, V>) => number
```

Added in v1.0.0

## values

Returns an `IterableIterator` of the values within the `HashMap`.

**Signature**

```ts
export declare const values: <K, V>(self: HashMap<K, V>) => IterableIterator<V>
```

Added in v1.0.0

# mapping

## map

Maps over the values of the `HashMap` using the specified function.

**Signature**

```ts
export declare const map: <V, A>(f: (value: V) => A) => <K>(self: HashMap<K, V>) => HashMap<K, A>
```

Added in v1.0.0

## mapWithIndex

Maps over the entries of the `HashMap` using the specified function.

**Signature**

```ts
export declare const mapWithIndex: <K, V, A>(f: (key: K, value: V) => A) => (self: HashMap<K, V>) => HashMap<K, A>
```

Added in v1.0.0

# models

## HashMap (interface)

**Signature**

```ts
export interface HashMap<Key, Value> extends Iterable<readonly [Key, Value]>, Equal {
  readonly _id: TypeId
  readonly _Key: (_: never) => Key
  readonly _Value: (_: never) => Value
}
```

Added in v1.0.0

# mutations

## beginMutation

Marks the `HashMap` as mutable.

**Signature**

```ts
export declare const beginMutation: <K, V>(self: HashMap<K, V>) => HashMap<K, V>
```

Added in v1.0.0

## endMutation

Marks the `HashMap` as immutable.

**Signature**

```ts
export declare const endMutation: <K, V>(self: HashMap<K, V>) => HashMap<K, V>
```

Added in v1.0.0

## modify

Alter the value of the specified key in the `HashMap` using the specified
update function. The value of the specified key will be computed using the
provided hash.

The update function will be invoked with the current value of the key if it
exists, or `None` if no such value exists.

This function will always either update or insert a value into the `HashMap`.

**Signature**

```ts
export declare const modify: <K, V>(key: K, f: (v: Option<V>) => Option<V>) => (self: HashMap<K, V>) => HashMap<K, V>
```

Added in v1.0.0

## modifyHash

Alter the value of the specified key in the `HashMap` using the specified
update function. The value of the specified key will be computed using the
provided hash.

The update function will be invoked with the current value of the key if it
exists, or `None` if no such value exists.

This function will always either update or insert a value into the `HashMap`.

**Signature**

```ts
export declare const modifyHash: <K, V>(
  key: K,
  hash: number,
  f: (v: Option<V>) => Option<V>
) => (self: HashMap<K, V>) => HashMap<K, V>
```

Added in v1.0.0

## mutate

Mutates the `HashMap` within the context of the provided function.

**Signature**

```ts
export declare const mutate: <K, V>(f: (self: HashMap<K, V>) => void) => (self: HashMap<K, V>) => HashMap<K, V>
```

Added in v1.0.0

## remove

Remove the entry for the specified key in the `HashMap` using the internal
hashing function.

**Signature**

```ts
export declare const remove: <K>(key: K) => <V>(self: HashMap<K, V>) => HashMap<K, V>
```

Added in v1.0.0

## removeMany

Removes all entries in the `HashMap` which have the specified keys.

**Signature**

```ts
export declare const removeMany: <K>(keys: Iterable<K>) => <V>(self: HashMap<K, V>) => HashMap<K, V>
```

Added in v1.0.0

## set

Sets the specified key to the specified value using the internal hashing
function.

**Signature**

```ts
export declare const set: <K, V>(key: K, value: V) => (self: HashMap<K, V>) => HashMap<K, V>
```

Added in v1.0.0

## setTree

Sets the root of the `HashMap`.

**Signature**

```ts
export declare const setTree: <K, V>(newRoot: HMN.Node<K, V>, newSize: number) => (self: HashMap<K, V>) => HashMap<K, V>
```

Added in v1.0.0

## union

Performs a union of this `HashMap` and that `HashMap`.

**Signature**

```ts
export declare const union: <K1, V1>(
  that: HashMap<K1, V1>
) => <K0, V0>(self: HashMap<K0, V0>) => HashMap<K1 | K0, V1 | V0>
```

Added in v1.0.0

## update

Updates the value of the specified key within the `HashMap` if it exists.

**Signature**

```ts
export declare const update: <K, V>(key: K, f: (v: V) => V) => (self: HashMap<K, V>) => HashMap<K, V>
```

Added in v1.0.0

# refinements

## isHashMap

**Signature**

```ts
export declare const isHashMap: {
  <K, V>(u: Iterable<readonly [K, V]>): u is HashMap<K, V>
  (u: unknown): u is HashMap<unknown, unknown>
}
```

Added in v1.0.0

# sequencing

## flatMap

Chains over the values of the `HashMap` using the specified function.

**NOTE**: the hash and equal of both maps have to be the same.

**Signature**

```ts
export declare const flatMap: <K, A, B>(f: (value: A) => HashMap<K, B>) => (self: HashMap<K, A>) => HashMap<K, B>
```

Added in v1.0.0

## flatMapWithIndex

Chains over the entries of the `HashMap` using the specified function.

**NOTE**: the hash and equal of both maps have to be the same.

**Signature**

```ts
export declare const flatMapWithIndex: <K, A, B>(
  f: (key: K, value: A) => HashMap<K, B>
) => (self: HashMap<K, A>) => HashMap<K, B>
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

## forEach

Applies the specified function to the values of the `HashMap`.

**Signature**

```ts
export declare const forEach: <V>(f: (value: V) => void) => <K>(self: HashMap<K, V>) => void
```

Added in v1.0.0

## forEachWithIndex

Applies the specified function to the entries of the `HashMap`.

**Signature**

```ts
export declare const forEachWithIndex: <K, V>(f: (key: K, value: V) => void) => (self: HashMap<K, V>) => void
```

Added in v1.0.0

# unsafe

## unsafeGet

Unsafely lookup the value for the specified key in the `HashMap` using the
internal hashing function.

**Signature**

```ts
export declare const unsafeGet: <K, V>(key: K) => (self: HashMap<K, V>) => V
```

Added in v1.0.0
