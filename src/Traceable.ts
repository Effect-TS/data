/**
 * @since 1.0.0
 */
import { constUndefined } from "@effect/data/Function"
import * as ReadonlyArray from "@effect/data/ReadonlyArray"

/**
 * @since 1.0.0
 * @category symbols
 */
export const symbol: unique symbol = Symbol.for("@effect/data/Traceable")

/**
 * @since 1.0.0
 * @category models
 */
export interface Traceable {
  readonly [symbol]: () => ReadonlyArray.NonEmptyReadonlyArray<string> | undefined
}

/**
 * @since 1.0.0
 * @category symbols
 */
export const WithTypeTypeId: unique symbol = Symbol.for("@effect/data/Traceable/Traceable.WithType")

/**
 * @since 1.0.0
 * @category symbols
 */
export type WithTypeTypeId = typeof WithTypeTypeId

/**
 * @since 1.0.0
 * @category models
 */
export declare namespace Traceable {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface WithType<A> extends Traceable {
    readonly [WithTypeTypeId]: (_: A) => A
  }

  /**
   * @since 1.0.0
   */
  export type Infer<A extends WithType<any>> = Parameters<A[WithTypeTypeId]>[0]
}

/**
 * @since 1.0.0
 * @category refinements
 */
export const isTraceable = (u: unknown): u is Traceable => typeof u === "object" && u !== null && symbol in u

/**
 * @since 1.0.0
 * @category refinements
 */
export const isTraceableWithType = (u: unknown): u is Traceable.WithType<unknown> =>
  isTraceable(u) && WithTypeTypeId in u

/**
 * @since 1.0.0
 * @category accessors
 */
export const stack = (u: unknown): ReadonlyArray.NonEmptyReadonlyArray<string> | undefined =>
  isTraceable(u) ? u[symbol]() : undefined

/**
 * @since 1.0.0
 * @category accessors
 */
export const capturedAt = (u: unknown): string | undefined => {
  const lines = stack(u)
  if (!lines) {
    return undefined
  }
  const afterAt = lines[0].match(/at (.*)/)
  return afterAt ? afterAt[1] : undefined
}

/**
 * @since 1.0.0
 * @category utils
 */
export const capture: (
  skipFrames?: number,
  maxSize?: number
) => () => ReadonlyArray.NonEmptyReadonlyArray<string> | undefined = (
  skipFrames = 1,
  frames = 1
) => {
  const limit = Error.stackTraceLimit
  Error.stackTraceLimit = frames + skipFrames + 1
  const error = new Error()
  Error.stackTraceLimit = limit
  if (!error.stack) {
    return constUndefined
  }
  const lines = error.stack.split("\n").slice(2 + skipFrames)
  if (!ReadonlyArray.isNonEmptyReadonlyArray(lines)) {
    return constUndefined
  }
  return () => lines
}
