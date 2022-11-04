/**
 * The `FromOption` type class represents those data types which support embedding of `Option<A>`.
 *
 * @since 1.0.0
 */
import type { Kind, TypeClass, TypeLambda } from "@fp-ts/core/HKT"
import type { FlatMap } from "@fp-ts/core/typeclass/FlatMap"
import { pipe } from "@fp-ts/data/Function"
import * as option from "@fp-ts/data/internal/Option"
import type { Option } from "@fp-ts/data/Option"
import type { Predicate } from "@fp-ts/data/Predicate"
import type { Refinement } from "@fp-ts/data/Refinement"

/**
 * @category models
 * @since 1.0.0
 */
export interface FromOption<F extends TypeLambda> extends TypeClass<F> {
  readonly fromOption: <A>(self: Option<A>) => Kind<F, unknown, never, never, A>
}

// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromNullable = <F extends TypeLambda>(F: FromOption<F>) =>
  <A>(a: A): Kind<F, unknown, never, never, NonNullable<A>> => F.fromOption(option.fromNullable(a))

// -------------------------------------------------------------------------------------
// lifting
// -------------------------------------------------------------------------------------

/**
 * @category lifting
 * @since 1.0.0
 */
export const liftPredicate = <F extends TypeLambda>(
  F: FromOption<F>
): {
  <C extends A, B extends A, A = C>(
    refinement: Refinement<A, B>
  ): (c: C) => Kind<F, unknown, never, never, B>
  <B extends A, A = B>(predicate: Predicate<A>): (b: B) => Kind<F, unknown, never, never, B>
} =>
  <B extends A, A = B>(predicate: Predicate<A>) =>
    (b: B): Kind<F, unknown, never, never, B> =>
      F.fromOption(predicate(b) ? option.some(b) : option.none)

/**
 * @category lifting
 * @since 1.0.0
 */
export const liftOption = <F extends TypeLambda>(F: FromOption<F>) =>
  <A extends ReadonlyArray<unknown>, B>(f: (...a: A) => Option<B>) =>
    (...a: A): Kind<F, unknown, never, never, B> => F.fromOption(f(...a))

/**
 * @category lifting
 * @since 1.0.0
 */
export const liftNullable = <F extends TypeLambda>(F: FromOption<F>) => {
  const fromNullableF = fromNullable(F)
  return <A extends ReadonlyArray<unknown>, B>(f: (...a: A) => B | null | undefined) =>
    <R, O, E>(...a: A): Kind<F, R, O, E, NonNullable<B>> => {
      return fromNullableF(f(...a))
    }
}

// -------------------------------------------------------------------------------------
// sequencing
// -------------------------------------------------------------------------------------

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapNullable = <F extends TypeLambda>(F: FromOption<F>, C: FlatMap<F>) => {
  const liftNullable_ = liftNullable(F)
  return <A, B>(f: (a: A) => B | null | undefined) =>
    <R, O, E>(self: Kind<F, R, O, E, A>): Kind<F, R, O, E, NonNullable<B>> => {
      return pipe(self, C.flatMap<A, R, O, E, NonNullable<B>>(liftNullable_(f)))
    }
}
