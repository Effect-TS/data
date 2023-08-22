---
title: Encoding.ts
nav_order: 16
parent: Modules
---

## Encoding overview

This module provides encoding & decoding functionality for:

- base64 (RFC4648)
- base64 (URL)

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
  - [unsafeDecodeBase64](#unsafedecodebase64)
  - [unsafeDecodeBase64Url](#unsafedecodebase64url)
  - [unsafeDecodeHex](#unsafedecodehex)
- [utils](#utils)
  - [Base64DecodeError (class)](#base64decodeerror-class)
    - [\_tag (property)](#_tag-property)
  - [Base64UrlDecodeError (class)](#base64urldecodeerror-class)
    - [\_tag (property)](#_tag-property-1)
  - [HexDecodeError (class)](#hexdecodeerror-class)
    - [\_tag (property)](#_tag-property-2)

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
export declare const encodeBase64Url: (data: Uint8Array) => string
```

Added in v1.0.0

## encodeHex

Encodes a Uint8Array into a hex string.

**Signature**

```ts
export declare const encodeHex: typeof Hex.encode
```

Added in v1.0.0

## unsafeDecodeBase64

Unsafely decodes a base64 (RFC4648) encoded string. Throws a type error if the
given value isn't a valid base64 (RFC4648) string.

**Signature**

```ts
export declare const unsafeDecodeBase64: (str: string) => Uint8Array
```

Added in v1.0.0

## unsafeDecodeBase64Url

Unsafely decodes a base64 (URL) encoded string. Throws a type error if the
given value isn't a valid base64 (URL) string.

**Signature**

```ts
export declare const unsafeDecodeBase64Url: (str: string) => Uint8Array
```

Added in v1.0.0

## unsafeDecodeHex

Unsafely decodes a hex encoded string. Throws a type error if the
given value isn't a valid hex string.

**Signature**

```ts
export declare const unsafeDecodeHex: typeof Hex.decode
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

## Base64UrlDecodeError (class)

**Signature**

```ts
export declare class Base64UrlDecodeError
```

Added in v1.0.0

### \_tag (property)

**Signature**

```ts
readonly _tag: "Base64UrlDecodeError"
```

Added in v1.0.0

## HexDecodeError (class)

**Signature**

```ts
export declare class HexDecodeError
```

Added in v1.0.0

### \_tag (property)

**Signature**

```ts
readonly _tag: "HexDecodeError"
```

Added in v1.0.0
