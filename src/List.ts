/**
 * @since 1.0.0
 */

import type * as HKT from "@fp-ts/core/HKT"
import type { Order } from "@fp-ts/core/typeclass/Order"
import type { Either } from "@fp-ts/data/Either"
import type * as Equal from "@fp-ts/data/Equal"
import { pipe } from "@fp-ts/data/Function"
import * as LI from "@fp-ts/data/internal/List"
import * as _sortWith from "@fp-ts/data/internal/List/sortWith"
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
  readonly _A: (_: never) => A
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
  readonly _A: (_: never) => A
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
export interface ListTypeLambda extends HKT.TypeLambda {
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
 * @category filtering
 */
export const filter: {
  <A, B extends A>(p: Refinement<A, B>): (self: List<A>) => List<B>
  <A>(p: Predicate<A>): (self: List<A>) => List<A>
} = LI.filter

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
export const concat: <B>(prefix: List<B>) => <A>(self: List<A>) => List<A | B> = LI.concat

/**
 * @since 1.0.0
 * @category mutations
 */
export const reverse: <A>(self: List<A>) => List<A> = LI.reverse

/**
 * @since 1.0.0
 * @category partitioning
 */
export const partition: <A>(
  f: Predicate<A>
) => (self: List<A>) => readonly [List<A>, List<A>] = LI.partition

/**
 * @since 1.0.0
 * @category partitioning
 */
export const partitionMap: <A, B, C>(
  f: (a: A) => Either<B, C>
) => (self: List<A>) => readonly [List<B>, List<C>] = LI.partitionMap

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
  <A, B extends A>(p: Refinement<A, B>): (self: List<A>) => Option<B>
  <A>(p: Predicate<A>): (self: List<A>) => Option<A>
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
 * @category apply
 */
export const ap: <A>(fa: List<A>) => <B>(self: List<(a: A) => B>) => List<B> = (fa) =>
  (fab) => pipe(fab, flatMap((f) => pipe(fa, map((a) => f(a)))))

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
export const sortWith: <A>(O: Order<A>) => (self: List<A>) => List<A> = _sortWith.sortWith
