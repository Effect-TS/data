/**
 * ```ts
 * type Option<A> = None | Some<A>
 * ```
 *
 * `Option<A>` is a container for an optional value of type `A`. If the value of type `A` is present, the `Option<A>` is
 * an instance of `Some<A>`, containing the present value of type `A`. If the value is absent, the `Option<A>` is an
 * instance of `None`.
 *
 * An option could be looked at as a collection or foldable structure with either one or zero elements.
 * Another way to look at `Option` is: it represents the effect of a possibly failing computation.
 *
 * @since 1.0.0
 */
import type { Kind, TypeLambda } from "@fp-ts/core/HKT"
import type * as alternative from "@fp-ts/core/typeclass/Alternative"
import * as applicative from "@fp-ts/core/typeclass/Applicative"
import * as chainable from "@fp-ts/core/typeclass/Chainable"
import * as compactable from "@fp-ts/core/typeclass/Compactable"
import * as coproduct from "@fp-ts/core/typeclass/Coproduct"
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
import * as of from "@fp-ts/core/typeclass/Of"
import type { Order } from "@fp-ts/core/typeclass/Order"
import * as order from "@fp-ts/core/typeclass/Order"
import type * as pointed from "@fp-ts/core/typeclass/Pointed"
import * as product_ from "@fp-ts/core/typeclass/Product"
import type { Semigroup } from "@fp-ts/core/typeclass/Semigroup"
import * as traversable from "@fp-ts/core/typeclass/Traversable"
import * as traversableFilterable from "@fp-ts/core/typeclass/TraversableFilterable"
import type { Either } from "@fp-ts/data/Either"
import { equals } from "@fp-ts/data/Equal"
import type { LazyArg } from "@fp-ts/data/Function"
import { flow, identity, pipe, SK } from "@fp-ts/data/Function"
import * as internal from "@fp-ts/data/internal/Common"
import * as either from "@fp-ts/data/internal/Either"
import type { NonEmptyReadonlyArray } from "@fp-ts/data/NonEmptyReadonlyArray"
import type { Predicate } from "@fp-ts/data/Predicate"
import type { Refinement } from "@fp-ts/data/Refinement"

/**
 * @category models
 * @since 1.0.0
 */
export interface None {
  readonly _tag: "None"
}

/**
 * @category models
 * @since 1.0.0
 */
export interface Some<A> {
  readonly _tag: "Some"
  readonly value: A
}

/**
 * @category models
 * @since 1.0.0
 */
export type Option<A> = None | Some<A>

/**
 * @category type lambdas
 * @since 1.0.0
 */
export interface OptionTypeLambda extends TypeLambda {
  readonly type: Option<this["Target"]>
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const some: <A>(a: A) => Option<A> = internal.some

/**
 * Returns `true` if the specified value is an instance of `Option`, `false`
 * otherwise.
 *
 * @example
 * import { some, none, isOption } from '@fp-ts/data/Option'
 *
 * assert.strictEqual(isOption(some(1)), true)
 * assert.strictEqual(isOption(none), true)
 * assert.strictEqual(isOption({}), false)
 *
 * @category guards
 * @since 1.0.0
 */
export const isOption: (u: unknown) => u is Option<unknown> = internal.isOption

/**
 * Returns an effect whose success is mapped by the specified `f` function.
 *
 * @category mapping
 * @since 1.0.0
 */
export const map = <A, B>(f: (a: A) => B) =>
  (self: Option<A>): Option<B> => isNone(self) ? none : some(f(self.value))

/**
 * @category instances
 * @since 1.0.0
 */
export const Invariant: invariant.Invariant<OptionTypeLambda> = {
  imap: covariant.imap<OptionTypeLambda>(map)
}

/**
 * @since 1.0.0
 */
export const tupled: <A>(self: Option<A>) => Option<readonly [A]> = invariant.tupled(Invariant)

/**
 * @category do notation
 * @since 1.0.0
 */
export const bindTo: <N extends string>(
  name: N
) => <A>(self: Option<A>) => Option<{ readonly [K in N]: A }> = invariant.bindTo(Invariant)

/**
 * @category instances
 * @since 1.0.0
 */
export const Covariant: covariant.Covariant<OptionTypeLambda> = {
  ...Invariant,
  map
}

const let_: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (self: Option<A>) => Option<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }> =
  covariant.let(Covariant)

export {
  /**
   * @category do notation
   * @since 1.0.0
   */
  let_ as let
}

/**
 * @category mapping
 * @since 1.0.0
 */
