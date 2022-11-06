/**
 * @since 1.0.0
 */

import type * as HKT from "@fp-ts/core/HKT"
import type * as Equal from "@fp-ts/data/Equal"
import * as QI from "@fp-ts/data/internal/Queue"
import type * as L from "@fp-ts/data/List"
import type * as O from "@fp-ts/data/Option"
import type { Predicate, Refinement } from "@fp-ts/data/Predicate"

const TypeId: unique symbol = QI.QueueTypeId as TypeId

/**
 * @since 1.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * @since 1.0.0
 * @category models
 */
export interface Queue<A> extends Iterable<A>, Equal.Equal {
  readonly _id: TypeId
  /** @internal */
  readonly _in: L.List<A>
  /** @internal */
  readonly _out: L.List<A>
}

/**
 * @since 1.0.0
 * @category type lambdas
 */
export interface QueueTypeLambda extends HKT.TypeLambda {
  readonly type: Queue<this["Target"]>
}

/**
 * @since 1.0.0
 * @category constructors
 */
export const make: <As extends ReadonlyArray<any>>(
  ...items: As
) => Queue<As[number]> = QI.make

/**
 * @since 1.0.0
 * @category constructors
 */
export const ImmutableQueue: <As extends ReadonlyArray<any>>(
  ...items: As
) => Queue<As[number]> = QI.make

/**
 * @since 1.0.0
 * @category constructors
 */
export const of: <A>(a: A) => Queue<A> = QI.of

/**
 * @since 1.0.0
 * @category constructors
 */
export const empty: <A = never>() => Queue<A> = QI.empty

/**
 * @since 1.0.0
 * @category refinements
 */
export const isQueue: {
  <A>(u: Iterable<A>): u is Queue<A>
  (u: unknown): u is Queue<unknown>
} = QI.isQueue

/**
 * @since 1.0.0
 * @category predicates
 */
export const isEmpty: <A>(self: Queue<A>) => boolean = QI.isEmpty

/**
 * @since 1.0.0
 * @category predicates
 */
export const isNonEmpty: <A>(self: Queue<A>) => boolean = QI.isNonEmpty

/**
 * @since 1.0.0
 * @category getters
 */
export const length: <A>(self: Queue<A>) => number = QI.length

/**
 * @since 1.0.0
 * @category getters
 */
export const head: <A>(self: Queue<A>) => O.Option<A> = QI.head

/**
 * @since 1.0.0
 * @category getters
 */
export const tail: <A>(self: Queue<A>) => O.Option<Queue<A>> = QI.tail

/**
 * @since 1.0.0
 * @category mutations
 */
export const prepend: <B>(
  elem: B
) => <A>(self: Queue<A>) => Queue<A | B> = QI.prepend

/**
 * @since 1.0.0
 * @category mutations
 */
export const enqueue: <B>(
  elem: B
) => <A>(self: Queue<A>) => Queue<A | B> = QI.enqueue

/**
 * @since 1.0.0
 * @category mutations
 */
export const enqueueAll: <B>(
  iter: Iterable<B>
) => <A>(self: Queue<A>) => Queue<A | B> = QI.enqueueAll

/**
 * @since 1.0.0
 * @category mutations
 */
export const dequeue: <A>(
  self: Queue<A>
) => O.Option<readonly [A, Queue<A>]> = QI.dequeue

/**
 * @since 1.0.0
 * @category mapping
 */
export const map: <A, B>(
  f: (a: A) => B
) => (self: Queue<A>) => Queue<B> = QI.map

/**
 * @since 1.0.0
 * @category folding
 */
export const reduce: <A, B>(
  b: B,
  f: (b: B, a: A) => B
) => (self: Queue<A>) => B = QI.reduce

/**
 * @since 1.0.0
 * @category elements
 */
export const some: <A>(
  predicate: Predicate<A>
) => (self: Queue<A>) => boolean = QI.some

/**
 * @since 1.0.0
 * @category elements
 */
export const findFirst: {
  <A, B extends A>(refinement: Refinement<A, B>): (
    self: Queue<A>
  ) => O.Option<B>
  <A>(predicate: Predicate<A>): (self: Queue<A>) => O.Option<A>
} = QI.findFirst

/**
 * @since 1.0.0
 * @category filtering
 */
export const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): (
    self: Queue<A>
  ) => Queue<B>
  <A>(predicate: Predicate<A>): (self: Queue<A>) => Queue<A>
} = QI.filter

/**
 * @since 1.0.0
 * @category conversions
 */
export const fromIterable: <A>(items: Iterable<A>) => Queue<A> = QI.from

/**
 * @since 1.0.0
 * @category unsafe
 */
export const unsafeHead: <A>(self: Queue<A>) => A = QI.unsafeHead

/**
 * @since 1.0.0
 * @category unsafe
 */
export const unsafeTail: <A>(self: Queue<A>) => Queue<A> = QI.unsafeTail

/**
 * @since 1.0.0
 * @category unsafe
 */
export const unsafeDequeue: <A>(
  self: Queue<A>
) => readonly [A, Queue<A>] = QI.unsafeDequeue
