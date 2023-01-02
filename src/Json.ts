/**
 * @since 1.0.0
 */
import type { Either } from "@fp-ts/data/Either"
import * as E from "@fp-ts/data/Either"
import { identity } from "@fp-ts/data/Function"

/**
 * @since 1.0.0
 */
export type JsonArray = ReadonlyArray<Json>

/**
 * @since 1.0.0
 */
export type JsonObject = StringIndexed<Json>

/**
 * @since 1.0.0
 */
export interface StringIndexed<A = any> {
  readonly [k: string]: A
}

/**
 * @since 1.0.0
 */
export type Json =
  | null
  | boolean
  | number
  | string
  | JsonArray
  | JsonObject

/**
 * Converts a JavaScript Object Notation (JSON) string into an object.
 *
 * @example
 * import * as J from '@fp-ts/data/Json'
 * import * as E from '@fp-ts/data/Either'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * assert.deepStrictEqual(pipe('{"a":1}', J.parse), E.right({ a: 1 }))
 * assert.deepStrictEqual(pipe('{"a":}', J.parse), E.left(new SyntaxError('Unexpected token } in JSON at position 5')))
 *
 * @since 1.0.0
 */
export const parse = (s: string): Either<unknown, Json> =>
  E.fromThrowable(() => JSON.parse(s), identity)

/**
 * Converts a JavaScript value to a JavaScript Object Notation (JSON) string.
 *
 * @since 1.0.0
 */
export const stringify = <A>(value: A): Either<unknown, string> =>
  E.fromThrowable(() => {
    const s = JSON.stringify(value)
    if (typeof s !== "string") {
      throw new Error("Converting unsupported structure to JSON")
    }
    return s
  }, identity)
