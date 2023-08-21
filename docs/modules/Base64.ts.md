---
title: Base64.ts
nav_order: 1
parent: Modules
---

## Base64 overview

This module provides encoding & decoding functionality for the base64 (RFC4648) encoding scheme.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [encoding](#encoding)
  - [decode](#decode)
  - [encode](#encode)
  - [unsafeDecode](#unsafedecode)

---

# encoding

## decode

Decodes a base64 (RFC4648) encoded string.

**Signature**

```ts
export declare const decode: (str: string) => Either.Either<Error, Uint8Array>
```

Added in v1.0.0

## encode

Encodes a Uint8Array into a base64 (RFC4648) string.

**Signature**

```ts
export declare const encode: (bytes: Uint8Array) => string
```

Added in v1.0.0

## unsafeDecode

Unsafely decodes a base64 (RFC4648) encoded string unsafely. Throws an error if the
given value isn't a valid base64 (RFC4648) string.

**Signature**

```ts
export declare const unsafeDecode: (str: string) => Uint8Array
```

Added in v1.0.0
