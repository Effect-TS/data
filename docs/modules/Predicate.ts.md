---
title: Predicate.ts
nav_order: 22
parent: Modules
---

## Predicate overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [instances](#instances)
  - [Contravariant](#contravariant)
  - [getMonoidAll](#getmonoidall)
  - [getMonoidAny](#getmonoidany)
  - [getSemigroupAll](#getsemigroupall)
  - [getSemigroupAny](#getsemigroupany)
- [models](#models)
  - [Predicate (interface)](#predicate-interface)
- [type lambdas](#type-lambdas)
  - [PredicateTypeLambda (interface)](#predicatetypelambda-interface)
- [utils](#utils)
  - [all](#all)
  - [and](#and)
  - [any](#any)
  - [contramap](#contramap)
  - [not](#not)
  - [or](#or)

---

# instances

## Contravariant

**Signature**

```ts
export declare const Contravariant: contravariant.Contravariant<PredicateTypeLambda>
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
  readonly type: Predicate<this['In1']>
}
```

Added in v1.0.0

# utils

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

## any

**Signature**

```ts
export declare const any: <A>(collection: Iterable<Predicate<A>>) => Predicate<A>
```

Added in v1.0.0

## contramap

**Signature**

```ts
export declare const contramap: <B, A>(f: (b: B) => A) => (self: Predicate<A>) => Predicate<B>
```

Added in v1.0.0

## not

**Signature**

```ts
export declare const not: <A>(predicate: Predicate<A>) => Predicate<A>
```

Added in v1.0.0

## or

**Signature**

```ts
export declare const or: <A>(that: Predicate<A>) => (self: Predicate<A>) => Predicate<A>
```

Added in v1.0.0
