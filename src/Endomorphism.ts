/**
 * @since 1.0.0
 */
import type * as monoid from "@fp-ts/core/typeclass/Monoid"
import type * as semigroup from "@fp-ts/core/typeclass/Semigroup"
import * as Function from "@fp-ts/data/Function"

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
export const compose: <B, C>(bc: (b: B) => C) => <A>(ab: (a: A) => B) => (a: A) => C =
  Function.compose

/**
 * `Endomorphism` form a `Semigroup` where the `combine` operation is the usual function composition.
 *
 * @category instances
 * @since 1.0.0
 */
export const getSemigroup = <A>(): semigroup.Semigroup<Endomorphism<A>> => ({
  combine: (that) => (self) => Function.flow(self, that),
  combineMany: (collection) =>
    (self) =>
      (a) => {
        let out = self(a)
        for (const f of collection) {
          out = f(out)
        }
        return out
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
  const empty = Function.identity
  return ({
    ...S,
    combineAll: (collection) => S.combineMany(collection)(empty),
    empty
  })
}
