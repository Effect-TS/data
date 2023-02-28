/**
 * @since 1.0.0
 */
import { dual, zeroArgsDual } from "@effect/data/Function"
import * as Hash from "@effect/data/Hash"
import type { Equivalence } from "@effect/data/typeclass/Equivalence"

/**
 * @since 1.0.0
 * @category symbols
 */
export const symbol: unique symbol = Symbol.for("@effect/data/Equal")

/**
 * @since 1.0.0
 * @category models
 */
export interface Equal extends Hash.Hash {
  [symbol](that: Equal): boolean
}

/**
 * @since 1.0.0
 * @category equality
 */
export const equals = dual<
  <B>(that: B) => <A>(self: A) => boolean,
  <A, B>(self: A, that: B) => boolean
>(2, (self, that) => compareBoth(self, that))

const compareBoth = (self: unknown, that: unknown) => {
  if (self === that) {
    return true
  }
  const selfType = typeof self
  if (selfType !== typeof that) {
    return false
  }
  if (
    (selfType === "object" || selfType === "function") &&
    self !== null &&
    that !== null
  ) {
    if (isEqual(self) && isEqual(that)) {
      return Hash.hash(self) === Hash.hash(that) && self[symbol](that)
    }
  }
  return false
}

/**
 * @since 1.0.0
 * @category guards
 */
export const isEqual: {
  (u: unknown): u is Equal
  (_?: never): (u: unknown) => u is Equal
} = zeroArgsDual((u: unknown): u is Equal => typeof u === "object" && u !== null && symbol in u)

/**
 * @since 1.0.0
 * @category instances
 */
export const equivalence: <A>(_: void) => Equivalence<A> = (_: void) =>
  (self, that) => Hash.hash(self) === Hash.hash(that) && equals(self, that)