export const flap: <A>(a: A) => <B>(fab: Option<(a: A) => B>) => Option<B> = covariant.flap(
  Covariant
)

/**
 * Maps the success value of this effect to the specified constant value.
 *
 * @category mapping
 * @since 1.0.0
 */
export const as: <B>(b: B) => <_>(self: Option<_>) => Option<B> = covariant.as(Covariant)

/**
 * Returns the effect resulting from mapping the success of this effect to unit.
 *
 * @category mapping
 * @since 1.0.0
 */
export const asUnit: <_>(self: Option<_>) => Option<void> = covariant.asUnit(Covariant)

/**
 * @category instances
 * @since 1.0.0
 */
export const Of: of.Of<OptionTypeLambda> = {
  of: some
}

/**
 * @since 1.0.0
 */
export const unit: Option<void> = of.unit(Of)

/**
 * @category do notation
 * @since 1.0.0
 */
export const Do: Option<{}> = of.Do(Of)

/**
 * @category instances
 * @since 1.0.0
 */
export const Pointed: pointed.Pointed<OptionTypeLambda> = {
  ...Of,
  ...Covariant
}

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMap = <A, B>(f: (a: A) => Option<B>) =>
  (self: Option<A>): Option<B> => isNone(self) ? none : f(self.value)

/**
 * @category instances
 * @since 1.0.0
 */
export const FlatMap: flatMap_.FlatMap<OptionTypeLambda> = {
  flatMap
}

/**
 * @since 1.0.0
 */
export const flatten: <A>(self: Option<Option<A>>) => Option<A> = flatMap_
  .flatten(FlatMap)

/**
 * @since 1.0.0
 */
export const andThen: <B>(that: Option<B>) => <_>(self: Option<_>) => Option<B> = flatMap_
  .andThen(FlatMap)

/**
 * @since 1.0.0
 */
export const composeKleisliArrow: <B, C>(
  bfc: (b: B) => Option<C>
) => <A>(afb: (a: A) => Option<B>) => (a: A) => Option<C> = flatMap_
  .composeKleisliArrow(FlatMap)

/**
 * @category instances
 * @since 1.0.0
 */
export const Chainable: chainable.Chainable<OptionTypeLambda> = {
  ...FlatMap,
  ...Covariant
}

/**
 * @category do notation
 * @since 1.0.0
 */
export const bind: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Option<B>
) => (self: Option<A>) => Option<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }> =
  chainable.bind(Chainable)

/**
 * Returns an effect that effectfully "peeks" at the success of this effect.
 *
 * @since 1.0.0
 */
export const tap: <A, _>(f: (a: A) => Option<_>) => (self: Option<A>) => Option<A> = chainable.tap(
  Chainable
)

/**
 * Sequences the specified effect after this effect, but ignores the value
 * produced by the effect.
 *
 * @category sequencing
 * @since 1.0.0
 */
export const andThenDiscard: <_>(that: Option<_>) => <A>(self: Option<A>) => Option<A> = chainable
  .andThenDiscard(Chainable)

/**
 * @category instances
 * @since 1.0.0
 */
export const Monad: monad.Monad<OptionTypeLambda> = {
  ...Pointed,
  ...FlatMap
}

/**
 * @since 1.0.0
 */
export const product = <B>(
  that: Option<B>
) =>
  <A>(self: Option<A>): Option<readonly [A, B]> =>
    isSome(self) && isSome(that) ? some([self.value, that.value]) : none

/**
 * @category instances
 * @since 1.0.0
 */
export const NonEmptyProduct: nonEmptyProduct.NonEmptyProduct<OptionTypeLambda> = {
  ...Invariant,
  product,
  productMany: <A>(collection: Iterable<Option<A>>) =>
    (self: Option<A>): Option<readonly [A, ...Array<A>]> => {
      if (isNone(self)) {
        return none
      }
      const out: [A, ...Array<A>] = [self.value]
      for (const o of collection) {
        if (isNone(o)) {
          return none
        }
        out.push(o.value)
      }
      return some(out)
    }
}

/**
 * A variant of `bind` that sequentially ignores the scope.
 *
 * @category do notation
 * @since 1.0.0
 */
export const bindOption: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  fb: Option<B>
) => (self: Option<A>) => Option<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }> =
  nonEmptyProduct.bindKind(NonEmptyProduct)

/**
 * @since 1.0.0
 */
