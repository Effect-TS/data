/**
 * Base interface for sequence collections.
 *
 * @since 1.0.0
 */
import type { Option } from "@fp-ts/core/data/Option"
import type { Kind, TypeLambda } from "@fp-ts/core/HKT"
import type { Compactable } from "@fp-ts/core/typeclass/Compactable"
import type { Covariant } from "@fp-ts/core/typeclass/Covariant"
import type { Filterable } from "@fp-ts/core/typeclass/Filterable"
import type { FlatMap } from "@fp-ts/core/typeclass/FlatMap"
import type { Foldable } from "@fp-ts/core/typeclass/Foldable"
import type { Order } from "@fp-ts/core/typeclass/Order"
import type { Predicate } from "@fp-ts/data/Predicate"
import type { CovariantWithIndex } from "@fp-ts/data/typeclass/CovariantWithIndex"
import type { FilterableWithIndex } from "@fp-ts/data/typeclass/FilterableWithIndex"

/**
 * @category models
 * @since 1.0.0
 */
export interface Seq<F extends TypeLambda>
  extends
    Covariant<F>,
    FlatMap<F>,
    Foldable<F>,
    Filterable<F>,
    FilterableWithIndex<F, number>,
    Compactable<F>,
    CovariantWithIndex<F, number>
{
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
  readonly sort: <A>(O: Order<A>) => <R, O, E>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A>
  readonly get: (index: number) => <R, O, E, A>(self: Kind<F, R, O, E, A>) => Option<A>
  readonly unsafeGet: (index: number) => <R, O, E, A>(self: Kind<F, R, O, E, A>) => A
  readonly size: <R, O, E, A>(self: Kind<F, R, O, E, A>) => number
  readonly empty: Kind<F, unknown, never, never, never>
  readonly append: <B>(
    b: B
  ) => <R, O, E, A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A | B>
  readonly dropRight: (n: number) => <R, O, E, A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A>
  readonly dropWhile: <A>(
    f: (a: A) => boolean
  ) => <R, O, E>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A>
  readonly filter: {
    <C extends A, B extends A, A = C>(refinement: (a: A) => a is B): <R, O, E>(
      self: Kind<F, R, O, E, C>
    ) => Kind<F, R, O, E, B>
    <B extends A, A = B>(
      predicate: (a: A) => boolean
    ): <R, O, E>(self: Kind<F, R, O, E, B>) => Kind<F, R, O, E, B>
  }
  readonly filterMapWhile: <A, B>(
    f: (a: A) => Option<B>
  ) => (self: Iterable<A>) => Kind<F, unknown, never, never, B>
  readonly elem: <B>(b: B) => <R, O, E, A>(self: Kind<F, R, O, E, A>) => boolean
  readonly findFirstIndex: <A>(
    predicate: Predicate<A>
  ) => <R, O, E>(self: Kind<F, R, O, E, A>) => Option<number>
  readonly findLastIndex: <A>(
    predicate: Predicate<A>
  ) => <R, O, E>(self: Kind<F, R, O, E, A>) => Option<number>
  readonly findLast: <A>(
    predicate: Predicate<A>
  ) => <R, O, E>(self: Kind<F, R, O, E, A>) => Option<A>
  readonly isEmpty: <R, O, E, A>(self: Kind<F, R, O, E, A>) => boolean
  readonly isNonEmpty: <R, O, E, A>(self: Kind<F, R, O, E, A>) => boolean
  readonly join: (sep: string) => <R, O, E>(self: Kind<F, R, O, E, string>) => string
  readonly last: <R, O, E, A>(self: Kind<F, R, O, E, A>) => Option<A>
  readonly range: (start: number, end: number) => Kind<F, unknown, never, never, number>
  readonly makeBy: <A>(f: (i: number) => A) => (n: number) => Kind<F, unknown, never, never, A>
}
