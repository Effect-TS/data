/**
 * @since 1.0.0
 */

import type * as HKT from "@fp-ts/core/HKT"
import type * as O from "@fp-ts/core/Option"
import type { Predicate } from "@fp-ts/core/Predicate"
import type { Refinement } from "@fp-ts/core/Refinement"
import { FromIdentity } from "@fp-ts/core/typeclasses/FromIdentity"
import { Functor } from "@fp-ts/core/typeclasses/Functor"
import type * as Equal from "@fp-ts/data/Equal"
import * as IQI from "@fp-ts/data/internal/ImmutableQueue"
import type * as L from "@fp-ts/data/List"

const TypeId: unique symbol = IQI.ImmutableQueueTypeId as TypeId

/**
 * @since 1.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * @since 1.0.0
 * @category model
 */
export interface ImmutableQueue<A> extends Iterable<A>, Equal.Equal {
  readonly _id: TypeId
  readonly _A: (_: never) => A
  /** @internal */
  readonly _in: L.List<A>
  /** @internal */
  readonly _out: L.List<A>
}

/**
 * @since 1.0.0
 * @category type lambdas
 */
export interface ImmutableQueueTypeLambda extends HKT.TypeLambda {
  readonly type: ImmutableQueue<this["Out1"]>
}

/**
 * @since 1.0.0
 * @category constructors
 */
export const make: <As extends ReadonlyArray<any>>(
  ...items: As
) => ImmutableQueue<As[number]> = IQI.make

/**
 * @since 1.0.0
 * @category constructors
 */
export const ImmutableQueue: <As extends ReadonlyArray<any>>(
  ...items: As
) => ImmutableQueue<As[number]> = IQI.make

/**
 * @since 1.0.0
 * @category constructors
 */
export const of: <A>(a: A) => ImmutableQueue<A> = IQI.of

/**
 * @since 1.0.0
 * @category constructors
 */
export const empty: <A = never>() => ImmutableQueue<A> = IQI.empty

/**
 * @since 1.0.0
 * @category refinements
 */
export const isImmutableQueue: {
  <A>(u: Iterable<A>): u is ImmutableQueue<A>
  (u: unknown): u is ImmutableQueue<unknown>
} = IQI.isImmutableQueue

/**
 * @since 1.0.0
 * @category predicates
 */
export const isEmpty: <A>(self: ImmutableQueue<A>) => boolean = IQI.isEmpty

/**
 * @since 1.0.0
 * @category predicates
 */
export const isNonEmpty: <A>(self: ImmutableQueue<A>) => boolean = IQI.isNonEmpty

/**
 * @since 1.0.0
 * @category getters
 */
export const length: <A>(self: ImmutableQueue<A>) => number = IQI.length

/**
 * @since 1.0.0
 * @category getters
 */
export const head: <A>(self: ImmutableQueue<A>) => O.Option<A> = IQI.head

/**
 * @since 1.0.0
 * @category getters
 */
export const tail: <A>(self: ImmutableQueue<A>) => O.Option<ImmutableQueue<A>> = IQI.tail

/**
 * @since 1.0.0
 * @category mutations
 */
export const prepend: <B>(
  elem: B
) => <A>(self: ImmutableQueue<A>) => ImmutableQueue<A | B> = IQI.prepend

/**
 * @since 1.0.0
 * @category mutations
 */
export const enqueue: <B>(
  elem: B
) => <A>(self: ImmutableQueue<A>) => ImmutableQueue<A | B> = IQI.enqueue

/**
 * @since 1.0.0
 * @category mutations
 */
export const enqueueAll: <B>(
  iter: Iterable<B>
) => <A>(self: ImmutableQueue<A>) => ImmutableQueue<A | B> = IQI.enqueueAll

/**
 * @since 1.0.0
 * @category mutations
 */
export const dequeue: <A>(
  self: ImmutableQueue<A>
) => O.Option<readonly [A, ImmutableQueue<A>]> = IQI.dequeue

/**
 * @since 1.0.0
 * @category mapping
 */
export const map: <A, B>(
  f: (a: A) => B
) => (self: ImmutableQueue<A>) => ImmutableQueue<B> = IQI.map

/**
 * @since 1.0.0
 * @category folding
 */
export const reduce: <A, B>(
  b: B,
  f: (b: B, a: A) => B
) => (self: ImmutableQueue<A>) => B = IQI.reduce

/**
 * @since 1.0.0
 * @category elements
 */
export const some: <A>(
  predicate: Predicate<A>
) => (self: ImmutableQueue<A>) => boolean = IQI.some

/**
 * @since 1.0.0
 * @category elements
 */
export const findFirst: {
  <A, B extends A>(refinement: Refinement<A, B>): (
    self: ImmutableQueue<A>
  ) => O.Option<B>
  <A>(predicate: Predicate<A>): (self: ImmutableQueue<A>) => O.Option<A>
} = IQI.findFirst

/**
 * @since 1.0.0
 * @category filtering
 */
export const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): (
    self: ImmutableQueue<A>
  ) => ImmutableQueue<B>
  <A>(predicate: Predicate<A>): (self: ImmutableQueue<A>) => ImmutableQueue<A>
} = IQI.filter

/**
 * @since 1.0.0
 * @category conversions
 */
export const fromIterable: <A>(items: Iterable<A>) => ImmutableQueue<A> = IQI.from

/**
 * @since 1.0.0
 * @category unsafe
 */
export const unsafeHead: <A>(self: ImmutableQueue<A>) => A = IQI.unsafeHead

/**
 * @since 1.0.0
 * @category unsafe
 */
export const unsafeTail: <A>(self: ImmutableQueue<A>) => ImmutableQueue<A> = IQI.unsafeTail

/**
 * @since 1.0.0
 * @category unsafe
 */
export const unsafeDequeue: <A>(
  self: ImmutableQueue<A>
) => readonly [A, ImmutableQueue<A>] = IQI.unsafeDequeue

const Functor: Functor<ImmutableQueueTypeLambda> = IQI.Functor
const FromIdentity: FromIdentity<ImmutableQueueTypeLambda> = IQI.FromIdentity

export {
  /**
   * @since 1.0.0
   * @category instances
   */
  FromIdentity,
  /**
   * @since 1.0.0
   * @category instances
   */
  Functor
}
