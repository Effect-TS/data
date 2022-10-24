/**
 * @since 1.0.0
 */
import * as contravariant from "@fp-ts/core/typeclass/Contravariant"
import type { TypeLambda } from "@fp-ts/core/HKT"
import type * as monoid from "@fp-ts/core/typeclass/Monoid"
import * as semigroup from "@fp-ts/core/typeclass/Semigroup"
import { constFalse, constTrue, flow } from "@fp-ts/data/Function"
import * as invariant from "@fp-ts/core/typeclass/Invariant"

/**
 * @category models
 * @since 1.0.0
 */
export interface Predicate<A> {
  (a: A): boolean
}

/**
 * @category type lambdas
 * @since 1.0.0
 */
export interface PredicateTypeLambda extends TypeLambda {
  readonly type: Predicate<this["Target"]>
}

/**
 * @since 1.0.0
 */
export const not = <A>(predicate: Predicate<A>): Predicate<A> => (a) => !predicate(a)

/**
 * @since 1.0.0
 */
export const or = <A>(that: Predicate<A>) =>
  (self: Predicate<A>): Predicate<A> => (a) => self(a) || that(a)

/**
 * @since 1.0.0
 */
export const and = <A>(that: Predicate<A>) =>
  (self: Predicate<A>): Predicate<A> => (a) => self(a) && that(a)

/**
 * @category instances
 * @since 1.0.0
 */
export const getSemigroupAny = <A>(): semigroup.Semigroup<Predicate<A>> => semigroup.fromCombine(or)

/**
 * @category instances
 * @since 1.0.0
 */
export const getMonoidAny = <A>(): monoid.Monoid<Predicate<A>> => {
  const S = getSemigroupAny<A>()
  return ({
    combine: S.combine,
    combineMany: S.combineMany,
    combineAll: (all) => S.combineMany(all)(constFalse),
    empty: constFalse
  })
}

/**
 * @category instances
 * @since 1.0.0
 */
export const getSemigroupAll = <A>(): semigroup.Semigroup<Predicate<A>> =>
  semigroup.fromCombine(and)

/**
 * @category instances
 * @since 1.0.0
 */
export const getMonoidAll = <A>(): monoid.Monoid<Predicate<A>> => {
  const S = getSemigroupAll<A>()
  return ({
    combine: S.combine,
    combineMany: S.combineMany,
    combineAll: (all) => S.combineMany(all)(constTrue),
    empty: constTrue
  })
}

/**
 * @since 1.0.0
 */
export const contramap = <B, A>(f: (b: B) => A) =>
  (self: Predicate<A>): Predicate<B> => flow(f, self)

/**
 * @category instances
 * @since 1.0.0
 */
 export const Invariant: invariant.Invariant<PredicateTypeLambda> = {
  imap: contravariant.imap<PredicateTypeLambda>(contramap)
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Contravariant: contravariant.Contravariant<PredicateTypeLambda> = {
  ...Invariant,
  contramap
}

/**
 * @since 1.0.0
 */
export const all = <A>(collection: Iterable<Predicate<A>>): Predicate<A> =>
  getMonoidAll<A>().combineAll(collection)

/**
 * @since 1.0.0
 */
export const any = <A>(collection: Iterable<Predicate<A>>): Predicate<A> =>
  getMonoidAny<A>().combineAll(collection)
