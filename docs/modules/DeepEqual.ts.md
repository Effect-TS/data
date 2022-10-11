---
title: DeepEqual.ts
nav_order: 1
parent: Modules
---

## DeepEqual overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [hashing](#hashing)
  - [deepEqual](#deepequal)
- [model](#model)
  - [DeepEqual](#deepequal)
  - [DeepEqual (interface)](#deepequal-interface)
  - [DeepEqualConstructor (interface)](#deepequalconstructor-interface)

---

# hashing

## deepEqual

**Signature**

```ts
export declare function deepEqual<B>(that: B): <A>(self: A) => boolean
export declare function deepEqual<A, B>(self: A, that: B): boolean
```

Added in v1.0.0

# model

## DeepEqual

**Signature**

```ts
export declare const DeepEqual: DeepEqualConstructor
```

Added in v1.0.0

## DeepEqual (interface)

**Signature**

```ts
export interface DeepEqual extends DH.DeepHash {
  readonly [DeepEqual.symbol]: (that: unknown) => boolean
}
```

Added in v1.0.0

## DeepEqualConstructor (interface)

**Signature**

```ts
export interface DeepEqualConstructor {
  readonly symbol: unique symbol
}
```

Added in v1.0.0
