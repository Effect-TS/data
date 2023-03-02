/**
 * @since 1.0.0
 */
import * as Equal from "@effect/data/Equal"
import { zeroArgsDual } from "@effect/data/Function"
import * as Hash from "@effect/data/Hash"

/**
 * @category models
 * @since 1.0.0
 */
export type Data<A extends Readonly<Record<string, any>> | ReadonlyArray<any>> =
  & Readonly<A>
  & Equal.Equal

/**
 * `Case` represents a datatype similar to a case class in Scala. Namely, a
 * datatype created using `Case` will, by default, provide an implementation
 * for a constructor, `Hash`, and `Equal`.
 *
 * @since 1.0.0
 * @category models
 */
export interface Case extends Equal.Equal {}

export declare namespace Case {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface Constructor<A extends Case, T extends keyof A = never> {
    (args: Omit<A, T | keyof Equal.Equal> extends Record<PropertyKey, never> ? void : Omit<A, T | keyof Equal.Equal>): A
  }
}

const protoArr: Equal.Equal = (() => {
  const proto = {
    [Hash.symbol](this: Array<any>) {
      return Hash.array(this)
    },
    [Equal.symbol](this: Array<any>, that: Equal.Equal) {
      if (Array.isArray(that) && this.length === that.length) {
        return this.every((v, i) => Equal.equals(v, (that as Array<any>)[i]))
      } else {
        return false
      }
    }
  }
  return Object.setPrototypeOf(proto, Array.prototype)
})()

const protoStruct: Equal.Equal = (() => {
  const proto = {
    [Hash.symbol](this: Equal.Equal) {
      return Hash.structure(this)
    },
    [Equal.symbol](this: Equal.Equal, that: Equal.Equal) {
      const selfKeys = Object.keys(this)
      const thatKeys = Object.keys(that as object)
      if (selfKeys.length !== thatKeys.length) {
        return false
      }
      for (const key of selfKeys) {
        if (!(key in (that as object) && Equal.equals(this[key], (that as object)[key]))) {
          return false
        }
      }
      return true
    }
  }
  return Object.setPrototypeOf(proto, Object.prototype)
})()

/**
 * @category constructors
 * @since 1.0.0
 */
export const struct: {
  <As extends Readonly<Record<string, any>>>(as: As): Data<As>
  (_?: never): <As extends Readonly<Record<string, any>>>(as: As) => Data<As>
} = zeroArgsDual((as) => unsafeStruct(Object.assign({}, as)))

/**
 * @category constructors
 * @since 1.0.0
 */
export const unsafeStruct: {
  <As extends Readonly<Record<string, any>>>(as: As): Data<As>
  (_?: never): <As extends Readonly<Record<string, any>>>(as: As) => Data<As>
} = zeroArgsDual((as) => Object.setPrototypeOf(as, protoStruct))

/**
 * @category constructors
 * @since 1.0.0
 */
export const tuple = <As extends ReadonlyArray<any>>(...as: As): Data<As> => unsafeArray(as)

/**
 * @category constructors
 * @since 1.0.0
 */
export const array: {
  <As extends ReadonlyArray<any>>(as: As): Data<As>
  (_?: never): <As extends ReadonlyArray<any>>(as: As) => Data<As>
} = zeroArgsDual(<As extends ReadonlyArray<any>>(as: As): Data<As> => unsafeArray(as.slice(0) as unknown as As))

/**
 * @category constructors
 * @since 1.0.0
 */
export const unsafeArray: {
  <As extends ReadonlyArray<any>>(as: As): Data<As>
  (_?: never): <As extends ReadonlyArray<any>>(as: As) => Data<As>
} = zeroArgsDual((as) => Object.setPrototypeOf(as, protoArr))

const _case = <A extends Case>(_: void): Case.Constructor<A> =>
  (args) => (args === undefined ? struct({}) : struct(args)) as any

export {
  /**
   * Provides a constructor for the specified `Case`.
   *
   * @since 1.0.0
   * @category constructors
   */
  _case as case
}

/**
 * Provides a tagged constructor for the specified `Case`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const tagged: {
  <A extends Case & { _tag: string }>(tag: A["_tag"]): Case.Constructor<A, "_tag">
  (_?: never): <A extends Case & { _tag: string }>(tag: A["_tag"]) => Case.Constructor<A, "_tag">
} = zeroArgsDual(<A extends Case & { _tag: string }>(
  tag: A["_tag"]
): Case.Constructor<A, "_tag"> =>
  // @ts-expect-error
  (args) => args === undefined ? struct({}) : struct({ _tag: tag, ...args })
)

/**
 * Provides a Tagged constructor for a Case Class.
 *
 * @since 1.0.0
 * @category constructors
 */
export const TaggedClass: {
  <Key extends string>(
    tag: Key
  ): <A extends Record<string, any>>() => new(
    args: Omit<A, keyof Equal.Equal | "_tag">
  ) => Readonly<A> & Equal.Equal & { readonly _tag: Key }
  (_?: never): <Key extends string>(
    tag: Key
  ) => <A extends Record<string, any>>() => new(
    args: Omit<A, keyof Equal.Equal | "_tag">
  ) => Readonly<A> & Equal.Equal & { readonly _tag: Key }
} = zeroArgsDual(<Key extends string>(
  tag: Key
) =>
  <A extends Record<string, any>>() => {
    class Base {
      readonly _tag = tag
      constructor(args: Omit<A, "_tag" | keyof Equal.Equal>) {
        Object.assign(this, args)
        unsafeStruct(this)
      }
    }
    return Base as unknown as { new(args: Omit<A, "_tag" | keyof Equal.Equal>): Data<A> & { readonly _tag: Key } }
  }
)

/**
 * Provides a constructor for a Case Class.
 *
 * @since 1.0.0
 * @category constructors
 */
export const Class = <A extends Record<string, any>>(_: void) => {
  class Base {
    constructor(args: Omit<A, keyof Equal.Equal>) {
      Object.assign(this, args)
      unsafeStruct(this)
    }
  }
  return Base as unknown as { new(args: Omit<A, keyof Equal.Equal>): Data<A> }
}
