/**
 * @since 1.0.0
 */

import { dual, identity } from "@effect/data/Function"
import type { Kind, TypeClass, TypeLambda } from "@effect/data/HKT"
import type { Coproduct } from "@effect/data/typeclass/Coproduct"
import type { Equivalence } from "@effect/data/typeclass/Equivalence"
import type { Monad } from "@effect/data/typeclass/Monad"
import type { Monoid } from "@effect/data/typeclass/Monoid"

/**
 * @category type class
 * @since 1.0.0
 */
export interface Foldable<F extends TypeLambda> extends TypeClass<F> {
  readonly reduce: {
    <A, B>(b: B, f: (b: B, a: A) => B): <R, O, E>(self: Kind<F, R, O, E, A>) => B
    <R, O, E, A, B>(self: Kind<F, R, O, E, A>, b: B, f: (b: B, a: A) => B): B
  }
}

/**
 * Returns a default ternary `reduce` composition.
 *
 * @since 1.0.0
 */
export const reduceComposition = <F extends TypeLambda, G extends TypeLambda>(
  F: Foldable<F>,
  G: Foldable<G>
) =>
  <FR, FO, FE, GR, GO, GE, A, B>(
    self: Kind<F, FR, FO, FE, Kind<G, GR, GO, GE, A>>,
    b: B,
    f: (b: B, a: A) => B
  ): B => F.reduce(self, b, (b, ga) => G.reduce(ga, b, f))

/**
 * @since 1.0.0
 */
export const toArrayMap = <F extends TypeLambda>(
  F: Foldable<F>
): {
  <A, B>(f: (a: A) => B): <R, O, E>(self: Kind<F, R, O, E, A>) => Array<B>
  <R, O, E, A, B>(self: Kind<F, R, O, E, A>, f: (a: A) => B): Array<B>
} =>
  dual(
    2,
    <R, O, E, A, B>(self: Kind<F, R, O, E, A>, f: (a: A) => B): Array<B> =>
      F.reduce(self, [], (out: Array<B>, a) => [...out, f(a)])
  )

/**
 * @since 1.0.0
 */
export const toArray = <F extends TypeLambda>(
  F: Foldable<F>
): <R, O, E, A>(self: Kind<F, R, O, E, A>) => Array<A> => toArrayMap(F)(identity)

/**
 * @since 1.0.0
 */
export const combineMap = <F extends TypeLambda>(F: Foldable<F>) =>
  <M>(M: Monoid<M>): {
    <A>(f: (a: A) => M): <R, O, E>(self: Kind<F, R, O, E, A>) => M
    <R, O, E, A>(self: Kind<F, R, O, E, A>, f: (a: A) => M): M
  } =>
    dual(2, <R, O, E, A>(self: Kind<F, R, O, E, A>, f: (a: A) => M): M =>
      F.reduce(self, M.empty, (m, a) => M.combine(m, f(a))))

/**
 * @since 1.0.0
 */
export const reduceKind = <F extends TypeLambda>(F: Foldable<F>) =>
  <G extends TypeLambda>(G: Monad<G>): {
    <B, A, R, O, E>(
      b: B,
      f: (b: B, a: A) => Kind<G, R, O, E, B>
    ): <FR, FO, FE>(self: Kind<F, FR, FO, FE, A>) => Kind<G, R, O, E, B>
    <FR, FO, FE, A, B, R, O, E>(
      self: Kind<F, FR, FO, FE, A>,
      b: B,
      f: (b: B, a: A) => Kind<G, R, O, E, B>
    ): Kind<G, R, O, E, B>
  } =>
    dual(3, <FR, FO, FE, A, B, R, O, E>(
      self: Kind<F, FR, FO, FE, A>,
      b: B,
      f: (b: B, a: A) => Kind<G, R, O, E, B>
    ): Kind<G, R, O, E, B> =>
      F.reduce(
        self,
        G.of(b),
        (gb: Kind<G, R, O, E, B>, a) => G.flatMap(gb, (b) => f(b, a))
      ))

/**
 * @since 1.0.0
 */
