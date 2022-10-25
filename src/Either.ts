/**
 * ```ts
 * type Either<E, A> = Left<E> | Right<A>
 * ```
 *
 * Represents a value of one of two possible types (a disjoint union).
 *
 * An instance of `Either` is either an instance of `Left` or `Right`.
 *
 * A common use of `Either` is as an alternative to `Option` for dealing with possible missing values. In this usage,
 * `None` is replaced with a `Left` which can contain useful information. `Right` takes the place of `Some`. Convention
 * dictates that `Left` is used for Left and `Right` is used for Right.
 *
 * @since 1.0.0
 */
import type { Kind, TypeLambda } from "@fp-ts/core/HKT"
import * as applicative from "@fp-ts/core/typeclass/Applicative"
import * as bicovariant from "@fp-ts/core/typeclass/Bicovariant"
import * as chainable from "@fp-ts/core/typeclass/Chainable"
import * as compactable from "@fp-ts/core/typeclass/Compactable"
import type * as coproduct_ from "@fp-ts/core/typeclass/Coproduct"
import * as covariant from "@fp-ts/core/typeclass/Covariant"
import * as filterable from "@fp-ts/core/typeclass/Filterable"
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
import * as semigroup from "@fp-ts/core/typeclass/Semigroup"
import * as traversable from "@fp-ts/core/typeclass/Traversable"
import { equals } from "@fp-ts/data/Equal"
import { identity, pipe } from "@fp-ts/data/Function"
import * as internal from "@fp-ts/data/internal/Common"
import * as either from "@fp-ts/data/internal/Either"
import type { Option } from "@fp-ts/data/Option"
import type { Predicate } from "@fp-ts/data/Predicate"
import type { Refinement } from "@fp-ts/data/Refinement"

/**
 * @category models
 * @since 1.0.0
 */
export interface Left<E> {
  readonly _tag: "Left"
  readonly left: E
}

/**
 * @category models
 * @since 1.0.0
 */
export interface Right<A> {
  readonly _tag: "Right"
  readonly right: A
}

/**
 * @category models
 * @since 1.0.0
 */
export type Either<E, A> = Left<E> | Right<A>

/**
 * @category type lambdas
 * @since 1.0.0
 */
export interface EitherTypeLambda extends TypeLambda {
  readonly type: Either<this["Out1"], this["Target"]>
}

/**
 * @category type lambdas
 * @since 1.0.0
 */
export interface EitherTypeLambdaFix<E> extends TypeLambda {
  readonly type: Either<E, this["Out1"]>
}

/**
 * @category type lambdas
 * @since 1.0.0
 */
export interface ValidatedT<F extends TypeLambda, E> extends TypeLambda {
  readonly type: Kind<F, this["In"], this["Out2"], E, this["Target"]>
}

/**
 * Returns `true` if the specified value is an instance of `Either`, `false`
 * otherwise.
 *
 * @category guards
 * @since 1.0.0
 */
export const isEither: (u: unknown) => u is Either<unknown, unknown> = either.isEither

/**
 * Returns an effect whose Right is mapped by the specified `f` function.
 *
 * @category mapping
 * @since 1.0.0
 */
export const map = <A, B>(f: (a: A) => B) =>
  <E>(self: Either<E, A>): Either<E, B> => isRight(self) ? right(f(self.right)) : self

/**
 * @category mapping
 * @since 1.0.0
 */
export const imap: <A, B>(
  to: (a: A) => B,
  from: (b: B) => A
) => <E>(self: Either<E, A>) => Either<E, B> = covariant.imap<EitherTypeLambda>(map)

/**
 * @category instances
 * @since 1.0.0
 */
export const Invariant: invariant.Invariant<EitherTypeLambda> = {
  imap
}

/**
 * @since 1.0.0
 */
export const tupled: <E, A>(self: Either<E, A>) => Either<E, readonly [A]> = invariant.tupled(
  Invariant
)

/**
 * @category do notation
 * @since 1.0.0
 */
export const bindTo: <N extends string>(
  name: N
) => <E, A>(self: Either<E, A>) => Either<E, { readonly [K in N]: A }> = invariant.bindTo(Invariant)

/**
 * @category instances
 * @since 1.0.0
 */
export const Covariant: covariant.Covariant<EitherTypeLambda> = {
  ...Invariant,
  map
}

