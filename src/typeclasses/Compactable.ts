/**
 * `Compactable` represents data structures which can be _compacted_/_separated_.
 *
 * @since 1.0.0
 */
import type { Functor } from "@fp-ts/core/Functor"
import type { Kind, TypeClass, TypeLambda } from "@fp-ts/core/HKT"
import type { Either } from "@fp-ts/data/Either"
import { pipe } from "@fp-ts/data/Function"
import * as either from "@fp-ts/data/internal/Either"
import type { Option } from "@fp-ts/data/Option"

/**
 * @category models
 * @since 1.0.0
 */
export interface Compactable<F extends TypeLambda> extends TypeClass<F> {
  readonly compact: <S, R, O, E, A>(self: Kind<F, S, R, O, E, Option<A>>) => Kind<F, S, R, O, E, A>
}

/**
 * @since 1.0.0
 */
export const separate = <F extends TypeLambda>(Functor: Functor<F>, Compactable: Compactable<F>) =>
  <S, R, O, E, A, B>(
    self: Kind<F, S, R, O, E, Either<A, B>>
  ): readonly [Kind<F, S, R, O, E, A>, Kind<F, S, R, O, E, B>] => {
    return [
      pipe(self, Functor.map(either.getLeft), Compactable.compact),
      pipe(self, Functor.map(either.getRight), Compactable.compact)
    ]
  }

/**
 * Returns a default `compact` composition.
 *
 * @since 1.0.0
 */
export const compactComposition = <F extends TypeLambda, G extends TypeLambda>(
  Functor: Functor<F>,
  Compactable: Compactable<G>
): (<FS, FR, FO, FE, GS, GR, GO, GE, A>(
  self: Kind<F, FS, FR, FO, FE, Kind<G, GS, GR, GO, GE, Option<A>>>
) => Kind<F, FS, FR, FO, FE, Kind<G, GS, GR, GO, GE, A>>) => Functor.map(Compactable.compact)
