/**
 * @since 1.0.0
 */

import type { Either } from "@fp-ts/core/Either"
import type { Chunk } from "@fp-ts/data/Chunk"
import type { Context } from "@fp-ts/data/Context"
import type { ChunkPatch } from "@fp-ts/data/Differ/ChunkPatch"
import type { ContextPatch } from "@fp-ts/data/Differ/ContextPatch"
import type { HashMapPatch } from "@fp-ts/data/Differ/HashMapPatch"
import type { HashSetPatch } from "@fp-ts/data/Differ/HashSetPatch"
import type { OrPatch } from "@fp-ts/data/Differ/OrPatch"
import type { HashMap } from "@fp-ts/data/HashMap"
import type { HashSet } from "@fp-ts/data/HashSet"
import * as D from "@fp-ts/data/internal/Differ"

const TypeId: unique symbol = D.DifferTypeId as TypeId

/**
 * @since 1.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * A `Differ<Value, Patch>` knows how to compare an old value and new value of
 * type `Value` to produce a patch of type `Patch` that describes the
 * differences between those values. A `Differ` also knows how to apply a patch
 * to an old value to produce a new value that represents the old value updated
 * with the changes described by the patch.
 *
 * A `Differ` can be used to construct a `FiberRef` supporting compositional
 * updates using the `FiberRef.makePatch` constructor.
 *
 * The `Differ` companion object contains constructors for `Differ` values for
 * common data types such as `Chunk`, `HashMap`, and `HashSet``. In addition,
 * `Differ`values can be transformed using the `transform` operator and combined
 * using the `orElseEither` and `zip` operators. This allows creating `Differ`
 * values for arbitrarily complex data types compositionally.
 *
 * @since 1.0.0
 * @category models
 */
export interface Differ<Value, Patch> {
  readonly _id: TypeId
  readonly _V: (_: Value) => Value
  readonly _P: (_: Patch) => Patch
  /** @internal */
  readonly empty: Patch
  /** @internal */
  readonly diff: (oldValue: Value, newValue: Value) => Patch
  /** @internal */
  readonly combine: (first: Patch, second: Patch) => Patch
  /** @internal */
  readonly patch: (patch: Patch, oldValue: Value) => Value
}

export declare namespace Differ {
  export namespace Or {
    export type Patch<Value, Value2, Patch, Patch2> = OrPatch<Value, Value2, Patch, Patch2>
  }

  export namespace Context {
    export type Patch<Input, Output> = ContextPatch<Input, Output>
  }

  export namespace Chunk {
    export type Patch<Value, Patch> = ChunkPatch<Value, Patch>
  }

  export namespace HashMap {
    export type Patch<Key, Value, Patch> = HashMapPatch<Key, Value, Patch>
  }

  export namespace HashSet {
    export type Patch<Value> = HashSetPatch<Value>
  }
}

/**
 * An empty patch that describes no changes.
 *
 * @since 1.0.0
 * @category patch
 */
export const empty: <Value, Patch>(self: Differ<Value, Patch>) => Patch = (self) => self.empty

/**
 * An empty patch that describes no changes.
 *
 * @since 1.0.0
 * @category patch
 */
export const diff: <Value>(
  oldValue: Value,
  newValue: Value
) => <Patch>(differ: Differ<Value, Patch>) => Patch = (oldValue, newValue) =>
  (self) => self.diff(oldValue, newValue)

/**
 * Combines two patches to produce a new patch that describes the updates of
 * the first patch and then the updates of the second patch. The combine
 * operation should be associative. In addition, if the combine operation is
 * commutative then joining multiple fibers concurrently will result in
 * deterministic `FiberRef` values.
 *
 * @since 1.0.0
 * @category patch
 */
export const combine: <Patch>(
  first: Patch,
  second: Patch
) => <Value>(self: Differ<Value, Patch>) => Patch = (first, second) =>
  (self) => self.combine(first, second)

