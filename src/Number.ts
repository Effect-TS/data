/**
 * @since 1.0.0
 */
import type * as bounded from "@fp-ts/core/Bounded"
import type * as monoid from "@fp-ts/core/Monoid"
import * as semigroup from "@fp-ts/core/Semigroup"
import type * as ord from "@fp-ts/core/Sortable"
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
 * @category instances
 * @since 1.0.0
 */
export const Ord: ord.Sortable<number> = {
  compare: (that) => (self) => self < that ? -1 : self > that ? 1 : 0
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Bounded: bounded.Bounded<number> = {
  compare: Ord.compare,
  maximum: Infinity,
  minimum: -Infinity
}

/**
 * `number` semigroup under addition.
 *
 * @exampleTodo
 * import { SemigroupSum } from '@fp-ts/core/data/number'
 * import { pipe } from '@fp-ts/core/data/Function'
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
 * @exampleTodo
 * import { SemigroupMultiply } from '@fp-ts/core/data/number'
 * import { pipe } from '@fp-ts/core/data/Function'
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
  combineAll: (all) => SemigroupMultiply.combineMany(all)(0),
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
