---
title: Brand.ts
nav_order: 3
parent: Modules
---

## Brand overview

This module provides types and utility functions to create and work with branded types,
which are TypeScript types with an added type tag to prevent accidental usage of a value in the wrong context.

The `refined` and `nominal` functions are both used to create branded types in TypeScript.
The main difference between them is that `refined` allows for validation of the data, while `nominal` does not.

The `nominal` function is used to create a new branded type that has the same underlying type as the input, but with a different name.
This is useful when you want to distinguish between two values of the same type that have different meanings.
The `nominal` function does not perform any validation of the input data.

On the other hand, the `refined` function is used to create a new branded type that has the same underlying type as the input,
but with a different name, and it also allows for validation of the input data.
The `refined` function takes a predicate that is used to validate the input data.
If the input data fails the validation, a `BrandErrors` is returned, which provides information about the specific validation failure.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [error](#error)
  - [errors](#errors)
  - [nominal](#nominal)
  - [refined](#refined)
- [models](#models)
  - [Brand (interface)](#brand-interface)
- [symbols](#symbols)
  - [BrandTypeId](#brandtypeid)
  - [BrandTypeId (type alias)](#brandtypeid-type-alias)
  - [RefinedConstructorsTypeId](#refinedconstructorstypeid)
  - [RefinedConstructorsTypeId (type alias)](#refinedconstructorstypeid-type-alias)

---

# constructors

## error

Returns a `BrandErrors` that contains a single `RefinementError`.

**Signature**

```ts
export declare const error: (message: string, meta?: unknown) => Brand.BrandErrors
```

Added in v1.0.0

## errors

Takes a variable number of `BrandErrors` and returns a single `BrandErrors` that contains all refinement errors.

**Signature**

```ts
export declare const errors: (...errors: Array<Brand.BrandErrors>) => Brand.BrandErrors
```

Added in v1.0.0

## nominal

This function returns a `Brand.Constructor` that **does not apply any runtime checks**, it just returns the provided value.
It can be used to create nominal types that allow distinguishing between two values of the same type but with different meanings.

If you also want to perform some validation, see {@link refined}.

**Signature**

```ts
export declare const nominal: <A extends any>(_: void) => any
```

**Example**

```ts
import * as Brand from '@effect/data/Brand'

type UserId = number & Brand.Brand<'UserId'>

const UserId = Brand.nominal<UserId>()

assert.strictEqual(UserId(1), 1)
```

Added in v1.0.0

## refined

Returns a `Brand.Constructor` that can construct a branded type from an unbranded value using the provided `refinement`
predicate as validation of the input data.

If you don't want to perform any validation but only distinguish between two values of the same type but with different meanings,
see {@link nominal}.

**Signature**

```ts
export declare const refined: <A extends any>(
  refinement: Predicate<Brand.Unbranded<A>>,
  onFailure: (a: Brand.Unbranded<A>) => Brand.BrandErrors
) => any
```

**Example**

```ts
import * as Brand from '@effect/data/Brand'

type Int = number & Brand.Brand<'Int'>

const Int = Brand.refined<Int>(
  (n) => Number.isInteger(n),
  (n) => Brand.error(`Expected ${n} to be an integer`)
)

assert.strictEqual(Int(1), 1)
assert.throws(() => Int(1.1))
```

Added in v1.0.0

# models

## Brand (interface)

A generic interface that defines a branded type. It contains a `unique symbol` property `[BrandTypeId]` with a `string` property,
which represents the brand.

**Signature**

```ts
export interface Brand<
```

Added in v1.0.0

# symbols

## BrandTypeId

**Signature**

```ts
export declare const BrandTypeId: typeof BrandTypeId
```

Added in v1.0.0

## BrandTypeId (type alias)

**Signature**

```ts
export type BrandTypeId = typeof BrandTypeId
```

Added in v1.0.0

## RefinedConstructorsTypeId

**Signature**

```ts
export declare const RefinedConstructorsTypeId: typeof RefinedConstructorsTypeId
```

Added in v1.0.0

## RefinedConstructorsTypeId (type alias)

**Signature**

```ts
export type RefinedConstructorsTypeId = typeof RefinedConstructorsTypeId
```

Added in v1.0.0