export const productFlatten: <B>(
  fb: Option<B>
) => <A extends ReadonlyArray<unknown>>(self: Option<A>) => Option<readonly [...A, B]> =
  nonEmptyProduct
    .productFlatten(NonEmptyProduct)

/**
 * @category instances
 * @since 1.0.0
 */
export const Product: product_.Product<OptionTypeLambda> = {
  ...Of,
  ...NonEmptyProduct,
  productAll: <A>(collection: Iterable<Option<A>>): Option<ReadonlyArray<A>> => {
    const out: Array<A> = []
    for (const o of collection) {
      if (isNone(o)) {
        return none
      }
      out.push(o.value)
    }
    return some(out)
  }
}

/**
 * @since 1.0.0
 */
export const tuple: <T extends ReadonlyArray<Option<any>>>(
  ...tuple: T
) => Option<Readonly<{ [I in keyof T]: [T[I]] extends [Option<infer A>] ? A : never }>> = product_
  .tuple(Product)

/**
 * @since 1.0.0
 */
export const struct: <R extends Record<string, Option<any>>>(
  r: R
) => Option<{ readonly [K in keyof R]: [R[K]] extends [Option<infer A>] ? A : never }> = product_
  .struct(Product)

/**
 * @category instances
 * @since 1.0.0
 */
