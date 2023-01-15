import * as Chunk from "@fp-ts/data/Chunk"
import type * as HSP from "@fp-ts/data/Differ/HashSetPatch"
import * as Equal from "@fp-ts/data/Equal"
import * as Hash from "@fp-ts/data/Hash"
import * as HashSet from "@fp-ts/data/HashSet"

/** @internal */
export const HashSetPatchTypeId: HSP.TypeId = Symbol.for(
  "@fp-ts/data/Differ/HashSetPatch"
) as HSP.TypeId

function variance<A, B>(a: A): B {
  return a as unknown as B
}

class Empty<Value> implements HSP.HashSetPatch<Value> {
  readonly _tag = "Empty"
  readonly _Value: (_: Value) => Value = variance
  readonly _id: HSP.TypeId = HashSetPatchTypeId;

  [Hash.symbol]() {
    return Hash.string(`HashSetPatch(Empty)`)
  }

  [Equal.symbol](that: unknown) {
    return typeof that === "object" && that !== null && "_id" in that && that["_id"] === this._id &&
      "_tag" in that && that["_tag"] === this._id
  }
}

class AndThen<Value> implements HSP.HashSetPatch<Value> {
  readonly _tag = "AndThen"
  readonly _Value: (_: Value) => Value = variance
  readonly _id: HSP.TypeId = HashSetPatchTypeId
  constructor(
    readonly first: HSP.HashSetPatch<Value>,
    readonly second: HSP.HashSetPatch<Value>
  ) {}

  [Hash.symbol]() {
    return Hash.string(`HashSetPatch(AndThen)`)
  }

  [Equal.symbol](that: unknown) {
    return typeof that === "object" && that !== null && "_id" in that && that["_id"] === this._id &&
      "_tag" in that && that["_tag"] === this._id &&
      Equal.equals(this.first, (that as this).first) &&
      Equal.equals(this.second, (that as this).second)
  }
}

class Add<Value> implements HSP.HashSetPatch<Value> {
  readonly _tag = "Add"
  readonly _Value: (_: Value) => Value = variance
  readonly _id: HSP.TypeId = HashSetPatchTypeId
  constructor(readonly value: Value) {}

  [Hash.symbol]() {
    return Hash.string(`HashSetPatch(Add)`)
  }

  [Equal.symbol](that: unknown) {
    return typeof that === "object" && that !== null && "_id" in that && that["_id"] === this._id &&
      "_tag" in that && that["_tag"] === this._id &&
      Equal.equals(this.value, (that as this).value)
  }
}

class Remove<Value> implements HSP.HashSetPatch<Value> {
  readonly _tag = "Remove"
  readonly _Value: (_: Value) => Value = variance
  readonly _id: HSP.TypeId = HashSetPatchTypeId
  constructor(readonly value: Value) {}

  [Hash.symbol]() {
    return Hash.string(`HashSetPatch(Remove)`)
  }

  [Equal.symbol](that: unknown) {
    return typeof that === "object" && that !== null && "_id" in that && that["_id"] === this._id &&
      "_tag" in that && that["_tag"] === this._id &&
      Equal.equals(this.value, (that as this).value)
  }
}

type Instruction =
  | Add<any>
  | AndThen<any>
  | Empty<any>
  | Remove<any>

/** @internal */
export function empty<Value>(): HSP.HashSetPatch<Value> {
  return new Empty()
}

/** @internal */
export function diff<Value>(
  oldValue: HashSet.HashSet<Value>,
  newValue: HashSet.HashSet<Value>
): HSP.HashSetPatch<Value> {
  const [removed, patch] = HashSet.reduce(
    [oldValue, empty<Value>()] as const,
    ([set, patch], value: Value) => {
      if (HashSet.has(value)(set)) {
        return [HashSet.remove(value)(set), patch] as const
      }
      return [set, combine(new Add(value))(patch)] as const
    }
  )(newValue)
  return HashSet.reduce(patch, (patch, value: Value) => combine(new Remove(value))(patch))(removed)
}

/** @internal */
export function combine<Value>(that: HSP.HashSetPatch<Value>) {
  return (self: HSP.HashSetPatch<Value>): HSP.HashSetPatch<Value> => {
    return new AndThen(self, that)
  }
}

/** @internal */
export function patch<Value>(oldValue: HashSet.HashSet<Value>) {
  return (self: HSP.HashSetPatch<Value>): HashSet.HashSet<Value> => {
    let set = oldValue
    let patches: Chunk.Chunk<HSP.HashSetPatch<Value>> = Chunk.of(self)
    while (Chunk.isNonEmpty(patches)) {
      const head: Instruction = Chunk.headNonEmpty(patches) as Instruction
      const tail = Chunk.tailNonEmpty(patches)
      switch (head._tag) {
        case "Empty": {
          patches = tail
          break
        }
        case "AndThen": {
          patches = Chunk.prepend(head.first)(Chunk.prepend(head.second)(tail))
          break
        }
        case "Add": {
          set = HashSet.add(head.value)(set)
          patches = tail
          break
        }
        case "Remove": {
          set = HashSet.remove(head.value)(set)
          patches = tail
        }
      }
    }
    return set
  }
}
