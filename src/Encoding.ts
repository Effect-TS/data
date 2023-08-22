/**
 * This module provides encoding & decoding functionality for:
 *
 * - base64 (RFC4648)
 *
 * @since 1.0.0
 */
import * as Either from "@effect/data/Either"
import * as Base64 from "@effect/data/internal/Encoding/Base64"

/**
 * Encodes a Uint8Array into a base64 (RFC4648) string.
 *
 * @category encoding
 * @since 1.0.0
 */
export const encodeBase64 = Base64.encode

/**
 * @category encoding
 * @since 1.0.0
 */
export class Base64DecodeError {
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
 * Unsafely decodes a base64 (RFC4648) encoded string unsafely. Throws an error if the
 * given value isn't a valid base64 (RFC4648) string.
 *
 * @category encoding
 * @since 1.0.0
 */
export const unsafeDecodeBase64 = Base64.decode
