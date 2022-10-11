import { pipe } from "@fp-ts/core/Function"
import * as L from "@fp-ts/data/internal/List"
import type { Cons, List } from "@fp-ts/data/List"
import type * as LB from "@fp-ts/data/MutableListBuilder"

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

export const build = <A>(self: LB.MutableListBuilder<A>): List<A> => {
  return self.first
}

export const isEmpty = <A>(self: LB.MutableListBuilder<A>): boolean => {
  return self.len === 0
}

export const unsafeHead = <A>(self: LB.MutableListBuilder<A>): A => {
  if (isEmpty(self)) {
    throw new Error("Expected MutableListBuilder to be not empty")
  }
  return (self.first as Cons<A>).head
}

export const unsafeTail = <A>(self: LB.MutableListBuilder<A>): List<A> => {
  if (isEmpty(self)) {
    throw new Error("Expected MutableListBuilder to be not empty")
  }
  return (self.first as Cons<A>).tail
}

export const prepend = <A>(elem: A) =>
  (self: LB.MutableListBuilder<A>): LB.MutableListBuilder<A> => {
    pipe(self, insert(0, elem))
    return self
  }

export const unprepend = <A>(self: LB.MutableListBuilder<A>): A => {
  if (isEmpty(self)) {
    throw new Error("no such element")
  }
  const h = (self.first as Cons<A>).head
  self.first = (self.first as Cons<A>).tail
  self.len -= 1
  return h
}

export const reduce = <A, B>(b: B, f: (b: B, a: A) => B) =>
  (self: LB.MutableListBuilder<A>): B => {
    return pipe(self.first, L.reduce(b, f))
  }

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

const getNext = <A>(p: List<A> | undefined) =>
  (self: LB.MutableListBuilder<A>): List<A> => {
    if (p === undefined) {
      return self.first
    } else {
      return L.unsafeTail(p)!
    }
  }

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
