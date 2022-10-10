/**
 * @since 1.0.0
 */

import type { Predicate } from "@fp-ts/core/Predicate"
import type { Refinement } from "@fp-ts/core/Refinement"
import * as LB from "@fp-ts/data/internal/List/builder"
import * as L from "@fp-ts/data/internal/List/definition"
import type * as L_ from "@fp-ts/data/List"

/**
 * @since 1.0.0
 */
export declare namespace List {
  export type Cons<A> = L_.Cons<A>
  export type Nil<A> = L_.Nil<A>
  export type NonEmpty<A> = Cons<A>
}

/**
 * @since 1.0.0
 *
 * @category models
 */
export interface ListBuilder<A> extends Iterable<A> {
  readonly length: number

  readonly isEmpty: () => boolean

  readonly unsafeHead: () => A

  readonly unsafeTail: () => List<A>

  readonly append: (elem: A) => ListBuilder<A>

  readonly prepend: (elem: A) => ListBuilder<A>

  readonly unprepend: (this: this) => A

  readonly build: () => List<A>

  readonly insert: (idx: number, elem: A) => ListBuilder<A>

  readonly reduce: <B>(b: B, f: (b: B, a: A) => B) => B
}

/**
 * @since 1.0.0
 * @category model
 */
export interface Cons<A> extends L.Cons<A> {}

/**
 * @since 1.0.0
 * @category model
 */
export interface Nil<A> extends L.Nil<A> {}

/**
 * @since 1.0.0
 * @category model
 */
export type List<A> = Cons<A> | Nil<A>

/**
 * @since 1.0.0
 * @category constructors
 */
export const builder: <A>() => ListBuilder<A> = LB.builder

/**
 * @since 1.0.0
 * @category constructors
 */
export const make: <As extends ReadonlyArray<any>>(...prefix: As) => List<As[number]> = L.make

/**
 * @since 1.0.0
 * @category constructors
 */
export const cons: <A>(head: A, tail: List<A>) => Cons<A> = L.cons

/**
 * @since 1.0.0
 * @category constructors
 */
export const nil: <A = never>() => Nil<A> = L.nil

/**
 * @since 1.0.0
 * @category filtering
 */
export const drop: (n: number) => <A>(self: List<A>) => List<A> = L.drop

/**
 * @since 1.0.0
 * @category filtering
 */
export const take: (n: number) => <A>(self: List<A>) => List<A> = L.take

/**
 * @since 1.0.0
 * @category filtering
 */
export const filter: {
  <A, B extends A>(p: Refinement<A, B>): (self: List<A>) => List<B>
  <A>(p: Predicate<A>): (self: List<A>) => List<A>
} = L.filter

/**
 * @since 1.0.0
 * @category refinements
 */
export const isCons: <A>(self: List<A>) => self is Cons<A> = L.isCons

/**
 * @since 1.0.0
 * @category refinements
 */
export const isNil: <A>(self: List<A>) => self is Nil<A> = L.isNil
