/**
 * A collection of types that are commonly used types.
 *
 * @since 1.0.0
 */

/**
 * Returns the tags in a type.
 * @example
 * import { Tags } from "@effect/data/Types"
 *
 * type Res = Tags<string | { _tag: "a" } | { _tag: "b" } > // "a" | "b"
 *
 * @category types
 * @since 1.0.0
 */
export type Tags<E> = E extends { _tag: string } ? E["_tag"] : never

/**
 * Excludes the tagged object from the type.
 * @example
 * import { ExcludeTag } from "@effect/data/Types"
 *
 * type Res = ExcludeTag<string | { _tag: "a" } | { _tag: "b" }, "a"> // string | { _tag: "b" }
 *
 * @category types
 * @since 1.0.0
 */
export type ExcludeTag<E, K extends Tags<E>> = Exclude<E, { _tag: K }>

/**
 * Extracts the type of the given tag.
 *
 * @example
 * import { ExtractTag } from "@effect/data/Types"
 *
 * type Res = ExtractTag<{ _tag: "a", a: number } | { _tag: "b", b: number }, "b"> // { _tag: "b", b: number }
 *
 * @category types
 * @since 1.0.0
 */
export type ExtractTag<E, K extends Tags<E>> = Extract<E, { _tag: K }>

/**
 * A utility type that transforms a union type `T` into an intersection type.
 *
 * @since 1.0.0
 * @category types
 */
export type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R
  : never

/**
 * Simplifies the type signature of a type.
 *
 * @example
 * import { Simplify } from "@effect/data/Types"
 *
 * type Res = Simplify<{ a: number } & { b: number }> // { a: number; b: number; }
 *
 * @since 1.0.0
 * @category types
 */
export type Simplify<A> = {
  [K in keyof A]: A[K]
} extends infer B ? B : never

/**
 * Determines if two types are equal.
 *
 * @example
 * import { Equals } from "@effect/data/Types"
 *
 * type Res1 = Equals<{ a: number }, { a: number }> // true
 * type Res2 = Equals<{ a: number }, { b: number }> // false
 *
 * @since 1.0.0
 * @category models
 */
export type Equals<X, Y> = (<T>() => T extends X ? 1 : 2) extends <
  T
>() => T extends Y ? 1 : 2 ? true
  : false
