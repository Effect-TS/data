/**
 * @since 1.0.0
 */

import type { NonEmptyArray } from "@effect/data/ReadonlyArray"

/** @internal */
export const isNonEmptyArray = <A>(self: ReadonlyArray<A>): self is NonEmptyArray<A> => self.length > 0
