/**
 * @since 1.0.0
 */
import type { Kind, TypeLambda } from "@fp-ts/core/HKT"
import * as applicative from "@fp-ts/core/typeclass/Applicative"
import * as chainable from "@fp-ts/core/typeclass/Chainable"
import type * as coproduct from "@fp-ts/core/typeclass/Coproduct"
import * as covariant from "@fp-ts/core/typeclass/Covariant"
import * as flatMap_ from "@fp-ts/core/typeclass/FlatMap"
import * as foldable from "@fp-ts/core/typeclass/Foldable"
import * as invariant from "@fp-ts/core/typeclass/Invariant"
import type * as monad from "@fp-ts/core/typeclass/Monad"
import type { Monoid } from "@fp-ts/core/typeclass/Monoid"
import type * as nonEmptyAlternative from "@fp-ts/core/typeclass/NonEmptyAlternative"
import * as nonEmptyApplicative from "@fp-ts/core/typeclass/NonEmptyApplicative"
import * as nonEmptyCoproduct from "@fp-ts/core/typeclass/NonEmptyCoproduct"
import * as nonEmptyProduct from "@fp-ts/core/typeclass/NonEmptyProduct"
import * as of_ from "@fp-ts/core/typeclass/Of"
import type * as pointed from "@fp-ts/core/typeclass/Pointed"
import * as product_ from "@fp-ts/core/typeclass/Product"
import type { Semigroup } from "@fp-ts/core/typeclass/Semigroup"
import * as traversable from "@fp-ts/core/typeclass/Traversable"
import type { Either } from "@fp-ts/data/Either"
import { identity } from "@fp-ts/data/Function"
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
  readonly type: Identity<this["Target"]>
}

/**
 * @since 1.0.0
 */
export const map = <A, B>(f: (a: A) => B) => (self: Identity<A>): Identity<B> => f(self)

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

const let_: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (
  self: Identity<A>
) => Identity<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }> = covariant.let(
  Covariant
)

export { let_ as let }

/**
 * @category mapping
 * @since 1.0.0
 */
export const flap: <A>(a: A) => <B>(fab: Identity<(a: A) => B>) => Identity<B> = covariant.flap(
  Covariant
)

/**
 * Maps the success value of this effect to the specified constant value.
 *
 * @category mapping
 * @since 1.0.0
 */
export const as: <B>(b: B) => <_>(self: Identity<_>) => Identity<B> = covariant.as(Covariant)

/**
 * Returns the effect resulting from mapping the success of this effect to unit.
 *
 * @category mapping
 * @since 1.0.0
 */
export const asUnit: <_>(self: Identity<_>) => Identity<void> = covariant.asUnit(Covariant)

/**
 * @category constructors
 * @since 1.0.0
 */
export const of: <A>(a: A) => Identity<A> = identity

/**
 * @category instances
 * @since 1.0.0
 */
export const Of: of_.Of<IdentityTypeLambda> = {
  of
}

/**
 * @since 1.0.0
 */
export const unit: Identity<void> = of_.unit(Of)

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
 * @since 1.0.0
 */
export const flatten: <A>(self: Identity<Identity<A>>) => Identity<A> = flatMap_
  .flatten(FlatMap)

/**
 * @since 1.0.0
 */
export const andThen: <B>(that: Identity<B>) => <_>(self: Identity<_>) => Identity<B> = flatMap_
  .andThen(FlatMap)

/**
 * @since 1.0.0
 */
export const composeKleisliArrow: <B, C>(
  bfc: (b: B) => Identity<C>
) => <A>(afb: (a: A) => Identity<B>) => (a: A) => Identity<C> = flatMap_
  .composeKleisliArrow(FlatMap)

/**
 * @category instances
 * @since 1.0.0
 */
export const Chainable: chainable.Chainable<IdentityTypeLambda> = {
  ...FlatMap,
  ...Covariant
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
) => Identity<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }> = chainable.bind(
  Chainable
)

/**
 * Returns an effect that effectfully "peeks" at the success of this effect.
 *
 * @since 1.0.0
 */
export const tap: <A, _>(f: (a: A) => Identity<_>) => (self: Identity<A>) => Identity<A> = chainable
  .tap(
    Chainable
  )

/**
 * Sequences the specified effect after this effect, but ignores the value
 * produced by the effect.
 *
 * @category sequencing
 * @since 1.0.0
 */
