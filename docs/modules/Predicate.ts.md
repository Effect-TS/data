---
title: Predicate.ts
nav_order: 28
parent: Modules
---

## Predicate overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [id](#id)
- [do notation](#do-notation)
  - [bindTo](#bindto)
- [instances](#instances)
  - [Contravariant](#contravariant)
  - [Invariant](#invariant)
  - [Of](#of)
  - [Product](#product)
  - [SemiProduct](#semiproduct)
  - [getMonoidAll](#getmonoidall)
  - [getMonoidAny](#getmonoidany)
  - [getSemigroupAll](#getsemigroupall)
  - [getSemigroupAny](#getsemigroupany)
- [models](#models)
  - [Predicate (interface)](#predicate-interface)
- [type lambdas](#type-lambdas)
  - [PredicateTypeLambda (interface)](#predicatetypelambda-interface)
- [utils](#utils)
  - [Do](#do)
  - [Refinement (interface)](#refinement-interface)
  - [all](#all)
  - [and](#and)
  - [andThenBind](#andthenbind)
  - [any](#any)
  - [compose](#compose)
  - [contramap](#contramap)
  - [imap](#imap)
  - [not](#not)
  - [of](#of)
  - [or](#or)
  - [product](#product)
  - [productAll](#productall)
  - [productMany](#productmany)
  - [struct](#struct)
  - [tuple](#tuple)
  - [tupled](#tupled)
  - [unit](#unit)

---

# constructors

## id

**Signature**

```ts
export declare const id: <A>() => Refinement<A, A>
```

Added in v1.0.0

# do notation

## bindTo

**Signature**

```ts
export declare const bindTo: <N extends string>(
  name: N
) => <A>(self: Predicate<A>) => Predicate<{ readonly [K in N]: A }>
```

Added in v1.0.0

# instances

## Contravariant

**Signature**

```ts
export declare const Contravariant: contravariant.Contravariant<PredicateTypeLambda>
```

Added in v1.0.0

## Invariant

**Signature**

```ts
export declare const Invariant: invariant.Invariant<PredicateTypeLambda>
```

Added in v1.0.0

## Of

**Signature**

```ts
export declare const Of: of_.Of<PredicateTypeLambda>
```

Added in v1.0.0

## Product

**Signature**

```ts
export declare const Product: product_.Product<PredicateTypeLambda>
```

Added in v1.0.0

## SemiProduct

**Signature**

```ts
export declare const SemiProduct: semiProduct.SemiProduct<PredicateTypeLambda>
```

Added in v1.0.0

## getMonoidAll

**Signature**

```ts
export declare const getMonoidAll: <A>() => monoid.Monoid<Predicate<A>>
```

Added in v1.0.0

## getMonoidAny

**Signature**

```ts
export declare const getMonoidAny: <A>() => monoid.Monoid<Predicate<A>>
```

Added in v1.0.0

## getSemigroupAll

**Signature**

```ts
export declare const getSemigroupAll: <A>() => semigroup.Semigroup<Predicate<A>>
```

Added in v1.0.0

## getSemigroupAny

**Signature**

```ts
export declare const getSemigroupAny: <A>() => semigroup.Semigroup<Predicate<A>>
```

Added in v1.0.0

# models

## Predicate (interface)

**Signature**

```ts
export interface Predicate<A> {
  (a: A): boolean
}
```

Added in v1.0.0

# type lambdas

## PredicateTypeLambda (interface)

**Signature**

```ts
export interface PredicateTypeLambda extends TypeLambda {
  readonly type: Predicate<this['Target']>
}
```

Added in v1.0.0

# utils

## Do

**Signature**

```ts
export declare const Do: Predicate<{}>
```

Added in v1.0.0

## Refinement (interface)

**Signature**

```ts
export interface Refinement<A, B extends A> {
  (a: A): a is B
}
```

Added in v1.0.0

## all

**Signature**

```ts
export declare const all: <A>(collection: Iterable<Predicate<A>>) => Predicate<A>
```

Added in v1.0.0

## and

**Signature**

```ts
export declare const and: <A>(that: Predicate<A>) => (self: Predicate<A>) => Predicate<A>
```

Added in v1.0.0

## andThenBind

**Signature**

```ts
export declare const andThenBind: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  self: Predicate<B>
) => (self: Predicate<A>) => Predicate<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }>
```

Added in v1.0.0

## any

**Signature**

```ts
export declare const any: <A>(collection: Iterable<Predicate<A>>) => Predicate<A>
```

Added in v1.0.0

## compose

**Signature**

```ts
export declare const compose: <A, B extends A, C extends B>(
  bc: Refinement<B, C>
) => (ab: Refinement<A, B>) => Refinement<A, C>
```

Added in v1.0.0

## contramap

**Signature**

```ts
export declare const contramap: <B, A>(f: (b: B) => A) => (self: Predicate<A>) => Predicate<B>
```

Added in v1.0.0

## imap

**Signature**

```ts
export declare const imap: <A, B>(to: (a: A) => B, from: (b: B) => A) => (self: Predicate<A>) => Predicate<B>
```

Added in v1.0.0

## not

**Signature**

```ts
export declare const not: <A>(self: Predicate<A>) => Predicate<A>
```

Added in v1.0.0

## of

**Signature**

```ts
export declare const of: <A>(_: A) => Predicate<A>
```

Added in v1.0.0

## or

**Signature**

```ts
export declare const or: <A>(that: Predicate<A>) => (self: Predicate<A>) => Predicate<A>
```

Added in v1.0.0

## product

**Signature**

```ts
export declare const product: <B>(that: Predicate<B>) => <A>(self: Predicate<A>) => Predicate<readonly [A, B]>
```

Added in v1.0.0

## productAll

**Signature**

```ts
export declare const productAll: <A>(collection: Iterable<Predicate<A>>) => Predicate<readonly A[]>
```

Added in v1.0.0

## productMany

**Signature**

```ts
export declare const productMany: <A>(
  collection: Iterable<Predicate<A>>
) => (self: Predicate<A>) => Predicate<readonly [A, ...A[]]>
```

Added in v1.0.0

## struct

**Signature**

```ts
export declare const struct: <R extends Record<string, Predicate<any>>>(
  predicates: R
) => Predicate<{ readonly [K in keyof R]: [R[K]] extends [Predicate<infer A>] ? A : never }>
```

Added in v1.0.0

## tuple

**Signature**

```ts
export declare const tuple: <T extends readonly Predicate<any>[]>(
  ...predicates: T
) => Predicate<Readonly<{ [I in keyof T]: [T[I]] extends [Predicate<infer A>] ? A : never }>>
```

Added in v1.0.0

## tupled

**Signature**

```ts
export declare const tupled: <A>(self: Predicate<A>) => Predicate<readonly [A]>
```

Added in v1.0.0

## unit

**Signature**

```ts
export declare const unit: Predicate<void>
```

Added in v1.0.0
