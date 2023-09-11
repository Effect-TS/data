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
  readonly [symbol]: () => ReadonlyArray<string> | undefined
}

/**
 * @since 1.0.0
 * @category refinements
 */
export const isTraceable = (u: unknown): u is Traceable =>
  ((typeof u === "object" && u !== null) || typeof u === "function") && symbol in u

/**
 * @since 1.0.0
 * @category models
 */
export const stack = (u: Traceable): ReadonlyArray<string> | undefined => u[symbol]()

/**
 * @since 1.0.0
 * @category utils
 */
export const capture: (skipFrames?: number, maxSize?: number) => () => ReadonlyArray<string> | undefined = (
  skipFrames = 1,
  frames = 1
) => {
  const limit = Error.stackTraceLimit
  Error.stackTraceLimit = frames + skipFrames + 1
  const error = new Error()
  Error.stackTraceLimit = limit
  if (!error.stack) {
    return () => undefined
  }
  const lines = error.stack.split("\n").slice(2 + skipFrames)
  if (!lines.length) {
    return () => undefined
  }
  return () => lines
}
