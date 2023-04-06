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
  [A] extends [{
    [typeSymbol]?: any
    [unifySymbol]?: () => any
  }] ? NonNullable<
    (A & {
      [typeSymbol]: A
    })[unifySymbol]
  >
    : () => A
>

declare module "@effect/data/Either" {
  interface Left<E, A> {
    [typeSymbol]?: unknown
    [unifySymbol]?: () => this[typeSymbol] extends Either.Either<infer E0, infer A0> ? Either.Either<E0, A0>
      : this[typeSymbol]
  }
  interface Right<E, A> {
    [typeSymbol]?: unknown
    [unifySymbol]?: () => this[typeSymbol] extends Either.Either<infer E0, infer A0> ? Either.Either<E0, A0>
      : this[typeSymbol]
  }
}

declare module "@effect/data/Option" {
  interface Some<A> {
    [typeSymbol]?: unknown
    [unifySymbol]?: () => this[typeSymbol] extends Option.Option<infer A0> ? Option.Option<A0>
      : this[typeSymbol]
  }
  interface None<A> {
    [typeSymbol]?: unknown
    [unifySymbol]?: () => this[typeSymbol] extends Option.Option<infer A0> ? Option.Option<A0>
      : this[typeSymbol]
  }
}
