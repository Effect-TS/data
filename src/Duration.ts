/**
 * @since 1.0.0
 */
import * as Equal from "@effect/data/Equal"
import type * as equivalence from "@effect/data/Equivalence"
import { dual } from "@effect/data/Function"
import * as Hash from "@effect/data/Hash"
import * as order from "@effect/data/Order"
import type { Pipeable } from "@effect/data/Pipeable"
import { pipeArguments } from "@effect/data/Pipeable"
import { isBigint, isNumber, isObject } from "@effect/data/Predicate"

const TypeId: unique symbol = Symbol.for("@effect/data/Duration")

const bigint1e3 = BigInt(1_000)
const bigint1e9 = BigInt(1_000_000_000)

/**
 * @since 1.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * @since 1.0.0
 * @category models
 */
export interface Duration extends Equal.Equal, Pipeable<Duration> {
  readonly _id: TypeId
  readonly value: DurationValue
}
/**
 * @since 1.0.0
 * @category models
 */
export type DurationValue =
  | { _tag: "Millis"; millis: number }
  | { _tag: "Nanos"; nanos: bigint }
  | { _tag: "Infinity" }
  | { _tag: "-Infinity" }

/**
 * @since 1.0.0
 * @category models
 */
export type DurationInput =
  | Duration
  | number // millis
  | bigint // nanos
  | `${number} nanos`
  | `${number} micros`
  | `${number} millis`
  | `${number} seconds`
  | `${number} minutes`
  | `${number} hours`
  | `${number} days`
  | `${number} weeks`

const DURATION_REGEX = /^(\d+(?:\.\d+)?)\s+(nanos|micros|millis|seconds|minutes|hours|days|weeks)$/

/**
 * @since 1.0.0
 */
export const decode = (input: DurationInput): Duration => {
  if (isDuration(input)) {
    return input
  } else if (isNumber(input)) {
    return millis(input)
  } else if (isBigint(input)) {
    return nanos(input)
  } else {
    DURATION_REGEX.lastIndex = 0 // Reset the lastIndex before each use
    const match = DURATION_REGEX.exec(input)
    if (match) {
      const [_, valueStr, unit] = match
      const value = Number(valueStr)
      switch (unit) {
        case "nanos":
          return nanos(BigInt(valueStr))
        case "micros":
          return micros(BigInt(valueStr))
        case "millis":
          return millis(value)
        case "seconds":
          return seconds(value)
        case "minutes":
          return minutes(value)
        case "hours":
          return hours(value)
        case "days":
          return days(value)
        case "weeks":
          return weeks(value)
      }
    }
  }
  throw new Error("Invalid duration input")
}

class DurationImpl implements Equal.Equal {
  readonly _id: TypeId = TypeId
  readonly value: DurationValue
  constructor(input: number | bigint) {
    if (typeof input === "number") {
      if (isNaN(input)) {
        this.value = { _tag: "Millis", millis: 0 }
      } else if (!Number.isFinite(input)) {
        this.value = input < 0 ? { _tag: "-Infinity" } : { _tag: "Infinity" }
      } else if (!Number.isInteger(input)) {
        this.value = { _tag: "Nanos", nanos: BigInt(Math.round(input * 1_000_000)) }
      } else {
        this.value = { _tag: "Millis", millis: input }
      }
    } else {
      this.value = { _tag: "Nanos", nanos: input }
    }
  }
  [Hash.symbol](): number {
    return Hash.structure(this.value)
  }
  [Equal.symbol](that: unknown): boolean {
    return isDuration(that) && equals(this, that)
  }
  toString() {
    switch (this.value._tag) {
      case "Millis":
        return `Duration(Millis, ${this.value.millis})`
      case "Nanos":
        return `Duration(Nanos, ${this.value.nanos})`
      case "Infinity":
        return `Duration(Infinity)`
      case "-Infinity":
        return `Duration(-Infinity)`
    }
  }
  toJSON() {
    if (this.value._tag === "Nanos") {
      return {
        _tag: "Duration",
        value: { _tag: "Nanos", hrtime: toHrTime(this) }
      }
    }

    return {
      _tag: "Duration",
      value: this.value
    }
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toJSON()
  }
  pipe() {
    return pipeArguments(this, arguments)
  }
}

/**
 * @since 1.0.0
 * @category guards
 */
export const isDuration = (u: unknown): u is Duration => isObject(u) && "_id" in u && u["_id"] === TypeId

/**
 * @since 1.0.0
 * @category constructors
 */
export const zero: Duration = new DurationImpl(0)

/**
 * @since 1.0.0
 * @category constructors
 */
export const infinity: Duration = new DurationImpl(Infinity)

/**
 * @since 1.0.0
 * @category constructors
 */
export const negativeInfinity: Duration = new DurationImpl(-Infinity)

/**
 * @since 1.0.0
 * @category constructors
 */
export const nanos = (nanos: bigint): Duration => new DurationImpl(nanos)

