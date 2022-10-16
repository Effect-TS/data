/**
 * @since 1.0.0
 */
import * as Equal from "@fp-ts/data/Equal"
import * as Hash from "@fp-ts/data/Hash"

const TypeId: unique symbol = Symbol.for("@fp-ts/data/MutableRef") as TypeId

/**
 * @since 1.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * @since 1.0.0
 * @category models
 */
export interface MutableRef<T> extends Equal.Equal {
  readonly _id: TypeId
  readonly _T: (_: never) => T

  /** @internal */
  current: T
}

class MutableRefImpl<T> implements MutableRef<T> {
  _T: (_: never) => T = (_) => _
  _id: typeof TypeId = TypeId
  constructor(public current: T) {}
  [Equal.symbol](that: unknown) {
    return this === that
  }
  [Hash.symbol]() {
    return Hash.random(this)
  }
}

/**
 * @since 1.0.0
 * @category constructors
 */
export const make = <T>(value: T): MutableRef<T> => new MutableRefImpl(value)

/**
 * @since 1.0.0
 * @category constructors
 */
export const MutableRef = <T>(value: T): MutableRef<T> => new MutableRefImpl(value)

/**
 * @since 1.0.0
 * @category general
 */
export const get = <T>(self: MutableRef<T>): T => self.current

/**
 * @since 1.0.0
 * @category general
 */
export const set = <T>(value: T) =>
  (self: MutableRef<T>): MutableRef<T> => (self.current = value, self)

/**
 * @since 1.0.0
 * @category general
 */
export const setAndGet = <T>(value: T) =>
  (self: MutableRef<T>): T => (self.current = value, self.current)

/**
 * @since 1.0.0
 * @category general
 */
export const getAndSet = <T>(value: T) =>
  (self: MutableRef<T>): T => {
    const current = self.current
    self.current = value
    return current
  }

/**
 * @since 1.0.0
 * @category general
 */
export const compareAndSet = <T>(oldValue: T, newValue: T) =>
  (self: MutableRef<T>): boolean => {
    if (Equal.equals(oldValue, self.current)) {
      self.current = newValue
      return true
    }
    return false
  }

/**
 * @since 1.0.0
 * @category numeric
 */
export const incrementAndGet = (self: MutableRef<number>): number => {
  self.current = self.current + 1
  return self.current
}

/**
 * @since 1.0.0
 * @category numeric
 */
export const getAndIncrement = (self: MutableRef<number>): number => {
  const current = self.current
  self.current = self.current + 1
  return current
}

/**
 * @since 1.0.0
 * @category numeric
 */
export const decrementAndGet = (self: MutableRef<number>): number => {
  self.current = self.current - 1
  return self.current
}

/**
 * @since 1.0.0
 * @category numeric
 */
export const getAndDecrement = (self: MutableRef<number>): number => {
  const current = self.current
  self.current = self.current + 1
  return current
}
