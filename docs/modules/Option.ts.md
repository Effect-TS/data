---
title: Option.ts
nav_order: 33
parent: Modules
---

## Option overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combining](#combining)
  - [all](#all)
  - [ap](#ap)
  - [struct](#struct)
  - [tuple](#tuple)
  - [zipWith](#zipwith)
- [constructors](#constructors)
  - [none](#none)
  - [some](#some)
- [conversions](#conversions)
  - [fromIterable](#fromiterable)
  - [fromNullable](#fromnullable)
  - [getLeft](#getleft)
  - [getOrThrow](#getorthrow)
  - [getOrThrowWith](#getorthrowwith)
  - [getRight](#getright)
  - [liftNullable](#liftnullable)
  - [liftThrowable](#liftthrowable)
  - [toArray](#toarray)
  - [toRefinement](#torefinement)
- [debugging](#debugging)
  - [inspectNone](#inspectnone)
  - [inspectSome](#inspectsome)
- [do notation](#do-notation)
  - [Do](#do)
  - [appendElement](#appendelement)
  - [bind](#bind)
  - [bindTo](#bindto)
  - [let](#let)
  - [tupled](#tupled)
- [equivalence](#equivalence)
  - [getEquivalence](#getequivalence)
- [error handling](#error-handling)
  - [firstSomeOf](#firstsomeof)
  - [orElse](#orelse)
  - [orElseEither](#orelseeither)
- [filtering](#filtering)
  - [filter](#filter)
  - [filterMap](#filtermap)
  - [partitionMap](#partitionmap)
- [folding](#folding)
  - [reduceCompact](#reducecompact)
- [getters](#getters)
  - [getOrElse](#getorelse)
  - [getOrNull](#getornull)
  - [getOrUndefined](#getorundefined)
- [guards](#guards)
  - [isNone](#isnone)
  - [isOption](#isoption)
  - [isSome](#issome)
- [lifting](#lifting)
  - [lift2](#lift2)
  - [liftPredicate](#liftpredicate)
- [math](#math)
  - [divide](#divide)
  - [multiply](#multiply)
  - [multiplyCompact](#multiplycompact)
  - [subtract](#subtract)
  - [sum](#sum)
  - [sumCompact](#sumcompact)
- [models](#models)
  - [None (interface)](#none-interface)
  - [Option (type alias)](#option-type-alias)
  - [OptionUnify (interface)](#optionunify-interface)
  - [OptionUnifyBlacklist (interface)](#optionunifyblacklist-interface)
  - [Some (interface)](#some-interface)
  - [TracedOption (interface)](#tracedoption-interface)
- [pattern matching](#pattern-matching)
  - [match](#match)
- [sorting](#sorting)
  - [getOrder](#getorder)
- [symbols](#symbols)
  - [OptionTypeId](#optiontypeid)
  - [OptionTypeId (type alias)](#optiontypeid-type-alias)
- [transforming](#transforming)
  - [as](#as)
  - [asUnit](#asunit)
  - [composeK](#composek)
  - [flatMap](#flatmap)
  - [flatMapNullable](#flatmapnullable)
  - [flatten](#flatten)
  - [map](#map)
  - [tap](#tap)
  - [zipLeft](#zipleft)
  - [zipRight](#zipright)
- [type lambdas](#type-lambdas)
  - [OptionTypeLambda (interface)](#optiontypelambda-interface)
- [utils](#utils)
  - [contains](#contains)
  - [exists](#exists)
  - [product](#product)
  - [productMany](#productmany)
  - [unit](#unit)

---

# combining

## all

Similar to `Promise.all` but operates on `Option`s.

```
Iterable<Option<A>> -> Option<A[]>
```

Flattens a collection of `Option`s into a single `Option` that contains a list of all the `Some` values.
If there is a `None` value in the collection, it returns `None` as the result.

**Signature**

```ts
export declare const all: <A>(collection: Iterable<Option<A>>) => Option<A[]>
```

**Example**

```ts
import * as O from '@effect/data/Option'

assert.deepStrictEqual(O.all([O.some(1), O.some(2), O.some(3)]), O.some([1, 2, 3]))
assert.deepStrictEqual(O.all([O.some(1), O.none(), O.some(3)]), O.none())
```

Added in v1.0.0

## ap

**Signature**

```ts
export declare const ap: {
  <A>(that: Option<A>): <B>(self: Option<(a: A) => B>) => Option<B>
  <A, B>(self: Option<(a: A) => B>, that: Option<A>): Option<B>
}
```

Added in v1.0.0

## struct

Takes a struct of `Option`s and returns an `Option` of a struct of values.

**Signature**

```ts
export declare const struct: <R extends Record<string, Option<any>>>(
  fields: R
) => Option<{ [K in keyof R]: [R[K]] extends [Option<infer A>] ? A : never }>
```

**Example**

```ts
import * as O from '@effect/data/Option'

assert.deepStrictEqual(O.struct({ a: O.some(1), b: O.some('hello') }), O.some({ a: 1, b: 'hello' }))
assert.deepStrictEqual(O.struct({ a: O.some(1), b: O.none() }), O.none())
```

Added in v1.0.0

## tuple

Similar to `Promise.all` but operates on `Option`s.

```
[Option<A>, Option<B>, ...] -> Option<[A, B, ...]>
```

Takes a tuple of `Option`s and returns an `Option` of a tuple of values.

**Signature**

```ts
export declare const tuple: <T extends readonly Option<any>[]>(
  ...elements: T
) => Option<{ [I in keyof T]: [T[I]] extends [Option<infer A>] ? A : never }>
```

**Example**

```ts
import * as O from '@effect/data/Option'

assert.deepStrictEqual(O.tuple(O.some(1), O.some('hello')), O.some([1, 'hello']))
assert.deepStrictEqual(O.tuple(O.some(1), O.none()), O.none())
```

Added in v1.0.0

## zipWith

Zips two `Option` values together using a provided function, returning a new `Option` of the result.

**Signature**

```ts
export declare const zipWith: {
  <B, A, C>(that: Option<B>, f: (a: A, b: B) => C): (self: Option<A>) => Option<C>
  <A, B, C>(self: Option<A>, that: Option<B>, f: (a: A, b: B) => C): Option<C>
}
```

**Example**

```ts
import * as O from '@effect/data/Option'

type Complex = [number, number]

const complex = (real: number, imaginary: number): Complex => [real, imaginary]

assert.deepStrictEqual(O.zipWith(O.none(), O.none(), complex), O.none())
assert.deepStrictEqual(O.zipWith(O.some(1), O.none(), complex), O.none())
assert.deepStrictEqual(O.zipWith(O.none(), O.some(1), complex), O.none())
assert.deepStrictEqual(O.zipWith(O.some(1), O.some(2), complex), O.some([1, 2]))

assert.deepStrictEqual(O.zipWith(O.some(1), complex)(O.some(2)), O.some([2, 1]))
```

Added in v1.0.0

# constructors

## none

Creates a new `Option` that represents the absence of a value.

**Signature**

```ts
export declare const none: <A = never>() => Option<A>
```

Added in v1.0.0

## some

Creates a new `Option` that wraps the given value.

**Signature**

```ts
export declare const some: <A>(value: A) => Option<A>
```

Added in v1.0.0

# conversions

## fromIterable

Converts an `Iterable` of values into an `Option`. Returns the first value of the `Iterable` wrapped in a `Some`
if the `Iterable` is not empty, otherwise returns `None`.

**Signature**

```ts
export declare const fromIterable: <A>(collection: Iterable<A>) => Option<A>
```

**Example**

```ts
import { fromIterable, some, none } from '@effect/data/Option'

assert.deepStrictEqual(fromIterable([1, 2, 3]), some(1))
assert.deepStrictEqual(fromIterable([]), none())
```

Added in v1.0.0

## fromNullable

Constructs a new `Option` from a nullable type. If the value is `null` or `undefined`, returns `None`, otherwise
returns the value wrapped in a `Some`.

**Signature**

```ts
export declare const fromNullable: <A>(nullableValue: A) => Option<NonNullable<A>>
```

**Example**

```ts
import * as O from '@effect/data/Option'

assert.deepStrictEqual(O.fromNullable(undefined), O.none())
assert.deepStrictEqual(O.fromNullable(null), O.none())
assert.deepStrictEqual(O.fromNullable(1), O.some(1))
```

Added in v1.0.0

## getLeft

Converts a `Either` to an `Option` discarding the value.

**Signature**

```ts
export declare const getLeft: <E, A>(self: Either<E, A>) => Option<E>
```

**Example**

```ts
import * as O from '@effect/data/Option'
import * as E from '@effect/data/Either'

assert.deepStrictEqual(O.getLeft(E.right('ok')), O.none())
assert.deepStrictEqual(O.getLeft(E.left('a')), O.some('a'))
```

Added in v1.0.0

## getOrThrow

Extracts the value of an `Option` or throws if the `Option` is `None`.

The thrown error is a default error. To configure the error thrown, see {@link getOrThrowWith}.

**Signature**

```ts
export declare const getOrThrow: <A>(self: Option<A>) => A
```

**Example**

```ts
import * as O from '@effect/data/Option'

assert.deepStrictEqual(O.getOrThrow(O.some(1)), 1)
assert.throws(() => O.getOrThrow(O.none()))
```

Added in v1.0.0

## getOrThrowWith

Extracts the value of an `Option` or throws if the `Option` is `None`.

If a default error is sufficient for your use case and you don't need to configure the thrown error, see {@link getOrThrow}.

**Signature**

```ts
export declare const getOrThrowWith: {
  (onNone: () => unknown): <A>(self: Option<A>) => A
  <A>(self: Option<A>, onNone: () => unknown): A
}
```

**Example**

```ts
import * as O from '@effect/data/Option'

assert.deepStrictEqual(
  O.getOrThrowWith(O.some(1), () => new Error('Unexpected None')),
  1
)
assert.throws(() => O.getOrThrowWith(O.none(), () => new Error('Unexpected None')))
```

Added in v1.0.0

## getRight

Converts a `Either` to an `Option` discarding the error.

Alias of {@link fromEither}.

**Signature**

```ts
export declare const getRight: <E, A>(self: Either<E, A>) => Option<A>
```

**Example**

```ts
import * as O from '@effect/data/Option'
import * as E from '@effect/data/Either'

assert.deepStrictEqual(O.getRight(E.right('ok')), O.some('ok'))
assert.deepStrictEqual(O.getRight(E.left('err')), O.none())
```

Added in v1.0.0

## liftNullable

This API is useful for lifting a function that returns `null` or `undefined` into the `Option` context.

**Signature**

```ts
export declare const liftNullable: <A extends readonly unknown[], B>(
  f: (...a: A) => B | null | undefined
) => (...a: A) => Option<NonNullable<B>>
```

**Example**

```ts
import * as O from '@effect/data/Option'

const parse = (s: string): number | undefined => {
  const n = parseFloat(s)
  return isNaN(n) ? undefined : n
}

const parseOption = O.liftNullable(parse)

assert.deepStrictEqual(parseOption('1'), O.some(1))
assert.deepStrictEqual(parseOption('not a number'), O.none())
```

Added in v1.0.0

## liftThrowable

A utility function that lifts a function that throws exceptions into a function that returns an `Option`.

This function is useful for any function that might throw an exception, allowing the developer to handle
the exception in a more functional way.

**Signature**

```ts
export declare const liftThrowable: <A extends readonly unknown[], B>(f: (...a: A) => B) => (...a: A) => Option<B>
```

**Example**

```ts
import * as O from '@effect/data/Option'

const parse = O.liftThrowable(JSON.parse)

assert.deepStrictEqual(parse('1'), O.some(1))
assert.deepStrictEqual(parse(''), O.none())
```

Added in v1.0.0

## toArray

Transforms an `Option` into an `Array`.
If the input is `None`, an empty array is returned.
If the input is `Some`, the value is wrapped in an array.

**Signature**

```ts
export declare const toArray: <A>(self: Option<A>) => A[]
```

**Example**

```ts
import * as O from '@effect/data/Option'

assert.deepStrictEqual(O.toArray(O.some(1)), [1])
assert.deepStrictEqual(O.toArray(O.none()), [])
```

Added in v1.0.0

## toRefinement

Returns a type guard from a `Option` returning function.
This function ensures that a type guard definition is type-safe.

**Signature**

```ts
export declare const toRefinement: <A, B extends A>(f: (a: A) => Option<B>) => (a: A) => a is B
```

**Example**

```ts
import * as O from '@effect/data/Option'

const parsePositive = (n: number): O.Option<number> => (n > 0 ? O.some(n) : O.none())

const isPositive = O.toRefinement(parsePositive)

assert.deepStrictEqual(isPositive(1), true)
assert.deepStrictEqual(isPositive(-1), false)
```

Added in v1.0.0

# debugging

## inspectNone

Useful for debugging purposes, the `onNone` callback is is called if `self` is a `None`.

**Signature**

```ts
export declare const inspectNone: {
  (onNone: () => void): <A>(self: Option<A>) => Option<A>
  <A>(self: Option<A>, onNone: () => void): Option<A>
}
```

Added in v1.0.0

## inspectSome

Useful for debugging purposes, the `onSome` callback is called with the value of `self` if it is a `Some`.

**Signature**

```ts
export declare const inspectSome: {
  <A>(onSome: (a: A) => void): (self: Option<A>) => Option<A>
  <A>(self: Option<A>, onSome: (a: A) => void): Option<A>
}
```

Added in v1.0.0

# do notation

## Do

**Signature**

```ts
export declare const Do: () => Option<{}>
```

Added in v1.0.0

## appendElement

Appends an element to the end of a tuple wrapped in an `Option` type.

**Signature**

```ts
export declare const appendElement: {
  <B>(that: Option<B>): <A extends readonly any[]>(self: Option<A>) => Option<[...A, B]>
  <A extends readonly any[], B>(self: Option<A>, that: Option<B>): Option<[...A, B]>
}
```

**Example**

```ts
import * as O from '@effect/data/Option'

assert.deepStrictEqual(O.appendElement(O.some([1, 2]), O.some(3)), O.some([1, 2, 3]))
assert.deepStrictEqual(O.appendElement(O.some([1, 2]), O.none()), O.none())
```

Added in v1.0.0

## bind

**Signature**

```ts
export declare const bind: {
  <N extends string, A extends object, B>(name: Exclude<N, keyof A>, f: (a: A) => Option<B>): (
    self: Option<A>
  ) => Option<{ [K in N | keyof A]: K extends keyof A ? A[K] : B }>
  <A extends object, N extends string, B>(self: Option<A>, name: Exclude<N, keyof A>, f: (a: A) => Option<B>): Option<{
    [K in N | keyof A]: K extends keyof A ? A[K] : B
  }>
}
```

Added in v1.0.0

## bindTo

**Signature**

```ts
export declare const bindTo: {
  <N extends string>(name: N): <A>(self: Option<A>) => Option<{ [K in N]: A }>
  <A, N extends string>(self: Option<A>, name: N): Option<{ [K in N]: A }>
}
```

Added in v1.0.0

## let

**Signature**

```ts
export declare const let: {
  <N extends string, A extends object, B>(name: Exclude<N, keyof A>, f: (a: A) => B): (
    self: Option<A>
  ) => Option<{ [K in N | keyof A]: K extends keyof A ? A[K] : B }>
  <A extends object, N extends string, B>(self: Option<A>, name: Exclude<N, keyof A>, f: (a: A) => B): Option<{
    [K in N | keyof A]: K extends keyof A ? A[K] : B
  }>
}
```

Added in v1.0.0

## tupled

**Signature**

```ts
export declare const tupled: <A>(self: Option<A>) => Option<[A]>
```

Added in v1.0.0

# equivalence

## getEquivalence

**Signature**

```ts
export declare const getEquivalence: <A>(E: Equivalence<A>) => Equivalence<Option<A>>
```

**Example**

```ts
import { none, some, getEquivalence } from '@effect/data/Option'
import * as N from '@effect/data/Number'

const isEquivalent = getEquivalence(N.Equivalence)
assert.deepStrictEqual(isEquivalent(none(), none()), true)
assert.deepStrictEqual(isEquivalent(none(), some(1)), false)
assert.deepStrictEqual(isEquivalent(some(1), none()), false)
assert.deepStrictEqual(isEquivalent(some(1), some(2)), false)
assert.deepStrictEqual(isEquivalent(some(1), some(1)), true)
```

Added in v1.0.0

# error handling

## firstSomeOf

Given an `Iterable` collection of `Option`s, returns the first `Some` found in the collection.

**Signature**

```ts
export declare const firstSomeOf: <A>(collection: Iterable<Option<A>>) => Option<A>
```

**Example**

```ts
import * as O from '@effect/data/Option'

assert.deepStrictEqual(O.firstSomeOf([O.none(), O.some(1), O.some(2)]), O.some(1))
```

Added in v1.0.0

## orElse

Returns the provided `Option` `that` if `self` is `None`, otherwise returns `self`.

**Signature**

```ts
export declare const orElse: {
  <B>(that: LazyArg<Option<B>>): <A>(self: Option<A>) => Option<B | A>
  <A, B>(self: Option<A>, that: LazyArg<Option<B>>): Option<A | B>
}
```

**Example**

```ts
import * as O from '@effect/data/Option'
import { pipe } from '@effect/data/Function'

assert.deepStrictEqual(
  pipe(
    O.none(),
    O.orElse(() => O.none())
  ),
  O.none()
)
assert.deepStrictEqual(
  pipe(
    O.some('a'),
    O.orElse(() => O.none())
  ),
  O.some('a')
)
assert.deepStrictEqual(
  pipe(
    O.none(),
    O.orElse(() => O.some('b'))
  ),
  O.some('b')
)
assert.deepStrictEqual(
  pipe(
    O.some('a'),
    O.orElse(() => O.some('b'))
  ),
  O.some('a')
)
```

Added in v1.0.0

## orElseEither

Similar to `orElse`, but instead of returning a simple union, it returns an `Either` object,
which contains information about which of the two `Option`s has been chosen.

This is useful when it's important to know whether the value was retrieved from the first `Option` or the second option.

**Signature**

```ts
export declare const orElseEither: {
  <B>(that: LazyArg<Option<B>>): <A>(self: Option<A>) => Option<Either<A, B>>
  <A, B>(self: Option<A>, that: LazyArg<Option<B>>): Option<Either<A, B>>
}
```

Added in v1.0.0

# filtering

## filter

Filters an `Option` using a predicate. If the predicate is not satisfied or the `Option` is `None` returns `None`.

If you need to change the type of the `Option` in addition to filtering, see `filterMap`.

**Signature**

```ts
export declare const filter: {
  <C extends A, B extends A, A = C>(refinement: (a: A) => a is B): (self: Option<C>) => Option<B>
  <B extends A, A = B>(predicate: (a: A) => boolean): (self: Option<B>) => Option<B>
  <C extends A, B extends A, A = C>(self: Option<C>, refinement: (a: A) => a is B): Option<B>
  <B extends A, A = B>(self: Option<B>, predicate: (a: A) => boolean): Option<B>
}
```

**Example**

```ts
import * as O from '@effect/data/Option'

// predicate
const isEven = (n: number) => n % 2 === 0

assert.deepStrictEqual(O.filter(O.none(), isEven), O.none())
assert.deepStrictEqual(O.filter(O.some(3), isEven), O.none())
assert.deepStrictEqual(O.filter(O.some(2), isEven), O.some(2))

// refinement
const isNumber = (v: unknown): v is number => typeof v === 'number'

assert.deepStrictEqual(O.filter(O.none(), isNumber), O.none())
assert.deepStrictEqual(O.filter(O.some('hello'), isNumber), O.none())
assert.deepStrictEqual(O.filter(O.some(2), isNumber), O.some(2))
```

Added in v1.0.0

## filterMap

Maps over the value of an `Option` and filters out `None`s.

Useful when in addition to filtering you also want to change the type of the `Option`.

**Signature**

```ts
export declare const filterMap: {
  <A, B>(f: (a: A) => Option<B>): (self: Option<A>) => Option<B>
  <A, B>(self: Option<A>, f: (a: A) => Option<B>): Option<B>
}
```

**Example**

```ts
import * as O from '@effect/data/Option'

const evenNumber = (n: number) => (n % 2 === 0 ? O.some(n) : O.none())

assert.deepStrictEqual(O.filterMap(O.none(), evenNumber), O.none())
assert.deepStrictEqual(O.filterMap(O.some(3), evenNumber), O.none())
assert.deepStrictEqual(O.filterMap(O.some(2), evenNumber), O.some(2))
```

Added in v1.0.0

## partitionMap

**Signature**

```ts
export declare const partitionMap: {
  <A, B, C>(f: (a: A) => Either<B, C>): (self: Option<A>) => [Option<B>, Option<C>]
  <A, B, C>(self: Option<A>, f: (a: A) => Either<B, C>): [Option<B>, Option<C>]
}
```

Added in v1.0.0

# folding

## reduceCompact

Reduces an `Iterable` of `Option<A>` to a single value of type `B`, elements that are `None` are ignored.

**Signature**

```ts
export declare const reduceCompact: {
  <B, A>(b: B, f: (b: B, a: A) => B): (self: Iterable<Option<A>>) => B
  <A, B>(self: Iterable<Option<A>>, b: B, f: (b: B, a: A) => B): B
}
```

**Example**

```ts
import { some, none, reduceCompact } from '@effect/data/Option'
import { pipe } from '@effect/data/Function'

const iterable = [some(1), none(), some(2), none()]
assert.deepStrictEqual(
  pipe(
    iterable,
    reduceCompact(0, (b, a) => b + a)
  ),
  3
)
```

Added in v1.0.0

# getters

## getOrElse

Returns the value of the `Option` if it is `Some`, otherwise returns `onNone`

**Signature**

```ts
export declare const getOrElse: {
  <B>(onNone: LazyArg<B>): <A>(self: Option<A>) => B | A
  <A, B>(self: Option<A>, onNone: LazyArg<B>): A | B
}
```

**Example**

```ts
import { some, none, getOrElse } from '@effect/data/Option'
import { pipe } from '@effect/data/Function'

assert.deepStrictEqual(
  pipe(
    some(1),
    getOrElse(() => 0)
  ),
  1
)
assert.deepStrictEqual(
  pipe(
    none(),
    getOrElse(() => 0)
  ),
  0
)
```

Added in v1.0.0

## getOrNull

Returns the value of the `Option` if it is a `Some`, otherwise returns `null`.

**Signature**

```ts
export declare const getOrNull: <A>(self: Option<A>) => A | null
```

**Example**

```ts
import * as O from '@effect/data/Option'

assert.deepStrictEqual(O.getOrNull(O.some(1)), 1)
assert.deepStrictEqual(O.getOrNull(O.none()), null)
```

Added in v1.0.0

## getOrUndefined

Returns the value of the `Option` if it is a `Some`, otherwise returns `undefined`.

**Signature**

```ts
export declare const getOrUndefined: <A>(self: Option<A>) => A | undefined
```

**Example**

```ts
import * as O from '@effect/data/Option'

assert.deepStrictEqual(O.getOrUndefined(O.some(1)), 1)
assert.deepStrictEqual(O.getOrUndefined(O.none()), undefined)
```

Added in v1.0.0

# guards

## isNone

Determine if a `Option` is a `None`.

**Signature**

```ts
export declare const isNone: <A>(self: Option<A>) => self is None<A>
```

**Example**

```ts
import { some, none, isNone } from '@effect/data/Option'

assert.deepStrictEqual(isNone(some(1)), false)
assert.deepStrictEqual(isNone(none()), true)
```

Added in v1.0.0

## isOption

Tests if a value is a `Option`.

**Signature**

```ts
export declare const isOption: (input: unknown) => input is Option<unknown>
```

**Example**

```ts
import { some, none, isOption } from '@effect/data/Option'

assert.deepStrictEqual(isOption(some(1)), true)
assert.deepStrictEqual(isOption(none()), true)
assert.deepStrictEqual(isOption({}), false)
```

Added in v1.0.0

## isSome

Determine if a `Option` is a `Some`.

**Signature**

```ts
export declare const isSome: <A>(self: Option<A>) => self is Some<A>
```

**Example**

```ts
import { some, none, isSome } from '@effect/data/Option'

assert.deepStrictEqual(isSome(some(1)), true)
assert.deepStrictEqual(isSome(none()), false)
```

Added in v1.0.0

# lifting

## lift2

Lifts a binary function into `Option`.

**Signature**

```ts
export declare const lift2: <A, B, C>(
  f: (a: A, b: B) => C
) => { (that: Option<B>): (self: Option<A>) => Option<C>; (self: Option<A>, that: Option<B>): Option<C> }
```

Added in v1.0.0

## liftPredicate

Transforms a `Predicate` function into a `Some` of the input value if the predicate returns `true` or `None`
if the predicate returns `false`.

**Signature**

```ts
export declare const liftPredicate: {
  <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (c: C) => Option<B>
  <B extends A, A = B>(predicate: Predicate<A>): (b: B) => Option<B>
}
```

**Example**

```ts
import * as O from '@effect/data/Option'

const getOption = O.liftPredicate((n: number) => n >= 0)

assert.deepStrictEqual(getOption(-1), O.none())
assert.deepStrictEqual(getOption(1), O.some(1))
```

Added in v1.0.0

# math

## divide

**Signature**

```ts
export declare const divide: {
  (self: Option<number>, that: Option<number>): Option<number>
  (that: Option<number>): (self: Option<number>) => Option<number>
}
```

Added in v1.0.0

## multiply

**Signature**

```ts
export declare const multiply: {
  (self: Option<number>, that: Option<number>): Option<number>
  (that: Option<number>): (self: Option<number>) => Option<number>
}
```

Added in v1.0.0

## multiplyCompact

Multiply all numbers in an iterable of `Option<number>` ignoring the `None` values.

**Signature**

```ts
export declare const multiplyCompact: (self: Iterable<Option<number>>) => number
```

**Example**

```ts
import { multiplyCompact, some, none } from '@effect/data/Option'

const iterable = [some(2), none(), some(3), none()]
assert.deepStrictEqual(multiplyCompact(iterable), 6)
```

Added in v1.0.0

## subtract

**Signature**

```ts
export declare const subtract: {
  (self: Option<number>, that: Option<number>): Option<number>
  (that: Option<number>): (self: Option<number>) => Option<number>
}
```

Added in v1.0.0

## sum

**Signature**

```ts
export declare const sum: {
  (self: Option<number>, that: Option<number>): Option<number>
  (that: Option<number>): (self: Option<number>) => Option<number>
}
```

Added in v1.0.0

## sumCompact

Sum all numbers in an iterable of `Option<number>` ignoring the `None` values.

**Signature**

```ts
export declare const sumCompact: (self: Iterable<Option<number>>) => number
```

**Example**

```ts
import { sumCompact, some, none } from '@effect/data/Option'

const iterable = [some(2), none(), some(3), none()]
assert.deepStrictEqual(sumCompact(iterable), 5)
```

Added in v1.0.0

# models

## None (interface)

**Signature**

```ts
export interface None<A> extends Data.Case {
  readonly _tag: 'None'
  readonly [OptionTypeId]: {
    readonly _A: (_: never) => A
  }
  traced(trace: Trace): Option<A> | TracedOption<A>
  [Unify.typeSymbol]?: unknown
  [Unify.unifySymbol]?: OptionUnify<this>
  [Unify.blacklistSymbol]?: OptionUnifyBlacklist
}
```

Added in v1.0.0

## Option (type alias)

**Signature**

```ts
export type Option<A> = None<A> | Some<A>
```

Added in v1.0.0

## OptionUnify (interface)

**Signature**

```ts
export interface OptionUnify<A extends { [Unify.typeSymbol]?: any }> {
  Option?: () => A[Unify.typeSymbol] extends Option<infer A0> | infer _ ? Option<A0> : never
}
```

Added in v1.0.0

## OptionUnifyBlacklist (interface)

**Signature**

```ts
export interface OptionUnifyBlacklist {}
```

Added in v1.0.0

## Some (interface)

**Signature**

```ts
export interface Some<A> extends Data.Case {
  readonly _tag: 'Some'
  readonly value: A
  readonly [OptionTypeId]: {
    readonly _A: (_: never) => A
  }
  traced(trace: Trace): Option<A> | TracedOption<A>
  [Unify.typeSymbol]?: unknown
  [Unify.unifySymbol]?: OptionUnify<this>
  [Unify.blacklistSymbol]?: OptionUnifyBlacklist
}
```

Added in v1.0.0

## TracedOption (interface)

**Signature**

```ts
export interface TracedOption<A> {
  readonly _tag: 'Traced'
  readonly i0: Option<A> | TracedOption<A>
  readonly trace: SourceLocation
  traced(trace: Trace): TracedOption<A>
}
```

Added in v1.0.0

# pattern matching

## match

Matches the given `Option` and returns either the provided `onNone` value or the result of the provided `onSome`
function when passed the `Option`'s value.

**Signature**

```ts
export declare const match: {
  <B, A, C = B>(onNone: LazyArg<B>, onSome: (a: A) => C): (self: Option<A>) => B | C
  <A, B, C = B>(self: Option<A>, onNone: LazyArg<B>, onSome: (a: A) => C): B | C
}
```

**Example**

```ts
import { some, none, match } from '@effect/data/Option'
import { pipe } from '@effect/data/Function'

assert.deepStrictEqual(
  pipe(
    some(1),
    match(
      () => 'a none',
      (a) => `a some containing ${a}`
    )
  ),
  'a some containing 1'
)

assert.deepStrictEqual(
  pipe(
    none(),
    match(
      () => 'a none',
      (a) => `a some containing ${a}`
    )
  ),
  'a none'
)
```

Added in v1.0.0

# sorting

## getOrder

The `Order` instance allows `Option` values to be compared with
`compare`, whenever there is an `Order` instance for
the type the `Option` contains.

`None` is considered to be less than any `Some` value.

**Signature**

```ts
export declare const getOrder: <A>(O: Order<A>) => Order<Option<A>>
```

**Example**

```ts
import { none, some, getOrder } from '@effect/data/Option'
import * as N from '@effect/data/Number'
import { pipe } from '@effect/data/Function'

const O = getOrder(N.Order)
assert.deepStrictEqual(O.compare(none(), none()), 0)
assert.deepStrictEqual(O.compare(none(), some(1)), -1)
assert.deepStrictEqual(O.compare(some(1), none()), 1)
assert.deepStrictEqual(O.compare(some(1), some(2)), -1)
assert.deepStrictEqual(O.compare(some(1), some(1)), 0)
```

Added in v1.0.0

# symbols

## OptionTypeId

**Signature**

```ts
export declare const OptionTypeId: typeof OptionTypeId
```

Added in v1.0.0

## OptionTypeId (type alias)

**Signature**

```ts
export type OptionTypeId = typeof OptionTypeId
```

Added in v1.0.0

# transforming

## as

Maps the `Some` value of this `Option` to the specified constant value.

**Signature**

```ts
export declare const as: <B>(b: B) => <_>(self: Option<_>) => Option<B>
```

Added in v1.0.0

## asUnit

Maps the `Some` value of this `Option` to the `void` constant value.

This is useful when the value of the `Option` is not needed, but the presence or absence of the value is important.

**Signature**

```ts
export declare const asUnit: <_>(self: Option<_>) => Option<void>
```

Added in v1.0.0

## composeK

**Signature**

```ts
export declare const composeK: {
  <B, C>(bfc: (b: B) => Option<C>): <A>(afb: (a: A) => Option<B>) => (a: A) => Option<C>
  <A, B, C>(afb: (a: A) => Option<B>, bfc: (b: B) => Option<C>): (a: A) => Option<C>
}
```

Added in v1.0.0

## flatMap

Applies a function to the value of an `Option` and flattens the result, if the input is `Some`.

**Signature**

```ts
export declare const flatMap: {
  <A, B>(f: (a: A) => Option<B>): (self: Option<A>) => Option<B>
  <A, B>(self: Option<A>, f: (a: A) => Option<B>): Option<B>
}
```

Added in v1.0.0

## flatMapNullable

This is `flatMap` + `fromNullable`, useful when working with optional values.

**Signature**

```ts
export declare const flatMapNullable: {
  <A, B>(f: (a: A) => B | null | undefined): (self: Option<A>) => Option<NonNullable<B>>
  <A, B>(self: Option<A>, f: (a: A) => B | null | undefined): Option<NonNullable<B>>
}
```

**Example**

```ts
import { some, none, flatMapNullable } from '@effect/data/Option'
import { pipe } from '@effect/data/Function'

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
    some(employee1),
    flatMapNullable((employee) => employee.company?.address?.street?.name)
  ),
  some('high street')
)

const employee2: Employee = { company: { address: { street: {} } } }

assert.deepStrictEqual(
  pipe(
    some(employee2),
    flatMapNullable((employee) => employee.company?.address?.street?.name)
  ),
  none()
)
```

Added in v1.0.0

## flatten

**Signature**

```ts
export declare const flatten: <A>(self: Option<Option<A>>) => Option<A>
```

Added in v1.0.0

## map

Maps the `Some` side of an `Option` value to a new `Option` value.

**Signature**

```ts
export declare const map: {
  <A, B>(f: (a: A) => B): (self: Option<A>) => Option<B>
  <A, B>(self: Option<A>, f: (a: A) => B): Option<B>
}
```

Added in v1.0.0

## tap

Applies the provided function `f` to the value of the `Option` if it is `Some` and returns the original `Option`
unless `f` returns `None`, in which case it returns `None`.

This function is useful for performing additional computations on the value of the input `Option` without affecting its value.

**Signature**

```ts
export declare const tap: {
  <A, _>(f: (a: A) => Option<_>): (self: Option<A>) => Option<A>
  <A, _>(self: Option<A>, f: (a: A) => Option<_>): Option<A>
}
```

**Example**

```ts
import * as O from '@effect/data/Option'

const getInteger = (n: number) => (Number.isInteger(n) ? O.some(n) : O.none())

assert.deepStrictEqual(O.tap(O.none(), getInteger), O.none())
assert.deepStrictEqual(O.tap(O.some(1), getInteger), O.some(1))
assert.deepStrictEqual(O.tap(O.some(1.14), getInteger), O.none())
```

Added in v1.0.0

## zipLeft

Sequences the specified `that` `Option` but ignores its value.

It is useful when we want to chain multiple operations, but only care about the result of `self`.

**Signature**

```ts
export declare const zipLeft: {
  <_>(that: Option<_>): <A>(self: Option<A>) => Option<A>
  <A, _>(self: Option<A>, that: Option<_>): Option<A>
}
```

Added in v1.0.0

## zipRight

**Signature**

```ts
export declare const zipRight: {
  <B>(that: Option<B>): <_>(self: Option<_>) => Option<B>
  <_, B>(self: Option<_>, that: Option<B>): Option<B>
}
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

## contains

Returns a function that checks if an `Option` contains a given value using a provided `Equivalence` instance.

**Signature**

```ts
export declare const contains: <A>(isEquivalent: (self: A, that: A) => boolean) => {
  (a: A): (self: Option<A>) => boolean
  (self: Option<A>, a: A): boolean
}
```

**Example**

```ts
import { some, none, contains } from '@effect/data/Option'
import { Equivalence } from '@effect/data/Number'
import { pipe } from '@effect/data/Function'

assert.deepStrictEqual(pipe(some(2), contains(Equivalence)(2)), true)
assert.deepStrictEqual(pipe(some(1), contains(Equivalence)(2)), false)
assert.deepStrictEqual(pipe(none(), contains(Equivalence)(2)), false)
```

Added in v1.0.0

## exists

Check if a value in an `Option` type meets a certain predicate.

**Signature**

```ts
export declare const exists: {
  <A>(predicate: Predicate<A>): (self: Option<A>) => boolean
  <A>(self: Option<A>, predicate: Predicate<A>): boolean
}
```

**Example**

```ts
import { some, none, exists } from '@effect/data/Option'
import { pipe } from '@effect/data/Function'

const isEven = (n: number) => n % 2 === 0

assert.deepStrictEqual(pipe(some(2), exists(isEven)), true)
assert.deepStrictEqual(pipe(some(1), exists(isEven)), false)
assert.deepStrictEqual(pipe(none(), exists(isEven)), false)
```

Added in v1.0.0

## product

**Signature**

```ts
export declare const product: <A, B>(self: Option<A>, that: Option<B>) => Option<[A, B]>
```

Added in v1.0.0

## productMany

**Signature**

```ts
export declare const productMany: <A>(self: Option<A>, collection: Iterable<Option<A>>) => Option<[A, ...A[]]>
```

Added in v1.0.0

## unit

**Signature**

```ts
export declare const unit: Option<void>
```

Added in v1.0.0
