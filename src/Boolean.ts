/**
 * @since 1.0.0
 */
import type * as monoid from "@fp-ts/core/Monoid"
import type * as semigroup from "@fp-ts/core/Semigroup"
import type * as show from "@fp-ts/core/Show"
import type * as sortable from "@fp-ts/core/Sortable"
import type { LazyArg } from "@fp-ts/data/Function"
import type { Refinement } from "@fp-ts/data/Refinement"

/**
 * @category refinements
 * @since 1.0.0
 */
export const isBoolean: Refinement<unknown, boolean> = (u: unknown): u is boolean =>
  typeof u === "boolean"

/**
 * @since 1.0.0
 */
export const and = (that: boolean) => (self: boolean): boolean => self && that

/**
 * @since 1.0.0
 */
export const or = (that: boolean) => (self: boolean): boolean => self || that

/**
 * Defines the match over a boolean value.
 * Takes two thunks `onTrue`, `onFalse` and a `boolean` value.
 * If `value` is `false`, `onFalse()` is returned, otherwise `onTrue()`.
 *
 * @exampleTodo
 * import { some, map } from '@fp-ts/core/data/Option'
 * import { pipe } from '@fp-ts/core/data/Function'
 * import { match } from '@fp-ts/core/data/boolean'
 *
 * assert.deepStrictEqual(
 *  pipe(
 *    some(true),
 *    map(match(() => 'false', () => 'true'))
 *  ),
 *  some('true')
 * )
 *
 * @category pattern matching
 * @since 1.0.0
 */
export const match = <A, B = A>(onFalse: LazyArg<A>, onTrue: LazyArg<B>) =>
  (value: boolean): A | B => value ? onTrue() : onFalse()

/**
 * `boolean` semigroup under conjunction.
 *
 * @exampleTodo
 * import { SemigroupAll } from '@fp-ts/core/data/boolean'
 * import { pipe } from '@fp-ts/core/data/Function'
 *
 * assert.deepStrictEqual(pipe(true, SemigroupAll.combine(true)), true)
 * assert.deepStrictEqual(pipe(true, SemigroupAll.combine(false)), false)
 *
 * @category instances
 * @since 1.0.0
 */
export const SemigroupAll: semigroup.Semigroup<boolean> = {
  combine: (a, b) => and(b)(a),
  combineMany: (start, others) => {
    let c = start
    for (const o of others) {
      c = and(o)(c)
    }
    return c
  }
}

/**
 * `boolean` semigroup under disjunction.
 *
 * @exampleTodo
 * import { SemigroupAny } from '@fp-ts/core/data/boolean'
 * import { pipe } from '@fp-ts/core/data/Function'
 *
 * assert.deepStrictEqual(pipe(true, SemigroupAny.combine(true)), true)
 * assert.deepStrictEqual(pipe(true, SemigroupAny.combine(false)), true)
 * assert.deepStrictEqual(pipe(false, SemigroupAny.combine(false)), false)
 *
 * @category instances
 * @since 1.0.0
 */
export const SemigroupAny: semigroup.Semigroup<boolean> = {
  combine: (first, second) => or(second)(first),
  combineMany: (start, others) => {
    let c = start
    for (const o of others) {
      c = or(o)(c)
    }
    return c
  }
}

/**
 * `boolean` monoid under conjunction.
 *
 * The `empty` value is `true`.
 *
 * @category instances
 * @since 1.0.0
 */
export const MonoidAll: monoid.Monoid<boolean> = {
  combine: SemigroupAll.combine,
  combineMany: SemigroupAll.combineMany,
  combineAll: (all) => SemigroupAll.combineMany(true, all),
  empty: true
}

/**
 * `boolean` monoid under disjunction.
 *
 * The `empty` value is `false`.
 *
 * @category instances
 * @since 1.0.0
 */
export const MonoidAny: monoid.Monoid<boolean> = {
  combine: SemigroupAny.combine,
  combineMany: SemigroupAny.combineMany,
  combineAll: (all) => SemigroupAny.combineMany(false, all),
  empty: false
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Sortable: sortable.Sortable<boolean> = {
  compare: (self, that) => self < that ? -1 : self > that ? 1 : 0
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Show: show.Show<boolean> = {
  show: (b) => JSON.stringify(b)
}

/**
 * @since 1.0.0
 */
export const all: (collection: Iterable<boolean>) => boolean = MonoidAll.combineAll

/**
 * @since 1.0.0
 */
export const any: (collection: Iterable<boolean>) => boolean = MonoidAny.combineAll
