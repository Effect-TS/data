---
title: ReadonlyArray.ts
nav_order: 33
parent: Modules
---

## ReadonlyArray overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [empty](#empty)
  - [make](#make)
  - [makeBy](#makeby)
  - [of](#of)
  - [range](#range)
  - [replicate](#replicate)
  - [unfold](#unfold)
- [conversions](#conversions)
  - [fromEither](#fromeither)
  - [fromIterable](#fromiterable)
  - [fromNullable](#fromnullable)
  - [fromOption](#fromoption)
- [do notation](#do-notation)
  - [Do](#do)
  - [andThenBind](#andthenbind)
  - [bind](#bind)
  - [let](#let)
- [filtering](#filtering)
  - [compact](#compact)
  - [filter](#filter)
  - [filterMap](#filtermap)
  - [filterMapWithIndex](#filtermapwithindex)
  - [filterWithIndex](#filterwithindex)
  - [partition](#partition)
  - [partitionMap](#partitionmap)
  - [partitionMapWithIndex](#partitionmapwithindex)
  - [partitionWithIndex](#partitionwithindex)
  - [separate](#separate)
  - [span](#span)
  - [traverseFilterMap](#traversefiltermap)
  - [traversePartitionMap](#traversepartitionmap)
- [folding](#folding)
  - [foldMap](#foldmap)
  - [foldMapKind](#foldmapkind)
  - [foldMapNonEmpty](#foldmapnonempty)
  - [foldMapNonEmptyWithIndex](#foldmapnonemptywithindex)
  - [foldMapWithIndex](#foldmapwithindex)
  - [reduce](#reduce)
  - [reduceKind](#reducekind)
  - [reduceRight](#reduceright)
  - [reduceRightKind](#reducerightkind)
  - [reduceRightWithIndex](#reducerightwithindex)
  - [reduceWithIndex](#reducewithindex)
  - [scan](#scan)
  - [scanRight](#scanright)
- [getters](#getters)
  - [chunksOf](#chunksof)
  - [chunksOfNonEmpty](#chunksofnonempty)
  - [drop](#drop)
  - [dropRight](#dropright)
  - [dropWhile](#dropwhile)
  - [findFirst](#findfirst)
  - [findFirstIndex](#findfirstindex)
  - [findLast](#findlast)
  - [findLastIndex](#findlastindex)
  - [get](#get)
  - [head](#head)
  - [headNonEmpty](#headnonempty)
  - [init](#init)
  - [initNonEmpty](#initnonempty)
  - [last](#last)
  - [lastNonEmpty](#lastnonempty)
  - [lefts](#lefts)
  - [rights](#rights)
  - [size](#size)
  - [splitAt](#splitat)
  - [splitNonEmptyAt](#splitnonemptyat)
  - [tail](#tail)
  - [tailNonEmpty](#tailnonempty)
  - [take](#take)
  - [takeRight](#takeright)
  - [takeWhile](#takewhile)
  - [unappend](#unappend)
  - [unprepend](#unprepend)
- [grouping](#grouping)
  - [group](#group)
  - [groupBy](#groupby)
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
  - [getIntersectionSemigroup](#getintersectionsemigroup)
  - [getMonoid](#getmonoid)
  - [getSemigroup](#getsemigroup)
  - [getUnionMonoid](#getunionmonoid)
  - [getUnionSemigroup](#getunionsemigroup)
- [lifting](#lifting)
  - [every](#every)
  - [lift2](#lift2)
  - [lift3](#lift3)
  - [liftEither](#lifteither)
  - [liftMonoid](#liftmonoid)
  - [liftNullable](#liftnullable)
  - [liftOption](#liftoption)
  - [liftOrder](#liftorder)
  - [liftPredicate](#liftpredicate)
  - [liftSemigroup](#liftsemigroup)
- [mapping](#mapping)
  - [as](#as)
  - [flap](#flap)
  - [imap](#imap)
  - [map](#map)
  - [mapNonEmpty](#mapnonempty)
  - [mapNonEmptyWithIndex](#mapnonemptywithindex)
  - [mapWithIndex](#mapwithindex)
- [models](#models)
  - [NonEmptyReadonlyArray (type alias)](#nonemptyreadonlyarray-type-alias)
- [mutations](#mutations)
  - [append](#append)
  - [appendAll](#appendall)
  - [appendAllNonEmpty](#appendallnonempty)
  - [deleteAt](#deleteat)
  - [difference](#difference)
  - [insertAt](#insertat)
  - [intersection](#intersection)
  - [intersperse](#intersperse)
  - [intersperseNonEmpty](#interspersenonempty)
  - [modifyAt](#modifyat)
  - [modifyNonEmptyHead](#modifynonemptyhead)
  - [modifyNonEmptyLast](#modifynonemptylast)
  - [prepend](#prepend)
  - [prependAll](#prependall)
  - [prependAllNonEmpty](#prependallnonempty)
  - [reverse](#reverse)
  - [rotate](#rotate)
  - [rotateNonEmpty](#rotatenonempty)
  - [union](#union)
  - [unionNonEmpty](#unionnonempty)
  - [uniq](#uniq)
  - [uniqNonEmpty](#uniqnonempty)
  - [unzip](#unzip)
  - [unzipNonEmpty](#unzipnonempty)
  - [updateAt](#updateat)
  - [updateNonEmptyHead](#updatenonemptyhead)
  - [updateNonEmptyLast](#updatenonemptylast)
  - [zip](#zip)
  - [zipNonEmpty](#zipnonempty)
  - [zipNonEmptyWith](#zipnonemptywith)
  - [zipWith](#zipwith)
- [pattern matching](#pattern-matching)
  - [match](#match)
  - [matchRight](#matchright)
- [predicates](#predicates)
  - [elem](#elem)
  - [isEmpty](#isempty)
  - [isNonEmpty](#isnonempty)
  - [some](#some)
- [sequencing](#sequencing)
  - [flatMap](#flatmap)
  - [flatMapNonEmpty](#flatmapnonempty)
  - [flatMapNonEmptyWithIndex](#flatmapnonemptywithindex)
  - [flatMapNullable](#flatmapnullable)
  - [flatMapWithIndex](#flatmapwithindex)
  - [flatten](#flatten)
  - [flattenNonEmpty](#flattennonempty)
- [sorting](#sorting)
  - [sort](#sort)
  - [sortBy](#sortby)
  - [sortByNonEmpty](#sortbynonempty)
  - [sortNonEmpty](#sortnonempty)
- [traversing](#traversing)
  - [sequence](#sequence)
  - [sequenceNonEmpty](#sequencenonempty)
  - [traverse](#traverse)
  - [traverseNonEmpty](#traversenonempty)
  - [traverseNonEmptyWithIndex](#traversenonemptywithindex)
  - [traverseTap](#traversetap)
  - [traverseWithIndex](#traversewithindex)
- [type lambdas](#type-lambdas)
  - [ReadonlyArrayTypeLambda (interface)](#readonlyarraytypelambda-interface)
- [unsafe](#unsafe)
  - [unsafeGet](#unsafeget)
- [utils](#utils)
  - [ap](#ap)
  - [chop](#chop)
  - [chopNonEmpty](#chopnonempty)
  - [composeKleisliArrow](#composekleisliarrow)
  - [extend](#extend)
  - [has](#has)
  - [intercalate](#intercalate)
  - [intercalateNonEmpty](#intercalatenonempty)
  - [join](#join)
  - [max](#max)
  - [min](#min)
  - [product](#product)
  - [productAll](#productall)
  - [productFlatten](#productflatten)
  - [productMany](#productmany)
  - [reverseNonEmpty](#reversenonempty)
  - [traverseFilter](#traversefilter)
  - [traversePartition](#traversepartition)

---

# constructors

## empty

**Signature**

```ts
export declare const empty: readonly never[]
```

Added in v1.0.0

## make

Builds a `NonEmptyReadonlyArray` from an non-empty collection of elements.

**Signature**

```ts
export declare const make: <As extends readonly [any, ...any[]]>(...as: As) => readonly [As[number], ...As[number][]]
```

Added in v1.0.0

## makeBy

Return a `ReadonlyArray` of length `n` with element `i` initialized with `f(i)`.

**Note**. `n` is normalized to an integer >= 1.

**Signature**

```ts
export declare const makeBy: <A>(f: (i: number) => A) => (n: number) => readonly [A, ...A[]]
```

Added in v1.0.0

## of

**Signature**

```ts
export declare const of: <A>(a: A) => readonly [A, ...A[]]
```

Added in v1.0.0

## range

Create a non empty `ReadonlyArray` containing a range of integers, including both endpoints.

**Signature**

```ts
export declare const range: (start: number, end: number) => readonly [number, ...number[]]
```

Added in v1.0.0

## replicate

Create a `ReadonlyArray` containing a value repeated the specified number of times.

**Note**. `n` is normalized to an integer >= 1.

**Signature**

```ts
export declare const replicate: <A>(a: A) => (n: number) => readonly [A, ...A[]]
```

Added in v1.0.0

## unfold

**Signature**

```ts
export declare const unfold: <B, A>(b: B, f: (b: B) => Option<readonly [A, B]>) => readonly A[]
```

Added in v1.0.0

# conversions

## fromEither

**Signature**

```ts
export declare const fromEither: <A>(e: Either<unknown, A>) => readonly A[]
```

Added in v1.0.0

## fromIterable

**Signature**

```ts
export declare const fromIterable: <A>(collection: Iterable<A>) => readonly A[]
```

Added in v1.0.0

## fromNullable

**Signature**

```ts
export declare const fromNullable: <A>(a: A) => readonly NonNullable<A>[]
```

Added in v1.0.0

## fromOption

**Signature**

```ts
export declare const fromOption: <A>(o: Option<A>) => readonly A[]
```

Added in v1.0.0

# do notation

## Do

**Signature**

```ts
export declare const Do: readonly {}[]
```

Added in v1.0.0

## andThenBind

A variant of `bind` that sequentially ignores the scope.

**Signature**

```ts
export declare const andThenBind: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  fb: readonly B[]
) => (self: readonly A[]) => readonly { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }[]
```

Added in v1.0.0

## bind

**Signature**

```ts
export declare const bind: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => readonly B[]
) => (self: readonly A[]) => readonly { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }[]
```

Added in v1.0.0

## let

**Signature**

```ts
export declare const let: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (self: readonly A[]) => readonly { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }[]
```

Added in v1.0.0

# filtering

## compact

**Signature**

```ts
export declare const compact: <A>(self: Iterable<Option<A>>) => readonly A[]
```

Added in v1.0.0

## filter

**Signature**

```ts
export declare const filter: {
  <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (self: readonly C[]) => readonly B[]
  <B extends A, A = B>(predicate: Predicate<A>): (self: readonly B[]) => readonly B[]
}
```

Added in v1.0.0

## filterMap

**Signature**

```ts
export declare const filterMap: <A, B>(f: (a: A) => Option<B>) => (self: Iterable<A>) => readonly B[]
```

Added in v1.0.0

## filterMapWithIndex

**Signature**

```ts
export declare const filterMapWithIndex: <A, B>(
  f: (a: A, i: number) => Option<B>
) => (self: Iterable<A>) => readonly B[]
```

Added in v1.0.0

## filterWithIndex

**Signature**

```ts
export declare const filterWithIndex: {
  <C extends A, B extends A, A = C>(refinement: (a: A, i: number) => a is B): (fc: readonly C[]) => readonly B[]
  <B extends A, A = B>(predicate: (a: A, i: number) => boolean): (fb: readonly B[]) => readonly B[]
}
```

Added in v1.0.0

## partition

**Signature**

```ts
export declare const partition: {
  <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (
    self: readonly C[]
  ) => readonly [readonly C[], readonly B[]]
  <B extends A, A = B>(predicate: Predicate<A>): (self: readonly B[]) => readonly [readonly B[], readonly B[]]
}
```

Added in v1.0.0

## partitionMap

**Signature**

```ts
export declare const partitionMap: <A, B, C>(
  f: (a: A) => Either<B, C>
) => (self: readonly A[]) => readonly [readonly B[], readonly C[]]
```

Added in v1.0.0

## partitionMapWithIndex

**Signature**

```ts
export declare const partitionMapWithIndex: <A, B, C>(
  f: (a: A, i: number) => Either<B, C>
) => (fa: readonly A[]) => readonly [readonly B[], readonly C[]]
```

Added in v1.0.0

## partitionWithIndex

**Signature**

```ts
export declare const partitionWithIndex: {
  <C extends A, B extends A, A = C>(refinement: (a: A, i: number) => a is B): (
    fb: readonly C[]
  ) => readonly [readonly C[], readonly B[]]
  <B extends A, A = B>(predicate: (a: A, i: number) => boolean): (
    fb: readonly B[]
  ) => readonly [readonly B[], readonly B[]]
}
```

Added in v1.0.0

## separate

**Signature**

```ts
export declare const separate: <A, B>(self: readonly Either<A, B>[]) => readonly [readonly A[], readonly B[]]
```

Added in v1.0.0

## span

Split a `ReadonlyArray` into two parts:

1. the longest initial subarray for which all elements satisfy the specified predicate
2. the remaining elements

**Signature**

```ts
export declare function span<A, B extends A>(
  refinement: Refinement<A, B>
): (as: ReadonlyArray<A>) => readonly [init: ReadonlyArray<B>, rest: ReadonlyArray<A>]
export declare function span<A>(
  predicate: Predicate<A>
): <B extends A>(bs: ReadonlyArray<B>) => readonly [init: ReadonlyArray<B>, rest: ReadonlyArray<B>]
export declare function span<A>(
  predicate: Predicate<A>
): (as: ReadonlyArray<A>) => readonly [init: ReadonlyArray<A>, rest: ReadonlyArray<A>]
```

Added in v1.0.0

## traverseFilterMap

**Signature**

```ts
export declare const traverseFilterMap: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B>(f: (a: A) => Kind<F, R, O, E, Option<B>>) => (ta: readonly A[]) => Kind<F, R, O, E, readonly B[]>
```

Added in v1.0.0

## traversePartitionMap

**Signature**

```ts
export declare const traversePartitionMap: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B, C>(
  f: (a: A) => Kind<F, R, O, E, Either<B, C>>
) => (self: readonly A[]) => Kind<F, R, O, E, readonly [readonly B[], readonly C[]]>
```

Added in v1.0.0

# folding

## foldMap

**Signature**

```ts
export declare const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (self: readonly A[]) => M
```

Added in v1.0.0

## foldMapKind

**Signature**

```ts
export declare const foldMapKind: <F extends TypeLambda>(
  F: Coproduct<F>
) => <A, R, O, E, B>(f: (a: A) => Kind<F, R, O, E, B>) => (self: readonly A[]) => Kind<F, R, O, E, B>
```

Added in v1.0.0

## foldMapNonEmpty

**Signature**

```ts
export declare const foldMapNonEmpty: <S>(S: Semigroup<S>) => <A>(f: (a: A) => S) => (self: readonly [A, ...A[]]) => S
```

Added in v1.0.0

## foldMapNonEmptyWithIndex

**Signature**

```ts
export declare const foldMapNonEmptyWithIndex: <S>(
  S: Semigroup<S>
) => <A>(f: (a: A, i: number) => S) => (self: readonly [A, ...A[]]) => S
```

Added in v1.0.0

## foldMapWithIndex

**Signature**

```ts
export declare const foldMapWithIndex: <M>(
  Monoid: Monoid<M>
) => <A>(f: (a: A, i: number) => M) => (self: readonly A[]) => M
```

Added in v1.0.0

## reduce

**Signature**

```ts
export declare const reduce: <B, A>(b: B, f: (b: B, a: A) => B) => (self: readonly A[]) => B
```

Added in v1.0.0

## reduceKind

**Signature**

```ts
export declare const reduceKind: <F extends TypeLambda>(
  F: monad.Monad<F>
) => <B, A, R, O, E>(b: B, f: (b: B, a: A) => Kind<F, R, O, E, B>) => (self: readonly A[]) => Kind<F, R, O, E, B>
```

Added in v1.0.0

## reduceRight

**Signature**

```ts
export declare const reduceRight: <B, A>(b: B, f: (b: B, a: A) => B) => (self: readonly A[]) => B
```

Added in v1.0.0

## reduceRightKind

**Signature**

```ts
export declare const reduceRightKind: <F extends TypeLambda>(
  F: monad.Monad<F>
) => <B, A, R, O, E>(b: B, f: (b: B, a: A) => Kind<F, R, O, E, B>) => (self: readonly A[]) => Kind<F, R, O, E, B>
```

Added in v1.0.0

## reduceRightWithIndex

**Signature**

```ts
export declare const reduceRightWithIndex: <B, A>(b: B, f: (b: B, a: A, i: number) => B) => (self: readonly A[]) => B
```

Added in v1.0.0

## reduceWithIndex

**Signature**

```ts
export declare const reduceWithIndex: <B, A>(b: B, f: (b: B, a: A, i: number) => B) => (self: readonly A[]) => B
```

Added in v1.0.0

## scan

Fold a `ReadonlyArray` from the left, keeping all intermediate results instead of only the final result.

**Signature**

```ts
export declare const scan: <B, A>(b: B, f: (b: B, a: A) => B) => (self: readonly A[]) => readonly [B, ...B[]]
```

Added in v1.0.0

## scanRight

Fold a `ReadonlyArray` from the right, keeping all intermediate results instead of only the final result.

**Signature**

```ts
export declare const scanRight: <B, A>(b: B, f: (b: B, a: A) => B) => (self: readonly A[]) => readonly [B, ...B[]]
```

Added in v1.0.0

# getters

## chunksOf

Splits a `ReadonlyArray` into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
the `ReadonlyArray`. Note that `chunksOf(n)([])` is `[]`, not `[[]]`. This is intentional, and is consistent with a recursive
definition of `chunksOf`; it satisfies the property that

```ts
chunksOf(n)(xs).concat(chunksOf(n)(ys)) == chunksOf(n)(xs.concat(ys)))
```

whenever `n` evenly divides the length of `as`.

**Signature**

```ts
export declare const chunksOf: (n: number) => <A>(self: readonly A[]) => readonly (readonly [A, ...A[]])[]
```

Added in v1.0.0

## chunksOfNonEmpty

Splits a `NonEmptyReadonlyArray` into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
the `NonEmptyReadonlyArray`.

**Signature**

```ts
export declare const chunksOfNonEmpty: (
  n: number
) => <A>(self: readonly [A, ...A[]]) => readonly [readonly [A, ...A[]], ...(readonly [A, ...A[]])[]]
```

Added in v1.0.0

## drop

Drop a max number of elements from the start of an `ReadonlyArray`, creating a new `ReadonlyArray`.

**Note**. `n` is normalized to a non negative integer.

**Signature**

```ts
export declare const drop: (n: number) => <A>(as: readonly A[]) => readonly A[]
```

Added in v1.0.0

## dropRight

Drop a max number of elements from the end of an `ReadonlyArray`, creating a new `ReadonlyArray`.

**Note**. `n` is normalized to a non negative integer.

**Signature**

```ts
export declare const dropRight: (n: number) => <A>(as: readonly A[]) => readonly A[]
```

Added in v1.0.0

## dropWhile

Remove the longest initial subarray for which all element satisfy the specified predicate, creating a new `ReadonlyArray`.

**Signature**

```ts
export declare function dropWhile<A, B extends A>(
  refinement: Refinement<A, B>
): (as: ReadonlyArray<A>) => ReadonlyArray<B>
export declare function dropWhile<A>(predicate: Predicate<A>): <B extends A>(bs: ReadonlyArray<B>) => ReadonlyArray<B>
export declare function dropWhile<A>(predicate: Predicate<A>): (as: ReadonlyArray<A>) => ReadonlyArray<A>
```

Added in v1.0.0

## findFirst

Find the first element which satisfies a predicate function.

**Signature**

```ts
export declare function findFirst<A, B extends A>(refinement: Refinement<A, B>): (as: ReadonlyArray<A>) => Option<B>
export declare function findFirst<A>(predicate: Predicate<A>): <B extends A>(bs: ReadonlyArray<B>) => Option<B>
export declare function findFirst<A>(predicate: Predicate<A>): (as: ReadonlyArray<A>) => Option<A>
```

Added in v1.0.0

## findFirstIndex

Find the first index for which a predicate holds

**Signature**

```ts
export declare const findFirstIndex: <A>(predicate: Predicate<A>) => (as: readonly A[]) => Option<number>
```

Added in v1.0.0

## findLast

Find the last element which satisfies a predicate function.

**Signature**

```ts
export declare function findLast<A, B extends A>(refinement: Refinement<A, B>): (as: ReadonlyArray<A>) => Option<B>
export declare function findLast<A>(predicate: Predicate<A>): <B extends A>(bs: ReadonlyArray<B>) => Option<B>
export declare function findLast<A>(predicate: Predicate<A>): (as: ReadonlyArray<A>) => Option<A>
```

Added in v1.0.0

## findLastIndex

Returns the index of the last element of the list which matches the predicate

**Signature**

```ts
export declare const findLastIndex: <A>(predicate: Predicate<A>) => (as: readonly A[]) => Option<number>
```

Added in v1.0.0

## get

This function provides a safe way to read a value at a particular index from a `ReadonlyArray`

**Signature**

```ts
export declare const get: (i: number) => <A>(self: readonly A[]) => Option<A>
```

Added in v1.0.0

## head

Get the first element of a `ReadonlyArray`, or `None` if the `ReadonlyArray` is empty.

**Signature**

```ts
export declare const head: <A>(self: readonly A[]) => Option<A>
```

Added in v1.0.0

## headNonEmpty

**Signature**

```ts
export declare const headNonEmpty: <A>(self: readonly [A, ...A[]]) => A
```

Added in v1.0.0

## init

Get all but the last element of a `ReadonlyArray`, creating a new `ReadonlyArray`, or `None` if the `ReadonlyArray` is empty.

**Signature**

```ts
export declare const init: <A>(self: readonly A[]) => Option<readonly A[]>
```

Added in v1.0.0

## initNonEmpty

Get all but the last element of a non empty array, creating a new array.

**Signature**

```ts
export declare const initNonEmpty: <A>(self: readonly [A, ...A[]]) => readonly A[]
```

Added in v1.0.0

## last

Get the last element in a `ReadonlyArray`, or `None` if the `ReadonlyArray` is empty.

**Signature**

```ts
export declare const last: <A>(self: readonly A[]) => Option<A>
```

Added in v1.0.0

## lastNonEmpty

**Signature**

```ts
export declare const lastNonEmpty: <A>(as: readonly [A, ...A[]]) => A
```

Added in v1.0.0

## lefts

Extracts from a `ReadonlyArray` of `Either` all the `Left` elements.

**Signature**

```ts
export declare const lefts: <E>(self: readonly Either<E, unknown>[]) => readonly E[]
```

Added in v1.0.0

## rights

Extracts from a `ReadonlyArray` of `Either`s all the `Right` elements.

**Signature**

```ts
export declare const rights: <A>(self: readonly Either<unknown, A>[]) => readonly A[]
```

Added in v1.0.0

## size

Calculate the number of elements in a `ReadonlyArray`.

**Signature**

```ts
export declare const size: <A>(self: readonly A[]) => number
```

Added in v1.0.0

## splitAt

Splits a `ReadonlyArray` into two pieces, the first piece has max `n` elements.

**Signature**

```ts
export declare const splitAt: (n: number) => <A>(self: readonly A[]) => readonly [readonly A[], readonly A[]]
```

Added in v1.0.0

## splitNonEmptyAt

Splits a `NonEmptyReadonlyArray` into two pieces, the first piece has max `n` elements.

**Signature**

```ts
export declare const splitNonEmptyAt: (
  n: number
) => <A>(self: readonly [A, ...A[]]) => readonly [readonly [A, ...A[]], readonly A[]]
```

Added in v1.0.0

## tail

Get all but the first element of a `ReadonlyArray`, creating a new `ReadonlyArray`, or `None` if the `ReadonlyArray` is empty.

**Signature**

```ts
export declare const tail: <A>(self: readonly A[]) => Option<readonly A[]>
```

Added in v1.0.0

## tailNonEmpty

**Signature**

```ts
export declare const tailNonEmpty: <A>(self: readonly [A, ...A[]]) => readonly A[]
```

Added in v1.0.0

## take

Keep only a max number of elements from the start of an `ReadonlyArray`, creating a new `ReadonlyArray`.

**Note**. `n` is normalized to a non negative integer.

**Signature**

```ts
export declare const take: (n: number) => <A>(self: readonly A[]) => readonly A[]
```

Added in v1.0.0

## takeRight

Keep only a max number of elements from the end of an `ReadonlyArray`, creating a new `ReadonlyArray`.

**Note**. `n` is normalized to a non negative integer.

**Signature**

```ts
export declare const takeRight: (n: number) => <A>(as: readonly A[]) => readonly A[]
```

Added in v1.0.0

## takeWhile

Calculate the longest initial subarray for which all element satisfy the specified predicate, creating a new `ReadonlyArray`.

**Signature**

```ts
export declare function takeWhile<A, B extends A>(
  refinement: Refinement<A, B>
): (self: ReadonlyArray<A>) => ReadonlyArray<B>
export declare function takeWhile<A>(predicate: Predicate<A>): <B extends A>(self: ReadonlyArray<B>) => ReadonlyArray<B>
```

Added in v1.0.0

## unappend

Produces a couple of a copy of the array without its last element, and that last element.

**Signature**

```ts
export declare const unappend: <A>(self: readonly [A, ...A[]]) => readonly [readonly A[], A]
```

Added in v1.0.0

## unprepend

Produces a couple of the first element of the array, and a new array of the remaining elements, if any.

**Signature**

```ts
export declare const unprepend: <A>(self: readonly [A, ...A[]]) => readonly [A, readonly A[]]
```

Added in v1.0.0

# grouping

## group

Group equal, consecutive elements of a `NonEmptyReadonlyArray` into `NonEmptyReadonlyArray`s.

**Signature**

```ts
export declare const group: <A>(
  self: readonly [A, ...A[]]
) => readonly [readonly [A, ...A[]], ...(readonly [A, ...A[]])[]]
```

Added in v1.0.0

## groupBy

Splits an array into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
function on each element, and grouping the results according to values returned

**Signature**

```ts
export declare const groupBy: <A>(
  f: (a: A) => string
) => (self: readonly A[]) => Readonly<Record<string, readonly [A, ...A[]]>>
```

Added in v1.0.0

# instances

## Applicative

**Signature**

```ts
export declare const Applicative: applicative.Applicative<ReadonlyArrayTypeLambda>
```

Added in v1.0.0

## Chainable

**Signature**

```ts
export declare const Chainable: chainable.Chainable<ReadonlyArrayTypeLambda>
```

Added in v1.0.0

## Compactable

**Signature**

```ts
export declare const Compactable: compactable.Compactable<ReadonlyArrayTypeLambda>
```

Added in v1.0.0

## Covariant

**Signature**

```ts
export declare const Covariant: covariant.Covariant<ReadonlyArrayTypeLambda>
```

Added in v1.0.0

## Filterable

**Signature**

```ts
export declare const Filterable: filterable.Filterable<ReadonlyArrayTypeLambda>
```

Added in v1.0.0

## FlatMap

**Signature**

```ts
export declare const FlatMap: flatMap_.FlatMap<ReadonlyArrayTypeLambda>
```

Added in v1.0.0

## Foldable

**Signature**

```ts
export declare const Foldable: foldable.Foldable<ReadonlyArrayTypeLambda>
```

Added in v1.0.0

## Invariant

**Signature**

```ts
export declare const Invariant: invariant.Invariant<ReadonlyArrayTypeLambda>
```

Added in v1.0.0

## Monad

**Signature**

```ts
export declare const Monad: monad.Monad<ReadonlyArrayTypeLambda>
```

Added in v1.0.0

## Of

**Signature**

```ts
export declare const Of: of_.Of<ReadonlyArrayTypeLambda>
```

Added in v1.0.0

## Pointed

**Signature**

```ts
export declare const Pointed: pointed.Pointed<ReadonlyArrayTypeLambda>
```

Added in v1.0.0

## Product

**Signature**

```ts
export declare const Product: product_.Product<ReadonlyArrayTypeLambda>
```

Added in v1.0.0

## SemiApplicative

**Signature**

```ts
export declare const SemiApplicative: semiApplicative.SemiApplicative<ReadonlyArrayTypeLambda>
```

Added in v1.0.0

## SemiProduct

**Signature**

```ts
export declare const SemiProduct: semiProduct.SemiProduct<ReadonlyArrayTypeLambda>
```

Added in v1.0.0

## Traversable

**Signature**

```ts
export declare const Traversable: traversable.Traversable<ReadonlyArrayTypeLambda>
```

Added in v1.0.0

## TraversableFilterable

**Signature**

```ts
export declare const TraversableFilterable: traversableFilterable.TraversableFilterable<ReadonlyArrayTypeLambda>
```

Added in v1.0.0

## getIntersectionSemigroup

**Signature**

```ts
export declare const getIntersectionSemigroup: <A>() => Semigroup<readonly A[]>
```

Added in v1.0.0

## getMonoid

Returns a `Monoid` for `ReadonlyArray<A>`.

**Signature**

```ts
export declare const getMonoid: <A>() => Monoid<readonly A[]>
```

Added in v1.0.0

## getSemigroup

Returns a `Semigroup` for `ReadonlyArray<A>`.

**Signature**

```ts
export declare const getSemigroup: <A>() => Semigroup<readonly A[]>
```

Added in v1.0.0

## getUnionMonoid

**Signature**

```ts
export declare const getUnionMonoid: <A>() => Monoid<readonly A[]>
```

Added in v1.0.0

## getUnionSemigroup

**Signature**

```ts
export declare const getUnionSemigroup: <A>() => Semigroup<readonly A[]>
```

Added in v1.0.0

# lifting

## every

Check if a predicate holds true for every `ReadonlyArray` member.

**Signature**

```ts
export declare function every<A, B extends A>(
  refinement: Refinement<A, B>
): Refinement<ReadonlyArray<A>, ReadonlyArray<B>>
export declare function every<A>(predicate: Predicate<A>): Predicate<ReadonlyArray<A>>
```

Added in v1.0.0

## lift2

Lifts a binary function into `ReadonlyArray`.

**Signature**

```ts
export declare const lift2: <A, B, C>(f: (a: A, b: B) => C) => (fa: readonly A[], fb: readonly B[]) => readonly C[]
```

Added in v1.0.0

## lift3

Lifts a ternary function into `ReadonlyArray`.

**Signature**

```ts
export declare const lift3: <A, B, C, D>(
  f: (a: A, b: B, c: C) => D
) => (fa: readonly A[], fb: readonly B[], fc: readonly C[]) => readonly D[]
```

Added in v1.0.0

## liftEither

**Signature**

```ts
export declare const liftEither: <A extends readonly unknown[], E, B>(
  f: (...a: A) => Either<E, B>
) => (...a: A) => readonly B[]
```

Added in v1.0.0

## liftMonoid

**Signature**

```ts
export declare const liftMonoid: <A>(M: Monoid<A>) => Monoid<readonly A[]>
```

Added in v1.0.0

## liftNullable

**Signature**

```ts
export declare const liftNullable: <A extends readonly unknown[], B>(
  f: (...a: A) => B | null | undefined
) => (...a: A) => readonly NonNullable<B>[]
```

Added in v1.0.0

## liftOption

**Signature**

```ts
export declare const liftOption: <A extends readonly unknown[], B>(
  f: (...a: A) => Option<B>
) => (...a: A) => readonly B[]
```

Added in v1.0.0

## liftOrder

Derives an `Order` over the `ReadonlyArray` of a given element type from the `Order` of that type. The ordering between two such
`ReadonlyArray`s is equal to: the first non equal comparison of each `ReadonlyArray`s elements taken pairwise in increasing order, in
case of equality over all the pairwise elements; the longest `ReadonlyArray` is considered the greatest, if both `ReadonlyArray`s have
the same length, the result is equality.

**Signature**

```ts
export declare const liftOrder: <A>(O: order.Order<A>) => order.Order<readonly A[]>
```

Added in v1.0.0

## liftPredicate

**Signature**

```ts
export declare const liftPredicate: {
  <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (c: C) => readonly B[]
  <B extends A, A = B>(predicate: Predicate<A>): (b: B) => readonly B[]
}
```

Added in v1.0.0

## liftSemigroup

**Signature**

```ts
export declare const liftSemigroup: <A>(S: Semigroup<A>) => Semigroup<readonly A[]>
```

Added in v1.0.0

# mapping

## as

Maps the success value of this effect to the specified constant value.

**Signature**

```ts
export declare const as: <B>(b: B) => (self: ReadonlyArray<unknown>) => readonly B[]
```

Added in v1.0.0

## flap

**Signature**

```ts
export declare const flap: <A>(a: A) => <B>(self: readonly ((a: A) => B)[]) => readonly B[]
```

Added in v1.0.0

## imap

**Signature**

```ts
export declare const imap: <A, B>(to: (a: A) => B, from: (b: B) => A) => (self: readonly A[]) => readonly B[]
```

Added in v1.0.0

## map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (self: readonly A[]) => readonly B[]
```

Added in v1.0.0

## mapNonEmpty

**Signature**

```ts
export declare const mapNonEmpty: <A, B>(f: (a: A) => B) => (self: readonly [A, ...A[]]) => readonly [B, ...B[]]
```

Added in v1.0.0

## mapNonEmptyWithIndex

**Signature**

```ts
export declare const mapNonEmptyWithIndex: <A, B>(
  f: (a: A, i: number) => B
) => (self: readonly [A, ...A[]]) => readonly [B, ...B[]]
```

Added in v1.0.0

## mapWithIndex

**Signature**

```ts
export declare const mapWithIndex: <A, B>(f: (a: A, i: number) => B) => (self: readonly A[]) => readonly B[]
```

Added in v1.0.0

# models

## NonEmptyReadonlyArray (type alias)

**Signature**

```ts
export type NonEmptyReadonlyArray<A> = readonly [A, ...Array<A>]
```

Added in v1.0.0

# mutations

## append

Append an element to the end of a `ReadonlyArray`, creating a new non empty `ReadonlyArray`.

**Signature**

```ts
export declare const append: <B>(last: B) => <A>(self: readonly A[]) => readonly [B | A, ...(B | A)[]]
```

Added in v1.0.0

## appendAll

**Signature**

```ts
export declare const appendAll: <B>(that: readonly B[]) => <A>(self: readonly A[]) => readonly (B | A)[]
```

Added in v1.0.0

## appendAllNonEmpty

**Signature**

```ts
export declare function appendAllNonEmpty<B>(
  that: NonEmptyReadonlyArray<B>
): <A>(self: ReadonlyArray<A>) => NonEmptyReadonlyArray<A | B>
export declare function appendAllNonEmpty<B>(
  that: ReadonlyArray<B>
): <A>(self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<A | B>
```

Added in v1.0.0

## deleteAt

Delete the element at the specified index, creating a new `ReadonlyArray`, or returning `None` if the index is out of bounds.

**Signature**

```ts
export declare const deleteAt: (i: number) => <A>(self: readonly A[]) => Option<readonly A[]>
```

Added in v1.0.0

## difference

Creates a `ReadonlyArray` of values not included in the other given `ReadonlyArray` using a `Eq` for equality
comparisons. The order and references of result values are determined by the first `ReadonlyArray`.

**Signature**

```ts
export declare const difference: <B>(that: readonly B[]) => <A>(self: readonly A[]) => readonly A[]
```

Added in v1.0.0

## insertAt

Insert an element at the specified index, creating a new `ReadonlyArray`, or returning `None` if the index is out of bounds.

**Signature**

```ts
export declare const insertAt: <B>(i: number, a: B) => <A>(self: readonly A[]) => Option<readonly [B | A, ...(B | A)[]]>
```

Added in v1.0.0

## intersection

Creates a `ReadonlyArray` of unique values that are included in all given `ReadonlyArray`s using a `Eq` for equality
comparisons. The order and references of result values are determined by the first `ReadonlyArray`.

**Signature**

```ts
export declare const intersection: <A>(that: readonly A[]) => <B>(self: readonly B[]) => readonly (A & B)[]
```

Added in v1.0.0

## intersperse

Places an element in between members of a `ReadonlyArray`

**Signature**

```ts
export declare const intersperse: <B>(middle: B) => <A>(self: readonly A[]) => readonly (B | A)[]
```

Added in v1.0.0

## intersperseNonEmpty

Places an element in between members of a `NonEmptyReadonlyArray`

**Signature**

```ts
export declare const intersperseNonEmpty: <B>(
  middle: B
) => <A>(self: readonly [A, ...A[]]) => readonly [B | A, ...(B | A)[]]
```

Added in v1.0.0

## modifyAt

Apply a function to the element at the specified index, creating a new `ReadonlyArray`, or returning `None` if the index is out
of bounds.

**Signature**

```ts
export declare const modifyAt: <A, B>(i: number, f: (a: A) => B) => (self: readonly A[]) => Option<readonly (A | B)[]>
```

Added in v1.0.0

## modifyNonEmptyHead

Apply a function to the head, creating a new `NonEmptyReadonlyArray`.

**Signature**

```ts
export declare const modifyNonEmptyHead: <A, B>(
  f: (a: A) => B
) => (self: readonly [A, ...A[]]) => readonly [A | B, ...(A | B)[]]
```

Added in v1.0.0

## modifyNonEmptyLast

Apply a function to the last element, creating a new `NonEmptyReadonlyArray`.

**Signature**

```ts
export declare const modifyNonEmptyLast: <A, B>(
  f: (a: A) => B
) => (self: readonly [A, ...A[]]) => readonly [A | B, ...(A | B)[]]
```

Added in v1.0.0

## prepend

Prepend an element to the front of a `ReadonlyArray`, creating a new non empty `ReadonlyArray`.

**Signature**

```ts
export declare const prepend: <B>(head: B) => <A>(self: readonly A[]) => readonly [B | A, ...(B | A)[]]
```

Added in v1.0.0

## prependAll

**Signature**

```ts
export declare const prependAll: <B>(prefix: readonly B[]) => <A>(self: readonly A[]) => readonly (B | A)[]
```

Added in v1.0.0

## prependAllNonEmpty

**Signature**

```ts
export declare function prependAllNonEmpty<B>(
  that: NonEmptyReadonlyArray<B>
): <A>(self: ReadonlyArray<A>) => NonEmptyReadonlyArray<A | B>
export declare function prependAllNonEmpty<B>(
  that: ReadonlyArray<B>
): <A>(self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<A | B>
```

Added in v1.0.0

## reverse

Reverse a `ReadonlyArray`, creating a new `ReadonlyArray`.

**Signature**

```ts
export declare const reverse: <A>(self: readonly A[]) => readonly A[]
```

Added in v1.0.0

## rotate

Rotate a `ReadonlyArray` by `n` steps.

**Signature**

```ts
export declare const rotate: (n: number) => <A>(self: readonly A[]) => readonly A[]
```

Added in v1.0.0

## rotateNonEmpty

Rotate a `NonEmptyReadonlyArray` by `n` steps.

**Signature**

```ts
export declare const rotateNonEmpty: (n: number) => <A>(self: readonly [A, ...A[]]) => readonly [A, ...A[]]
```

Added in v1.0.0

## union

**Signature**

```ts
export declare const union: <B>(that: readonly B[]) => <A>(self: readonly A[]) => readonly (B | A)[]
```

Added in v1.0.0

## unionNonEmpty

**Signature**

```ts
export declare function unionNonEmpty<B>(
  that: NonEmptyReadonlyArray<B>
): <A>(self: ReadonlyArray<A>) => NonEmptyReadonlyArray<A | B>
export declare function unionNonEmpty<B>(
  that: ReadonlyArray<B>
): <A>(self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<A | B>
```

Added in v1.0.0

## uniq

Remove duplicates from a `ReadonlyArray`, keeping the first occurrence of an element.

**Signature**

```ts
export declare const uniq: <A>(self: readonly A[]) => readonly A[]
```

Added in v1.0.0

## uniqNonEmpty

Remove duplicates from a `NonEmptyReadonlyArray`, keeping the first occurrence of an element.

**Signature**

```ts
export declare const uniqNonEmpty: <A>(self: readonly [A, ...A[]]) => readonly [A, ...A[]]
```

Added in v1.0.0

## unzip

This function is the inverse of `zip`. Takes a `ReadonlyArray` of pairs and return two corresponding `ReadonlyArray`s.

**Signature**

```ts
export declare const unzip: <A, B>(self: readonly (readonly [A, B])[]) => readonly [readonly A[], readonly B[]]
```

Added in v1.0.0

## unzipNonEmpty

**Signature**

```ts
export declare const unzipNonEmpty: <A, B>(
  self: readonly [readonly [A, B], ...(readonly [A, B])[]]
) => readonly [readonly [A, ...A[]], readonly [B, ...B[]]]
```

Added in v1.0.0

## updateAt

Change the element at the specified index, creating a new `ReadonlyArray`, or returning `None` if the index is out of bounds.

**Signature**

```ts
export declare const updateAt: <B>(i: number, b: B) => <A>(self: readonly A[]) => Option<readonly (B | A)[]>
```

Added in v1.0.0

## updateNonEmptyHead

Change the head, creating a new `NonEmptyReadonlyArray`.

**Signature**

```ts
export declare const updateNonEmptyHead: <B>(b: B) => <A>(self: readonly [A, ...A[]]) => readonly [B | A, ...(B | A)[]]
```

Added in v1.0.0

## updateNonEmptyLast

Change the last element, creating a new `NonEmptyReadonlyArray`.

**Signature**

```ts
export declare const updateNonEmptyLast: <B>(b: B) => <A>(self: readonly [A, ...A[]]) => readonly [B | A, ...(B | A)[]]
```

Added in v1.0.0

## zip

Takes two `ReadonlyArray`s and returns a `ReadonlyArray` of corresponding pairs. If one input `ReadonlyArray` is short, excess elements of the
longer `ReadonlyArray` are discarded.

**Signature**

```ts
export declare const zip: <B>(that: readonly B[]) => <A>(self: readonly A[]) => readonly (readonly [A, B])[]
```

Added in v1.0.0

## zipNonEmpty

**Signature**

```ts
export declare const zipNonEmpty: <B>(
  that: readonly [B, ...B[]]
) => <A>(self: readonly [A, ...A[]]) => readonly [readonly [A, B], ...(readonly [A, B])[]]
```

Added in v1.0.0

## zipNonEmptyWith

**Signature**

```ts
export declare const zipNonEmptyWith: <B, A, C>(
  that: readonly [B, ...B[]],
  f: (a: A, b: B) => C
) => (self: readonly [A, ...A[]]) => readonly [C, ...C[]]
```

Added in v1.0.0

## zipWith

Apply a function to pairs of elements at the same index in two `ReadonlyArray`s, collecting the results in a new `ReadonlyArray`. If one
input `ReadonlyArray` is short, excess elements of the longer `ReadonlyArray` are discarded.

**Signature**

```ts
export declare const zipWith: <B, A, C>(
  that: readonly B[],
  f: (a: A, b: B) => C
) => (self: readonly A[]) => readonly C[]
```

Added in v1.0.0

# pattern matching

## match

**Signature**

```ts
export declare const match: <B, A, C = B>(
  onEmpty: LazyArg<B>,
  onNonEmpty: (head: A, tail: readonly A[]) => C
) => (self: readonly A[]) => B | C
```

Added in v1.0.0

## matchRight

**Signature**

```ts
export declare const matchRight: <B, A, C = B>(
  onEmpty: LazyArg<B>,
  onNonEmpty: (init: readonly A[], last: A) => C
) => (self: readonly A[]) => B | C
```

Added in v1.0.0

# predicates

## elem

Tests whether a value is a member of a `ReadonlyArray`.

**Signature**

```ts
export declare const elem: <B>(b: B) => <A>(self: readonly A[]) => boolean
```

Added in v1.0.0

## isEmpty

Test whether a `ReadonlyArray` is empty.

**Signature**

```ts
export declare const isEmpty: <A>(self: readonly A[]) => self is readonly []
```

Added in v1.0.0

## isNonEmpty

Test whether a `ReadonlyArray` is non empty narrowing down the type to `NonEmptyReadonlyArray<A>`

**Signature**

```ts
export declare const isNonEmpty: <A>(self: readonly A[]) => self is readonly [A, ...A[]]
```

Added in v1.0.0

## some

Check if a predicate holds true for any `ReadonlyArray` member.

**Signature**

```ts
export declare const some: <A>(predicate: Predicate<A>) => (self: readonly A[]) => self is readonly [A, ...A[]]
```

Added in v1.0.0

# sequencing

## flatMap

**Signature**

```ts
export declare const flatMap: <A, B>(f: (a: A) => readonly B[]) => (self: readonly A[]) => readonly B[]
```

Added in v1.0.0

## flatMapNonEmpty

**Signature**

```ts
export declare const flatMapNonEmpty: <A, B>(
  f: (a: A) => readonly [B, ...B[]]
) => (self: readonly [A, ...A[]]) => readonly [B, ...B[]]
```

Added in v1.0.0

## flatMapNonEmptyWithIndex

**Signature**

```ts
export declare const flatMapNonEmptyWithIndex: <A, B>(
  f: (a: A, i: number) => readonly [B, ...B[]]
) => (self: readonly [A, ...A[]]) => readonly [B, ...B[]]
```

Added in v1.0.0

## flatMapNullable

**Signature**

```ts
export declare const flatMapNullable: <A, B>(
  f: (a: A) => B | null | undefined
) => (self: readonly A[]) => readonly NonNullable<B>[]
```

Added in v1.0.0

## flatMapWithIndex

**Signature**

```ts
export declare const flatMapWithIndex: <A, B>(
  f: (a: A, i: number) => readonly B[]
) => (self: readonly A[]) => readonly B[]
```

Added in v1.0.0

## flatten

**Signature**

```ts
export declare const flatten: <A>(self: readonly (readonly A[])[]) => readonly A[]
```

Added in v1.0.0

## flattenNonEmpty

**Signature**

```ts
export declare const flattenNonEmpty: <A>(
  self: readonly [readonly [A, ...A[]], ...(readonly [A, ...A[]])[]]
) => readonly [A, ...A[]]
```

Added in v1.0.0

# sorting

## sort

Sort the elements of a `ReadonlyArray` in increasing order, creating a new `ReadonlyArray`.

**Signature**

```ts
export declare const sort: <B>(O: order.Order<B>) => <A extends B>(self: readonly A[]) => readonly A[]
```

Added in v1.0.0

## sortBy

Sort the elements of a `ReadonlyArray` in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
etc...

**Signature**

```ts
export declare const sortBy: <B>(orders: readonly order.Order<B>[]) => <A extends B>(self: readonly A[]) => readonly A[]
```

Added in v1.0.0

## sortByNonEmpty

**Signature**

```ts
export declare const sortByNonEmpty: <B>(
  orders: readonly order.Order<B>[]
) => <A extends B>(as: readonly [A, ...A[]]) => readonly [A, ...A[]]
```

Added in v1.0.0

## sortNonEmpty

Sort the elements of a `NonEmptyReadonlyArray` in increasing order, creating a new `NonEmptyReadonlyArray`.

**Signature**

```ts
export declare const sortNonEmpty: <B>(
  O: order.Order<B>
) => <A extends B>(self: readonly [A, ...A[]]) => readonly [A, ...A[]]
```

Added in v1.0.0

# traversing

## sequence

**Signature**

```ts
export declare const sequence: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <R, O, E, A>(self: readonly Kind<F, R, O, E, A>[]) => Kind<F, R, O, E, readonly A[]>
```

Added in v1.0.0

## sequenceNonEmpty

**Signature**

```ts
export declare const sequenceNonEmpty: <F extends TypeLambda>(
  F: semiApplicative.SemiApplicative<F>
) => <R, O, E, A>(
  self: readonly [Kind<F, R, O, E, A>, ...Kind<F, R, O, E, A>[]]
) => Kind<F, R, O, E, readonly [A, ...A[]]>
```

Added in v1.0.0

## traverse

**Signature**

```ts
export declare const traverse: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B>(f: (a: A) => Kind<F, R, O, E, B>) => (self: readonly A[]) => Kind<F, R, O, E, readonly B[]>
```

Added in v1.0.0

## traverseNonEmpty

**Signature**

```ts
export declare const traverseNonEmpty: <F extends TypeLambda>(
  F: semiApplicative.SemiApplicative<F>
) => <A, R, O, E, B>(
  f: (a: A) => Kind<F, R, O, E, B>
) => (self: readonly [A, ...A[]]) => Kind<F, R, O, E, readonly [B, ...B[]]>
```

Added in v1.0.0

## traverseNonEmptyWithIndex

**Signature**

```ts
export declare const traverseNonEmptyWithIndex: <F extends TypeLambda>(
  F: semiApplicative.SemiApplicative<F>
) => <A, R, O, E, B>(
  f: (a: A, i: number) => Kind<F, R, O, E, B>
) => (self: readonly [A, ...A[]]) => Kind<F, R, O, E, readonly [B, ...B[]]>
```

Added in v1.0.0

## traverseTap

**Signature**

```ts
export declare const traverseTap: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B>(f: (a: A) => Kind<F, R, O, E, B>) => (self: readonly A[]) => Kind<F, R, O, E, readonly A[]>
```

Added in v1.0.0

## traverseWithIndex

**Signature**

```ts
export declare const traverseWithIndex: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B>(
  f: (a: A, i: number) => Kind<F, R, O, E, B>
) => (self: readonly A[]) => Kind<F, R, O, E, readonly B[]>
```

Added in v1.0.0

# type lambdas

## ReadonlyArrayTypeLambda (interface)

**Signature**

```ts
export interface ReadonlyArrayTypeLambda extends TypeLambda {
  readonly type: ReadonlyArray<this['Target']>
}
```

Added in v1.0.0

# unsafe

## unsafeGet

Gets an element unsafely, will throw on out of bounds.

**Signature**

```ts
export declare const unsafeGet: (index: number) => <A>(self: readonly A[]) => A
```

Added in v1.0.0

# utils

## ap

**Signature**

```ts
export declare const ap: <A>(fa: readonly A[]) => <B>(self: readonly ((a: A) => B)[]) => readonly B[]
```

Added in v1.0.0

## chop

A useful recursion pattern for processing a `ReadonlyArray` to produce a new `ReadonlyArray`, often used for "chopping" up the input
`ReadonlyArray`. Typically chop is called with some function that will consume an initial prefix of the `ReadonlyArray` and produce a
value and the rest of the `ReadonlyArray`.

**Signature**

```ts
export declare const chop: <A, B>(
  f: (as: readonly [A, ...A[]]) => readonly [B, readonly A[]]
) => (self: readonly A[]) => readonly B[]
```

Added in v1.0.0

## chopNonEmpty

A useful recursion pattern for processing a `NonEmptyReadonlyArray` to produce a new `NonEmptyReadonlyArray`, often used for "chopping" up the input
`NonEmptyReadonlyArray`. Typically `chop` is called with some function that will consume an initial prefix of the `NonEmptyReadonlyArray` and produce a
value and the tail of the `NonEmptyReadonlyArray`.

**Signature**

```ts
export declare const chopNonEmpty: <A, B>(
  f: (as: readonly [A, ...A[]]) => readonly [B, readonly A[]]
) => (self: readonly [A, ...A[]]) => readonly [B, ...B[]]
```

Added in v1.0.0

## composeKleisliArrow

**Signature**

```ts
export declare const composeKleisliArrow: <B, C>(
  bfc: (b: B) => readonly C[]
) => <A>(afb: (a: A) => readonly B[]) => (a: A) => readonly C[]
```

Added in v1.0.0

## extend

**Signature**

```ts
export declare const extend: <A, B>(f: (as: readonly A[]) => B) => (self: readonly A[]) => readonly B[]
```

Added in v1.0.0

## has

Alias of [`some`](#some)

**Signature**

```ts
export declare const has: <A>(predicate: Predicate<A>) => (self: readonly A[]) => self is readonly [A, ...A[]]
```

Added in v1.0.0

## intercalate

Fold a data structure, accumulating values in some `Monoid`, combining adjacent elements
using the specified separator.

**Signature**

```ts
export declare const intercalate: <A>(M: Monoid<A>) => (middle: A) => (self: readonly A[]) => A
```

Added in v1.0.0

## intercalateNonEmpty

Places an element in between members of a `NonEmptyReadonlyArray`, then folds the results using the provided `Semigroup`.

**Signature**

```ts
export declare const intercalateNonEmpty: <A>(S: Semigroup<A>) => (middle: A) => (self: readonly [A, ...A[]]) => A
```

Added in v1.0.0

## join

**Signature**

```ts
export declare const join: (sep: string) => (self: ReadonlyArray<string>) => string
```

Added in v1.0.0

## max

**Signature**

```ts
export declare const max: <A>(O: order.Order<A>) => (self: readonly [A, ...A[]]) => A
```

Added in v1.0.0

## min

**Signature**

```ts
export declare const min: <A>(O: order.Order<A>) => (self: readonly [A, ...A[]]) => A
```

Added in v1.0.0

## product

**Signature**

```ts
export declare const product: <B>(that: readonly B[]) => <A>(self: readonly A[]) => readonly (readonly [A, B])[]
```

Added in v1.0.0

## productAll

**Signature**

```ts
export declare const productAll: <A>(collection: Iterable<readonly A[]>) => readonly (readonly A[])[]
```

Added in v1.0.0

## productFlatten

**Signature**

```ts
export declare const productFlatten: <B>(
  that: readonly B[]
) => <A extends readonly unknown[]>(self: readonly A[]) => readonly (readonly [...A, B])[]
```

Added in v1.0.0

## productMany

**Signature**

```ts
export declare const productMany: <A>(
  collection: Iterable<readonly A[]>
) => (self: readonly A[]) => readonly (readonly [A, ...A[]])[]
```

Added in v1.0.0

## reverseNonEmpty

**Signature**

```ts
export declare const reverseNonEmpty: <A>(self: readonly [A, ...A[]]) => readonly [A, ...A[]]
```

Added in v1.0.0

## traverseFilter

Filter values inside a context.

**Signature**

```ts
export declare const traverseFilter: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <B extends A, R, O, E, A = B>(
  predicate: (a: A) => Kind<F, R, O, E, boolean>
) => (self: readonly B[]) => Kind<F, R, O, E, readonly B[]>
```

Added in v1.0.0

## traversePartition

**Signature**

```ts
export declare const traversePartition: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <B extends A, R, O, E, A = B>(
  predicate: (a: A) => Kind<F, R, O, E, boolean>
) => (self: readonly B[]) => Kind<F, R, O, E, readonly [readonly B[], readonly B[]]>
```

Added in v1.0.0
