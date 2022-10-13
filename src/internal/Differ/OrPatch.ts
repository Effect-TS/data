import type { Result } from "@fp-ts/core/Result"
import * as R from "@fp-ts/core/Result"
import type { Differ } from "@fp-ts/data/Differ"
import type * as OP from "@fp-ts/data/Differ/OrPatch"
import { equals } from "@fp-ts/data/Equal"
import * as L from "@fp-ts/data/internal/List"

/** @internal */
export const OrPatchTypeId: OP.TypeId = Symbol.for("@fp-ts/data/Differ/OrPatch") as OP.TypeId

function variance<A, B>(a: A): B {
  return a as unknown as B
}

/** @internal */
export class Empty<Value, Value2, Patch, Patch2>
  implements OP.OrPatch<Value, Value2, Patch, Patch2>
{
  readonly _tag = "Empty"
  readonly _Value: (_: Value) => Value = variance
  readonly _Value2: (_: Value2) => Value2 = variance
  readonly _Patch: (_: Patch) => Patch = variance
  readonly _Patch2: (_: Patch2) => Patch2 = variance
  readonly _id: OP.TypeId = OrPatchTypeId
}

/** @internal */
export class AndThen<Value, Value2, Patch, Patch2>
  implements OP.OrPatch<Value, Value2, Patch, Patch2>
{
  readonly _tag = "AndThen"
  readonly _Value: (_: Value) => Value = variance
  readonly _Value2: (_: Value2) => Value2 = variance
  readonly _Patch: (_: Patch) => Patch = variance
  readonly _Patch2: (_: Patch2) => Patch2 = variance
  readonly _id: OP.TypeId = OrPatchTypeId
  constructor(
    readonly first: OP.OrPatch<Value, Value2, Patch, Patch2>,
    readonly second: OP.OrPatch<Value, Value2, Patch, Patch2>
  ) {}
}

/** @internal */
export class SetLeft<Value, Value2, Patch, Patch2>
  implements OP.OrPatch<Value, Value2, Patch, Patch2>
{
  readonly _tag = "SetLeft"
  readonly _Value: (_: Value) => Value = variance
  readonly _Value2: (_: Value2) => Value2 = variance
  readonly _Patch: (_: Patch) => Patch = variance
  readonly _Patch2: (_: Patch2) => Patch2 = variance
  readonly _id: OP.TypeId = OrPatchTypeId
  constructor(readonly value: Value) {}
}

/** @internal */
export class SetRight<Value, Value2, Patch, Patch2>
  implements OP.OrPatch<Value, Value2, Patch, Patch2>
{
  readonly _tag = "SetRight"
  readonly _Value: (_: Value) => Value = variance
  readonly _Value2: (_: Value2) => Value2 = variance
  readonly _Patch: (_: Patch) => Patch = variance
  readonly _Patch2: (_: Patch2) => Patch2 = variance
  readonly _id: OP.TypeId = OrPatchTypeId
  constructor(readonly value: Value2) {}
}

/** @internal */
export class UpdateLeft<Value, Value2, Patch, Patch2>
  implements OP.OrPatch<Value, Value2, Patch, Patch2>
{
  readonly _tag = "UpdateLeft"
  readonly _Value: (_: Value) => Value = variance
  readonly _Value2: (_: Value2) => Value2 = variance
  readonly _Patch: (_: Patch) => Patch = variance
  readonly _Patch2: (_: Patch2) => Patch2 = variance
  readonly _id: OP.TypeId = OrPatchTypeId
  constructor(readonly patch: Patch) {}
}

/** @internal */
export class UpdateRight<Value, Value2, Patch, Patch2>
  implements OP.OrPatch<Value, Value2, Patch, Patch2>
{
  readonly _tag = "UpdateRight"
  readonly _Value: (_: Value) => Value = variance
  readonly _Value2: (_: Value2) => Value2 = variance
  readonly _Patch: (_: Patch) => Patch = variance
  readonly _Patch2: (_: Patch2) => Patch2 = variance
  readonly _id: OP.TypeId = OrPatchTypeId
  constructor(readonly patch: Patch2) {}
}

type Instruction =
  | AndThen<any, any, any, any>
  | Empty<any, any, any, any>
  | SetLeft<any, any, any, any>
  | SetRight<any, any, any, any>
  | UpdateLeft<any, any, any, any>
  | UpdateRight<any, any, any, any>

/** @internal */
export function empty<Value, Value2, Patch, Patch2>(): OP.OrPatch<
  Value,
  Value2,
  Patch,
  Patch2
> {
  return new Empty()
}

/** @internal */
export function diff<Value, Value2, Patch, Patch2>(
  oldValue: Result<Value, Value2>,
  newValue: Result<Value, Value2>,
  left: Differ<Value, Patch>,
  right: Differ<Value2, Patch2>
): OP.OrPatch<Value, Value2, Patch, Patch2> {
  switch (oldValue._tag) {
    case "Failure": {
      switch (newValue._tag) {
        case "Failure": {
          const valuePatch = left.diff(oldValue.failure, newValue.failure)
          if (equals(valuePatch, left.empty)) {
            return new Empty()
          }
          return new UpdateLeft(valuePatch)
        }
        case "Success": {
          return new SetRight(newValue.success)
        }
      }
    }
    case "Success": {
      switch (newValue._tag) {
        case "Failure": {
          return new SetLeft(newValue.failure)
        }
        case "Success": {
          const valuePatch = right.diff(oldValue.success, newValue.success)
          if (equals(valuePatch, right.empty)) {
            return new Empty()
          }
          return new UpdateRight(valuePatch)
        }
      }
    }
  }
}

/** @internal */
export function combine<Value, Value2, Patch, Patch2>(
  that: OP.OrPatch<Value, Value2, Patch, Patch2>
) {
  return (
    self: OP.OrPatch<Value, Value2, Patch, Patch2>
  ): OP.OrPatch<Value, Value2, Patch, Patch2> => new AndThen(self, that)
}

/** @internal */
export function patch<Value, Value2, Patch, Patch2>(
  oldValue: Result<Value, Value2>,
  left: Differ<Value, Patch>,
  right: Differ<Value2, Patch2>
) {
  return (self: OP.OrPatch<Value, Value2, Patch, Patch2>): Result<Value, Value2> => {
    let patches = L.of(self)
    let result = oldValue
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
        case "UpdateLeft": {
          if (result._tag === "Failure") {
            result = R.fail(left.patch(head.patch, result.failure))
          }
          patches = tail
          break
        }
        case "UpdateRight": {
          if (result._tag === "Success") {
            result = R.succeed(right.patch(head.patch, result.success))
          }
          patches = tail
          break
        }
        case "SetLeft": {
          result = R.fail(head.value)
          patches = tail
          break
        }
        case "SetRight": {
          result = R.succeed(head.value)
          patches = tail
          break
        }
      }
    }
    return result
  }
}
