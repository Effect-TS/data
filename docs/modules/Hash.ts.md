---
title: Hash.ts
nav_order: 13
parent: Modules
---

## Hash overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combining](#combining)
  - [combine](#combine)
- [hashing](#hashing)
  - [evaluate](#evaluate)
  - [random](#random)
- [models](#models)
  - [Hash](#hash)
  - [Hash (interface)](#hash-interface)
  - [HashConstructor (interface)](#hashconstructor-interface)
- [symbol](#symbol)
  - [symbol](#symbol-1)

---

# combining

## combine

**Signature**

```ts
export declare const combine: (b: number) => (self: number) => number
```

Added in v1.0.0

# hashing

## evaluate

**Signature**

```ts
export declare const evaluate: <A>(self: A) => number
```

Added in v1.0.0

## random

**Signature**

```ts
export declare const random: <A extends object>(self: A) => number
```

Added in v1.0.0

# models

## Hash

**Signature**

```ts
export declare const Hash: HashConstructor
```

Added in v1.0.0

## Hash (interface)

**Signature**

```ts
export interface Hash {
  readonly [Hash.symbol]: () => number
}
```

Added in v1.0.0

## HashConstructor (interface)

**Signature**

```ts
export interface HashConstructor {
  readonly symbol: unique symbol
}
```

Added in v1.0.0

# symbol

## symbol

**Signature**

```ts
export declare const symbol: HashConstructor['symbol']
```

Added in v1.0.0
