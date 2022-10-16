---
title: SafeEval.ts
nav_order: 25
parent: Modules
---

## SafeEval overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [gen](#gen)
  - [reduce](#reduce)
  - [struct](#struct)
  - [succeed](#succeed)
  - [suspend](#suspend)
  - [sync](#sync)
  - [tuple](#tuple)
  - [unit](#unit)
- [destructors](#destructors)
  - [execute](#execute)
- [elements](#elements)
  - [zip](#zip)
  - [zipLeft](#zipleft)
  - [zipRight](#zipright)
  - [zipWith](#zipwith)
- [mapping](#mapping)
  - [map](#map)
- [models](#models)
  - [SafeEval (interface)](#safeeval-interface)
- [sequencing](#sequencing)
  - [flatMap](#flatmap)
  - [flatten](#flatten)
  - [tap](#tap)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)

---

# constructors

## gen

**Signature**

```ts
export declare const gen: <Eff extends SE.GenSafeEval<any>, AEff>(
  f: (i: <A>(_: SafeEval<A>) => SE.GenSafeEval<A>) => Generator<Eff, AEff, any>
) => SafeEval<AEff>
```

Added in v1.0.0

## reduce

**Signature**

```ts
export declare const reduce: <A, B>(as: Iterable<A>, b: B, f: (b: B, a: A) => SafeEval<B>) => SafeEval<B>
```

Added in v1.0.0

## struct

Constructs a record of results from a record of `SafeEval`s.

**Signature**

```ts
export declare const struct: <NER extends Record<string, SafeEval<any>>>(
  r: (keyof NER extends never ? never : NER) & Record<string, SafeEval<any>>
) => SafeEval<{ [K in keyof NER]: [NER[K]] extends [SafeEval<infer A>] ? A : never }>
```

Added in v1.0.0

## succeed

Constructs a computation that always succeeds with the specified value.

**Signature**

```ts
export declare const succeed: <A>(a: A) => SafeEval<A>
```

Added in v1.0.0

## suspend

Suspends a computation.

This is particularly useful for avoiding infinite recursion in recursive
computations.

**Signature**

```ts
export declare const suspend: <A>(f: LazyArg<SafeEval<A>>) => SafeEval<A>
```

Added in v1.0.0

## sync

Lift a synchronous, non-failable computation into a `SafeEval`.

**Signature**

```ts
export declare const sync: <A>(a: LazyArg<A>) => SafeEval<A>
```

Added in v1.0.0

## tuple

Constructs a tuple of results from a tuple of `SafeEval`s.

**Signature**

```ts
export declare const tuple: typeof SE.tuple
```

Added in v1.0.0

## unit

Constructs a computation that always returns the `Unit` value.

**Signature**

```ts
export declare const unit: SafeEval<void>
```

Added in v1.0.0

# destructors

## execute

Executes the computation represented by the specified `SafeEval`.

**Signature**

```ts
export declare const execute: <A>(self: SafeEval<A>) => A
```

Added in v1.0.0

# elements

## zip

Combines this computation with the specified computation combining the
results of both into a tuple.

**Signature**

```ts
export declare const zip: <B>(that: SafeEval<B>) => <A>(self: SafeEval<A>) => SafeEval<readonly [A, B]>
```

Added in v1.0.0

## zipLeft

Combines this computation with the specified computation, returning the
value of this computation.

**Signature**

```ts
export declare const zipLeft: <B>(that: SafeEval<B>) => <A>(self: SafeEval<A>) => SafeEval<A>
```

Added in v1.0.0

## zipRight

Combines this computation with the specified computation, returning the
value of that computation.

**Signature**

```ts
export declare const zipRight: <B>(that: SafeEval<B>) => <A>(self: SafeEval<A>) => SafeEval<B>
```

Added in v1.0.0

## zipWith

Combines this computation with the specified computation combining the
results of both using the specified function.

**Signature**

```ts
export declare const zipWith: <A, B, C>(that: SafeEval<B>, f: (a: A, b: B) => C) => (self: SafeEval<A>) => SafeEval<C>
```

Added in v1.0.0

# mapping

## map

Extends this computation with another computation that depends on the
result of this computation by running the first computation, using its
result to generate a second computation, and running that computation.

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (self: SafeEval<A>) => SafeEval<B>
```

Added in v1.0.0

# models

## SafeEval (interface)

`SafeEval<A>` is a purely functional description of a computation.

This data type is designed for speed and low allocations. It is particularly
useful when you need the ability to suspend recursive procedures.

**Signature**

```ts
export interface SafeEval<A> {
  readonly _id: TypeId
  readonly _A: (_: never) => A
}
```

Added in v1.0.0

# sequencing

## flatMap

Extends this computation with another computation that depends on the
result of this computation by running the first computation, using its
result to generate a second computation, and running that computation.

**Signature**

```ts
export declare const flatMap: <A, B>(f: (a: A) => SafeEval<B>) => (self: SafeEval<A>) => SafeEval<B>
```

Added in v1.0.0

## flatten

Flatten an `SafeEval<SafeEval<A>>` into an `SafeEval<A>`.

**Signature**

```ts
export declare const flatten: <A>(self: SafeEval<SafeEval<A>>) => SafeEval<A>
```

Added in v1.0.0

## tap

Returns a computation that effectfully "peeks" at the success of this one.

**Signature**

```ts
export declare const tap: <A, X>(f: (a: A) => SafeEval<X>) => (self: SafeEval<A>) => SafeEval<A>
```

Added in v1.0.0

# symbol

## TypeId (type alias)

**Signature**

```ts
export type TypeId = typeof TypeId
```

Added in v1.0.0
