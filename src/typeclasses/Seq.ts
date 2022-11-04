/**
 * Base interface for sequence collections.
 *
 * @since 1.0.0
 */
import type { Option } from "@fp-ts/core/data/Option"
import type { Kind, TypeClass, TypeLambda } from "@fp-ts/core/HKT"
import type { Covariant } from "@fp-ts/core/typeclass/Covariant"
import type { FlatMap } from "@fp-ts/core/typeclass/FlatMap"
import type { Foldable } from "@fp-ts/core/typeclass/Foldable"
import type { Order } from "@fp-ts/core/typeclass/Order"
import type { Predicate } from "@fp-ts/data/Predicate"

/**
 * @category models
 * @since 1.0.0
 */
export interface Seq<F extends TypeLambda> extends TypeClass<F> {
  readonly fromIterable: <A>(self: Iterable<A>) => Kind<F, unknown, never, never, A>
  readonly toIterable: <R, O, E, A>(self: Kind<F, R, O, E, A>) => Iterable<A>
  readonly take: (n: number) => <R, O, E, A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A>
  readonly reverse: <R, O, E, A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A>
  readonly drop: (n: number) => <R, O, E, A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A>
  readonly prepend: <B>(
    b: B
  ) => <R, O, E, A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A | B>
  readonly prependAll: <R, O, E, B>(
    prefix: Kind<F, R, O, E, B>
  ) => <A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A | B>
  readonly concat: <R, O, E, B>(
    prefix: Kind<F, R, O, E, B>
  ) => <A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A | B>
  readonly splitAt: (
    n: number
  ) => <R, O, E, A>(
    self: Kind<F, R, O, E, A>
  ) => readonly [Kind<F, R, O, E, A>, Kind<F, R, O, E, A>]
  readonly head: <R, O, E, A>(self: Kind<F, R, O, E, A>) => Option<A>
  readonly tail: <R, O, E, A>(self: Kind<F, R, O, E, A>) => Option<Kind<F, R, O, E, A>>
  readonly some: <A>(predicate: Predicate<A>) => <R, O, E>(self: Kind<F, R, O, E, A>) => boolean
  readonly every: <A>(predicate: Predicate<A>) => <R, O, E>(self: Kind<F, R, O, E, A>) => boolean
  readonly findFirst: <A>(
    predicate: Predicate<A>
  ) => <R, O, E>(self: Kind<F, R, O, E, A>) => Option<A>
  readonly map: Covariant<F>["map"]
  readonly flatMap: FlatMap<F>["flatMap"]
  readonly reduce: Foldable<F>["reduce"]
  readonly sort: <A>(O: Order<A>) => <R, O, E>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A>
}