export const andThenDiscard: <_>(that: Identity<_>) => <A>(self: Identity<A>) => Identity<A> =
  chainable
    .andThenDiscard(Chainable)

/**
 * @category instances
 * @since 1.0.0
 */
export const Monad: monad.Monad<IdentityTypeLambda> = {
  ...Pointed,
  ...FlatMap
}

/**
 * @since 1.0.0
 */
export const product = <B>(
  that: Identity<B>
) => <A>(self: Identity<A>): Identity<readonly [A, B]> => [self, that]

/**
 * @category instances
 * @since 1.0.0
 */
export const NonEmptyProduct: nonEmptyProduct.NonEmptyProduct<IdentityTypeLambda> = {
  ...Invariant,
  product,
  productMany: <A>(collection: Iterable<Identity<A>>) =>
    (self: Identity<A>): Identity<readonly [A, ...Array<A>]> => [self, ...collection]
}

/**
 * A variant of `bind` that sequentially ignores the scope.
 *
 * @category do notation
 * @since 1.0.0
 */
export const bindIdentity: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  fb: Identity<B>
) => (
  self: Identity<A>
) => Identity<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }> = nonEmptyProduct
  .bindKind(NonEmptyProduct)

/**
 * @since 1.0.0
 */
export const productFlatten: <B>(
  fb: Identity<B>
) => <A extends ReadonlyArray<unknown>>(self: Identity<A>) => Identity<readonly [...A, B]> =
  nonEmptyProduct
    .productFlatten(NonEmptyProduct)

/**
 * @category instances
 * @since 1.0.0
 */
export const Product: product_.Product<IdentityTypeLambda> = {
  ...Of,
  ...NonEmptyProduct,
  productAll: <A>(collection: Iterable<Identity<A>>): Identity<ReadonlyArray<A>> =>
    internal.fromIterable(collection)
}

/**
 * @since 1.0.0
 */
export const tuple: <T extends ReadonlyArray<Identity<any>>>(
  ...tuple: T
) => Identity<Readonly<{ [I in keyof T]: [T[I]] extends [Identity<infer A>] ? A : never }>> =
  product_
    .tuple(Product)

/**
 * @since 1.0.0
 */
export const struct: <R extends Record<string, Identity<any>>>(
  r: R
) => Identity<{ readonly [K in keyof R]: [R[K]] extends [Identity<infer A>] ? A : never }> =
  product_
    .struct(Product)

/**
 * @category instances
 * @since 1.0.0
 */
export const NonEmptyApplicative: nonEmptyApplicative.NonEmptyApplicative<IdentityTypeLambda> = {
  ...NonEmptyProduct,
  ...Covariant
}

/**
 * Monoid returning the left-most non-`None` value. If both operands are `Some`s then the inner values are
 * combined using the provided `Semigroup`
 *
 * | x       | y       | combine(y)(x)       |
 * | ------- | ------- | ------------------- |
 * | none    | none    | none                |
 * | some(a) | none    | some(a)             |
 * | none    | some(a) | some(a)             |
 * | some(a) | some(b) | some(combine(b)(a)) |
 *
 * @example
 * import { liftSemigroup, some, none } from '@fp-ts/data/Identity'
 * import * as N from '@fp-ts/data/Number'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * const M = liftSemigroup(N.SemigroupSum)
 * assert.deepStrictEqual(pipe(none, M.combine(none)), none)
 * assert.deepStrictEqual(pipe(some(1), M.combine(none)), some(1))
 * assert.deepStrictEqual(pipe(none, M.combine(some(1))), some(1))
 * assert.deepStrictEqual(pipe(some(1), M.combine(some(2))), some(3))
 *
 * @category instances
 * @since 1.0.0
 */
export const liftSemigroup: <A>(S: Semigroup<A>) => Semigroup<Identity<A>> = nonEmptyApplicative
  .liftSemigroup(NonEmptyApplicative)

/**
 * Lifts a binary function into `Identity`.
 *
 * @category lifting
 * @since 1.0.0
 */
export const lift2: <A, B, C>(
  f: (a: A, b: B) => C
) => (fa: Identity<A>, fb: Identity<B>) => Identity<C> = nonEmptyApplicative.lift2(
  NonEmptyApplicative
)

/**
 * Lifts a ternary function into `Identity`.
 *
 * @category lifting
 * @since 1.0.0
 */
export const lift3: <A, B, C, D>(
  f: (a: A, b: B, c: C) => D
) => (fa: Identity<A>, fb: Identity<B>, fc: Identity<C>) => Identity<D> = nonEmptyApplicative.lift3(
  NonEmptyApplicative
)

