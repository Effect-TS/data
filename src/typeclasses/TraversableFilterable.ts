/**
 * `TraversableFilterable` represents data structures which can be _partitioned_ with effects in some `Monoidal` functor.
 *
 * @since 1.0.0
 */
import type { Functor } from "@fp-ts/core/Functor"
import type { Kind, TypeClass, TypeLambda } from "@fp-ts/core/HKT"
import type { Monoidal } from "@fp-ts/core/Monoidal"
import type { Traversable } from "@fp-ts/core/Traversable"
import type { Either } from "@fp-ts/data/Either"
import { flow, pipe } from "@fp-ts/data/Function"
import * as internal from "@fp-ts/data/internal/Common"
import * as either from "@fp-ts/data/internal/Either"
import type { Option } from "@fp-ts/data/Option"
import * as compactable from "@fp-ts/data/typeclasses/Compactable"
import type { Compactable } from "@fp-ts/data/typeclasses/Compactable"

/**
 * @category models
 * @since 1.0.0
 */
export interface TraversableFilterable<T extends TypeLambda> extends TypeClass<T> {
  readonly traversePartitionMap: <F extends TypeLambda>(
    Monoidal: Monoidal<F>
  ) => <A, S, R, O, E, B, C>(
    f: (a: A) => Kind<F, S, R, O, E, Either<B, C>>
  ) => <TS, TR, TO, TE>(
    self: Kind<T, TS, TR, TO, TE, A>
  ) => Kind<F, S, R, O, E, readonly [Kind<T, TS, TR, TO, TE, B>, Kind<T, TS, TR, TO, TE, C>]>
  readonly traverseFilterMap: <F extends TypeLambda>(
    Monoidal: Monoidal<F>
  ) => <A, S, R, O, E, B>(
    f: (a: A) => Kind<F, S, R, O, E, Option<B>>
  ) => <TS, TR, TO, TE>(
    self: Kind<T, TS, TR, TO, TE, A>
  ) => Kind<F, S, R, O, E, Kind<T, TS, TR, TO, TE, B>>
}

/**
 * @since 1.0.0
 */
export const traversePartitionMap = <T extends TypeLambda>(
  Traversable: Traversable<T>,
  Functor: Functor<T>,
  Compactable: Compactable<T>
): TraversableFilterable<T>["traversePartitionMap"] =>
  (Monoidal) =>
    (f) =>
      flow(
        Traversable.traverse(Monoidal)(f),
        Monoidal.map(compactable.separate(Functor, Compactable))
      )

/**
 * @since 1.0.0
 */
export const traverseFilterMap = <T extends TypeLambda>(
  Traversable: Traversable<T>,
  Compactable: Compactable<T>
): TraversableFilterable<T>["traverseFilterMap"] =>
  (Monoidal) => (f) => flow(Traversable.traverse(Monoidal)(f), Monoidal.map(Compactable.compact))

/**
 * @since 1.0.0
 */
export const traverseFilter = <T extends TypeLambda>(
  TraversableFilterable: TraversableFilterable<T>
) =>
  <F extends TypeLambda>(
    Monoidal: Monoidal<F>
  ): (<B extends A, S, R, O, E, A = B>(
    predicate: (a: A) => Kind<F, S, R, O, E, boolean>
  ) => <TS, TR, TO, TE>(
    self: Kind<T, TS, TR, TO, TE, B>
  ) => Kind<F, S, R, O, E, Kind<T, TS, TR, TO, TE, B>>) =>
    (predicate) =>
      TraversableFilterable.traverseFilterMap(Monoidal)((b) =>
        pipe(
          predicate(b),
          Monoidal.map((ok) => (ok ? internal.some(b) : internal.none))
        )
      )

/**
 * @since 1.0.0
 */
export const traversePartition = <T extends TypeLambda>(
  TraversableFilterable: TraversableFilterable<T>
) =>
  <F extends TypeLambda>(
    Monoidal: Monoidal<F>
  ): (<B extends A, S, R, O, E, A = B>(
    predicate: (a: A) => Kind<F, S, R, O, E, boolean>
  ) => <TS, TR, TO, TE>(
    self: Kind<T, TS, TR, TO, TE, B>
  ) => Kind<F, S, R, O, E, readonly [Kind<T, TS, TR, TO, TE, B>, Kind<T, TS, TR, TO, TE, B>]>) =>
    (predicate) =>
      TraversableFilterable.traversePartitionMap(Monoidal)((b) =>
        pipe(
          predicate(b),
          Monoidal.map((ok) => (ok ? either.right(b) : either.left(b)))
        )
      )
