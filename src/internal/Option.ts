/**
 * @since 1.0.0
 */

import * as Equal from "@effect/data/Equal"
import * as Hash from "@effect/data/Hash"
import { NodeInspectSymbol } from "@effect/data/Inspectable"
import { EffectTypeId, effectVariance } from "@effect/data/internal/Effect"
import type * as Option from "@effect/data/Option"
import { pipeArguments } from "@effect/data/Pipeable"

const TypeId: Option.TypeId = Symbol.for("@effect/data/Option") as Option.TypeId

const CommonProto = {
  [EffectTypeId]: effectVariance,
  [TypeId]: {
    _A: (_: never) => _
  },
  [NodeInspectSymbol]<A>(this: Option.Option<A>) {
    return (this as any).toJSON()
  },
  pipe() {
    return pipeArguments(this, arguments)
  },
  toString<A>(this: Option.Option<A>) {
    return JSON.stringify(this, null, 2)
  }
}

const SomeProto = Object.assign(Object.create(CommonProto), {
  _tag: "Some",
  [Equal.symbol]<A>(this: Option.Some<A>, that: unknown): boolean {
    return isOption(that) && isSome(that) && Equal.equals(that.value, this.value)
  },
  [Hash.symbol]<A>(this: Option.Some<A>) {
    return Hash.combine(Hash.hash(this._tag))(Hash.hash(this.value))
  },
  toJSON<A>(this: Option.Some<A>) {
    return {
      _tag: this._tag,
      value: this.value
    }
  }
})

const NoneProto = Object.assign(Object.create(CommonProto), {
  _tag: "None",
  [Equal.symbol]<A>(this: Option.None<A>, that: unknown): boolean {
    return isOption(that) && isNone(that)
  },
  [Hash.symbol]<A>(this: Option.None<A>) {
    return Hash.combine(Hash.hash(this._tag))
  },
  toJSON<A>(this: Option.None<A>) {
    return {
      _tag: this._tag
    }
  }
})

/** @internal */
export const isOption = (input: unknown): input is Option.Option<unknown> =>
  typeof input === "object" && input != null && TypeId in input

/** @internal */
export const isNone = <A>(fa: Option.Option<A>): fa is Option.None<A> => fa._tag === "None"

/** @internal */
export const isSome = <A>(fa: Option.Option<A>): fa is Option.Some<A> => fa._tag === "Some"

/** @internal */
export const none: Option.Option<never> = Object.create(NoneProto)

/** @internal */
export const some = <A>(value: A): Option.Option<A> => {
  const a = Object.create(SomeProto)
  a.value = value
  return a
}
