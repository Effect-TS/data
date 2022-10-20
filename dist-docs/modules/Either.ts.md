---
title: Either.ts
nav_order: 12
parent: Modules
---

## Either overview

```ts
type Either<E, A> = Left<E> | Right<A>
```

Represents a value of one of two possible types (a disjoint union).

An instance of `Either` is either an instance of `Left` or `Right`.

A common use of `Either` is as an alternative to `Option` for dealing with possible missing values. In this usage,
`None` is replaced with a `Left` which can contain useful information. `Right` takes the place of `Some`. Convention
dictates that `Left` is used for Left and `Right` is used for Right.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [left](#left)
  - [right](#right)
- [conversions](#conversions)
  - [fromNullable](#fromnullable)
  - [fromOption](#fromoption)
  - [getLeft](#getleft)
  - [getRight](#getright)
  - [toNull](#tonull)
  - [toReadonlyArray](#toreadonlyarray)
  - [toUndefined](#toundefined)
  - [toUnion](#tounion)
- [do notation](#do-notation)
  - [Do](#do)
  - [bind](#bind)
  - [bindRight](#bindright)
  - [bindTo](#bindto)
  - [let](#let)
- [error handling](#error-handling)
  - [catchAll](#catchall)
  - [getOrElse](#getorelse)
  - [getValidatedMonoidal](#getvalidatedmonoidal)
  - [mapError](#maperror)
  - [orElse](#orelse)
  - [tapError](#taperror)
- [filtering](#filtering)
  - [compact](#compact)
  - [filter](#filter)
  - [filterMap](#filtermap)
  - [partition](#partition)
  - [partitionMap](#partitionmap)
  - [separate](#separate)
  - [traverseFilterMap](#traversefiltermap)
  - [traversePartitionMap](#traversepartitionmap)
- [folding](#folding)
  - [foldMap](#foldmap)
  - [reduce](#reduce)
  - [reduceRight](#reduceright)
- [instances](#instances)
  - [Bifunctor](#bifunctor)
  - [Extendable](#extendable)
  - [FlatMap](#flatmap)
  - [Functor](#functor)
  - [Monad](#monad)
  - [Monoidal](#monoidal)
  - [Semigroupal](#semigroupal)
  - [Succeed](#succeed)
  - [Traversable](#traversable)
  - [getCompactable](#getcompactable)
  - [getFilterable](#getfilterable)
  - [getSemigroup](#getsemigroup)
  - [getTraversableFilterable](#gettraversablefilterable)
- [interop](#interop)
  - [fromThrowable](#fromthrowable)
  - [liftThrowable](#liftthrowable)
- [lifting](#lifting)
  - [lift2](#lift2)
  - [lift3](#lift3)
  - [liftNullable](#liftnullable)
  - [liftOption](#liftoption)
  - [liftPredicate](#liftpredicate)
- [mapping](#mapping)
  - [as](#as)
  - [flap](#flap)
  - [map](#map)
  - [mapBoth](#mapboth)
  - [unit](#unit)
- [models](#models)
  - [Either (type alias)](#either-type-alias)
  - [Left (interface)](#left-interface)
  - [Right (interface)](#right-interface)
- [pattern matching](#pattern-matching)
  - [match](#match)
- [refinements](#refinements)
  - [isLeft](#isleft)
  - [isRight](#isright)
- [sequencing](#sequencing)
  - [flatMap](#flatmap)
  - [flatMapNullable](#flatmapnullable)
  - [flatMapOption](#flatmapoption)
  - [flatten](#flatten)
  - [zipLeft](#zipleft)
  - [zipRight](#zipright)
- [traversing](#traversing)
  - [sequence](#sequence)
  - [sequenceReadonlyArray](#sequencereadonlyarray)
  - [traverse](#traverse)
  - [traverseNonEmptyReadonlyArray](#traversenonemptyreadonlyarray)
  - [traverseNonEmptyReadonlyArrayWithIndex](#traversenonemptyreadonlyarraywithindex)
  - [traverseReadonlyArray](#traversereadonlyarray)
  - [traverseReadonlyArrayWithIndex](#traversereadonlyarraywithindex)
- [tuple sequencing](#tuple-sequencing)
  - [Zip](#zip)
  - [tupled](#tupled)
  - [zipFlatten](#zipflatten)
  - [zipWith](#zipwith)
- [type lambdas](#type-lambdas)
  - [EitherTypeLambda (interface)](#eithertypelambda-interface)
  - [EitherTypeLambdaFix (interface)](#eithertypelambdafix-interface)
  - [ValidatedT (interface)](#validatedt-interface)
- [utils](#utils)
  - [ap](#ap)
  - [duplicate](#duplicate)
  - [elem](#elem)
  - [exists](#exists)
  - [extend](#extend)
  - [reverse](#reverse)
  - [tap](#tap)

---

# constructors

## left

Constructs a new `Either` holding a `Left` value. This usually represents a Left, due to the right-bias of this
structure.

**Signature**

```ts
export declare const left: <E>(e: E) => Either<E, never>
```

Added in v1.0.0

## right

Constructs a new `Either` holding a `Right` value. This usually represents a Rightful value due to the right bias
of this structure.

**Signature**

```ts
export declare const right: <A>(a: A) => Either<never, A>
```

Added in v1.0.0

# conversions

## fromNullable

Takes a lazy default and a nullable value, if the value is not nully, turn it into a `Right`, if the value is nully use
the provided default as a `Left`.

**Signature**

```ts
export declare const fromNullable: <E>(onNullable: E) => <A>(a: A) => Either<E, NonNullable<A>>
```

**Example**

```ts
import * as E from '@fp-ts/data/Either'

const parse = E.fromNullable('nully')

assert.deepStrictEqual(parse(1), E.right(1))
assert.deepStrictEqual(parse(null), E.left('nully'))
```

Added in v1.0.0

## fromOption

**Signature**

```ts
export declare const fromOption: <E>(onNone: E) => <A>(fa: Option<A>) => Either<E, A>
```

**Example**

```ts
import * as E from '@fp-ts/data/Either'
import { pipe } from '@fp-ts/data/Function'
import * as O from '@fp-ts/data/Option'

assert.deepStrictEqual(pipe(O.some(1), E.fromOption('error')), E.right(1))
assert.deepStrictEqual(pipe(O.none, E.fromOption('error')), E.left('error'))
```

Added in v1.0.0

## getLeft

Converts a `Either` to an `Option` discarding the Right.

**Signature**

```ts
export declare const getLeft: <E, A>(self: Either<E, A>) => Option<E>
```

**Example**

```ts
import * as O from '@fp-ts/data/Option'
import * as E from '@fp-ts/data/Either'

assert.deepStrictEqual(E.getLeft(E.right('ok')), O.none)
assert.deepStrictEqual(E.getLeft(E.left('err')), O.some('err'))
```

Added in v1.0.0

## getRight

Converts a `Either` to an `Option` discarding the error.

**Signature**

```ts
export declare const getRight: <E, A>(self: Either<E, A>) => Option<A>
```

**Example**

```ts
import * as O from '@fp-ts/data/Option'
import * as E from '@fp-ts/data/Either'

assert.deepStrictEqual(E.getRight(E.right('ok')), O.some('ok'))
assert.deepStrictEqual(E.getRight(E.left('err')), O.none)
```

Added in v1.0.0

## toNull

**Signature**

```ts
export declare const toNull: <E, A>(self: Either<E, A>) => A | null
```

Added in v1.0.0

## toReadonlyArray

**Signature**

```ts
export declare const toReadonlyArray: <E, A>(self: Either<E, A>) => readonly A[]
```

Added in v1.0.0

## toUndefined

**Signature**

```ts
export declare const toUndefined: <E, A>(self: Either<E, A>) => A | undefined
```

Added in v1.0.0

## toUnion

**Signature**

```ts
export declare const toUnion: <E, A>(fa: Either<E, A>) => E | A
```

Added in v1.0.0

# do notation

## Do

**Signature**

```ts
export declare const Do: Either<never, {}>
```

Added in v1.0.0

## bind

**Signature**

```ts
export declare const bind: <N extends string, A extends object, E2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Either<E2, B>
) => <E1>(self: Either<E1, A>) => Either<E2 | E1, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## bindRight

A variant of `bind` that sequentially ignores the scope.

**Signature**

```ts
export declare const bindRight: <N extends string, A extends object, E2, B>(
  name: Exclude<N, keyof A>,
  fb: Either<E2, B>
) => <E1>(self: Either<E1, A>) => Either<E2 | E1, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## bindTo

**Signature**

```ts
export declare const bindTo: <N extends string>(
  name: N
) => <E, A>(self: Either<E, A>) => Either<E, { readonly [K in N]: A }>
```

Added in v1.0.0

## let

**Signature**

```ts
export declare const let: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => <E>(self: Either<E, A>) => Either<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

# error handling

## catchAll

Recovers from all errors.

**Signature**

```ts
export declare const catchAll: <E1, E2, B>(
  onError: (e: E1) => Either<E2, B>
) => <A>(self: Either<E1, A>) => Either<E2, B | A>
```

Added in v1.0.0

## getOrElse

Returns the wrapped value if it's a `Right` or a default value if is a `Left`.

**Signature**

```ts
export declare const getOrElse: <B>(onError: B) => <A>(self: Either<unknown, A>) => B | A
```

**Example**

```ts
import * as E from '@fp-ts/data/Either'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe(E.right(1), E.getOrElse(0)), 1)
assert.deepStrictEqual(pipe(E.left('error'), E.getOrElse(0)), 0)
```

Added in v1.0.0

## getValidatedMonoidal

The default [`Monoidal`](#monoidal) instance returns the first error, if you want to
get all errors you need to provide a way to combine them via a `Semigroup`.

**Signature**

```ts
export declare const getValidatedMonoidal: <E>(
  Semigroup: Semigroup<E>
) => monoidal.Monoidal<ValidatedT<EitherTypeLambda, E>>
```

**Example**

```ts
import * as A from '@fp-ts/core/Semigroupal'
import * as E from '@fp-ts/data/Either'
import { pipe } from '@fp-ts/data/Function'
import * as S from '@fp-ts/core/Semigroup'
import * as string from '@fp-ts/data/String'

const parseString = (u: unknown): E.Either<string, string> =>
  typeof u === 'string' ? E.right(u) : E.left('not a string')

const parseNumber = (u: unknown): E.Either<string, number> =>
  typeof u === 'number' ? E.right(u) : E.left('not a number')

interface Person {
  readonly name: string
  readonly age: number
}

const parsePerson = (input: Record<string, unknown>): E.Either<string, Person> =>
  pipe(E.Do, E.bindRight('name', parseString(input.name)), E.bindRight('age', parseNumber(input.age)))

assert.deepStrictEqual(parsePerson({}), E.left('not a string')) // <= first error

const Monoidal = E.getValidatedMonoidal(pipe(string.Semigroup, S.intercalate(', ')))

const bindRight = A.bindRight(Monoidal)

const parsePersonAll = (input: Record<string, unknown>): E.Either<string, Person> =>
  pipe(E.Do, bindRight('name', parseString(input.name)), bindRight('age', parseNumber(input.age)))

assert.deepStrictEqual(parsePersonAll({}), E.left('not a string, not a number')) // <= all errors
```

Added in v1.0.0

## mapError

Returns an effect with its error channel mapped using the specified
function. This can be used to lift a "smaller" error into a "larger" error.

**Signature**

```ts
export declare const mapError: <E, G>(f: (e: E) => G) => <A>(self: Either<E, A>) => Either<G, A>
```

Added in v1.0.0

## orElse

Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
types of kind `* -> *`.

In case of `Either` returns the left-most non-`Left` value (or the right-most `Left` value if both values are `Left`).

| x        | y        | pipe(x, orElse(y) |
| -------- | -------- | ----------------- |
| left(a)  | left(b)  | left(b)           |
| left(a)  | right(2) | right(2)          |
| right(1) | left(b)  | right(1)          |
| right(1) | right(2) | right(1)          |

**Signature**

```ts
export declare const orElse: <E2, B>(that: Either<E2, B>) => <E1, A>(self: Either<E1, A>) => Either<E2, B | A>
```

**Example**

```ts
import * as E from '@fp-ts/data/Either'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe(E.left('a'), E.orElse(E.left('b'))), E.left('b'))
assert.deepStrictEqual(pipe(E.left('a'), E.orElse(E.right(2))), E.right(2))
assert.deepStrictEqual(pipe(E.right(1), E.orElse(E.left('b'))), E.right(1))
assert.deepStrictEqual(pipe(E.right(1), E.orElse(E.right(2))), E.right(1))
```

Added in v1.0.0

## tapError

Returns an effect that effectfully "peeks" at the Left of this effect.

**Signature**

```ts
export declare const tapError: <E1, E2>(
  onError: (e: E1) => Either<E2, unknown>
) => <A>(self: Either<E1, A>) => Either<E1 | E2, A>
```

Added in v1.0.0

# filtering

## compact

**Signature**

```ts
export declare const compact: <E>(onNone: E) => <A>(self: Either<E, Option<A>>) => Either<E, A>
```

Added in v1.0.0

## filter

**Signature**

```ts
export declare const filter: {
  <C extends A, B extends A, E2, A = C>(refinement: Refinement<A, B>, onFalse: E2): <E1>(
    self: Either<E1, C>
  ) => Either<E2 | E1, B>
  <B extends A, E2, A = B>(predicate: Predicate<A>, onFalse: E2): <E1>(self: Either<E1, B>) => Either<E2 | E1, B>
}
```

**Example**

```ts
import * as E from '@fp-ts/data/Either'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(
  pipe(
    E.right(1),
    E.filter((n) => n > 0, 'error')
  ),
  E.right(1)
)
assert.deepStrictEqual(
  pipe(
    E.right(-1),
    E.filter((n) => n > 0, 'error')
  ),
  E.left('error')
)
assert.deepStrictEqual(
  pipe(
    E.left('a'),
    E.filter((n) => n > 0, 'error')
  ),
  E.left('a')
)
```

Added in v1.0.0

## filterMap

**Signature**

```ts
export declare const filterMap: <A, B, E>(f: (a: A) => Option<B>, onNone: E) => (self: Either<E, A>) => Either<E, B>
```

Added in v1.0.0

## partition

**Signature**

```ts
export declare const partition: {
  <C extends A, B extends A, E, A = C>(refinement: Refinement<A, B>, onFalse: E): (
    self: Either<E, C>
  ) => readonly [Either<E, C>, Either<E, B>]
  <B extends A, E, A = B>(predicate: Predicate<A>, onFalse: E): (
    self: Either<E, B>
  ) => readonly [Either<E, B>, Either<E, B>]
}
```

Added in v1.0.0

## partitionMap

**Signature**

```ts
export declare const partitionMap: <A, B, C, E>(
  f: (a: A) => Either<B, C>,
  onEmpty: E
) => (self: Either<E, A>) => readonly [Either<E, B>, Either<E, C>]
```

Added in v1.0.0

## separate

**Signature**

```ts
export declare const separate: <E>(
  onEmpty: E
) => <A, B>(self: Either<E, Either<A, B>>) => readonly [Either<E, A>, Either<E, B>]
```

Added in v1.0.0

## traverseFilterMap

**Signature**

```ts
export declare const traverseFilterMap: <F extends TypeLambda>(
  Monoidal: monoidal.Monoidal<F>
) => <A, S, R, O, FE, B, E>(
  f: (a: A) => Kind<F, S, R, O, FE, Option<B>>,
  onNone: E
) => (self: Either<E, A>) => Kind<F, S, R, O, FE, Either<E, B>>
```

Added in v1.0.0

## traversePartitionMap

**Signature**

```ts
export declare const traversePartitionMap: <F extends TypeLambda>(
  Monoidal: monoidal.Monoidal<F>
) => <A, S, R, O, FE, B, C, E>(
  f: (a: A) => Kind<F, S, R, O, FE, Either<B, C>>,
  onNone: E
) => (self: Either<E, A>) => Kind<F, S, R, O, FE, readonly [Either<E, B>, Either<E, C>]>
```

Added in v1.0.0

# folding

## foldMap

**Signature**

```ts
export declare const foldMap: <M>(Monoid: Monoid<M>) => <A>(f: (a: A) => M) => <E>(self: Either<E, A>) => M
```

Added in v1.0.0

## reduce

**Signature**

```ts
export declare const reduce: <B, A>(b: B, f: (b: B, a: A) => B) => <E>(self: Either<E, A>) => B
```

Added in v1.0.0

## reduceRight

**Signature**

```ts
export declare const reduceRight: <B, A>(b: B, f: (a: A, b: B) => B) => <E>(self: Either<E, A>) => B
```

Added in v1.0.0

# instances

## Bifunctor

**Signature**

```ts
export declare const Bifunctor: bifunctor.Bifunctor<EitherTypeLambda>
```

Added in v1.0.0

## Extendable

**Signature**

```ts
export declare const Extendable: extendable.Extendable<EitherTypeLambda>
```

Added in v1.0.0

## FlatMap

**Signature**

```ts
export declare const FlatMap: flatMap_.FlatMap<EitherTypeLambda>
```

Added in v1.0.0

## Functor

**Signature**

```ts
export declare const Functor: functor.Functor<EitherTypeLambda>
```

Added in v1.0.0

## Monad

**Signature**

```ts
export declare const Monad: monad.Monad<EitherTypeLambda>
```

Added in v1.0.0

## Monoidal

**Signature**

```ts
export declare const Monoidal: monoidal.Monoidal<EitherTypeLambda>
```

Added in v1.0.0

## Semigroupal

**Signature**

```ts
export declare const Semigroupal: semigroupal.Semigroupal<EitherTypeLambda>
```

Added in v1.0.0

## Succeed

**Signature**

```ts
export declare const Succeed: pointed.Pointed<EitherTypeLambda>
```

Added in v1.0.0

## Traversable

**Signature**

```ts
export declare const Traversable: traversable.Traversable<EitherTypeLambda>
```

Added in v1.0.0

## getCompactable

**Signature**

```ts
export declare const getCompactable: <E>(onNone: E) => Compactable<ValidatedT<EitherTypeLambda, E>>
```

Added in v1.0.0

## getFilterable

**Signature**

```ts
export declare const getFilterable: <E>(onEmpty: E) => filterable.Filterable<ValidatedT<EitherTypeLambda, E>>
```

Added in v1.0.0

## getSemigroup

Semigroup returning the left-most non-`Left` value. If both operands are `Right`es then the inner values are
combined using the provided `Semigroup`.

**Signature**

```ts
export declare const getSemigroup: <A>(Semigroup: Semigroup<A>) => <E>() => Semigroup<Either<E, A>>
```

**Example**

```ts
import * as E from '@fp-ts/data/Either'
import * as N from '@fp-ts/data/Number'
import { pipe } from '@fp-ts/data/Function'

const S = E.getSemigroup(N.SemigroupSum)<string>()
assert.deepStrictEqual(pipe(E.left('a'), S.combine(E.left('b'))), E.left('a'))
assert.deepStrictEqual(pipe(E.left('a'), S.combine(E.right(2))), E.right(2))
assert.deepStrictEqual(pipe(E.right(1), S.combine(E.left('b'))), E.right(1))
assert.deepStrictEqual(pipe(E.right(1), S.combine(E.right(2))), E.right(3))
```

Added in v1.0.0

## getTraversableFilterable

**Signature**

```ts
export declare const getTraversableFilterable: <E>(onEmpty: E) => TraversableFilterable<ValidatedT<EitherTypeLambda, E>>
```

Added in v1.0.0

# interop

## fromThrowable

Constructs a new `Either` from a function that might throw.

**Signature**

```ts
export declare const fromThrowable: <A, E>(f: () => A, onThrow: (error: unknown) => E) => Either<E, A>
```

**Example**

```ts
import * as E from '@fp-ts/data/Either'
import { identity } from '@fp-ts/data/Function'

const unsafeHead = <A>(as: ReadonlyArray<A>): A => {
  if (as.length > 0) {
    return as[0]
  } else {
    throw new Error('empty array')
  }
}

const head = <A>(as: ReadonlyArray<A>): E.Either<unknown, A> => E.fromThrowable(() => unsafeHead(as), identity)

assert.deepStrictEqual(head([]), E.left(new Error('empty array')))
assert.deepStrictEqual(head([1, 2, 3]), E.right(1))
```

Added in v1.0.0

## liftThrowable

Lifts a function that may throw to one returning a `Either`.

**Signature**

```ts
export declare const liftThrowable: <A extends readonly unknown[], B, E>(
  f: (...a: A) => B,
  onThrow: (error: unknown) => E
) => (...a: A) => Either<E, B>
```

Added in v1.0.0

# lifting

## lift2

Lifts a binary function into `Either`.

**Signature**

```ts
export declare const lift2: <A, B, C>(
  f: (a: A, b: B) => C
) => <E1, E2>(fa: Either<E1, A>, fb: Either<E2, B>) => Either<E1 | E2, C>
```

Added in v1.0.0

## lift3

Lifts a ternary function into `Either`.

**Signature**

```ts
export declare const lift3: <A, B, C, D>(
  f: (a: A, b: B, c: C) => D
) => <E1, E2, E3>(fa: Either<E1, A>, fb: Either<E2, B>, fc: Either<E3, C>) => Either<E1 | E2 | E3, D>
```

Added in v1.0.0

## liftNullable

**Signature**

```ts
export declare const liftNullable: <A extends readonly unknown[], B, E>(
  f: (...a: A) => B | null | undefined,
  onNullable: E
) => (...a: A) => Either<E, NonNullable<B>>
```

Added in v1.0.0

## liftOption

**Signature**

```ts
export declare const liftOption: <A extends readonly unknown[], B, E>(
  f: (...a: A) => Option<B>,
  onNone: E
) => (...a: A) => Either<E, B>
```

Added in v1.0.0

## liftPredicate

**Signature**

```ts
export declare const liftPredicate: {
  <C extends A, B extends A, E, A = C>(refinement: Refinement<A, B>, onFalse: E): (c: C) => Either<E, B>
  <B extends A, E, A = B>(predicate: Predicate<A>, onFalse: E): (b: B) => Either<E, B>
}
```

**Example**

```ts
import { liftPredicate, left, right } from '@fp-ts/data/Either'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(
  pipe(
    1,
    liftPredicate((n) => n > 0, 'error')
  ),
  right(1)
)
assert.deepStrictEqual(
  pipe(
    -1,
    liftPredicate((n) => n > 0, 'error')
  ),
  left('error')
)
```

Added in v1.0.0

# mapping

## as

Maps the Right value of this effect to the specified constant value.

**Signature**

```ts
export declare const as: <B>(b: B) => <E>(self: Either<E, unknown>) => Either<E, B>
```

Added in v1.0.0

## flap

**Signature**

```ts
export declare const flap: <A>(a: A) => <E, B>(fab: Either<E, (a: A) => B>) => Either<E, B>
```

Added in v1.0.0

## map

Returns an effect whose Right is mapped by the specified `f` function.

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: Either<E, A>) => Either<E, B>
```

Added in v1.0.0

## mapBoth

Returns an effect whose Left and Right channels have been mapped by
the specified pair of functions, `f` and `g`.

**Signature**

```ts
export declare const mapBoth: <E, G, A, B>(f: (e: E) => G, g: (a: A) => B) => (self: Either<E, A>) => Either<G, B>
```

Added in v1.0.0

## unit

Returns the effect Eithering from mapping the Right of this effect to unit.

**Signature**

```ts
export declare const unit: <E>(self: Either<E, unknown>) => Either<E, void>
```

Added in v1.0.0

# models

## Either (type alias)

**Signature**

```ts
export type Either<E, A> = Left<E> | Right<A>
```

Added in v1.0.0

## Left (interface)

**Signature**

```ts
export interface Left<E> {
  readonly _tag: 'Left'
  readonly left: E
}
```

Added in v1.0.0

## Right (interface)

**Signature**

```ts
export interface Right<A> {
  readonly _tag: 'Right'
  readonly right: A
}
```

Added in v1.0.0

# pattern matching

## match

Takes two functions and an `Either` value, if the value is a `Left` the inner value is applied to the first function,
if the value is a `Right` the inner value is applied to the second function.

**Signature**

```ts
export declare const match: <E, B, A, C = B>(
  onError: (e: E) => B,
  onRight: (a: A) => C
) => (self: Either<E, A>) => B | C
```

**Example**

```ts
import * as E from '@fp-ts/data/Either'
import { pipe } from '@fp-ts/data/Function'

const onError = (errors: ReadonlyArray<string>): string => `Errors: ${errors.join(', ')}`

const onRight = (value: number): string => `Ok: ${value}`

assert.strictEqual(pipe(E.right(1), E.match(onError, onRight)), 'Ok: 1')
assert.strictEqual(pipe(E.left(['error 1', 'error 2']), E.match(onError, onRight)), 'Errors: error 1, error 2')
```

Added in v1.0.0

# refinements

## isLeft

Returns `true` if the either is an instance of `Left`, `false` otherwise.

**Signature**

```ts
export declare const isLeft: <E, A>(self: Either<E, A>) => self is Left<E>
```

Added in v1.0.0

## isRight

Returns `true` if the either is an instance of `Right`, `false` otherwise.

**Signature**

```ts
export declare const isRight: <E, A>(self: Either<E, A>) => self is Right<A>
```

Added in v1.0.0

# sequencing

## flatMap

**Signature**

```ts
export declare const flatMap: <A, E2, B>(f: (a: A) => Either<E2, B>) => <E1>(self: Either<E1, A>) => Either<E2 | E1, B>
```

Added in v1.0.0

## flatMapNullable

**Signature**

```ts
export declare const flatMapNullable: <A, B, E2>(
  f: (a: A) => B | null | undefined,
  onNullable: E2
) => <E1>(self: Either<E1, A>) => Either<E2 | E1, NonNullable<B>>
```

Added in v1.0.0

## flatMapOption

**Signature**

```ts
export declare const flatMapOption: <A, B, E2>(
  f: (a: A) => Option<B>,
  onNone: E2
) => <E1>(self: Either<E1, A>) => Either<E2 | E1, B>
```

Added in v1.0.0

## flatten

The `flatten` function is the conventional monad join operator. It is used to remove one level of monadic structure, projecting its bound argument into the outer level.

**Signature**

```ts
export declare const flatten: <E1, E2, A>(mma: Either<E1, Either<E2, A>>) => Either<E1 | E2, A>
```

**Example**

```ts
import * as E from '@fp-ts/data/Either'

assert.deepStrictEqual(E.flatten(E.right(E.right('a'))), E.right('a'))
assert.deepStrictEqual(E.flatten(E.right(E.left('e'))), E.left('e'))
assert.deepStrictEqual(E.flatten(E.left('e')), E.left('e'))
```

Added in v1.0.0

## zipLeft

Sequences the specified effect after this effect, but ignores the value
produced by the effect.

**Signature**

```ts
export declare const zipLeft: <E2>(that: Either<E2, unknown>) => <E1, A>(self: Either<E1, A>) => Either<E2 | E1, A>
```

Added in v1.0.0

## zipRight

A variant of `flatMap` that ignores the value produced by this effect.

**Signature**

```ts
export declare const zipRight: <E2, A>(that: Either<E2, A>) => <E1>(self: Either<E1, unknown>) => Either<E2 | E1, A>
```

Added in v1.0.0

# traversing

## sequence

**Signature**

```ts
export declare const sequence: <F extends TypeLambda>(
  F: monoidal.Monoidal<F>
) => <E, FS, FR, FO, FE, A>(fa: Either<E, Kind<F, FS, FR, FO, FE, A>>) => Kind<F, FS, FR, FO, FE, Either<E, A>>
```

Added in v1.0.0

## sequenceReadonlyArray

Equivalent to `ReadonlyArray#sequence(Monoidal)`.

**Signature**

```ts
export declare const sequenceReadonlyArray: <E, A>(arr: readonly Either<E, A>[]) => Either<E, readonly A[]>
```

Added in v1.0.0

## traverse

Map each element of a structure to an action, evaluate these actions from left to right, and collect the Eithers.

**Signature**

```ts
export declare const traverse: <F extends TypeLambda>(
  Monoidal: monoidal.Monoidal<F>
) => <A, FS, FR, FO, FE, B>(
  f: (a: A) => Kind<F, FS, FR, FO, FE, B>
) => <E>(ta: Either<E, A>) => Kind<F, FS, FR, FO, FE, Either<E, B>>
```

**Example**

```ts
import { pipe } from '@fp-ts/data/Function'
import * as RA from '@fp-ts/data/ReadonlyArray'
import * as E from '@fp-ts/data/Either'
import * as O from '@fp-ts/data/Option'

assert.deepStrictEqual(pipe(E.right(['a']), E.traverse(O.Monoidal)(RA.head)), O.some(E.right('a')))

assert.deepStrictEqual(pipe(E.right([]), E.traverse(O.Monoidal)(RA.head)), O.none)
```

Added in v1.0.0

## traverseNonEmptyReadonlyArray

Equivalent to `NonEmptyReadonlyArray#traverse(Semigroupal)`.

**Signature**

```ts
export declare const traverseNonEmptyReadonlyArray: <A, E, B>(
  f: (a: A) => Either<E, B>
) => (as: readonly [A, ...A[]]) => Either<E, readonly [B, ...B[]]>
```

Added in v1.0.0

## traverseNonEmptyReadonlyArrayWithIndex

Equivalent to `NonEmptyReadonlyArray#traverseWithIndex(Semigroupal)`.

**Signature**

```ts
export declare const traverseNonEmptyReadonlyArrayWithIndex: <A, E, B>(
  f: (index: number, a: A) => Either<E, B>
) => (as: readonly [A, ...A[]]) => Either<E, readonly [B, ...B[]]>
```

Added in v1.0.0

## traverseReadonlyArray

Equivalent to `ReadonlyArray#traverse(Monoidal)`.

**Signature**

```ts
export declare const traverseReadonlyArray: <A, E, B>(
  f: (a: A) => Either<E, B>
) => (as: readonly A[]) => Either<E, readonly B[]>
```

Added in v1.0.0

## traverseReadonlyArrayWithIndex

Equivalent to `ReadonlyArray#traverseWithIndex(Monoidal)`.

**Signature**

```ts
export declare const traverseReadonlyArrayWithIndex: <A, E, B>(
  f: (index: number, a: A) => Either<E, B>
) => (as: readonly A[]) => Either<E, readonly B[]>
```

Added in v1.0.0

# tuple sequencing

## Zip

**Signature**

```ts
export declare const Zip: Either<never, readonly []>
```

Added in v1.0.0

## tupled

**Signature**

```ts
export declare const tupled: <E, A>(self: Either<E, A>) => Either<E, readonly [A]>
```

Added in v1.0.0

## zipFlatten

Sequentially zips this effect with the specified effect.

**Signature**

```ts
export declare const zipFlatten: <E2, B>(
  fb: Either<E2, B>
) => <E1, A extends readonly unknown[]>(self: Either<E1, A>) => Either<E2 | E1, readonly [...A, B]>
```

Added in v1.0.0

## zipWith

Sequentially zips this effect with the specified effect using the specified combiner function.

**Signature**

```ts
export declare const zipWith: <E2, B, A, C>(
  that: Either<E2, B>,
  f: (a: A, b: B) => C
) => <E1>(self: Either<E1, A>) => Either<E2 | E1, C>
```

Added in v1.0.0

# type lambdas

## EitherTypeLambda (interface)

**Signature**

```ts
export interface EitherTypeLambda extends TypeLambda {
  readonly type: Either<this['Out2'], this['Out1']>
}
```

Added in v1.0.0

## EitherTypeLambdaFix (interface)

**Signature**

```ts
export interface EitherTypeLambdaFix<E> extends TypeLambda {
  readonly type: Either<E, this['Out1']>
}
```

Added in v1.0.0

## ValidatedT (interface)

**Signature**

```ts
export interface ValidatedT<F extends TypeLambda, E> extends TypeLambda {
  readonly type: Kind<F, this['InOut1'], this['In1'], this['Out3'], E, this['Out1']>
}
```

Added in v1.0.0

# utils

## ap

**Signature**

```ts
export declare const ap: <E2, A>(fa: Either<E2, A>) => <E1, B>(fab: Either<E1, (a: A) => B>) => Either<E2 | E1, B>
```

Added in v1.0.0

## duplicate

**Signature**

```ts
export declare const duplicate: <E, A>(ma: Either<E, A>) => Either<E, Either<E, A>>
```

Added in v1.0.0

## elem

Tests whether a value is a member of a `Either`.

**Signature**

```ts
export declare const elem: <B>(a: B) => <A, E>(ma: Either<E, A>) => boolean
```

Added in v1.0.0

## exists

Returns `false` if `Left` or returns the Either of the application of the given predicate to the `Right` value.

**Signature**

```ts
export declare const exists: <A>(predicate: Predicate<A>) => (ma: Either<unknown, A>) => boolean
```

**Example**

```ts
import * as E from '@fp-ts/data/Either'

const f = E.exists((n: number) => n > 2)

assert.strictEqual(f(E.left('a')), false)
assert.strictEqual(f(E.right(1)), false)
assert.strictEqual(f(E.right(3)), true)
```

Added in v1.0.0

## extend

**Signature**

```ts
export declare const extend: <E, A, B>(f: (wa: Either<E, A>) => B) => (wa: Either<E, A>) => Either<E, B>
```

Added in v1.0.0

## reverse

**Signature**

```ts
export declare const reverse: <E, A>(ma: Either<E, A>) => Either<A, E>
```

Added in v1.0.0

## tap

Returns an effect that effectfully "peeks" at the Right of this effect.

**Signature**

```ts
export declare const tap: <A, E2>(f: (a: A) => Either<E2, unknown>) => <E1>(self: Either<E1, A>) => Either<E2 | E1, A>
```

Added in v1.0.0
