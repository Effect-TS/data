/**
 * @since 1.0.0
 */
import * as Equal from "@effect/data/Equal"
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
        if (!(key in (that as object) && Equal.equals((this as any)[key], (that as any)[key]))) {
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
export const struct = <As extends Readonly<Record<string, any>>>(as: As): Data<As> =>
  unsafeStruct(Object.assign({}, as))

/**
 * @category constructors
 * @since 1.0.0
 */
export const unsafeStruct = <As extends Readonly<Record<string, any>>>(as: As): Data<As> =>
  Object.setPrototypeOf(as, protoStruct)

/**
 * @category constructors
 * @since 1.0.0
 */
export const tuple = <As extends ReadonlyArray<any>>(...as: As): Data<As> => unsafeArray(as)

/**
 * @category constructors
 * @since 1.0.0
 */
export const array = <As extends ReadonlyArray<any>>(as: As): Data<As> => unsafeArray(as.slice(0) as unknown as As)

/**
 * @category constructors
 * @since 1.0.0
 */
export const unsafeArray = <As extends ReadonlyArray<any>>(as: As): Data<As> => Object.setPrototypeOf(as, protoArr)

const _case = <A extends Case>(): Case.Constructor<A> =>
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
export const tagged = <A extends Case & { _tag: string }>(
  tag: A["_tag"]
): Case.Constructor<A, "_tag"> =>
  // @ts-expect-error
  (args) => args === undefined ? struct({ _tag: tag }) : struct({ ...args, _tag: tag })

/**
 * @since 1.0.0
 * @category models
 */
export type IsEqualTo<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2 ? true
  : false

/**
 * Provides a Tagged constructor for a Case Class.
 *
 * @since 1.0.0
 * @category constructors
 */
export const TaggedClass = <Key extends string>(
  tag: Key
): new<A extends Record<string, any>>(
  args: IsEqualTo<Omit<A, keyof Equal.Equal>, {}> extends true ? void : Omit<A, keyof Equal.Equal>
) => Data<A & { _tag: Key }> => {
  class Base extends (Class as any) {
    readonly _tag = tag
  }
  return Base as any
}

/**
 * Provides a constructor for a Case Class.
 *
 * @since 1.0.0
 * @category constructors
 */
export const Class: new<A extends Record<string, any>>(
  args: IsEqualTo<Omit<A, keyof Equal.Equal>, {}> extends true ? void : Omit<A, keyof Equal.Equal>
) => Data<A> = (() => {
  class Base<A> {
    constructor(args: Omit<A, keyof Equal.Equal>) {
      if (args) {
        Object.assign(this, args)
      }
    }
    [Hash.symbol](this: Equal.Equal) {
      return Hash.structure(this)
    }
    [Equal.symbol](this: Equal.Equal, that: Equal.Equal) {
      const selfKeys = Object.keys(this)
      const thatKeys = Object.keys(that as object)
      if (selfKeys.length !== thatKeys.length) {
        return false
      }
      for (const key of selfKeys) {
        if (!(key in (that as object) && Equal.equals((this as any)[key], (that as any)[key]))) {
          return false
        }
      }
      return true
    }
  }
  return Base as any
})()

type Simplify<A> = { [K in keyof A]: A[K] } & {}

/**
 * @category models
 * @since 1.0.0
 */
export type ADT<A extends Record<string, Record<string, any>>> = {
  [K in keyof A]: Data<Simplify<Readonly<A[K]> & { readonly _tag: K }>>
}[keyof A]

/**
 * @since 1.0.0
 */
export namespace ADT {
  type Tag<A extends { _tag: string }> = A["_tag"]

  type Value<A extends { _tag: string }, K extends A["_tag"]> = Omit<
    Extract<A, { _tag: K }>,
    "_tag" | keyof Case
  > extends infer T ? {} extends T ? void
  : T
    : never

  type Result<A extends { _tag: string }, K extends A["_tag"]> = Extract<
    A,
    { _tag: K }
  >

  /**
   * @category model
   * @since 1.0.0
   */
  export interface Constructor {
    readonly A: unknown
    readonly B: unknown
    readonly C: unknown
    readonly D: unknown
  }

  type Kind<
    F extends Constructor,
    A = unknown,
    B = unknown,
    C = unknown,
    D = unknown
  > = F extends {
    adt: { _tag: string }
  } ? (F & {
    readonly A: A
    readonly B: B
    readonly C: C
    readonly D: D
  })["adt"]
    : never

  /**
   * @category model
   * @since 1.0.0
   */
  export type Constructor1<F extends Constructor> = <K extends Tag<Kind<F>>>(
    tag: K
  ) => <A>(value: Value<Kind<F, A>, K>) => Result<Kind<F, A>, K>

  /**
   * @category model
   * @since 1.0.0
   */
  export type Constructor2<F extends Constructor> = <K extends Tag<Kind<F>>>(
    tag: K
  ) => <A, B>(value: Value<Kind<F, A, B>, K>) => Result<Kind<F, A, B>, K>

  /**
   * @category model
   * @since 1.0.0
   */
  export type Constructor3<F extends Constructor> = <K extends Tag<Kind<F>>>(
    tag: K
  ) => <A, B, C>(
    value: Value<Kind<F, A, B, C>, K>
  ) => Result<Kind<F, A, B, C>, K>

  /**
   * @category model
   * @since 1.0.0
   */
  export type Constructor4<F extends Constructor> = <K extends Tag<Kind<F>>>(
    tag: K
  ) => <A, B = unknown, C = unknown, D = unknown>(
    value: Value<Kind<F, A, B, C, D>, K>
  ) => Result<Kind<F, A, B, C, D>, K>
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const adt = <A extends ADT.Constructor>(): ADT.Constructor4<A> => tagged as any
/**
 * @category constructors
 * @since 1.0.0
 */
export const adt1 = <A extends ADT.Constructor>(): ADT.Constructor1<A> => tagged as any
/**
 * @category constructors
 * @since 1.0.0
 */
export const adt2 = <A extends ADT.Constructor>(): ADT.Constructor2<A> => tagged as any
/**
 * @category constructors
 * @since 1.0.0
 */
export const adt3 = <A extends ADT.Constructor>(): ADT.Constructor3<A> => tagged as any