/**
 * @category mapping
 * @since 1.0.0
 */
export const flap: <A>(a: A) => <E, B>(fab: Either<E, (a: A) => B>) => Either<E, B> = covariant
  .flap(
    Covariant
  )

/**
 * Maps the Right value of this effect to the specified constant value.
 *
 * @category mapping
 * @since 1.0.0
 */
export const as: <B>(b: B) => <E>(self: Either<E, unknown>) => Either<E, B> = covariant.as(
  Covariant
)

/**
 * Returns the effect Eithering from mapping the Right of this effect to unit.
 *
 * @category mapping
 * @since 1.0.0
 */
export const asUnit = covariant.asUnit(Covariant)

const let_: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => <E>(
  self: Either<E, A>
) => Either<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }> = covariant.let(
  Covariant
)

export { let_ as let }

/**
 * Returns an effect whose Left and Right channels have been mapped by
 * the specified pair of functions, `f` and `g`.
 *
 * @category mapping
 * @since 1.0.0
 */
export const bimap = <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => (self: Either<E, A>): Either<G, B> => isLeft(self) ? left(f(self.left)) : right(g(self.right))

/**
 * @category instances
 * @since 1.0.0
 */
export const Bicovariant: bicovariant.Bicovariant<EitherTypeLambda> = {
  bimap
}

/**
 * Returns an effect with its error channel mapped using the specified
 * function. This can be used to lift a "smaller" error into a "larger" error.
 *
 * @category error handling
 * @since 1.0.0
 */
export const mapLeft: <E, G>(f: (e: E) => G) => <A>(self: Either<E, A>) => Either<G, A> =
  bicovariant
    .mapLeft(Bicovariant)

/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a Rightful value due to the right bias
 * of this structure.
 *
 * @category constructors
 * @since 1.0.0
 */
export const right: <A>(a: A) => Either<never, A> = either.right

export const of: <A>(a: A) => Either<never, A> = right

/**
 * @category instances
 * @since 1.0.0
 */
export const Of: of_.Of<EitherTypeLambda> = {
  of
}

/**
 * @since 1.0.0
 */
export const unit: Either<never, void> = of_.unit(Of)

/**
 * @category do notation
 * @since 1.0.0
 */
export const Do: Either<never, {}> = of_.Do(Of)

/**
 * @category instances
 * @since 1.0.0
 */
export const Pointed: pointed.Pointed<EitherTypeLambda> = {
  ...Of,
  ...Covariant
}

/**
 * @since 1.0.0
 */
export const flatMap = <A, E2, B>(
  f: (a: A) => Either<E2, B>
) => <E1>(self: Either<E1, A>): Either<E1 | E2, B> => isLeft(self) ? self : f(self.right)

/**
 * @category instances
 * @since 1.0.0
 */
export const FlatMap: flatMap_.FlatMap<EitherTypeLambda> = {
  flatMap
}

/**
 * @since 1.0.0
 */
export const flatten: <E1, E2, A>(mma: Either<E1, Either<E2, A>>) => Either<E1 | E2, A> = flatMap_
  .flatten(FlatMap)

/**
 * @since 1.0.0
 */
export const andThen: <E2, B>(
  that: Either<E2, B>
) => <E1, _>(self: Either<E1, _>) => Either<E2 | E1, B> = flatMap_
  .andThen(FlatMap)

/**
 * @since 1.0.0
 */
export const composeKleisliArrow: <B, E2, C>(
  bfc: (b: B) => Either<E2, C>
) => <A, E1>(afb: (a: A) => Either<E1, B>) => (a: A) => Either<E2 | E1, C> = flatMap_
  .composeKleisliArrow(FlatMap)

/**
 * @category instances
 * @since 1.0.0
 */
export const Chainable: chainable.Chainable<EitherTypeLambda> = {
  ...FlatMap,
  ...Covariant
}

/**
 * @category do notation
 * @since 1.0.0
 */
export const bind: <N extends string, A extends object, E2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Either<E2, B>
) => <E1>(
  self: Either<E1, A>
) => Either<E1 | E2, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }> = chainable
  .bind(Chainable)

/**
 * Returns an effect that effectfully "peeks" at the success of this effect.
 *
 * @since 1.0.0
 */
