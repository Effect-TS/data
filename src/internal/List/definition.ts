/*
 * This file is ported from
 *
 * Scala (https://www.scala-lang.org)
 *
 * Copyright EPFL and Lightbend, Inc.
 *
 * Licensed under Apache License 2.0
 * (http://www.apache.org/licenses/LICENSE-2.0).
 */
import { pipe, unsafeCoerce } from "@fp-ts/core/Function"
import * as O from "@fp-ts/core/Option"
import type { Predicate } from "@fp-ts/core/Predicate"
import type { Refinement } from "@fp-ts/core/Refinement"
import * as R from "@fp-ts/core/Result"

export const ListTypeId = Symbol.for("@fp-ts/data/List")
export type ListTypeId = typeof ListTypeId

export const _A = Symbol.for("@fp-ts/data/List/_A")
export type _A = typeof _A

export type List<A> = Cons<A> | Nil<A>

export class Cons<A> implements Iterable<A> {
  readonly _tag = "Cons"
  readonly [_A]!: (_: never) => A
  readonly [ListTypeId] = ListTypeId
  constructor(readonly head: A, public tail: List<A>) {}
  [Symbol.iterator](): Iterator<A> {
    let done = false
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let these: List<A> = this
    return {
      next() {
        if (done) {
          return this.return!()
        }
        if (these._tag === "Nil") {
          done = true
          return this.return!()
        }
        const value: A = these.head
        these = these.tail
        return { done, value }
      },
      return(value?: unknown) {
        if (!done) {
          done = true
        }
        return { done: true, value }
      }
    }
  }
}

export class Nil<A> implements Iterable<A> {
  readonly _tag = "Nil"
  readonly [_A]!: (_: never) => A
  readonly [ListTypeId] = ListTypeId;
  [Symbol.iterator](): Iterator<A> {
    return {
      next() {
        return { done: true, value: undefined }
      }
    }
  }
}

export const _Nil = new Nil<never>()

export function nil<A = never>(): Nil<A> {
  return _Nil
}

export function cons<A>(head: A, tail: List<A>): Cons<A> {
  return new Cons(head, tail)
}

export function isNil<A>(self: List<A>): self is Nil<A> {
  return self._tag === "Nil"
}

export function isCons<A>(self: List<A>): self is Cons<A> {
  return self._tag === "Cons"
}

export function length<A>(self: List<A>): number {
  let these = self
  let len = 0
  while (!isNil(these)) {
    len += 1
    these = these.tail
  }
  return len
}

export function equalsWith<A, B>(
  that: List<B>,
  f: (a: A, b: B) => boolean
) {
  return (self: List<A>): boolean => {
    if ((self as List<A | B>) === that) {
      return true
    } else if (length(self) !== length(that)) {
      return false
    } else {
      const i0 = self[Symbol.iterator]()
      const i1 = that[Symbol.iterator]()
      let a: IteratorResult<A>
      let b: IteratorResult<B>
      while (!(a = i0.next()).done && !(b = i1.next()).done) {
        if (!f(a.value, b.value)) {
          return false
        }
      }
      return true
    }
  }
}

export function isList<A>(u: Iterable<A>): u is List<A>
export function isList(u: unknown): u is List<unknown>
export function isList(u: unknown): u is List<unknown> {
  return typeof u === "object" && u != null && ListTypeId in u
}

export function reduce<A, B>(b: B, f: (b: B, a: A) => B): (self: List<A>) => B {
  return (self) => {
    let acc = b
    let these = self
    while (!isNil(these)) {
      acc = f(acc, these.head)
      these = these.tail
    }
    return acc
  }
}

export function unsafeHead<A>(self: List<A>): A {
  if (isNil(self)) {
    throw new Error("Expected List to be not empty")
  }
  return self.head
}

export function unsafeTail<A>(self: List<A>): List<A> {
  if (isNil(self)) {
    throw new Error("Expected List to be not empty")
  }
  return self.tail
}

export function drop(n: number) {
  return <A>(self: List<A>): List<A> => {
    if (n <= 0) {
      return self
    }

    if (n >= length(self)) {
      return nil<A>()
    }

    let these = self

    let i = 0
    while (!isNil(these) && i < n) {
      these = these.tail

      i += 1
    }

    return these
  }
}

