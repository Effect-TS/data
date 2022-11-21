---
title: Json.ts
nav_order: 18
parent: Modules
---

## Json overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [Json (type alias)](#json-type-alias)
  - [JsonArray (type alias)](#jsonarray-type-alias)
  - [JsonObject (type alias)](#jsonobject-type-alias)
  - [parse](#parse)
  - [stringify](#stringify)

---

# utils

## Json (type alias)

**Signature**

```ts
export type Json = null | boolean | number | string | JsonArray | JsonObject
```

Added in v1.0.0

## JsonArray (type alias)

**Signature**

```ts
export type JsonArray = ReadonlyArray<Json>
```

Added in v1.0.0

## JsonObject (type alias)

**Signature**

```ts
export type JsonObject = { readonly [key: string]: Json }
```

Added in v1.0.0

## parse

Converts a JavaScript Object Notation (JSON) string into an object.

**Signature**

```ts
export declare const parse: (s: string) => Either<unknown, Json>
```

**Example**

```ts
import * as J from '@fp-ts/data/Json'
import * as E from '@fp-ts/data/Either'
import { pipe } from '@fp-ts/data/Function'

assert.deepStrictEqual(pipe('{"a":1}', J.parse), E.right({ a: 1 }))
assert.deepStrictEqual(pipe('{"a":}', J.parse), E.left(new SyntaxError('Unexpected token } in JSON at position 5')))
```

Added in v1.0.0

## stringify

Converts a JavaScript value to a JavaScript Object Notation (JSON) string.

**Signature**

```ts
export declare const stringify: <A>(value: A) => Either<unknown, string>
```

Added in v1.0.0
