---
title: Equal.ts
nav_order: 8
parent: Modules
---

## Equal overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [equality](#equality)
  - [equals](#equals)
- [model](#model)
  - [Equal](#equal)
  - [Equal (interface)](#equal-interface)
  - [EqualConstructor (interface)](#equalconstructor-interface)
- [symbol](#symbol)
  - [symbol](#symbol-1)

---

# equality

## equals

**Signature**

```ts
export declare function equals<B>(that: B): <A>(self: A) => boolean
export declare function equals<A, B>(self: A, that: B): boolean
```

Added in v1.0.0

# model

## Equal

**Signature**

```ts
export declare const Equal: EqualConstructor
```

Added in v1.0.0

## Equal (interface)

**Signature**

```ts
export interface Equal extends DH.Hash {
  readonly [Equal.symbol]: (that: unknown) => boolean
}
```

Added in v1.0.0

## EqualConstructor (interface)

**Signature**

```ts
export interface EqualConstructor {
  readonly symbol: unique symbol
}
```

Added in v1.0.0

# symbol

## symbol

**Signature**

```ts
export declare const symbol: EqualConstructor['symbol']
```

Added in v1.0.0
