import type { Chunk } from "@fp-ts/data/Chunk"
import type { Context } from "@fp-ts/data/Context"
import type * as D from "@fp-ts/data/Differ"
import * as ChunkPatch from "@fp-ts/data/Differ/ChunkPatch"
import * as ContextPatch from "@fp-ts/data/Differ/ContextPatch"
import * as HashMapPatch from "@fp-ts/data/Differ/HashMapPatch"
import * as HashSetPatch from "@fp-ts/data/Differ/HashSetPatch"
import * as OrPatch from "@fp-ts/data/Differ/OrPatch"
import * as Equal from "@fp-ts/data/Equal"
import { constant, identity } from "@fp-ts/data/Function"
import * as Hash from "@fp-ts/data/Hash"
import type { HashMap } from "@fp-ts/data/HashMap"
import type { HashSet } from "@fp-ts/data/HashSet"
import type { Result } from "@fp-ts/data/Result"

/** @internal */
export const DifferTypeId: D.TypeId = Symbol.for("@fp-ts/data/Differ") as D.TypeId

/** @internal */
class DifferImpl<Value, Patch> implements D.Differ<Value, Patch> {
  readonly empty: Patch
  readonly diff: (oldValue: Value, newValue: Value) => Patch
  readonly combine: (first: Patch, second: Patch) => Patch
  readonly patch: (patch: Patch, oldValue: Value) => Value
  readonly _id: D.TypeId = DifferTypeId
  readonly _P: (_: Patch) => Patch = identity
  readonly _V: (_: Value) => Value = identity
  constructor(params: {
    empty: Patch
    diff: (oldValue: Value, newValue: Value) => Patch
    combine: (first: Patch, second: Patch) => Patch
    patch: (patch: Patch, oldValue: Value) => Value
  }) {
    this.empty = params.empty
    this.diff = params.diff
    this.combine = params.combine
    this.patch = params.patch
  }
  [Equal.symbol](that: unknown) {
    return this === that
  }
  [Hash.symbol]() {
    return Hash.random(this)
  }
}

/** @internal */
export function make<Value, Patch>(params: {
  readonly empty: Patch
  readonly diff: (oldValue: Value, newValue: Value) => Patch
  readonly combine: (first: Patch, second: Patch) => Patch
  readonly patch: (patch: Patch, oldValue: Value) => Value
}): D.Differ<Value, Patch> {
  return new DifferImpl(params)
}

/** @internal */
export function environment<A>(): D.Differ<Context<A>, ContextPatch.ContextPatch<A, A>> {
  return make({
    empty: ContextPatch.empty(),
    combine: (first, second) => ContextPatch.combine(second)(first),
    diff: (oldValue, newValue) => ContextPatch.diff(oldValue, newValue),
    patch: (patch, oldValue) => ContextPatch.patch(oldValue)(patch)
  })
}

/** @internal */
export function chunk<Value, Patch>(
  differ: D.Differ<Value, Patch>
): D.Differ<Chunk<Value>, ChunkPatch.ChunkPatch<Value, Patch>> {
  return make({
    empty: ChunkPatch.empty(),
    combine: (first, second) => ChunkPatch.combine(second)(first),
    diff: (oldValue, newValue) => ChunkPatch.diff(oldValue, newValue, differ),
    patch: (patch, oldValue) => ChunkPatch.patch(oldValue, differ)(patch)
  })
}

/** @internal */
export function hashMap<Key, Value, Patch>(
  differ: D.Differ<Value, Patch>
): D.Differ<HashMap<Key, Value>, HashMapPatch.HashMapPatch<Key, Value, Patch>> {
  return make({
    empty: HashMapPatch.empty(),
    combine: (first, second) => HashMapPatch.combine(second)(first),
    diff: (oldValue, newValue) => HashMapPatch.diff(oldValue, newValue, differ),
    patch: (patch, oldValue) => HashMapPatch.patch(oldValue, differ)(patch)
  })
}

/** @internal */
export function hashSet<Value>(): D.Differ<HashSet<Value>, HashSetPatch.HashSetPatch<Value>> {
  return make({
    empty: HashSetPatch.empty(),
    combine: (first, second) => HashSetPatch.combine(second)(first),
    diff: (oldValue, newValue) => HashSetPatch.diff(oldValue, newValue),
    patch: (patch, oldValue) => HashSetPatch.patch(oldValue)(patch)
  })
}

/** @internal */
export function orElseResult<Value2, Patch2>(that: D.Differ<Value2, Patch2>) {
  return <Value, Patch>(
    self: D.Differ<Value, Patch>
  ): D.Differ<Result<Value, Value2>, OrPatch.OrPatch<Value, Value2, Patch, Patch2>> =>
    make({
      empty: OrPatch.empty(),
      combine: (first, second) => OrPatch.combine(second)(first),
      diff: (oldValue, newValue) => OrPatch.diff(oldValue, newValue, self, that),
      patch: (patch, oldValue) => OrPatch.patch(oldValue, self, that)(patch)
    })
}

/** @internal */
export function transform<Value, Value2>(f: (value: Value) => Value2, g: (value: Value2) => Value) {
  return <Patch>(self: D.Differ<Value, Patch>): D.Differ<Value2, Patch> =>
    make({
      empty: self.empty,
      combine: (first, second) => self.combine(first, second),
      diff: (oldValue, newValue) => self.diff(g(oldValue), g(newValue)),
      patch: (patch, oldValue) => f(self.patch(patch, g(oldValue)))
    })
}

/** @internal */
export function update<A>(): D.Differ<A, (a: A) => A> {
  return updateWith((_, a) => a)
}

/** @internal */
export function updateWith<A>(f: (x: A, y: A) => A): D.Differ<A, (a: A) => A> {
  return make({
    empty: identity,
    combine: (first, second) => {
      if (first === identity) {
        return second
      }
      if (second === identity) {
        return first
      }
      return (a) => second(first(a))
    },
    diff: (oldValue, newValue) => {
      if (Equal.equals(oldValue, newValue)) {
        return identity
      }
      return constant(newValue)
    },
    patch: (patch, oldValue) => f(oldValue, patch(oldValue))
  })
}

/** @internal */
export function zip<Value2, Patch2>(that: D.Differ<Value2, Patch2>) {
  return <Value, Patch>(
    self: D.Differ<Value, Patch>
  ): D.Differ<readonly [Value, Value2], readonly [Patch, Patch2]> =>
    make({
      empty: [self.empty, that.empty] as const,
      combine: (first, second) => [
        self.combine(first[0], second[0]),
        that.combine(first[1], second[1])
      ],
      diff: (oldValue, newValue) => [
        self.diff(oldValue[0], newValue[0]),
        that.diff(oldValue[1], newValue[1])
      ],
      patch: (patch, oldValue) => [
        self.patch(patch[0], oldValue[0]),
        that.patch(patch[1], oldValue[1])
      ]
    })
}
