---
title: Brand.ts
nav_order: 2
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
  - [Brands (type alias)](#brands-type-alias)
  - [EnsureCommonBase (type alias)](#ensurecommonbase-type-alias)
  - [FromConstructor (type alias)](#fromconstructor-type-alias)
  - [Unbranded (type alias)](#unbranded-type-alias)
  - [UnionToIntersection (type alias)](#uniontointersection-type-alias)
- [mutations](#mutations)
  - [all](#all)
- [refinements](#refinements)
  - [isNominal](#isnominal)
  - [isRefined](#isrefined)
- [symbols](#symbols)
  - [BrandTypeId](#brandtypeid)
  - [BrandTypeId (type alias)](#brandtypeid-type-alias)
  - [NominalConstructorTypeId](#nominalconstructortypeid)
  - [NominalConstructorTypeId (type alias)](#nominalconstructortypeid-type-alias)
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
  refinement: Predicate<any>,
  onFailure: (a: any) => Brand.BrandErrors
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

## Brands (type alias)

A utility type to extract the brands from a branded type.

**Signature**

```ts
export type Brands<P> = P extends Brand<any>
  ? Brand.UnionToIntersection<
      {
        [k in keyof P[BrandTypeId]]: k extends string ? Brand<k> : never
      }[keyof P[BrandTypeId]]
    >
  : never
```

Added in v1.0.0

## EnsureCommonBase (type alias)

**Signature**

```ts
export type EnsureCommonBase<Brands extends readonly [Brand.Constructor<any>, ...Array<Brand.Constructor<any>>]> = {
  [B in keyof Brands]: Brand.Unbranded<Brand.FromConstructor<Brands[0]>> extends Brand.Unbranded<
    Brand.FromConstructor<Brands[B]>
  >
    ? Brand.Unbranded<Brand.FromConstructor<Brands[B]>> extends Brand.Unbranded<Brand.FromConstructor<Brands[0]>>
      ? Brands[B]
      : Brands[B]
    : 'ERROR: All brands should have the same base type'
}
```

Added in v1.0.0

## FromConstructor (type alias)

A utility type to extract a branded type from a `Brand.Constructor`.

**Signature**

```ts
export type FromConstructor<A> = A extends Brand.Constructor<infer B> ? B : never
```

Added in v1.0.0

## Unbranded (type alias)

A utility type to extract the value type from a brand.

**Signature**

```ts
export type Unbranded<P> = P extends infer Q & Brands<P> ? Q : P
```

Added in v1.0.0

## UnionToIntersection (type alias)

**Signature**

```ts
export type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R : never
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

# refinements

## isNominal

Returns `true` if the provided `Brand` is nominal, `false` otherwise.

**Signature**

```ts
export declare const isNominal: <A extends any>(u: any) => u is any
```

Added in v1.0.0

## isRefined

Returns `true` if the provided `Brand` is refined, `false` otherwise.

**Signature**

```ts
export declare const isRefined: <A extends any>(u: any) => u is any
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

## NominalConstructorTypeId

**Signature**

```ts
export declare const NominalConstructorTypeId: typeof NominalConstructorTypeId
```

Added in v1.0.0

## NominalConstructorTypeId (type alias)

**Signature**

```ts
export type NominalConstructorTypeId = typeof NominalConstructorTypeId
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
