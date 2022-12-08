---
title: SortedSet.ts
nav_order: 33
parent: Modules
---

## SortedSet overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [empty](#empty)
- [elements](#elements)
  - [add](#add)
  - [every](#every)
  - [has](#has)
  - [isSubset](#issubset)
  - [remove](#remove)
  - [some](#some)
  - [toggle](#toggle)
- [filtering](#filtering)
  - [filter](#filter)
  - [partition](#partition)
- [getters](#getters)
  - [size](#size)
  - [values](#values)
- [mapping](#mapping)
  - [map](#map)
- [models](#models)
  - [SortedSet (interface)](#sortedset-interface)
- [mutations](#mutations)
  - [difference](#difference)
  - [intersection](#intersection)
  - [union](#union)
- [refinements](#refinements)
  - [isSortedSet](#issortedset)
- [sequencing](#sequencing)
  - [flatMap](#flatmap)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)
- [traversing](#traversing)
  - [forEach](#foreach)

---

# constructors

## empty

**Signature**

```ts
export declare const empty: <A>(O: Order<A>) => SortedSet<A>
```

Added in v1.0.0

# elements

## add

**Signature**

```ts
export declare const add: <A>(value: A) => (self: SortedSet<A>) => SortedSet<A>
```

Added in v1.0.0

## every

**Signature**

```ts
export declare const every: <A>(predicate: Predicate<A>) => (self: SortedSet<A>) => boolean
```

Added in v1.0.0

## has

**Signature**

```ts
export declare const has: <A>(value: A) => (self: SortedSet<A>) => boolean
```

Added in v1.0.0

## isSubset

**Signature**

```ts
export declare const isSubset: <A>(that: SortedSet<A>) => (self: SortedSet<A>) => boolean
```

Added in v1.0.0

## remove

**Signature**

```ts
export declare const remove: <A>(value: A) => (self: SortedSet<A>) => SortedSet<A>
```

Added in v1.0.0

## some

**Signature**

```ts
export declare const some: <A>(predicate: Predicate<A>) => (self: SortedSet<A>) => boolean
```

Added in v1.0.0

## toggle

**Signature**

```ts
export declare const toggle: <A>(value: A) => (self: SortedSet<A>) => SortedSet<A>
```

Added in v1.0.0

# filtering

## filter

**Signature**

```ts
export declare const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): (self: SortedSet<A>) => SortedSet<B>
  <A>(predicate: Predicate<A>): (self: SortedSet<A>) => SortedSet<A>
}
```

Added in v1.0.0

## partition

**Signature**

```ts
export declare const partition: {
  <A, B extends A>(refinement: Refinement<A, B>): (self: SortedSet<A>) => readonly [SortedSet<A>, SortedSet<B>]
  <A>(predicate: Predicate<A>): (self: SortedSet<A>) => readonly [SortedSet<A>, SortedSet<A>]
}
```

Added in v1.0.0

# getters

## size

**Signature**

```ts
export declare const size: <A>(self: SortedSet<A>) => number
```

Added in v1.0.0

## values

**Signature**

```ts
export declare const values: <A>(self: SortedSet<A>) => IterableIterator<A>
```

Added in v1.0.0

# mapping

## map

**Signature**

```ts
export declare const map: <B>(O: Order<B>) => <A>(f: (a: A) => B) => (self: SortedSet<A>) => SortedSet<B>
```

Added in v1.0.0

# models

## SortedSet (interface)

**Signature**

```ts
export interface SortedSet<A> extends Iterable<A>, Eq.Equal {
  readonly _id: TypeId
  /** @internal */
  readonly keyTree: RBT.RedBlackTree<A, boolean>
}
```

Added in v1.0.0

# mutations

## difference

**Signature**

```ts
export declare const difference: <A, B extends A>(that: Iterable<B>) => (self: SortedSet<A>) => SortedSet<A>
```

Added in v1.0.0

## intersection

**Signature**

```ts
export declare const intersection: <A>(that: Iterable<A>) => (self: SortedSet<A>) => SortedSet<A>
```

Added in v1.0.0

## union

**Signature**

```ts
export declare const union: <A>(that: Iterable<A>) => (self: SortedSet<A>) => SortedSet<A>
```

Added in v1.0.0

# refinements

## isSortedSet

**Signature**

```ts
export declare const isSortedSet: { <A>(u: Iterable<A>): u is SortedSet<A>; (u: unknown): u is SortedSet<unknown> }
```

Added in v1.0.0

# sequencing

## flatMap

**Signature**

```ts
export declare const flatMap: <B>(O: Order<B>) => <A>(f: (a: A) => Iterable<B>) => (self: SortedSet<A>) => SortedSet<B>
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

**Signature**

```ts
export declare const forEach: <A>(f: (a: A) => void) => (self: SortedSet<A>) => void
```

Added in v1.0.0
