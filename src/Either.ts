/**
 * @since 1.0.0
 */

import type * as Data from "@effect/data/Data"
import * as Equivalence from "@effect/data/Equivalence"
import { dual, identity } from "@effect/data/Function"
import type { TypeLambda } from "@effect/data/HKT"
import * as either from "@effect/data/internal/Either"
import type { Option } from "@effect/data/Option"
import type { Pipeable } from "@effect/data/Pipeable"
import { isObject } from "@effect/data/Predicate"
import type * as Unify from "@effect/data/Unify"

/**
 * @category models
 * @since 1.0.0
 */
export type Either<E, A> = Left<E, A> | Right<E, A>

/**
 * @category symbols
 * @since 1.0.0
 */
export const TypeId = Symbol.for("@effect/data/Either")

/**
 * @category symbols
 * @since 1.0.0
 */
export type TypeId = typeof TypeId

/**
 * @category models
 * @since 1.0.0
 */
export interface Left<E, A> extends Data.Case, Pipeable {
  readonly _tag: "Left"
  readonly _id: TypeId
  readonly [TypeId]: {
    readonly _A: (_: never) => A
    readonly _E: (_: never) => E
  }
  get left(): E
  [Unify.typeSymbol]?: unknown
  [Unify.unifySymbol]?: EitherUnify<this>
  [Unify.blacklistSymbol]?: EitherUnifyBlacklist
}

/**
 * @category models
 * @since 1.0.0
 */
export interface Right<E, A> extends Data.Case, Pipeable {
  readonly _tag: "Right"
  readonly _id: TypeId
  get right(): A
  readonly [TypeId]: {
    readonly _A: (_: never) => A
    readonly _E: (_: never) => E
  }
  [Unify.typeSymbol]?: unknown
  [Unify.unifySymbol]?: EitherUnify<this>
  [Unify.blacklistSymbol]?: EitherUnifyBlacklist
}

/**
 * @category models
 * @since 1.0.0
 */
export interface EitherUnify<A extends { [Unify.typeSymbol]?: any }> {
  Either?: () => A[Unify.typeSymbol] extends Either<infer E0, infer A0> | infer _ ? Either<E0, A0> : never
}

/**
 * @category models
 * @since 1.0.0
 */
export interface EitherUnifyBlacklist {}

/**
 * @category type lambdas
 * @since 1.0.0
 */
export interface EitherTypeLambda extends TypeLambda {
  readonly type: Either<this["Out1"], this["Target"]>
}

/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a successful value due to the right bias
 * of this structure.
 *
 * @category constructors
 * @since 1.0.0
 */
export const right: <A>(a: A) => Either<never, A> = either.right

/**
 * Constructs a new `Either` holding a `Left` value. This usually represents a failure, due to the right-bias of this
 * structure.
 *
 * @category constructors
 * @since 1.0.0
 */
export const left: <E>(e: E) => Either<E, never> = either.left

/**
 * Tests if a value is a `Either`.
 *
 * @param input - The value to test.
 *
 * @example
 * import { isEither, left, right } from '@effect/data/Either'
 *
 * assert.deepStrictEqual(isEither(right(1)), true)
 * assert.deepStrictEqual(isEither(left("a")), true)
 * assert.deepStrictEqual(isEither({ right: 1 }), false)
 *
 * @category guards
 * @since 1.0.0
 */
export const isEither = (input: unknown): input is Either<unknown, unknown> =>
  isObject(input) && "_id" in input && input["_id"] === TypeId

/**
 * Determine if a `Either` is a `Left`.
 *
 * @param self - The `Either` to check.
 *
 * @example
 * import { isLeft, left, right } from '@effect/data/Either'
 *
 * assert.deepStrictEqual(isLeft(right(1)), false)
 * assert.deepStrictEqual(isLeft(left("a")), true)
 *
 * @category guards
 * @since 1.0.0
 */
export const isLeft: <E, A>(self: Either<E, A>) => self is Left<E, A> = either.isLeft

/**
 * Determine if a `Either` is a `Right`.
 *
 * @param self - The `Either` to check.
 *
 * @example
 * import { isRight, left, right } from '@effect/data/Either'
 *
 * assert.deepStrictEqual(isRight(right(1)), true)
 * assert.deepStrictEqual(isRight(left("a")), false)
 *
 * @category guards
 * @since 1.0.0
 */
export const isRight: <E, A>(self: Either<E, A>) => self is Right<E, A> = either.isRight

/**
 * Converts a `Either` to an `Option` discarding the `Left`.
 *
 * Alias of {@link toOption}.
 *
 * @example
 * import * as O from '@effect/data/Option'
 * import * as E from '@effect/data/Either'
 *
 * assert.deepStrictEqual(E.getRight(E.right('ok')), O.some('ok'))
 * assert.deepStrictEqual(E.getRight(E.left('err')), O.none())
 *
 * @category getters
 * @since 1.0.0
 */
export const getRight: <E, A>(self: Either<E, A>) => Option<A> = either.getRight

