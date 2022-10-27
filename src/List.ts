/**
 * @since 1.0.0
 */

import type { Kind, TypeLambda } from "@fp-ts/core/HKT"
import * as applicative from "@fp-ts/core/typeclass/Applicative"
import * as chainable from "@fp-ts/core/typeclass/Chainable"
import * as compactable from "@fp-ts/core/typeclass/Compactable"
import type { Coproduct } from "@fp-ts/core/typeclass/Coproduct"
import * as covariant from "@fp-ts/core/typeclass/Covariant"
import * as filterable from "@fp-ts/core/typeclass/Filterable"
import * as flatMap_ from "@fp-ts/core/typeclass/FlatMap"
import * as foldable from "@fp-ts/core/typeclass/Foldable"
import * as invariant from "@fp-ts/core/typeclass/Invariant"
import type * as monad from "@fp-ts/core/typeclass/Monad"
import type { Monoid } from "@fp-ts/core/typeclass/Monoid"
import * as nonEmptyApplicative from "@fp-ts/core/typeclass/NonEmptyApplicative"
import * as nonEmptyProduct from "@fp-ts/core/typeclass/NonEmptyProduct"
import * as of_ from "@fp-ts/core/typeclass/Of"
import type { Order } from "@fp-ts/core/typeclass/Order"
import type * as pointed from "@fp-ts/core/typeclass/Pointed"
import * as product_ from "@fp-ts/core/typeclass/Product"
import type { Semigroup } from "@fp-ts/core/typeclass/Semigroup"
import * as traversable from "@fp-ts/core/typeclass/Traversable"
import * as traversableFilterable from "@fp-ts/core/typeclass/TraversableFilterable"
import type { Either } from "@fp-ts/data/Either"
import type * as Equal from "@fp-ts/data/Equal"
import * as LI from "@fp-ts/data/internal/List"
import * as _sort from "@fp-ts/data/internal/List/sort"
import type { Option } from "@fp-ts/data/Option"
import type { Predicate } from "@fp-ts/data/Predicate"
import type { Refinement } from "@fp-ts/data/Refinement"

type LCons<A> = Cons<A>
type LNil<A> = Nil<A>

/**
 * @since 1.0.0
 */
export declare namespace List {
  export type Cons<A> = LCons<A>
  export type Nil<A> = LNil<A>
}

const TypeId: unique symbol = LI.ListTypeId as TypeId

/**
 * @since 1.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * @since 1.0.0
 * @category models
 */
export interface Cons<A> extends Iterable<A>, Equal.Equal {
  readonly _id: TypeId
  readonly _tag: "Cons"
  readonly head: A
  readonly tail: List<A>
}

/**
 * @since 1.0.0
 * @category models
 */
export interface Nil<A> extends Iterable<A>, Equal.Equal {
  readonly _id: TypeId
  readonly _tag: "Nil"
}

/**
 * @since 1.0.0
 * @category models
 */
export type List<A> = Cons<A> | Nil<A>

/**
 * @since 1.0.0
 * @category type lambdas
 */
export interface ListTypeLambda extends TypeLambda {
  readonly type: List<this["Target"]>
}

/**
 * @since 1.0.0
 * @category constructors
 */
export const make: <As extends ReadonlyArray<any>>(...prefix: As) => List<As[number]> = LI.make

/**
 * @since 1.0.0
 * @category constructors
 */
export const List: <As extends ReadonlyArray<any>>(...prefix: As) => List<As[number]> = LI.make

/**
 * @since 1.0.0
 * @category constructors
 */
export const of: <A>(a: A) => List<A> = LI.of

/**
 * @since 1.0.0
 * @category constructors
 */
export const cons: <A>(head: A, tail: List<A>) => Cons<A> = LI.cons

/**
 * @since 1.0.0
 * @category constructors
 */
export const nil: <A = never>() => Nil<A> = LI.nil

/**
 * @since 1.0.0
 * @category filtering
 */
export const drop: (n: number) => <A>(self: List<A>) => List<A> = LI.drop

/**
 * @since 1.0.0
 * @category filtering
 */
export const take: (n: number) => <A>(self: List<A>) => List<A> = LI.take

/**
 * @since 1.0.0
 * @category refinements
 */