export const coproductMapKind = <F extends TypeLambda>(F: Foldable<F>) =>
  <G extends TypeLambda>(G: Coproduct<G>): {
    <A, R, O, E, B>(
      f: (a: A) => Kind<G, R, O, E, B>
    ): <FR, FO, FE>(self: Kind<F, FR, FO, FE, A>) => Kind<G, R, O, E, B>
    <FR, FO, FE, A, R, O, E, B>(
      self: Kind<F, FR, FO, FE, A>,
      f: (a: A) => Kind<G, R, O, E, B>
    ): Kind<G, R, O, E, B>
  } =>
    dual(2, <FR, FO, FE, A, R, O, E, B>(
      self: Kind<F, FR, FO, FE, A>,
      f: (a: A) => Kind<G, R, O, E, B>
    ): Kind<G, R, O, E, B> => F.reduce(self, G.zero(), (gb: Kind<G, R, O, E, B>, a) => G.coproduct(gb, f(a))))

/**
 * @since 1.0.0
 * @category utils
 */
export const length = <F extends TypeLambda>(F: Foldable<F>): <R, O, E, A>(_: Kind<F, R, O, E, A>) => number =>
  F.reduce(0, (b) => b + 1)

/**
 * @since 1.0.0
 * @category utils
 */
export const contains = <F extends TypeLambda>(F: Foldable<F>) =>
  <A>(eq: Equivalence<A>): {
    (that: A): <R, O, E>(self: Kind<F, R, O, E, A>) => boolean
    <R, O, E>(self: Kind<F, R, O, E, A>, that: A): boolean
  } =>
    dual(
      2,
      <R, O, E>(self: Kind<F, R, O, E, A>, that: A) => F.reduce<A, boolean>(false, (res, a) => res || eq(a, that))(self)
    )

/**
 * @since 1.0.0
 * @category math
 */
export const isEmpty = <F extends TypeLambda, R, O, E, A>(F: Foldable<F>): (_: Kind<F, R, O, E, A>) => boolean =>
  F.reduce<A, boolean>(true, () => false)

/**
 * @since 1.0.0
 * @category math
 */
export const sum = <F extends TypeLambda, R, O, E>(F: Foldable<F>): (_: Kind<F, R, O, E, number>) => number =>
  F.reduce<number, number>(0, (b, a) => b + a)

/**
 * @since 1.0.0
 * @category math
 */
export const sumBigint = <F extends TypeLambda, R, O, E>(F: Foldable<F>): (_: Kind<F, R, O, E, bigint>) => bigint =>
  F.reduce<bigint, bigint>(0n, (b, a) => b + a)

/**
 * @since 1.0.0
 * @category math
 */
export const product = <F extends TypeLambda, R, O, E>(F: Foldable<F>): (_: Kind<F, R, O, E, number>) => number =>
  F.reduce<number, number>(1, (b, a) => b * a)

/**
 * @since 1.0.0
 * @category math
 */
export const productBigint = <F extends TypeLambda, R, O, E>(F: Foldable<F>): (_: Kind<F, R, O, E, bigint>) => bigint =>
  F.reduce<bigint, bigint>(1n, (b, a) => b * a)

/**
 * @since 1.0.0
 * @category boolean
 */
export const and = <F extends TypeLambda, R, O, E>(F: Foldable<F>): (_: Kind<F, R, O, E, boolean>) => boolean =>
  F.reduce<boolean, boolean>(true, (b, a) => a && b)

/**
 * @since 1.0.0
 * @category boolean
 */
export const or = <F extends TypeLambda, R, O, E>(F: Foldable<F>): (_: Kind<F, R, O, E, boolean>) => boolean =>
  F.reduce<boolean, boolean>(false, (b, a) => a || b)

/**
 * @since 1.0.0
 * @category predicate
 */
export const every = <F extends TypeLambda, R, O, E>(
  F: Foldable<F>
): <A>(fn: (_: A) => boolean) => (_: Kind<F, R, O, E, A>) => boolean =>
  <A>(fn: (_: A) => boolean) => F.reduce<A, boolean>(true, (b, a) => fn(a) && b)

/**
 * @since 1.0.0
 * @category predicate
 */
export const any = <F extends TypeLambda, R, O, E>(
  F: Foldable<F>
): <A>(fn: (_: A) => boolean) => (_: Kind<F, R, O, E, A>) => boolean =>
  <A>(fn: (_: A) => boolean) => F.reduce<A, boolean>(false, (b, a) => fn(a) || b)
