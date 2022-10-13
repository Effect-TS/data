import type { Context, Tag } from "@fp-ts/data/Context"
import type * as CP from "@fp-ts/data/Differ/ContextPatch"
import { ContextImpl } from "@fp-ts/data/internal/Context"
import * as L from "@fp-ts/data/internal/List"

/** @internal */
export const ContextPatchTypeId: CP.TypeId = Symbol.for(
  "@fp-ts/data/Differ/ContextPatch"
) as CP.TypeId

function variance<A, B>(a: A): B {
  return a as unknown as B
}

/** @internal */
export class Empty<Input, Output> implements CP.ContextPatch<Input, Output> {
  readonly _tag = "Empty"
  readonly _Input: (_: Input) => void = variance
  readonly _Output: (_: never) => Output = variance
  readonly _id: CP.TypeId = ContextPatchTypeId
}

/** @internal */
export class AndThen<Input, Output, Output2> implements CP.ContextPatch<Input, Output2> {
  readonly _tag = "AndThen"
  readonly _id: CP.TypeId = ContextPatchTypeId
  readonly _Input: (_: Input) => void = variance
  readonly _Output: (_: never) => Output2 = variance
  constructor(
    readonly first: CP.ContextPatch<Input, Output>,
    readonly second: CP.ContextPatch<Output, Output2>
  ) {}
}

/** @internal */
export class AddService<Env, T> implements CP.ContextPatch<Env, Env | T> {
  readonly _tag = "AddService"
  readonly _id: CP.TypeId = ContextPatchTypeId
  readonly _Input: (_: Env) => void = variance
  readonly _Output: (_: never) => Env | T = variance
  constructor(readonly tag: Tag<T>, readonly service: T) {}
}

/** @internal */
export class RemoveService<Env, T> implements CP.ContextPatch<Env | T, Env> {
  readonly _tag = "RemoveService"
  readonly _id: CP.TypeId = ContextPatchTypeId
  readonly _Input: (_: Env | T) => void = variance
  readonly _Output: (_: never) => Env = variance
  constructor(readonly tag: Tag<T>) {}
}

/** @internal */
export class UpdateService<Env, T> implements CP.ContextPatch<Env | T, Env | T> {
  readonly _tag = "UpdateService"
  readonly _id: CP.TypeId = ContextPatchTypeId
  readonly _Input: (_: Env | T) => void = variance
  readonly _Output: (_: never) => Env | T = variance
  constructor(
    readonly tag: Tag<T>,
    readonly update: (service: T) => T
  ) {
  }
}

type Instruction =
  | Empty<any, any>
  | AndThen<any, any, any>
  | AddService<any, any>
  | RemoveService<any, any>
  | UpdateService<any, any>

/** @internal */
export function empty<Input = never, Output = never>(): CP.ContextPatch<Input, Output> {
  return new Empty()
}

/** @internal */
export function diff<Input, Output>(
  oldValue: Context<Input>,
  newValue: Context<Output>
): CP.ContextPatch<Input, Output> {
  const missingServices = new Map(oldValue.unsafeMap)
  let patch = empty<any, any>()
  for (const [tag, newService] of newValue.unsafeMap.entries()) {
    if (missingServices.has(tag)) {
      const old = missingServices.get(tag)!
      missingServices.delete(tag)
      if (old !== newService) {
        patch = combine(new UpdateService(tag, () => newService))(patch)
      }
    } else {
      missingServices.delete(tag)
      patch = combine(new AddService(tag, newService))(patch)
    }
  }
  for (const [tag] of missingServices.entries()) {
    patch = combine(new RemoveService(tag))(patch)
  }
  return patch
}

/** @internal */
export function combine<Output, Output2>(that: CP.ContextPatch<Output, Output2>) {
  return <Input>(self: CP.ContextPatch<Input, Output>): CP.ContextPatch<Input, Output2> => {
    return new AndThen(self, that)
  }
}

/** @internal */
export function patch<Input>(context: Context<Input>) {
  return <Output>(self: CP.ContextPatch<Input, Output>): Context<Output> => {
    let wasServiceUpdated = false
    let patches = L.of(self as CP.ContextPatch<unknown, unknown>)
    const updatedContext: Map<Tag<unknown>, unknown> = new Map(context.unsafeMap)
    while (L.isCons(patches)) {
      const head: Instruction = patches.head as Instruction
      const tail = patches.tail
      switch (head._tag) {
        case "Empty": {
          patches = tail
          break
        }
        case "AddService": {
          updatedContext.set(head.tag, head.service)
          patches = tail
          break
        }
        case "AndThen": {
          patches = L.cons(head.first, L.cons(head.second, tail))
          break
        }
        case "RemoveService": {
          updatedContext.delete(head.tag)
          patches = tail
          break
        }
        case "UpdateService": {
          updatedContext.set(head.tag, head.update(updatedContext.get(head.tag)))
          wasServiceUpdated = true
          patches = tail
          break
        }
      }
    }
    if (!wasServiceUpdated) {
      return new ContextImpl(updatedContext) as Context<Output>
    }
    const map = new Map()
    for (const [tag] of context.unsafeMap) {
      if (updatedContext.has(tag)) {
        map.set(tag, updatedContext.get(tag))
        updatedContext.delete(tag)
      }
    }
    for (const [tag, s] of updatedContext) {
      map.set(tag, s)
    }
    return new ContextImpl(map) as Context<Output>
  }
}
