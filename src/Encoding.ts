/**
 * This module provides encoding & decoding functionality for:
 *
 * - base64 (RFC4648)
 * - base64 (URL)
 * - hex
 *
 * @since 1.0.0
 */
import type * as Either from "@effect/data/Either"
import * as Base64 from "@effect/data/internal/Encoding/Base64"
import * as Base64Url from "@effect/data/internal/Encoding/Base64Url"
import * as common from "@effect/data/internal/Encoding/Common"
import * as Hex from "@effect/data/internal/Encoding/Hex"

/**
 * Encodes a Uint8Array into a base64 (RFC4648) string.
 *
 * @category encoding
 * @since 1.0.0
 */
export const encodeBase64: (bytes: Uint8Array) => string = Base64.encode

/**
 * Decodes a base64 (RFC4648) encoded string.
 *
 * @category decoding
 * @since 1.0.0
 */
export const decodeBase64 = (str: string): Either.Either<DecodeException, Uint8Array> => Base64.decode(str)

/**
 * Encodes a Uint8Array into a base64 (URL) string.
 *
 * @category encoding
 * @since 1.0.0
 */
export const encodeBase64Url: (bytes: Uint8Array) => string = Base64Url.encode

/**
 * Decodes a base64 (URL) encoded string.
 *
 * @category decoding
 * @since 1.0.0
 */
export const decodeBase64Url = (str: string): Either.Either<DecodeException, Uint8Array> => Base64Url.decode(str)

/**
 * Encodes a Uint8Array into a hex string.
 *
 * @category encoding
 * @since 1.0.0
 */
export const encodeHex: (bytes: Uint8Array) => string = Hex.encode

/**
 * Decodes a hex encoded string.
 *
 * @category decoding
 * @since 1.0.0
 */
export const decodeHex = (str: string): Either.Either<DecodeException, Uint8Array> => Hex.decode(str)

/**
 * @since 1.0.0
 * @category symbols
 */
export const DecodeExceptionTypeId: unique symbol = common.DecodeExceptionTypeId

/**
 * @since 1.0.0
 * @category symbols
 */
export type DecodeExceptionTypeId = typeof DecodeExceptionTypeId

/**
 * Represents a checked exception which occurs when decoding fails.
 *
 * @since 1.0.0
 * @category models
 */
export interface DecodeException {
  readonly _tag: "DecodeException"
  readonly [DecodeExceptionTypeId]: DecodeExceptionTypeId
  readonly input: string
  readonly message?: string
}

/**
 * Creates a checked exception which occurs when decoding fails.
 *
 * @since 1.0.0
 * @category errors
 */
export const DecodeException: (input: string, message?: string) => DecodeException = common.DecodeException

/**
 * Returns `true` if the specified value is an `DecodeException`, `false` otherwise.
 *
 * @since 1.0.0
 * @category refinements
 */
export const isDecodeException: (u: unknown) => u is DecodeException = common.isDecodeException