export const tap: <A, E2, _>(
  f: (a: A) => Either<E2, _>
) => <E1>(self: Either<E1, A>) => Either<E2 | E1, A> = chainable.tap(
  Chainable
)

/**
 * Sequences the specified effect after this effect, but ignores the value
 * produced by the effect.
 *
 * @category sequencing
 * @since 1.0.0
 */
export const andThenDiscard = chainable
  .andThenDiscard(Chainable)

/**
 * @category instances
 * @since 1.0.0
 */
export const Monad: monad.Monad<EitherTypeLambda> = {
  ...Pointed,
  ...FlatMap
}

/**
 * @since 1.0.0
 */
export const product = <E2, B>(
  that: Either<E2, B>
) =>
  <E1, A>(self: Either<E1, A>): Either<E2 | E1, readonly [A, B]> =>
    isRight(self) ? (isRight(that) ? right([self.right, that.right]) : that) : self

/**
 * @since 1.0.0
 */
export const productMany = <E, A>(
  collection: Iterable<Either<E, A>>
) =>
  (self: Either<E, A>): Either<E, [A, ...Array<A>]> => {
    if (isLeft(self)) {
      return self
    }
    const out: [A, ...Array<A>] = [self.right]
    for (const e of collection) {
      if (isLeft(e)) {
        return e
      }
      out.push(e.right)
    }
    return right(out)
  }

/**
 * @category instances
 * @since 1.0.0
 */
export const NonEmptyProduct: nonEmptyProduct.NonEmptyProduct<EitherTypeLambda> = {
  ...Invariant,
  product,
  productMany
}

/**
 * A variant of `bind` that sequentially ignores the scope.
 *
 * @category do notation
 * @since 1.0.0
 */
export const bindEither: <N extends string, A extends object, E2, B>(
  name: Exclude<N, keyof A>,
  fb: Either<E2, B>
) => <E1>(
  self: Either<E1, A>
) => Either<E2 | E1, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }> =
  nonEmptyProduct.bindKind(NonEmptyProduct)

/**
 * @since 1.0.0
 */
export const productFlatten: <E2, B>(
  that: Either<E2, B>
) => <E1, A extends ReadonlyArray<any>>(
  self: Either<E1, A>
) => Either<E2 | E1, readonly [...A, B]> = nonEmptyProduct
  .productFlatten(NonEmptyProduct)

/**
 * @since 1.0.0
 */
