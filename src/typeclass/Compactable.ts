/**
 * `Compactable` represents data structures which can be _compacted_/_separated_.
 *
 * @since 1.0.0
 */
import type { Kind, TypeClass, TypeLambda } from "@fp-ts/core/HKT"
import type { Covariant } from "@fp-ts/core/typeclass/Covariant"
import type { Either } from "@fp-ts/data/Either"
import * as E from "@fp-ts/data/Either"
import { pipe } from "@fp-ts/data/Function"
import type { Option } from "@fp-ts/data/Option"

/**
 * @category models
 * @since 1.0.0
 */
export interface Compactable<F extends TypeLambda> extends TypeClass<F> {
  readonly compact: <R, O, E, A>(self: Kind<F, R, O, E, Option<A>>) => Kind<F, R, O, E, A>
}

/**
 * Returns a default `compact` composition.
 *
 * @since 1.0.0
 */
export const compactComposition = <F extends TypeLambda, G extends TypeLambda>(
  F: Covariant<F>,
  G: Compactable<G>
): (<FR, FO, FE, GR, GO, GE, A>(
  self: Kind<F, FR, FO, FE, Kind<G, GR, GO, GE, Option<A>>>
) => Kind<F, FR, FO, FE, Kind<G, GR, GO, GE, A>>) => F.map(G.compact)

/**
 * @since 1.0.0
 */
export const separate = <F extends TypeLambda>(
  F: Covariant<F> & Compactable<F>
) =>
  <R, O, E, A, B>(
    self: Kind<F, R, O, E, Either<A, B>>
  ): readonly [Kind<F, R, O, E, A>, Kind<F, R, O, E, B>] => {
    return [
      pipe(self, F.map(E.getLeft), F.compact),
      pipe(self, F.map(E.getRight), F.compact)
    ]
  }