export function take(n: number) {
  return <A>(self: List<A>): List<A> => {
    if (n <= 0) {
      return self
    }

    if (n >= length(self)) {
      return self
    }

    let these = make(unsafeHead(self))

    let i = 0
    while (!isNil(these) && i < n) {
      these = pipe(these, prependAll(make(unsafeHead(self))))

      i += 1
    }

    return these
  }
}

export function prependAll<B>(prefix: List<B>) {
  return <A>(self: List<A>): List<A | B> => {
    if (isNil(self)) {
      return prefix
    } else if (isNil(prefix)) {
      return self
    } else {
      const result = cons<A | B>(prefix.head, self)
      let curr = result
      let that = prefix.tail
      while (!isNil(that)) {
        const temp = cons<A | B>(that.head, self)
        curr.tail = temp
        curr = temp
        that = that.tail
      }
      return result
    }
  }
}

export function concat<B>(that: List<B>) {
  return <A>(self: List<A>): List<A | B> => pipe(that, prependAll(self))
}

export function empty<A = never>(): List<A> {
  return nil()
}

export function any<A>(p: Predicate<A>) {
  return (self: List<A>): boolean => {
    let these = self
    while (!isNil(these)) {
      if (p(these.head)) {
        return true
      }
      these = these.tail
    }
    return false
  }
}

export function filter<A, B extends A>(p: Refinement<A, B>): (self: List<A>) => List<B>
export function filter<A>(p: Predicate<A>): (self: List<A>) => List<A>
export function filter<A>(p: Predicate<A>) {
  return (self: List<A>): List<A> => filterCommon_(self, p, false)
}

function noneIn<A>(l: List<A>, p: Predicate<A>, isFlipped: boolean): List<A> {
  /* eslint-disable no-constant-condition */
  while (true) {
    if (isNil(l)) {
      return nil()
    } else {
      if (p(l.head) !== isFlipped) {
        return allIn(l, l.tail, p, isFlipped)
      } else {
        l = l.tail
      }
    }
  }
}

function allIn<A>(
  start: List<A>,
  remaining: List<A>,
  p: Predicate<A>,
  isFlipped: boolean
): List<A> {
  /* eslint-disable no-constant-condition */
  while (true) {
    if (isNil(remaining)) {
      return start
    } else {
      if (p(remaining.head) !== isFlipped) {
        remaining = remaining.tail
      } else {
        return partialFill(start, remaining, p, isFlipped)
      }
    }
  }
}

function partialFill<A>(
  origStart: List<A>,
  firstMiss: List<A>,
  p: Predicate<A>,
  isFlipped: boolean
): List<A> {
  const newHead = cons<A>(unsafeHead(origStart)!, nil())
  let toProcess = unsafeTail(origStart)! as Cons<A>
  let currentLast = newHead

  while (!(toProcess === firstMiss)) {
    const newElem = cons(unsafeHead(toProcess)!, nil())
    currentLast.tail = newElem
    currentLast = unsafeCoerce(newElem)
    toProcess = unsafeCoerce(toProcess.tail)
  }

  let next = firstMiss.tail
  let nextToCopy: Cons<A> = unsafeCoerce(next)
  while (!isNil(next)) {
    const head = unsafeHead(next)!
    if (p(head) !== isFlipped) {
      next = next.tail
    } else {
      while (!(nextToCopy === next)) {
        const newElem = cons(unsafeHead(nextToCopy)!, nil())
        currentLast.tail = newElem
        currentLast = newElem
        nextToCopy = unsafeCoerce(nextToCopy.tail)
      }
      nextToCopy = unsafeCoerce(next.tail)
      next = next.tail
    }
  }

  if (!isNil(nextToCopy)) {
    currentLast.tail = nextToCopy
  }

  return newHead
}

function filterCommon_<A>(list: List<A>, p: Predicate<A>, isFlipped: boolean): List<A> {
  return noneIn(list, p, isFlipped)
}

