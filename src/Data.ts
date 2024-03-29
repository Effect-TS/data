/**
 * @since 1.0.0
 */
import * as Equal from "@effect/data/Equal"
import * as Hash from "@effect/data/Hash"
import type * as Types from "@effect/data/Types"

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

/**
 * @since 1.0.0
 */
export declare namespace Case {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface Constructor<A extends Case, T extends keyof A = never> {
    (args: Omit<A, T | keyof Equal.Equal> extends Record<PropertyKey, never> ? void : Omit<A, T | keyof Equal.Equal>): A
  }
}

const protoArr: Equal.Equal = Object.assign(Object.create(Array.prototype), {
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
})

const protoStruct: Equal.Equal = {
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

/**
 * @category constructors
 * @since 1.0.0
 */
export const struct = <As extends Readonly<Record<string, any>>>(as: As): Data<As> =>
  Object.assign(Object.create(protoStruct), as)

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

const _case = <A extends Case>(): Case.Constructor<A> => (args) =>
  (args === undefined ? Object.create(protoStruct) : struct(args)) as any

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
(args) => {
  const value = args === undefined ? Object.create(protoStruct) : struct(args)
  value._tag = tag
  return value
}

/**
 * Provides a Tagged constructor for a Case Class.
 *
 * @since 1.0.0
 * @category constructors
 */
export const TaggedClass = <Key extends string>(
  tag: Key
): new<A extends Record<string, any>>(
  args: Types.Equals<Omit<A, keyof Equal.Equal>, {}> extends true ? void : Omit<A, keyof Equal.Equal>
) => Data<A & { _tag: Key }> => {
  class Base extends (Class as any) {
    readonly _tag = tag
  }
  return Base as any
}

/**
 * @since 1.0.0
 * @category constructors
 */
export class Structural<A> {
  constructor(args: Omit<A, keyof Equal.Equal>) {
    if (args) {
      Object.assign(this, args)
    }
  }
  /**
   * @since 1.0.0
   */
  [Hash.symbol](this: Equal.Equal) {
    return Hash.structure(this)
  }
  /**
   * @since 1.0.0
   */
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

/**
 * Provides a constructor for a Case Class.
 *
 * @since 1.0.0
 * @category constructors
 */
export const Class: new<A extends Record<string, any>>(
  args: Types.Equals<Omit<A, keyof Equal.Equal>, {}> extends true ? void : Omit<A, keyof Equal.Equal>
) => Data<A> = Structural as any

/**
 * Create a tagged enum data type, which is a union of `Data` structs.
 *
 * ```ts
 * import * as Data from "@effect/data/Data"
 *
 * type HttpError = Data.TaggedEnum<{
 *   BadRequest: { status: 400, message: string }
 *   NotFound: { status: 404, message: string }
 * }>
 *
 * // Equivalent to:
 * type HttpErrorPlain =
 *   | Data.Data<{
 *     readonly _tag: "BadRequest"
 *     readonly status: 400
 *     readonly message: string
 *   }>
 *   | Data.Data<{
 *     readonly _tag: "NotFound"
 *     readonly status: 404
 *     readonly message: string
 *   }>
 * ```
 *
 * @since 1.0.0
 * @category models
 */
export type TaggedEnum<A extends Record<string, Record<string, any>>> = {
  readonly [Tag in keyof A]: Data<
    Readonly<Types.Simplify<A[Tag] & { _tag: Tag }>>
  >
}[keyof A]

/**
 * @since 1.0.0
 */
export declare namespace TaggedEnum {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface WithGenerics<Count extends number> {
    readonly taggedEnum: Data<{ readonly _tag: string }>
    readonly numberOfGenerics: Count

    readonly A: unknown
    readonly B: unknown
    readonly C: unknown
    readonly D: unknown
  }

  /**
   * @since 1.0.0
   * @category models
   */
  export type Kind<
    Z extends WithGenerics<number>,
    A = unknown,
    B = unknown,
    C = unknown,
    D = unknown
  > = (Z & {
    readonly A: A
    readonly B: B
    readonly C: C
    readonly D: D
  })["taggedEnum"]

  /**
   * @since 1.0.0
   */
  export type Args<
    A extends Data<{ readonly _tag: string }>,
    K extends A["_tag"]
  > = Omit<
    Extract<A, { readonly _tag: K }>,
    "_tag" | keyof Case
  > extends infer T ? {} extends T ? void
    : T
    : never

  /**
   * @since 1.0.0
   */
  export type Value<
    A extends Data<{ readonly _tag: string }>,
    K extends A["_tag"]
  > = Extract<A, { readonly _tag: K }>
}

/**
 * Create a constructor for a tagged union of `Data` structs.
 *
 * You can also pass a `TaggedEnum.WithGenerics` if you want to add generics to
 * the constructor.
 *
 * @example
 * import * as Data from "@effect/data/Data"
 *
 * const HttpError = Data.taggedEnum<
 *   | Data.Data<{ _tag: "BadRequest"; status: 400; message: string }>
 *   | Data.Data<{ _tag: "NotFound"; status: 404; message: string }>
 * >()
 *
 * const notFound = HttpError("NotFound")({ status: 404, message: "Not Found" })
 *
 * @example
 * import * as Data from "@effect/data/Data"
 *
 * type MyResult<E, A> = Data.TaggedEnum<{
 *   Failure: { error: E }
 *   Success: { value: A }
 * }>
 * interface MyResultDefinition extends Data.TaggedEnum.WithGenerics<2> {
 *   readonly taggedEnum: MyResult<this["A"], this["B"]>
 * }
 * const MyResult = Data.taggedEnum<MyResultDefinition>()
 *
 * const success = MyResult("Success")({ value: 1 })
 *
 * @category constructors
 * @since 1.0.0
 */
export const taggedEnum: {
  <Z extends TaggedEnum.WithGenerics<1>>(): <
    K extends Z["taggedEnum"]["_tag"]
  >(
    tag: K
  ) => <A>(
    args: TaggedEnum.Args<TaggedEnum.Kind<Z, A>, K>
  ) => TaggedEnum.Value<TaggedEnum.Kind<Z, A>, K>

  <Z extends TaggedEnum.WithGenerics<2>>(): <
    K extends Z["taggedEnum"]["_tag"]
  >(
    tag: K
  ) => <A, B>(
    args: TaggedEnum.Args<TaggedEnum.Kind<Z, A, B>, K>
  ) => TaggedEnum.Value<TaggedEnum.Kind<Z, A, B>, K>

  <Z extends TaggedEnum.WithGenerics<3>>(): <
    K extends Z["taggedEnum"]["_tag"]
  >(
    tag: K
  ) => <A, B, C>(
    args: TaggedEnum.Args<TaggedEnum.Kind<Z, A, B, C>, K>
  ) => TaggedEnum.Value<TaggedEnum.Kind<Z, A, B, C>, K>

  <Z extends TaggedEnum.WithGenerics<4>>(): <
    K extends Z["taggedEnum"]["_tag"]
  >(
    tag: K
  ) => <A, B, C, D>(
    args: TaggedEnum.Args<TaggedEnum.Kind<Z, A, B, C, D>, K>
  ) => TaggedEnum.Value<TaggedEnum.Kind<Z, A, B, C, D>, K>

  <A extends Data<{ readonly _tag: string }>>(): <K extends A["_tag"]>(
    tag: K
  ) => Case.Constructor<Extract<A, { readonly _tag: K }>, "_tag">
} = () => tagged as any
