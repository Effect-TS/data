/**
 * @since 1.0.0
 */

import type { Option } from "@fp-ts/data/Option"
import { isSome } from "@fp-ts/data/Option"
import type { Result } from "@fp-ts/data/Result"
import { isSuccess } from "@fp-ts/data/Result"

/**
 * @since 1.0.0
 */
export interface Refinement<A, B extends A> {
  (a: A): a is B
}

/**
 * Returns a `Refinement` from a `Option` returning function.
 * This function ensures that a `Refinement` definition is type-safe.
 *
 * @category lifting
 * @since 1.0.0
 */
export const liftOption = <A, B extends A>(f: (a: A) => Option<B>): Refinement<A, B> =>
  (a: A): a is B => isSome(f(a))

/**
 * @category lifting
 * @since 1.0.0
 */
export const liftResult = <A, B extends A>(f: (a: A) => Result<unknown, B>): Refinement<A, B> =>
  (a: A): a is B => isSuccess(f(a))

/**
 * @category constructors
 * @since 1.0.0
 */
export const id = <A>(): Refinement<A, A> => (_): _ is A => true

/**
 * @since 1.0.0
 */
export const not = <A, B extends A>(refinement: Refinement<A, B>): Refinement<A, Exclude<A, B>> =>
  (a): a is Exclude<A, B> => !refinement(a)

/**
 * @since 1.0.0
 */
export const or = <A, C extends A>(that: Refinement<A, C>) =>
  <B extends A>(self: Refinement<A, B>): Refinement<A, B | C> =>
    (a): a is B | C => self(a) || that(a)

/**
 * @since 1.0.0
 */
export const and = <A, C extends A>(that: Refinement<A, C>) =>
  <B extends A>(self: Refinement<A, B>): Refinement<A, B & C> =>
    (a): a is B & C => self(a) && that(a)

/**
 * @since 1.0.0
 */
export const empty = <A, B extends A>(): Refinement<A, B> => (_): _ is B => false

/**
 * @since 1.0.0
 */
export const compose = <A, B extends A, C extends B>(bc: Refinement<B, C>) =>
  (ab: Refinement<A, B>): Refinement<A, C> => (i): i is C => ab(i) && bc(i)
