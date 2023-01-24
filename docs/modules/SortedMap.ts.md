---
title: SortedMap.ts
nav_order: 25
parent: Modules
---

## SortedMap overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [empty](#empty)
  - [from](#from)
  - [make](#make)
- [elements](#elements)
  - [get](#get)
  - [has](#has)
  - [headOption](#headoption)
  - [remove](#remove)
  - [set](#set)
- [folding](#folding)
  - [reduce](#reduce)
  - [reduceWithIndex](#reducewithindex)
- [getters](#getters)
  - [entries](#entries)
  - [getOrder](#getorder)
  - [keys](#keys)
  - [size](#size)
  - [values](#values)
- [mapping](#mapping)
  - [map](#map)
  - [mapWithIndex](#mapwithindex)
- [models](#models)
  - [SortedMap (interface)](#sortedmap-interface)
- [predicates](#predicates)
  - [isEmpty](#isempty)
  - [isNonEmpty](#isnonempty)
- [refinements](#refinements)
  - [isSortedMap](#issortedmap)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)

---

# constructors

## empty

**Signature**

```ts
export declare const empty: <K, V = never>(ord: Order<K>) => SortedMap<K, V>
```

Added in v1.0.0

## from

**Signature**

```ts
export declare const from: <K>(ord: Order<K>) => <V>(iterable: Iterable<readonly [K, V]>) => SortedMap<K, V>
```

Added in v1.0.0

## make

**Signature**

```ts
export declare const make: <K>(
  ord: Order<K>
) => <Entries extends readonly (readonly [K, any])[]>(
  ...entries: Entries
) => SortedMap<K, Entries[number] extends readonly [any, infer V] ? V : never>
```

Added in v1.0.0

# elements

## get

**Signature**

```ts
export declare const get: <K>(key: K) => <V>(self: SortedMap<K, V>) => O.Option<V>
```

Added in v1.0.0

## has

**Signature**

```ts
export declare const has: <K>(key: K) => <V>(self: SortedMap<K, V>) => boolean
```

Added in v1.0.0

## headOption

**Signature**

```ts
export declare const headOption: <K, V>(self: SortedMap<K, V>) => O.Option<readonly [K, V]>
```

Added in v1.0.0

## remove

**Signature**

```ts
export declare const remove: <K>(key: K) => <V>(self: SortedMap<K, V>) => SortedMap<K, V>
```

Added in v1.0.0

## set

**Signature**

```ts
export declare const set: <K, V>(key: K, value: V) => (self: SortedMap<K, V>) => SortedMap<K, V>
```

Added in v1.0.0

# folding

## reduce

**Signature**

```ts
export declare const reduce: <V, B>(zero: B, f: (accumulator: B, value: V) => B) => <K>(self: SortedMap<K, V>) => B
```

Added in v1.0.0

## reduceWithIndex

**Signature**

```ts
export declare const reduceWithIndex: <B, A, K>(b: B, f: (b: B, value: A, key: K) => B) => (self: SortedMap<K, A>) => B
```

Added in v1.0.0

# getters

## entries

**Signature**

```ts
export declare const entries: <K, V>(self: SortedMap<K, V>) => Iterator<readonly [K, V], any, undefined>
```

Added in v1.0.0

## getOrder

Gets the `Order<K>` that the `SortedMap<K, V>` is using.

**Signature**

```ts
export declare const getOrder: <K, V>(self: SortedMap<K, V>) => Order<K>
```

Added in v1.0.0

## keys

**Signature**

```ts
export declare const keys: <K, V>(self: SortedMap<K, V>) => IterableIterator<K>
```

Added in v1.0.0

## size

**Signature**

```ts
export declare const size: <K, V>(self: SortedMap<K, V>) => number
```

Added in v1.0.0

## values

**Signature**

```ts
export declare const values: <K, V>(self: SortedMap<K, V>) => IterableIterator<V>
```

Added in v1.0.0

# mapping

## map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => <K>(self: SortedMap<K, A>) => SortedMap<K, B>
```

Added in v1.0.0

## mapWithIndex

**Signature**

```ts
export declare const mapWithIndex: <A, K, B>(f: (a: A, k: K) => B) => (self: SortedMap<K, A>) => SortedMap<K, B>
```

Added in v1.0.0

# models

## SortedMap (interface)

**Signature**

```ts
export interface SortedMap<K, V> extends Iterable<readonly [K, V]>, Equal.Equal {
  readonly _id: TypeId
  /** @internal */
  readonly tree: RBT.RedBlackTree<K, V>
}
```

Added in v1.0.0

# predicates

## isEmpty

**Signature**

```ts
export declare const isEmpty: <K, V>(self: SortedMap<K, V>) => boolean
```

Added in v1.0.0

## isNonEmpty

**Signature**

```ts
export declare const isNonEmpty: <K, V>(self: SortedMap<K, V>) => boolean
```

Added in v1.0.0

# refinements

## isSortedMap

**Signature**

```ts
export declare const isSortedMap: {
  <K, V>(u: Iterable<readonly [K, V]>): u is SortedMap<K, V>
  (u: unknown): u is SortedMap<unknown, unknown>
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
