---
title: Queue.ts
nav_order: 26
parent: Modules
---

## Queue overview

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
- [models](#models)
  - [Queue (interface)](#queue-interface)
- [mutations](#mutations)
  - [dequeue](#dequeue)
  - [enqueue](#enqueue)
  - [enqueueAll](#enqueueall)
  - [prepend](#prepend)
- [predicates](#predicates)
  - [isEmpty](#isempty)
  - [isNonEmpty](#isnonempty)
- [refinements](#refinements)
  - [isQueue](#isqueue)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)
- [type lambdas](#type-lambdas)
  - [QueueTypeLambda (interface)](#queuetypelambda-interface)
- [unsafe](#unsafe)
  - [unsafeDequeue](#unsafedequeue)
  - [unsafeHead](#unsafehead)
  - [unsafeTail](#unsafetail)

---

# constructors

## ImmutableQueue

**Signature**

```ts
export declare const ImmutableQueue: <As extends readonly any[]>(...items: As) => Queue<As[number]>
```

Added in v1.0.0

## empty

**Signature**

```ts
export declare const empty: <A = never>() => Queue<A>
```

Added in v1.0.0

## make

**Signature**

```ts
export declare const make: <As extends readonly any[]>(...items: As) => Queue<As[number]>
```

Added in v1.0.0

## of

**Signature**

```ts
export declare const of: <A>(a: A) => Queue<A>
```

Added in v1.0.0

# conversions

## fromIterable

**Signature**

```ts
export declare const fromIterable: <A>(items: Iterable<A>) => Queue<A>
```

Added in v1.0.0

# elements

## findFirst

**Signature**

```ts
export declare const findFirst: {
  <A, B extends A>(refinement: Refinement<A, B>): (self: Queue<A>) => O.Option<B>
  <A>(predicate: Predicate<A>): (self: Queue<A>) => O.Option<A>
}
```

Added in v1.0.0

## some

**Signature**

```ts
export declare const some: <A>(predicate: Predicate<A>) => (self: Queue<A>) => boolean
```

Added in v1.0.0

# filtering

## filter

**Signature**

```ts
export declare const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): (self: Queue<A>) => Queue<B>
  <A>(predicate: Predicate<A>): (self: Queue<A>) => Queue<A>
}
```

Added in v1.0.0

# folding

## reduce

**Signature**

```ts
export declare const reduce: <A, B>(b: B, f: (b: B, a: A) => B) => (self: Queue<A>) => B
```

Added in v1.0.0

# getters

## head

**Signature**

```ts
export declare const head: <A>(self: Queue<A>) => O.Option<A>
```

Added in v1.0.0

## length

**Signature**

```ts
export declare const length: <A>(self: Queue<A>) => number
```

Added in v1.0.0

## tail

**Signature**

```ts
export declare const tail: <A>(self: Queue<A>) => O.Option<Queue<A>>
```

Added in v1.0.0

# instances

## FromIdentity

**Signature**

```ts
export declare const FromIdentity: FromIdentity<QueueTypeLambda>
```

Added in v1.0.0

## Functor

**Signature**

```ts
export declare const Functor: Functor<QueueTypeLambda>
```

Added in v1.0.0

# mapping

## map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (self: Queue<A>) => Queue<B>
```

Added in v1.0.0

# models

## Queue (interface)

**Signature**

```ts
export interface Queue<A> extends Iterable<A>, Equal.Equal {
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
export declare const dequeue: <A>(self: Queue<A>) => O.Option<readonly [A, Queue<A>]>
```

Added in v1.0.0

## enqueue

**Signature**

```ts
export declare const enqueue: <B>(elem: B) => <A>(self: Queue<A>) => Queue<B | A>
```

Added in v1.0.0

## enqueueAll

**Signature**

```ts
export declare const enqueueAll: <B>(iter: Iterable<B>) => <A>(self: Queue<A>) => Queue<B | A>
```

Added in v1.0.0

## prepend

**Signature**

```ts
export declare const prepend: <B>(elem: B) => <A>(self: Queue<A>) => Queue<B | A>
```

Added in v1.0.0

# predicates

## isEmpty

**Signature**

```ts
export declare const isEmpty: <A>(self: Queue<A>) => boolean
```

Added in v1.0.0

## isNonEmpty

**Signature**

```ts
export declare const isNonEmpty: <A>(self: Queue<A>) => boolean
```

Added in v1.0.0

# refinements

## isQueue

**Signature**

```ts
export declare const isQueue: { <A>(u: Iterable<A>): u is Queue<A>; (u: unknown): u is Queue<unknown> }
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

## QueueTypeLambda (interface)

**Signature**

```ts
export interface QueueTypeLambda extends HKT.TypeLambda {
  readonly type: Queue<this['Out1']>
}
```

Added in v1.0.0

# unsafe

## unsafeDequeue

**Signature**

```ts
export declare const unsafeDequeue: <A>(self: Queue<A>) => readonly [A, Queue<A>]
```

Added in v1.0.0

## unsafeHead

**Signature**

```ts
export declare const unsafeHead: <A>(self: Queue<A>) => A
```

Added in v1.0.0

## unsafeTail

**Signature**

```ts
export declare const unsafeTail: <A>(self: Queue<A>) => Queue<A>
```

Added in v1.0.0
