---
title: typeclass/Gen.ts
nav_order: 40
parent: Modules
---

## Gen overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [adapters](#adapters)
  - [adapter](#adapter)
- [constructors](#constructors)
  - [GenKindImpl (class)](#genkindimpl-class)
    - [[Symbol.iterator] (method)](#symboliterator-method)
    - [[GenKindTypeId] (property)](#genkindtypeid-property)
  - [SingleShotGen (class)](#singleshotgen-class)
    - [next (method)](#next-method)
    - [return (method)](#return-method)
    - [throw (method)](#throw-method)
    - [[Symbol.iterator] (method)](#symboliterator-method-1)
  - [makeGenKind](#makegenkind)
  - [singleShot](#singleshot)
- [models](#models)
  - [Adapter (interface)](#adapter-interface)
  - [Gen (interface)](#gen-interface)
  - [GenKind (interface)](#genkind-interface)
  - [Variance (interface)](#variance-interface)
- [symbols](#symbols)
  - [GenKindTypeId](#genkindtypeid)
  - [GenKindTypeId (type alias)](#genkindtypeid-type-alias)

---

# adapters

## adapter

**Signature**

```ts
export declare const adapter: <F extends TypeLambda>() => Adapter<F>
```

Added in v1.0.0

# constructors

## GenKindImpl (class)

**Signature**

```ts
export declare class GenKindImpl<F, R, O, E, A> {
  constructor(
    /**
     * @since 1.0.0
     */
    readonly value: Kind<F, R, O, E, A>
  )
}
```

Added in v1.0.0

### [Symbol.iterator] (method)

**Signature**

```ts
[Symbol.iterator](): Generator<GenKind<F, R, O, E, A>, A>
```

Added in v1.0.0

### [GenKindTypeId] (property)

**Signature**

```ts
readonly [GenKindTypeId]: typeof GenKindTypeId
```

Added in v1.0.0

## SingleShotGen (class)

**Signature**

```ts
export declare class SingleShotGen<T, A> {
  constructor(readonly self: T)
}
```

Added in v1.0.0

### next (method)

**Signature**

```ts
next(a: A): IteratorResult<T, A>
```

Added in v1.0.0

### return (method)

**Signature**

```ts
return(a: A): IteratorResult<T, A>
```

Added in v1.0.0

### throw (method)

**Signature**

```ts
throw(e: unknown): IteratorResult<T, A>
```

Added in v1.0.0

### [Symbol.iterator] (method)

**Signature**

```ts
[Symbol.iterator](): Generator<T, A>
```

Added in v1.0.0

## makeGenKind

**Signature**

```ts
export declare const makeGenKind: <F extends TypeLambda, R, O, E, A>(
  kind: Kind<F, R, O, E, A>
) => GenKind<F, R, O, E, A>
```

Added in v1.0.0

## singleShot

**Signature**

```ts
export declare const singleShot: <F extends TypeLambda>(F: Monad<F>) => <Z extends Adapter<F>>(adapter: Z) => Gen<F, Z>
```

Added in v1.0.0

# models

## Adapter (interface)

**Signature**

```ts
export interface Adapter<F extends TypeLambda> {
  <R, O, E, A>(self: Kind<F, R, O, E, A>): GenKind<F, R, O, E, A>
}
```

Added in v1.0.0

## Gen (interface)

**Signature**

```ts
export interface Gen<F extends TypeLambda, Z> {
  <K extends Variance<F, any, any, any>, A>(body: (resume: Z) => Generator<K, A>): Kind<
    F,
    [K] extends [Variance<F, infer R, any, any>] ? R : never,
    [K] extends [Variance<F, any, infer O, any>] ? O : never,
    [K] extends [Variance<F, any, any, infer E>] ? E : never,
    A
  >
}
```

Added in v1.0.0

## GenKind (interface)

**Signature**

```ts
export interface GenKind<F extends TypeLambda, R, O, E, A> extends Variance<F, R, O, E> {
  readonly value: Kind<F, R, O, E, A>

  [Symbol.iterator](): Generator<GenKind<F, R, O, E, A>, A>
}
```

Added in v1.0.0

## Variance (interface)

**Signature**

```ts
export interface Variance<F extends TypeLambda, R, O, E> {
  readonly [GenKindTypeId]: GenKindTypeId
  readonly _F: (_: F) => F
  readonly _R: (_: R) => unknown
  readonly _O: (_: never) => O
  readonly _E: (_: never) => E
}
```

Added in v1.0.0

# symbols

## GenKindTypeId

**Signature**

```ts
export declare const GenKindTypeId: typeof GenKindTypeId
```

Added in v1.0.0

## GenKindTypeId (type alias)

**Signature**

```ts
export type GenKindTypeId = typeof GenKindTypeId
```

Added in v1.0.0
