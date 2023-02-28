/**
 * @since 1.0.0
 */

import { zeroArgsDual } from "@effect/data/Function"

/**
 * @category symbol
 * @since 1.0.0
 */
export declare const nonEmpty: unique symbol

/**
 * @category model
 * @since 1.0.0
 */
export interface NonEmptyIterable<A> extends Iterable<A> {
  readonly [nonEmpty]: A
}

/**
 * @category getters
 * @since 1.0.0
 */
export const unprepend: {
  <A>(self: NonEmptyIterable<A>): readonly [A, Iterator<A, any, undefined>]
  (_?: never): <A>(self: NonEmptyIterable<A>) => readonly [A, Iterator<A, any, undefined>]
} = zeroArgsDual(<A>(self: NonEmptyIterable<A>): readonly [A, Iterator<A>] => {
  const iterator = self[Symbol.iterator]()
  const next = iterator.next()
  if (next.done) {
    throw new Error("BUG: NonEmptyIterator should not be empty")
  }
  return [next.value, iterator]
})