export const productAll = <E, A>(
  collection: Iterable<Either<E, A>>
): Either<E, ReadonlyArray<A>> => {
  const out: Array<A> = []
  for (const e of collection) {
    if (isLeft(e)) {
      return e
    }
    out.push(e.right)
  }
  return right(out)
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Product: product_.Product<EitherTypeLambda> = {
  ...Of,
  ...NonEmptyProduct,
  productAll
}

/**
 * @since 1.0.0
 */
export const tuple: <T extends ReadonlyArray<Either<any, any>>>(
  ...tuple: T
) => Either<
  [T[number]] extends [Either<infer E, any>] ? E : never,
  Readonly<{ [I in keyof T]: [T[I]] extends [Either<any, infer A>] ? A : never }>
> = product_
  .tuple(Product)

/**
 * @since 1.0.0
 */
export const struct: <R extends Record<string, Either<any, any>>>(
  r: R
) => Either<
  [R[keyof R]] extends [Either<infer E, any>] ? E : never,
  { readonly [K in keyof R]: [R[K]] extends [Either<any, infer A>] ? A : never }
> = product_
  .struct(Product)

/**
 * @category instances
 * @since 1.0.0
 */
export const NonEmptyApplicative: nonEmptyApplicative.NonEmptyApplicative<EitherTypeLambda> = {
  ...NonEmptyProduct,
  ...Covariant
}

/**
 * @category lifting
 * @since 1.0.0
 */
export const liftSemigroup = <A>(S: Semigroup<A>) =>
  <E>(): Semigroup<Either<E, A>> =>
    semigroup.fromCombine((that) =>
      (self) =>
        isLeft(that) ?
          self :
          isLeft(self) ?
          that :
          right(S.combine(that.right)(self.right))
    )

/**
 * @category lifting
 * @since 1.0.0
 */
export const lift2: <A, B, C>(
  f: (a: A, b: B) => C
) => <E1, E2>(fa: Either<E1, A>, fb: Either<E2, B>) => Either<E1 | E2, C> = nonEmptyApplicative
  .lift2(NonEmptyApplicative)

/**
 * @category lifting
 * @since 1.0.0
 */
export const lift3: <A, B, C, D>(
  f: (a: A, b: B, c: C) => D
) => <E1, E2, E3>(
  fa: Either<E1, A>,
  fb: Either<E2, B>,
  fc: Either<E3, C>
) => Either<E1 | E2 | E3, D> = nonEmptyApplicative.lift3(
  NonEmptyApplicative
)

/**
 * @since 1.0.0
 */
export const ap: <E2, A>(
  fa: Either<E2, A>
) => <E1, B>(self: Either<E1, (a: A) => B>) => Either<E2 | E1, B> = nonEmptyApplicative.ap(
  NonEmptyApplicative
)

/**
 * @category instances
 * @since 1.0.0
 */
export const Applicative: applicative.Applicative<EitherTypeLambda> = {
  ...NonEmptyApplicative,
  ...Product
}

/**
 * @since 1.0.0
 */
export const liftMonoid: <A, E>(M: Monoid<A>) => Monoid<Either<E, A>> = applicative
  .liftMonoid(
    Applicative
  )

/**
 * @since 1.0.0
 */
export const coproduct = <E2, B>(that: Either<E2, B>) =>
  <E1, A>(self: Either<E1, A>): Either<E2 | E1, B | A> => isRight(self) ? self : that

/**
 * @since 1.0.0
 */
export const coproductMany = <E, A>(collection: Iterable<Either<E, A>>) =>
  (self: Either<E, A>): Either<E, A> => {
    let out = self
    if (isRight(out)) {
      return out
    }
    for (out of collection) {
      if (isRight(out)) {
        return out
      }
    }
    return out
  }

/**
 * @category instances
 * @since 1.0.0
 */
export const NonEmptyCoproduct: nonEmptyCoproduct.NonEmptyCoproduct<EitherTypeLambda> = {
  ...Invariant,
  coproduct,
  coproductMany
}

/**
 * @since 1.0.0
 */
export const getSemigroup: <A>() => Semigroup<Either<never, A>> = nonEmptyCoproduct.getSemigroup(
  NonEmptyCoproduct
)

/**
 * @since 1.0.0
 */
export const coproductEither: <E2, B>(
  that: Either<E2, B>
) => <E1, A>(self: Either<E1, A>) => Either<E2 | E1, Either<A, B>> = nonEmptyCoproduct
  .coproductEither(NonEmptyCoproduct)

/**
 * @category instances
 * @since 1.0.0
 */
export const NonEmptyAlternative: nonEmptyAlternative.NonEmptyAlternative<EitherTypeLambda> = {
  ...Covariant,
  ...NonEmptyCoproduct
}

/**
 * @category folding
 * @since 1.0.0
 */
export const reduce = <B, A>(b: B, f: (b: B, a: A) => B) =>
  <E>(self: Either<E, A>): B => isLeft(self) ? b : f(b, self.right)

/**
 * @category folding
 * @since 1.0.0
 */
export const reduceRight = <B, A>(b: B, f: (b: B, a: A) => B) =>
  <E>(self: Either<E, A>): B => isLeft(self) ? b : f(b, self.right)

/**
 * @category instances
 * @since 1.0.0
 */
export const Foldable: foldable.Foldable<EitherTypeLambda> = {
  reduce,
  reduceRight
}

/**
 * @category folding
 * @since 1.0.0
 */
export const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => <E>(self: Either<E, A>) => M =
  foldable
    .foldMap(Foldable)

/**
 * @category conversions
 * @since 1.0.0
 */
export const toReadonlyArray: <E, A>(self: Either<E, A>) => ReadonlyArray<A> = foldable
  .toReadonlyArray(
    Foldable
  )

/**
 * @category conversions
 * @since 1.0.0
 */
export const toReadonlyArrayWith: <A, B>(
  f: (a: A) => B
) => <E>(self: Either<E, A>) => ReadonlyArray<B> = foldable.toReadonlyArrayWith(Foldable)

/**
 * @category folding
 * @since 1.0.0
 */
export const reduceKind: <G extends TypeLambda>(
  G: monad.Monad<G>
) => <B, A, R, O, E>(
  b: B,
  f: (b: B, a: A) => Kind<G, R, O, E, B>
) => <TE>(self: Either<TE, A>) => Kind<G, R, O, E, B> = foldable.reduceKind(Foldable)

/**
 * @category folding
 * @since 1.0.0
 */
export const reduceRightKind: <G extends TypeLambda>(
  G: monad.Monad<G>
) => <B, A, R, O, E>(
  b: B,
  f: (b: B, a: A) => Kind<G, R, O, E, B>
) => <TE>(self: Either<TE, A>) => Kind<G, R, O, E, B> = foldable.reduceRightKind(Foldable)

/**
 * @category folding
 * @since 1.0.0
 */
export const foldMapKind: <G extends TypeLambda>(
  G: coproduct_.Coproduct<G>
) => <A, R, O, E, B>(
  f: (a: A) => Kind<G, R, O, E, B>
) => <TE>(self: Either<TE, A>) => Kind<G, R, O, E, B> = foldable.foldMapKind(Foldable)

/**
 * Returns `true` if the either is an instance of `Left`, `false` otherwise.
 *
 * @category refinements
 * @since 1.0.0
 */
export const isLeft: <E, A>(self: Either<E, A>) => self is Left<E> = either.isLeft

/**
 * Returns `true` if the either is an instance of `Right`, `false` otherwise.
 *
 * @category refinements
 * @since 1.0.0
 */
export const isRight: <E, A>(self: Either<E, A>) => self is Right<A> = either.isRight

/**
 * Constructs a new `Either` holding a `Left` value. This usually represents a Left, due to the right-bias of this
 * structure.
 *
 * @category constructors
 * @since 1.0.0
 */
export const left: <E>(e: E) => Either<E, never> = either.left

// -------------------------------------------------------------------------------------
// pattern matching
// -------------------------------------------------------------------------------------

/**
 * Takes two functions and an `Either` value, if the value is a `Left` the inner value is applied to the first function,
 * if the value is a `Right` the inner value is applied to the second function.
 *
 * @example
 * import * as E from '@fp-ts/data/Either'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * const onError  = (errors: ReadonlyArray<string>): string => `Errors: ${errors.join(', ')}`
 *
 * const onRight = (value: number): string => `Ok: ${value}`
 *
 * assert.strictEqual(
 *   pipe(
 *     E.right(1),
 *     E.match(onError , onRight)
 *   ),
 *   'Ok: 1'
 * )
 * assert.strictEqual(
 *   pipe(
 *     E.left(['error 1', 'error 2']),
 *     E.match(onError , onRight)
 *   ),
 *   'Errors: error 1, error 2'
 * )
 *
 * @category pattern matching
 * @since 1.0.0
 */
export const match = <E, B, A, C = B>(onError: (e: E) => B, onRight: (a: A) => C) =>
  (self: Either<E, A>): B | C => isLeft(self) ? onError(self.left) : onRight(self.right)

/**
 * Returns the wrapped value if it's a `Right` or a default value if is a `Left`.
 *
 * @example
 * import * as E from '@fp-ts/data/Either'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(1),
 *     E.getOrElse(0)
 *   ),
 *   1
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.left('error'),
 *     E.getOrElse(0)
 *   ),
 *   0
 * )
 *
 * @category error handling
 * @since 1.0.0
 */
export const getOrElse = <B>(onError: B) =>
  <A>(self: Either<unknown, A>): A | B => isLeft(self) ? onError : self.right

/**
 * Takes a lazy default and a nullable value, if the value is not nully, turn it into a `Right`, if the value is nully use
 * the provided default as a `Left`.
 *
 * @example
 * import * as E from '@fp-ts/data/Either'
 *
 * const parse = E.fromNullable('nully')
 *
 * assert.deepStrictEqual(parse(1), E.right(1))
 * assert.deepStrictEqual(parse(null), E.left('nully'))
 *
 * @category conversions
 * @since 1.0.0
 */
export const fromNullable: <E>(onNullable: E) => <A>(a: A) => Either<E, NonNullable<A>> =
  either.fromNullable

/**
 * @category lifting
 * @since 1.0.0
 */
export const liftNullable = <A extends ReadonlyArray<unknown>, B, E>(
  f: (...a: A) => B | null | undefined,
  onNullable: E
) => {
  const from = fromNullable(onNullable)
  return (...a: A): Either<E, NonNullable<B>> => from(f(...a))
}

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapNullable = <A, B, E2>(
  f: (a: A) => B | null | undefined,
  onNullable: E2
): (<E1>(self: Either<E1, A>) => Either<E1 | E2, NonNullable<B>>) =>
  flatMap(liftNullable(f, onNullable))

/**
 * Constructs a new `Either` from a function that might throw.
 *
 * @example
 * import * as E from '@fp-ts/data/Either'
 * import { identity } from '@fp-ts/data/Function'
 *
 * const unsafeHead = <A>(as: ReadonlyArray<A>): A => {
 *   if (as.length > 0) {
 *     return as[0]
 *   } else {
 *     throw new Error('empty array')
 *   }
 * }
 *
 * const head = <A>(as: ReadonlyArray<A>): E.Either<unknown, A> =>
 *   E.fromThrowable(() => unsafeHead(as), identity)
 *
 * assert.deepStrictEqual(head([]), E.left(new Error('empty array')))
 * assert.deepStrictEqual(head([1, 2, 3]), E.right(1))
 *
 * @see {@link liftThrowable}
 * @category interop
 * @since 1.0.0
 */
export const fromThrowable = <A, E>(f: () => A, onThrow: (error: unknown) => E): Either<E, A> => {
  try {
    return right(f())
  } catch (e) {
    return left(onThrow(e))
  }
}

/**
 * Lifts a function that may throw to one returning a `Either`.
 *
 * @category interop
 * @since 1.0.0
 */
export const liftThrowable = <A extends ReadonlyArray<unknown>, B, E>(
  f: (...a: A) => B,
  onThrow: (error: unknown) => E
): ((...a: A) => Either<E, B>) => (...a) => fromThrowable(() => f(...a), onThrow)

/**
 * @category conversions
 * @since 1.0.0
 */
export const toUnion: <E, A>(fa: Either<E, A>) => E | A = match(identity, identity)

/**
 * @since 1.0.0
 */
export const reverse = <E, A>(ma: Either<E, A>): Either<A, E> =>
  isLeft(ma) ? right(ma.left) : left(ma.right)

/**
 * Recovers from all errors.
 *
 * @category error handling
 * @since 1.0.0
 */
export const catchAll: <E1, E2, B>(
  onError: (e: E1) => Either<E2, B>
) => <A>(self: Either<E1, A>) => Either<E2, A | B> = (onError) =>
  (self) => isLeft(self) ? onError(self.left) : self

/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `Either` returns the left-most non-`Left` value (or the right-most `Left` value if both values are `Left`).
 *
 * | x          | y          | pipe(x, orElse(y) |
 * | ---------- | ---------- | ------------------|
 * | left(a)    | left(b)    | left(b)           |
 * | left(a)    | right(2)   | right(2)          |
 * | right(1)   | left(b)    | right(1)          |
 * | right(1)   | right(2)   | right(1)          |
 *
 * @example
 * import * as E from '@fp-ts/data/Either'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     E.left('a'),
 *     E.orElse(E.left('b'))
 *   ),
 *   E.left('b')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.left('a'),
 *     E.orElse(E.right(2))
 *   ),
 *   E.right(2)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(1),
 *     E.orElse(E.left('b'))
 *   ),
 *   E.right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(1),
 *     E.orElse(E.right(2))
 *   ),
 *   E.right(1)
 * )
 *
 * @category error handling
 * @since 1.0.0
 */
