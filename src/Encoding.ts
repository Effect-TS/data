/**
 * This module provides encoding & decoding functionality for:
 *
 * - base64 (RFC4648)
 * - base64 (URL)
 *
 * @since 1.0.0
 */
import * as Either from "@effect/data/Either"
import * as Base64 from "@effect/data/internal/Encoding/Base64"
import * as Base64Url from "@effect/data/internal/Encoding/Base64Url"
import * as Hex from "@effect/data/internal/Encoding/Hex"

/**
 * Encodes a Uint8Array into a base64 (RFC4648) string.
 *
 * @category encoding
 * @since 1.0.0
 */
export const encodeBase64 = Base64.encode

/**
 * @since 1.0.0
 */
export class Base64DecodeError {
  /** @since 1.0.0 */
  readonly _tag = "Base64DecodeError"
}

/**
 * Decodes a base64 (RFC4648) encoded string.
 *
 * @category encoding
 * @since 1.0.0
 */
export const decodeBase64 = (str: string): Either.Either<Base64DecodeError, Uint8Array> => {
  try {
    return Either.right(Base64.decode(str))
  } catch {
    return Either.left(new Base64DecodeError())
  }
}

/**
 * Unsafely decodes a base64 (RFC4648) encoded string. Throws a type error if the
 * given value isn't a valid base64 (RFC4648) string.
 *
 * @category encoding
 * @since 1.0.0
 */
export const unsafeDecodeBase64 = Base64.decode

/**
 * Encodes a Uint8Array into a base64 (URL) string.
 *
 * @category encoding
 * @since 1.0.0
 */
export const encodeBase64Url = Base64Url.encode

/**
 * @since 1.0.0
 */
export class Base64UrlDecodeError {
  /** @since 1.0.0 */
  readonly _tag = "Base64UrlDecodeError"
}

/**
 * Decodes a base64 (URL) encoded string.
 *
 * @category encoding
 * @since 1.0.0
 */
export const decodeBase64Url = (str: string): Either.Either<Base64UrlDecodeError, Uint8Array> => {
  try {
    return Either.right(Base64Url.decode(str))
  } catch {
    return Either.left(new Base64UrlDecodeError())
  }
}

/**
 * Unsafely decodes a base64 (URL) encoded string. Throws a type error if the
 * given value isn't a valid base64 (URL) string.
 *
 * @category encoding
 * @since 1.0.0
 */
export const unsafeDecodeBase64Url = Base64Url.decode

/**
 * Encodes a Uint8Array into a hex string.
 *
 * @category encoding
 * @since 1.0.0
 */
export const encodeHex = Hex.encode

/**
 * @since 1.0.0
 */
export class HexDecodeError {
  /** @since 1.0.0 */
  readonly _tag = "HexDecodeError"
}

/**
 * Decodes a hex encoded string.
 *
 * @category encoding
 * @since 1.0.0
 */
export const decodeHex = (str: string): Either.Either<HexDecodeError, Uint8Array> => {
  try {
    return Either.right(Hex.decode(str))
  } catch {
    return Either.left(new HexDecodeError())
  }
}

/**
 * Unsafely decodes a hex encoded string. Throws a type error if the
 * given value isn't a valid hex string.
 *
 * @category encoding
 * @since 1.0.0
 */
export const unsafeDecodeHex = Hex.decode
