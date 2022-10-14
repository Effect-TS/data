---
title: AtomicReference.ts
nav_order: 1
parent: Modules
---

## AtomicReference overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [Atomic](#atomic)
  - [make](#make)
- [general](#general)
  - [compareAndSet](#compareandset)
  - [get](#get)
  - [getAndSet](#getandset)
  - [set](#set)
  - [setAndGet](#setandget)
- [model](#model)
  - [AtomicReference (interface)](#atomicreference-interface)
- [numeric](#numeric)
  - [decrementAndGet](#decrementandget)
  - [getAndDecrement](#getanddecrement)
  - [getAndIncrement](#getandincrement)
  - [incrementAndGet](#incrementandget)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)

---

# constructors

## Atomic

**Signature**

```ts
export declare const Atomic: <T>(value: T) => AtomicReference<T>
```

Added in v1.0.0

## make

**Signature**

```ts
export declare const make: <T>(value: T) => AtomicReference<T>
```

Added in v1.0.0

# general

## compareAndSet

**Signature**

```ts
export declare const compareAndSet: <T>(oldValue: T, newValue: T) => (self: AtomicReference<T>) => boolean
```

Added in v1.0.0

## get

**Signature**

```ts
export declare const get: <T>(self: AtomicReference<T>) => T
```

Added in v1.0.0

## getAndSet

**Signature**

```ts
export declare const getAndSet: <T>(value: T) => (self: AtomicReference<T>) => T
```

Added in v1.0.0

## set

**Signature**

```ts
export declare const set: <T>(value: T) => (self: AtomicReference<T>) => AtomicReference<T>
```

Added in v1.0.0

## setAndGet

**Signature**

```ts
export declare const setAndGet: <T>(value: T) => (self: AtomicReference<T>) => T
```

Added in v1.0.0

# model

## AtomicReference (interface)

**Signature**

```ts
export interface AtomicReference<T> extends Equal.Equal {
  readonly _id: TypeId
  readonly _T: (_: never) => T

  /** @internal */
  current: T
}
```

Added in v1.0.0

# numeric

## decrementAndGet

**Signature**

```ts
export declare const decrementAndGet: (self: AtomicReference<number>) => number
```

Added in v1.0.0

## getAndDecrement

**Signature**

```ts
export declare const getAndDecrement: (self: AtomicReference<number>) => number
```

Added in v1.0.0

## getAndIncrement

**Signature**

```ts
export declare const getAndIncrement: (self: AtomicReference<number>) => number
```

Added in v1.0.0

## incrementAndGet

**Signature**

```ts
export declare const incrementAndGet: (self: AtomicReference<number>) => number
```

Added in v1.0.0

# symbol

## TypeId (type alias)

**Signature**

```ts
export type TypeId = typeof TypeId
```

Added in v1.0.0