/**
 * @since 1.0.0
 */
export const ap: <A>(
  fa: Identity<A>
) => <B>(self: Identity<(a: A) => B>) => Identity<B> = nonEmptyApplicative.ap(
  NonEmptyApplicative
)

/**
 * @category instances
 * @since 1.0.0
 */
export const Applicative: applicative.Applicative<IdentityTypeLambda> = {
  ...NonEmptyApplicative,
  ...Product
}

/**
 * @since 1.0.0
 */
export const liftMonoid: <A>(M: Monoid<A>) => Monoid<Identity<A>> = applicative.liftMonoid(
  Applicative
)

/**
 * @category instances
 * @since 1.0.0
 */
export const NonEmptyCoproduct: nonEmptyCoproduct.NonEmptyCoproduct<IdentityTypeLambda> = {
  ...Invariant,
  coproduct: () => identity,
  coproductMany: () => identity
}

/**
 * @since 1.0.0
 */
export const getSemigroup: <A>() => Semigroup<Identity<A>> = nonEmptyCoproduct.getSemigroup(
  NonEmptyCoproduct
)

/**
 * @since 1.0.0
 */
export const coproductEither: <B>(
  that: Identity<B>
) => <A>(self: Identity<A>) => Identity<Either<A, B>> = nonEmptyCoproduct.coproductEither(
  NonEmptyCoproduct
)

/**
 * @category instances
 * @since 1.0.0
 */
export const NonEmptyAlternative: nonEmptyAlternative.NonEmptyAlternative<IdentityTypeLambda> = {
  ...Covariant,
  ...NonEmptyCoproduct
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
 * @category folding
 * @since 1.0.0
 */
export const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (self: Identity<A>) => M =
  foldable
    .foldMap(Foldable)

/**
 * @category conversions
 * @since 1.0.0
 */
export const toReadonlyArray: <A>(
  self: Identity<A>
) => ReadonlyArray<A> = foldable.toReadonlyArray(Foldable)

/**
 * @category conversions
 * @since 1.0.0
 */
export const toReadonlyArrayWith: <A, B>(
  f: (a: A) => B
) => (self: Identity<A>) => ReadonlyArray<B> = foldable.toReadonlyArrayWith(Foldable)

/**
 * @category folding
 * @since 1.0.0
 */
export const reduceKind: <G extends TypeLambda>(
  G: monad.Monad<G>
) => <B, A, R, O, E>(
  b: B,
  f: (b: B, a: A) => Kind<G, R, O, E, B>
) => (self: Identity<A>) => Kind<G, R, O, E, B> = foldable.reduceKind(Foldable)

/**
 * @category folding
 * @since 1.0.0
 */
export const reduceRightKind: <G extends TypeLambda>(
  G: monad.Monad<G>
) => <B, A, R, O, E>(
  b: B,
  f: (b: B, a: A) => Kind<G, R, O, E, B>
) => (self: Identity<A>) => Kind<G, R, O, E, B> = foldable.reduceRightKind(Foldable)

/**
 * @category folding
 * @since 1.0.0
 */
export const foldMapKind: <G extends TypeLambda>(
  G: coproduct.Coproduct<G>
) => <A, R, O, E, B>(
  f: (a: A) => Kind<G, R, O, E, B>
) => (self: Identity<A>) => Kind<G, R, O, E, B> = foldable.foldMapKind(Foldable)

/**
 * @category filtering
 * @since 1.0.0
 */
export const compact: <A>(foa: Identity<Identity<A>>) => Identity<A> = flatten

/**
 * @category traversing
 * @since 1.0.0
 */
export const traverse = <F extends TypeLambda>(
  F: applicative.Applicative<F>
) =>
  <A, R, O, E, B>(
    f: (a: A) => Kind<F, R, O, E, B>
  ) => (self: Identity<A>): Kind<F, R, O, E, Identity<B>> => f(self)

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
export const sequence: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <R, O, E, A>(fas: Identity<Kind<F, R, O, E, A>>) => Kind<F, R, O, E, Identity<A>> = traversable
  .sequence(Traversable)

/**
 * @category traversing
 * @since 1.0.0
 */
export const traverseTap: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B>(
  f: (a: A) => Kind<F, R, O, E, B>
) => (self: Identity<A>) => Kind<F, R, O, E, Identity<A>> = traversable
  .traverseTap(Traversable)
