---
title: Context.ts
nav_order: 5
parent: Modules
---

## Context overview

This module provides a data structure called `Context` that can be used for dependency injection in effectful
programs. It is essentially a table mapping `Tag`s to their implementations (called `Service`s), and can be used to
manage dependencies in a type-safe way. The `Context` data structure is essentially a way of providing access to a set
of related services that can be passed around as a single unit. This module provides functions to create, modify, and
query the contents of a `Context`, as well as a number of utility types for working with tags and services.

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
  - [pick](#pick)
- [symbol](#symbol)
  - [TagTypeId (type alias)](#tagtypeid-type-alias)
  - [TypeId (type alias)](#typeid-type-alias)
- [unsafe](#unsafe)
  - [unsafeGet](#unsafeget)

---

# constructors

## Tag

Creates a new `Tag` instance with an optional key parameter.

Specifying the `key` will make the `Tag` global, meaning two tags with the same
key will map to the same instance.

Note: this is useful for cases where live reload can happen and it is
desireable to preserve the instance across reloads.

**Signature**

```ts
export declare const Tag: <Service>(key?: unknown) => Tag<Service>
```

**Example**

```ts
import * as Context from '@effect/data/Context'

assert.strictEqual(Context.Tag() === Context.Tag(), false)
assert.strictEqual(Context.Tag('PORT') === Context.Tag('PORT'), true)
```

Added in v1.0.0

## empty

Returns an empty `Context`.

**Signature**

```ts
export declare const empty: () => Context<never>
```

**Example**

```ts
import * as Context from '@effect/data/Context'

assert.strictEqual(Context.isContext(Context.empty()), true)
```

Added in v1.0.0

## make

Creates a new `Context` with a single service associated to the tag.

**Signature**

```ts
export declare const make: <T extends Tag<any>>(tag: T, service: Tag.Service<T>) => Context<Tag.Service<T>>
```

**Example**

```ts
import * as Context from '@effect/data/Context'

const Port = Context.Tag<{ PORT: number }>()

const Services = Context.make(Port, { PORT: 8080 })

assert.deepStrictEqual(Context.get(Services, Port), { PORT: 8080 })
```

Added in v1.0.0

# getters

## get

Get a service from the context that corresponds to the given tag.

**Signature**

```ts
export declare const get: {
  <Services, T extends Tags<Services>>(tag: T): (self: Context<Services>) => T extends Tag<infer S> ? S : never
  <Services, T extends Tags<Services>>(self: Context<Services>, tag: T): T extends Tag<infer S> ? S : never
}
```

**Example**

```ts
import * as Context from '@effect/data/Context'
import { pipe } from '@effect/data/Function'

const Port = Context.Tag<{ PORT: number }>()
const Timeout = Context.Tag<{ TIMEOUT: number }>()

const Services = pipe(Context.make(Port, { PORT: 8080 }), Context.add(Timeout, { TIMEOUT: 5000 }))

assert.deepStrictEqual(Context.get(Services, Timeout), { TIMEOUT: 5000 })
```

Added in v1.0.0

## getOption

Get the value associated with the specified tag from the context wrapped in an `Option` object. If the tag is not
found, the `Option` object will be `None`.

**Signature**

```ts
export declare const getOption: {
  <S>(tag: Tag<S>): <Services>(self: Context<Services>) => Option<S>
  <Services, S>(self: Context<Services>, tag: Tag<S>): Option<S>
}
```

**Example**

```ts
import * as Context from '@effect/data/Context'
import * as O from '@effect/data/Option'

const Port = Context.Tag<{ PORT: number }>()
const Timeout = Context.Tag<{ TIMEOUT: number }>()

const Services = Context.make(Port, { PORT: 8080 })

assert.deepStrictEqual(Context.getOption(Services, Port), O.some({ PORT: 8080 }))
assert.deepStrictEqual(Context.getOption(Services, Timeout), O.none())
```

Added in v1.0.0

# guards

## isContext

Checks if the provided argument is a `Context`.

**Signature**

```ts
export declare const isContext: (input: unknown) => input is Context<never>
```

**Example**

```ts
import * as Context from '@effect/data/Context'

assert.strictEqual(Context.isContext(Context.empty()), true)
```

Added in v1.0.0

## isTag

Checks if the provided argument is a `Tag`.

**Signature**

```ts
export declare const isTag: (input: unknown) => input is Tag<never>
```

**Example**

```ts
import * as Context from '@effect/data/Context'

assert.strictEqual(Context.isTag(Context.Tag()), true)
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

Adds a service to a given `Context`.

**Signature**

```ts
export declare const add: {
  <T extends Tag<any>>(tag: T, service: Tag.Service<T>): <Services>(
    self: Context<Services>
  ) => Context<Tag.Service<T> | Services>
  <Services, T extends Tag<any>>(self: Context<Services>, tag: T, service: Tag.Service<T>): Context<
    Services | Tag.Service<T>
  >
}
```

**Example**

```ts
import * as Context from '@effect/data/Context'
import { pipe } from '@effect/data/Function'

const Port = Context.Tag<{ PORT: number }>()
const Timeout = Context.Tag<{ TIMEOUT: number }>()

const someContext = Context.make(Port, { PORT: 8080 })

const Services = pipe(someContext, Context.add(Timeout, { TIMEOUT: 5000 }))

assert.deepStrictEqual(Context.get(Services, Port), { PORT: 8080 })
assert.deepStrictEqual(Context.get(Services, Timeout), { TIMEOUT: 5000 })
```

Added in v1.0.0

## merge

Merges two `Context`s, returning a new `Context` containing the services of both.

**Signature**

```ts
export declare const merge: {
  <R1>(that: Context<R1>): <Services>(self: Context<Services>) => Context<R1 | Services>
  <Services, R1>(self: Context<Services>, that: Context<R1>): Context<Services | R1>
}
```

**Example**

```ts
import * as Context from '@effect/data/Context'

const Port = Context.Tag<{ PORT: number }>()
const Timeout = Context.Tag<{ TIMEOUT: number }>()

const firstContext = Context.make(Port, { PORT: 8080 })
const secondContext = Context.make(Timeout, { TIMEOUT: 5000 })

const Services = Context.merge(firstContext, secondContext)

assert.deepStrictEqual(Context.get(Services, Port), { PORT: 8080 })
assert.deepStrictEqual(Context.get(Services, Timeout), { TIMEOUT: 5000 })
```

Added in v1.0.0

## pick

Returns a new `Context` that contains only the specified services.

**Signature**

```ts
export declare const pick: <Services, S extends Tags<Services>[]>(
  ...tags: S
) => (self: Context<Services>) => Context<{ [k in keyof S]: Tag.Service<S[k]> }[number]>
```

**Example**

```ts
import * as Context from '@effect/data/Context'
import { pipe } from '@effect/data/Function'
import * as O from '@effect/data/Option'

const Port = Context.Tag<{ PORT: number }>()
const Timeout = Context.Tag<{ TIMEOUT: number }>()

const someContext = pipe(Context.make(Port, { PORT: 8080 }), Context.add(Timeout, { TIMEOUT: 5000 }))

const Services = pipe(someContext, Context.pick(Port))

assert.deepStrictEqual(Context.getOption(Services, Port), O.some({ PORT: 8080 }))
assert.deepStrictEqual(Context.getOption(Services, Timeout), O.none())
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

Get a service from the context that corresponds to the given tag.
This function is unsafe because if the tag is not present in the context, a runtime error will be thrown.

For a safer version see {@link getOption}.

**Signature**

```ts
export declare const unsafeGet: {
  <S>(tag: Tag<S>): <Services>(self: Context<Services>) => S
  <Services, S>(self: Context<Services>, tag: Tag<S>): S
}
```

**Example**

```ts
import * as Context from '@effect/data/Context'

const Port = Context.Tag<{ PORT: number }>()
const Timeout = Context.Tag<{ TIMEOUT: number }>()

const Services = Context.make(Port, { PORT: 8080 })

assert.deepStrictEqual(Context.unsafeGet(Services, Port), { PORT: 8080 })
assert.throws(() => Context.unsafeGet(Services, Timeout))
```

Added in v1.0.0
