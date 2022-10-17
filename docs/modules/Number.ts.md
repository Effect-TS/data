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
  - [Ord](#ord)
  - [SemigroupMultiply](#semigroupmultiply)
  - [SemigroupSum](#semigroupsum)
- [refinements](#refinements)
  - [isNumber](#isnumber)
- [utils](#utils)
  - [multiply](#multiply)
  - [multiplyAll](#multiplyall)
  - [sub](#sub)
  - [sum](#sum)
  - [sumAll](#sumall)

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

## Ord

**Signature**

```ts
export declare const Ord: ord.Sortable<number>
```

Added in v1.0.0

## SemigroupMultiply

`number` semigroup under multiplication.

**Signature**

```ts
export declare const SemigroupMultiply: semigroup.Semigroup<number>
```

Added in v1.0.0

## SemigroupSum

`number` semigroup under addition.

**Signature**

```ts
export declare const SemigroupSum: semigroup.Semigroup<number>
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

## multiply

**Signature**

```ts
export declare const multiply: (that: number) => (self: number) => number
```

Added in v1.0.0

## multiplyAll

**Signature**

```ts
export declare const multiplyAll: (collection: Iterable<number>) => number
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

## sumAll

**Signature**

```ts
export declare const sumAll: (collection: Iterable<number>) => number
```

Added in v1.0.0
