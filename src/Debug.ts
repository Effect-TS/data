/**
 * @since 1.0.0
 */

import * as Equal from "@effect/data/Equal"
import { globalValue } from "@effect/data/Global"
import * as Hash from "@effect/data/Hash"

/**
 * @since 1.0.0
 * @category models
 */
export interface Debug {
  /**
   * Overrides the default log level filter for loggers such as console.
   */
  minumumLogLevel: "All" | "Fatal" | "Error" | "Warning" | "Info" | "Debug" | "Trace" | "None"
  /**
   * Sets a limit on how many stack traces should be rendered.
   */
  traceStackLimit: number
  /**
   * Enables tracing of execution and stack.
   */
  tracingEnabled: boolean
  /**
   * Used to extract a source location from an Error when rendering a stack
   */
  parseStack: (error: Error) => ReadonlyArray<Frame | undefined>
  /**
   * Used to filter a source location when rendering a stack
   */
  filterStackFrame: (frame: Frame) => boolean
}

/**
 * @since 1.0.0
 * @category models
 */
export interface SourceLocation extends Error {
  depth: number
  parsed?: Frame | undefined

  toFrame(): Frame | undefined
}

/**
 * @since 1.0.0
 * @category models
 */
export interface Frame {
  name?: string
  fileName: string
  line: number
  column: number
}

/**
 * @since 1.0.0
 * @category models
 */
export type Trace = SourceLocation | undefined

/**
 * @since 1.0.0
 * @category models
 */
export type Restore = <F extends (...args: Array<any>) => any>(f: F) => F

/**
 * @since 1.0.0
 * @category debug
 */
