---
title: List.ts
nav_order: 19
parent: Modules
---

## List overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [List](#list)
  - [cons](#cons)
  - [empty](#empty)
  - [make](#make)
  - [nil](#nil)
  - [of](#of)
- [conversions](#conversions)
  - [fromIterable](#fromiterable)
- [do notation](#do-notation)
  - [bind](#bind)
  - [let](#let)
- [elements](#elements)
  - [every](#every)
  - [findFirst](#findfirst)
  - [some](#some)
- [filtering](#filtering)
  - [drop](#drop)
  - [filter](#filter)
  - [partition](#partition)
  - [partitionMap](#partitionmap)
  - [take](#take)
  - [traverseFilter](#traversefilter)
  - [traverseFilterMap](#traversefiltermap)
  - [traversePartition](#traversepartition)
  - [traversePartitionMap](#traversepartitionmap)
- [folding](#folding)
  - [reduce](#reduce)
- [getters](#getters)
  - [head](#head)
  - [tail](#tail)
- [instances](#instances)
  - [Applicative](#applicative)
  - [Chainable](#chainable)
  - [Compactable](#compactable)
  - [Covariant](#covariant)
  - [Filterable](#filterable)
  - [FlatMap](#flatmap)
  - [Foldable](#foldable)
  - [Invariant](#invariant)
  - [Monad](#monad)
  - [Of](#of)
  - [Pointed](#pointed)
  - [Product](#product)
  - [SemiApplicative](#semiapplicative)
  - [SemiProduct](#semiproduct)
  - [Traversable](#traversable)
  - [TraversableFilterable](#traversablefilterable)
- [mapping](#mapping)
  - [as](#as)
  - [asUnit](#asunit)
  - [flap](#flap)
  - [imap](#imap)
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
  - [splitAt](#splitat)
- [refinements](#refinements)
  - [isCons](#iscons)
  - [isList](#islist)
  - [isNil](#isnil)
- [sequencing](#sequencing)
  - [flatMap](#flatmap)
- [sorting](#sorting)
  - [sort](#sort)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)
- [traversing](#traversing)
  - [forEach](#foreach)
  - [sequence](#sequence)
  - [traverse](#traverse)
  - [traverseTap](#traversetap)
- [type lambdas](#type-lambdas)
  - [ListTypeLambda (interface)](#listtypelambda-interface)
- [unsafe](#unsafe)
  - [unsafeHead](#unsafehead)
  - [unsafeLast](#unsafelast)
  - [unsafeTail](#unsafetail)
- [utils](#utils)
  - [Do](#do)
  - [andThen](#andthen)
  - [andThenBind](#andthenbind)
  - [andThenDiscard](#andthendiscard)
  - [ap](#ap)
  - [bindTo](#bindto)
  - [compact](#compact)
  - [composeKleisliArrow](#composekleisliarrow)
  - [filterMap](#filtermap)
  - [flatten](#flatten)
  - [foldMap](#foldmap)
  - [foldMapKind](#foldmapkind)
  - [lift2](#lift2)
  - [lift3](#lift3)
  - [liftMonoid](#liftmonoid)
  - [liftSemigroup](#liftsemigroup)
  - [product](#product)
  - [productAll](#productall)
  - [productFlatten](#productflatten)
  - [productMany](#productmany)
  - [reduceKind](#reducekind)
  - [reduceRight](#reduceright)
  - [reduceRightKind](#reducerightkind)
  - [separate](#separate)
  - [struct](#struct)
  - [tap](#tap)
  - [toReadonlyArray](#toreadonlyarray)
  - [toReadonlyArrayWith](#toreadonlyarraywith)
  - [tuple](#tuple)
  - [tupled](#tupled)
  - [unit](#unit)

---

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

# do notation

## bind

**Signature**

```ts
export declare const bind: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => List<B>
) => (self: List<A>) => List<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## let

**Signature**

```ts
export declare const let: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (self: List<A>) => List<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
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
  <A, B extends A>(refinement: Refinement<A, B>): (self: List<A>) => Option<B>
  <A>(predicate: Predicate<A>): (self: List<A>) => Option<A>
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
  <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (self: List<C>) => List<B>
  <B extends A, A = B>(predicate: Predicate<A>): (self: List<B>) => List<B>
}
```

Added in v1.0.0

## partition

**Signature**

```ts
export declare const partition: {
  <C extends A, B extends A, A = C>(refinement: (a: A) => a is B): (self: List<C>) => readonly [List<C>, List<B>]
  <B extends A, A = B>(predicate: (a: A) => boolean): (self: List<B>) => readonly [List<B>, List<B>]
}
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

## take

**Signature**

```ts
export declare const take: (n: number) => <A>(self: List<A>) => List<A>
```

Added in v1.0.0

## traverseFilter

**Signature**

```ts
export declare const traverseFilter: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <B extends A, R, O, E, A = B>(
  predicate: (a: A) => Kind<F, R, O, E, boolean>
) => (self: List<B>) => Kind<F, R, O, E, List<B>>
```

Added in v1.0.0

## traverseFilterMap

**Signature**

```ts
export declare const traverseFilterMap: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B>(f: (a: A) => Kind<F, R, O, E, Option<B>>) => (self: List<A>) => Kind<F, R, O, E, List<B>>
```

Added in v1.0.0

## traversePartition

**Signature**

```ts
export declare const traversePartition: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <B extends A, R, O, E, A = B>(
  predicate: (a: A) => Kind<F, R, O, E, boolean>
) => (self: List<B>) => Kind<F, R, O, E, readonly [List<B>, List<B>]>
```

Added in v1.0.0

## traversePartitionMap

**Signature**

```ts
export declare const traversePartitionMap: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B, C>(
  f: (a: A) => Kind<F, R, O, E, Either<B, C>>
) => (self: List<A>) => Kind<F, R, O, E, readonly [List<B>, List<C>]>
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

# instances

## Applicative

**Signature**

```ts
export declare const Applicative: applicative.Applicative<ListTypeLambda>
```

Added in v1.0.0

## Chainable

**Signature**

```ts
export declare const Chainable: chainable.Chainable<ListTypeLambda>
```

Added in v1.0.0

## Compactable

**Signature**

```ts
export declare const Compactable: compactable.Compactable<ListTypeLambda>
```

Added in v1.0.0

## Covariant

**Signature**

```ts
export declare const Covariant: covariant.Covariant<ListTypeLambda>
```

Added in v1.0.0

## Filterable

**Signature**

```ts
export declare const Filterable: filterable.Filterable<ListTypeLambda>
```

Added in v1.0.0

## FlatMap

**Signature**

```ts
export declare const FlatMap: flatMap_.FlatMap<ListTypeLambda>
```

Added in v1.0.0

## Foldable

**Signature**

```ts
export declare const Foldable: foldable.Foldable<ListTypeLambda>
```

Added in v1.0.0

## Invariant

**Signature**

```ts
export declare const Invariant: invariant.Invariant<ListTypeLambda>
```

Added in v1.0.0

## Monad

**Signature**

```ts
export declare const Monad: monad.Monad<ListTypeLambda>
```

Added in v1.0.0

## Of

**Signature**

```ts
export declare const Of: of_.Of<ListTypeLambda>
```

Added in v1.0.0

## Pointed

**Signature**

```ts
export declare const Pointed: pointed.Pointed<ListTypeLambda>
```

Added in v1.0.0

## Product

**Signature**

```ts
export declare const Product: product_.Product<ListTypeLambda>
```

Added in v1.0.0

## SemiApplicative

**Signature**

```ts
export declare const SemiApplicative: semiApplicative.SemiApplicative<ListTypeLambda>
```

Added in v1.0.0

## SemiProduct

**Signature**

```ts
export declare const SemiProduct: semiProduct.SemiProduct<ListTypeLambda>
```

Added in v1.0.0

## Traversable

**Signature**

```ts
export declare const Traversable: traversable.Traversable<ListTypeLambda>
```

Added in v1.0.0

## TraversableFilterable

**Signature**

```ts
export declare const TraversableFilterable: traversableFilterable.TraversableFilterable<ListTypeLambda>
```

Added in v1.0.0

# mapping

## as

**Signature**

```ts
export declare const as: <B>(b: B) => <_>(self: List<_>) => List<B>
```

Added in v1.0.0

## asUnit

**Signature**

```ts
export declare const asUnit: <_>(self: List<_>) => List<void>
```

Added in v1.0.0

## flap

**Signature**

```ts
export declare const flap: <A>(a: A) => <B>(self: List<(a: A) => B>) => List<B>
```

Added in v1.0.0

## imap

**Signature**

```ts
export declare const imap: <A, B>(to: (a: A) => B, from: (b: B) => A) => (self: List<A>) => List<B>
```

Added in v1.0.0

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
}
```

Added in v1.0.0

# mutations

## concat

**Signature**

```ts
export declare const concat: <B>(that: List<B>) => <A>(self: List<A>) => List<B | A>
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

## sort

**Signature**

```ts
export declare const sort: <A>(O: Order<A>) => (self: List<A>) => List<A>
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

## sequence

**Signature**

```ts
export declare const sequence: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <R, O, E, A>(self: List<Kind<F, R, O, E, A>>) => Kind<F, R, O, E, List<A>>
```

Added in v1.0.0

## traverse

**Signature**

```ts
export declare const traverse: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B>(f: (a: A) => Kind<F, R, O, E, B>) => (self: List<A>) => Kind<F, R, O, E, List<B>>
```

Added in v1.0.0

## traverseTap

**Signature**

```ts
export declare const traverseTap: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B>(f: (a: A) => Kind<F, R, O, E, B>) => (self: List<A>) => Kind<F, R, O, E, List<A>>
```

Added in v1.0.0

# type lambdas

## ListTypeLambda (interface)

**Signature**

```ts
export interface ListTypeLambda extends TypeLambda {
  readonly type: List<this['Target']>
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

# utils

## Do

**Signature**

```ts
export declare const Do: List<{}>
```

Added in v1.0.0

## andThen

**Signature**

```ts
export declare const andThen: <B>(that: List<B>) => <_>(self: List<_>) => List<B>
```

Added in v1.0.0

## andThenBind

**Signature**

```ts
export declare const andThenBind: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  fb: List<B>
) => (self: List<A>) => List<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## andThenDiscard

**Signature**

```ts
export declare const andThenDiscard: <_>(that: List<_>) => <A>(self: List<A>) => List<A>
```

Added in v1.0.0

## ap

**Signature**

```ts
export declare const ap: <A>(fa: List<A>) => <B>(self: List<(a: A) => B>) => List<B>
```

Added in v1.0.0

## bindTo

**Signature**

```ts
export declare const bindTo: <N extends string>(name: N) => <A>(self: List<A>) => List<{ readonly [K in N]: A }>
```

Added in v1.0.0

## compact

**Signature**

```ts
export declare const compact: <A>(self: Iterable<Option<A>>) => List<A>
```

Added in v1.0.0

## composeKleisliArrow

**Signature**

```ts
export declare const composeKleisliArrow: <B, C>(
  bfc: (b: B) => List<C>
) => <A>(afb: (a: A) => List<B>) => (a: A) => List<C>
```

Added in v1.0.0

## filterMap

**Signature**

```ts
export declare const filterMap: <A, B>(f: (a: A) => Option<B>) => (self: Iterable<A>) => List<B>
```

Added in v1.0.0

## flatten

**Signature**

```ts
export declare const flatten: <A>(self: List<List<A>>) => List<A>
```

Added in v1.0.0

## foldMap

**Signature**

```ts
export declare const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (self: List<A>) => M
```

Added in v1.0.0

## foldMapKind

**Signature**

```ts
export declare const foldMapKind: <G extends TypeLambda>(
  G: Coproduct<G>
) => <A, R, O, E, B>(f: (a: A) => Kind<G, R, O, E, B>) => (self: List<A>) => Kind<G, R, O, E, B>
```

Added in v1.0.0

## lift2

**Signature**

```ts
export declare const lift2: <A, B, C>(f: (a: A, b: B) => C) => (fa: List<A>, fb: List<B>) => List<C>
```

Added in v1.0.0

## lift3

**Signature**

```ts
export declare const lift3: <A, B, C, D>(
  f: (a: A, b: B, c: C) => D
) => (fa: List<A>, fb: List<B>, fc: List<C>) => List<D>
```

Added in v1.0.0

## liftMonoid

**Signature**

```ts
export declare const liftMonoid: <A>(M: Monoid<A>) => Monoid<List<A>>
```

Added in v1.0.0

## liftSemigroup

**Signature**

```ts
export declare const liftSemigroup: <A>(S: Semigroup<A>) => Semigroup<List<A>>
```

Added in v1.0.0

## product

**Signature**

```ts
export declare const product: <B>(that: List<B>) => <A>(self: List<A>) => List<readonly [A, B]>
```

Added in v1.0.0

## productAll

**Signature**

```ts
export declare const productAll: <A>(collection: Iterable<List<A>>) => List<readonly A[]>
```

Added in v1.0.0

## productFlatten

**Signature**

```ts
export declare const productFlatten: <B>(
  that: List<B>
) => <A extends readonly any[]>(self: List<A>) => List<readonly [...A, B]>
```

Added in v1.0.0

## productMany

**Signature**

```ts
export declare const productMany: <A>(collection: Iterable<List<A>>) => (self: List<A>) => List<readonly [A, ...A[]]>
```

Added in v1.0.0

## reduceKind

**Signature**

```ts
export declare const reduceKind: <G extends TypeLambda>(
  G: monad.Monad<G>
) => <B, A, R, O, E>(b: B, f: (b: B, a: A) => Kind<G, R, O, E, B>) => (self: List<A>) => Kind<G, R, O, E, B>
```

Added in v1.0.0

## reduceRight

**Signature**

```ts
export declare const reduceRight: <A, B>(b: B, f: (b: B, a: A) => B) => (self: List<A>) => B
```

Added in v1.0.0

## reduceRightKind

**Signature**

```ts
export declare const reduceRightKind: <G extends TypeLambda>(
  G: monad.Monad<G>
) => <B, A, R, O, E>(b: B, f: (b: B, a: A) => Kind<G, R, O, E, B>) => (self: List<A>) => Kind<G, R, O, E, B>
```

Added in v1.0.0

## separate

**Signature**

```ts
export declare const separate: <A, B>(self: List<Either<A, B>>) => readonly [List<A>, List<B>]
```

Added in v1.0.0

## struct

**Signature**

```ts
export declare const struct: <R extends Record<string, List<any>>>(
  fields: R
) => List<{ readonly [K in keyof R]: [R[K]] extends [List<infer A>] ? A : never }>
```

Added in v1.0.0

## tap

**Signature**

```ts
export declare const tap: <A, _>(f: (a: A) => List<_>) => (self: List<A>) => List<A>
```

Added in v1.0.0

## toReadonlyArray

**Signature**

```ts
export declare const toReadonlyArray: <A>(self: List<A>) => readonly A[]
```

Added in v1.0.0

## toReadonlyArrayWith

**Signature**

```ts
export declare const toReadonlyArrayWith: <A, B>(f: (a: A) => B) => (self: List<A>) => readonly B[]
```

Added in v1.0.0

## tuple

**Signature**

```ts
export declare const tuple: <T extends readonly List<any>[]>(
  ...components: T
) => List<Readonly<{ [I in keyof T]: [T[I]] extends [List<infer A>] ? A : never }>>
```

Added in v1.0.0

## tupled

**Signature**

```ts
export declare const tupled: <A>(self: List<A>) => List<readonly [A]>
```

Added in v1.0.0

## unit

**Signature**

```ts
export declare const unit: List<void>
```

Added in v1.0.0
