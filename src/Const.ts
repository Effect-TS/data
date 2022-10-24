/**
 * The `Const` type constructor, which wraps its first type argument and ignores its second.
 * That is, `Const<S, A>` is isomorphic to `S` for any `A`.
 *
 * `Const` has some useful instances. For example, the `Monoidal` instance allows us to collect results using a `Monoid`
 * while ignoring return values.
 *
 * @since 1.0.0
 */
import type { TypeLambda } from "@fp-ts/core/HKT"
import type { Applicative } from "@fp-ts/core/typeclass/Applicative"
import type * as bicovariant from "@fp-ts/core/typeclass/Bicovariant"
import type { Bounded } from "@fp-ts/core/typeclass/Bounded"
import type * as contravariant from "@fp-ts/core/typeclass/Contravariant"
import * as covariant from "@fp-ts/core/typeclass/Covariant"
import type * as invariant from "@fp-ts/core/typeclass/Invariant"
import type { Monoid } from "@fp-ts/core/typeclass/Monoid"
import * as monoid from "@fp-ts/core/typeclass/Monoid"
import type { NonEmptyApplicative } from "@fp-ts/core/typeclass/NonEmptyApplicative"
import type { Order } from "@fp-ts/core/typeclass/Order"
import * as order from "@fp-ts/core/typeclass/Order"
import type { Pointed } from "@fp-ts/core/typeclass/Pointed"
import type { Semigroup } from "@fp-ts/core/typeclass/Semigroup"
import { constant, unsafeCoerce } from "@fp-ts/data/Function"

/**
 * @since 1.0.0
 */
export declare const phantom: unique symbol

/**
 * @category model
 * @since 1.0.0
 */
export interface Const<S, A> {
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
  readonly type: Const<this["Out1"], this["Target"]>
}

/**
 * @category type lambdas
 * @since 1.0.0
 */
export interface ConstTypeLambdaContravariant extends TypeLambda {
  readonly type: Const<this["In"], this["Target"]>
}

/**
 * @category type lambdas
 * @since 1.0.0
 */
export interface ConstTypeLambdaFix<S> extends TypeLambda {
  readonly type: Const<S, this["Target"]>
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
export const liftOrder: <S>(O: Order<S>) => Order<Const<S, never>> = order
  .contramap(execute)

/**
 * @category instances
 * @since 1.0.0
 */
export const liftBounded = <S>(Bounded: Bounded<S>): Bounded<Const<S, never>> => ({
  compare: liftOrder(Bounded).compare,
  maxBound: make(Bounded.maxBound),
  minBound: make(Bounded.minBound)
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
export const Invariant: invariant.Invariant<ConstTypeLambda> = {
  imap: covariant.imap<ConstTypeLambda>(map)
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Covariant: covariant.Covariant<ConstTypeLambda> = {
  ...Invariant,
  map
}

/**
 * @category mapping
 * @since 1.0.0
 */
const contramap: <B, A>(f: (b: B) => A) => <S>(self: Const<S, A>) => Const<S, B> = constant(
  unsafeCoerce
)

/**
 * @category instances
 * @since 1.0.0
 */
export const Contravariant: contravariant.Contravariant<ConstTypeLambdaContravariant> = {
  ...Invariant,
  contramap
}

/**
 * @category mapping
 * @since 1.0.0
 */
export const mapLeft = <S, T>(f: (s: S) => T) =>
  <A>(self: Const<S, A>): Const<T, A> => make(f(self.value))

/**
 * Returns an effect whose failure and success channels have been mapped by
 * the specified pair of functions, `f` and `g`.
 *
 * @category mapping
 * @since 1.0.0
 */
export const bimap: <S, T, A, B>(
  f: (s: S) => T,
  g: (a: A) => B
) => (self: Const<S, A>) => Const<T, B> = unsafeCoerce(mapLeft)

/**
 * @category instances
 * @since 1.0.0
 */
export const Bicovariant: bicovariant.Bicovariant<ConstTypeLambda> = {
  bimap
}

/**
 * @category instances
 * @since 1.0.0
 */
export const getPointed = <S>(M: Monoid<S>): Pointed<ConstTypeLambdaFix<S>> => ({
  imap: Invariant.imap,
  map,
  of: constant(make(M.empty))
})

/**
 * @category instances
 * @since 1.0.0
 */
export const getNonEmptyApplicative = <S>(
  S: Semigroup<S>
): NonEmptyApplicative<ConstTypeLambdaFix<S>> => ({
  imap: Invariant.imap,
  map,
  product: (that) => (self) => make(S.combine(that.value)(self.value)),
  productMany: (collection) =>
    (self) => make(S.combineMany(Array.from(collection).map((c) => c.value))(self.value))
})

/**
 * @category instances
 * @since 1.0.0
 */
export const getApplicative = <S>(M: Monoid<S>): Applicative<ConstTypeLambdaFix<S>> => {
  const NonEmptyApplicative = getNonEmptyApplicative(M)
  return {
    ...getPointed(M),
    ...NonEmptyApplicative,
    productAll: (collection) => NonEmptyApplicative.productMany(collection)(make(M.empty))
  }
}
