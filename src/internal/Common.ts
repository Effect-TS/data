/**
 * @since 1.0.0
 */
import type { NonEmptyReadonlyArray } from "@fp-ts/data/NonEmptyReadonlyArray"
import type { None, Option, Some } from "@fp-ts/data/Option"

// -------------------------------------------------------------------------------------
// Option
// -------------------------------------------------------------------------------------

/** @internal */
export const isNone = <A>(fa: Option<A>): fa is None => fa._tag === "None"

/** @internal */
export const isSome = <A>(fa: Option<A>): fa is Some<A> => fa._tag === "Some"

/** @internal */
export const none: Option<never> = { _tag: "None" }

/** @internal */
export const some = <A>(a: A): Option<A> => ({ _tag: "Some", value: a })

/** @internal */
export const fromNullableToOption = <A>(
  a: A
): Option<NonNullable<A>> => (a == null ? none : some(a as NonNullable<A>))

// -------------------------------------------------------------------------------------
// ReadonlyArray
// -------------------------------------------------------------------------------------

/** @internal */
export const empty: readonly [] = []

/** @internal */
export const Arrayfrom = <A>(collection: Iterable<A>): ReadonlyArray<A> =>
  Array.isArray(collection) ? collection : Array.from(collection)

// -------------------------------------------------------------------------------------
// NonEmptyReadonlyArray
// -------------------------------------------------------------------------------------

/** @internal */
export const isNonEmpty = <A>(as: ReadonlyArray<A>): as is NonEmptyReadonlyArray<A> => as.length > 0

/** @internal */
export const head = <A>(as: NonEmptyReadonlyArray<A>): A => as[0]

/** @internal */
export const tail = <A>(as: NonEmptyReadonlyArray<A>): ReadonlyArray<A> => as.slice(1)

// -------------------------------------------------------------------------------------
// Record
// -------------------------------------------------------------------------------------

/** @internal */
export const Do: Readonly<{}> = {}

/** @internal */
export const has = Object.prototype.hasOwnProperty

// -------------------------------------------------------------------------------------
// NonEmptyArray
// -------------------------------------------------------------------------------------

/**
 * @internal
 * @since 1.0.0
 */
export type NonEmptyArray<A> = [A, ...Array<A>]

/** @internal */
export const toNonEmptyArray = <A>(a: A): NonEmptyArray<A> => [a]

/** @internal */
export const fromNonEmptyReadonlyArray = <A>(
  as: NonEmptyReadonlyArray<A>
): NonEmptyArray<A> => [head(as), ...tail(as)]
