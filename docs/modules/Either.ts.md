---
title: Either.ts
nav_order: 14
parent: Modules
---

## Either overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [left](#left)
  - [right](#right)
- [debugging](#debugging)
  - [inspectLeft](#inspectleft)
  - [inspectRight](#inspectright)
- [equivalence](#equivalence)
  - [getEquivalence](#getequivalence)
- [getters](#getters)
  - [getLeft](#getleft)
  - [getRight](#getright)
  - [merge](#merge)
- [guards](#guards)
  - [isEither](#iseither)
  - [isLeft](#isleft)
  - [isRight](#isright)
- [mapping](#mapping)
  - [map](#map)
  - [mapBoth](#mapboth)
- [models](#models)
  - [Either (type alias)](#either-type-alias)
  - [EitherUnify (interface)](#eitherunify-interface)
  - [EitherUnifyBlacklist (interface)](#eitherunifyblacklist-interface)
  - [Left (interface)](#left-interface)
  - [Right (interface)](#right-interface)
- [pattern matching](#pattern-matching)
  - [match](#match)
- [symbols](#symbols)
  - [EitherTypeId](#eithertypeid)
  - [EitherTypeId (type alias)](#eithertypeid-type-alias)
- [type lambdas](#type-lambdas)
  - [EitherTypeLambda (interface)](#eithertypelambda-interface)
- [utils](#utils)
  - [mapLeft](#mapleft)
  - [reverse](#reverse)

---

# constructors

## left

Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
structure.

**Signature**

```ts
export declare const left: <E>(e: E) => Either<E, never>
```

Added in v1.0.0

## right

Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
of this structure.

**Signature**

```ts
export declare const right: <A>(a: A) => Either<never, A>
```

Added in v1.0.0

# debugging

## inspectLeft

**Signature**

```ts
export declare const inspectLeft: {
  <E>(onLeft: (e: E) => void): <A>(self: Either<E, A>) => Either<E, A>
  <E, A>(self: Either<E, A>, onLeft: (e: E) => void): Either<E, A>
}
```

Added in v1.0.0

## inspectRight

**Signature**

```ts
export declare const inspectRight: {
  <A>(onRight: (a: A) => void): <E>(self: Either<E, A>) => Either<E, A>
  <E, A>(self: Either<E, A>, onRight: (a: A) => void): Either<E, A>
}
```

Added in v1.0.0

# equivalence

## getEquivalence

**Signature**

```ts
export declare const getEquivalence: <E, A>(EE: Equivalence<E>, EA: Equivalence<A>) => Equivalence<Either<E, A>>
```

Added in v1.0.0

# getters

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

assert.deepStrictEqual(E.getLeft(E.right('ok')), O.none())
assert.deepStrictEqual(E.getLeft(E.left('err')), O.some('err'))
```

Added in v1.0.0

## getRight

Converts a `Either` to an `Option` discarding the `Left`.

Alias of {@link toOption}.

**Signature**

```ts
export declare const getRight: <E, A>(self: Either<E, A>) => Option<A>
```

**Example**

```ts
import * as O from '@effect/data/Option'
import * as E from '@effect/data/Either'

assert.deepStrictEqual(E.getRight(E.right('ok')), O.some('ok'))
assert.deepStrictEqual(E.getRight(E.left('err')), O.none())
```

Added in v1.0.0

## merge

**Signature**

```ts
export declare const merge: <E, A>(self: Either<E, A>) => E | A
```

Added in v1.0.0

# guards

## isEither

Tests if a value is a `Either`.

**Signature**

```ts
export declare const isEither: (input: unknown) => input is Either<unknown, unknown>
```

**Example**

```ts
import { isEither, left, right } from '@effect/data/Either'

assert.deepStrictEqual(isEither(right(1)), true)
assert.deepStrictEqual(isEither(left('a')), true)
assert.deepStrictEqual(isEither({ right: 1 }), false)
```

Added in v1.0.0

## isLeft

Determine if a `Either` is a `Left`.

**Signature**

```ts
export declare const isLeft: <E, A>(self: Either<E, A>) => self is Left<E, A>
```

**Example**

```ts
import { isLeft, left, right } from '@effect/data/Either'

assert.deepStrictEqual(isLeft(right(1)), false)
assert.deepStrictEqual(isLeft(left('a')), true)
```

Added in v1.0.0

## isRight

Determine if a `Either` is a `Right`.

**Signature**

```ts
export declare const isRight: <E, A>(self: Either<E, A>) => self is Right<E, A>
```

**Example**

```ts
import { isRight, left, right } from '@effect/data/Either'

assert.deepStrictEqual(isRight(right(1)), true)
assert.deepStrictEqual(isRight(left('a')), false)
```

Added in v1.0.0

# mapping

## map

Maps the `Right` side of an `Either` value to a new `Either` value.

**Signature**

```ts
export declare const map: {
  <A, B>(f: (a: A) => B): <E>(self: Either<E, A>) => Either<E, B>
  <E, A, B>(self: Either<E, A>, f: (a: A) => B): Either<E, B>
}
```

Added in v1.0.0

## mapBoth

**Signature**

```ts
export declare const mapBoth: {
  <E1, E2, A, B>(options: { readonly onLeft: (e: E1) => E2; readonly onRight: (a: A) => B }): (
    self: Either<E1, A>
  ) => Either<E2, B>
  <E1, A, E2, B>(
    self: Either<E1, A>,
    options: { readonly onLeft: (e: E1) => E2; readonly onRight: (a: A) => B }
  ): Either<E2, B>
}
```

Added in v1.0.0

# models

## Either (type alias)

**Signature**

```ts
export type Either<E, A> = Left<E, A> | Right<E, A>
```

Added in v1.0.0

## EitherUnify (interface)

**Signature**

```ts
export interface EitherUnify<A extends { [Unify.typeSymbol]?: any }> {
  Either?: () => A[Unify.typeSymbol] extends Either<infer E0, infer A0> | infer _ ? Either<E0, A0> : never
}
```

Added in v1.0.0

## EitherUnifyBlacklist (interface)

**Signature**

```ts
export interface EitherUnifyBlacklist {}
```

Added in v1.0.0

## Left (interface)

**Signature**

```ts
export interface Left<E, A> extends Data.Case, Pipeable<Either<E, A>> {
  readonly _tag: 'Left'
  readonly [EitherTypeId]: {
    readonly _A: (_: never) => A
    readonly _E: (_: never) => E
  }
  get left(): E
  [Unify.typeSymbol]?: unknown
  [Unify.unifySymbol]?: EitherUnify<this>
  [Unify.blacklistSymbol]?: EitherUnifyBlacklist
}
```

Added in v1.0.0

## Right (interface)

**Signature**

```ts
export interface Right<E, A> extends Data.Case, Pipeable<Either<E, A>> {
  readonly _tag: 'Right'
  get right(): A
  readonly [EitherTypeId]: {
    readonly _A: (_: never) => A
    readonly _E: (_: never) => E
  }
  [Unify.typeSymbol]?: unknown
  [Unify.unifySymbol]?: EitherUnify<this>
  [Unify.blacklistSymbol]?: EitherUnifyBlacklist
}
```

Added in v1.0.0

# pattern matching

## match

Takes two functions and an `Either` value, if the value is a `Left` the inner value is applied to the `onLeft function,
if the value is a `Right`the inner value is applied to the`onRight` function.

**Signature**

```ts
export declare const match: {
  <E, B, A, C = B>(options: { readonly onLeft: (e: E) => B; readonly onRight: (a: A) => C }): (
    self: Either<E, A>
  ) => B | C
  <E, A, B, C = B>(self: Either<E, A>, options: { readonly onLeft: (e: E) => B; readonly onRight: (a: A) => C }): B | C
}
```

**Example**

```ts
import * as E from '@effect/data/Either'
import { pipe } from '@effect/data/Function'

const onLeft = (strings: ReadonlyArray<string>): string => `strings: ${strings.join(', ')}`

const onRight = (value: number): string => `Ok: ${value}`

assert.deepStrictEqual(pipe(E.right(1), E.match({ onLeft, onRight })), 'Ok: 1')
assert.deepStrictEqual(
  pipe(E.left(['string 1', 'string 2']), E.match({ onLeft, onRight })),
  'strings: string 1, string 2'
)
```

Added in v1.0.0

# symbols

## EitherTypeId

**Signature**

```ts
export declare const EitherTypeId: typeof EitherTypeId
```

Added in v1.0.0

## EitherTypeId (type alias)

**Signature**

```ts
export type EitherTypeId = typeof EitherTypeId
```

Added in v1.0.0

# type lambdas

## EitherTypeLambda (interface)

**Signature**

```ts
export interface EitherTypeLambda extends TypeLambda {
  readonly type: Either<this['Out1'], this['Target']>
}
```

Added in v1.0.0

# utils

## mapLeft

Maps the `Left` side of an `Either` value to a new `Either` value.

**Signature**

```ts
export declare const mapLeft: {
  <E, G>(f: (e: E) => G): <A>(self: Either<E, A>) => Either<G, A>
  <E, A, G>(self: Either<E, A>, f: (e: E) => G): Either<G, A>
}
```

Added in v1.0.0

## reverse

**Signature**

```ts
export declare const reverse: <E, A>(self: Either<E, A>) => Either<A, E>
```

Added in v1.0.0