export const orElse: <E2, B>(
  that: Either<E2, B>
) => <E1, A>(self: Either<E1, A>) => Either<E2, A | B> = (that) => (fa) => isLeft(fa) ? that : fa

/**
 * @category filtering
 * @since 1.0.0
 */
export const compact: <E>(onNone: E) => <A>(self: Either<E, Option<A>>) => Either<E, A> = (e) =>
  (self) => isLeft(self) ? self : internal.isNone(self.right) ? left(e) : right(self.right.value)

/**
 * @category instances
 * @since 1.0.0
 */
export const getCompactable = <E>(
  onNone: E
): compactable.Compactable<ValidatedT<EitherTypeLambda, E>> => {
  return {
    compact: compact(onNone)
  }
}

/**
 * @category filtering
 * @since 1.0.0
 */
export const separate: <E>(
  onEmpty: E
) => <A, B>(self: Either<E, Either<A, B>>) => readonly [Either<E, A>, Either<E, B>] = (onEmpty) =>
  compactable.separate({ ...Covariant, ...getCompactable(onEmpty) })

/**
 * @category filtering
 * @since 1.0.0
 */
export const filter: {
  <C extends A, B extends A, E2, A = C>(refinement: Refinement<A, B>, onFalse: E2): <E1>(
    self: Either<E1, C>
  ) => Either<E2 | E1, B>
  <B extends A, E2, A = B>(
    predicate: Predicate<A>,
    onFalse: E2
  ): <E1>(self: Either<E1, B>) => Either<E2 | E1, B>
} = <B extends A, E2, A = B>(
  predicate: Predicate<A>,
  onFalse: E2
) => filterable.filter(getFilterable(onFalse))(predicate)

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterMap = <A, B, E>(
  f: (a: A) => Option<B>,
  onNone: E
) =>
  (self: Either<E, A>): Either<E, B> =>
    pipe(
      self,
      flatMap((a) => {
        const ob = f(a)
        return internal.isNone(ob) ? left(onNone) : right(ob.value)
      })
    )

