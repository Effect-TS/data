/**
 * @since 1.0.0
 */

import { structural } from "@effect/data/internal/Equal"
import type { None, Option, Some } from "@effect/data/Option"

/** @internal */
export const isNone = <A>(fa: Option<A>): fa is None => fa._tag === "None"

/** @internal */
export const isSome = <A>(fa: Option<A>): fa is Some<A> => fa._tag === "Some"

/** @internal */
export const none: Option<never> = Object.defineProperty(
  { _tag: "None" },
  structural,
  { enumerable: false, value: true }
)

/** @internal */
export const some = <A>(a: A): Option<A> =>
  Object.defineProperty(
    { _tag: "Some", value: a },
    structural,
    { enumerable: false, value: true }
  )
