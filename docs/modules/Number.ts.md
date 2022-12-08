---
title: Number.ts
nav_order: 25
parent: Modules
---

## Number overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [instances](#instances)
  - [Bounded](#bounded)
  - [MonoidMultiply](#monoidmultiply)
  - [MonoidSum](#monoidsum)
  - [Order](#order)
  - [SemigroupMultiply](#semigroupmultiply)
  - [SemigroupSum](#semigroupsum)
- [refinements](#refinements)
  - [isNumber](#isnumber)
- [utils](#utils)
  - [decrement](#decrement)
  - [increment](#increment)
  - [multiply](#multiply)
  - [sign](#sign)
  - [sub](#sub)
  - [sum](#sum)

---

# instances

## Bounded

**Signature**

```ts
export declare const Bounded: bounded.Bounded<number>
```

Added in v1.0.0

## MonoidMultiply

`number` monoid under multiplication.

The `empty` value is `1`.

**Signature**

```ts
export declare const MonoidMultiply: monoid.Monoid<number>
```

Added in v1.0.0

## MonoidSum

`number` monoid under addition.

The `empty` value is `0`.

**Signature**

```ts
export declare const MonoidSum: monoid.Monoid<number>
```

Added in v1.0.0

## Order

**Signature**

```ts
export declare const Order: order.Order<number>
```

Added in v1.0.0

## SemigroupMultiply

`number` semigroup under multiplication.

**Signature**

```ts
export declare const SemigroupMultiply: semigroup.Semigroup<number>
```

**Example**

```ts
import { SemigroupMultiply } from '@fp-ts/data/Number'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe(2, SemigroupMultiply.combine(3)), 6)
```

Added in v1.0.0

## SemigroupSum

`number` semigroup under addition.

**Signature**

```ts
export declare const SemigroupSum: semigroup.Semigroup<number>
```

**Example**

```ts
import { SemigroupSum } from '@fp-ts/data/Number'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe(2, SemigroupSum.combine(3)), 5)
```

Added in v1.0.0

# refinements

## isNumber

**Signature**

```ts
export declare const isNumber: Refinement<unknown, number>
```

Added in v1.0.0

# utils

## decrement

**Signature**

```ts
export declare const decrement: (n: number) => number
```

Added in v1.0.0

## increment

**Signature**

```ts
export declare const increment: (n: number) => number
```

Added in v1.0.0

## multiply

**Signature**

```ts
export declare const multiply: (that: number) => (self: number) => number
```

Added in v1.0.0

## sign

**Signature**

```ts
export declare const sign: (n: number) => Ordering
```

Added in v1.0.0

## sub

**Signature**

```ts
export declare const sub: (that: number) => (self: number) => number
```

Added in v1.0.0

## sum

**Signature**

```ts
export declare const sum: (that: number) => (self: number) => number
```

Added in v1.0.0
