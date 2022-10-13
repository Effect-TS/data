---
title: ImmutableQueue.ts
nav_order: 6
parent: Modules
---

## ImmutableQueue overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [ImmutableQueue](#immutablequeue)
  - [empty](#empty)
  - [make](#make)
  - [of](#of)
- [conversions](#conversions)
  - [fromIterable](#fromiterable)
- [elements](#elements)
  - [findFirst](#findfirst)
  - [some](#some)
- [filtering](#filtering)
  - [filter](#filter)
- [folding](#folding)
  - [reduce](#reduce)
- [getters](#getters)
  - [head](#head)
  - [length](#length)
  - [tail](#tail)
- [instances](#instances)
  - [FromIdentity](#fromidentity)
  - [Functor](#functor)
- [mapping](#mapping)
  - [map](#map)
- [model](#model)
  - [ImmutableQueue (interface)](#immutablequeue-interface)
- [mutations](#mutations)
  - [dequeue](#dequeue)
  - [enqueue](#enqueue)
  - [enqueueAll](#enqueueall)
  - [prepend](#prepend)
- [predicates](#predicates)
  - [isEmpty](#isempty)
  - [isNonEmpty](#isnonempty)
- [refinements](#refinements)
  - [isImmutableQueue](#isimmutablequeue)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)
- [type lambdas](#type-lambdas)
  - [ImmutableQueueTypeLambda (interface)](#immutablequeuetypelambda-interface)
- [unsafe](#unsafe)
  - [unsafeDequeue](#unsafedequeue)
  - [unsafeHead](#unsafehead)
  - [unsafeTail](#unsafetail)

---

# constructors

## ImmutableQueue

**Signature**

```ts
export declare const ImmutableQueue: <As extends readonly any[]>(...items: As) => ImmutableQueue<As[number]>
```

Added in v1.0.0

## empty

**Signature**

```ts
export declare const empty: <A = never>() => ImmutableQueue<A>
```

Added in v1.0.0

## make

**Signature**

```ts
export declare const make: <As extends readonly any[]>(...items: As) => ImmutableQueue<As[number]>
```

Added in v1.0.0

## of

**Signature**

```ts
export declare const of: <A>(a: A) => ImmutableQueue<A>
```

Added in v1.0.0

# conversions

## fromIterable

**Signature**

```ts
export declare const fromIterable: <A>(items: Iterable<A>) => ImmutableQueue<A>
```

Added in v1.0.0

# elements

## findFirst

**Signature**

```ts
export declare const findFirst: {
  <A, B extends A>(refinement: Refinement<A, B>): (self: ImmutableQueue<A>) => O.Option<B>
  <A>(predicate: Predicate<A>): (self: ImmutableQueue<A>) => O.Option<A>
}
```

Added in v1.0.0

## some

**Signature**

```ts
export declare const some: <A>(predicate: Predicate<A>) => (self: ImmutableQueue<A>) => boolean
```

Added in v1.0.0

# filtering

## filter

**Signature**

```ts
export declare const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): (self: ImmutableQueue<A>) => ImmutableQueue<B>
  <A>(predicate: Predicate<A>): (self: ImmutableQueue<A>) => ImmutableQueue<A>
}
```

Added in v1.0.0

# folding

## reduce

**Signature**

```ts
export declare const reduce: <A, B>(b: B, f: (b: B, a: A) => B) => (self: ImmutableQueue<A>) => B
```

Added in v1.0.0

# getters

## head

**Signature**

```ts
export declare const head: <A>(self: ImmutableQueue<A>) => O.Option<A>
```

Added in v1.0.0

## length

**Signature**

```ts
export declare const length: <A>(self: ImmutableQueue<A>) => number
```

Added in v1.0.0

## tail

**Signature**

```ts
export declare const tail: <A>(self: ImmutableQueue<A>) => O.Option<ImmutableQueue<A>>
```

Added in v1.0.0

# instances

## FromIdentity

**Signature**

```ts
export declare const FromIdentity: FromIdentity<ImmutableQueueTypeLambda>
```

Added in v1.0.0

## Functor

**Signature**

```ts
export declare const Functor: Functor<ImmutableQueueTypeLambda>
```

Added in v1.0.0

# mapping

## map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (self: ImmutableQueue<A>) => ImmutableQueue<B>
```

Added in v1.0.0

# model

## ImmutableQueue (interface)

**Signature**

```ts
export interface ImmutableQueue<A> extends Iterable<A>, DE.DeepEqual {
  readonly _id: TypeId
  readonly _A: (_: never) => A
  /** @internal */
  readonly _in: L.List<A>
  /** @internal */
  readonly _out: L.List<A>
}
```

Added in v1.0.0

# mutations

## dequeue

**Signature**

```ts
export declare const dequeue: <A>(self: ImmutableQueue<A>) => O.Option<readonly [A, ImmutableQueue<A>]>
```

Added in v1.0.0

## enqueue

**Signature**

```ts
export declare const enqueue: <B>(elem: B) => <A>(self: ImmutableQueue<A>) => ImmutableQueue<B | A>
```

Added in v1.0.0

## enqueueAll

**Signature**

```ts
export declare const enqueueAll: <B>(iter: Iterable<B>) => <A>(self: ImmutableQueue<A>) => ImmutableQueue<B | A>
```

Added in v1.0.0

## prepend

**Signature**

```ts
export declare const prepend: <B>(elem: B) => <A>(self: ImmutableQueue<A>) => ImmutableQueue<B | A>
```

Added in v1.0.0

# predicates

## isEmpty

**Signature**

```ts
export declare const isEmpty: <A>(self: ImmutableQueue<A>) => boolean
```

Added in v1.0.0

## isNonEmpty

**Signature**

```ts
export declare const isNonEmpty: <A>(self: ImmutableQueue<A>) => boolean
```

Added in v1.0.0

# refinements

## isImmutableQueue

**Signature**

```ts
export declare const isImmutableQueue: {
  <A>(u: Iterable<A>): u is ImmutableQueue<A>
  (u: unknown): u is ImmutableQueue<unknown>
}
```

Added in v1.0.0

# symbol

## TypeId (type alias)

**Signature**

```ts
export type TypeId = typeof TypeId
```

Added in v1.0.0

# type lambdas

## ImmutableQueueTypeLambda (interface)

**Signature**

```ts
export interface ImmutableQueueTypeLambda extends HKT.TypeLambda {
  readonly type: ImmutableQueue<this['Out1']>
}
```

Added in v1.0.0

# unsafe

## unsafeDequeue

**Signature**

```ts
export declare const unsafeDequeue: <A>(self: ImmutableQueue<A>) => readonly [A, ImmutableQueue<A>]
```

Added in v1.0.0

## unsafeHead

**Signature**

```ts
export declare const unsafeHead: <A>(self: ImmutableQueue<A>) => A
```

Added in v1.0.0

## unsafeTail

**Signature**

```ts
export declare const unsafeTail: <A>(self: ImmutableQueue<A>) => ImmutableQueue<A>
```

Added in v1.0.0
