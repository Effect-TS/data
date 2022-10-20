---
title: NonEmptyReadonlyArray.ts
nav_order: 27
parent: Modules
---

## NonEmptyReadonlyArray overview

Data structure which represents non-empty readonly arrays.

```ts
export type NonEmptyReadonlyArray<A> = ReadonlyArray<A> & {
  readonly 0: A
}
```

Note that you don't need any conversion, a `NonEmptyReadonlyArray` is a `ReadonlyArray`,
so all `ReadonlyArray`'s APIs can be used with a `NonEmptyReadonlyArray` without further ado.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [from](#from)
  - [make](#make)
  - [makeBy](#makeby)
  - [of](#of)
  - [range](#range)
  - [replicate](#replicate)
- [do notation](#do-notation)
  - [Do](#do)
  - [bind](#bind)
  - [bindRight](#bindright)
  - [bindTo](#bindto)
  - [let](#let)
- [folding](#folding)
  - [foldMap](#foldmap)
  - [foldMapWithIndex](#foldmapwithindex)
  - [reduce](#reduce)
  - [reduceKind](#reducekind)
  - [reduceRight](#reduceright)
  - [reduceRightWithIndex](#reducerightwithindex)
  - [reduceWithIndex](#reducewithindex)
- [instances](#instances)
  - [Comonad](#comonad)
  - [FlatMap](#flatmap)
  - [Functor](#functor)
  - [FunctorWithIndex](#functorwithindex)
  - [Monad](#monad)
  - [Monoidal](#monoidal)
  - [Semigroupal](#semigroupal)
  - [Traversable](#traversable)
  - [TraversableWithIndex](#traversablewithindex)
- [lifting](#lifting)
  - [lift2](#lift2)
  - [lift3](#lift3)
- [mapping](#mapping)
  - [as](#as)
  - [flap](#flap)
  - [map](#map)
  - [unit](#unit)
- [models](#models)
  - [NonEmptyReadonlyArray (type alias)](#nonemptyreadonlyarray-type-alias)
- [pattern matching](#pattern-matching)
  - [matchLeft](#matchleft)
  - [matchRight](#matchright)
  - [unappend](#unappend)
  - [unprepend](#unprepend)
- [sequencing](#sequencing)
  - [flatMap](#flatmap)
  - [zipLeft](#zipleft)
  - [zipRight](#zipright)
- [traversing](#traversing)
  - [sequence](#sequence)
  - [traverse](#traverse)
  - [traverseWithIndex](#traversewithindex)
- [tuple sequencing](#tuple-sequencing)
  - [Zip](#zip)
  - [tupled](#tupled)
  - [zipFlatten](#zipflatten)
- [type lambdas](#type-lambdas)
  - [NonEmptyReadonlyArrayTypeLambda (interface)](#nonemptyreadonlyarraytypelambda-interface)
- [unsafe](#unsafe)
  - [unsafeFrom](#unsafefrom)
- [utils](#utils)
  - [ap](#ap)
  - [chop](#chop)
  - [chunksOf](#chunksof)
  - [combineAll](#combineall)
  - [concat](#concat)
  - [cross](#cross)
  - [crossAll](#crossall)
  - [crossMany](#crossmany)
  - [crossWith](#crosswith)
  - [duplicate](#duplicate)
  - [extend](#extend)
  - [extract](#extract)
  - [flatMapWithIndex](#flatmapwithindex)
  - [flatten](#flatten)
  - [group](#group)
  - [groupBy](#groupby)
  - [head](#head)
  - [init](#init)
  - [intercalate](#intercalate)
  - [intersperse](#intersperse)
  - [last](#last)
  - [mapWithIndex](#mapwithindex)
  - [max](#max)
  - [min](#min)
  - [modifyAt](#modifyat)
  - [modifyHead](#modifyhead)
  - [modifyLast](#modifylast)
  - [orElse](#orelse)
  - [prependAll](#prependall)
  - [reverse](#reverse)
  - [rotate](#rotate)
  - [sort](#sort)
  - [sortBy](#sortby)
  - [splitAt](#splitat)
  - [tail](#tail)
  - [tap](#tap)
  - [union](#union)
  - [uniq](#uniq)
  - [unzip](#unzip)
  - [updateAt](#updateat)
  - [updateHead](#updatehead)
  - [updateLast](#updatelast)
  - [zip](#zip)
  - [zipAll](#zipall)
  - [zipMany](#zipmany)
  - [zipWith](#zipwith)

---

# constructors

## from

Builds a `NonEmptyReadonlyArray` from an `Iterable` returning `None` if `as`
is an empty array.

**Signature**

```ts
export declare const from: <A>(iterable: Iterable<A>) => Option<readonly [A, ...A[]]>
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

Return a `NonEmptyReadonlyArray` of length `n` with element `i` initialized with `f(i)`.

**Note**. `n` is normalized to a natural number.

**Signature**

```ts
export declare const makeBy: <A>(f: (i: number) => A) => (n: number) => readonly [A, ...A[]]
```

**Example**

```ts
import { makeBy } from '@fp-ts/data/NonEmptyReadonlyArray'
import { pipe } from '@fp-ts/data/Function'

const double = (n: number): number => n * 2
assert.deepStrictEqual(pipe(5, makeBy(double)), [0, 2, 4, 6, 8])
```

Added in v1.0.0

## of

**Signature**

```ts
export declare const of: <A>(a: A) => readonly [A, ...A[]]
```

Added in v1.0.0

## range

Create a `NonEmptyReadonlyArray` containing a range of integers, including both endpoints.

**Signature**

```ts
export declare const range: (start: number, end: number) => readonly [number, ...number[]]
```

**Example**

```ts
import { range } from '@fp-ts/data/NonEmptyReadonlyArray'

assert.deepStrictEqual(range(1, 5), [1, 2, 3, 4, 5])
```

Added in v1.0.0

## replicate

Create a `NonEmptyReadonlyArray` containing a value repeated the specified number of times.

**Note**. `n` is normalized to a natural number.

**Signature**

```ts
export declare const replicate: <A>(a: A) => (n: number) => readonly [A, ...A[]]
```

**Example**

```ts
import { replicate } from '@fp-ts/data/NonEmptyReadonlyArray'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe(3, replicate('a')), ['a', 'a', 'a'])
```

Added in v1.0.0

# do notation

## Do

**Signature**

```ts
export declare const Do: readonly [{}, ...{}[]]
```

Added in v1.0.0

## bind

**Signature**

```ts
export declare const bind: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => readonly [B, ...B[]]
) => (
  self: readonly [A, ...A[]]
) => readonly [
  { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B },
  ...{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }[]
]
```

Added in v1.0.0

## bindRight

A variant of `bind` that sequentially ignores the scope.

**Signature**

```ts
export declare const bindRight: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  fb: readonly [B, ...B[]]
) => (
  self: readonly [A, ...A[]]
) => readonly [
  { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B },
  ...{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }[]
]
```

Added in v1.0.0

## bindTo

**Signature**

```ts
export declare const bindTo: <N extends string>(
  name: N
) => <A>(self: readonly [A, ...A[]]) => readonly [{ readonly [K in N]: A }, ...{ readonly [K in N]: A }[]]
```

Added in v1.0.0

## let

**Signature**

```ts
export declare const let: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (
  self: readonly [A, ...A[]]
) => readonly [
  { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B },
  ...{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }[]
]
```

Added in v1.0.0

# folding

## foldMap

**Note**. The constraint is relaxed: a `Semigroup` instead of a `Monoid`.

**Signature**

```ts
export declare const foldMap: <S>(S: semigroup.Semigroup<S>) => <A>(f: (a: A) => S) => (self: readonly [A, ...A[]]) => S
```

Added in v1.0.0

## foldMapWithIndex

**Note**. The constraint is relaxed: a `Semigroup` instead of a `Monoid`.

**Signature**

```ts
export declare const foldMapWithIndex: <S>(
  S: semigroup.Semigroup<S>
) => <A>(f: (i: number, a: A) => S) => (self: readonly [A, ...A[]]) => S
```

Added in v1.0.0

## reduce

**Signature**

```ts
export declare const reduce: <B, A>(b: B, f: (b: B, a: A) => B) => (self: readonly [A, ...A[]]) => B
```

Added in v1.0.0

## reduceKind

**Signature**

```ts
export declare const reduceKind: <F extends TypeLambda>(
  Flattenable: flatMap_.FlatMap<F>
) => <S, R, O, E, B, A>(
  fb: Kind<F, S, R, O, E, B>,
  f: (b: B, a: A) => Kind<F, S, R, O, E, B>
) => (self: readonly [A, ...A[]]) => Kind<F, S, R, O, E, B>
```

Added in v1.0.0

## reduceRight

**Signature**

```ts
export declare const reduceRight: <B, A>(b: B, f: (a: A, b: B) => B) => (self: readonly [A, ...A[]]) => B
```

Added in v1.0.0

## reduceRightWithIndex

**Signature**

```ts
export declare const reduceRightWithIndex: <B, A>(
  b: B,
  f: (i: number, a: A, b: B) => B
) => (self: readonly [A, ...A[]]) => B
```

Added in v1.0.0

## reduceWithIndex

**Signature**

```ts
export declare const reduceWithIndex: <B, A>(b: B, f: (i: number, b: B, a: A) => B) => (self: readonly [A, ...A[]]) => B
```

Added in v1.0.0

# instances

## Comonad

**Signature**

```ts
export declare const Comonad: comonad.Comonad<NonEmptyReadonlyArrayTypeLambda>
```

Added in v1.0.0

## FlatMap

**Signature**

```ts
export declare const FlatMap: flatMap_.FlatMap<NonEmptyReadonlyArrayTypeLambda>
```

Added in v1.0.0

## Functor

**Signature**

```ts
export declare const Functor: functor.Functor<NonEmptyReadonlyArrayTypeLambda>
```

Added in v1.0.0

## FunctorWithIndex

**Signature**

```ts
export declare const FunctorWithIndex: functorWithIndex.FunctorWithIndex<NonEmptyReadonlyArrayTypeLambda, number>
```

Added in v1.0.0

## Monad

**Signature**

```ts
export declare const Monad: monad.Monad<NonEmptyReadonlyArrayTypeLambda>
```

Added in v1.0.0

## Monoidal

**Signature**

```ts
export declare const Monoidal: monoidal.Monoidal<NonEmptyReadonlyArrayTypeLambda>
```

Added in v1.0.0

## Semigroupal

**Signature**

```ts
export declare const Semigroupal: semigroupal.Semigroupal<NonEmptyReadonlyArrayTypeLambda>
```

Added in v1.0.0

## Traversable

**Signature**

```ts
export declare const Traversable: traversable.Traversable<NonEmptyReadonlyArrayTypeLambda>
```

Added in v1.0.0

## TraversableWithIndex

**Signature**

```ts
export declare const TraversableWithIndex: traversableWithIndex.TraversableWithIndex<
  NonEmptyReadonlyArrayTypeLambda,
  number
>
```

Added in v1.0.0

# lifting

## lift2

Lifts a binary function into `NonEmptyReadonlyArray`.

**Signature**

```ts
export declare const lift2: <A, B, C>(
  f: (a: A, b: B) => C
) => (fa: readonly [A, ...A[]], fb: readonly [B, ...B[]]) => readonly [C, ...C[]]
```

Added in v1.0.0

## lift3

Lifts a ternary function into `NonEmptyReadonlyArray`.

**Signature**

```ts
export declare const lift3: <A, B, C, D>(
  f: (a: A, b: B, c: C) => D
) => (fa: readonly [A, ...A[]], fb: readonly [B, ...B[]], fc: readonly [C, ...C[]]) => readonly [D, ...D[]]
```

Added in v1.0.0

# mapping

## as

Maps the success value of this effect to the specified constant value.

**Signature**

```ts
export declare const as: <B>(b: B) => (self: readonly [unknown, ...unknown[]]) => readonly [B, ...B[]]
```

Added in v1.0.0

## flap

**Signature**

```ts
export declare const flap: <A>(a: A) => <B>(fab: readonly [(a: A) => B, ...((a: A) => B)[]]) => readonly [B, ...B[]]
```

Added in v1.0.0

## map

Returns an effect whose success is mapped by the specified `f` function.

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (self: readonly [A, ...A[]]) => readonly [B, ...B[]]
```

Added in v1.0.0

## unit

Returns the effect resulting from mapping the success of this effect to unit.

**Signature**

```ts
export declare const unit: (self: readonly [unknown, ...unknown[]]) => readonly [void, ...void[]]
```

Added in v1.0.0

# models

## NonEmptyReadonlyArray (type alias)

**Signature**

```ts
export type NonEmptyReadonlyArray<A> = readonly [A, ...Array<A>]
```

Added in v1.0.0

# pattern matching

## matchLeft

Break a `ReadonlyArray` into its first element and remaining elements.

**Signature**

```ts
export declare const matchLeft: <A, B>(f: (head: A, tail: readonly A[]) => B) => (as: readonly [A, ...A[]]) => B
```

Added in v1.0.0

## matchRight

Break a `ReadonlyArray` into its initial elements and the last element.

**Signature**

```ts
export declare const matchRight: <A, B>(f: (init: readonly A[], last: A) => B) => (as: readonly [A, ...A[]]) => B
```

Added in v1.0.0

## unappend

Produces a couple of a copy of the array without its last element, and that last element.

**Signature**

```ts
export declare const unappend: <A>(as: readonly [A, ...A[]]) => readonly [readonly A[], A]
```

**Example**

```ts
import { unappend } from '@fp-ts/data/NonEmptyReadonlyArray'

assert.deepStrictEqual(unappend([1, 2, 3, 4]), [[1, 2, 3], 4])
```

Added in v1.0.0

## unprepend

Produces a couple of the first element of the array, and a new array of the remaining elements, if any.

**Signature**

```ts
export declare const unprepend: <A>(as: readonly [A, ...A[]]) => readonly [A, readonly A[]]
```

**Example**

```ts
import { unprepend } from '@fp-ts/data/NonEmptyReadonlyArray'

assert.deepStrictEqual(unprepend([1, 2, 3, 4]), [1, [2, 3, 4]])
```

Added in v1.0.0

# sequencing

## flatMap

**Signature**

```ts
export declare const flatMap: <A, B>(
  f: (a: A) => readonly [B, ...B[]]
) => (self: readonly [A, ...A[]]) => readonly [B, ...B[]]
```

**Example**

```ts
import * as RNEA from '@fp-ts/data/NonEmptyReadonlyArray'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(
  pipe(
    [1, 2, 3],
    RNEA.flatMap((n) => [`a${n}`, `b${n}`])
  ),
  ['a1', 'b1', 'a2', 'b2', 'a3', 'b3']
)
```

Added in v1.0.0

## zipLeft

Sequences the specified effect after this effect, but ignores the value
produced by the effect.

**Signature**

```ts
export declare const zipLeft: (
  second: readonly [unknown, ...unknown[]]
) => <A>(self: readonly [A, ...A[]]) => readonly [A, ...A[]]
```

Added in v1.0.0

## zipRight

A variant of `flatMap` that ignores the value produced by this effect.

**Signature**

```ts
export declare const zipRight: <A>(
  second: readonly [A, ...A[]]
) => (self: readonly [unknown, ...unknown[]]) => readonly [A, ...A[]]
```

Added in v1.0.0

# traversing

## sequence

**Signature**

```ts
export declare const sequence: <F extends TypeLambda>(
  Semigroupal: semigroupal.Semigroupal<F>
) => <S, R, O, E, A>(
  self: readonly [Kind<F, S, R, O, E, A>, ...Kind<F, S, R, O, E, A>[]]
) => Kind<F, S, R, O, E, readonly [A, ...A[]]>
```

Added in v1.0.0

## traverse

**Signature**

```ts
export declare const traverse: <F extends TypeLambda>(
  Semigroupal: semigroupal.Semigroupal<F>
) => <A, S, R, O, E, B>(
  f: (a: A) => Kind<F, S, R, O, E, B>
) => (self: readonly [A, ...A[]]) => Kind<F, S, R, O, E, readonly [B, ...B[]]>
```

Added in v1.0.0

## traverseWithIndex

**Signature**

```ts
export declare const traverseWithIndex: <F extends TypeLambda>(
  Semigroupal: semigroupal.Semigroupal<F>
) => <A, S, R, O, E, B>(
  f: (a: A, i: number) => Kind<F, S, R, O, E, B>
) => (self: readonly [A, ...A[]]) => Kind<F, S, R, O, E, readonly [B, ...B[]]>
```

Added in v1.0.0

# tuple sequencing

## Zip

**Signature**

```ts
export declare const Zip: readonly [readonly [], ...(readonly [])[]]
```

Added in v1.0.0

## tupled

**Signature**

```ts
export declare const tupled: <A>(self: readonly [A, ...A[]]) => readonly [readonly [A], ...(readonly [A])[]]
```

Added in v1.0.0

## zipFlatten

Sequentially zips this effect with the specified effect.

**Signature**

```ts
export declare const zipFlatten: <B>(
  fb: readonly [B, ...B[]]
) => <A extends readonly unknown[]>(
  self: readonly [A, ...A[]]
) => readonly [readonly [...A, B], ...(readonly [...A, B])[]]
```

Added in v1.0.0

# type lambdas

## NonEmptyReadonlyArrayTypeLambda (interface)

**Signature**

```ts
export interface NonEmptyReadonlyArrayTypeLambda extends TypeLambda {
  readonly type: NonEmptyReadonlyArray<this['Out1']>
}
```

Added in v1.0.0

# unsafe

## unsafeFrom

Unsafely builds a `NonEmptyReadonlyArray` from an `Iterable`.

**Note**: this method will throw an error if an empty `Iterable` is provided.

**Signature**

```ts
export declare const unsafeFrom: <A>(iterable: Iterable<A>) => readonly [A, ...A[]]
```

Added in v1.0.0

# utils

## ap

**Signature**

```ts
export declare const ap: <A>(
  fa: readonly [A, ...A[]]
) => <B>(self: readonly [(a: A) => B, ...((a: A) => B)[]]) => readonly [B, ...B[]]
```

Added in v1.0.0

## chop

A useful recursion pattern for processing a `NonEmptyReadonlyArray` to produce a new `NonEmptyReadonlyArray`, often used for "chopping" up the input
`NonEmptyReadonlyArray`. Typically `chop` is called with some function that will consume an initial prefix of the `NonEmptyReadonlyArray` and produce a
value and the tail of the `NonEmptyReadonlyArray`.

**Signature**

```ts
export declare const chop: <A, B>(
  f: (as: readonly [A, ...A[]]) => readonly [B, readonly A[]]
) => (as: readonly [A, ...A[]]) => readonly [B, ...B[]]
```

Added in v1.0.0

## chunksOf

Splits a `NonEmptyReadonlyArray` into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
the `NonEmptyReadonlyArray`.

**Signature**

```ts
export declare const chunksOf: (
  n: number
) => <A>(as: readonly [A, ...A[]]) => readonly [readonly [A, ...A[]], ...(readonly [A, ...A[]])[]]
```

Added in v1.0.0

## combineAll

**Signature**

```ts
export declare const combineAll: <A>(S: semigroup.Semigroup<A>) => (fa: readonly [A, ...A[]]) => A
```

Added in v1.0.0

## concat

**Signature**

```ts
export declare function concat<B>(
  that: NonEmptyReadonlyArray<B>
): <A>(self: ReadonlyArray<A>) => NonEmptyReadonlyArray<A | B>
export declare function concat<B>(
  that: ReadonlyArray<B>
): <A>(self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<A | B>
```

Added in v1.0.0

## cross

**Signature**

```ts
export declare const cross: <B>(
  that: readonly [B, ...B[]]
) => <A>(self: readonly [A, ...A[]]) => readonly [readonly [A, B], ...(readonly [A, B])[]]
```

Added in v1.0.0

## crossAll

**Signature**

```ts
export declare const crossAll: <A>(
  collection: Iterable<readonly [A, ...A[]]>
) => readonly [readonly A[], ...(readonly A[])[]]
```

Added in v1.0.0

## crossMany

**Signature**

```ts
export declare const crossMany: <A>(
  collection: Iterable<readonly [A, ...A[]]>
) => (self: readonly [A, ...A[]]) => readonly [readonly [A, ...A[]], ...(readonly [A, ...A[]])[]]
```

Added in v1.0.0

## crossWith

**Signature**

```ts
export declare const crossWith: <B, A, C>(
  that: readonly [B, ...B[]],
  f: (a: A, b: B) => C
) => (self: readonly [A, ...A[]]) => readonly [C, ...C[]]
```

Added in v1.0.0

## duplicate

**Signature**

```ts
export declare const duplicate: <A>(
  ma: readonly [A, ...A[]]
) => readonly [readonly [A, ...A[]], ...(readonly [A, ...A[]])[]]
```

Added in v1.0.0

## extend

**Signature**

```ts
export declare const extend: <A, B>(
  f: (as: readonly [A, ...A[]]) => B
) => (as: readonly [A, ...A[]]) => readonly [B, ...B[]]
```

Added in v1.0.0

## extract

**Signature**

```ts
export declare const extract: <A>(self: readonly [A, ...A[]]) => A
```

Added in v1.0.0

## flatMapWithIndex

**Signature**

```ts
export declare const flatMapWithIndex: <A, B>(
  f: (i: number, a: A) => readonly [B, ...B[]]
) => (self: readonly [A, ...A[]]) => readonly [B, ...B[]]
```

Added in v1.0.0

## flatten

**Signature**

```ts
export declare const flatten: <A>(
  mma: readonly [readonly [A, ...A[]], ...(readonly [A, ...A[]])[]]
) => readonly [A, ...A[]]
```

Added in v1.0.0

## group

Group equal, consecutive elements of an array into non empty arrays.

**Signature**

```ts
export declare const group: <A>(
  as: readonly [A, ...A[]]
) => readonly [readonly [A, ...A[]], ...(readonly [A, ...A[]])[]]
```

**Example**

```ts
import { group } from '@fp-ts/data/NonEmptyReadonlyArray'

assert.deepStrictEqual(group([1, 2, 1, 1]), [[1], [2], [1, 1]])
```

Added in v1.0.0

## groupBy

Splits an array into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
function on each element, and grouping the results according to values returned

**Signature**

```ts
export declare const groupBy: <A>(
  f: (a: A) => string
) => (as: readonly A[]) => Readonly<Record<string, readonly [A, ...A[]]>>
```

**Example**

```ts
import { groupBy } from '@fp-ts/data/NonEmptyReadonlyArray'

assert.deepStrictEqual(groupBy((s: string) => String(s.length))(['foo', 'bar', 'foobar']), {
  '3': ['foo', 'bar'],
  '6': ['foobar'],
})
```

Added in v1.0.0

## head

**Signature**

```ts
export declare const head: <A>(as: readonly [A, ...A[]]) => A
```

Added in v1.0.0

## init

Get all but the last element of a non empty array, creating a new array.

**Signature**

```ts
export declare const init: <A>(as: readonly [A, ...A[]]) => readonly A[]
```

**Example**

```ts
import { init } from '@fp-ts/data/NonEmptyReadonlyArray'

assert.deepStrictEqual(init([1, 2, 3]), [1, 2])
assert.deepStrictEqual(init([1]), [])
```

Added in v1.0.0

## intercalate

Places an element in between members of a `NonEmptyReadonlyArray`, then folds the results using the provided `Semigroup`.

**Signature**

```ts
export declare const intercalate: <A>(S: semigroup.Semigroup<A>) => (middle: A) => (as: readonly [A, ...A[]]) => A
```

**Example**

```ts
import * as S from '@fp-ts/data/String'
import { intercalate } from '@fp-ts/data/NonEmptyReadonlyArray'

assert.deepStrictEqual(intercalate(S.Semigroup)('-')(['a', 'b', 'c']), 'a-b-c')
```

Added in v1.0.0

## intersperse

Places an element in between members of an array

**Signature**

```ts
export declare const intersperse: <A>(middle: A) => (as: readonly [A, ...A[]]) => readonly [A, ...A[]]
```

**Example**

```ts
import { intersperse } from '@fp-ts/data/NonEmptyReadonlyArray'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe([1, 2, 3, 4], intersperse(9)), [1, 9, 2, 9, 3, 9, 4])
```

Added in v1.0.0

## last

**Signature**

```ts
export declare const last: <A>(as: readonly [A, ...A[]]) => A
```

Added in v1.0.0

## mapWithIndex

**Signature**

```ts
export declare const mapWithIndex: <A, B>(
  f: (a: A, i: number) => B
) => (self: readonly [A, ...A[]]) => readonly [B, ...B[]]
```

Added in v1.0.0

## max

**Signature**

```ts
export declare const max: <A>(O: sortable.Sortable<A>) => (as: readonly [A, ...A[]]) => A
```

Added in v1.0.0

## min

**Signature**

```ts
export declare const min: <A>(O: sortable.Sortable<A>) => (as: readonly [A, ...A[]]) => A
```

Added in v1.0.0

## modifyAt

Apply a function to the element at the specified index, creating a new `NonEmptyReadonlyArray`, or returning `None` if the index is out
of bounds.

**Signature**

```ts
export declare const modifyAt: <A>(
  i: number,
  f: (a: A) => A
) => (self: readonly [A, ...A[]]) => Option<readonly [A, ...A[]]>
```

Added in v1.0.0

## modifyHead

Apply a function to the head, creating a new `NonEmptyReadonlyArray`.

**Signature**

```ts
export declare const modifyHead: <A>(f: Endomorphism<A>) => (as: readonly [A, ...A[]]) => readonly [A, ...A[]]
```

Added in v1.0.0

## modifyLast

Apply a function to the last element, creating a new `NonEmptyReadonlyArray`.

**Signature**

```ts
export declare const modifyLast: <A>(f: Endomorphism<A>) => (as: readonly [A, ...A[]]) => readonly [A, ...A[]]
```

Added in v1.0.0

## orElse

Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
types of kind `* -> *`.

In case of `NonEmptyReadonlyArray` concatenates the inputs into a single array.

**Signature**

```ts
export declare const orElse: <B>(
  that: readonly [B, ...B[]]
) => <A>(self: readonly [A, ...A[]]) => readonly [B | A, ...(B | A)[]]
```

**Example**

```ts
import * as RNEA from '@fp-ts/data/NonEmptyReadonlyArray'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe([1, 2, 3] as const, RNEA.orElse([4, 5])), [1, 2, 3, 4, 5])
```

Added in v1.0.0

## prependAll

Prepend an element to every member of an array

**Signature**

```ts
export declare const prependAll: <A>(middle: A) => (as: readonly [A, ...A[]]) => readonly [A, ...A[]]
```

**Example**

```ts
import { prependAll } from '@fp-ts/data/NonEmptyReadonlyArray'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe([1, 2, 3, 4], prependAll(9)), [9, 1, 9, 2, 9, 3, 9, 4])
```

Added in v1.0.0

## reverse

**Signature**

```ts
export declare const reverse: <A>(as: readonly [A, ...A[]]) => readonly [A, ...A[]]
```

Added in v1.0.0

## rotate

Rotate a `NonEmptyReadonlyArray` by `n` steps.

**Signature**

```ts
export declare const rotate: (n: number) => <A>(as: readonly [A, ...A[]]) => readonly [A, ...A[]]
```

**Example**

```ts
import { rotate } from '@fp-ts/data/NonEmptyReadonlyArray'

assert.deepStrictEqual(rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
assert.deepStrictEqual(rotate(-2)([1, 2, 3, 4, 5]), [3, 4, 5, 1, 2])
```

Added in v1.0.0

## sort

Sort the elements of a `NonEmptyReadonlyArray` in increasing order, creating a new `NonEmptyReadonlyArray`.

**Signature**

```ts
export declare const sort: <B>(
  O: sortable.Sortable<B>
) => <A extends B>(as: readonly [A, ...A[]]) => readonly [A, ...A[]]
```

Added in v1.0.0

## sortBy

Sort the elements of a `NonEmptyReadonlyArray` in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
etc...

**Signature**

```ts
export declare const sortBy: <B>(
  ords: readonly sortable.Sortable<B>[]
) => <A extends B>(as: readonly [A, ...A[]]) => readonly [A, ...A[]]
```

**Example**

```ts
import * as RNEA from '@fp-ts/data/NonEmptyReadonlyArray'
import { contramap } from '@fp-ts/core/Sortable'
import * as S from '@fp-ts/data/String'
import * as N from '@fp-ts/data/Number'
import { pipe } from '@fp-ts/data/Function'

interface Person {
  name: string
  age: number
}

const byName = pipe(
  S.Sortable,
  contramap((p: Person) => p.name)
)

const byAge = pipe(
  N.Sortable,
  contramap((p: Person) => p.age)
)

const sortByNameByAge = RNEA.sortBy([byName, byAge])

const persons: RNEA.NonEmptyReadonlyArray<Person> = [
  { name: 'a', age: 1 },
  { name: 'b', age: 3 },
  { name: 'c', age: 2 },
  { name: 'b', age: 2 },
]

assert.deepStrictEqual(sortByNameByAge(persons), [
  { name: 'a', age: 1 },
  { name: 'b', age: 2 },
  { name: 'b', age: 3 },
  { name: 'c', age: 2 },
])
```

Added in v1.0.0

## splitAt

Splits a `NonEmptyReadonlyArray` into two pieces, the first piece has max `n` elements.

**Signature**

```ts
export declare const splitAt: (
  n: number
) => <A>(as: readonly [A, ...A[]]) => readonly [readonly [A, ...A[]], readonly A[]]
```

Added in v1.0.0

## tail

**Signature**

```ts
export declare const tail: <A>(as: readonly [A, ...A[]]) => readonly A[]
```

Added in v1.0.0

## tap

Returns an effect that effectfully "peeks" at the success of this effect.

**Signature**

```ts
export declare const tap: <A>(
  f: (a: A) => readonly [unknown, ...unknown[]]
) => (self: readonly [A, ...A[]]) => readonly [A, ...A[]]
```

**Example**

```ts
import * as RA from '@fp-ts/data/ReadonlyArray'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(
  pipe(
    [1, 2, 3],
    RA.tap(() => ['a', 'b'])
  ),
  [1, 1, 2, 2, 3, 3]
)
```

Added in v1.0.0

## union

Creates a `ReadonlyArray` of unique values, in order, from all given `ReadonlyArray`s using a `Eq` for equality comparisons.

**Signature**

```ts
export declare const union: <B>(that: readonly B[]) => <A>(self: readonly [A, ...A[]]) => readonly [B | A, ...(B | A)[]]
```

**Example**

```ts
import { union } from '@fp-ts/data/ReadonlyArray'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe([1, 2], union([2, 3])), [1, 2, 3])
```

Added in v1.0.0

## uniq

Remove duplicates from a `NonEmptyReadonlyArray`, keeping the first occurrence of an element.

**Signature**

```ts
export declare const uniq: <A>(self: readonly [A, ...A[]]) => readonly [A, ...A[]]
```

**Example**

```ts
import { uniq } from '@fp-ts/data/NonEmptyReadonlyArray'

assert.deepStrictEqual(uniq([1, 2, 1]), [1, 2])
```

Added in v1.0.0

## unzip

**Signature**

```ts
export declare const unzip: <A, B>(
  abs: readonly [readonly [A, B], ...(readonly [A, B])[]]
) => readonly [readonly [A, ...A[]], readonly [B, ...B[]]]
```

Added in v1.0.0

## updateAt

Change the element at the specified index, creating a new `NonEmptyReadonlyArray`, or returning `None` if the index is out of bounds.

**Signature**

```ts
export declare const updateAt: <A>(i: number, a: A) => (as: readonly [A, ...A[]]) => Option<readonly [A, ...A[]]>
```

Added in v1.0.0

## updateHead

Change the head, creating a new `NonEmptyReadonlyArray`.

**Signature**

```ts
export declare const updateHead: <A>(a: A) => (as: readonly [A, ...A[]]) => readonly [A, ...A[]]
```

Added in v1.0.0

## updateLast

Change the last element, creating a new `NonEmptyReadonlyArray`.

**Signature**

```ts
export declare const updateLast: <A>(a: A) => (as: readonly [A, ...A[]]) => readonly [A, ...A[]]
```

Added in v1.0.0

## zip

**Signature**

```ts
export declare const zip: <B>(
  bs: readonly [B, ...B[]]
) => <A>(as: readonly [A, ...A[]]) => readonly [readonly [A, B], ...(readonly [A, B])[]]
```

Added in v1.0.0

## zipAll

**Signature**

```ts
export declare const zipAll: <A>(
  collection: Iterable<readonly [A, ...A[]]>
) => readonly [readonly A[], ...(readonly A[])[]]
```

Added in v1.0.0

## zipMany

**Signature**

```ts
export declare const zipMany: <A>(
  collection: Iterable<readonly [A, ...A[]]>
) => (self: readonly [A, ...A[]]) => readonly [readonly [A, ...A[]], ...(readonly [A, ...A[]])[]]
```

Added in v1.0.0

## zipWith

**Signature**

```ts
export declare const zipWith: <B, A, C>(
  bs: readonly [B, ...B[]],
  f: (a: A, b: B) => C
) => (as: readonly [A, ...A[]]) => readonly [C, ...C[]]
```

Added in v1.0.0
