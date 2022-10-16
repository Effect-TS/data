/**
 * The `FromOption` type class represents those data types which support embedding of `Option<A>`.
 *
 * @since 1.0.0
 */
import type { Kind, TypeClass, TypeLambda } from "@fp-ts/core/HKT"
import * as O from "@fp-ts/core/Option"
import type { Flattenable } from "@fp-ts/core/typeclasses/Flattenable"
import { pipe } from "@fp-ts/data/Function"
import type { Predicate } from "@fp-ts/data/Predicate"
import type { Refinement } from "@fp-ts/data/Refinement"

/**
 * @category models
 * @since 1.0.0
 */
export interface FromOption<F extends TypeLambda> extends TypeClass<F> {
  readonly fromOption: <A, S>(fa: O.Option<A>) => Kind<F, S, unknown, never, never, A>
}

// -------------------------------------------------------------------------------------
// conversions
// -------------------------------------------------------------------------------------

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromNullable = <F extends TypeLambda>(F: FromOption<F>) =>
  <A, S>(a: A): Kind<F, S, unknown, never, never, NonNullable<A>> => F.fromOption(O.fromNullable(a))

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
  ): <S>(c: C) => Kind<F, S, unknown, never, never, B>
  <B extends A, A = B>(predicate: Predicate<A>): <S>(b: B) => Kind<F, S, unknown, never, never, B>
} =>
  <B extends A, A = B>(predicate: Predicate<A>) =>
    <S>(b: B): Kind<F, S, unknown, never, never, B> =>
      F.fromOption(predicate(b) ? O.some(b) : O.none)

/**
 * @category lifting
 * @since 1.0.0
 */
export const liftOption = <F extends TypeLambda>(F: FromOption<F>) =>
  <A extends ReadonlyArray<unknown>, B>(f: (...a: A) => O.Option<B>) =>
    <S>(...a: A): Kind<F, S, unknown, never, never, B> => F.fromOption(f(...a))

/**
 * @category lifting
 * @since 1.0.0
 */
export const liftNullable = <F extends TypeLambda>(F: FromOption<F>) => {
  const fromNullableF = fromNullable(F)
  return <A extends ReadonlyArray<unknown>, B>(f: (...a: A) => B | null | undefined) =>
    <S, R, O, E>(...a: A): Kind<F, S, R, O, E, NonNullable<B>> => {
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
export const flatMapNullable = <F extends TypeLambda>(F: FromOption<F>, C: Flattenable<F>) => {
  const liftNullable_ = liftNullable(F)
  return <A, B>(f: (a: A) => B | null | undefined) =>
    <S, R, O, E>(self: Kind<F, S, R, O, E, A>): Kind<F, S, R, O, E, NonNullable<B>> => {
      return pipe(self, C.flatMap<A, S, R, O, E, NonNullable<B>>(liftNullable_(f)))
    }
}