export const isList: {
  <A>(u: Iterable<A>): u is List<A>
  (u: unknown): u is List<unknown>
} = LI.isList

/**
 * @since 1.0.0
 * @category refinements
 */
export const isCons: <A>(self: List<A>) => self is Cons<A> = LI.isCons

/**
 * @since 1.0.0
 * @category refinements
 */
export const isNil: <A>(self: List<A>) => self is Nil<A> = LI.isNil

/**
 * @since 1.0.0
 * @category mutations
 */
export const prepend: <B>(elem: B) => <A>(self: List<A>) => Cons<A | B> = LI.prepend

/**
 * @since 1.0.0
 * @category mutations
 */
export const prependAll: <B>(prefix: List<B>) => <A>(self: List<A>) => List<A | B> = LI.prependAll

/**
 * @since 1.0.0
 * @category mutations
 */
export const concat: <B>(that: List<B>) => <A>(self: List<A>) => List<A | B> = LI.concat

/**
 * @since 1.0.0
 * @category mutations
 */
export const reverse: <A>(self: List<A>) => List<A> = LI.reverse

/**
 * @since 1.0.0
 * @category partitioning
 */
export const splitAt: (n: number) => <A>(self: List<A>) => readonly [List<A>, List<A>] = LI.splitAt

/**
 * @since 1.0.0
 * @category getters
 */
export const head: <A>(self: List<A>) => Option<A> = LI.head

/**
 * @since 1.0.0
 * @category getters
 */
export const tail: <A>(self: List<A>) => Option<List<A>> = LI.tail

/**
 * @since 1.0.0
 * @category constructors
 */
export const empty: <A = never>() => List<A> = LI.empty

/**
 * @since 1.0.0
 * @category elements
 */
export const some: <A>(p: Predicate<A>) => (self: List<A>) => boolean = LI.any

/**
 * @since 1.0.0
 * @category elements
 */
export const every: <A>(p: Predicate<A>) => (self: List<A>) => boolean = LI.all

/**
 * @since 1.0.0
 * @category elements
 */
export const findFirst: {
  <A, B extends A>(refinement: Refinement<A, B>): (self: List<A>) => Option<B>
  <A>(predicate: Predicate<A>): (self: List<A>) => Option<A>
} = LI.find

/**
 * @since 1.0.0
 * @category traversing
 */
export const forEach: <A, U>(f: (a: A) => U) => (self: List<A>) => void = LI.forEach

/**
 * @since 1.0.0
 * @category sequencing
 */
export const flatMap: <A, B>(f: (a: A) => List<B>) => (self: List<A>) => List<B> = LI.flatMap

/**
 * @since 1.0.0
 * @category mapping
 */
export const map: <A, B>(f: (a: A) => B) => (self: List<A>) => List<B> = LI.map

/**
 * @since 1.0.0
 * @category conversions
 */
export const fromIterable: <A>(prefix: Iterable<A>) => List<A> = LI.from

/**
 * @since 1.0.0
 * @category folding
 */
export const reduce: <A, B>(b: B, f: (b: B, a: A) => B) => (self: List<A>) => B = LI.reduce

/**
 * @since 1.0.0
 * @category unsafe
 */
export const unsafeHead: <A>(self: List<A>) => A = LI.unsafeHead

/**
 * @since 1.0.0
 * @category unsafe
 */
export const unsafeTail: <A>(self: List<A>) => List<A> = LI.unsafeTail

/**
 * @since 1.0.0
 * @category unsafe
 */
export const unsafeLast: <A>(self: List<A>) => A = LI.unsafeLast

/**
 * @since 1.0.0
 * @category sorting
 */
export const sort: <A>(O: Order<A>) => (self: List<A>) => List<A> = _sort.sort

/**
 * @since 1.0.0
 * @category mapping
 */
export const imap: <A, B>(to: (a: A) => B, from: (b: B) => A) => (self: List<A>) => List<B> =
  LI.imap

/**
 * @since 1.0.0
 * @category instances
 */
export const Invariant: invariant.Invariant<ListTypeLambda> = LI.Invariant

/**
 * @since 1.0.0
 */
export const tupled: <A>(self: List<A>) => List<readonly [A]> = invariant.tupled(Invariant)

/**
 * @since 1.0.0
 */
