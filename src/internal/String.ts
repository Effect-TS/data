/**
 * @since 1.0.0
 */
import type * as monoid from "@fp-ts/core/typeclass/Monoid"
import * as semigroup from "@fp-ts/core/typeclass/Semigroup"

/** @internal */
export const empty = ""

/** @internal */
export const concat = (that: string) => (self: string): string => self + that

/** @internal */
export const Semigroup: semigroup.Semigroup<string> = semigroup.fromCombine(concat)

/** @internal */
export const Monoid: monoid.Monoid<string> = {
  ...Semigroup,
  combineAll: (collection) => Semigroup.combineMany(collection)(empty),
  empty
}
