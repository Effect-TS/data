/**
 * @since 1.0.0
 */

import type { LazyArg } from "@fp-ts/data/Function"
import * as SE from "@fp-ts/data/internal/SafeEval"

const TypeId: unique symbol = SE.SafeEvalTypeId as TypeId

/**
 * @since 1.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * `SafeEval<A>` is a purely functional description of a computation.
 *
 * This data type is designed for speed and low allocations. It is particularly
 * useful when you need the ability to suspend recursive procedures.
 *
 * @since 1.0.0
 * @category models
 */
export interface SafeEval<A> {
  readonly _id: TypeId
  readonly _A: (_: never) => A
}

/**
 * Constructs a computation that always returns the `Unit` value.
 *
 * @since 1.0.0
 * @category constructors
 */
export const unit: SafeEval<void> = SE.unit

/**
 * Constructs a computation that always succeeds with the specified value.
 *
 * @since 1.0.0
 * @category constructors
 */
export const succeed: <A>(a: A) => SafeEval<A> = SE.succeed

/**
 * Lift a synchronous, non-failable computation into a `SafeEval`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const sync: <A>(a: LazyArg<A>) => SafeEval<A> = SE.sync

/**
 * Suspends a computation.
 *
 * This is particularly useful for avoiding infinite recursion in recursive
 * computations.
 *
 * @since 1.0.0
 * @category constructors
 */
export const suspend: <A>(f: LazyArg<SafeEval<A>>) => SafeEval<A> = SE.suspend

/**
 * Constructs a record of results from a record of `SafeEval`s.
 *
 * @since 1.0.0
 * @category constructors
 */
export const struct: <NER extends Record<string, SafeEval<any>>>(
  r: (keyof NER extends never ? never : NER) & Record<string, SafeEval<any>>
) => SafeEval<
  {
    [K in keyof NER]: [NER[K]] extends [SafeEval<infer A>] ? A : never
  }
> = SE.struct as any

/**
 * Constructs a tuple of results from a tuple of `SafeEval`s.
 *
 * @since 1.0.0
 * @category constructors
 */
export const tuple: <EN extends ReadonlyArray<SafeEval<any>>>(
  ...args: EN & {
    readonly 0: SafeEval<any>
    readonly 1: SafeEval<any>
  }
) => SafeEval<Readonly<{ [K in keyof EN]: [EN[K]] extends [SafeEval<infer A>] ? A : never }>> =
  SE.tuple

/**
 * @since 1.0.0
 * @category constructors
 */
export const reduce: <A, B>(
  as: Iterable<A>,
  b: B,
  f: (b: B, a: A) => SafeEval<B>
) => SafeEval<B> = SE.reduce

/**
 * @since 1.0.0
 * @category constructors
 */
export const gen: <Eff extends SE.GenSafeEval<any>, AEff>(
  f: (i: <A>(_: SafeEval<A>) => SE.GenSafeEval<A>) => Generator<Eff, AEff, any>
) => SafeEval<AEff> = SE.gen

/**
 * Executes the computation represented by the specified `SafeEval`.
 *
 * @since 1.0.0
 * @category destructors
 */
export const execute: <A>(self: SafeEval<A>) => A = SE.execute

/**
 * Combines this computation with the specified computation combining the
 * results of both into a tuple.
 *
 * @since 1.0.0
 * @category elements
 */
export const zip: <B>(
  that: SafeEval<B>
) => <A>(
  self: SafeEval<A>
) => SafeEval<readonly [A, B]> = SE.zip

/**
 * Combines this computation with the specified computation, returning the
 * value of this computation.
 *
 * @since 1.0.0
 * @category elements
 */
export const zipLeft: <B>(
  that: SafeEval<B>
) => <A>(
  self: SafeEval<A>
) => SafeEval<A> = SE.zipLeft

/**
 * Combines this computation with the specified computation, returning the
 * value of that computation.
 *
 * @since 1.0.0
 * @category elements
 */
export const zipRight: <B>(
  that: SafeEval<B>
) => <A>(
  self: SafeEval<A>
) => SafeEval<B> = SE.zipRight

/**
 * Combines this computation with the specified computation combining the
 * results of both using the specified function.
 *
 * @since 1.0.0
 * @category elements
 */
export const zipWith: <A, B, C>(
  that: SafeEval<B>,
  f: (a: A, b: B) => C
) => (
  self: SafeEval<A>
) => SafeEval<C> = SE.zipWith

/**
 * Extends this computation with another computation that depends on the
 * result of this computation by running the first computation, using its
 * result to generate a second computation, and running that computation.
 *
 * @since 1.0.0
 * @category mapping
 */
export const map: <A, B>(f: (a: A) => B) => (self: SafeEval<A>) => SafeEval<B> = SE.map

/**
 * Extends this computation with another computation that depends on the
 * result of this computation by running the first computation, using its
 * result to generate a second computation, and running that computation.
 *
 * @since 1.0.0
 * @category sequencing
 */
export const flatMap: <A, B>(
  f: (a: A) => SafeEval<B>
) => (
  self: SafeEval<A>
) => SafeEval<B> = SE.flatMap

/**
 * Flatten an `SafeEval<SafeEval<A>>` into an `SafeEval<A>`.
 *
 * @since 1.0.0
 * @category sequencing
 */
export const flatten: <A>(self: SafeEval<SafeEval<A>>) => SafeEval<A> = SE.flatten

/**
 * Returns a computation that effectfully "peeks" at the success of this one.
 *
 * @since 1.0.0
 * @category sequencing
 */
export const tap: <A, X>(
  f: (a: A) => SafeEval<X>
) => (
  self: SafeEval<A>
) => SafeEval<A> = SE.tap
