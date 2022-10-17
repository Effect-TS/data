---
title: Equal.ts
nav_order: 13
parent: Modules
---

## Equal overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [equality](#equality)
  - [equals](#equals)
- [hashing](#hashing)
  - [hash](#hash)
  - [hashCombine](#hashcombine)
  - [hashOptimize](#hashoptimize)
  - [hashRandom](#hashrandom)
- [models](#models)
  - [Equal (interface)](#equal-interface)
- [symbols](#symbols)
  - [symbolEqual](#symbolequal)
  - [symbolHash](#symbolhash)

---

# equality

## equals

**Signature**

```ts
export declare function equals<B>(that: B): <A>(self: A) => boolean
export declare function equals<A, B>(self: A, that: B): boolean
```

Added in v1.0.0

# hashing

## hash

**Signature**

```ts
export declare const hash: <A>(self: A) => number
```

Added in v1.0.0

## hashCombine

**Signature**

```ts
export declare const hashCombine: (b: number) => (self: number) => number
```

Added in v1.0.0

## hashOptimize

**Signature**

```ts
export declare const hashOptimize: (n: number) => number
```

Added in v1.0.0

## hashRandom

**Signature**

```ts
export declare const hashRandom: <A extends object>(self: A) => number
```

Added in v1.0.0

# models

## Equal (interface)

**Signature**

```ts
export interface Equal {
  [symbolEqual](that: unknown): boolean
  [symbolHash](): number
}
```

Added in v1.0.0

# symbols

## symbolEqual

**Signature**

```ts
export declare const symbolEqual: typeof symbolEqual
```

Added in v1.0.0

## symbolHash

**Signature**

```ts
export declare const symbolHash: typeof symbolHash
```

Added in v1.0.0