export const NonEmptyApplicative: nonEmptyApplicative.NonEmptyApplicative<OptionTypeLambda> = {
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
 * import { liftSemigroup, some, none } from '@fp-ts/data/Option'
 * import * as N from '@fp-ts/data/Number'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * const M = liftSemigroup(N.SemigroupSum)
 * assert.deepStrictEqual(pipe(none, M.combine(none)), none)
 * assert.deepStrictEqual(pipe(some(1), M.combine(none)), some(1))
 * assert.deepStrictEqual(pipe(none, M.combine(some(1))), some(1))
 * assert.deepStrictEqual(pipe(some(1), M.combine(some(2))), some(3))
 *
 * @category lifting
 * @since 1.0.0
 */
export const liftSemigroup: <A>(S: Semigroup<A>) => Semigroup<Option<A>> = nonEmptyApplicative
  .liftSemigroup(NonEmptyApplicative)

/**
 * Lifts a binary function into `Option`.
 *
 * @category lifting
 * @since 1.0.0
 */
export const lift2: <A, B, C>(f: (a: A, b: B) => C) => (fa: Option<A>, fb: Option<B>) => Option<C> =
  nonEmptyApplicative.lift2(NonEmptyApplicative)

/**
 * Lifts a ternary function into `Option`.
 *
 * @category lifting
 * @since 1.0.0
 */
export const lift3: <A, B, C, D>(
  f: (a: A, b: B, c: C) => D
) => (fa: Option<A>, fb: Option<B>, fc: Option<C>) => Option<D> = nonEmptyApplicative.lift3(
  NonEmptyApplicative
)

/**
 * @since 1.0.0
 */
export const ap: <A>(
  fa: Option<A>
) => <B>(self: Option<(a: A) => B>) => Option<B> = nonEmptyApplicative.ap(
  NonEmptyApplicative
)

/**
 * @category instances
 * @since 1.0.0
 */
export const Applicative: applicative.Applicative<OptionTypeLambda> = {
  ...NonEmptyApplicative,
  ...Product
}

/**
 * @since 1.0.0
 */
export const liftMonoid: <A>(M: Monoid<A>) => Monoid<Option<A>> = applicative.liftMonoid(
  Applicative
)

/**
 * @category instances
 * @since 1.0.0
 */
export const NonEmptyCoproduct: nonEmptyCoproduct.NonEmptyCoproduct<OptionTypeLambda> = {
  ...Invariant,
  coproduct: (that) => (self) => isSome(self) ? self : that,
  coproductMany: (collection) =>
    (self) => {
      let out = self
      if (isSome(out)) {
        return out
      }
      for (out of collection) {
        if (isSome(out)) {
          return out
        }
      }
      return out
    }
}

/**
 * @since 1.0.0
 */
export const getSemigroup: <A>() => Semigroup<Option<A>> = nonEmptyCoproduct.getSemigroup(
  NonEmptyCoproduct
)

/**
 * @since 1.0.0
 */
export const coproductEither: <B>(that: Option<B>) => <A>(self: Option<A>) => Option<Either<A, B>> =
  nonEmptyCoproduct.coproductEither(NonEmptyCoproduct)

/**
 * @category instances
 * @since 1.0.0
 */
export const Coproduct: coproduct.Coproduct<OptionTypeLambda> = {
  ...NonEmptyCoproduct,
  zero: () => none,
  coproductAll: (collection) => {
    const options = internal.fromIterable(collection)
    if (internal.isNonEmpty(options)) {
      return NonEmptyCoproduct.coproductMany(internal.tail(options))(internal.head(options))
    }
    return none
  }
}

/**
 * @since 1.0.0
 */
export const getMonoid: <A>() => Monoid<Option<A>> = coproduct.getMonoid(Coproduct)

/**
 * @category instances
 * @since 1.0.0
 */
export const NonEmptyAlternative: nonEmptyAlternative.NonEmptyAlternative<OptionTypeLambda> = {
  ...Covariant,
  ...NonEmptyCoproduct
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Alternative: alternative.Alternative<OptionTypeLambda> = {
  ...NonEmptyAlternative,
  ...Coproduct
}

/**
 * @category folding
 * @since 1.0.0
 */
export const reduce = <B, A>(b: B, f: (b: B, a: A) => B) =>
  (self: Option<A>): B => isNone(self) ? b : f(b, self.value)

/**
 * @category folding
 * @since 1.0.0
 */
export const reduceRight = <B, A>(b: B, f: (b: B, a: A) => B) =>
  (self: Option<A>): B => isNone(self) ? b : f(b, self.value)

/**
 * @category instances
 * @since 1.0.0
 */
export const Foldable: foldable.Foldable<OptionTypeLambda> = {
  reduce,
  reduceRight
}

/**
 * @category folding
 * @since 1.0.0
 */
export const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (self: Option<A>) => M = foldable
  .foldMap(Foldable)

/**
 * @category conversions
 * @since 1.0.0
 */
export const toReadonlyArray: <A>(
  self: Option<A>
) => ReadonlyArray<A> = foldable.toReadonlyArray(Foldable)

/**
 * @category conversions
 * @since 1.0.0
 */
export const toReadonlyArrayWith: <A, B>(
  f: (a: A) => B
) => (self: Option<A>) => ReadonlyArray<B> = foldable.toReadonlyArrayWith(Foldable)

/**
 * @category folding
 * @since 1.0.0
 */
export const reduceKind: <G extends TypeLambda>(
  G: monad.Monad<G>
) => <B, A, R, O, E>(
  b: B,
  f: (b: B, a: A) => Kind<G, R, O, E, B>
) => (self: Option<A>) => Kind<G, R, O, E, B> = foldable.reduceKind(Foldable)

/**
 * @category folding
 * @since 1.0.0
 */
export const reduceRightKind: <G extends TypeLambda>(
  G: monad.Monad<G>
) => <B, A, R, O, E>(
  b: B,
  f: (b: B, a: A) => Kind<G, R, O, E, B>
) => (self: Option<A>) => Kind<G, R, O, E, B> = foldable.reduceRightKind(Foldable)

/**
 * @category folding
 * @since 1.0.0
 */
export const foldMapKind: <G extends TypeLambda>(
  G: coproduct.Coproduct<G>
) => <A, R, O, E, B>(
  f: (a: A) => Kind<G, R, O, E, B>
) => (self: Option<A>) => Kind<G, R, O, E, B> = foldable.foldMapKind(Foldable)

/**
 * @category filtering
 * @since 1.0.0
 */
export const compact: <A>(foa: Option<Option<A>>) => Option<A> = flatten

/**
 * @category instances
 * @since 1.0.0
 */
export const Compactable: compactable.Compactable<OptionTypeLambda> = {
  compact
}

/**
 * @category filtering
 * @since 1.0.0
 */
export const separate: <A, B>(self: Option<Either<A, B>>) => readonly [Option<A>, Option<B>] =
  compactable.separate({ ...Covariant, ...Compactable })

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterMap: <A, B>(f: (a: A) => Option<B>) => (fa: Option<A>) => Option<B> = (f) =>
  (fa) => isNone(fa) ? none : f(fa.value)

/**
 * @category instances
 * @since 1.0.0
 */
export const Filterable: filterable.Filterable<OptionTypeLambda> = {
  filterMap
}

/**
 * @category filtering
 * @since 1.0.0
 */
export const filter: {
  <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (fc: Option<C>) => Option<B>
  <B extends A, A = B>(predicate: Predicate<A>): (fb: Option<B>) => Option<B>
} = filterable.filter(Filterable)

/**
 * @category filtering
 * @since 1.0.0
 */
export const partition: {
  <C extends A, B extends A, A = C>(
    refinement: Refinement<A, B>
  ): (fc: Option<C>) => readonly [Option<C>, Option<B>]
  <B extends A, A = B>(predicate: Predicate<A>): (fb: Option<B>) => readonly [Option<B>, Option<B>]
} = filterable.partition(Filterable)

/**
 * @category filtering
 * @since 1.0.0
 */
export const partitionMap: <A, B, C>(
  f: (a: A) => Either<B, C>
) => (fa: Option<A>) => readonly [Option<B>, Option<C>] = filterable.partitionMap(Filterable)

/**
 * @category traversing
 * @since 1.0.0
 */
export const traverse = <F extends TypeLambda>(
  F: applicative.Applicative<F>
) =>
  <A, R, O, E, B>(
    f: (a: A) => Kind<F, R, O, E, B>
  ) =>
    (self: Option<A>): Kind<F, R, O, E, Option<B>> =>
      isNone(self) ? F.of<Option<B>>(none) : pipe(f(self.value), F.map(some))

/**
 * @category instances
 * @since 1.0.0
 */
export const Traversable: traversable.Traversable<OptionTypeLambda> = {
  traverse
}

/**
 * @category traversing
 * @since 1.0.0
 */
export const sequence: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <R, O, E, A>(fas: Option<Kind<F, R, O, E, A>>) => Kind<F, R, O, E, Option<A>> = traversable
  .sequence(Traversable)

/**
 * @category traversing
 * @since 1.0.0
 */
export const traverseTap: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B>(
  f: (a: A) => Kind<F, R, O, E, B>
) => (self: Option<A>) => Kind<F, R, O, E, Option<A>> = traversable
  .traverseTap(Traversable)

/**
 * @category filtering
 * @since 1.0.0
 */
export const traverseFilterMap: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B>(
  f: (a: A) => Kind<F, R, O, E, Option<B>>
) => (ta: Option<A>) => Kind<F, R, O, E, Option<B>> = traversableFilterable.traverseFilterMap(
  { ...Traversable, ...Compactable }
)

/**
 * @category filtering
 * @since 1.0.0
 */
export const traversePartitionMap: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B, C>(
  f: (a: A) => Kind<F, R, O, E, Either<B, C>>
) => (wa: Option<A>) => Kind<F, R, O, E, readonly [Option<B>, Option<C>]> = traversableFilterable
  .traversePartitionMap({ ...Traversable, ...Covariant, ...Compactable })

/**
 * @category instances
 * @since 1.0.0
 */
export const TraversableFilterable: traversableFilterable.TraversableFilterable<
  OptionTypeLambda
> = {
  traverseFilterMap,
  traversePartitionMap
}

/**
 * @category filtering
 * @since 1.0.0
 */
export const traverseFilter: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <B extends A, R, O, E, A = B>(
  predicate: (a: A) => Kind<F, R, O, E, boolean>
) => (self: Option<B>) => Kind<F, R, O, E, Option<B>> = traversableFilterable.traverseFilter(
  TraversableFilterable
)

/**
 * @category filtering
 * @since 1.0.0
 */
export const traversePartition: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <B extends A, R, O, E, A = B>(
  predicate: (a: A) => Kind<F, R, O, E, boolean>
) => (self: Option<B>) => Kind<F, R, O, E, readonly [Option<B>, Option<B>]> = traversableFilterable
  .traversePartition(TraversableFilterable)

/**
 * Returns `true` if the option is `None`, `false` otherwise.
 *
 * @example
 * import { some, none, isNone } from '@fp-ts/data/Option'
 *
 * assert.strictEqual(isNone(some(1)), false)
 * assert.strictEqual(isNone(none), true)
 *
 * @category refinements
 * @since 1.0.0
 */
export const isNone: <A>(self: Option<A>) => self is None = internal.isNone

/**
 * Returns `true` if the option is an instance of `Some`, `false` otherwise.
 *
 * @example
 * import { some, none, isSome } from '@fp-ts/data/Option'
 *
 * assert.strictEqual(isSome(some(1)), true)
 * assert.strictEqual(isSome(none), false)
 *
 * @category refinements
 * @since 1.0.0
 */
export const isSome: <A>(self: Option<A>) => self is Some<A> = internal.isSome

/**
 * `None` doesn't have a constructor, instead you can use it directly as a value. Represents a missing value.
 *
 * @category constructors
 * @since 1.0.0
 */
export const none: Option<never> = internal.none

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromIterable = <A>(collection: Iterable<A>): Option<A> => {
  for (const a of collection) {
    return some(a)
  }
  return none
}

/**
 * Converts a `Either` to an `Option` discarding the error.
 *
 * @example
 * import * as O from '@fp-ts/data/Option'
 * import * as E from '@fp-ts/data/Either'
 *
 * assert.deepStrictEqual(O.fromEither(E.right(1)), O.some(1))
 * assert.deepStrictEqual(O.fromEither(E.left('a')), O.none)
 *
 * @category conversions
 * @since 1.0.0
 */
export const fromEither: <E, A>(self: Either<E, A>) => Option<A> = either.getRight

/**
 * @category conversions
 * @since 1.0.0
 */
export const toEither: <E>(onNone: E) => <A>(self: Option<A>) => Either<E, A> = either.fromOption

/**
 * Takes a (lazy) default value, a function, and an `Option` value, if the `Option` value is `None` the default value is
 * returned, otherwise the function is applied to the value inside the `Some` and the result is returned.
 *
 * @example
 * import { some, none, match } from '@fp-ts/data/Option'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     match(() => 'a none', a => `a some containing ${a}`)
 *   ),
 *   'a some containing 1'
 * )
 *
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     match(() => 'a none', a => `a some containing ${a}`)
 *   ),
 *   'a none'
 * )
 *
 * @category pattern matching
 * @since 1.0.0
 */
export const match = <B, A, C = B>(onNone: LazyArg<B>, onSome: (a: A) => C) =>
  (ma: Option<A>): B | C => isNone(ma) ? onNone() : onSome(ma.value)

/**
 * Extracts the value out of the structure, if it exists. Otherwise returns the given default value
 *
 * @example
 * import { some, none, getOrElse } from '@fp-ts/data/Option'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     getOrElse(0)
 *   ),
 *   1
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     getOrElse(0)
 *   ),
 *   0
 * )
 *
 * @category error handling
 * @since 1.0.0
 */
export const getOrElse = <B>(onNone: B) =>
  <A>(self: Option<A>): A | B => isNone(self) ? onNone : self.value

/**
 * Converts an exception into an `Option`. If `f` throws, returns `None`, otherwise returns the output wrapped in a
 * `Some`.
 *
 * @example
 * import { none, some, fromThrowable } from '@fp-ts/data/Option'
 *
 * assert.deepStrictEqual(
 *   fromThrowable(() => {
 *     throw new Error()
 *   }),
 *   none
 * )
 * assert.deepStrictEqual(fromThrowable(() => 1), some(1))
 *
 * @category interop
 * @see {@link liftThrowable}
 * @since 1.0.0
 */
export const fromThrowable = <A>(f: () => A): Option<A> => {
  try {
    return some(f())
  } catch (e) {
    return none
  }
}

/**
 * Lifts a function that may throw to one returning a `Option`.
 *
 * @category interop
 * @since 1.0.0
 */
export const liftThrowable = <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => B
): ((...a: A) => Option<B>) => (...a) => fromThrowable(() => f(...a))

/**
 * Constructs a new `Option` from a nullable type. If the value is `null` or `undefined`, returns `None`, otherwise
 * returns the value wrapped in a `Some`.
 *
 * @example
 * import { none, some, fromNullable } from '@fp-ts/data/Option'
 *
 * assert.deepStrictEqual(fromNullable(undefined), none)
 * assert.deepStrictEqual(fromNullable(null), none)
 * assert.deepStrictEqual(fromNullable(1), some(1))
 *
 * @category conversions
 * @since 1.0.0
 */
export const fromNullable: <A>(a: A) => Option<NonNullable<A>> = internal.fromNullableToOption

/**
 * Returns a *smart constructor* from a function that returns a nullable value.
 *
 * @example
 * import { liftNullable, none, some } from '@fp-ts/data/Option'
 *
 * const f = (s: string): number | undefined => {
 *   const n = parseFloat(s)
 *   return isNaN(n) ? undefined : n
 * }
 *
 * const g = liftNullable(f)
 *
 * assert.deepStrictEqual(g('1'), some(1))
 * assert.deepStrictEqual(g('a'), none)
 *
 * @category lifting
 * @since 1.0.0
 */
export const liftNullable = <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => B | null | undefined
): ((...a: A) => Option<NonNullable<B>>) => (...a) => fromNullable(f(...a))

