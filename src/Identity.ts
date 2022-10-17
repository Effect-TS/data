/**
 * @since 1.0.0
 */
import type * as categoryKind from "@fp-ts/core/CategoryKind"
import type * as comonad from "@fp-ts/core/Comonad"
import type * as composableKind from "@fp-ts/core/ComposableKind"
import type * as extendable from "@fp-ts/core/Extendable"
import * as flatMap_ from "@fp-ts/core/FlatMap"
import type * as foldable from "@fp-ts/core/Foldable"
import * as functor from "@fp-ts/core/Functor"
import type { Kind, TypeLambda } from "@fp-ts/core/HKT"
import type * as monad from "@fp-ts/core/Monad"
import type { Monoid } from "@fp-ts/core/Monoid"
import type * as monoidal from "@fp-ts/core/Monoidal"
import type * as pointed from "@fp-ts/core/Pointed"
import * as semigroupal from "@fp-ts/core/Semigroupal"
import type * as semigroupKind from "@fp-ts/core/SemigroupKind"
import type * as traversable from "@fp-ts/core/Traversable"
import { flow, identity } from "@fp-ts/data/Function"
import * as internal from "@fp-ts/data/internal/Common"

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
  readonly type: Identity<this["Out1"]>
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
export const Pointed: pointed.Pointed<IdentityTypeLambda> = {
  of
}

/**
 * Returns an effect whose success is mapped by the specified `f` function.
 *
 * @category mapping
 * @since 1.0.0
 */
export const map: <A, B>(f: (a: A) => B) => (self: Identity<A>) => Identity<B> = identity

/**
 * @category instances
 * @since 1.0.0
 */
export const Functor: functor.Functor<IdentityTypeLambda> = {
  map
}

/**
 * @category mapping
 * @since 1.0.0
 */
export const flap: <A>(a: A) => <B>(self: Identity<(a: A) => B>) => Identity<B> = functor.flap(
  Functor
)

/**
 * Maps the success value of this effect to the specified constant value.
 *
 * @category mapping
 * @since 1.0.0
 */
export const as: <B>(b: B) => <A>(self: Identity<A>) => Identity<B> = functor.as(Functor)

/**
 * Returns the effect resulting from mapping the success of this effect to unit.
 *
 * @category mapping
 * @since 1.0.0
 */
export const unit: <A>(self: Identity<A>) => Identity<void> = functor.unit(Functor)

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
  map,
  flatMap
}

/**
 * @since 1.0.0
 */
export const composeKind: <B, C>(
  that: (b: B) => Identity<C>
) => <A>(self: (a: A) => Identity<B>) => (a: A) => Identity<C> = flatMap_.composeKind(FlatMap)

/**
 * @category instances
 * @since 1.0.0
 */
export const ComposableKind: composableKind.ComposableKind<IdentityTypeLambda> = {
  composeKind
}

/**
 * @since 1.0.0
 */
export const idKind = <A>(): (a: A) => Identity<A> => identity

/**
 * @category instances
 * @since 1.0.0
 */
export const CategoryKind: categoryKind.CategoryKind<IdentityTypeLambda> = {
  composeKind,
  idKind
}

/**
 * Sequences the specified effect after this effect, but ignores the value
 * produced by the effect.
 *
 * @category sequencing
 * @since 1.0.0
 */
export const zipLeft: (that: Identity<unknown>) => <A>(self: Identity<A>) => Identity<A> = flatMap_
  .zipLeft(FlatMap)

/**
 * A variant of `flatMap` that ignores the value produced by this effect.
 *
 * @category sequencing
 * @since 1.0.0
 */
export const zipRight: <A>(that: Identity<A>) => (self: Identity<unknown>) => Identity<A> = flatMap_
  .zipRight(FlatMap)

/**
 * @since 1.0.0
 */
export const combineKind: <B>(that: Identity<B>) => <A>(self: Identity<A>) => Identity<B | A> =
  () => identity

/**
 * @since 1.0.0
 */
export const combineKindMany: <A>(collection: Iterable<A>) => (self: Identity<A>) => Identity<A> =
  () => identity

/**
 * @category instances
 * @since 1.0.0
 */