export function find<A, B extends A>(p: Refinement<A, B>): (self: List<A>) => O.Option<B>
export function find<A>(p: Predicate<A>): (self: List<A>) => O.Option<A>
export function find<A>(p: Predicate<A>) {
  return (self: List<A>): O.Option<A> => {
    let these = self
    while (!isNil(these)) {
      if (p(these.head)) {
        return O.some(these.head)
      }
      these = these.tail
    }
    return O.none
  }
}

export function flatMap<A, B>(f: (a: A) => List<B>) {
  return (self: List<A>): List<B> => {
    let rest = self
    let h: Cons<B> | undefined = undefined
    let t: Cons<B> | undefined = undefined
    while (!isNil(rest)) {
      let bs = f(rest.head)
      while (!isNil(bs)) {
        const nx = cons(bs.head, nil())
        if (t === undefined) {
          h = nx
        } else {
          t.tail = nx
        }
        t = nx
        bs = bs.tail
      }
      rest = rest.tail
    }
    if (h === undefined) return nil()
    else return h
  }
}

export function all<A>(f: Predicate<A>) {
  return (self: List<A>): boolean => {
    for (const a of self) {
      if (!f(a)) {
        return false
      }
    }
    return true
  }
}

export function forEach<A, U>(f: (a: A) => U) {
  return (self: List<A>): void => {
    let these = self
    while (!isNil(these)) {
      f(these.head)
      these = these.tail
    }
  }
}

export function from<A>(prefix: Iterable<A>): List<A> {
  const iter = prefix[Symbol.iterator]()
  let a: IteratorResult<A>
  if (!(a = iter.next()).done) {
    const result = cons(a.value, nil())
    let curr = result
    while (!(a = iter.next()).done) {
      const temp = cons(a.value, nil())
      curr.tail = temp
      curr = temp
    }
    return result
  } else {
    return nil()
  }
}

export function make<As extends ReadonlyArray<any>>(...prefix: As): List<As[number]> {
  return from(prefix)
}

export function head<A>(self: List<A>): O.Option<A> {
  return isNil(self) ? O.none : O.some(self.head)
}

export function last<A>(self: List<A>): O.Option<A> {
  return isNil(self) ? O.none : O.some(unsafeLast(self)!)
}

export function unsafeLast<A>(self: List<A>): A {
  if (isNil(self)) {
    throw new Error("Expected List to be not empty")
  }
  let these = self
  let scout = self.tail
  while (!isNil(scout)) {
    these = scout
    scout = scout.tail
  }
  return these.head
}

export function map<A, B>(f: (a: A) => B) {
  return (self: List<A>): List<B> => {
    if (isNil(self)) {
      return self as unknown as List<B>
    } else {
      const h = cons(f(self.head), nil())
      let t = h
      let rest = self.tail
      while (!isNil(rest)) {
        const nx = cons(f(rest.head), nil())
        t.tail = nx
        t = nx
        rest = rest.tail
      }
      return h
    }
  }
}

export function partition<A>(f: Predicate<A>) {
  return (self: List<A>): readonly [List<A>, List<A>] => {
    const left: Array<A> = []
    const right: Array<A> = []
    for (const a of self) {
      if (f(a)) {
        right.push(a)
      } else {
        left.push(a)
      }
    }
    return [from(left), from(right)]
  }
}

export function partitionMap<A, B, C>(f: (a: A) => R.Result<B, C>) {
  return (self: List<A>): readonly [List<B>, List<C>] => {
    const left: Array<B> = []
    const right: Array<C> = []
    for (const a of self) {
      const e = f(a)
      if (R.isFailure(e)) {
        left.push(e.failure)
      } else {
        right.push(e.success)
      }
    }
    return [from(left), from(right)]
  }
}

export function prepend<B>(elem: B) {
  return <A>(self: List<A>): Cons<A | B> => cons<A | B>(elem, self)
}

export function reverse<A>(self: List<A>): List<A> {
  let result = empty<A>()
  let these = self
  while (!isNil(these)) {
    result = pipe(result, prepend(these.head))
    these = these.tail
  }
  return result
}

export function splitAt(n: number) {
  return <A>(self: List<A>): readonly [List<A>, List<A>] => [take(n)(self), drop(n)(self)]
}

export function tail<A>(self: List<A>): O.Option<List<A>> {
  return isNil(self) ? O.none : O.some(self.tail)
}