export const runtimeDebug: Debug = globalValue(
  Symbol.for("@effect/data/Debug/runtimeDebug"),
  () => ({
    reportUnhandled: true,
    minumumLogLevel: "Info",
    traceStackLimit: 5,
    tracingEnabled: true,
    parseStack: (error) => {
      const stack = error.stack
      if (stack) {
        const lines = stack.split("\n")
        let starts = 0
        for (let i = 0; i < lines.length; i++) {
          if (lines[i]!.startsWith("Error")) {
            starts = i
          }
        }
        const frames: Array<Frame | undefined> = []
        for (let i = starts + 1; i < lines.length; i++) {
          if (lines[i].includes("at")) {
            const blocks = lines[i].split(" ").filter((i) => i.length > 0 && i !== "at")
            const name = blocks.length === 2 && !blocks[0].includes("<anonymous>") ? blocks[0] : undefined
            const file = blocks.length === 2 ? blocks[1] : blocks[0]
            const matchFrame = file?.match(/\(?(.*):(\d+):(\d+)/)
            if (matchFrame) {
              frames.push({
                name,
                fileName: matchFrame[1],
                line: Number.parseInt(matchFrame[2]),
                column: Number.parseInt(matchFrame[3])
              })
            } else {
              frames.push(undefined)
            }
          } else {
            frames.push(undefined)
          }
        }
        return frames
      }
      return []
    },
    filterStackFrame: (_) => _ != null && !_.fileName.match(/\/internal_effect_untraced/)
  })
)

const sourceLocationProto = Object.setPrototypeOf(
  {
    toFrame(this: SourceLocation) {
      if ("parsed" in this) {
        return this.parsed
      }
      const stack = runtimeDebug.parseStack(this)
      if (stack && stack.length >= 2 && stack[0] && stack[1]) {
        this.parsed = {
          ...stack[this.depth - 1]!,
          name: stack[this.depth - 2]?.name
        }
      } else {
        this.parsed = undefined
      }
      return this.parsed
    }
  },
  Error.prototype
)

/**
 * @since 1.0.0
 * @category tracing
 */
export const sourceLocation = (error: Error): SourceLocation => {
  ;(error as SourceLocation).depth = Error.stackTraceLimit
  Object.setPrototypeOf(error, sourceLocationProto)
  return (error as SourceLocation)
}

/**
 * @since 1.0.0
 * @category tracing
 */
export const bodyWithTrace = <A>(
  body: (
    trace: Trace,
    restore: Restore
  ) => A
) => {
  if (!runtimeDebug.tracingEnabled) {
    return body(void 0, restoreOff)
  }
  runtimeDebug.tracingEnabled = false
  try {
    const limit = Error.stackTraceLimit
    Error.stackTraceLimit = 3
    const source = sourceLocation(new Error())
    Error.stackTraceLimit = limit
    return body(source as SourceLocation, restoreOn)
  } finally {
    runtimeDebug.tracingEnabled = true
  }
}

/**
 * @since 1.0.0
 * @category tracing
 */
export const methodWithTrace = <A extends (...args: Array<any>) => any>(
  body: ((trace: Trace, restore: Restore) => A)
): A => {
  // @ts-expect-error
  return function() {
    if (!runtimeDebug.tracingEnabled) {
      // @ts-expect-error
      return body(void 0, restoreOff).apply(this, arguments)
    }
    runtimeDebug.tracingEnabled = false
    try {
      const limit = Error.stackTraceLimit
      Error.stackTraceLimit = 2
      const error = sourceLocation(new Error())
      Error.stackTraceLimit = limit
      // @ts-expect-error
      return body(error, restoreOn).apply(this, arguments)
    } finally {
      runtimeDebug.tracingEnabled = true
    }
  }
}

/**
 * @since 1.0.0
 * @category tracing
 */
export const pipeableWithTrace = <A extends (...args: Array<any>) => any>(
  body: ((trace: Trace, restore: Restore) => A)
): A => {
  // @ts-expect-error
  return function() {
    if (!runtimeDebug.tracingEnabled) {
      const a = body(void 0, restoreOff)
      // @ts-expect-error
      return ((self: any) => untraced(() => a.apply(this, arguments)(self))) as any
    }
    runtimeDebug.tracingEnabled = false
    try {
      const limit = Error.stackTraceLimit
      Error.stackTraceLimit = 2
      const source = sourceLocation(new Error())
      Error.stackTraceLimit = limit
      const f = body(source, restoreOn)
      // @ts-expect-error
      return ((self: any) => untraced(() => f.apply(this, arguments)(self))) as any
    } finally {
      runtimeDebug.tracingEnabled = true
    }
  }
}

/**
 * @since 1.0.0
 * @category tracing
 */
export const dualWithTrace: {
  <DataLast extends (...args: Array<any>) => any, DataFirst extends (...args: Array<any>) => any>(
    dfLen: Parameters<DataFirst>["length"],
    body: (trace: Trace, restore: Restore) => DataFirst
  ): DataLast & DataFirst
  <DataLast extends (...args: Array<any>) => any, DataFirst extends (...args: Array<any>) => any>(
    isDataFirst: (args: IArguments) => boolean,
    body: (trace: Trace, restore: Restore) => DataFirst
  ): DataLast & DataFirst
} = (dfLen, body) => {
  const isDataFirst: (args: IArguments) => boolean = typeof dfLen === "number" ?
    ((args) => args.length === dfLen) :
    dfLen
  return function() {
    if (!runtimeDebug.tracingEnabled) {
      const f = body(void 0, restoreOff)
      if (isDataFirst(arguments)) {
        // @ts-expect-error
        return untraced(() => f.apply(this, arguments))
      }
      return ((self: any) => untraced(() => f(self, ...arguments))) as any
    }
    runtimeDebug.tracingEnabled = false
    try {
      const limit = Error.stackTraceLimit
      Error.stackTraceLimit = 2
      const source = sourceLocation(new Error())
      Error.stackTraceLimit = limit
      const f = body(source, restoreOn)
      if (isDataFirst(arguments)) {
        // @ts-expect-error
        return untraced(() => f.apply(this, arguments))
      }
      return ((self: any) => untraced(() => f(self, ...arguments))) as any
    } finally {
      runtimeDebug.tracingEnabled = true
    }
  }
}

/**
 * @since 1.0.0
 * @category tracing
 */
export const untraced = <A>(
  body: (restore: Restore) => A
) => {
  if (!runtimeDebug.tracingEnabled) {
    return body(restoreOff)
  }
  runtimeDebug.tracingEnabled = false
  try {
    return body(restoreOn)
  } finally {
    runtimeDebug.tracingEnabled = true
  }
}

/**
 * @since 1.0.0
 * @category tracing
 */
export const untracedDual = <
  DataLast extends (...args: Array<any>) => any,
  DataFirst extends (...args: Array<any>) => any
>(
  dfLen: Parameters<DataFirst>["length"],
  body: ((restore: Restore) => DataFirst)
): DataLast & DataFirst => {
  // @ts-expect-error
  return function() {
    if (!runtimeDebug.tracingEnabled) {
      const f = body(restoreOff)
      if (arguments.length === dfLen) {
        // @ts-expect-error
        return untraced(() => f.apply(this, arguments))
      }
      return ((self: any) => untraced(() => f(self, ...arguments))) as any
    }
    runtimeDebug.tracingEnabled = false
    try {
      const f = body(restoreOn)
      if (arguments.length === dfLen) {
        // @ts-expect-error
        return untraced(() => f.apply(this, arguments))
      }
      return ((self: any) => untraced(() => f(self, ...arguments))) as any
    } finally {
      runtimeDebug.tracingEnabled = true
    }
  }
}

/**
 * @since 1.0.0
 * @category tracing
 */
export const untracedMethod = <A extends (...args: Array<any>) => any>(
  body: ((restore: Restore) => A)
): A => {
  // @ts-expect-error
  return function() {
    if (!runtimeDebug.tracingEnabled) {
      // @ts-expect-error
      return untraced(() => body(restoreOff).apply(this, arguments))
    }
    runtimeDebug.tracingEnabled = false
    try {
      // @ts-expect-error
      return untraced(() => body(restoreOn).apply(this, arguments))
    } finally {
      runtimeDebug.tracingEnabled = true
    }
  }
}

/**
 * @since 1.0.0
 * @category tracing
 */
export const traced = <A>(
  body: (restore: Restore) => A
) => {
  if (runtimeDebug.tracingEnabled) {
    return body(restoreOn)
  }
  runtimeDebug.tracingEnabled = true
  try {
    return body(restoreOff)
  } finally {
    runtimeDebug.tracingEnabled = false
  }
}

/**
 * @since 1.0.0
 * @category restore
 */
export const restoreOn: Restore = (body): any =>
  function() {
    if (runtimeDebug.tracingEnabled) {
      // @ts-expect-error
      return body.apply(this, arguments)
    }
    runtimeDebug.tracingEnabled = true
    try {
      // @ts-expect-error
      return body.apply(this, arguments)
    } finally {
      runtimeDebug.tracingEnabled = false
    }
  }

/**
 * @since 1.0.0
 * @category restore
 */
export const restoreOff: Restore = (body): any =>
  function() {
    if (!runtimeDebug.tracingEnabled) {
      // @ts-expect-error
      return body.apply(this, arguments)
    }
    runtimeDebug.tracingEnabled = false
    try {
      // @ts-expect-error
      return body.apply(this, arguments)
    } finally {
      runtimeDebug.tracingEnabled = true
    }
  }

/**
 * @since 1.0.0
 * @category models
 */
export interface Traced<T> {
  readonly _tag: "Traced"
  readonly i0: T
  readonly trace: SourceLocation
  traced(this: this, trace: Trace): Traced<this> | this
}

const EffectTypeId = Symbol.for("@effect/io/Effect")

class TracedPrimitive<T> implements Traced<T> {
  readonly _tag = "Traced"
  public i1 = undefined
  public i2 = undefined;
  [EffectTypeId] = effectVariance;
  [Equal.symbol](this: {}, that: unknown) {
    return this === that
  }
  [Hash.symbol](this: {}) {
    return Hash.random(this)
  }
  constructor(readonly i0: T, readonly trace: SourceLocation) {}
  traced(this: this, trace: Trace): Traced<this> | this {
    if (trace) {
      return new TracedPrimitive(this, trace)
    }
    return this
  }
}

/** @internal */
const effectVariance = {
  _R: (_: never) => _,
  _E: (_: never) => _,
  _A: (_: never) => _
}

/**
 * @since 1.0.0
 * @category tracing
 */
export const makeTraced = <T>(self: T, source: SourceLocation): Traced<T> => new TracedPrimitive(self, source)