/**
 * Applies a patch to an old value to produce a new value that is equal to the
 * old value with the updates described by the patch.
 *
 * @since 1.0.0
 * @category patch
 */
export const patch: <Patch, Value>(
  patch: Patch,
  oldValue: Value
) => (self: Differ<Value, Patch>) => Value = (patch, oldValue) =>
  (self) => self.patch(patch, oldValue)

/**
 * Constructs a new `Differ`.
 *
 * @since 1.0.0
 * @category constructors
 */
export const make: <Value, Patch>(params: {
  readonly empty: Patch
  readonly diff: (oldValue: Value, newValue: Value) => Patch
  readonly combine: (first: Patch, second: Patch) => Patch
  readonly patch: (patch: Patch, oldValue: Value) => Value
}) => Differ<Value, Patch> = D.make

/**
 * Constructs a differ that knows how to diff `Env` values.
 *
 * @since 1.0.0
 * @category constructors
 */
export const environment: <A>() => Differ<Context<A>, ContextPatch<A, A>> = D.environment

/**
 * Constructs a differ that knows how to diff a `Chunk` of values given a
 * differ that knows how to diff the values.
 *
 * @since 1.0.0
 * @category constructors
 */
export const chunk: <Value, Patch>(
  differ: Differ<Value, Patch>
) => Differ<Chunk<Value>, ChunkPatch<Value, Patch>> = D.chunk

/**
 * Constructs a differ that knows how to diff a `HashMap` of keys and values given
 * a differ that knows how to diff the values.
 *
 * @since 1.0.0
 * @category constructors
 */
export const hashMap: <Key, Value, Patch>(
  differ: Differ<Value, Patch>
) => Differ<HashMap<Key, Value>, HashMapPatch<Key, Value, Patch>> = D.hashMap

/**
 * Constructs a differ that knows how to diff a `HashSet` of values.
 *
 * @since 1.0.0
 * @category constructors
 */
export const hashSet: <Value>() => Differ<HashSet<Value>, HashSetPatch<Value>> = D.hashSet

/**
 * Combines this differ and the specified differ to produce a differ that
 * knows how to diff the sum of their values.
 *
 * @since 1.0.0
 * @category mutations
 */
export const orElseResult: <Value2, Patch2>(
  that: Differ<Value2, Patch2>
) => <Value, Patch>(
  self: Differ<Value, Patch>
) => Differ<Either<Value, Value2>, OrPatch<Value, Value2, Patch, Patch2>> = D.orElseResult

/**
 * Transforms the type of values that this differ knows how to differ using
 * the specified functions that map the new and old value types to each other.
 *
 * @since 1.0.0
 * @category mutations
 */
export const transform: <Value, Value2>(
  f: (value: Value) => Value2,
  g: (value: Value2) => Value
) => <Patch>(
  self: Differ<Value, Patch>
) => Differ<Value2, Patch> = D.transform

/**
 * Constructs a differ that just diffs two values by returning a function that
 * sets the value to the new value. This differ does not support combining
 * multiple updates to the value compositionally and should only be used when
 * there is no compositional way to update them.
 *
 * @since 1.0.0
 * @category mutations
 */
export const update: <A>() => Differ<A, (a: A) => A> = D.update

/**
 * A variant of `update` that allows specifying the function that will be used
 * to combine old values with new values.
 *
 * @since 1.0.0
 * @category mutations
 */
export const updateWith: <A>(f: (x: A, y: A) => A) => Differ<A, (a: A) => A> = D.updateWith

/**
 * Combines this differ and the specified differ to produce a new differ that
 * knows how to diff the product of their values.
 *
 * @since 1.0.0
 * @category mutations
 */
export const zip: <Value2, Patch2>(
  that: Differ<Value2, Patch2>
) => <Value, Patch>(
  self: Differ<Value, Patch>
) => Differ<readonly [Value, Value2], readonly [Patch, Patch2]> = D.zip
