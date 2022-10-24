/**
 * The `Const` type constructor, which wraps its first type argument and ignores its second.
 * That is, `Const<S, A>` is isomorphic to `S` for any `A`.
 *
 * `Const` has some useful instances. For example, the `Monoidal` instance allows us to collect results using a `Monoid`
 * while ignoring return values.
 *
 * @since 1.0.0
 */
import type * as bifunctor from "@fp-ts/core/Bifunctor"
import type { Bounded } from "@fp-ts/core/Bounded"
import type * as contravariant from "@fp-ts/core/Contravariant"
import * as functor from "@fp-ts/core/Functor"
import type { TypeLambda } from "@fp-ts/core/HKT"
import type { Monoid } from "@fp-ts/core/Monoid"
import * as monoid from "@fp-ts/core/Monoid"
import type { Monoidal } from "@fp-ts/core/Monoidal"
import type { Pointed } from "@fp-ts/core/Pointed"
import type { Semigroup } from "@fp-ts/core/Semigroup"
import type { Semigroupal } from "@fp-ts/core/Semigroupal"
import type { Sortable } from "@fp-ts/core/Sortable"
import * as sortable from "@fp-ts/core/Sortable"
import { constant, unsafeCoerce } from "@fp-ts/data/Function"

/**
 * @since 1.0.0
 */
export declare const phantom: unique symbol

/**
 * @category model
 * @since 1.0.0
 */
export interface Const</** in out */ S, /** out */ A> {
  readonly [phantom]: A
  readonly value: S
}

// -------------------------------------------------------------------------------------
// type lambdas
// -------------------------------------------------------------------------------------

/**
 * @category type lambdas
 * @since 1.0.0
 */
export interface ConstTypeLambda extends TypeLambda {
  readonly type: Const<this["InOut1"], this["Out1"]>
}

/**
 * @category type lambdas
 * @since 1.0.0
 */
export interface ConstTypeLambdaBifunctor extends TypeLambda {
  readonly type: Const<this["Out2"], this["Out1"]>
}

/**
 * @category type lambdas
 * @since 1.0.0
 */
export interface ConstTypeLambdaContravariant extends TypeLambda {
  readonly type: Const<this["InOut1"], this["In1"]>
}

/**
 * @category type lambdas
 * @since 1.0.0
 */
export interface ConstTypeLambdaFix<S> extends TypeLambda {
  readonly type: Const<S, this["Out1"]>
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const make = <S>(s: S): Const<S, never> =>
  unsafeCoerce({
    value: s
  })

/**
 * @since 1.0.0
 */
export const execute = <S, A>(self: Const<S, A>): S => self.value

/**
 * @category instances
 * @since 1.0.0
 */
export const liftSortable: <S>(Sortable: Sortable<S>) => Sortable<Const<S, never>> = sortable
  .contramap(execute)

/**
 * @category instances
 * @since 1.0.0
 */
export const liftBounded = <S>(Bounded: Bounded<S>): Bounded<Const<S, never>> => ({
  compare: liftSortable(Bounded).compare,
  maximum: make(Bounded.maximum),
  minimum: make(Bounded.minimum)
})

/**
 * @category instances
 * @since 1.0.0
 */
export const liftSemigroup = <S>(Semigroup: Semigroup<S>): Semigroup<Const<S, never>> => ({
  combine: (that) => (self) => make(Semigroup.combine(that.value)(self.value)),
  combineMany: (collection) =>
    (self) => make(Semigroup.combineMany(Array.from(collection).map(execute))(self.value))
})

/**
 * @category instances
 * @since 1.0.0
 */
export const liftMonoid = <S>(Monoid: Monoid<S>): Monoid<Const<S, never>> =>
  monoid.fromSemigroup(
    liftSemigroup(Monoid),
    make(Monoid.empty)
  )

/**
 * Returns an effect whose success is mapped by the specified `f` function.
 *
 * @category mapping
 * @since 1.0.0
 */
export const map: <A, B>(f: (a: A) => B) => <S>(self: Const<S, A>) => Const<S, B> = constant(
  unsafeCoerce
)

/**
 * @category instances
 * @since 1.0.0
 */
export const Covariant: functor.Covariant<ConstTypeLambda> = {
  map
}

/**
 * @category mapping
 * @since 1.0.0
 */
export const flap: <A>(a: A) => <S, B>(self: Const<S, (a: A) => B>) => Const<S, B> = functor.flap(
  Covariant
)

/**
 * @category mapping
 * @since 1.0.0
 */
export const contramap: <B, A>(f: (b: B) => A) => <S>(fa: Const<S, A>) => Const<S, B> = constant(
  unsafeCoerce
)

/**
 * @category instances
 * @since 1.0.0
 */
export const Contravariant: contravariant.Contravariant<ConstTypeLambdaContravariant> = {
  contramap
}

/**
 * @category mapping
 * @since 1.0.0
 */
export const mapLeft = <S, G>(f: (s: S) => G) =>
  <A>(self: Const<S, A>): Const<G, A> => make(f(self.value))

/**
 * Returns an effect whose failure and success channels have been mapped by
 * the specified pair of functions, `f` and `g`.
 *
 * @category mapping
 * @since 1.0.0
 */
export const mapBoth: <S, T, A, B>(
  f: (s: S) => T,
  g: (a: A) => B
) => (self: Const<S, A>) => Const<T, B> = unsafeCoerce(mapLeft)

/**
 * @category instances
 * @since 1.0.0
 */
export const Bifunctor: bifunctor.Bifunctor<ConstTypeLambdaBifunctor> = {
  mapBoth
}

/**
 * @category instances
 * @since 1.0.0
 */
export const getPointed = <S>(Monoid: Monoid<S>): Pointed<ConstTypeLambdaFix<S>> => ({
  of: constant(make(Monoid.empty))
})

/**
 * @category instances
 * @since 1.0.0
 */
export const getSemigroupal = <S>(Semigroup: Semigroup<S>): Semigroupal<ConstTypeLambdaFix<S>> => ({
  map,
  zipWith: (that) => (self) => make(Semigroup.combine(that.value)(self.value)),
  zipMany: (collection) =>
    (self) => make(Semigroup.combineMany(Array.from(collection).map((c) => c.value))(self.value))
})

/**
 * @category instances
 * @since 1.0.0
 */
export const getMonoidal = <S>(Monoid: Monoid<S>): Monoidal<ConstTypeLambdaFix<S>> => {
  const Semigroupal = getSemigroupal(Monoid)
  const Pointed = getPointed(Monoid)
  return {
    ...Pointed,
    ...Semigroupal,
    zipAll: (collection) => Semigroupal.zipMany(collection)(make(Monoid.empty))
  }
}