/**
 * @category filtering
 * @since 1.0.0
 */
export const partition: {
  <C extends A, B extends A, E, A = C>(refinement: Refinement<A, B>, onFalse: E): (
    self: Either<E, C>
  ) => readonly [Either<E, C>, Either<E, B>]
  <B extends A, E, A = B>(predicate: Predicate<A>, onFalse: E): (
    self: Either<E, B>
  ) => readonly [Either<E, B>, Either<E, B>]
} = <B extends A, E, A = B>(predicate: Predicate<A>, onFalse: E) =>
  filterable.partition(getFilterable(onFalse))(predicate)

/**
 * @category filtering
 * @since 1.0.0
 */
export const partitionMap = <A, B, C, E>(
  f: (a: A) => Either<B, C>,
  onEmpty: E
): (self: Either<E, A>) => readonly [Either<E, B>, Either<E, C>] =>
  filterable.partitionMap(getFilterable(onEmpty))(f)

/**
 * @category instances
 * @since 1.0.0
 */
export const getFilterable = <E>(
  onEmpty: E
): filterable.Filterable<ValidatedT<EitherTypeLambda, E>> => {
  return {
    filterMap: (f) => filterMap(f, onEmpty)
  }
}

/**
 * @category traversing
 * @since 1.0.0
 */
