/**
 * @since 1.0.0
 */
import type { TypeLambda } from "@fp-ts/core/HKT"
import * as covariant from "@fp-ts/core/typeclass/Covariant"
import type * as nonEmptyAlternative from "@fp-ts/core/typeclass/NonEmptyAlternative"
import type { Chunk } from "@fp-ts/data/Chunk"
import * as chunk from "@fp-ts/data/Chunk"
import type { NonEmptyReadonlyArray } from "@fp-ts/data/ReadonlyArray"

/**
 * @since 1.0.0
 */
export declare const nonEmpty: unique symbol

/**
 * @category model
 * @since 1.0.0
 */
export interface NonEmptyChunk<A> extends Chunk<A> {
  readonly [nonEmpty]: A
}

/**
 * @since 1.0.0
 * @category type lambdas
 */
export interface NonEmptyChunkTypeLambda extends TypeLambda {
  readonly type: NonEmptyChunk<this["Target"]>
}

/**
 * @since 1.0.0
 */
export const makeNonEmpty: <Elem extends [any, ...ReadonlyArray<any>]>(
  ...elements: Elem
) => NonEmptyChunk<Elem[number]> = chunk.make as any

/**
 * @since 1.0.0
 */
export const concatNonEmpty: <B>(
  that: NonEmptyChunk<B>
) => <A>(self: NonEmptyChunk<A>) => NonEmptyChunk<A | B> = chunk.concat as any

/**
 * @since 1.0.0
 */
export const toNonEmptyReadonlyArray: <A>(self: NonEmptyChunk<A>) => NonEmptyReadonlyArray<A> =
  chunk.toReadonlyArray as any

/**
 * @since 1.0.0
 */
export const mapNonEmpty: <A, B>(f: (a: A) => B) => (self: NonEmptyChunk<A>) => NonEmptyChunk<B> =
  chunk
    .map as any

/**
 * @category instances
 * @since 1.0.0
 */
export const NonEmptyAlternativeNonEmpty: nonEmptyAlternative.NonEmptyAlternative<
  NonEmptyChunkTypeLambda
> = {
  imap: covariant.imap<NonEmptyChunkTypeLambda>(mapNonEmpty),
  map: mapNonEmpty,
  coproduct: concatNonEmpty,
  coproductMany: (collection) =>
    (self) => {
      let out = self
      for (const nec of collection) {
        out = concatNonEmpty(nec)(out)
      }
      return out
    }
}
