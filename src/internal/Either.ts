/**
 * @since 1.0.0
 */

import type * as Either from "@effect/data/Either"
import * as Equal from "@effect/data/Equal"
import { dual } from "@effect/data/Function"
import * as Hash from "@effect/data/Hash"
import { EffectTypeId, effectVariance } from "@effect/data/internal/Effect"
import * as Inspect from "@effect/data/internal/Inspect"
import * as option from "@effect/data/internal/Option"
import type { Option } from "@effect/data/Option"
import { pipeArguments } from "@effect/data/Pipeable"

/**
 * @internal
 */
export const TypeId: Either.TypeId = Symbol.for("@effect/data/Either") as Either.TypeId

const CommonProto = {
  [EffectTypeId]: effectVariance,
  [TypeId]: {
    _A: (_: never) => _
  },
  [Inspect.symbol]<E, A>(this: Either.Either<E, A>) {
    return (this as any).toJSON()
  },
  pipe() {
    return pipeArguments(this, arguments)
  },
  toString<E, A>(this: Either.Left<E, A>) {
    return JSON.stringify(this, null, 2)
  }
}

const RightProto = Object.assign(Object.create(CommonProto), {
  _tag: "Right",
  [Equal.symbol]<E, A>(this: Either.Right<E, A>, that: unknown): boolean {
    return isEither(that) && isRight(that) && Equal.equals(that.right, this.right)
  },
  [Hash.symbol]<E, A>(this: Either.Right<E, A>) {
    return Hash.combine(Hash.hash(this._tag))(Hash.hash(this.right))
  },
  toJSON<E, A>(this: Either.Right<E, A>) {
    return {
      _tag: this._tag,
      right: this.right
    }
  }
})

const LeftProto = Object.assign(Object.create(CommonProto), {
  _tag: "Left",
  [Equal.symbol]<E, A>(this: Either.Left<E, A>, that: unknown): boolean {
    return isEither(that) && isLeft(that) && Equal.equals(that.left, this.left)
  },
  [Hash.symbol]<E, A>(this: Either.Left<E, A>) {
    return Hash.combine(Hash.hash(this._tag))(Hash.hash(this.left))
  },
  toJSON<E, A>(this: Either.Left<E, A>) {
    return {
      _tag: this._tag,
      left: this.left
    }
  }
})

/** @internal */
export const isEither = (input: unknown): input is Either.Either<unknown, unknown> =>
  typeof input === "object" && input != null && TypeId in input

/** @internal */
export const isLeft = <E, A>(ma: Either.Either<E, A>): ma is Either.Left<E, A> => ma._tag === "Left"

/** @internal */
export const isRight = <E, A>(ma: Either.Either<E, A>): ma is Either.Right<E, A> => ma._tag === "Right"

/** @internal */
export const left = <E>(left: E): Either.Either<E, never> => {
  const a = Object.create(LeftProto)
  a.left = left
  return a
}

/** @internal */
export const right = <A>(right: A): Either.Either<never, A> => {
  const a = Object.create(RightProto)
  a.right = right
  return a
}

/** @internal */
export const getLeft = <E, A>(
  self: Either.Either<E, A>
): Option<E> => (isRight(self) ? option.none : option.some(self.left))

/** @internal */
export const getRight = <E, A>(
  self: Either.Either<E, A>
): Option<A> => (isLeft(self) ? option.none : option.some(self.right))

/** @internal */
export const fromOption = dual(
  2,
  <A, E>(self: Option<A>, onNone: () => E): Either.Either<E, A> =>
    option.isNone(self) ? left(onNone()) : right(self.value)
)
