---
title: Brand.ts
nav_order: 3
parent: Modules
---

## Brand overview

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
- [mutations](#mutations)
  - [all](#all)
- [symbols](#symbols)
  - [BrandTypeId](#brandtypeid)
  - [BrandTypeId (type alias)](#brandtypeid-type-alias)
  - [RefinedConstructorsTypeId](#refinedconstructorstypeid)
  - [RefinedConstructorsTypeId (type alias)](#refinedconstructorstypeid-type-alias)

---

# constructors

## error

**Signature**

```ts
export declare const error: (message: string, meta?: unknown) => Brand.BrandErrors
```

Added in v1.0.0

## errors

**Signature**

```ts
export declare const errors: (...errors: Array<Brand.BrandErrors>) => Brand.BrandErrors
```

Added in v1.0.0

## nominal

**Signature**

```ts
export declare const nominal: <A extends any>() => any
```

Added in v1.0.0

## refined

**Signature**

```ts
export declare const refined: <A extends any>(
  refinement: Predicate<Brand.Unbranded<A>>,
  onFailure: (a: Brand.Unbranded<A>) => Brand.BrandErrors
) => any
```

Added in v1.0.0

# models

## Brand (interface)

**Signature**

```ts
export interface Brand<
```

Added in v1.0.0

# mutations

## all

Composes two brands together to form a single branded type.

**Signature**

```ts
export declare const all: any
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
