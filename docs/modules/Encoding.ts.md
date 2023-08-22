---
title: Encoding.ts
nav_order: 16
parent: Modules
---

## Encoding overview

This module provides encoding & decoding functionality for:

- base64 (RFC4648)

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [encoding](#encoding)
  - [decodeBase64](#decodebase64)
  - [encodeBase64](#encodebase64)
  - [unsafeDecodeBase64](#unsafedecodebase64)
- [utils](#utils)
  - [Base64DecodeError (class)](#base64decodeerror-class)
    - [\_tag (property)](#_tag-property)

---

# encoding

## decodeBase64

Decodes a base64 (RFC4648) encoded string.

**Signature**

```ts
export declare const decodeBase64: (str: string) => Either.Either<Base64DecodeError, Uint8Array>
```

Added in v1.0.0

## encodeBase64

Encodes a Uint8Array into a base64 (RFC4648) string.

**Signature**

```ts
export declare const encodeBase64: (bytes: Uint8Array) => string
```

Added in v1.0.0

## unsafeDecodeBase64

Unsafely decodes a base64 (RFC4648) encoded string unsafely. Throws an error if the
given value isn't a valid base64 (RFC4648) string.

**Signature**

```ts
export declare const unsafeDecodeBase64: (str: string) => Uint8Array
```

Added in v1.0.0

# utils

## Base64DecodeError (class)

**Signature**

```ts
export declare class Base64DecodeError
```

Added in v1.0.0

### \_tag (property)

**Signature**

```ts
readonly _tag: "Base64DecodeError"
```

Added in v1.0.0
