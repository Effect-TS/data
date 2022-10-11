---
title: DeepHash.ts
nav_order: 1
parent: Modules
---

## DeepHash overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combining](#combining)
  - [combine](#combine)
- [hashing](#hashing)
  - [deepHash](#deephash)
- [model](#model)
  - [DeepHash](#deephash)
  - [DeepHash (interface)](#deephash-interface)
  - [DeepHashConstructor (interface)](#deephashconstructor-interface)

---

# combining

## combine

**Signature**

```ts
export declare function combine(b: number): (self: number) => number
```

Added in v1.0.0

# hashing

## deepHash

**Signature**

```ts
export declare function deepHash<A>(self: A)
```

Added in v1.0.0

# model

## DeepHash

**Signature**

```ts
export declare const DeepHash: DeepHashConstructor
```

Added in v1.0.0

## DeepHash (interface)

**Signature**

```ts
export interface DeepHash {
  readonly [DeepHash.symbol]: () => number
}
```

Added in v1.0.0

## DeepHashConstructor (interface)

**Signature**

```ts
export interface DeepHashConstructor {
  readonly symbol: unique symbol
}
```

Added in v1.0.0