/**
 * This is `flatMap` + `fromNullable`, useful when working with optional values.
 *
 * @example
 * import { some, none, fromNullable, flatMapNullable } from '@fp-ts/data/Option'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * interface Employee {
 *   company?: {
 *     address?: {
 *       street?: {
 *         name?: string
 *       }
 *     }
 *   }
 * }
 *
 * const employee1: Employee = { company: { address: { street: { name: 'high street' } } } }
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     fromNullable(employee1.company),
 *     flatMapNullable(company => company.address),
 *     flatMapNullable(address => address.street),
 *     flatMapNullable(street => street.name)
 *   ),
 *   some('high street')
 * )
 *
 * const employee2: Employee = { company: { address: { street: {} } } }
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     fromNullable(employee2.company),
 *     flatMapNullable(company => company.address),
 *     flatMapNullable(address => address.street),
 *     flatMapNullable(street => street.name)
 *   ),
 *   none
 * )
 *
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapNullable = <A, B>(f: (a: A) => B | null | undefined) =>
  (ma: Option<A>): Option<NonNullable<B>> => isNone(ma) ? none : fromNullable(f(ma.value))

/**
 * Extracts the value out of the structure, if it exists. Otherwise returns `null`.
 *
 * @example
 * import { some, none, toNull } from '@fp-ts/data/Option'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     toNull
 *   ),
 *   1
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     toNull
 *   ),
 *   null
 * )
 *
 * @category conversions
 * @since 1.0.0
 */
