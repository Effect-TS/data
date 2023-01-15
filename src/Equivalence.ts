/**
 * @since 1.0.0
 */
import * as Equal from "@fp-ts/data/Equal"
import * as Hash from "@fp-ts/data/Hash"

/**
 * @since 1.0.0
 * @category models
 */
export interface Equivalence<A> {
  (that: A): (self: A) => boolean
}

/**
 * @since 1.0.0
 * @category constructor
 */
export const make = <A>(
  equals: (that: A) => (self: A) => boolean
): Equivalence<A> => equals

/**
 * @since 1.0.0
 * @category instances
 */
export const strict: <A>() => Equivalence<A> = () => (that) => (self) => self === that

/**
 * @since 1.0.0
 * @category instances
 */
export const equal: <A>() => Equivalence<A> = () =>
  (that) => (self) => Hash.hash(self) === Hash.hash(that) && Equal.equals(self, that)

/**
 * @since 1.0.0
 * @category instances
 */
export const string: Equivalence<string> = strict()

/**
 * @since 1.0.0
 * @category instances
 */
export const number: Equivalence<number> = strict()

/**
 * @since 1.0.0
 * @category instances
 */
export const bigint: Equivalence<bigint> = strict()

/**
 * @since 1.0.0
 * @category instances
 */
export const symbol: Equivalence<symbol> = strict()

/**
 * @since 1.0.0
 * @category instances
 */
export const contramap = <A, B>(f: (self: B) => A) =>
  (self: Equivalence<A>): Equivalence<B> => (_that) => (_self) => self(f(_that))(f(_self))

/**
 * @since 1.0.0
 * @category instances
 */
export const tuple = <As extends ReadonlyArray<Equivalence<any>>>(
  ...as: As
): Equivalence<{ readonly [k in keyof As]: As[k] extends Equivalence<infer A> ? A : never }> =>
  (that) => (self) => as.every((eq, i) => eq(that[i])(self[i]))

/**
 * @since 1.0.0
 * @category instances
 */
export const struct = <As extends Readonly<Record<string, Equivalence<any>>>>(
  as: As
): Equivalence<{ readonly [k in keyof As]: As[k] extends Equivalence<infer A> ? A : never }> =>
  (that) => (self) => Object.keys(as).every((key) => as[key](that[key])(self[key]))
