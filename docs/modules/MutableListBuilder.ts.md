---
title: MutableListBuilder.ts
nav_order: 14
parent: Modules
---

## MutableListBuilder overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [MutableListBuilder](#mutablelistbuilder)
  - [empty](#empty)
- [conversions](#conversions)
  - [toList](#tolist)
- [folding](#folding)
  - [reduce](#reduce)
- [model](#model)
  - [MutableCons (interface)](#mutablecons-interface)
  - [MutableListBuilder (interface)](#mutablelistbuilder-interface)
- [mutations](#mutations)
  - [append](#append)
  - [insert](#insert)
  - [prepend](#prepend)
  - [unprepend](#unprepend)
- [size](#size)
  - [isEmpty](#isempty)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)
- [unsafe](#unsafe)
  - [unsafeHead](#unsafehead)
  - [unsafeTail](#unsafetail)

---

# constructors

## MutableListBuilder

**Signature**

```ts
export declare const MutableListBuilder: <As extends readonly unknown[]>(...as: As) => MutableListBuilder<As[number]>
```

Added in v1.0.0

## empty

**Signature**

```ts
export declare const empty: <A>() => MutableListBuilder<A>
```

Added in v1.0.0

# conversions

## toList

**Signature**

```ts
export declare const toList: <A>(self: MutableListBuilder<A>) => List<A>
```

Added in v1.0.0

# folding

## reduce

**Signature**

```ts
export declare const reduce: <A, B>(b: B, f: (b: B, a: A) => B) => (self: MutableListBuilder<A>) => B
```

Added in v1.0.0

# model

## MutableCons (interface)

**Signature**

```ts
export interface MutableCons<A> extends Cons<A> {
  tail: List<A>
}
```

Added in v1.0.0

## MutableListBuilder (interface)

**Signature**

```ts
export interface MutableListBuilder<A> extends Iterable<A>, Equal.Equal {
  readonly _id: TypeId
  length: number
  first: List<A>
  last0: MutableCons<A> | undefined
  len: number
}
```

Added in v1.0.0

# mutations

## append

**Signature**

```ts
export declare const append: <A>(elem: A) => (self: MutableListBuilder<A>) => MutableListBuilder<A>
```

Added in v1.0.0

## insert

**Signature**

```ts
export declare const insert: <A>(idx: number, elem: A) => (self: MutableListBuilder<A>) => MutableListBuilder<A>
```

Added in v1.0.0

## prepend

**Signature**

```ts
export declare const prepend: <A>(elem: A) => (self: MutableListBuilder<A>) => MutableListBuilder<A>
```

Added in v1.0.0

## unprepend

**Signature**

```ts
export declare const unprepend: <A>(self: MutableListBuilder<A>) => A
```

Added in v1.0.0

# size

## isEmpty

**Signature**

```ts
export declare const isEmpty: <A>(self: MutableListBuilder<A>) => boolean
```

Added in v1.0.0

# symbol

## TypeId (type alias)

**Signature**

```ts
export type TypeId = typeof TypeId
```

Added in v1.0.0

# unsafe

## unsafeHead

**Signature**

```ts
export declare const unsafeHead: <A>(self: MutableListBuilder<A>) => A
```

Added in v1.0.0

## unsafeTail

**Signature**

```ts
export declare const unsafeTail: <A>(self: MutableListBuilder<A>) => List<A>
```

Added in v1.0.0
