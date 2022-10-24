---
title: List.ts
nav_order: 20
parent: Modules
---

## List overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [apply](#apply)
  - [ap](#ap)
- [constructors](#constructors)
  - [List](#list)
  - [cons](#cons)
  - [empty](#empty)
  - [make](#make)
  - [nil](#nil)
  - [of](#of)
- [conversions](#conversions)
  - [fromIterable](#fromiterable)
- [elements](#elements)
  - [every](#every)
  - [findFirst](#findfirst)
  - [some](#some)
- [filtering](#filtering)
  - [drop](#drop)
  - [filter](#filter)
  - [take](#take)
- [folding](#folding)
  - [reduce](#reduce)
- [getters](#getters)
  - [head](#head)
  - [tail](#tail)
- [mapping](#mapping)
  - [map](#map)
- [models](#models)
  - [Cons (interface)](#cons-interface)
  - [List (type alias)](#list-type-alias)
  - [Nil (interface)](#nil-interface)
- [mutations](#mutations)
  - [concat](#concat)
  - [prepend](#prepend)
  - [prependAll](#prependall)
  - [reverse](#reverse)
- [partitioning](#partitioning)
  - [partition](#partition)
  - [partitionMap](#partitionmap)
  - [splitAt](#splitat)
- [refinements](#refinements)
  - [isCons](#iscons)
  - [isList](#islist)
  - [isNil](#isnil)
- [sequencing](#sequencing)
  - [flatMap](#flatmap)
- [sorting](#sorting)
  - [sortWith](#sortwith)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)
- [traversing](#traversing)
  - [forEach](#foreach)
- [type lambdas](#type-lambdas)
  - [ListTypeLambda (interface)](#listtypelambda-interface)
- [unsafe](#unsafe)
  - [unsafeHead](#unsafehead)
  - [unsafeLast](#unsafelast)
  - [unsafeTail](#unsafetail)

---

# apply

## ap

**Signature**

```ts
export declare const ap: <A>(fa: List<A>) => <B>(self: List<(a: A) => B>) => List<B>
```

Added in v1.0.0

# constructors

## List

**Signature**

```ts
export declare const List: <As extends readonly any[]>(...prefix: As) => List<As[number]>
```

Added in v1.0.0

## cons

**Signature**

```ts
export declare const cons: <A>(head: A, tail: List<A>) => Cons<A>
```

Added in v1.0.0

## empty

**Signature**

```ts
export declare const empty: <A = never>() => List<A>
```

Added in v1.0.0

## make

**Signature**

```ts
export declare const make: <As extends readonly any[]>(...prefix: As) => List<As[number]>
```

Added in v1.0.0

## nil

**Signature**

```ts
export declare const nil: <A = never>() => Nil<A>
```

Added in v1.0.0

## of

**Signature**

```ts
export declare const of: <A>(a: A) => List<A>
```

Added in v1.0.0

# conversions

## fromIterable

**Signature**

```ts
export declare const fromIterable: <A>(prefix: Iterable<A>) => List<A>
```

Added in v1.0.0

# elements

## every

**Signature**

```ts
export declare const every: <A>(p: Predicate<A>) => (self: List<A>) => boolean
```

Added in v1.0.0

## findFirst

**Signature**

```ts
export declare const findFirst: {
  <A, B extends A>(p: Refinement<A, B>): (self: List<A>) => Option<B>
  <A>(p: Predicate<A>): (self: List<A>) => Option<A>
}
```

Added in v1.0.0

## some

**Signature**

```ts
export declare const some: <A>(p: Predicate<A>) => (self: List<A>) => boolean
```

Added in v1.0.0

# filtering

## drop

**Signature**

```ts
export declare const drop: (n: number) => <A>(self: List<A>) => List<A>
```

Added in v1.0.0

## filter

**Signature**

```ts
export declare const filter: {
  <A, B extends A>(p: Refinement<A, B>): (self: List<A>) => List<B>
  <A>(p: Predicate<A>): (self: List<A>) => List<A>
}
```

Added in v1.0.0

## take

**Signature**

```ts
export declare const take: (n: number) => <A>(self: List<A>) => List<A>
```

Added in v1.0.0

# folding

## reduce

**Signature**

```ts
export declare const reduce: <A, B>(b: B, f: (b: B, a: A) => B) => (self: List<A>) => B
```

Added in v1.0.0

# getters

## head

**Signature**

```ts
export declare const head: <A>(self: List<A>) => Option<A>
```

Added in v1.0.0

## tail

**Signature**

```ts
export declare const tail: <A>(self: List<A>) => Option<List<A>>
```

Added in v1.0.0

# mapping

## map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (self: List<A>) => List<B>
```

Added in v1.0.0

# models

## Cons (interface)

**Signature**

```ts
export interface Cons<A> extends Iterable<A>, Equal.Equal {
  readonly _id: TypeId
  readonly _tag: 'Cons'
  readonly _A: (_: never) => A
  readonly head: A
  readonly tail: List<A>
}
```

Added in v1.0.0

## List (type alias)

**Signature**

```ts
export type List<A> = Cons<A> | Nil<A>
```

Added in v1.0.0

## Nil (interface)

**Signature**

```ts
export interface Nil<A> extends Iterable<A>, Equal.Equal {
  readonly _id: TypeId
  readonly _tag: 'Nil'
  readonly _A: (_: never) => A
}
```

Added in v1.0.0

# mutations

## concat

**Signature**

```ts
export declare const concat: <B>(prefix: List<B>) => <A>(self: List<A>) => List<B | A>
```

Added in v1.0.0

## prepend

**Signature**

```ts
export declare const prepend: <B>(elem: B) => <A>(self: List<A>) => Cons<B | A>
```

Added in v1.0.0

## prependAll

**Signature**

```ts
export declare const prependAll: <B>(prefix: List<B>) => <A>(self: List<A>) => List<B | A>
```

Added in v1.0.0

## reverse

**Signature**

```ts
export declare const reverse: <A>(self: List<A>) => List<A>
```

Added in v1.0.0

# partitioning

## partition

**Signature**

```ts
export declare const partition: <A>(f: Predicate<A>) => (self: List<A>) => readonly [List<A>, List<A>]
```

Added in v1.0.0

## partitionMap

**Signature**

```ts
export declare const partitionMap: <A, B, C>(
  f: (a: A) => Either<B, C>
) => (self: List<A>) => readonly [List<B>, List<C>]
```

Added in v1.0.0

## splitAt

**Signature**

```ts
export declare const splitAt: (n: number) => <A>(self: List<A>) => readonly [List<A>, List<A>]
```

Added in v1.0.0

# refinements

## isCons

**Signature**

```ts
export declare const isCons: <A>(self: List<A>) => self is Cons<A>
```

Added in v1.0.0

## isList

**Signature**

```ts
export declare const isList: { <A>(u: Iterable<A>): u is List<A>; (u: unknown): u is List<unknown> }
```

Added in v1.0.0

## isNil

**Signature**

```ts
export declare const isNil: <A>(self: List<A>) => self is Nil<A>
```

Added in v1.0.0

# sequencing

## flatMap

**Signature**

```ts
export declare const flatMap: <A, B>(f: (a: A) => List<B>) => (self: List<A>) => List<B>
```

Added in v1.0.0

# sorting

## sortWith

**Signature**

```ts
export declare const sortWith: <A>(ord: Sortable<A>) => (self: List<A>) => List<A>
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
export declare const forEach: <A, U>(f: (a: A) => U) => (self: List<A>) => void
```

Added in v1.0.0

# type lambdas

## ListTypeLambda (interface)

**Signature**

```ts
export interface ListTypeLambda extends HKT.TypeLambda {
  readonly type: List<this['Out1']>
}
```

Added in v1.0.0

# unsafe

## unsafeHead

**Signature**

```ts
export declare const unsafeHead: <A>(self: List<A>) => A
```

Added in v1.0.0

## unsafeLast

**Signature**

```ts
export declare const unsafeLast: <A>(self: List<A>) => A
```

Added in v1.0.0

## unsafeTail

**Signature**

```ts
export declare const unsafeTail: <A>(self: List<A>) => List<A>
```

Added in v1.0.0