export const toNull: <A>(self: Option<A>) => A | null = getOrElse(null)

/**
 * Extracts the value out of the structure, if it exists. Otherwise returns `undefined`.
 *
 * @example
 * import { some, none, toUndefined } from '@fp-ts/data/Option'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     toUndefined
 *   ),
 *   1
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     toUndefined
 *   ),
 *   undefined
 * )
 *
 * @category conversions
 * @since 1.0.0
 */
export const toUndefined: <A>(self: Option<A>) => A | undefined = getOrElse(undefined)

/**
 * Lazy version of `orElse`.
 *
 * @category error handling
 * @since 1.0.0
 */
export const catchAll = <B>(that: LazyArg<Option<B>>) =>
  <A>(self: Option<A>): Option<A | B> => isNone(self) ? that() : self

/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `Option` returns the left-most non-`None` value.
 *
 * | x       | y       | pipe(x, orElse(y) |
 * | ------- | ------- | ------------------|
 * | none    | none    | none              |
 * | some(a) | none    | some(a)           |
 * | none    | some(b) | some(b)           |
 * | some(a) | some(b) | some(a)           |
 *
 * @example
 * import * as O from '@fp-ts/data/Option'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     O.none,
 *     O.orElse(O.none)
 *   ),
 *   O.none
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     O.some('a'),
 *     O.orElse<string>(O.none)
 *   ),
 *   O.some('a')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     O.none,
 *     O.orElse(O.some('b'))
 *   ),
 *   O.some('b')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     O.some('a'),
 *     O.orElse(O.some('b'))
 *   ),
 *   O.some('a')
 * )
 *
 * @category instance operations
 * @since 1.0.0
 */