export const bindTo: <N extends string>(
  name: N
) => <A>(self: List<A>) => List<{ readonly [K in N]: A }> = invariant.bindTo(Invariant)

/**
 * @since 1.0.0
 * @category instances
 */
export const Covariant: covariant.Covariant<ListTypeLambda> = LI.Covariant

/**
 * @category mapping
 * @since 1.0.0
 */
export const as: <B>(b: B) => <_>(self: List<_>) => List<B> = covariant.as(Covariant)

/**
 * @category mapping
 * @since 1.0.0
 */
export const asUnit: <_>(self: List<_>) => List<void> = covariant.asUnit(Covariant)

/**
 * @category mapping
 * @since 1.0.0
 */
export const flap: <A>(a: A) => <B>(self: List<(a: A) => B>) => List<B> = covariant.flap(
  Covariant
)

const let_: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (
  self: List<A>
) => List<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }> = covariant.let(Covariant)

export {
  /**
   * @category do notation
   * @since 1.0.0
   */
  let_ as let
}

/**
 * @since 1.0.0
 * @category instances
 */
export const Of: of_.Of<ListTypeLambda> = {
  of
}

/**
 * @since 1.0.0
 */
export const unit: List<void> = of_.unit(Of)

/**
 * @since 1.0.0
 */
export const Do: List<{}> = of_.Do(Of)

/**
 * @since 1.0.0
 * @category instances
 */
export const Pointed: pointed.Pointed<ListTypeLambda> = {
  ...Covariant,
  ...Of
}

/**
 * @since 1.0.0
 * @category instances
 */
export const FlatMap: flatMap_.FlatMap<ListTypeLambda> = {
  flatMap
}

/**
 * @since 1.0.0
 */
export const flatten: <A>(self: List<List<A>>) => List<A> = flatMap_
  .flatten(FlatMap)

/**
 * @since 1.0.0
 */
export const andThen: <B>(that: List<B>) => <_>(self: List<_>) => List<B> = flatMap_.andThen(
  FlatMap
)

/**
 * @since 1.0.0
 */
export const composeKleisliArrow: <B, C>(
  bfc: (b: B) => List<C>
) => <A>(afb: (a: A) => List<B>) => (a: A) => List<C> = flatMap_.composeKleisliArrow(
  FlatMap
)

/**
 * @since 1.0.0
 * @category instances
 */
export const Chainable: chainable.Chainable<ListTypeLambda> = {
  ...FlatMap,
  ...Covariant
}

/**
 * @since 1.0.0
 */
export const tap: <A, _>(
  f: (a: A) => List<_>
) => (self: List<A>) => List<A> = chainable.tap(Chainable)

/**
 * @since 1.0.0
 */
export const andThenDiscard: <_>(
  that: List<_>
) => <A>(self: List<A>) => List<A> = chainable.andThenDiscard(Chainable)

/**
 * @category do notation
 * @since 1.0.0
 */
export const bind: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => List<B>
) => (
  self: List<A>
) => List<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }> = chainable.bind(Chainable)

/**
 * @since 1.0.0
 * @category instances
 */
export const Monad: monad.Monad<ListTypeLambda> = {
  ...Chainable,
  ...Of
}

/**
 * @since 1.0.0
 */
export const product: <B>(that: List<B>) => <A>(self: List<A>) => List<readonly [A, B]> = LI.product

/**
 * @since 1.0.0
 */
export const productMany: <A>(
  collection: Iterable<List<A>>
) => (self: List<A>) => List<readonly [A, ...Array<A>]> = LI.productMany

/**
 * @since 1.0.0
 * @category instances
 */
export const NonEmptyProduct: nonEmptyProduct.NonEmptyProduct<ListTypeLambda> = {
  ...Invariant,
  product,
  productMany
}

/**
 * @since 1.0.0
 */
export const bindList: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  fb: List<B>
) => (
  self: List<A>
) => List<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }> = nonEmptyProduct.bindKind(
  NonEmptyProduct
)

/**
 * @since 1.0.0
 */
export const productFlatten: <B>(
  that: List<B>
) => <A extends ReadonlyArray<any>>(self: List<A>) => List<readonly [...A, B]> = nonEmptyProduct
  .productFlatten(NonEmptyProduct)

/**
 * @since 1.0.0
 */
