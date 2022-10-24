/**
 * @since 1.0.0
 */

import type * as monoid from "@fp-ts/core/typeclass/Monoid"
import type * as semigroup from "@fp-ts/core/typeclass/Semigroup"
import * as func from "@fp-ts/data/Function"

/**
 * @category models
 * @since 1.0.0
 */
export interface Endomorphism<A> {
  (a: A): A
}

/**
 * @since 1.0.0
 */
export const compose: <B, C>(bc: (b: B) => C) => <A>(ab: (a: A) => B) => (a: A) => C = func.compose

/**
 * `Endomorphism` form a `Semigroup` where the `combine` operation is the usual function composition.
 *
 * @category instances
 * @since 1.0.0
 */
export const getSemigroup = <A>(): semigroup.Semigroup<Endomorphism<A>> => ({
  combine: (that) => (self) => func.flow(self, that),
  combineMany: (collection) =>
    (self) => {
      let c = self
      for (const o of collection) {
        c = (a) => o(c(a))
      }
      return c
    }
})

/**
 * `Endomorphism` form a `Monoid` where the `empty` value is the `identity` function.
 *
 * @category instances
 * @since 1.0.0
 */
export const getMonoid = <A>(): monoid.Monoid<Endomorphism<A>> => {
  const S = getSemigroup<A>()
  return ({
    ...S,
    combineAll: (all) => S.combineMany(all)(func.identity),
    empty: func.identity
  })
}
