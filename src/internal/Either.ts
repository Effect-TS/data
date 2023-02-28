/**
 * @since 1.0.0
 */

import * as Data from "@effect/data/Data"
import type { Either, Left, Right } from "@effect/data/Either"
import type { LazyArg } from "@effect/data/Function"
import { dual, zeroArgsDual } from "@effect/data/Function"
import * as option from "@effect/data/internal/Option"
import type { Option } from "@effect/data/Option"

/** @internal */
export const isLeft: {
  <E, A>(ma: Either<E, A>): ma is Left<E>
  (_?: never): <E, A>(ma: Either<E, A>) => ma is Left<E>
} = zeroArgsDual(<E, A>(ma: Either<E, A>): ma is Left<E> => ma._tag === "Left")

/** @internal */
export const isRight: {
  <E, A>(ma: Either<E, A>): ma is Right<A>
  (_?: never): <E, A>(ma: Either<E, A>) => ma is Right<A>
} = zeroArgsDual(<E, A>(ma: Either<E, A>): ma is Right<A> => ma._tag === "Right")

/** @internal */
export const left: {
  <E>(e: E): Either<E, never>
  (_?: never): <E>(e: E) => Either<E, never>
} = zeroArgsDual(<E>(e: E): Either<E, never> => Data.struct({ _tag: "Left", left: e }))

/** @internal */
export const right: {
  <A>(a: A): Either<never, A>
  (_?: never): <A>(a: A) => Either<never, A>
} = zeroArgsDual(<A>(a: A): Either<never, A> => Data.struct({ _tag: "Right", right: a }))

/** @internal */
export const getLeft: {
  <E, A>(self: Either<E, A>): Option<E>
  (_?: never): <E, A>(self: Either<E, A>) => Option<E>
} = zeroArgsDual(<E, A>(
  self: Either<E, A>
): Option<E> => (isRight(self) ? option.none : option.some(self.left)))

/** @internal */
export const getRight: {
  <E, A>(self: Either<E, A>): Option<A>
  (_?: never): <E, A>(self: Either<E, A>) => Option<A>
} = zeroArgsDual(<E, A>(
  self: Either<E, A>
): Option<A> => (isLeft(self) ? option.none : option.some(self.right)))

/** @internal */
export const fromOption: {
  <E>(onNone: LazyArg<E>): <A>(self: Option<A>) => Either<E, A>
  <A, E>(self: Option<A>, onNone: LazyArg<E>): Either<E, A>
} = dual(2, <A, E>(self: Option<A>, onNone: LazyArg<E>): Either<E, A> =>
  option.isNone(self)
    ? left(onNone())
    : right(self.value))
