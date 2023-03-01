---
title: Hash.ts
nav_order: 19
parent: Modules
---

## Hash overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [guards](#guards)
  - [isHash](#ishash)
- [hashing](#hashing)
  - [array](#array)
  - [combine](#combine)
  - [hash](#hash)
  - [number](#number)
  - [optimize](#optimize)
  - [random](#random)
  - [string](#string)
  - [structure](#structure)
- [models](#models)
  - [Hash (interface)](#hash-interface)
- [symbols](#symbols)
  - [symbol](#symbol)

---

# guards

## isHash

**Signature**

```ts
export declare const isHash: { (u: unknown): u is Hash; (_?: undefined): (u: unknown) => u is Hash }
```

Added in v1.0.0

# hashing

## array

**Signature**

```ts
export declare const array: { <A>(arr: readonly A[]): number; (_?: undefined): <A>(arr: readonly A[]) => number }
```

Added in v1.0.0

## combine

**Signature**

```ts
export declare const combine: { (that: number): (self: number) => number; (self: number, that: number): number }
```

Added in v1.0.0

## hash

**Signature**

```ts
export declare const hash: { <A>(self: A): number; (_?: undefined): <A>(self: A) => number }
```

Added in v1.0.0

## number

**Signature**

```ts
export declare const number: { (n: number): number; (_?: undefined): (n: number) => number }
```

Added in v1.0.0

## optimize

**Signature**

```ts
export declare const optimize: { (n: number): number; (_?: undefined): (n: number) => number }
```

Added in v1.0.0

## random

**Signature**

```ts
export declare const random: {
  <A extends object>(self: A): number
  (_?: undefined): <A extends object>(self: A) => number
}
```

Added in v1.0.0

## string

**Signature**

```ts
export declare const string: { (str: string): number; (_?: undefined): (str: string) => number }
```

Added in v1.0.0

## structure

**Signature**

```ts
export declare const structure: {
  <A extends object>(o: A): number
  (_?: undefined): <A extends object>(o: A) => number
}
```

Added in v1.0.0

# models

## Hash (interface)

**Signature**

```ts
export interface Hash {
  [symbol](): number
}
```

Added in v1.0.0

# symbols

## symbol

**Signature**

```ts
export declare const symbol: typeof symbol
```

Added in v1.0.0
