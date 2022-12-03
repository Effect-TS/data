import * as Equal from "@fp-ts/data/Equal"
import { pipe } from "@fp-ts/data/Function"
import * as option from "@fp-ts/data/internal/Option"
import type { These, TheseMethods } from "@fp-ts/data/These"

/** @internal */
export const left = <E>(left: E): These<E, never> =>
  Object.setPrototypeOf({ _tag: "Left", left }, theseProto)

/** @internal */
export const right = <A>(right: A): These<never, A> =>
  Object.setPrototypeOf({ _tag: "Right", right }, theseProto)

/** @internal */
export const of = right

/** @internal */
const theseProto: TheseMethods = {
  [Equal.symbolEqual](this: These<unknown, unknown>, that: unknown) {
    if (Object.getPrototypeOf(that) === theseProto) {
      const thatThese = that as These<unknown, unknown>
      if (this.isLeft()) {
        return thatThese.isLeft() && Equal.equals(this.left, thatThese.left)
      }
      if (this.isRight()) {
        return thatThese.isRight() && Equal.equals(this.right, thatThese.right)
      }
      return thatThese.isBoth()
        && Equal.equals(this.left, thatThese.left)
        && Equal.equals(this.right, thatThese.right)
    }
    return false
  },
  [Equal.symbolHash](this: These<unknown, unknown>) {
    return pipe(
      Equal.hash(this._tag),
      Equal.hashCombine(
        Equal.hash(
          this.isLeft() ?
            this.left :
            this.isRight() ?
            this.right :
            pipe(Equal.hash(this.left), Equal.hashCombine(Equal.hash(this.right)))
        )
      )
    )
  },
  isLeft<E, A>(this: These<E, A>) {
    return this._tag === "Left"
  },
  isRight<E, A>(this: These<E, A>) {
    return this._tag === "Right"
  },
  isBoth<E, A>(this: These<E, A>) {
    return this._tag === "Both"
  },
  getLeft<E, A>(this: These<E, A>) {
    return (this.isLeft() || this.isBoth()) ? option.some(this.left) : option.none
  },
  getRight<E, A>(this: These<E, A>) {
    return (this.isRight() || this.isBoth()) ? option.some(this.right) : option.none
  },
  map<E, A, B>(this: These<E, A>, f: (a: A) => B) {
    return this.isRight() ?
      right(f(this.right)) :
      this.isBoth() ?
      both(this.left, f(this.right)) :
      left(this.left)
  }
}

/** @internal */
export const both = <E, A>(left: E, right: A): These<E, A> =>
  Object.setPrototypeOf({
    _tag: "Both",
    left,
    right
  }, theseProto)

/** @internal */
export const isThese = (u: unknown): u is These<unknown, unknown> =>
  typeof u === "object" && u != null && Object.getPrototypeOf(u) === theseProto
