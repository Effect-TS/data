import * as Chunk from "@fp-ts/data/Chunk"
import type * as Differ from "@fp-ts/data/Differ"
import type * as HMP from "@fp-ts/data/Differ/HashMapPatch"
import * as Equal from "@fp-ts/data/Equal"
import * as Hash from "@fp-ts/data/Hash"
import * as HashMap from "@fp-ts/data/HashMap"

/** @internal */
export const HashMapPatchTypeId: HMP.TypeId = Symbol.for(
  "@fp-ts/data/Differ/HashMapPatch"
) as HMP.TypeId

function variance<A, B>(a: A): B {
  return a as unknown as B
}

class Empty<Key, Value, Patch> implements HMP.HashMapPatch<Key, Value, Patch> {
  readonly _tag = "Empty"
  readonly _Key: (_: Key) => Key = variance
  readonly _Value: (_: Value) => Value = variance
  readonly _Patch: (_: Patch) => Patch = variance
  readonly _id: HMP.TypeId = HashMapPatchTypeId;

  [Hash.symbol]() {
    return Hash.string(`HashMapPatch(Empty)`)
  }

  [Equal.symbol](that: unknown) {
    return typeof that === "object" && that !== null && "_id" in that && that["_id"] === this._id &&
      "_tag" in that && that["_tag"] === this._id
  }
}

class AndThen<Key, Value, Patch> implements HMP.HashMapPatch<Key, Value, Patch> {
  readonly _tag = "AndThen"
  readonly _Key: (_: Key) => Key = variance
  readonly _Value: (_: Value) => Value = variance
  readonly _Patch: (_: Patch) => Patch = variance
  readonly _id: HMP.TypeId = HashMapPatchTypeId
  constructor(
    readonly first: HMP.HashMapPatch<Key, Value, Patch>,
    readonly second: HMP.HashMapPatch<Key, Value, Patch>
  ) {}

  [Hash.symbol]() {
    return Hash.string(`HashMapPatch(AndThen)`)
  }

  [Equal.symbol](that: unknown) {
    return typeof that === "object" && that !== null && "_id" in that && that["_id"] === this._id &&
      "_tag" in that && that["_tag"] === this._id &&
      Equal.equals(this.first, (that as this).first) &&
      Equal.equals(this.second, (that as this).second)
  }
}

class Add<Key, Value, Patch> implements HMP.HashMapPatch<Key, Value, Patch> {
  readonly _tag = "Add"
  readonly _Key: (_: Key) => Key = variance
  readonly _Value: (_: Value) => Value = variance
  readonly _Patch: (_: Patch) => Patch = variance
  readonly _id: HMP.TypeId = HashMapPatchTypeId
  constructor(readonly key: Key, readonly value: Value) {}

  [Hash.symbol]() {
    return Hash.string(`HashMapPatch(Add)`)
  }

  [Equal.symbol](that: unknown) {
    return typeof that === "object" && that !== null && "_id" in that && that["_id"] === this._id &&
      "_tag" in that && that["_tag"] === this._id &&
      Equal.equals(this.key, (that as this).key) &&
      Equal.equals(this.value, (that as this).value)
  }
}

class Remove<Key, Value, Patch> implements HMP.HashMapPatch<Key, Value, Patch> {
  readonly _tag = "Remove"
  readonly _Key: (_: Key) => Key = variance
  readonly _Value: (_: Value) => Value = variance
  readonly _Patch: (_: Patch) => Patch = variance
  readonly _id: HMP.TypeId = HashMapPatchTypeId
  constructor(readonly key: Key) {}

  [Hash.symbol]() {
    return Hash.string(`HashMapPatch(Remove)`)
  }

  [Equal.symbol](that: unknown) {
    return typeof that === "object" && that !== null && "_id" in that && that["_id"] === this._id &&
      "_tag" in that && that["_tag"] === this._id &&
      Equal.equals(this.key, (that as this).key)
  }
}

class Update<Key, Value, Patch> implements HMP.HashMapPatch<Key, Value, Patch> {
  readonly _tag = "Update"
  readonly _Key: (_: Key) => Key = variance
  readonly _Value: (_: Value) => Value = variance
  readonly _Patch: (_: Patch) => Patch = variance
  readonly _id: HMP.TypeId = HashMapPatchTypeId
  constructor(readonly key: Key, readonly patch: Patch) {}

  [Hash.symbol]() {
    return Hash.string(`HashMapPatch(Update)`)
  }

  [Equal.symbol](that: unknown) {
    return typeof that === "object" && that !== null && "_id" in that && that["_id"] === this._id &&
      "_tag" in that && that["_tag"] === this._id &&
      Equal.equals(this.key, (that as this).key) &&
      Equal.equals(this.patch, (that as this).patch)
  }
}

type Instruction =
  | Add<any, any, any>
  | Remove<any, any, any>
  | Update<any, any, any>
  | Empty<any, any, any>
  | AndThen<any, any, any>

/** @internal */
export function empty<Key, Value, Patch>(): HMP.HashMapPatch<Key, Value, Patch> {
  return new Empty()
}

/** @internal */
export function diff<Key, Value, Patch>(
  oldValue: HashMap.HashMap<Key, Value>,
  newValue: HashMap.HashMap<Key, Value>,
  differ: Differ.Differ<Value, Patch>
): HMP.HashMapPatch<Key, Value, Patch> {
  const [removed, patch] = HashMap.reduceWithIndex(
    [oldValue, empty<Key, Value, Patch>()] as const,
    ([map, patch], newValue: Value, key: Key) => {
      const option = HashMap.get(key)(map)
      switch (option._tag) {
        case "Some": {
          const valuePatch = differ.diff(option.value, newValue)
          if (Equal.equals(valuePatch, differ.empty)) {
            return [HashMap.remove(key)(map), patch] as const
          }
          return [
            HashMap.remove(key)(map),
            combine<Key, Value, Patch>(new Update(key, valuePatch))(patch)
          ] as const
        }
        case "None": {
          return [map, combine<Key, Value, Patch>(new Add(key, newValue))(patch)] as const
        }
      }
    }
  )(newValue)
  return HashMap.reduceWithIndex(
    patch,
    (patch, _, key: Key) => combine<Key, Value, Patch>(new Remove(key))(patch)
  )(removed)
}

/** @internal */
export function combine<Key, Value, Patch>(that: HMP.HashMapPatch<Key, Value, Patch>) {
  return (self: HMP.HashMapPatch<Key, Value, Patch>): HMP.HashMapPatch<Key, Value, Patch> => {
    return new AndThen(self, that)
  }
}

/** @internal */
export function patch<Key, Value, Patch>(
  oldValue: HashMap.HashMap<Key, Value>,
  differ: Differ.Differ<Value, Patch>
) {
  return (self: HMP.HashMapPatch<Key, Value, Patch>): HashMap.HashMap<Key, Value> => {
    let map = oldValue
    let patches: Chunk.Chunk<HMP.HashMapPatch<Key, Value, Patch>> = Chunk.of(self)
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
          map = HashMap.set(head.key, head.value)(map)
          patches = tail
          break
        }
        case "Remove": {
          map = HashMap.remove(head.key)(map)
          patches = tail
          break
        }
        case "Update": {
          const option = HashMap.get(head.key)(map)
          if (option._tag === "Some") {
            map = HashMap.set(head.key, differ.patch(head.patch, option.value))(map)
          }
          patches = tail
          break
        }
      }
    }
    return map
  }
}
