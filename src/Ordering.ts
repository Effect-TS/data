/**
 * @since 3.0.0
 */
import * as monoid from "@fp-ts/core/typeclass/Monoid"
import type * as semigroup from "@fp-ts/core/typeclass/Semigroup"
import type { LazyArg } from "@fp-ts/data/Function"

/**
 * @category model
 * @since 3.0.0
 */
export type Ordering = -1 | 0 | 1

/**
 * @since 3.0.0
 */
export const reverse = (o: Ordering): Ordering => (o === -1 ? 1 : o === 1 ? -1 : 0)

/**
 * @category pattern matching
 * @since 3.0.0
 */
export const match = <A, B, C = B>(
  onLessThan: LazyArg<A>,
  onEqual: LazyArg<B>,
  onGreaterThan: LazyArg<C>
) => (o: Ordering): A | B | C => o === -1 ? onLessThan() : o === 0 ? onEqual() : onGreaterThan()

/**
 * @category instances
 * @since 3.0.0
 */
export const Semigroup: semigroup.Semigroup<Ordering> = {
  combine: (that) => (self) => self !== 0 ? self : that,
  combineMany: (collection) =>
    (self) => {
      let ordering = self
      if (ordering !== 0) {
        return ordering
      }
      for (ordering of collection) {
        if (ordering !== 0) {
          return ordering
        }
      }
      return ordering
    }
}

/**
 * @category instances
 * @since 3.0.0
 */
export const Monoid: monoid.Monoid<Ordering> = monoid.fromSemigroup(Semigroup, 0)

// TODO: move to Number module
/**
 * @since 3.0.0
 */
export const sign = (n: number): Ordering => (n <= -1 ? -1 : n >= 1 ? 1 : 0)
