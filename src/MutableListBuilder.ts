/**
 * @since 1.0.0
 */
import type * as Equal from "@fp-ts/data/Equal"
import * as LBI from "@fp-ts/data/internal/ListBuilder"
import type { Cons, List } from "@fp-ts/data/List"

/**
 * @since 1.0.0
 * @category models
 */
export interface MutableCons<A> extends Cons<A> {
  tail: List<A>
}

const TypeId: unique symbol = Symbol.for("@fp-ts/data/MutableListBuilder") as TypeId

/**
 * @since 1.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * @since 1.0.0
 *
 * @category models
 */
export interface MutableListBuilder<A> extends Iterable<A>, Equal.Equal {
  readonly _id: TypeId
  length: number
  first: List<A>
  last0: MutableCons<A> | undefined
  len: number
}

/**
 * @since 1.0.0
 * @category constructors
 */
export const empty: <A>() => MutableListBuilder<A> = LBI.make

/**
 * @since 1.0.0
 * @category constructors
 */
export const MutableListBuilder: <As extends ReadonlyArray<unknown>>(
  ...as: As
) => MutableListBuilder<As[number]> = (...as) => {
  const builder = empty()
  for (const a of as) {
    append(a)(builder)
  }
  return builder
}

/**
 * @since 1.0.0
 * @category mutations
 */
export const append: <A>(elem: A) => (self: MutableListBuilder<A>) => MutableListBuilder<A> =
  LBI.append

/**
 * @since 1.0.0
 * @category conversions
 */
export const toList: <A>(self: MutableListBuilder<A>) => List<A> = LBI.build

/**
 * @since 1.0.0
 * @category mutations
 */
export const insert: <A>(
  idx: number,
  elem: A
) => (self: MutableListBuilder<A>) => MutableListBuilder<A> = LBI.insert

/**
 * @since 1.0.0
 * @category size
 */
export const isEmpty: <A>(self: MutableListBuilder<A>) => boolean = LBI.isEmpty

/**
 * @since 1.0.0
 * @category mutations
 */
export const prepend: <A>(elem: A) => (self: MutableListBuilder<A>) => MutableListBuilder<A> =
  LBI.prepend

/**
 * @since 1.0.0
 * @category folding
 */
export const reduce: <A, B>(b: B, f: (b: B, a: A) => B) => (self: MutableListBuilder<A>) => B =
  LBI.reduce

/**
 * @since 1.0.0
 * @category mutations
 */
export const unprepend: <A>(self: MutableListBuilder<A>) => A = LBI.unprepend

/**
 * @since 1.0.0
 * @category unsafe
 */
export const unsafeHead: <A>(self: MutableListBuilder<A>) => A = LBI.unsafeHead

/**
 * @since 1.0.0
 * @category unsafe
 */
export const unsafeTail: <A>(self: MutableListBuilder<A>) => List<A> = LBI.unsafeTail