export const traverse = <F extends TypeLambda>(F: applicative.Applicative<F>) =>
  <A, FR, FO, FE, B>(f: (a: A) => Kind<F, FR, FO, FE, B>) =>
    <E>(ta: Either<E, A>): Kind<F, FR, FO, FE, Either<E, B>> =>
      isLeft(ta) ?
        F.of<Either<E, B>>(left(ta.left)) :
        pipe(f(ta.right), F.map<B, Either<E, B>>(right))

/**
 * @category instances
 * @since 1.0.0
 */
export const Traversable: traversable.Traversable<EitherTypeLambda> = {
  traverse
}

/**
 * @category traversing
 * @since 1.0.0
 */
export const sequence: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <E, FR, FO, FE, A>(
  fa: Either<E, Kind<F, FR, FO, FE, A>>
) => Kind<F, FR, FO, FE, Either<E, A>> = traversable.sequence(Traversable)

/**
 * @category traversing
 * @since 1.0.0
 */
export const traverseTap: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B>(
  f: (a: A) => Kind<F, R, O, E, B>
) => <TE>(self: Either<TE, A>) => Kind<F, R, O, E, Either<TE, A>> = traversable
  .traverseTap(Traversable)

/**
 * Returns an effect that effectfully "peeks" at the Left of this effect.
 *
 * @category error handling
 * @since 1.0.0
 */
export const tapError: <E1, E2>(
  onError: (e: E1) => Either<E2, unknown>
) => <A>(self: Either<E1, A>) => Either<E1 | E2, A> = (onError) =>
  (self) => {
    if (isRight(self)) {
      return self
    }
    const out = onError(self.left)
    return isLeft(out) ? out : self
  }

