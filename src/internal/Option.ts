/**
 * @since 1.0.0
 */

import type { Trace } from "@effect/data/Debug"
import { makeTraced } from "@effect/data/Debug"
import * as Equal from "@effect/data/Equal"
import * as Hash from "@effect/data/Hash"
import type * as Option from "@effect/data/Option"

/** @internal */
const effectVariance = {
  _R: (_: never) => _,
  _E: (_: never) => _,
  _A: (_: never) => _
}

const EffectTypeId = Symbol.for("@effect/io/Effect")
const OptionTypeId: Option.OptionTypeId = Symbol.for("@effect/io/Option") as Option.OptionTypeId

/** @internal */
export class Some<A> implements Option.Some<A> {
  readonly _tag = "Some"
  public i1 = undefined
  public i2 = undefined
  public trace = undefined;
  [EffectTypeId] = effectVariance;
  [Equal.symbol](this: this, that: unknown): boolean {
    return isOption(that) && isSome(that) && Equal.equals((that as Some<A>).i0, this.i0)
  }
  [Hash.symbol](this: this) {
    return Hash.hash(this.i0)
  }
  toString() {
    return `some(${String(this.i0)})`
  }
  toJSON() {
    return {
      _tag: this._tag,
      value: this.i0
    }
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toJSON()
  }
  get [OptionTypeId]() {
    return {
      _A: (_: never) => _
    }
  }
  get value() {
    return this.i0
  }
  constructor(readonly i0: A) {
  }
  traced(this: this, trace: Trace): Option.TracedOption<this["value"]> | this {
    if (trace) {
      return makeTraced(this, trace)
    }
    return this
  }
}

/** @internal */
export class None<A> implements Option.None<A> {
  readonly _tag = "None"
  public i0 = undefined
  public i1 = undefined
  public i2 = undefined
  public trace = undefined;
  [EffectTypeId] = effectVariance;
  [Equal.symbol](this: this, that: unknown): boolean {
    return isOption(that) && isNone(that)
  }
  [Hash.symbol](this: this) {
    return Hash.hash(this._tag)
  }
  toString() {
    return `none()`
  }
  toJSON() {
    return {
      _tag: this._tag
    }
  }
  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toJSON()
  }
  get [OptionTypeId]() {
    return {
      _A: (_: never) => _
    }
  }
  traced(this: this, trace: Trace): Option.TracedOption<never> | this {
    if (trace) {
      return makeTraced(this, trace)
    }
    return this
  }
}

/** @internal */
export const isOption = (input: unknown): input is Option.Option<unknown> =>
  typeof input === "object" && input != null && "_tag" in input &&
  (input["_tag"] === "None" || input["_tag"] === "Some") && Equal.isEqual(input)

/** @internal */
export const isNone = <A>(fa: Option.Option<A>): fa is Option.None<A> => fa._tag === "None"

/** @internal */
export const isSome = <A>(fa: Option.Option<A>): fa is Option.Some<A> => fa._tag === "Some"

/** @internal */
export const none: Option.Option<never> = new None()

/** @internal */
export const some = <A>(a: A): Option.Option<A> => new Some(a)