export const orElse = <B>(that: Option<B>): (<A>(self: Option<A>) => Option<A | B>) =>
  catchAll(() => that)

/**
 * The `Order` instance allows `Option` values to be compared with
 * `compare`, whenever there is an `Order` instance for
 * the type the `Option` contains.
 *
 * `None` is considered to be less than any `Some` value.
 *
 * @example
 * import { none, some, liftOrder } from '@fp-ts/data/Option'
 * import * as N from '@fp-ts/data/Number'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * const O = liftOrder(N.Order)
 * assert.strictEqual(pipe(none, O.compare(none)), 0)
 * assert.strictEqual(pipe(none, O.compare(some(1))), -1)
 * assert.strictEqual(pipe(some(1), O.compare(none)), 1)
 * assert.strictEqual(pipe(some(1), O.compare(some(2))), -1)
 * assert.strictEqual(pipe(some(1), O.compare(some(1))), 0)
 *
 * @since 1.0.0
 */
export const liftOrder = <A>(O: Order<A>): Order<Option<A>> =>
  order.fromCompare((that) =>
    (self) => isSome(self) ? (isSome(that) ? O.compare(that.value)(self.value) : 1) : -1
  )

/**
 * Returns a *smart constructor* based on the given predicate.
 *
 * @example
 * import * as O from '@fp-ts/data/Option'
 *
 * const getOption = O.liftPredicate((n: number) => n >= 0)
 *
 * assert.deepStrictEqual(getOption(-1), O.none)
 * assert.deepStrictEqual(getOption(1), O.some(1))
 *
 * @category lifting
 * @since 1.0.0
 */