export const productAll: <A>(collection: Iterable<List<A>>) => List<ReadonlyArray<A>> =
  LI.productAll

/**
 * @since 1.0.0
 * @category instances
 */
export const Product: product_.Product<ListTypeLambda> = {
  ...NonEmptyProduct,
  ...Of,
  productAll
}

/**
 * @since 1.0.0
 */
export const tuple: <T extends ReadonlyArray<List<any>>>(
  ...components: T
) => List<Readonly<{ [I in keyof T]: [T[I]] extends [List<infer A>] ? A : never }>> = product_
  .tuple(Product)

/**
 * @since 1.0.0
 */
export const struct: <R extends Record<string, List<any>>>(
  fields: R
) => List<{ readonly [K in keyof R]: [R[K]] extends [List<infer A>] ? A : never }> = product_
  .struct(Product)

/**
 * @since 1.0.0
 * @category instances
 */
export const NonEmptyApplicative: nonEmptyApplicative.NonEmptyApplicative<ListTypeLambda> = {
  ...NonEmptyProduct,
  ...Covariant
}

/**
 * @since 1.0.0
 */
export const liftSemigroup: <A>(S: Semigroup<A>) => Semigroup<List<A>> = nonEmptyApplicative
  .liftSemigroup(NonEmptyApplicative)

/**
 * @since 1.0.0
 */
export const ap: <A>(
  fa: List<A>
) => <B>(self: List<(a: A) => B>) => List<B> = nonEmptyApplicative
  .ap(NonEmptyApplicative)

/**
 * @since 1.0.0
 */
export const lift2: <A, B, C>(
  f: (a: A, b: B) => C
) => (fa: List<A>, fb: List<B>) => List<C> = nonEmptyApplicative.lift2(
  NonEmptyApplicative
)

/**
 * @since 1.0.0
 */
export const lift3: <A, B, C, D>(
  f: (a: A, b: B, c: C) => D
) => (fa: List<A>, fb: List<B>, fc: List<C>) => List<D> = nonEmptyApplicative.lift3(
  NonEmptyApplicative
)

/**
 * @since 1.0.0
 * @category instances
 */
export const Applicative: applicative.Applicative<ListTypeLambda> = {
  ...NonEmptyApplicative,
  ...Product
}

/**
 * @since 1.0.0
 */
export const liftMonoid: <A>(M: Monoid<A>) => Monoid<List<A>> = applicative.liftMonoid(
  Applicative
)

/**
 * @since 1.0.0
 */
export const reduceRight: <A, B>(b: B, f: (b: B, a: A) => B) => (self: List<A>) => B =
  LI.reduceRight

/**
 * @since 1.0.0
 * @category instances
 */
export const Foldable: foldable.Foldable<ListTypeLambda> = {
  reduce,
  reduceRight
}

/**
 * @since 1.0.0
 */
export const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (self: List<A>) => M = foldable
  .foldMap(Foldable)

/**
 * @since 1.0.0
 */
export const toReadonlyArray: <A>(self: List<A>) => ReadonlyArray<A> = foldable
  .toReadonlyArray(Foldable)

/**
 * @since 1.0.0
 */
export const toReadonlyArrayWith: <A, B>(
  f: (a: A) => B
) => (self: List<A>) => ReadonlyArray<B> = foldable.toReadonlyArrayWith(Foldable)

/**
 * @since 1.0.0
 */
export const reduceKind: <G extends TypeLambda>(
  G: monad.Monad<G>
) => <B, A, R, O, E>(
  b: B,
  f: (b: B, a: A) => Kind<G, R, O, E, B>
) => (self: List<A>) => Kind<G, R, O, E, B> = foldable.reduceKind(Foldable)

/**
 * @since 1.0.0
 */
export const reduceRightKind: <G extends TypeLambda>(
  G: monad.Monad<G>
) => <B, A, R, O, E>(
  b: B,
  f: (b: B, a: A) => Kind<G, R, O, E, B>
) => (self: List<A>) => Kind<G, R, O, E, B> = foldable.reduceRightKind(Foldable)

/**
 * @since 1.0.0
 */
export const foldMapKind: <G extends TypeLambda>(
  G: Coproduct<G>
) => <A, R, O, E, B>(
  f: (a: A) => Kind<G, R, O, E, B>
) => (self: List<A>) => Kind<G, R, O, E, B> = foldable.foldMapKind(Foldable)

