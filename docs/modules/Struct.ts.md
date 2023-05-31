---
title: Struct.ts
nav_order: 43
parent: Modules
---

## Struct overview

This module provides utility functions for working with structs in TypeScript.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [getEquivalence](#getequivalence)
  - [getMonoid](#getmonoid)
  - [getOrder](#getorder)
  - [getSemigroup](#getsemigroup)
- [utils](#utils)
  - [evolve](#evolve)
  - [omit](#omit)
  - [pick](#pick)

---

# combinators

## getEquivalence

Given a struct of `Equivalence`s returns a new `Equivalence` that compares values of a struct
by applying each `Equivalence` to the corresponding property of the struct.

Alias of {@link equivalence.struct}.

**Signature**

```ts
export declare const getEquivalence: <R extends Record<string, equivalence.Equivalence<any>>>(
  predicates: R
) => equivalence.Equivalence<{ readonly [K in keyof R]: [R[K]] extends [equivalence.Equivalence<infer A>] ? A : never }>
```

**Example**

```ts
import { getEquivalence } from '@effect/data/Struct'
import * as S from '@effect/data/String'
import * as N from '@effect/data/Number'

const PersonEquivalence = getEquivalence({
  name: S.Equivalence,
  age: N.Equivalence,
})

assert.deepStrictEqual(PersonEquivalence({ name: 'John', age: 25 }, { name: 'John', age: 25 }), true)
assert.deepStrictEqual(PersonEquivalence({ name: 'John', age: 25 }, { name: 'John', age: 40 }), false)
```

Added in v1.0.0

## getMonoid

This function creates and returns a new `Monoid` for a struct of values based on the given `Monoid`s for each property in the struct.
The returned `Monoid` combines two structs of the same type by applying the corresponding `Monoid` passed as arguments to each property in the struct.

The `empty` value of the returned `Monoid` is a struct where each property is the `empty` value of the corresponding `Monoid` in the input `monoids` object.

It is useful when you need to combine two structs of the same type and you have a specific way of combining each property of the struct.

See also {@link getSemigroup}.

**Signature**

```ts
export declare const getMonoid: <R extends { readonly [x: string]: monoid.Monoid<any> }>(
  fields: R
) => monoid.Monoid<{ [K in keyof R]: [R[K]] extends [monoid.Monoid<infer A>] ? A : never }>
```

Added in v1.0.0

## getOrder

This function creates and returns a new `Order` for a struct of values based on the given `Order`s
for each property in the struct.

Alias of {@link order.struct}.

**Signature**

```ts
export declare const getOrder: <R extends { readonly [x: string]: order.Order<any> }>(
  fields: R
) => order.Order<{ [K in keyof R]: [R[K]] extends [order.Order<infer A>] ? A : never }>
```

Added in v1.0.0

## getSemigroup

This function creates and returns a new `Semigroup` for a struct of values based on the given `Semigroup`s for each property in the struct.
The returned `Semigroup` combines two structs of the same type by applying the corresponding `Semigroup` passed as arguments to each property in the struct.

It is useful when you need to combine two structs of the same type and you have a specific way of combining each property of the struct.

See also {@link getMonoid}.

**Signature**

```ts
export declare const getSemigroup: <R extends { readonly [x: string]: semigroup.Semigroup<any> }>(
  fields: R
) => semigroup.Semigroup<{ [K in keyof R]: [R[K]] extends [semigroup.Semigroup<infer A>] ? A : never }>
```

**Example**

```ts
import { getSemigroup } from '@effect/data/Struct'
import * as Semigroup from '@effect/data/typeclass/Semigroup'
import * as O from '@effect/data/Option'

const PersonSemigroup = getSemigroup({
  name: Semigroup.last<string>(),
  age: O.getOptionalMonoid(Semigroup.last<number>()),
})

assert.deepStrictEqual(PersonSemigroup.combine({ name: 'John', age: O.none() }, { name: 'John', age: O.some(25) }), {
  name: 'John',
  age: O.some(25),
})
assert.deepStrictEqual(PersonSemigroup.combine({ name: 'John', age: O.some(25) }, { name: 'John', age: O.none() }), {
  name: 'John',
  age: O.some(25),
})
```

Added in v1.0.0

# utils

## evolve

Transforms the values of a Struct provided a transformation function for each key.
If no transformation function is provided for a key, it will return the origional value for that key.

**Signature**

```ts
export declare const evolve: {
  <O, T extends Partial<{ [K in keyof O]: (a: O[K]) => unknown }>>(t: T): (obj: O) => {
    [K in keyof O]: K extends keyof T ? (T[K] extends (...a: any) => any ? ReturnType<T[K]> : O[K]) : O[K]
  }
  <O, T extends Partial<{ [K in keyof O]: (a: O[K]) => unknown }>>(obj: O, t: T): {
    [K in keyof O]: K extends keyof T ? (T[K] extends (...a: any) => any ? ReturnType<T[K]> : O[K]) : O[K]
  }
}
```

**Example**

```ts
import { evolve } from '@effect/data/Struct'
import { pipe } from '@effect/data/Function'

assert.deepStrictEqual(
  pipe(
    { a: 'a', b: 1, c: 3 },
    evolve({
      a: (a) => a.length,
      b: (b) => b * 2,
    })
  ),
  { a: 1, b: 2, c: 3 }
)
```

Added in v1.0.0

## omit

Create a new object by omitting properties of an existing object.

**Signature**

```ts
export declare const omit: <S, Keys extends readonly [keyof S, ...(keyof S)[]]>(
  ...keys: Keys
) => (s: S) => { [K in Exclude<keyof S, Keys[number]>]: S[K] }
```

**Example**

```ts
import { omit } from '@effect/data/Struct'
import { pipe } from '@effect/data/Function'

assert.deepStrictEqual(pipe({ a: 'a', b: 1, c: true }, omit('c')), { a: 'a', b: 1 })
```

Added in v1.0.0

## pick

Create a new object by picking properties of an existing object.

**Signature**

```ts
export declare const pick: <S, Keys extends readonly [keyof S, ...(keyof S)[]]>(
  ...keys: Keys
) => (s: S) => { [K in Keys[number]]: S[K] }
```

**Example**

```ts
import { pick } from '@effect/data/Struct'
import { pipe } from '@effect/data/Function'

assert.deepStrictEqual(pipe({ a: 'a', b: 1, c: true }, pick('a', 'b')), { a: 'a', b: 1 })
```

Added in v1.0.0
