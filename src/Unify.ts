/**
 * @since 1.0.0
 */

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
export declare const blacklistSymbol: unique symbol

/**
 * @since 1.0.0
 */
export type blacklistSymbol = typeof blacklistSymbol

/**
 * @since 1.0.0
 */
export type MaybeReturn<F> = F extends () => any ? ReturnType<F> : F

/**
 * @since 1.0.0
 */
export type Values<X extends [any, any]> = X extends any
  ? { [k in keyof X[0]]-?: k extends X[1] ? never : MaybeReturn<X[0][k]> }[keyof X[0]]
  : never

/**
 * @since 1.0.0
 */
export type Blacklist<X> = X extends {
  [blacklistSymbol]?: any
} ? keyof NonNullable<X[blacklistSymbol]>
  : never

/**
 * @since 1.0.0
 */
export type ExtractTypes<
  X extends {
    [typeSymbol]?: any
    [unifySymbol]?: any
  }
> = X extends any ? [
  NonNullable<X[unifySymbol]>,
  Blacklist<X>
]
  : never

/**
 * @since 1.0.0
 */
export type Unify<A> = Values<
  ExtractTypes<
    (
      & Extract<A, { [typeSymbol]?: any; [unifySymbol]?: any }>
      & { [typeSymbol]: A }
    )
  >
> extends infer Z ? Z | Exclude<A, Z> : never

declare module "@effect/data/Either" {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  interface Left<E, A> {
    [typeSymbol]?: unknown
    [unifySymbol]?: UnifyEither<this>
  }
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  interface Right<E, A> {
    [typeSymbol]?: unknown
    [unifySymbol]?: UnifyEither<this>
  }
  interface UnifyEither<A extends { [typeSymbol]?: any }> {
    Either?: () => A[typeSymbol] extends Either.Either<infer E0, infer A0> | infer _ ? Either.Either<E0, A0> : never
  }
}

declare module "@effect/data/Context" {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  interface Tag<Identifier, Service> {
    [typeSymbol]?: unknown
    [unifySymbol]?: UnifyTag<this>
  }
  interface UnifyTag<A extends { [typeSymbol]?: any }> {
    Tag?: () => A[typeSymbol] extends Context.Tag<infer I0, infer S0> | infer _ ? Context.Tag<I0, S0> : never
  }
}

declare module "@effect/data/Option" {
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  interface Some<A> {
    [typeSymbol]?: unknown
    [unifySymbol]?: UnifyOption<this>
  }
  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  interface None<A> {
    [typeSymbol]?: unknown
    [unifySymbol]?: UnifyOption<this>
  }
  interface UnifyOption<A extends { [typeSymbol]?: any }> {
    Option?: () => A[typeSymbol] extends Option.Option<infer A0> | infer _ ? Option.Option<A0> : never
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