/**
 * @since 1.0.0
 */
export const compact: <A>(self: List<Option<A>>) => List<A> = LI.compact

/**
 * @since 1.0.0
 * @category instances
 */
export const Compactable: compactable.Compactable<ListTypeLambda> = {
  compact
}

/**
 * @since 1.0.0
 */
export const separate: <A, B>(self: List<Either<A, B>>) => readonly [List<A>, List<B>] = compactable
  .separate({ ...Compactable, ...Covariant })

/**
 * @since 1.0.0
 */
export const filterMap: <A, B>(f: (a: A) => Option<B>) => (self: List<A>) => List<B> = LI.filterMap

/**
 * @since 1.0.0
 * @category instances
 */
export const Filterable: filterable.Filterable<ListTypeLambda> = {
  filterMap
}

/**
 * @since 1.0.0
 * @category filtering
 */
export const filter: {
  <C extends A, B extends A, A = C>(
    refinement: (a: A) => a is B
  ): (self: List<C>) => List<B>
  <B extends A, A = B>(predicate: (a: A) => boolean): (self: List<B>) => List<B>
} = filterable.filter(Filterable)

/**
 * @since 1.0.0
 * @category filtering
 */
export const partition: {
  <C extends A, B extends A, A = C>(
    refinement: (a: A) => a is B
  ): (self: List<C>) => readonly [List<C>, List<B>]
  <B extends A, A = B>(
    predicate: (a: A) => boolean
  ): (self: List<B>) => readonly [List<B>, List<B>]
} = filterable.partition(Filterable)

/**
 * @since 1.0.0
 * @category filtering
 */
export const partitionMap: <A, B, C>(
  f: (a: A) => Either<B, C>
) => (self: List<A>) => readonly [List<B>, List<C>] = filterable.partitionMap(Filterable)

/**
 * @since 1.0.0
 * @category traversing
 */
export const traverse: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B>(
  f: (a: A) => Kind<F, R, O, E, B>
) => (self: List<A>) => Kind<F, R, O, E, List<B>> = LI.traverse

/**
 * @since 1.0.0
 * @category instances
 */
export const Traversable: traversable.Traversable<ListTypeLambda> = {
  traverse
}

/**
 * @since 1.0.0
 * @category traversing
 */
export const sequence: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <R, O, E, A>(self: List<Kind<F, R, O, E, A>>) => Kind<F, R, O, E, List<A>> = traversable
  .sequence(Traversable)

/**
 * @since 1.0.0
 * @category traversing
 */
export const traverseTap: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B>(
  f: (a: A) => Kind<F, R, O, E, B>
) => (self: List<A>) => Kind<F, R, O, E, List<A>> = traversable.traverseTap(Traversable)

/**
 * @category filtering
 * @since 1.0.0
 */
export const traverseFilterMap: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B>(
  f: (a: A) => Kind<F, R, O, E, Option<B>>
) => (self: List<A>) => Kind<F, R, O, E, List<B>> = traversableFilterable.traverseFilterMap(
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
) => (self: List<A>) => Kind<F, R, O, E, readonly [List<B>, List<C>]> = traversableFilterable
  .traversePartitionMap({ ...Traversable, ...Covariant, ...Compactable })

/**
 * @category instances
 * @since 1.0.0
 */
export const TraversableFilterable: traversableFilterable.TraversableFilterable<
  ListTypeLambda
> = {
  traverseFilterMap,
  traversePartitionMap
}

/**
 * @since 1.0.0
 * @category filtering
 */
export const traverseFilter: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <B extends A, R, O, E, A = B>(
  predicate: (a: A) => Kind<F, R, O, E, boolean>
) => (self: List<B>) => Kind<F, R, O, E, List<B>> = traversableFilterable.traverseFilter(
  TraversableFilterable
)

/**
 * @since 1.0.0
 * @category filtering
 */
export const traversePartition: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <B extends A, R, O, E, A = B>(
  predicate: (a: A) => Kind<F, R, O, E, boolean>
) => (self: List<B>) => Kind<F, R, O, E, readonly [List<B>, List<B>]> = traversableFilterable
  .traversePartition(
    TraversableFilterable
  )