/**
 * @example
 * import * as E from '@fp-ts/data/Either'
 * import { pipe } from '@fp-ts/data/Function'
 * import * as O from '@fp-ts/data/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     O.some(1),
 *     E.fromOption('error')
 *   ),
 *   E.right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     O.none,
 *     E.fromOption('error')
 *   ),
 *   E.left('error')
 * )
 *
 * @category conversions
 * @since 1.0.0
 */
export const fromOption: <E>(onNone: E) => <A>(fa: Option<A>) => Either<E, A> = either.fromOption

/**
 * Converts a `Either` to an `Option` discarding the Right.
 *
 * @example
 * import * as O from '@fp-ts/data/Option'
 * import * as E from '@fp-ts/data/Either'
 *
 * assert.deepStrictEqual(E.getLeft(E.right('ok')), O.none)
 * assert.deepStrictEqual(E.getLeft(E.left('err')), O.some('err'))
 *
 * @category conversions
 * @since 1.0.0
 */
export const getLeft: <E, A>(self: Either<E, A>) => Option<E> = either.getLeft

/**
 * Converts a `Either` to an `Option` discarding the error.
 *
 * @example
 * import * as O from '@fp-ts/data/Option'
 * import * as E from '@fp-ts/data/Either'
 *
 * assert.deepStrictEqual(E.getRight(E.right('ok')), O.some('ok'))
 * assert.deepStrictEqual(E.getRight(E.left('err')), O.none)
 *
 * @category conversions
 * @since 1.0.0
 */
export const getRight: <E, A>(self: Either<E, A>) => Option<A> = either.getRight

/**
 * @category conversions
 * @since 1.0.0
 */
export const toNull: <E, A>(self: Either<E, A>) => A | null = getOrElse(null)

/**
 * @category conversions
 * @since 1.0.0
 */
export const toUndefined: <E, A>(self: Either<E, A>) => A | undefined = getOrElse(undefined)

/**
 * @example
 * import { liftPredicate, left, right } from '@fp-ts/data/Either'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     1,
 *     liftPredicate((n) => n > 0, 'error')
 *   ),
 *   right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     -1,
 *     liftPredicate((n) => n > 0, 'error')
 *   ),
 *   left('error')
 * )
 *
 * @category lifting
 * @since 1.0.0
 */
export const liftPredicate: {
  <C extends A, B extends A, E, A = C>(
    refinement: Refinement<A, B>,
    onFalse: E
  ): (c: C) => Either<E, B>
  <B extends A, E, A = B>(predicate: Predicate<A>, onFalse: E): (b: B) => Either<E, B>
} = <B extends A, E, A = B>(predicate: Predicate<A>, onFalse: E) =>
  (b: B) => predicate(b) ? right(b) : left(onFalse)

/**
 * @category lifting
 * @since 1.0.0
 */
export const liftOption = <A extends ReadonlyArray<unknown>, B, E>(
  f: (...a: A) => Option<B>,
  onNone: E
) => (...a: A): Either<E, B> => fromOption(onNone)(f(...a))

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapOption = <A, B, E2>(
  f: (a: A) => Option<B>,
  onNone: E2
) => <E1>(self: Either<E1, A>): Either<E2 | E1, B> => pipe(self, flatMap(liftOption(f, onNone)))

/**
 * Tests whether a value is a member of a `Either`.
 *
 * @since 1.0.0
 */
export const elem = <B>(a: B) =>
  <A, E>(ma: Either<E, A>): boolean => isLeft(ma) ? false : equals(ma.right)(a)

/**
 * Returns `false` if `Left` or returns the Either of the application of the given predicate to the `Right` value.
 *
 * @example
 * import * as E from '@fp-ts/data/Either'
 *
 * const f = E.exists((n: number) => n > 2)
 *
 * assert.strictEqual(f(E.left('a')), false)
 * assert.strictEqual(f(E.right(1)), false)
 * assert.strictEqual(f(E.right(3)), true)
 *
 * @since 1.0.0
 */
export const exists = <A>(predicate: Predicate<A>) =>
  (ma: Either<unknown, A>): boolean => isLeft(ma) ? false : predicate(ma.right)
