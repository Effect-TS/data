/**
 * @since 1.0.0
 */
import type * as bounded from "@fp-ts/core/typeclass/Bounded"
import type * as monoid from "@fp-ts/core/typeclass/Monoid"
import type * as order from "@fp-ts/core/typeclass/Order"
import * as semigroup from "@fp-ts/core/typeclass/Semigroup"
import type { Refinement } from "@fp-ts/data/Refinement"

/**
 * @category refinements
 * @since 1.0.0
 */
export const isNumber: Refinement<unknown, number> = (u: unknown): u is number =>
  typeof u === "number"

/**
 * @since 1.0.0
 */
export const sum = (that: number) => (self: number): number => self + that

/**
 * @since 1.0.0
 */
export const multiply = (that: number) => (self: number): number => self * that

/**
 * @since 1.0.0
 */
export const sub = (that: number) => (self: number): number => self - that

/**
 * @since 1.0.0
 */
export const increment = (n: number): number => n + 1

/**
 * @since 1.0.0
 */
export const decrement = (n: number): number => n - 1

/**
 * @category instances
 * @since 1.0.0
 */
export const Order: order.Order<number> = {
  compare: (that) => (self) => self < that ? -1 : self > that ? 1 : 0
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Bounded: bounded.Bounded<number> = {
  compare: Order.compare,
  maxBound: Infinity,
  minBound: -Infinity
}

/**
 * `number` semigroup under addition.
 *
 * @example
 * import { SemigroupSum } from '@fp-ts/data/Number'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * assert.deepStrictEqual(pipe(2, SemigroupSum.combine(3)), 5)
 *
 * @category instances
 * @since 1.0.0
 */
export const SemigroupSum: semigroup.Semigroup<number> = semigroup.fromCombine(sum)

/**
 * `number` semigroup under multiplication.
 *
 * @example
 * import { SemigroupMultiply } from '@fp-ts/data/Number'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * assert.deepStrictEqual(pipe(2, SemigroupMultiply.combine(3)), 6)
 *
 * @category instances
 * @since 1.0.0
 */
export const SemigroupMultiply: semigroup.Semigroup<number> = semigroup.fromCombine(multiply)

/**
 * `number` monoid under addition.
 *
 * The `empty` value is `0`.
 *
 * @category instances
 * @since 1.0.0
 */
export const MonoidSum: monoid.Monoid<number> = {
  combine: SemigroupSum.combine,
  combineMany: SemigroupSum.combineMany,
  combineAll: (all) => SemigroupSum.combineMany(all)(0),
  empty: 0
}

/**
 * `number` monoid under multiplication.
 *
 * The `empty` value is `1`.
 *
 * @category instances
 * @since 1.0.0
 */
export const MonoidMultiply: monoid.Monoid<number> = {
  combine: SemigroupMultiply.combine,
  combineMany: SemigroupMultiply.combineMany,
  combineAll: (all) => SemigroupMultiply.combineMany(all)(1),
  empty: 1
}

/**
 * @since 1.0.0
 */
export const sumAll: (collection: Iterable<number>) => number = MonoidSum.combineAll

/**
 * @since 1.0.0
 */
export const multiplyAll: (collection: Iterable<number>) => number = MonoidMultiply.combineAll