/**
 * @since 1.0.0
 * @category constructors
 */
export const micros = (micros: bigint): Duration => new DurationImpl(micros * bigint1e3)

/**
 * @since 1.0.0
 * @category constructors
 */
export const millis = (millis: number): Duration => new DurationImpl(millis)

/**
 * @since 1.0.0
 * @category constructors
 */
export const seconds = (seconds: number): Duration => new DurationImpl(seconds * 1000)

/**
 * @since 1.0.0
 * @category constructors
 */
export const minutes = (minutes: number): Duration => new DurationImpl(minutes * 60_000)

/**
 * @since 1.0.0
 * @category constructors
 */
export const hours = (hours: number): Duration => new DurationImpl(hours * 3_600_000)

/**
 * @since 1.0.0
 * @category constructors
 */
export const days = (days: number): Duration => new DurationImpl(days * 86_400_000)

/**
 * @since 1.0.0
 * @category constructors
 */
export const weeks = (weeks: number): Duration => new DurationImpl(weeks * 604_800_000)

/**
 * @since 1.0.0
 * @category getters
 */
export const toMillis = (self: Duration): number => {
  switch (self.value._tag) {
    case "Infinity":
      return Infinity
    case "-Infinity":
      return -Infinity
    case "Nanos":
      return Number(self.value.nanos) / 1_000_000
    case "Millis":
      return self.value.millis
  }
}

/**
 * @since 1.0.0
 * @category getters
 */
export const toHrTime = (self: Duration): readonly [seconds: number, nanos: number] => {
  switch (self.value._tag) {
    case "Infinity":
      return [Infinity, 0]
    case "-Infinity":
      return [-Infinity, 0]
    case "Nanos":
      return [
        Number(self.value.nanos / bigint1e9),
        Number(self.value.nanos % bigint1e9)
      ]
    case "Millis":
      return [
        Math.floor(self.value.millis / 1000),
        Math.round((self.value.millis % 1000) * 1_000_000)
      ]
  }
}

/**
 * @since 1.0.0
 * @category pattern matching
 */
export const match: {
  <A, B>(
    options: {
      readonly onMillis: (millis: number) => A
      readonly onNanos: (nanos: bigint) => B
    }
  ): (self: Duration) => A | B
  <A, B>(
    self: Duration,
    options: {
      readonly onMillis: (millis: number) => A
      readonly onNanos: (nanos: bigint) => B
    }
  ): A | B
} = dual<
  <A, B>(options: {
    readonly onMillis: (millis: number) => A
    readonly onNanos: (nanos: bigint) => B
  }) => (self: Duration) => A | B,
  <A, B>(self: Duration, options: {
    readonly onMillis: (millis: number) => A
    readonly onNanos: (nanos: bigint) => B
  }) => A | B
>(2, (self, { onMillis, onNanos }) => {
  switch (self.value._tag) {
    case "Nanos":
      return onNanos(self.value.nanos)
    case "Infinity":
      return onMillis(Infinity)
    case "-Infinity":
      return onMillis(-Infinity)
    case "Millis":
      return onMillis(self.value.millis)
  }
})

/**
 * @since 1.0.0
 * @category pattern matching
 */
export const matchWith = dual<
  <A, B>(
    that: Duration,
    options: {
      readonly onMillis: (self: number, that: number) => A
      readonly onNanos: (self: bigint, that: bigint) => B
    }
  ) => (self: Duration) => A | B,
  <A, B>(
    self: Duration,
    that: Duration,
    options: {
      readonly onMillis: (self: number, that: number) => A
      readonly onNanos: (self: bigint, that: bigint) => B
    }
  ) => A | B
>(3, (
  self,
  that,
  { onMillis, onNanos }
) => {
  if (
    self.value._tag === "Infinity" ||
    that.value._tag === "Infinity" ||
    self.value._tag === "-Infinity" ||
    that.value._tag === "-Infinity"
  ) {
    return onMillis(
      toMillis(self),
      toMillis(that)
    )
  } else if (self.value._tag === "Nanos" || that.value._tag === "Nanos") {
    const selfNanos = self.value._tag === "Nanos" ?
      self.value.nanos :
      BigInt(Math.round(self.value.millis * 1_000_000))
    const thatNanos = that.value._tag === "Nanos" ?
      that.value.nanos :
      BigInt(Math.round(that.value.millis * 1_000_000))
    return onNanos(selfNanos, thatNanos)
  }

  return onMillis(
    self.value.millis,
    that.value.millis
  )
})

/**
 * @category instances
 * @since 1.0.0
 */
export const Order: order.Order<Duration> = {
  compare: (self, that) =>
    matchWith(self, that, {
      onMillis: (self, that) => (self < that ? -1 : self > that ? 1 : 0),
      onNanos: (self, that) => (self < that ? -1 : self > that ? 1 : 0)
    })
}

