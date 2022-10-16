import { pipe } from "@fp-ts/data/Function"
import * as L from "@fp-ts/data/internal/List"
import type { Cons, List } from "@fp-ts/data/List"
import type * as LB from "@fp-ts/data/mutable/MutableListBuilder"

import * as DE from "@fp-ts/data/Equal"
import * as DH from "@fp-ts/data/Hash"

/** @internal */
export class MutableListBuilder<A> implements LB.MutableListBuilder<A>, DE.Equal {
  readonly _id: LB.TypeId = Symbol.for("@fp-ts/data/MutableListBuilder") as LB.TypeId

  constructor(
    public first: List<A>,
    public last0: L.ConsImpl<A> | undefined,
    public len: number
  ) {}

  [Symbol.iterator](): Iterator<A> {
    return this.first[Symbol.iterator]()
  }

  [DH.Hash.symbol](): number {
    return DH.random(this)
  }

  [DE.Equal.symbol](that: unknown) {
    return this === that
  }

  get length(): number {
    return this.len
  }
}

/** @internal */
export const make = <A>(): LB.MutableListBuilder<A> => new MutableListBuilder(L.nil(), void 0, 0)

/** @internal */
export const append = <A>(elem: A) =>
  (self: LB.MutableListBuilder<A>): LB.MutableListBuilder<A> => {
    const last1 = new L.ConsImpl(elem, L.nil())
    if (self.len === 0) {
      self.first = last1
    } else {
      self.last0!.tail = last1
    }
    self.last0 = last1
    self.len += 1
    return self
  }

/** @internal */
export const build = <A>(self: LB.MutableListBuilder<A>): List<A> => {
  return self.first
}

/** @internal */
export const isEmpty = <A>(self: LB.MutableListBuilder<A>): boolean => {
  return self.len === 0
}

/** @internal */
export const unsafeHead = <A>(self: LB.MutableListBuilder<A>): A => {
  if (isEmpty(self)) {
    throw new Error("Expected MutableListBuilder to be not empty")
  }
  return (self.first as Cons<A>).head
}

/** @internal */
export const unsafeTail = <A>(self: LB.MutableListBuilder<A>): List<A> => {
  if (isEmpty(self)) {
    throw new Error("Expected MutableListBuilder to be not empty")
  }
  return (self.first as Cons<A>).tail
}

/** @internal */
export const prepend = <A>(elem: A) =>
  (self: LB.MutableListBuilder<A>): LB.MutableListBuilder<A> => {
    pipe(self, insert(0, elem))
    return self
  }

/** @internal */
export const unprepend = <A>(self: LB.MutableListBuilder<A>): A => {
  if (isEmpty(self)) {
    throw new Error("no such element")
  }
  const h = (self.first as Cons<A>).head
  self.first = (self.first as Cons<A>).tail
  self.len -= 1
  return h
}

/** @internal */
export const reduce = <A, B>(b: B, f: (b: B, a: A) => B) =>
  (self: LB.MutableListBuilder<A>): B => {
    return pipe(self.first, L.reduce(b, f))
  }

/** @internal */
export const insert = <A>(idx: number, elem: A) =>
  (self: LB.MutableListBuilder<A>): LB.MutableListBuilder<A> => {
    if (idx < 0 || idx > self.len) {
      throw new Error(`Index ${idx} out of bounds ${0} ${self.len - 1}`)
    }
    if (idx === self.len) {
      pipe(self, append(elem))
    } else {
      const p = pipe(self, locate(idx))
      const nx = new L.ConsImpl(elem, pipe(self, getNext(p)))
      if (p === undefined) {
        self.first = nx
      } else {
        ;(p as L.ConsImpl<A>).tail = nx
      }
      self.len += 1
    }
    return self
  }

/** @internal */
const getNext = <A>(p: List<A> | undefined) =>
  (self: LB.MutableListBuilder<A>): List<A> => {
    if (p === undefined) {
      return self.first
    } else {
      return L.unsafeTail(p)!
    }
  }

/** @internal */
const locate = (i: number) =>
  <A>(self: LB.MutableListBuilder<A>): List<A> | undefined => {
    if (i === 0) {
      return undefined
    } else if (i === self.len) {
      return self.last0
    } else {
      let p = self.first
      for (let j = i - 1; j > 0; j--) {
        p = L.unsafeTail(p)!
      }
      return p
    }
  }
