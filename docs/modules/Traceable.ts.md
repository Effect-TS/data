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
  - [Traceable (namespace)](#traceable-namespace)
    - [WithType (interface)](#withtype-interface)
    - [Infer (type alias)](#infer-type-alias)
  - [stack](#stack)
- [refinements](#refinements)
  - [isTraceable](#istraceable)
  - [isTraceableWithType](#istraceablewithtype)
- [symbols](#symbols)
  - [WithTypeTypeId](#withtypetypeid)
  - [WithTypeTypeId (type alias)](#withtypetypeid-type-alias)
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

## Traceable (namespace)

Added in v1.0.0

### WithType (interface)

**Signature**

```ts
export interface WithType<A> extends Traceable {
  readonly [WithTypeTypeId]: (_: A) => A
}
```

Added in v1.0.0

### Infer (type alias)

**Signature**

```ts
export type Infer<A extends WithType<any>> = Parameters<A[WithTypeTypeId]>[0]
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

## isTraceableWithType

**Signature**

```ts
export declare const isTraceableWithType: (u: unknown) => u is Traceable.WithType<unknown>
```

Added in v1.0.0

# symbols

## WithTypeTypeId

**Signature**

```ts
export declare const WithTypeTypeId: typeof WithTypeTypeId
```

Added in v1.0.0

## WithTypeTypeId (type alias)

**Signature**

```ts
export type WithTypeTypeId = typeof WithTypeTypeId
```

Added in v1.0.0

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
