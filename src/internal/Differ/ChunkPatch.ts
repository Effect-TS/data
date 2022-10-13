import { pipe } from "@fp-ts/core/Function"
import * as C from "@fp-ts/data/Chunk"
import type { Differ } from "@fp-ts/data/Differ"
import type * as CP from "@fp-ts/data/Differ/ChunkPatch"
import { equals } from "@fp-ts/data/Equal"
import * as L from "@fp-ts/data/internal/List"

export const ChunkPatchTypeId: CP.TypeId = Symbol.for("@fp-ts/data/Differ/ChunkPatch") as CP.TypeId

function variance<A, B>(a: A): B {
  return a as unknown as B
}

/** @internal */
export class Empty<Value, Patch> implements CP.ChunkPatch<Value, Patch> {
  readonly _tag = "Empty"
  readonly _Value: (_: Value) => Value = variance
  readonly _Patch: (_: Patch) => Patch = variance
  readonly _id: CP.TypeId = ChunkPatchTypeId
}

/** @internal */
export class AndThen<Value, Patch> implements CP.ChunkPatch<Value, Patch> {
  readonly _tag = "AndThen"
  readonly _Value: (_: Value) => Value = variance
  readonly _Patch: (_: Patch) => Patch = variance
  readonly _id: CP.TypeId = ChunkPatchTypeId
  constructor(
    readonly first: CP.ChunkPatch<Value, Patch>,
    readonly second: CP.ChunkPatch<Value, Patch>
  ) {}
}

/** @internal */
export class Append<Value, Patch> implements CP.ChunkPatch<Value, Patch> {
  readonly _tag = "Append"
  readonly _Value: (_: Value) => Value = variance
  readonly _Patch: (_: Patch) => Patch = variance
  readonly _id: CP.TypeId = ChunkPatchTypeId
  constructor(readonly values: C.Chunk<Value>) {}
}

/** @internal */
export class Slice<Value, Patch> implements CP.ChunkPatch<Value, Patch> {
  readonly _tag = "Slice"
  readonly _Value: (_: Value) => Value = variance
  readonly _Patch: (_: Patch) => Patch = variance
  readonly _id: CP.TypeId = ChunkPatchTypeId
  constructor(readonly from: number, readonly until: number) {}
}

/** @internal */
export class Update<Value, Patch> implements CP.ChunkPatch<Value, Patch> {
  readonly _tag = "Update"
  readonly _Value: (_: Value) => Value = variance
  readonly _Patch: (_: Patch) => Patch = variance
  readonly _id: CP.TypeId = ChunkPatchTypeId
  constructor(readonly index: number, readonly patch: Patch) {}
}

type Instruction =
  | Empty<any, any>
  | AndThen<any, any>
  | Append<any, any>
  | Slice<any, any>
  | Update<any, any>

/** @internal */
export function empty<Value, Patch>(): CP.ChunkPatch<Value, Patch> {
  return new Empty()
}

/** @internal */
export function diff<Value, Patch>(
  oldValue: C.Chunk<Value>,
  newValue: C.Chunk<Value>,
  differ: Differ<Value, Patch>
): CP.ChunkPatch<Value, Patch> {
  let i = 0
  let patch = empty<Value, Patch>()
  while (i < oldValue.length && i < newValue.length) {
    const oldElement = C.unsafeGet(i)(oldValue)
    const newElement = C.unsafeGet(i)(newValue)
    const valuePatch = differ.diff(oldElement, newElement)
    if (!equals(valuePatch, differ.empty)) {
      patch = pipe(patch, combine(new Update(i, valuePatch)))
    }
    i = i + 1
  }
  if (i < oldValue.length) {
    patch = pipe(patch, combine(new Slice(0, i)))
  }
  if (i < newValue.length) {
    patch = pipe(patch, combine(new Append(C.drop(i)(newValue))))
  }
  return patch
}

/** @internal */
export function combine<Value, Patch>(that: CP.ChunkPatch<Value, Patch>) {
  return (self: CP.ChunkPatch<Value, Patch>): CP.ChunkPatch<Value, Patch> => {
    return new AndThen(self, that)
  }
}

/** @internal */
export function patch<Value, Patch>(oldValue: C.Chunk<Value>, differ: Differ<Value, Patch>) {
  return (self: CP.ChunkPatch<Value, Patch>): C.Chunk<Value> => {
    let chunk = oldValue
    let patches = L.of(self)
    while (L.isCons(patches)) {
      const head: Instruction = patches.head as Instruction
      const tail = patches.tail
      switch (head._tag) {
        case "Empty": {
          patches = tail
          break
        }
        case "AndThen": {
          patches = L.cons(head.first, L.cons(head.second, tail))
          break
        }
        case "Append": {
          chunk = C.concat(head.values)(chunk)
          patches = tail
          break
        }
        case "Slice": {
          const array = C.toArray(chunk)
          chunk = C.unsafeFromArray(array.slice(head.from, head.until))
          patches = tail
          break
        }
        case "Update": {
          const array = C.toArray(chunk) as Array<Value>
          array[head.index] = differ.patch(head.patch, array[head.index]!)
          chunk = C.unsafeFromArray(array)
          patches = tail
          break
        }
      }
    }
    return chunk
  }
}