export const SemigroupKind: semigroupKind.SemigroupKind<IdentityTypeLambda> = {
  map,
  combineKind,
  combineKindMany
}

/**
 * @since 1.0.0
 */
export const zipWith = <B, A, C>(that: Identity<B>, f: (a: A, b: B) => C) =>
  (self: Identity<A>): Identity<C> => f(self, that)

/**
 * @since 1.0.0
 */
export const zipMany = <A>(collection: Iterable<Identity<A>>) =>
  (self: Identity<A>): Identity<readonly [A, ...Array<A>]> => {
    const out: [A, ...Array<A>] = [self]
    for (const a of collection) {
      out.push(a)
    }
    return out
  }

/**
 * @category instances
 * @since 1.0.0
 */
export const Semigroupal: semigroupal.Semigroupal<IdentityTypeLambda> = {
  map,
  zipWith,
  zipMany
}

/**
 * @since 1.0.0
 */
export const ap: <A>(fa: Identity<A>) => <B>(self: Identity<(a: A) => B>) => Identity<B> =
  semigroupal
    .ap(Semigroupal)

/**
 * Lifts a binary function into `Identity`.
 *
 * @category lifting
 * @since 1.0.0
 */
export const lift2: <A, B, C>(f: (a: A, b: B) => C) => (fa: A, fb: B) => C = semigroupal.lift2(
  Semigroupal
)

/**
 * Lifts a ternary function into `Identity`.
 *
 * @category lifting
 * @since 1.0.0
 */
export const lift3: <A, B, C, D>(f: (a: A, b: B, c: C) => D) => (fa: A, fb: B, fc: C) => D =
  semigroupal
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
export const Monoidal: monoidal.Monoidal<IdentityTypeLambda> = {
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
 * @since 1.0.0
 */
export const extend = <A, B>(f: (that: Identity<A>) => B) =>
  (self: Identity<A>): Identity<B> => f(self)

/**
 * @since 1.0.0
 */
export const duplicate: <A>(self: Identity<A>) => Identity<Identity<A>> = extend(identity)

/**
 * @category instances
 * @since 1.0.0
 */
export const Extendable: extendable.Extendable<IdentityTypeLambda> = {
  map,
  extend
}

/**
 * @since 1.0.0
 */
export const extract: <A>(self: Identity<A>) => A = identity

/**
 * @category instances
 * @since 1.0.0
 */
export const Comonad: comonad.Comonad<IdentityTypeLambda> = {
  map,
  extend,
  extract
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
  Monoidal: monoidal.Monoidal<F>
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
  _: monoidal.Monoidal<F>
) =>
  <S, R, O, E, A>(self: Identity<Kind<F, S, R, O, E, A>>): Kind<F, S, R, O, E, Identity<A>> => self

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------

/**
 * @category do notation
 * @since 1.0.0
 */
export const Do: Identity<{}> = of(internal.Do)

/**
 * @category do notation
 * @since 1.0.0
 */
export const bindTo: <N extends string>(
  name: N
) => <A>(self: Identity<A>) => Identity<{ readonly [K in N]: A }> = functor.bindTo(Functor)

const let_: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (
  self: Identity<A>
) => Identity<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }> = functor
  .let(
    Functor
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
) => Identity<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }> = semigroupal
  .bindRight(Semigroupal)

// -------------------------------------------------------------------------------------
// tuple sequencing
// -------------------------------------------------------------------------------------

/**
 * @category tuple sequencing
 * @since 1.0.0
 */
export const Zip: Identity<readonly []> = of(internal.empty)

/**
 * @category tuple sequencing
 * @since 1.0.0
 */
export const tupled: <A>(self: Identity<A>) => Identity<readonly [A]> = functor.tupled(Functor)

/**
 * Sequentially zips this effect with the specified effect.
 *
 * @category tuple sequencing
 * @since 1.0.0
 */
export const zipFlatten: <B>(
  fb: B
) => <A extends ReadonlyArray<unknown>>(self: Identity<A>) => Identity<readonly [...A, B]> =
  semigroupal
    .zipFlatten(
      Semigroupal
    )
