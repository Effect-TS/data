---
title: Option.ts
nav_order: 27
parent: Modules
---

## Option overview

```ts
type Option<A> = None | Some<A>
```

`Option<A>` is a container for an optional value of type `A`. If the value of type `A` is present, the `Option<A>` is
an instance of `Some<A>`, containing the present value of type `A`. If the value is absent, the `Option<A>` is an
instance of `None`.

An option could be looked at as a collection or foldable structure with either one or zero elements.
Another way to look at `Option` is: it represents the effect of a possibly failing computation.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combining](#combining)
  - [getFirstNoneMonoid](#getfirstnonemonoid)
  - [getFirstNoneSemigroup](#getfirstnonesemigroup)
  - [getFirstSomeSemigroup](#getfirstsomesemigroup)
- [constructors](#constructors)
  - [none](#none)
  - [of](#of)
  - [some](#some)
- [conversions](#conversions)
  - [fromEither](#fromeither)
  - [fromIterable](#fromiterable)
  - [fromNullable](#fromnullable)
  - [getOrNull](#getornull)
  - [getOrUndefined](#getorundefined)
  - [toEither](#toeither)
  - [toRefinement](#torefinement)
- [debugging](#debugging)
  - [inspectNone](#inspectnone)
  - [inspectSome](#inspectsome)
- [do notation](#do-notation)
  - [Do](#do)
  - [andThenBind](#andthenbind)
  - [bind](#bind)
  - [bindTo](#bindto)
  - [let](#let)
- [error handling](#error-handling)
  - [catchAll](#catchall)
  - [firstSomeOf](#firstsomeof)
  - [getOrElse](#getorelse)
  - [orElse](#orelse)
  - [orElseEither](#orelseeither)
  - [orElseSucceed](#orelsesucceed)
- [filtering](#filtering)
  - [compact](#compact)
  - [filter](#filter)
  - [filterMap](#filtermap)
  - [separate](#separate)
- [guards](#guards)
  - [isNone](#isnone)
  - [isOption](#isoption)
  - [isSome](#issome)
- [instances](#instances)
  - [Alternative](#alternative)
  - [Applicative](#applicative)
  - [Chainable](#chainable)
  - [Compactable](#compactable)
  - [Coproduct](#coproduct)
  - [Covariant](#covariant)
  - [Filterable](#filterable)
  - [FlatMap](#flatmap)
  - [Foldable](#foldable)
  - [Invariant](#invariant)
  - [Monad](#monad)
  - [Of](#of)
  - [Pointed](#pointed)
  - [Product](#product)
  - [SemiAlternative](#semialternative)
  - [SemiApplicative](#semiapplicative)
  - [SemiCoproduct](#semicoproduct)
  - [SemiProduct](#semiproduct)
  - [Traversable](#traversable)
- [interop](#interop)
  - [fromThrowable](#fromthrowable)
  - [getOrThrow](#getorthrow)
  - [liftThrowable](#liftthrowable)
- [lifting](#lifting)
  - [getMonoid](#getmonoid)
  - [lift2](#lift2)
  - [lift3](#lift3)
  - [liftEither](#lifteither)
  - [liftNullable](#liftnullable)
  - [liftPredicate](#liftpredicate)
- [mapping](#mapping)
  - [as](#as)
  - [asUnit](#asunit)
  - [flap](#flap)
  - [imap](#imap)
  - [map](#map)
- [models](#models)
  - [None (interface)](#none-interface)
  - [Option (type alias)](#option-type-alias)
  - [Some (interface)](#some-interface)
- [pattern matching](#pattern-matching)
  - [match](#match)
- [sequencing](#sequencing)
  - [andThenDiscard](#andthendiscard)
  - [flatMap](#flatmap)
  - [flatMapEither](#flatmapeither)
  - [flatMapNullable](#flatmapnullable)
- [sorting](#sorting)
  - [liftOrder](#liftorder)
- [traversing](#traversing)
  - [sequence](#sequence)
  - [traverse](#traverse)
  - [traverseTap](#traversetap)
- [type lambdas](#type-lambdas)
  - [OptionTypeLambda (interface)](#optiontypelambda-interface)
- [utils](#utils)
  - [andThen](#andthen)
  - [ap](#ap)
  - [composeKleisliArrow](#composekleisliarrow)
  - [coproduct](#coproduct)
  - [coproductAll](#coproductall)
  - [coproductEither](#coproducteither)
  - [elem](#elem)
  - [exists](#exists)
  - [flatten](#flatten)
  - [product](#product)
  - [productAll](#productall)
  - [productFlatten](#productflatten)
  - [productMany](#productmany)
  - [struct](#struct)
  - [tap](#tap)
  - [tuple](#tuple)
  - [tupled](#tupled)
  - [unit](#unit)
  - [zero](#zero)

---

# combining

## getFirstNoneMonoid

Monoid returning the left-most `None` value. If both operands are `Right`s then the inner values
are concatenated using the provided `Monoid`.

The `empty` value is `some(M.empty)`.

**Signature**

```ts
export declare const getFirstNoneMonoid: <A>(M: Monoid<A>) => Monoid<Option<A>>
```

Added in v1.0.0

## getFirstNoneSemigroup

Semigroup returning the left-most `None` value. If both operands are `Right`s then the inner values
are concatenated using the provided `Semigroup`.

**Signature**

```ts
export declare const getFirstNoneSemigroup: <A>(S: Semigroup<A>) => Semigroup<Option<A>>
```

Added in v1.0.0

## getFirstSomeSemigroup

Semigroup returning the left-most `Some` value.

**Signature**

```ts
export declare const getFirstSomeSemigroup: <A>() => Semigroup<Option<A>>
```

Added in v1.0.0

# constructors

## none

`None` doesn't have a constructor, instead you can use it directly as a value. Represents a missing value.

**Signature**

```ts
export declare const none: Option<never>
```

Added in v1.0.0

## of

**Signature**

```ts
export declare const of: <A>(a: A) => Option<A>
```

Added in v1.0.0

## some

**Signature**

```ts
export declare const some: <A>(a: A) => Option<A>
```

Added in v1.0.0

# conversions

## fromEither

Converts a `Either` to an `Option` discarding the error.

**Signature**

```ts
export declare const fromEither: <E, A>(self: Either<E, A>) => Option<A>
```

**Example**

```ts
import * as O from '@fp-ts/data/Option'
import * as E from '@fp-ts/data/Either'

assert.deepStrictEqual(O.fromEither(E.right(1)), O.some(1))
assert.deepStrictEqual(O.fromEither(E.left('a')), O.none)
```

Added in v1.0.0

## fromIterable

**Signature**

```ts
export declare const fromIterable: <A>(collection: Iterable<A>) => Option<A>
```

Added in v1.0.0

## fromNullable

Constructs a new `Option` from a nullable type. If the value is `null` or `undefined`, returns `None`, otherwise
returns the value wrapped in a `Some`.

**Signature**

```ts
export declare const fromNullable: <A>(a: A) => Option<NonNullable<A>>
```

**Example**

```ts
import { none, some, fromNullable } from '@fp-ts/data/Option'

assert.deepStrictEqual(fromNullable(undefined), none)
assert.deepStrictEqual(fromNullable(null), none)
assert.deepStrictEqual(fromNullable(1), some(1))
```

Added in v1.0.0

## getOrNull

Extracts the value out of the structure, if it exists. Otherwise returns `null`.

**Signature**

```ts
export declare const getOrNull: <A>(self: Option<A>) => A | null
```

**Example**

```ts
import { some, none, getOrNull } from '@fp-ts/data/Option'
import { pipe } from '@fp-ts/data/Function'

assert.strictEqual(pipe(some(1), getOrNull), 1)
assert.strictEqual(pipe(none, getOrNull), null)
```

Added in v1.0.0

## getOrUndefined

Extracts the value out of the structure, if it exists. Otherwise returns `undefined`.

**Signature**

```ts
export declare const getOrUndefined: <A>(self: Option<A>) => A | undefined
```

**Example**

```ts
import { some, none, getOrUndefined } from '@fp-ts/data/Option'
import { pipe } from '@fp-ts/data/Function'

assert.strictEqual(pipe(some(1), getOrUndefined), 1)
assert.strictEqual(pipe(none, getOrUndefined), undefined)
```

Added in v1.0.0

## toEither

**Signature**

```ts
export declare const toEither: <E>(onNone: E) => <A>(self: Option<A>) => Either<E, A>
```

Added in v1.0.0

## toRefinement

Returns a `Refinement` from a `Option` returning function.
This function ensures that a `Refinement` definition is type-safe.

**Signature**

```ts
export declare const toRefinement: <A, B extends A>(f: (a: A) => Option<B>) => Refinement<A, B>
```

Added in v1.0.0

# debugging

## inspectNone

**Signature**

```ts
export declare const inspectNone: (onNone: () => void) => <A>(self: Option<A>) => Option<A>
```

Added in v1.0.0

## inspectSome

**Signature**

```ts
export declare const inspectSome: <A>(onSome: (a: A) => void) => (self: Option<A>) => Option<A>
```

Added in v1.0.0

# do notation

## Do

**Signature**

```ts
export declare const Do: Option<{}>
```

Added in v1.0.0

## andThenBind

A variant of `bind` that sequentially ignores the scope.

**Signature**

```ts
export declare const andThenBind: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  fb: Option<B>
) => (self: Option<A>) => Option<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## bind

**Signature**

```ts
export declare const bind: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Option<B>
) => (self: Option<A>) => Option<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## bindTo

**Signature**

```ts
export declare const bindTo: <N extends string>(name: N) => <A>(self: Option<A>) => Option<{ readonly [K in N]: A }>
```

Added in v1.0.0

## let

**Signature**

```ts
export declare const let: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (self: Option<A>) => Option<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

# error handling

## catchAll

Lazy version of `orElse`.

**Signature**

```ts
export declare const catchAll: <B>(that: LazyArg<Option<B>>) => <A>(self: Option<A>) => Option<B | A>
```

Added in v1.0.0

## firstSomeOf

**Signature**

```ts
export declare const firstSomeOf: <A>(collection: Iterable<Option<A>>) => (self: Option<A>) => Option<A>
```

Added in v1.0.0

## getOrElse

Extracts the value out of the structure, if it exists. Otherwise returns the given default value

**Signature**

```ts
export declare const getOrElse: <B>(onNone: B) => <A>(self: Option<A>) => B | A
```

**Example**

```ts
import { some, none, getOrElse } from '@fp-ts/data/Option'
import { pipe } from '@fp-ts/data/Function'

assert.strictEqual(pipe(some(1), getOrElse(0)), 1)
assert.strictEqual(pipe(none, getOrElse(0)), 0)
```

Added in v1.0.0

## orElse

Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
types of kind `* -> *`.

In case of `Option` returns the left-most non-`None` value.

| x       | y       | pipe(x, orElse(y) |
| ------- | ------- | ----------------- |
| none    | none    | none              |
| some(a) | none    | some(a)           |
| none    | some(b) | some(b)           |
| some(a) | some(b) | some(a)           |

**Signature**

```ts
export declare const orElse: <B>(that: Option<B>) => <A>(self: Option<A>) => Option<B | A>
```

**Example**

```ts
import * as O from '@fp-ts/data/Option'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe(O.none, O.orElse(O.none)), O.none)
assert.deepStrictEqual(pipe(O.some('a'), O.orElse<string>(O.none)), O.some('a'))
assert.deepStrictEqual(pipe(O.none, O.orElse(O.some('b'))), O.some('b'))
assert.deepStrictEqual(pipe(O.some('a'), O.orElse(O.some('b'))), O.some('a'))
```

Added in v1.0.0

## orElseEither

Returns an effect that will produce the value of this effect, unless it
fails, in which case, it will produce the value of the specified effect.

**Signature**

```ts
export declare const orElseEither: <B>(that: Option<B>) => <A>(self: Option<A>) => Option<Either<A, B>>
```

Added in v1.0.0

## orElseSucceed

Executes this effect and returns its value, if it succeeds, but otherwise
succeeds with the specified value.

**Signature**

```ts
export declare const orElseSucceed: <B>(onNone: B) => <A>(self: Option<A>) => Option<B | A>
```

Added in v1.0.0

# filtering

## compact

Alias of `flatten`.

**Signature**

```ts
export declare const compact: <A>(self: Option<Option<A>>) => Option<A>
```

Added in v1.0.0

## filter

**Signature**

```ts
export declare const filter: {
  <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (fc: Option<C>) => Option<B>
  <B extends A, A = B>(predicate: Predicate<A>): (fb: Option<B>) => Option<B>
}
```

Added in v1.0.0

## filterMap

**Signature**

```ts
export declare const filterMap: <A, B>(f: (a: A) => Option<B>) => (self: Option<A>) => Option<B>
```

Added in v1.0.0

## separate

**Signature**

```ts
export declare const separate: <A, B>(self: Option<Either<A, B>>) => readonly [Option<A>, Option<B>]
```

Added in v1.0.0

# guards

## isNone

Returns `true` if the option is `None`, `false` otherwise.

**Signature**

```ts
export declare const isNone: <A>(self: Option<A>) => self is None
```

**Example**

```ts
import { some, none, isNone } from '@fp-ts/data/Option'

assert.strictEqual(isNone(some(1)), false)
assert.strictEqual(isNone(none), true)
```

Added in v1.0.0

## isOption

Returns `true` if the specified value is an instance of `Option`, `false`
otherwise.

**Signature**

```ts
export declare const isOption: (u: unknown) => u is Option<unknown>
```

**Example**

```ts
import { some, none, isOption } from '@fp-ts/data/Option'

assert.strictEqual(isOption(some(1)), true)
assert.strictEqual(isOption(none), true)
assert.strictEqual(isOption({}), false)
```

Added in v1.0.0

## isSome

Returns `true` if the option is an instance of `Some`, `false` otherwise.

**Signature**

```ts
export declare const isSome: <A>(self: Option<A>) => self is Some<A>
```

**Example**

```ts
import { some, none, isSome } from '@fp-ts/data/Option'

assert.strictEqual(isSome(some(1)), true)
assert.strictEqual(isSome(none), false)
```

Added in v1.0.0

# instances

## Alternative

**Signature**

```ts
export declare const Alternative: alternative.Alternative<OptionTypeLambda>
```

Added in v1.0.0

## Applicative

**Signature**

```ts
export declare const Applicative: applicative.Applicative<OptionTypeLambda>
```

Added in v1.0.0

## Chainable

**Signature**

```ts
export declare const Chainable: chainable.Chainable<OptionTypeLambda>
```

Added in v1.0.0

## Compactable

**Signature**

```ts
export declare const Compactable: compactable.Compactable<OptionTypeLambda>
```

Added in v1.0.0

## Coproduct

**Signature**

```ts
export declare const Coproduct: coproduct_.Coproduct<OptionTypeLambda>
```

Added in v1.0.0

## Covariant

**Signature**

```ts
export declare const Covariant: covariant.Covariant<OptionTypeLambda>
```

Added in v1.0.0

## Filterable

**Signature**

```ts
export declare const Filterable: filterable.Filterable<OptionTypeLambda>
```

Added in v1.0.0

## FlatMap

**Signature**

```ts
export declare const FlatMap: flatMap_.FlatMap<OptionTypeLambda>
```

Added in v1.0.0

## Foldable

**Signature**

```ts
export declare const Foldable: foldable.Foldable<OptionTypeLambda>
```

Added in v1.0.0

## Invariant

**Signature**

```ts
export declare const Invariant: invariant.Invariant<OptionTypeLambda>
```

Added in v1.0.0

## Monad

**Signature**

```ts
export declare const Monad: monad.Monad<OptionTypeLambda>
```

Added in v1.0.0

## Of

**Signature**

```ts
export declare const Of: of_.Of<OptionTypeLambda>
```

Added in v1.0.0

## Pointed

**Signature**

```ts
export declare const Pointed: pointed.Pointed<OptionTypeLambda>
```

Added in v1.0.0

## Product

**Signature**

```ts
export declare const Product: product_.Product<OptionTypeLambda>
```

Added in v1.0.0

## SemiAlternative

**Signature**

```ts
export declare const SemiAlternative: semiAlternative.SemiAlternative<OptionTypeLambda>
```

Added in v1.0.0

## SemiApplicative

**Signature**

```ts
export declare const SemiApplicative: semiApplicative.SemiApplicative<OptionTypeLambda>
```

Added in v1.0.0

## SemiCoproduct

**Signature**

```ts
export declare const SemiCoproduct: semiCoproduct.SemiCoproduct<OptionTypeLambda>
```

Added in v1.0.0

## SemiProduct

**Signature**

```ts
export declare const SemiProduct: semiProduct.SemiProduct<OptionTypeLambda>
```

Added in v1.0.0

## Traversable

**Signature**

```ts
export declare const Traversable: traversable.Traversable<OptionTypeLambda>
```

Added in v1.0.0

# interop

## fromThrowable

Converts an exception into an `Option`. If `f` throws, returns `None`, otherwise returns the output wrapped in a
`Some`.

**Signature**

```ts
export declare const fromThrowable: <A>(f: () => A) => Option<A>
```

**Example**

```ts
import { none, some, fromThrowable } from '@fp-ts/data/Option'

assert.deepStrictEqual(
  fromThrowable(() => {
    throw new Error()
  }),
  none
)
assert.deepStrictEqual(
  fromThrowable(() => 1),
  some(1)
)
```

Added in v1.0.0

## getOrThrow

**Signature**

```ts
export declare const getOrThrow: (onError: unknown) => <A>(self: Option<A>) => A
```

Added in v1.0.0

## liftThrowable

Lifts a function that may throw to one returning a `Option`.

**Signature**

```ts
export declare const liftThrowable: <A extends readonly unknown[], B>(f: (...a: A) => B) => (...a: A) => Option<B>
```

Added in v1.0.0

# lifting

## getMonoid

Monoid returning the left-most non-`None` value. If both operands are `Some`s then the inner values are
combined using the provided `Semigroup`

| x       | y       | combine(y)(x)       |
| ------- | ------- | ------------------- |
| none    | none    | none                |
| some(a) | none    | some(a)             |
| none    | some(a) | some(a)             |
| some(a) | some(b) | some(combine(b)(a)) |

**Signature**

```ts
export declare const getMonoid: <A>(Semigroup: Semigroup<A>) => Monoid<Option<A>>
```

**Example**

```ts
import { getMonoid, some, none } from '@fp-ts/data/Option'
import * as N from '@fp-ts/data/Number'
import { pipe } from '@fp-ts/data/Function'

const M = getMonoid(N.SemigroupSum)
assert.deepStrictEqual(pipe(none, M.combine(none)), none)
assert.deepStrictEqual(pipe(some(1), M.combine(none)), some(1))
assert.deepStrictEqual(pipe(none, M.combine(some(1))), some(1))
assert.deepStrictEqual(pipe(some(1), M.combine(some(2))), some(3))
```

Added in v1.0.0

## lift2

Lifts a binary function into `Option`.

**Signature**

```ts
export declare const lift2: <A, B, C>(f: (a: A, b: B) => C) => (fa: Option<A>, fb: Option<B>) => Option<C>
```

Added in v1.0.0

## lift3

Lifts a ternary function into `Option`.

**Signature**

```ts
export declare const lift3: <A, B, C, D>(
  f: (a: A, b: B, c: C) => D
) => (fa: Option<A>, fb: Option<B>, fc: Option<C>) => Option<D>
```

Added in v1.0.0

## liftEither

**Signature**

```ts
export declare const liftEither: <A extends readonly unknown[], E, B>(
  f: (...a: A) => Either<E, B>
) => (...a: A) => Option<B>
```

Added in v1.0.0

## liftNullable

Returns a _smart constructor_ from a function that returns a nullable value.

**Signature**

```ts
export declare const liftNullable: <A extends readonly unknown[], B>(
  f: (...a: A) => B | null | undefined
) => (...a: A) => Option<NonNullable<B>>
```

**Example**

```ts
import { liftNullable, none, some } from '@fp-ts/data/Option'

const f = (s: string): number | undefined => {
  const n = parseFloat(s)
  return isNaN(n) ? undefined : n
}

const g = liftNullable(f)

assert.deepStrictEqual(g('1'), some(1))
assert.deepStrictEqual(g('a'), none)
```

Added in v1.0.0

## liftPredicate

Returns a _smart constructor_ based on the given predicate.

**Signature**

```ts
export declare const liftPredicate: {
  <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (c: C) => Option<B>
  <B extends A, A = B>(predicate: Predicate<A>): (b: B) => Option<B>
}
```

**Example**

```ts
import * as O from '@fp-ts/data/Option'

const getOption = O.liftPredicate((n: number) => n >= 0)

assert.deepStrictEqual(getOption(-1), O.none)
assert.deepStrictEqual(getOption(1), O.some(1))
```

Added in v1.0.0

# mapping

## as

Maps the success value of this effect to the specified constant value.

**Signature**

```ts
export declare const as: <B>(b: B) => <_>(self: Option<_>) => Option<B>
```

Added in v1.0.0

## asUnit

Returns the effect resulting from mapping the success of this effect to unit.

**Signature**

```ts
export declare const asUnit: <_>(self: Option<_>) => Option<void>
```

Added in v1.0.0

## flap

**Signature**

```ts
export declare const flap: <A>(a: A) => <B>(fab: Option<(a: A) => B>) => Option<B>
```

Added in v1.0.0

## imap

**Signature**

```ts
export declare const imap: <A_1, B_1>(
  to: (a: A_1) => B_1,
  from: (b: B_1) => A_1
) => <R_1, O_1, E_1>(self: Option<A_1>) => Option<B_1>
```

Added in v1.0.0

## map

Returns an effect whose success is mapped by the specified `f` function.

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (self: Option<A>) => Option<B>
```

Added in v1.0.0

# models

## None (interface)

**Signature**

```ts
export interface None {
  readonly _tag: 'None'
}
```

Added in v1.0.0

## Option (type alias)

**Signature**

```ts
export type Option<A> = None | Some<A>
```

Added in v1.0.0

## Some (interface)

**Signature**

```ts
export interface Some<A> {
  readonly _tag: 'Some'
  readonly value: A
}
```

Added in v1.0.0

# pattern matching

## match

Takes a (lazy) default value, a function, and an `Option` value, if the `Option` value is `None` the default value is
returned, otherwise the function is applied to the value inside the `Some` and the result is returned.

**Signature**

```ts
export declare const match: <B, A, C = B>(onNone: B, onSome: (a: A) => C) => (self: Option<A>) => B | C
```

**Example**

```ts
import { some, none, match } from '@fp-ts/data/Option'
import { pipe } from '@fp-ts/data/Function'

assert.strictEqual(
  pipe(
    some(1),
    match('a none', (a) => `a some containing ${a}`)
  ),
  'a some containing 1'
)

assert.strictEqual(
  pipe(
    none,
    match('a none', (a) => `a some containing ${a}`)
  ),
  'a none'
)
```

Added in v1.0.0

# sequencing

## andThenDiscard

Sequences the specified effect after this effect, but ignores the value
produced by the effect.

**Signature**

```ts
export declare const andThenDiscard: <_>(that: Option<_>) => <A>(self: Option<A>) => Option<A>
```

Added in v1.0.0

## flatMap

**Signature**

```ts
export declare const flatMap: <A, B>(f: (a: A) => Option<B>) => (self: Option<A>) => Option<B>
```

Added in v1.0.0

## flatMapEither

**Signature**

```ts
export declare const flatMapEither: <A, E, B>(f: (a: A) => Either<E, B>) => (self: Option<A>) => Option<B>
```

Added in v1.0.0

## flatMapNullable

This is `flatMap` + `fromNullable`, useful when working with optional values.

**Signature**

```ts
export declare const flatMapNullable: <A, B>(
  f: (a: A) => B | null | undefined
) => (self: Option<A>) => Option<NonNullable<B>>
```

**Example**

```ts
import { some, none, fromNullable, flatMapNullable } from '@fp-ts/data/Option'
import { pipe } from '@fp-ts/data/Function'

interface Employee {
  company?: {
    address?: {
      street?: {
        name?: string
      }
    }
  }
}

const employee1: Employee = { company: { address: { street: { name: 'high street' } } } }

assert.deepStrictEqual(
  pipe(
    fromNullable(employee1.company),
    flatMapNullable((company) => company.address),
    flatMapNullable((address) => address.street),
    flatMapNullable((street) => street.name)
  ),
  some('high street')
)

const employee2: Employee = { company: { address: { street: {} } } }

assert.deepStrictEqual(
  pipe(
    fromNullable(employee2.company),
    flatMapNullable((company) => company.address),
    flatMapNullable((address) => address.street),
    flatMapNullable((street) => street.name)
  ),
  none
)
```

Added in v1.0.0

# sorting

## liftOrder

The `Order` instance allows `Option` values to be compared with
`compare`, whenever there is an `Order` instance for
the type the `Option` contains.

`None` is considered to be less than any `Some` value.

**Signature**

```ts
export declare const liftOrder: <A>(O: Order<A>) => Order<Option<A>>
```

**Example**

```ts
import { none, some, liftOrder } from '@fp-ts/data/Option'
import * as N from '@fp-ts/data/Number'
import { pipe } from '@fp-ts/data/Function'

const O = liftOrder(N.Order)
assert.strictEqual(pipe(none, O.compare(none)), 0)
assert.strictEqual(pipe(none, O.compare(some(1))), -1)
assert.strictEqual(pipe(some(1), O.compare(none)), 1)
assert.strictEqual(pipe(some(1), O.compare(some(2))), -1)
assert.strictEqual(pipe(some(1), O.compare(some(1))), 0)
```

Added in v1.0.0

# traversing

## sequence

**Signature**

```ts
export declare const sequence: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <R, O, E, A>(fas: Option<Kind<F, R, O, E, A>>) => Kind<F, R, O, E, Option<A>>
```

Added in v1.0.0

## traverse

**Signature**

```ts
export declare const traverse: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B>(f: (a: A) => Kind<F, R, O, E, B>) => (self: Option<A>) => Kind<F, R, O, E, Option<B>>
```

Added in v1.0.0

## traverseTap

**Signature**

```ts
export declare const traverseTap: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B>(f: (a: A) => Kind<F, R, O, E, B>) => (self: Option<A>) => Kind<F, R, O, E, Option<A>>
```

Added in v1.0.0

# type lambdas

## OptionTypeLambda (interface)

**Signature**

```ts
export interface OptionTypeLambda extends TypeLambda {
  readonly type: Option<this['Target']>
}
```

Added in v1.0.0

# utils

## andThen

**Signature**

```ts
export declare const andThen: <B>(that: Option<B>) => <_>(self: Option<_>) => Option<B>
```

Added in v1.0.0

## ap

**Signature**

```ts
export declare const ap: <A>(fa: Option<A>) => <B>(self: Option<(a: A) => B>) => Option<B>
```

Added in v1.0.0

## composeKleisliArrow

**Signature**

```ts
export declare const composeKleisliArrow: <B, C>(
  bfc: (b: B) => Option<C>
) => <A>(afb: (a: A) => Option<B>) => (a: A) => Option<C>
```

Added in v1.0.0

## coproduct

**Signature**

```ts
export declare const coproduct: <B>(that: Option<B>) => <A>(self: Option<A>) => Option<B | A>
```

Added in v1.0.0

## coproductAll

**Signature**

```ts
export declare const coproductAll: <A>(collection: Iterable<Option<A>>) => Option<A>
```

Added in v1.0.0

## coproductEither

**Signature**

```ts
export declare const coproductEither: <B>(that: Option<B>) => <A>(self: Option<A>) => Option<Either<A, B>>
```

Added in v1.0.0

## elem

Tests whether a value is a member of a `Option`.

**Signature**

```ts
export declare const elem: <B>(b: B) => <A>(self: Option<A>) => boolean
```

**Example**

```ts
import * as O from '@fp-ts/data/Option'
import { pipe } from '@fp-ts/data/Function'

assert.strictEqual(pipe(O.some(1), O.elem(1)), true)
assert.strictEqual(pipe(O.some(1), O.elem(2)), false)
assert.strictEqual(pipe(O.none, O.elem(1)), false)
```

Added in v1.0.0

## exists

Returns `true` if the predicate is satisfied by the wrapped value

**Signature**

```ts
export declare const exists: <A>(predicate: Predicate<A>) => (self: Option<A>) => boolean
```

**Example**

```ts
import { some, none, exists } from '@fp-ts/data/Option'
import { pipe } from '@fp-ts/data/Function'

assert.strictEqual(
  pipe(
    some(1),
    exists((n) => n > 0)
  ),
  true
)
assert.strictEqual(
  pipe(
    some(1),
    exists((n) => n > 1)
  ),
  false
)
assert.strictEqual(
  pipe(
    none,
    exists((n) => n > 0)
  ),
  false
)
```

Added in v1.0.0

## flatten

**Signature**

```ts
export declare const flatten: <A>(self: Option<Option<A>>) => Option<A>
```

Added in v1.0.0

## product

**Signature**

```ts
export declare const product: <B>(that: Option<B>) => <A>(self: Option<A>) => Option<readonly [A, B]>
```

Added in v1.0.0

## productAll

**Signature**

```ts
export declare const productAll: <A>(collection: Iterable<Option<A>>) => Option<readonly A[]>
```

Added in v1.0.0

## productFlatten

**Signature**

```ts
export declare const productFlatten: <B>(
  fb: Option<B>
) => <A extends readonly unknown[]>(self: Option<A>) => Option<readonly [...A, B]>
```

Added in v1.0.0

## productMany

**Signature**

```ts
export declare const productMany: <A>(
  collection: Iterable<Option<A>>
) => (self: Option<A>) => Option<readonly [A, ...A[]]>
```

Added in v1.0.0

## struct

**Signature**

```ts
export declare const struct: <R extends Record<string, Option<any>>>(
  r: R
) => Option<{ readonly [K in keyof R]: [R[K]] extends [Option<infer A>] ? A : never }>
```

Added in v1.0.0

## tap

Returns an effect that effectfully "peeks" at the success of this effect.

**Signature**

```ts
export declare const tap: <A, _>(f: (a: A) => Option<_>) => (self: Option<A>) => Option<A>
```

Added in v1.0.0

## tuple

**Signature**

```ts
export declare const tuple: <T extends readonly Option<any>[]>(
  ...tuple: T
) => Option<Readonly<{ [I in keyof T]: [T[I]] extends [Option<infer A>] ? A : never }>>
```

Added in v1.0.0

## tupled

**Signature**

```ts
export declare const tupled: <A>(self: Option<A>) => Option<readonly [A]>
```

Added in v1.0.0

## unit

**Signature**

```ts
export declare const unit: Option<void>
```

Added in v1.0.0

## zero

**Signature**

```ts
export declare const zero: <A>() => Option<A>
```

Added in v1.0.0
