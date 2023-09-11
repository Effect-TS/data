---
title: Traceable.ts
nav_order: 42
parent: Modules
---

## Traceable overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [models](#models)
  - [Traceable (interface)](#traceable-interface)
  - [stack](#stack)
- [refinements](#refinements)
  - [isTraceable](#istraceable)
- [symbols](#symbols)
  - [symbol](#symbol)
- [utils](#utils)
  - [capture](#capture)

---

# models

## Traceable (interface)

**Signature**

```ts
export interface Traceable {
  readonly [symbol]: () => ReadonlyArray.NonEmptyReadonlyArray<string> | undefined
}
```

Added in v1.0.0

## stack

**Signature**

```ts
export declare const stack: (u: unknown) => ReadonlyArray.NonEmptyReadonlyArray<string> | undefined
```

Added in v1.0.0

# refinements

## isTraceable

**Signature**

```ts
export declare const isTraceable: (u: unknown) => u is Traceable
```

Added in v1.0.0

# symbols

## symbol

**Signature**

```ts
export declare const symbol: typeof symbol
```

Added in v1.0.0

# utils

## capture

**Signature**

```ts
export declare const capture: (
  skipFrames?: number,
  maxSize?: number
) => () => ReadonlyArray.NonEmptyReadonlyArray<string> | undefined
```

Added in v1.0.0
