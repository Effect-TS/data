/**
 * @since 1.0.0
 */
import type { Kind, TypeLambda } from "@fp-ts/core/HKT"
import type * as applicative from "@fp-ts/core/typeclass/Applicative"
import * as chainable from "@fp-ts/core/typeclass/Chainable"
import * as covariant from "@fp-ts/core/typeclass/Covariant"
import * as flatMap_ from "@fp-ts/core/typeclass/FlatMap"
import type * as foldable from "@fp-ts/core/typeclass/Foldable"
import * as invariant from "@fp-ts/core/typeclass/Invariant"
import type * as monad from "@fp-ts/core/typeclass/Monad"
import type { Monoid } from "@fp-ts/core/typeclass/Monoid"
import * as nonEmptyProduct from "@fp-ts/core/typeclass/NonEmptyProduct"
import * as of_ from "@fp-ts/core/typeclass/Of"
import type * as pointed from "@fp-ts/core/typeclass/Pointed"
import type * as traversable from "@fp-ts/core/typeclass/Traversable"
import { flow, identity } from "@fp-ts/data/Function"

/**
 * @category models
 * @since 1.0.0
 */
export type Identity<A> = A

/**
 * @category type lambdas
 * @since 1.0.0
 */
export interface IdentityTypeLambda extends TypeLambda {
  readonly type: Identity<this["Target"]>
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const of: <A>(a: A) => Identity<A> = identity

/**
 * @category conversions
 * @since 1.0.0
 */
export const toReadonlyArray = <A>(self: Identity<A>): ReadonlyArray<A> => [self]

/**
 * @category instances
 * @since 1.0.0
 */
export const Invariant: invariant.Invariant<IdentityTypeLambda> = {
  imap: covariant.imap<IdentityTypeLambda>(map)
}

/**
 * @since 1.0.0
 */
export const tupled: <A>(self: Identity<A>) => Identity<readonly [A]> = invariant.tupled(Invariant)

/**
 * @category do notation
 * @since 1.0.0
 */
export const bindTo: <N extends string>(
  name: N
) => <A>(self: Identity<A>) => Identity<{ readonly [K in N]: A }> = invariant.bindTo(Invariant)

/**
 * @category instances
 * @since 1.0.0
 */
export const Covariant: covariant.Covariant<IdentityTypeLambda> = {
  ...Invariant,
  map
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Of: of_.Of<IdentityTypeLambda> = {
  of
}

/**
 * @category do notation
 * @since 1.0.0
 */
export const Do: Identity<{}> = of_.Do(Of)

/**
 * @category instances
 * @since 1.0.0
 */
export const Pointed: pointed.Pointed<IdentityTypeLambda> = {
  ...Of,
  ...Covariant
}

/**
 * @category mapping
 * @since 1.0.0
 */
export const flap: <A>(a: A) => <B>(self: Identity<(a: A) => B>) => Identity<B> = covariant.flap(
  Covariant
)

/**
 * Maps the success value of this effect to the specified constant value.
 *
 * @category mapping
 * @since 1.0.0
 */
export const as: <B>(b: B) => <A>(self: Identity<A>) => Identity<B> = covariant.as(Covariant)

/**
 * Returns the effect resulting from mapping the success of this effect to unit.
 *
 * @category mapping
 * @since 1.0.0
 */
export const asUnit: <A>(self: Identity<A>) => Identity<void> = covariant.asUnit(Covariant)

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMap = <A, B>(f: (a: A) => Identity<B>) =>
  (self: Identity<A>): Identity<B> => f(self)

/**
 * @category instances
 * @since 1.0.0
 */
export const FlatMap: flatMap_.FlatMap<IdentityTypeLambda> = {
  flatMap
}

/**
 * Sequences the specified effect after this effect, but ignores the value
 * produced by the effect.
 *
 * @category sequencing
 * @since 1.0.0
 */
export const andThen: <B>(that: B) => <_>(self: _) => B = flatMap_
  .andThen(FlatMap)

/**
 * @category instances
 * @since 1.0.0
 */
export const Chainable: chainable.Chainable<IdentityTypeLambda> = {
  ...FlatMap,
  ...Covariant
}

/**
 * A variant of `flatMap` that ignores the value produced by this effect.
 *
 * @category sequencing
 * @since 1.0.0
 */
export const andThenDiscard: <_>(that: Identity<_>) => <A>(self: Identity<A>) => Identity<A> =
  chainable
    .andThenDiscard(Chainable)

/**
 * @since 1.0.0
 */
export const product = <B>(that: Identity<B>) =>
  <A>(self: Identity<A>): Identity<readonly [A, B]> => [self, that]

/**
 * @category instances
 * @since 1.0.0
 */
export const NonEmptyProduct: nonEmptyProduct.NonEmptyProduct<IdentityTypeLambda> = {
  ...Invariant,
  product,
  productMany: <A>(collection: Iterable<Identity<A>>) =>
    (self: Identity<A>): Identity<readonly [A, ...Array<A>]> => {
      const out: [A, ...Array<A>] = [self]
      for (const a of collection) {
        out.push(a)
      }
      return out
    }
}

/**
 * @since 1.0.0
 */
export const ap: <A>(fa: Identity<A>) => <B>(self: Identity<(a: A) => B>) => Identity<B> =
  nonEmptyProduct
    .ap(Semigroupal)

/**
 * Lifts a binary function into `Identity`.
 *
 * @category lifting
 * @since 1.0.0
 */
export const lift2: <A, B, C>(f: (a: A, b: B) => C) => (fa: A, fb: B) => C = nonEmptyProduct
  .lift2(
    Semigroupal
  )

/**
 * Lifts a ternary function into `Identity`.
 *
 * @category lifting
 * @since 1.0.0
 */
export const lift3: <A, B, C, D>(f: (a: A, b: B, c: C) => D) => (fa: A, fb: B, fc: C) => D =
  nonEmptyProduct
    .lift3(Semigroupal)

/**
 * @since 1.0.0
 */
export const zipAll = <A>(collection: Iterable<Identity<A>>): Identity<ReadonlyArray<A>> =>
  Array.from(collection)

/**
 * @category instances
 * @since 1.0.0
 */
export const Monoidal: applicative.Monoidal<IdentityTypeLambda> = {
  map,
  of,
  zipAll,
  zipMany,
  zipWith
}

/**
 * @since 1.0.0
 */
export const flatten: <A>(self: Identity<Identity<A>>) => Identity<A> = flatMap(identity)

/**
 * @category instances
 * @since 1.0.0
 */
export const Monad: monad.Monad<IdentityTypeLambda> = {
  map,
  of,
  flatMap
}

/**
 * @category folding
 * @since 1.0.0
 */
export const reduce = <B, A>(b: B, f: (b: B, a: A) => B) => (self: Identity<A>): B => f(b, self)

/**
 * @category folding
 * @since 1.0.0
 */
export const foldMap = <M>(_: Monoid<M>) => <A>(f: (a: A) => M) => (self: Identity<A>): M => f(self)

/**
 * @category folding
 * @since 1.0.0
 */
export const reduceRight = <B, A>(b: B, f: (b: B, a: A) => B) =>
  (self: Identity<A>): B => f(b, self)

/**
 * @category instances
 * @since 1.0.0
 */
export const Foldable: foldable.Foldable<IdentityTypeLambda> = {
  reduce,
  reduceRight
}

/**
 * @category traversing
 * @since 1.0.0
 */
export const traverse = <F extends TypeLambda>(
  Monoidal: applicative.Monoidal<F>
) =>
  <A, S, R, O, E, B>(
    f: (a: A) => Kind<F, S, R, O, E, B>
  ): (self: Identity<A>) => Kind<F, S, R, O, E, Identity<B>> => flow(f, Monoidal.map(identity))

/**
 * @category instances
 * @since 1.0.0
 */
export const Traversable: traversable.Traversable<IdentityTypeLambda> = {
  traverse
}

/**
 * @category traversing
 * @since 1.0.0
 */
export const sequence = <F extends TypeLambda>(
  _: applicative.Monoidal<F>
) =>
  <S, R, O, E, A>(self: Identity<Kind<F, S, R, O, E, A>>): Kind<F, S, R, O, E, Identity<A>> => self

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------

const let_: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (
  self: Identity<A>
) => Identity<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }> = covariant
  .let(
    Covariant
  )

export {
  /**
   * @category do notation
   * @since 1.0.0
   */
  let_ as let
}

/**
 * @category do notation
 * @since 1.0.0
 */
export const bind: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Identity<B>
) => (
  self: Identity<A>
) => Identity<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }> = flatMap_
  .bind(FlatMap)

/**
 * A variant of `bind` that sequentially ignores the scope.
 *
 * @category do notation
 * @since 1.0.0
 */
export const bindRight: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  fb: Identity<B>
) => (
  self: Identity<A>
) => Identity<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }> = nonEmptyProduct
  .bindRight(Semigroupal)

/**
 * @since 1.0.0
 */
export const zipFlatten: <B>(
  fb: B
) => <A extends ReadonlyArray<unknown>>(self: Identity<A>) => Identity<readonly [...A, B]> =
  nonEmptyProduct
    .zipFlatten(
      Semigroupal
    )