export const liftPredicate: {
  <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (c: C) => Option<B>
  <B extends A, A = B>(predicate: Predicate<A>): (b: B) => Option<B>
} = <B extends A, A = B>(predicate: Predicate<A>) => (b: B) => predicate(b) ? some(b) : none

/**
 * @category lifting
 * @since 1.0.0
 */
export const liftEither = <A extends ReadonlyArray<unknown>, E, B>(
  f: (...a: A) => Either<E, B>
) => (...a: A): Option<B> => fromEither(f(...a))

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapEither = <A, E, B>(f: (a: A) => Either<E, B>) =>
  (self: Option<A>): Option<B> => pipe(self, flatMap(liftEither(f)))

/**
 * Tests whether a value is a member of a `Option`.
 *
 * @example
 * import * as O from '@fp-ts/data/Option'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * assert.strictEqual(pipe(O.some(1), O.elem(1)), true)
 * assert.strictEqual(pipe(O.some(1), O.elem(2)), false)
 * assert.strictEqual(pipe(O.none, O.elem(1)), false)
 *
 * @since 1.0.0
 */
export const elem = <A>(a: A) =>
  (ma: Option<A>): boolean => isNone(ma) ? false : equals(ma.value)(a)

/**
 * Returns `true` if the predicate is satisfied by the wrapped value
 *
 * @example
 * import { some, none, exists } from '@fp-ts/data/Option'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     exists(n => n > 0)
 *   ),
 *   true
 * )
 * assert.strictEqual(
 *   pipe(
 *     some(1),
 *     exists(n => n > 1)
 *   ),
 *   false
 * )
 * assert.strictEqual(
 *   pipe(
 *     none,
 *     exists(n => n > 0)
 *   ),
 *   false
 * )
 *
 * @since 1.0.0
 */
export const exists = <A>(predicate: Predicate<A>) =>
  (ma: Option<A>): boolean => isNone(ma) ? false : predicate(ma.value)

// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------

/**
 * Equivalent to `NonEmptyReadonlyArray#traverseWithIndex(Semigroupal)`.
 *
 * @category traversing
 * @since 1.0.0
 */
export const traverseNonEmptyReadonlyArrayWithIndex = <A, B>(
  f: (index: number, a: A) => Option<B>
) =>
  (as: NonEmptyReadonlyArray<A>): Option<NonEmptyReadonlyArray<B>> => {
    const o = f(0, internal.head(as))
    if (isNone(o)) {
      return none
    }
    const out: internal.NonEmptyArray<B> = [o.value]
    for (let i = 1; i < as.length; i++) {
      const o = f(i, as[i])
      if (isNone(o)) {
        return none
      }
      out.push(o.value)
    }
    return some(out)
  }

/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Monoidal)`.
 *
 * @category traversing
 * @since 1.0.0
 */
export const traverseReadonlyArrayWithIndex = <A, B>(
  f: (index: number, a: A) => Option<B>
): ((as: ReadonlyArray<A>) => Option<ReadonlyArray<B>>) => {
  const g = traverseNonEmptyReadonlyArrayWithIndex(f)
  return (as) => (internal.isNonEmpty(as) ? g(as) : some([]))
}

/**
 * Equivalent to `NonEmptyReadonlyArray#traverse(Semigroupal)`.
 *
 * @category traversing
 * @since 1.0.0
 */
export const traverseNonEmptyReadonlyArray = <A, B>(
  f: (a: A) => Option<B>
): ((as: NonEmptyReadonlyArray<A>) => Option<NonEmptyReadonlyArray<B>>) => {
  return traverseNonEmptyReadonlyArrayWithIndex(flow(SK, f))
}

/**
 * Equivalent to `ReadonlyArray#traverse(Monoidal)`.
 *
 * @category traversing
 * @since 1.0.0
 */
export const traverseReadonlyArray = <A, B>(
  f: (a: A) => Option<B>
): ((as: ReadonlyArray<A>) => Option<ReadonlyArray<B>>) => {
  return traverseReadonlyArrayWithIndex(flow(SK, f))
}

/**
 * Equivalent to `ReadonlyArray#sequence(Monoidal)`.
 *
 * @category traversing
 * @since 1.0.0
 */
export const sequenceReadonlyArray: <A>(arr: ReadonlyArray<Option<A>>) => Option<ReadonlyArray<A>> =
  traverseReadonlyArray(identity)
