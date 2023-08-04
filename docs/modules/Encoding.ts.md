---
title: Encoding.ts
nav_order: 10
parent: Modules
---

## Encoding overview

This module provides encoding & decoding functionality for:

- base64 (RFC4648)
- base64 (URL)
- hex

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [decoding](#decoding)
  - [decodeBase64](#decodebase64)
  - [decodeBase64Url](#decodebase64url)
  - [decodeHex](#decodehex)
- [encoding](#encoding)
  - [encodeBase64](#encodebase64)
  - [encodeBase64Url](#encodebase64url)
  - [encodeHex](#encodehex)
- [errors](#errors)
  - [DecodeException](#decodeexception)
- [models](#models)
  - [DecodeException (interface)](#decodeexception-interface)
- [refinements](#refinements)
  - [isDecodeException](#isdecodeexception)
- [symbols](#symbols)
  - [DecodeExceptionTypeId](#decodeexceptiontypeid)
  - [DecodeExceptionTypeId (type alias)](#decodeexceptiontypeid-type-alias)

---

# decoding

## decodeBase64

Decodes a base64 (RFC4648) encoded string.

**Signature**

```ts
export declare const decodeBase64: (str: string) => Either.Either<DecodeException, Uint8Array>
```

Added in v1.0.0

## decodeBase64Url

Decodes a base64 (URL) encoded string.

**Signature**

```ts
export declare const decodeBase64Url: (str: string) => Either.Either<DecodeException, Uint8Array>
```

Added in v1.0.0

## decodeHex

Decodes a hex encoded string.

**Signature**

```ts
export declare const decodeHex: (str: string) => Either.Either<DecodeException, Uint8Array>
```

Added in v1.0.0

# encoding

## encodeBase64

Encodes a Uint8Array into a base64 (RFC4648) string.

**Signature**

```ts
export declare const encodeBase64: (bytes: Uint8Array) => string
```

Added in v1.0.0

## encodeBase64Url

Encodes a Uint8Array into a base64 (URL) string.

**Signature**

```ts
export declare const encodeBase64Url: (bytes: Uint8Array) => string
```

Added in v1.0.0

## encodeHex

Encodes a Uint8Array into a hex string.

**Signature**

```ts
export declare const encodeHex: (bytes: Uint8Array) => string
```

Added in v1.0.0

# errors

## DecodeException

Creates a checked exception which occurs when decoding fails.

**Signature**

```ts
export declare const DecodeException: (input: string, message?: string) => DecodeException
```

Added in v1.0.0

# models

## DecodeException (interface)

Represents a checked exception which occurs when decoding fails.

**Signature**

```ts
export interface DecodeException {
  readonly _tag: 'DecodeException'
  readonly [DecodeExceptionTypeId]: DecodeExceptionTypeId
  readonly input: string
  readonly message?: string
}
```

Added in v1.0.0

# refinements

## isDecodeException

Returns `true` if the specified value is an `DecodeException`, `false` otherwise.

**Signature**

```ts
export declare const isDecodeException: (u: unknown) => u is DecodeException
```

Added in v1.0.0

# symbols

## DecodeExceptionTypeId

**Signature**

```ts
export declare const DecodeExceptionTypeId: typeof DecodeExceptionTypeId
```

Added in v1.0.0

## DecodeExceptionTypeId (type alias)

**Signature**

```ts
export type DecodeExceptionTypeId = typeof DecodeExceptionTypeId
```

Added in v1.0.0
