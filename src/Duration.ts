/**
 * @since 1.0.0
 */
import * as DE from "@fp-ts/data/DeepEqual"
import * as DH from "@fp-ts/data/DeepHash"

const TypeId: unique symbol = Symbol.for("@fp-ts/data/Duration")

/**
 * @since 1.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * @since 1.0.0
 * @category model
 */
export interface Duration {
  readonly _id: TypeId
  readonly millis: number
}

/** @internal */
class DurationImpl implements DE.DeepEqual {
  readonly _id: TypeId = TypeId
  constructor(readonly millis: number) {}
  [DH.DeepHash.symbol](): number {
    return DH.deepHash(this.millis)
  }
  [DE.DeepEqual.symbol](that: unknown): boolean {
    return isDuration(that) && this.millis === that.millis
  }
}

/**
 * @since 1.0.0
 * @category guards
 */
export const isDuration = (u: unknown): u is Duration =>
  typeof u === "object" && u != null && "_id" in u && u["_id"] === TypeId

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
 * @category mutations
 */
export const times = (times: number) =>
  (self: Duration): Duration => new DurationImpl(self.millis * times)

/**
 * @since 1.0.0
 * @category mutations
 */
export const add = (that: Duration) =>
  (self: Duration): Duration => new DurationImpl(self.millis + that.millis)

/**
 * @since 1.0.0
 * @category mutations
 */
export const subtract = (that: Duration) =>
  (self: Duration): Duration => new DurationImpl(self.millis - that.millis)

/**
 * @since 1.0.0
 * @category comparisons
 */
export const lessThan = (that: Duration) => (self: Duration): boolean => self.millis < that.millis

/**
 * @since 1.0.0
 * @category comparisons
 */
export const lessThanOrEqualTo = (that: Duration) =>
  (self: Duration): boolean => self.millis <= that.millis

/**
 * @since 1.0.0
 * @category comparisons
 */
export const greaterThan = (that: Duration) =>
  (self: Duration): boolean => self.millis > that.millis

/**
 * @since 1.0.0
 * @category comparisons
 */
export const greaterThanOrEqualTo = (that: Duration) =>
  (self: Duration): boolean => self.millis >= that.millis

/**
 * @since 1.0.0
 * @category comparisons
 */
export const equals = (that: Duration) => (self: Duration): boolean => self.millis === that.millis
