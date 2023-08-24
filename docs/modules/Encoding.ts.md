---
title: Encoding.ts
nav_order: 16
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

- [encoding](#encoding)
  - [decodeBase64](#decodebase64)
  - [decodeBase64Url](#decodebase64url)
  - [decodeHex](#decodehex)
  - [encodeBase64](#encodebase64)
  - [encodeBase64Url](#encodebase64url)
  - [encodeHex](#encodehex)

---

# encoding

## decodeBase64

Decodes a base64 (RFC4648) encoded string.

**Signature**

```ts
export declare const decodeBase64: (str: string) => Either.Either<Base64DecodeError, Uint8Array>
```

Added in v1.0.0

## decodeBase64Url

Decodes a base64 (URL) encoded string.

**Signature**

```ts
export declare const decodeBase64Url: (str: string) => Either.Either<Base64UrlDecodeError, Uint8Array>
```

Added in v1.0.0

## decodeHex

Decodes a hex encoded string.

**Signature**

```ts
export declare const decodeHex: (str: string) => Either.Either<HexDecodeError, Uint8Array>
```

Added in v1.0.0

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
