---
title: Unify.ts
nav_order: 72
parent: Modules
---

## Unify overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Unify (type alias)](#unify-type-alias)
  - [typeSymbol (type alias)](#typesymbol-type-alias)
  - [unifySymbol (type alias)](#unifysymbol-type-alias)

---

# utils

## Unify (type alias)

**Signature**

```ts
export type Unify<A> = ReturnType<
  [A] extends [
    {
      [typeSymbol]?: any
      [unifySymbol]?: () => any
    }
  ]
    ? NonNullable<
        (A & {
          [typeSymbol]: A
        })[unifySymbol]
      >
    : () => A
>
```

Added in v1.0.0

## typeSymbol (type alias)

**Signature**

```ts
export type typeSymbol = typeof typeSymbol
```

Added in v1.0.0

## unifySymbol (type alias)

**Signature**

```ts
export type unifySymbol = typeof unifySymbol
```

Added in v1.0.0