/**
 * Checks if a `Duration` is between a `minimum` and `maximum` value.
 *
 * @category predicates
 * @since 1.0.0
 */
export const between: {
  (minimum: Duration, maximum: Duration): (self: Duration) => boolean
  (self: Duration, minimum: Duration, maximum: Duration): boolean
} = order.between(Order)

/**
 * @category instances
 * @since 1.0.0
 */
export const Equivalence: equivalence.Equivalence<Duration> = (self, that) =>
  matchWith(self, that, {
    onMillis: (self, that) => self === that,
    onNanos: (self, that) => self === that
  })

/**
 * @category utils
 * @since 1.0.0
 */
export const min: {
  (that: Duration): (self: Duration) => Duration
  (self: Duration, that: Duration): Duration
} = order.min(Order)

/**
 * @category utils
 * @since 1.0.0
 */
export const max: {
  (that: Duration): (self: Duration) => Duration
  (self: Duration, that: Duration): Duration
} = order.max(Order)

/**
 * @category utils
 * @since 1.0.0
 */
export const clamp: {
  (minimum: Duration, maximum: Duration): (self: Duration) => Duration
  (self: Duration, minimum: Duration, maximum: Duration): Duration
} = order.clamp(Order)

/**
 * @since 1.0.0
 * @category math
 */
export const times: {
  (times: number): (self: Duration) => Duration
  (self: Duration, times: number): Duration
} = dual<
  (times: number) => (self: Duration) => Duration,
  (self: Duration, times: number) => Duration
>(
  2,
  (self, times) =>
    match(self, {
      onMillis: (millis) => new DurationImpl(millis * times),
      onNanos: (nanos) => new DurationImpl(nanos * BigInt(times))
    })
)

/**
 * @since 1.0.0
 * @category math
 */
export const sum: {
  (that: Duration): (self: Duration) => Duration
  (self: Duration, that: Duration): Duration
} = dual<
  (that: Duration) => (self: Duration) => Duration,
  (self: Duration, that: Duration) => Duration
>(
  2,
  (self, that) =>
    matchWith(self, that, {
      onMillis: (self, that) => new DurationImpl(self + that),
      onNanos: (self, that) => new DurationImpl(self + that)
    })
)

/**
 * @since 1.0.0
 * @category math
 */
export const subtract: {
  (that: Duration): (self: Duration) => Duration
  (self: Duration, that: Duration): Duration
} = dual<
  (that: Duration) => (self: Duration) => Duration,
  (self: Duration, that: Duration) => Duration
>(
  2,
  (self, that) =>
    matchWith(self, that, {
      onMillis: (self, that) => new DurationImpl(self - that),
      onNanos: (self, that) => new DurationImpl(self - that)
    })
)

/**
 * @since 1.0.0
 * @category predicates
 */
export const lessThan: {
  (that: Duration): (self: Duration) => boolean
  (self: Duration, that: Duration): boolean
} = dual<
  (that: Duration) => (self: Duration) => boolean,
  (self: Duration, that: Duration) => boolean
>(
  2,
  (self, that) =>
    matchWith(self, that, {
      onMillis: (self, that) => self < that,
      onNanos: (self, that) => self < that
    })
)

/**
 * @since 1.0.0
 * @category predicates
 */
export const lessThanOrEqualTo: {
  (self: Duration, that: Duration): boolean
  (that: Duration): (self: Duration) => boolean
} = dual<
  (that: Duration) => (self: Duration) => boolean,
  (self: Duration, that: Duration) => boolean
>(
  2,
  (self, that) =>
    matchWith(self, that, {
      onMillis: (self, that) => self <= that,
      onNanos: (self, that) => self <= that
    })
)

/**
 * @since 1.0.0
 * @category predicates
 */
export const greaterThan: {
  (that: Duration): (self: Duration) => boolean
  (self: Duration, that: Duration): boolean
} = dual<
  (that: Duration) => (self: Duration) => boolean,
  (self: Duration, that: Duration) => boolean
>(
  2,
  (self, that) =>
    matchWith(self, that, {
      onMillis: (self, that) => self > that,
      onNanos: (self, that) => self > that
    })
)

/**
 * @since 1.0.0
 * @category predicates
 */
export const greaterThanOrEqualTo: {
  (self: Duration, that: Duration): boolean
  (that: Duration): (self: Duration) => boolean
} = dual<
  (that: Duration) => (self: Duration) => boolean,
  (self: Duration, that: Duration) => boolean
>(
  2,
  (self, that) =>
    matchWith(self, that, {
      onMillis: (self, that) => self >= that,
      onNanos: (self, that) => self >= that
    })
)

/**
 * @since 1.0.0
 * @category predicates
 */
export const equals: {
  (that: Duration): (self: Duration) => boolean
  (self: Duration, that: Duration): boolean
} = dual<
  (that: Duration) => (self: Duration) => boolean,
  (self: Duration, that: Duration) => boolean
>(2, Equivalence)
