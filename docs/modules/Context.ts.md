---
title: Context.ts
nav_order: 3
parent: Modules
---

## Context overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [Tag](#tag)
  - [empty](#empty)
  - [make](#make)
- [getters](#getters)
  - [get](#get)
  - [getOption](#getoption)
- [guards](#guards)
  - [isContext](#iscontext)
  - [isTag](#istag)
- [models](#models)
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

Specifying the key will make the Tag global, meaning two tags with the same
key will map to the same instance.

Note: this is useful for cases where live reload can happen and it is
desireable to preserve the instance across reloads.

**Signature**

```ts
export declare const Tag: <Service>(key?: string | undefined) => Tag<Service>
```

Added in v1.0.0

## empty

**Signature**

```ts
export declare const empty: () => Context<never>
```

Added in v1.0.0

## make

**Signature**

```ts
export declare const make: <T extends Tag<any>>(tag: T, service: Tag.Service<T>) => Context<Tag.Service<T>>
```

Added in v1.0.0

# getters

## get

**Signature**

```ts
export declare const get: {
  <Services, T extends Tags<Services>>(tag: T): (self: Context<Services>) => T extends Tag<infer S> ? S : never
  <Services, T extends Tags<Services>>(self: Context<Services>, tag: T): T extends Tag<infer S> ? S : never
}
```

Added in v1.0.0

## getOption

**Signature**

```ts
export declare const getOption: {
  <S>(tag: Tag<S>): <Services>(self: Context<Services>) => Option<S>
  <Services, S>(self: Context<Services>, tag: Tag<S>): Option<S>
}
```

Added in v1.0.0

# guards

## isContext

**Signature**

```ts
export declare const isContext: (u: unknown) => u is Context<never>
```

Added in v1.0.0

## isTag

**Signature**

```ts
export declare const isTag: (u: unknown) => u is Tag<never>
```

Added in v1.0.0

# models

## Context (interface)

**Signature**

```ts
export interface Context<Services> extends Equal {
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
export interface Tag<Service> {
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
export declare const add: {
  <T extends Tag<any>>(tag: T, service: Tag.Service<T>): <Services>(
    self: Context<Services>
  ) => Context<Tag.Service<T> | Services>
  <Services, T extends Tag<any>>(self: Context<Services>, tag: Tag<T>, service: Tag.Service<T>): Context<
    Services | Tag.Service<T>
  >
}
```

Added in v1.0.0

## merge

**Signature**

```ts
export declare const merge: {
  <R1>(that: Context<R1>): <Services>(self: Context<Services>) => Context<R1 | Services>
  <Services, R1>(self: Context<Services>, that: Context<R1>): Context<Services | R1>
}
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
export declare const unsafeGet: {
  <S>(tag: Tag<S>): <Services>(self: Context<Services>) => S
  <Services, S>(self: Context<Services>, tag: Tag<S>): S
}
```

Added in v1.0.0
