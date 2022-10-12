---
title: Context.ts
nav_order: 2
parent: Modules
---

## Context overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [Tag](#tag)
  - [empty](#empty)
- [getters](#getters)
  - [get](#get)
  - [getOption](#getoption)
- [guards](#guards)
  - [isContext](#iscontext)
- [model](#model)
  - [Context (interface)](#context-interface)
  - [Tag (interface)](#tag-interface)
  - [Tags (type alias)](#tags-type-alias)
- [mutations](#mutations)
  - [add](#add)
  - [merge](#merge)
  - [prune](#prune)
- [symbol](#symbol)
  - [TagTypeId (type alias)](#tagtypeid-type-alias)
  - [TypeId (type alias)](#typeid-type-alias)
- [unsafe](#unsafe)
  - [unsafeGet](#unsafeget)

---

# constructors

## Tag

**Signature**

```ts
export declare const Tag: <Service>() => Tag<Service>
```

Added in v1.0.0

## empty

**Signature**

```ts
export declare const empty: () => Context<never>
```

Added in v1.0.0

# getters

## get

**Signature**

```ts
export declare const get: <Services, T extends Tags<Services>>(
  tag: T
) => (self: Context<Services>) => T extends Tag<infer S> ? S : never
```

Added in v1.0.0

## getOption

**Signature**

```ts
export declare const getOption: <S>(tag: Tag<S>) => <Services>(self: Context<Services>) => Option<S>
```

Added in v1.0.0

# guards

## isContext

**Signature**

```ts
export declare const isContext: (u: unknown) => u is Context<never>
```

Added in v1.0.0

# model

## Context (interface)

**Signature**

```ts
export interface Context<Services> extends DeepEqual {
  readonly _id: TypeId
  readonly _S: (_: Services) => unknown
  /** @internal */
  readonly unsafeMap: Map<Tag<any>, any>
}
```

Added in v1.0.0

## Tag (interface)

**Signature**

```ts
export interface Tag<Service> extends DeepEqual {
  readonly _id: TagTypeId
  readonly _S: (_: Service) => Service
}
```

Added in v1.0.0

## Tags (type alias)

**Signature**

```ts
export type Tags<R> = R extends infer S ? Tag<S> : never
```

Added in v1.0.0

# mutations

## add

**Signature**

```ts
export declare const add: <S>(
  tag: Tag<S>
) => (service: S) => <Services>(self: Context<Services>) => Context<S | Services>
```

Added in v1.0.0

## merge

**Signature**

```ts
export declare const merge: <R1>(that: Context<R1>) => <Services>(self: Context<Services>) => Context<R1 | Services>
```

Added in v1.0.0

## prune

**Signature**

```ts
export declare const prune: <Services, S extends Tags<Services>[]>(
  ...tags: S
) => (self: Context<Services>) => Context<{ [k in keyof S]: Tag.Service<S[k]> }[number]>
```

Added in v1.0.0

# symbol

## TagTypeId (type alias)

**Signature**

```ts
export type TagTypeId = typeof TagTypeId
```

Added in v1.0.0

## TypeId (type alias)

**Signature**

```ts
export type TypeId = typeof TypeId
```

Added in v1.0.0

# unsafe

## unsafeGet

**Signature**

```ts
export declare const unsafeGet: <S>(tag: Tag<S>) => <Services>(self: Context<Services>) => S
```

Added in v1.0.0
