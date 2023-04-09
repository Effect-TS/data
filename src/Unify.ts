/**
 * @since 1.0.0
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
import type * as Context from "@effect/data/Context"
import type * as Either from "@effect/data/Either"
import { identity } from "@effect/data/Function"
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
    [unifySymbol]?: () => this[typeSymbol] extends Either.Either<infer E0, infer A0> | infer _ ? Either.Either<E0, A0>
      : never
  }
}

declare module "@effect/data/Context" {
  interface Tag<Identifier, Service> {
    [typeSymbol]?: unknown
    [unifySymbol]?: () => this[typeSymbol] extends Context.Tag<infer I0, infer S0> | infer _ ? Context.Tag<I0, S0>
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

/**
 * @since 1.0.0
 */
export const unify: {
  <
    Args extends Array<any>,
    Args2 extends Array<any>,
    Args3 extends Array<any>,
    Args4 extends Array<any>,
    Args5 extends Array<any>,
    T
  >(
    x: (...args: Args) => (...args: Args2) => (...args: Args3) => (...args: Args4) => (...args: Args5) => T
  ): (...args: Args) => (...args: Args2) => (...args: Args3) => (...args: Args4) => (...args: Args5) => Unify<T>
  <
    Args extends Array<any>,
    Args2 extends Array<any>,
    Args3 extends Array<any>,
    Args4 extends Array<any>,
    T
  >(
    x: (...args: Args) => (...args: Args2) => (...args: Args3) => (...args: Args4) => T
  ): (...args: Args) => (...args: Args2) => (...args: Args3) => (...args: Args4) => Unify<T>
  <
    Args extends Array<any>,
    Args2 extends Array<any>,
    Args3 extends Array<any>,
    T
  >(
    x: (...args: Args) => (...args: Args2) => (...args: Args3) => T
  ): (...args: Args) => (...args: Args2) => (...args: Args3) => Unify<T>
  <
    Args extends Array<any>,
    Args2 extends Array<any>,
    T
  >(
    x: (...args: Args) => (...args: Args2) => T
  ): (...args: Args) => (...args: Args2) => Unify<T>
  <
    Args extends Array<any>,
    T
  >(x: (...args: Args) => T): (...args: Args) => Unify<T>
  <T>(x: T): Unify<T>
} = identity as any