/**
 * Converts a `Either` to an `Option` discarding the value.
 *
 * @example
 * import * as O from '@effect/data/Option'
 * import * as E from '@effect/data/Either'
 *
 * assert.deepStrictEqual(E.getLeft(E.right('ok')), O.none())
 * assert.deepStrictEqual(E.getLeft(E.left('err')), O.some('err'))
 *
 * @category getters
 * @since 1.0.0
 */
export const getLeft: <E, A>(self: Either<E, A>) => Option<E> = either.getLeft

/**
 * @category equivalence
 * @since 1.0.0
 */
export const getEquivalence = <E, A>(
  EE: Equivalence.Equivalence<E>,
  EA: Equivalence.Equivalence<A>
): Equivalence.Equivalence<Either<E, A>> =>
  Equivalence.make((x, y) =>
    x === y ||
    (isLeft(x) ?
      isLeft(y) && EE(x.left, y.left) :
      isRight(y) && EA(x.right, y.right))
  )

/**
 * @category mapping
 * @since 1.0.0
 */
export const mapBoth: {
  <E1, E2, A, B>(options: {
    readonly onLeft: (e: E1) => E2
    readonly onRight: (a: A) => B
  }): (self: Either<E1, A>) => Either<E2, B>
  <E1, A, E2, B>(self: Either<E1, A>, options: {
    readonly onLeft: (e: E1) => E2
    readonly onRight: (a: A) => B
  }): Either<E2, B>
} = dual(
  2,
  <E1, A, E2, B>(self: Either<E1, A>, { onLeft, onRight }: {
    readonly onLeft: (e: E1) => E2
    readonly onRight: (a: A) => B
  }): Either<E2, B> => isLeft(self) ? left(onLeft(self.left)) : right(onRight(self.right))
)

/**
 * Maps the `Left` side of an `Either` value to a new `Either` value.
 *
 * @param self - The input `Either` value to map.
 * @param f - A transformation function to apply to the `Left` value of the input `Either`.
 *
 * @since 1.0.0
 */
export const mapLeft: {
  <E, G>(f: (e: E) => G): <A>(self: Either<E, A>) => Either<G, A>
  <E, A, G>(self: Either<E, A>, f: (e: E) => G): Either<G, A>
} = dual(
  2,
  <E, A, G>(self: Either<E, A>, f: (e: E) => G): Either<G, A> => isLeft(self) ? left(f(self.left)) : right(self.right)
)

/**
 * Maps the `Right` side of an `Either` value to a new `Either` value.
 *
 * @param self - An `Either` to map
 * @param f - The function to map over the value of the `Either`
 *
 * @category mapping
 * @since 1.0.0
 */
export const mapRight: {
  <A, B>(f: (a: A) => B): <E>(self: Either<E, A>) => Either<E, B>
  <E, A, B>(self: Either<E, A>, f: (a: A) => B): Either<E, B>
} = dual(
  2,
  <E, A, B>(self: Either<E, A>, f: (a: A) => B): Either<E, B> => isRight(self) ? right(f(self.right)) : left(self.left)
)

/**
 * Takes two functions and an `Either` value, if the value is a `Left` the inner value is applied to the `onLeft function,
 * if the value is a `Right` the inner value is applied to the `onRight` function.
 *
 * @example
 * import * as E from '@effect/data/Either'
 * import { pipe } from '@effect/data/Function'
 *
 * const onLeft  = (strings: ReadonlyArray<string>): string => `strings: ${strings.join(', ')}`
 *
 * const onRight = (value: number): string => `Ok: ${value}`
 *
 * assert.deepStrictEqual(pipe(E.right(1), E.match({ onLeft, onRight })), 'Ok: 1')
 * assert.deepStrictEqual(
 *   pipe(E.left(['string 1', 'string 2']), E.match({ onLeft, onRight })),
 *   'strings: string 1, string 2'
 * )
 *
 * @category pattern matching
 * @since 1.0.0
 */
export const match: {
  <E, B, A, C = B>(options: {
    readonly onLeft: (e: E) => B
    readonly onRight: (a: A) => C
  }): (self: Either<E, A>) => B | C
  <E, A, B, C = B>(self: Either<E, A>, options: {
    readonly onLeft: (e: E) => B
    readonly onRight: (a: A) => C
  }): B | C
} = dual(
  2,
  <E, A, B, C = B>(self: Either<E, A>, { onLeft, onRight }: {
    readonly onLeft: (e: E) => B
    readonly onRight: (a: A) => C
  }): B | C => isLeft(self) ? onLeft(self.left) : onRight(self.right)
)

/**
 * @category getters
 * @since 1.0.0
 */
export const merge: <E, A>(self: Either<E, A>) => E | A = match({
  onLeft: identity,
  onRight: identity
})

/**
 * @since 1.0.0
 */
export const reverse = <E, A>(self: Either<E, A>): Either<A, E> => isLeft(self) ? right(self.left) : left(self.right)
