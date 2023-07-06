---
title: Unify.ts
nav_order: 47
parent: Modules
---

## Unify overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Blacklist (type alias)](#blacklist-type-alias)
  - [ExtractTypes (type alias)](#extracttypes-type-alias)
  - [MaybeReturn (type alias)](#maybereturn-type-alias)
  - [Unify (type alias)](#unify-type-alias)
  - [Values (type alias)](#values-type-alias)
  - [blacklistSymbol (type alias)](#blacklistsymbol-type-alias)
  - [typeSymbol (type alias)](#typesymbol-type-alias)
  - [unify](#unify)
  - [unifySymbol (type alias)](#unifysymbol-type-alias)

---

# utils

## Blacklist (type alias)

**Signature**

```ts
export type Blacklist<X> = X extends {
  [blacklistSymbol]?: any
}
  ? keyof NonNullable<X[blacklistSymbol]>
  : never
```

Added in v1.0.0

## ExtractTypes (type alias)

**Signature**

```ts
export type ExtractTypes<
  X extends {
    [typeSymbol]?: any
    [unifySymbol]?: any
  }
> = X extends any ? [NonNullable<X[unifySymbol]>, Blacklist<X>] : never
```

Added in v1.0.0

## MaybeReturn (type alias)

**Signature**

```ts
export type MaybeReturn<F> = F extends () => any ? ReturnType<F> : F
```

Added in v1.0.0

## Unify (type alias)

**Signature**

```ts
export type Unify<A> = Values<
  ExtractTypes<Extract<A, { [typeSymbol]?: any; [unifySymbol]?: any }> & { [typeSymbol]: A }>
> extends infer Z
  ? Z | Exclude<A, Z>
  : never
```

Added in v1.0.0

## Values (type alias)

**Signature**

```ts
export type Values<X extends [any, any]> = X extends any
  ? { [k in keyof X[0]]-?: k extends X[1] ? never : MaybeReturn<X[0][k]> }[keyof X[0]]
  : never
```

Added in v1.0.0

## blacklistSymbol (type alias)

**Signature**

```ts
export type blacklistSymbol = typeof blacklistSymbol
```

Added in v1.0.0

## typeSymbol (type alias)

**Signature**

```ts
export type typeSymbol = typeof typeSymbol
```

Added in v1.0.0

## unify

**Signature**

```ts
export declare const unify: {
  <Args extends any[], Args2 extends any[], Args3 extends any[], Args4 extends any[], Args5 extends any[], T>(
    x: (...args: Args) => (...args: Args2) => (...args: Args3) => (...args: Args4) => (...args: Args5) => T
  ): (...args: Args) => (...args: Args2) => (...args: Args3) => (...args: Args4) => (...args: Args5) => Unify<T>
  <Args extends any[], Args2 extends any[], Args3 extends any[], Args4 extends any[], T>(
    x: (...args: Args) => (...args: Args2) => (...args: Args3) => (...args: Args4) => T
  ): (...args: Args) => (...args: Args2) => (...args: Args3) => (...args: Args4) => Unify<T>
  <Args extends any[], Args2 extends any[], Args3 extends any[], T>(
    x: (...args: Args) => (...args: Args2) => (...args: Args3) => T
  ): (...args: Args) => (...args: Args2) => (...args: Args3) => Unify<T>
  <Args extends any[], Args2 extends any[], T>(x: (...args: Args) => (...args: Args2) => T): (
    ...args: Args
  ) => (...args: Args2) => Unify<T>
  <Args extends any[], T>(x: (...args: Args) => T): (...args: Args) => Unify<T>
  <T>(x: T): Unify<T>
}
```

Added in v1.0.0

## unifySymbol (type alias)

**Signature**

```ts
export type unifySymbol = typeof unifySymbol
```

Added in v1.0.0
