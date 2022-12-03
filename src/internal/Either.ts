/**
 * @since 1.0.0
 */
import type { Either } from "@fp-ts/data/Either"
import type { LazyArg } from "@fp-ts/data/Function"
import * as option from "@fp-ts/data/internal/Option"
import * as these from "@fp-ts/data/internal/These"
import type { Option } from "@fp-ts/data/Option"

/** @internal */
export const isEither = (u: unknown): u is Either<unknown, unknown> =>
  these.isThese(u) && !u.isBoth()

/** @internal */
export const left: <E>(e: E) => Either<E, never> = these.left as any

/** @internal */
export const right: <A>(a: A) => Either<never, A> = these.right as any

/** @internal */
export const getLeft = <E, A>(self: Either<E, A>): Option<E> => self.getLeft()

/** @internal */
export const getRight = <E, A>(self: Either<E, A>): Option<A> => self.getRight()

/** @internal */
export const fromNullable = <E>(onNullable: LazyArg<E>) =>
  <A>(a: A): Either<E, NonNullable<A>> =>
    a == null ? left(onNullable()) : right(a as NonNullable<A>)

/** @internal */
export const fromOption = <E>(onNone: () => E) =>
  <A>(fa: Option<A>): Either<E, A> => option.isNone(fa) ? left(onNone()) : right(fa.value)
