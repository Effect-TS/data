/**
 * @since 1.0.0
 */
import * as Equal from "@fp-ts/data/Equal"
import { pipe } from "@fp-ts/data/Function"
import type { LazyArg } from "@fp-ts/data/Function"
import type { None, Option, OptionMethods, Some } from "@fp-ts/data/Option"

/** @internal */
const optionProto: OptionMethods = {
  [Equal.symbolEqual](this: Option<unknown>, that: unknown) {
    if (Object.getPrototypeOf(that) === optionProto) {
      const thatOption = that as Option<unknown>
      if (this.isSome()) {
        return thatOption.isSome() && Equal.equals(this.value, thatOption.value)
      }
      return thatOption.isNone()
    }
    return false
  },
  [Equal.symbolHash](this: Option<unknown>) {
    return this.isSome() ?
      pipe(Equal.hash(this._tag), Equal.hashCombine(Equal.hash(this.value))) :
      Equal.hash(this._tag)
  },
  isNone<A>(this: Option<A>) {
    return this._tag === "None"
  },
  isSome<A>(this: Option<A>) {
    return this._tag === "Some"
  },
  map<A, B>(this: Option<A>, f: (a: A) => B) {
    return this.isSome() ? some(f(this.value)) : none
  },
  getOrNull<A>(this: Option<A>) {
    return this.isSome() ? this.value : null
  },
  getOrUndefined<A>(this: Option<A>) {
    return this.isSome() ? this.value : undefined
  },
  getOrThrow<A>(this: Option<A>, onNone: LazyArg<unknown>) {
    if (this.isNone()) {
      throw (onNone ? onNone() : new Error("Option.getOrThrow called with Option.None"))
    }
    return this.value
  }
}

/** @internal */
export const isOption = (u: unknown): u is Option<unknown> =>
  typeof u === "object" && u != null && "_tag" in u &&
  (u["_tag"] === "None" || u["_tag"] === "Some")

/** @internal */
export const isNone = <A>(fa: Option<A>): fa is None => fa._tag === "None"

/** @internal */
export const isSome = <A>(fa: Option<A>): fa is Some<A> => fa._tag === "Some"

/** @internal */
export const none: Option<never> = Object.setPrototypeOf({ _tag: "None" }, optionProto)

/** @internal */
export const some = <A>(a: A): Option<A> =>
  Object.setPrototypeOf({ _tag: "Some", value: a }, optionProto)

/** @internal */
export const fromNullable = <A>(
  a: A
): Option<NonNullable<A>> => (a == null ? none : some(a as NonNullable<A>))
