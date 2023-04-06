/**
 * @since 1.0.0
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import type * as Either from "@effect/data/Either"
import type * as Option from "@effect/data/Option"

/**
 * @since 1.0.0
 */
export declare const unifySymbol: unique symbol

/**
 * @since 1.0.0
 */
export type unifySymbol = typeof unifySymbol

/**
 * @since 1.0.0
 */
export declare const typeSymbol: unique symbol

/**
 * @since 1.0.0
 */
export type typeSymbol = typeof typeSymbol

/**
 * @since 1.0.0
 */
export type Unify<A> = ReturnType<
  NonNullable<
    (
      & Extract<A, {
        [typeSymbol]?: any
        [unifySymbol]?: () => any
      }>
      & {
        [typeSymbol]: A
      }
    )[unifySymbol]
  >
> extends infer Z ? Z | Exclude<A, Z> : never

declare module "@effect/data/Either" {
  interface Left<E, A> {
    [typeSymbol]?: unknown
    [unifySymbol]?: () => this[typeSymbol] extends Either.Either<infer E0, infer A0> | infer Z ? Either.Either<E0, A0>
      : never
  }
  interface Right<E, A> {
    [typeSymbol]?: unknown
    [unifySymbol]?: () => this[typeSymbol] extends Either.Either<infer E0, infer A0> | infer Z ? Either.Either<E0, A0>
      : never
  }
}

declare module "@effect/data/Option" {
  interface Some<A> {
    [typeSymbol]?: unknown
    [unifySymbol]?: () => this[typeSymbol] extends Option.Option<infer A0> | infer Z ? Option.Option<A0>
      : never
  }
  interface None<A> {
    [typeSymbol]?: unknown
    [unifySymbol]?: () => this[typeSymbol] extends Option.Option<infer A0> | infer Z ? Option.Option<A0>
      : never
  }
}
