---
title: Equivalence.ts
nav_order: 14
parent: Modules
---

## Equivalence overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructor](#constructor)
  - [make](#make)
- [instances](#instances)
  - [bigint](#bigint)
  - [contramap](#contramap)
  - [equal](#equal)
  - [number](#number)
  - [strict](#strict)
  - [string](#string)
  - [struct](#struct)
  - [symbol](#symbol)
  - [tuple](#tuple)
- [models](#models)
  - [Equivalence (interface)](#equivalence-interface)

---

# constructor

## make

**Signature**

```ts
export declare const make: <A>(equals: (that: A) => (self: A) => boolean) => Equivalence<A>
```

Added in v1.0.0

# instances

## bigint

**Signature**

```ts
export declare const bigint: Equivalence<bigint>
```

Added in v1.0.0

## contramap

**Signature**

```ts
export declare const contramap: <A, B>(f: (self: B) => A) => (self: Equivalence<A>) => Equivalence<B>
```

Added in v1.0.0

## equal

**Signature**

```ts
export declare const equal: <A>() => Equivalence<A>
```

Added in v1.0.0

## number

**Signature**

```ts
export declare const number: Equivalence<number>
```

Added in v1.0.0

## strict

**Signature**

```ts
export declare const strict: <A>() => Equivalence<A>
```

Added in v1.0.0

## string

**Signature**

```ts
export declare const string: Equivalence<string>
```

Added in v1.0.0

## struct

**Signature**

```ts
export declare const struct: <As extends Readonly<Record<string, Equivalence<any>>>>(
  as: As
) => Equivalence<{ readonly [k in keyof As]: As[k] extends Equivalence<infer A> ? A : never }>
```

Added in v1.0.0

## symbol

**Signature**

```ts
export declare const symbol: Equivalence<symbol>
```

Added in v1.0.0

## tuple

**Signature**

```ts
export declare const tuple: <As extends readonly Equivalence<any>[]>(
  ...as: As
) => Equivalence<{ readonly [k in keyof As]: As[k] extends Equivalence<infer A> ? A : never }>
```

Added in v1.0.0

# models

## Equivalence (interface)

**Signature**

```ts
export interface Equivalence<A> {
  (that: A): (self: A) => boolean
}
```

Added in v1.0.0
