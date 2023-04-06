/**
 * @since 1.0.0
 */

import type { Trace } from "@effect/data/Debug"
import { makeTraced } from "@effect/data/Debug"
import type * as Either from "@effect/data/Either"
import * as Equal from "@effect/data/Equal"
import { dual } from "@effect/data/Function"
import * as Hash from "@effect/data/Hash"
import * as option from "@effect/data/internal/Option"
import type { Option } from "@effect/data/Option"

/** @internal */
const effectVariance = {
  _R: (_: never) => _,
  _E: (_: never) => _,
  _A: (_: never) => _
}

const EffectTypeId = Symbol.for("@effect/io/Effect")
const EitherTypeId: Either.EitherTypeId = Symbol.for("@effect/data/Either") as Either.EitherTypeId

/** @internal */
export class Right<E, A> implements Either.Right<E, A> {
  readonly _tag = "Right"
  public i1 = undefined
  public i2 = undefined
  public trace = undefined;
  [EffectTypeId] = effectVariance;
  [Equal.symbol](this: this, that: unknown) {
    return isEither(that) && isRight(that) && Equal.equals((that as unknown as Right<E, A>).i0, this.i0)
  }
  [Hash.symbol](this: this) {
    return Hash.hash(this.i0)
  }
  get right() {
    return this.i0
  }
  constructor(readonly i0: A) {
  }
  get [EitherTypeId]() {
    return {
      _E: (_: never) => _,
      _A: (_: never) => _
    }
  }
  toString() {
    return `right(${String(this.i0)})`
  }
  toJSON() {
    return {
      _tag: this._tag,
      right: this.i0
    }
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toJSON()
  }
  traced(
    this: this,
    trace: Trace
  ): this | Either.TracedEither<never, this["right"]> {
    if (trace) {
      return makeTraced(this, trace)
    }
    return this
  }
}

/** @internal */
export class Left<E, A> implements Either.Left<E, A> {
  readonly _tag = "Left"
  public i1 = undefined
  public i2 = undefined
  public trace = undefined;
  [EffectTypeId] = effectVariance;
  [Equal.symbol](this: this, that: unknown) {
    return isEither(that) && isLeft(that) && Equal.equals((that as unknown as Left<E, A>).i0, this.i0)
  }
  [Hash.symbol](this: this) {
    return Hash.hash(this.i0)
  }
  get [EitherTypeId]() {
    return {
      _E: (_: never) => _,
      _A: (_: never) => _
    }
  }
  get left() {
    return this.i0
  }
  constructor(readonly i0: E) {
  }
  toString() {
    return `left(${String(this.i0)})`
  }
  toJSON() {
    return {
      _tag: this._tag,
      left: this.i0
    }
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toJSON()
  }
  traced(
    this: this,
    trace: Trace
  ): this | Either.TracedEither<this["left"], never> {
    if (trace) {
      return makeTraced(this, trace)
    }
    return this
  }
}

/** @internal */
export const isEither = (input: unknown): input is Either.Either<unknown, unknown> =>
  typeof input === "object" && input != null && "_tag" in input &&
  (input["_tag"] === "Left" || input["_tag"] === "Right") && Equal.isEqual(input)

/** @internal */
export const isLeft = <E, A>(ma: Either.Either<E, A>): ma is Either.Left<E, A> => ma._tag === "Left"

/** @internal */
export const isRight = <E, A>(ma: Either.Either<E, A>): ma is Either.Right<E, A> => ma._tag === "Right"

/** @internal */
export const left = <E>(e: E): Either.Either<E, never> => new Left(e)

/** @internal */
export const right = <A>(a: A): Either.Either<never, A> => new Right(a)

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
