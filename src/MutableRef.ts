/**
 * @since 1.0.0
 */
import * as Equal from "@fp-ts/data/Equal"

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

  /**
   * @since 1.0.0
   * @category general
   */
  get<T>(this: MutableRef<T>): T

  /**
   * @since 1.0.0
   * @category general
   */
  set<T>(this: MutableRef<T>, value: T): MutableRef<T>

  /**
   * @since 1.0.0
   * @category general
   */
  update<T>(this: MutableRef<T>, f: (value: T) => T): MutableRef<T>

  /**
   * @since 1.0.0
   * @category general
   */
  updateAndGet<T>(this: MutableRef<T>, f: (value: T) => T): T

  /**
   * @since 1.0.0
   * @category general
   */
  getAndUpdate<T>(this: MutableRef<T>, f: (value: T) => T): T

  /**
   * @since 1.0.0
   * @category general
   */
  setAndGet<T>(this: MutableRef<T>, value: T): T

  /**
   * @since 1.0.0
   * @category general
   */
  getAndSet<T>(this: MutableRef<T>, value: T): T

  /**
   * @since 1.0.0
   * @category general
   */
  compareAndSet<T>(this: MutableRef<T>, oldValue: T, newValue: T): boolean

  /**
   * @since 1.0.0
   * @category general
   */
  pipe<T, B>(this: MutableRef<T>, f: (_: MutableRef<T>) => B): B
}

class MutableRefImpl<T> implements MutableRef<T> {
  _T: (_: never) => T = (_) => _
  _id: typeof TypeId = TypeId
  constructor(public current: T) {}
  [Equal.symbolEqual](that: unknown) {
    return this === that
  }
  [Equal.symbolHash]() {
    return Equal.hashRandom(this)
  }

  get<T>(this: MutableRef<T>): T {
    return this.current
  }

  set<T>(this: MutableRef<T>, value: T): MutableRef<T> {
    this.current = value
    return this
  }

  setAndGet<T>(this: MutableRef<T>, value: T): T {
    this.current = value
    return this.current
  }

  getAndSet<T>(this: MutableRef<T>, value: T): T {
    const ret = this.current
    this.current = value
    return ret
  }

  compareAndSet<T>(this: MutableRef<T>, oldValue: T, newValue: T): boolean {
    if (Equal.equals(oldValue, this.current)) {
      this.current = newValue
      return true
    }
    return false
  }

  pipe<T, B>(this: MutableRef<T>, f: (_: MutableRef<T>) => B): B {
    return f(this)
  }

  update<T>(this: MutableRef<T>, f: (value: T) => T): MutableRef<T> {
    return this.set(f(this.get()))
  }

  updateAndGet<T>(this: MutableRef<T>, f: (value: T) => T): T {
    return this.setAndGet(f(this.get()))
  }

  getAndUpdate<T>(this: MutableRef<T>, f: (value: T) => T): T {
    return this.getAndSet(f(this.get()))
  }

  toString() {
    return `MutableRef(${String(this.current)})`
  }

  toJSON() {
    return {
      _tag: "MutableRef",
      current: this.current
    }
  }

  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toJSON()
  }
}

/**
 * @since 1.0.0
 * @category constructors
 */
export const make = <T>(value: T): MutableRef<T> => new MutableRefImpl(value)

/**
 * @since 1.0.0
 * @category general
 */
export const get = <T>(self: MutableRef<T>): T => self.current

/**
 * @since 1.0.0
 * @category general
 */
export const set = <T>(value: T) => (self: MutableRef<T>): MutableRef<T> => self.set(value)

/**
 * @since 1.0.0
 * @category general
 */
export const update = <T>(f: (value: T) => T) =>
  (self: MutableRef<T>): MutableRef<T> => self.update(f)

/**
 * @since 1.0.0
 * @category general
 */
export const updateAndGet = <T>(f: (value: T) => T) =>
  (self: MutableRef<T>): T => self.updateAndGet(f)

/**
 * @since 1.0.0
 * @category general
 */
export const getAndUpdate = <T>(f: (value: T) => T) =>
  (self: MutableRef<T>): T => self.getAndUpdate(f)

/**
 * @since 1.0.0
 * @category general
 */
export const setAndGet = <T>(value: T) => (self: MutableRef<T>): T => self.setAndGet(value)

/**
 * @since 1.0.0
 * @category general
 */
export const getAndSet = <T>(value: T) => (self: MutableRef<T>): T => self.getAndSet(value)

/**
 * @since 1.0.0
 * @category general
 */
export const compareAndSet = <T>(oldValue: T, newValue: T) =>
  (self: MutableRef<T>): boolean => self.compareAndSet(oldValue, newValue)

/**
 * @since 1.0.0
 * @category numeric
 */
export const incrementAndGet = (self: MutableRef<number>): number => self.updateAndGet((_) => _ + 1)

/**
 * @since 1.0.0
 * @category numeric
 */
export const getAndIncrement = (self: MutableRef<number>): number => self.getAndUpdate((_) => _ + 1)

/**
 * @since 1.0.0
 * @category numeric
 */
export const increment = (self: MutableRef<number>): MutableRef<number> => self.update((_) => _ + 1)

/**
 * @since 1.0.0
 * @category numeric
 */
export const decrementAndGet = (self: MutableRef<number>): number => self.updateAndGet((_) => _ - 1)

/**
 * @since 1.0.0
 * @category numeric
 */
export const getAndDecrement = (self: MutableRef<number>): number => self.getAndUpdate((_) => _ - 1)

/**
 * @since 1.0.0
 * @category numeric
 */
export const decrement = (self: MutableRef<number>): MutableRef<number> => self.update((_) => _ - 1)

/**
 * @since 1.0.0
 * @category boolean
 */
export const toggle = (self: MutableRef<boolean>): MutableRef<boolean> => self.update((_) => !_)
