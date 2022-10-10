---
title: List.ts
nav_order: 2
parent: Modules
---

## List overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [builder](#builder)
  - [cons](#cons)
  - [make](#make)
  - [nil](#nil)
- [filtering](#filtering)
  - [drop](#drop)
  - [filter](#filter)
  - [take](#take)
- [model](#model)
  - [Cons (interface)](#cons-interface)
  - [List (type alias)](#list-type-alias)
  - [ListBuilder (interface)](#listbuilder-interface)
  - [Nil (interface)](#nil-interface)
- [refinements](#refinements)
  - [isCons](#iscons)
  - [isNil](#isnil)

---

# constructors

## builder

**Signature**

```ts
export declare const builder: <A>() => ListBuilder<A>
```

Added in v1.0.0

## cons

**Signature**

```ts
export declare const cons: <A>(head: A, tail: List<A>) => Cons<A>
```

Added in v1.0.0

## make

**Signature**

```ts
export declare const make: <As extends readonly any[]>(...prefix: As) => List<As[number]>
```

Added in v1.0.0

## nil

**Signature**

```ts
export declare const nil: <A = never>() => Nil<A>
```

Added in v1.0.0

# filtering

## drop

**Signature**

```ts
export declare const drop: (n: number) => <A>(self: List<A>) => List<A>
```

Added in v1.0.0

## filter

**Signature**

```ts
export declare const filter: {
  <A, B extends A>(p: Refinement<A, B>): (self: List<A>) => List<B>
  <A>(p: Predicate<A>): (self: List<A>) => List<A>
}
```

Added in v1.0.0

## take

**Signature**

```ts
export declare const take: (n: number) => <A>(self: List<A>) => List<A>
```

Added in v1.0.0

# model

## Cons (interface)

**Signature**

```ts
export interface Cons<A> extends L.Cons<A> {}
```

Added in v1.0.0

## List (type alias)

**Signature**

```ts
export type List<A> = Cons<A> | Nil<A>
```

Added in v1.0.0

## ListBuilder (interface)

**Signature**

```ts
export interface ListBuilder<A> extends Iterable<A> {
  readonly length: number

  readonly isEmpty: () => boolean

  readonly unsafeHead: () => A

  readonly unsafeTail: () => List<A>

  readonly append: (elem: A) => ListBuilder<A>

  readonly prepend: (elem: A) => ListBuilder<A>

  readonly unprepend: (this: this) => A

  readonly build: () => List<A>

  readonly insert: (idx: number, elem: A) => ListBuilder<A>

  readonly reduce: <B>(b: B, f: (b: B, a: A) => B) => B
}
```

Added in v1.0.0

## Nil (interface)

**Signature**

```ts
export interface Nil<A> extends L.Nil<A> {}
```

Added in v1.0.0

# refinements

## isCons

**Signature**

```ts
export declare const isCons: <A>(self: List<A>) => self is Cons<A>
```

Added in v1.0.0

## isNil

**Signature**

```ts
export declare const isNil: <A>(self: List<A>) => self is Nil<A>
```

Added in v1.0.0
