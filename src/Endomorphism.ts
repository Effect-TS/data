/**
 * @since 1.0.0
 */

import type * as category from "@fp-ts/core/Category"
import type * as composable from "@fp-ts/core/Composable"
import type { TypeLambda } from "@fp-ts/core/HKT"
import type * as monoid from "@fp-ts/core/Monoid"
import type * as semigroup from "@fp-ts/core/Semigroup"
import * as func from "@fp-ts/data/Function"

/**
 * @category models
 * @since 1.0.0
 */
export interface Endomorphism<A> {
  (a: A): A
}

// -------------------------------------------------------------------------------------
// type lambdas
// -------------------------------------------------------------------------------------

/**
 * @category type lambdas
 * @since 1.0.0
 */
export interface EndomorphismTypeLambda extends TypeLambda {
  readonly type: Endomorphism<this["InOut1"]>
}

/**
 * @since 1.0.0
 */
export const id: <A>() => Endomorphism<A> = func.id

/**
 * @since 1.0.0
 */
export const compose: <B, C>(bc: (b: B) => C) => <A>(ab: (a: A) => B) => (a: A) => C = func.compose

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @category instances
 * @since 1.0.0
 */
export const Composable: composable.Composable<EndomorphismTypeLambda> = {
  compose
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Category: category.Category<EndomorphismTypeLambda> = {
  compose,
  id
}

/**
 * `Endomorphism` form a `Semigroup` where the `combine` operation is the usual function composition.
 *
 * @category instances
 * @since 1.0.0
 */
export const getSemigroup = <A>(): semigroup.Semigroup<Endomorphism<A>> => ({
  combine: (self, that) => func.flow(self, that),
  combineMany: (first, others) => {
    let c = first
    for (const o of others) {
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
    combine: S.combine,
    combineMany: S.combineMany,
    combineAll: (all) => S.combineMany(func.identity, all),
    empty: func.identity
  })
}
