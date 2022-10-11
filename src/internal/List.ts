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
import type * as L from "@fp-ts/data/List"

import type * as _apply from "@fp-ts/core/typeclasses/Apply"
import type * as _fromIdentity from "@fp-ts/core/typeclasses/FromIdentity"
import type * as _functor from "@fp-ts/core/typeclasses/Functor"
import * as DE from "@fp-ts/data/DeepEqual"
import * as DH from "@fp-ts/data/DeepHash"

/** @internal */
export const ListTypeId: L.TypeId = Symbol.for("@fp-ts/data/List") as L.TypeId

/** @internal */
export class ConsImpl<A> implements Iterable<A>, L.Cons<A>, DE.DeepEqual {
  readonly _tag = "Cons"
  readonly _A: (_: never) => A = (_) => _
  readonly _id: L.TypeId = ListTypeId
  constructor(readonly head: A, public tail: L.List<A>) {}
  [DH.DeepHash.symbol](): number {
    return pipe(this, reduce(DH.deepHash(this._tag), (h, a) => pipe(h, DH.combine(DH.deepHash(a)))))
  }
  [DE.DeepEqual.symbol](that: unknown): boolean {
    return isList(that) && that._tag === "Cons" ?
      DE.deepEqual(that.head)(this.head) && DE.deepEqual(that.tail)(this.tail) :
      false
  }
  [Symbol.iterator](): Iterator<A> {
    let done = false
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let these: L.List<A> = this
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

/** @internal */
export class NilImpl<A> implements Iterable<A>, L.Nil<A>, DE.DeepEqual {
  readonly _tag = "Nil"
  readonly _A: (_: never) => A = (_) => _
  readonly _id: L.TypeId = ListTypeId;

  [DH.DeepHash.symbol](): number {
    return DH.deepHash(this._tag)
  }

  [DE.DeepEqual.symbol](that: unknown): boolean {
    return isList(that) && that._tag === "Nil"
  }

  [Symbol.iterator](): Iterator<A> {
    return {
      next() {
        return { done: true, value: undefined }
      }
    }
  }
}

/** @internal */
export const _Nil: L.Nil<never> = new NilImpl<never>()

/** @internal */
export function nil<A = never>(): L.Nil<A> {
  return _Nil
}

/** @internal */
export function cons<A>(head: A, tail: L.List<A>): L.Cons<A> {
  return new ConsImpl(head, tail)
}

/** @internal */
export function isNil<A>(self: L.List<A>): self is L.Nil<A> {
  return self._tag === "Nil"
}

/** @internal */
export function isCons<A>(self: L.List<A>): self is L.Cons<A> {
  return self._tag === "Cons"
}

/** @internal */
export function length<A>(self: L.List<A>): number {
  let these = self
  let len = 0
  while (!isNil(these)) {
    len += 1
    these = these.tail
  }
  return len
}

/** @internal */
export function equalsWith<A, B>(
  that: L.List<B>,
  f: (a: A, b: B) => boolean
) {
  return (self: L.List<A>): boolean => {
    if ((self as L.List<A | B>) === that) {
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

/** @internal */
export function isList<A>(u: Iterable<A>): u is L.List<A>
/** @internal */
export function isList(u: unknown): u is L.List<unknown>
/** @internal */
export function isList(u: unknown): u is L.List<unknown> {
  return typeof u === "object" && u != null && "_id" in u && u["_id"] === ListTypeId
}

/** @internal */
export function reduce<A, B>(b: B, f: (b: B, a: A) => B): (self: L.List<A>) => B {
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

/** @internal */
export function unsafeHead<A>(self: L.List<A>): A {
  if (isNil(self)) {
    throw new Error("Expected List to be not empty")
  }
  return self.head
}

/** @internal */
export function unsafeTail<A>(self: L.List<A>): L.List<A> {
  if (isNil(self)) {
    throw new Error("Expected List to be not empty")
  }
  return self.tail
}

/** @internal */
export function drop(n: number) {
  return <A>(self: L.List<A>): L.List<A> => {
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

/** @internal */
export function take(n: number) {
  return <A>(self: L.List<A>): L.List<A> => {
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

/** @internal */
export function prependAll<B>(prefix: L.List<B>) {
  return <A>(self: L.List<A>): L.List<A | B> => {
    if (isNil(self)) {
      return prefix
    } else if (isNil(prefix)) {
      return self
    } else {
      const result = new ConsImpl<A | B>(prefix.head, self)
      let curr = result
      let that = prefix.tail
      while (!isNil(that)) {
        const temp = new ConsImpl<A | B>(that.head, self)
        curr.tail = temp
        curr = temp
        that = that.tail
      }
      return result
    }
  }
}

/** @internal */
export function concat<B>(that: L.List<B>) {
  return <A>(self: L.List<A>): L.List<A | B> => pipe(that, prependAll(self))
}

/** @internal */
export function empty<A = never>(): L.List<A> {
  return nil()
}

/** @internal */
export function any<A>(p: Predicate<A>) {
  return (self: L.List<A>): boolean => {
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

/** @internal */
export function filter<A, B extends A>(p: Refinement<A, B>): (self: L.List<A>) => L.List<B>
/** @internal */
export function filter<A>(p: Predicate<A>): (self: L.List<A>) => L.List<A>
/** @internal */
export function filter<A>(p: Predicate<A>) {
  return (self: L.List<A>): L.List<A> => filterCommon_(self, p, false)
}

/** @internal */
function noneIn<A>(l: L.List<A>, p: Predicate<A>, isFlipped: boolean): L.List<A> {
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

/** @internal */
function allIn<A>(
  start: L.List<A>,
  remaining: L.List<A>,
  p: Predicate<A>,
  isFlipped: boolean
): L.List<A> {
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

/** @internal */
function partialFill<A>(
  origStart: L.List<A>,
  firstMiss: L.List<A>,
  p: Predicate<A>,
  isFlipped: boolean
): L.List<A> {
  const newHead = new ConsImpl<A>(unsafeHead(origStart)!, nil())
  let toProcess = unsafeTail(origStart)! as L.Cons<A>
  let currentLast = newHead

  while (!(toProcess === firstMiss)) {
    const newElem = new ConsImpl(unsafeHead(toProcess)!, nil())
    currentLast.tail = newElem
    currentLast = unsafeCoerce(newElem)
    toProcess = unsafeCoerce(toProcess.tail)
  }

  let next = firstMiss.tail
  let nextToCopy: L.Cons<A> = unsafeCoerce(next)
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

/** @internal */
function filterCommon_<A>(list: L.List<A>, p: Predicate<A>, isFlipped: boolean): L.List<A> {
  return noneIn(list, p, isFlipped)
}

/** @internal */
export function find<A, B extends A>(p: Refinement<A, B>): (self: L.List<A>) => O.Option<B>
/** @internal */
export function find<A>(p: Predicate<A>): (self: L.List<A>) => O.Option<A>
/** @internal */
export function find<A>(p: Predicate<A>) {
  return (self: L.List<A>): O.Option<A> => {
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

/** @internal */
export function flatMap<A, B>(f: (a: A) => L.List<B>) {
  return (self: L.List<A>): L.List<B> => {
    let rest = self
    let h: ConsImpl<B> | undefined = undefined
    let t: ConsImpl<B> | undefined = undefined
    while (!isNil(rest)) {
      let bs = f(rest.head)
      while (!isNil(bs)) {
        const nx = new ConsImpl(bs.head, nil())
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

/** @internal */
export function all<A>(f: Predicate<A>) {
  return (self: L.List<A>): boolean => {
    for (const a of self) {
      if (!f(a)) {
        return false
      }
    }
    return true
  }
}

/** @internal */
export function forEach<A, U>(f: (a: A) => U) {
  return (self: L.List<A>): void => {
    let these = self
    while (!isNil(these)) {
      f(these.head)
      these = these.tail
    }
  }
}

/** @internal */
export function from<A>(prefix: Iterable<A>): L.List<A> {
  const iter = prefix[Symbol.iterator]()
  let a: IteratorResult<A>
  if (!(a = iter.next()).done) {
    const result = new ConsImpl(a.value, nil())
    let curr = result
    while (!(a = iter.next()).done) {
      const temp = new ConsImpl(a.value, nil())
      curr.tail = temp
      curr = temp
    }
    return result
  } else {
    return nil()
  }
}

/** @internal */
export function make<As extends ReadonlyArray<any>>(...prefix: As): L.List<As[number]> {
  return from(prefix)
}

/** @internal */
export function head<A>(self: L.List<A>): O.Option<A> {
  return isNil(self) ? O.none : O.some(self.head)
}

/** @internal */
export function last<A>(self: L.List<A>): O.Option<A> {
  return isNil(self) ? O.none : O.some(unsafeLast(self)!)
}

/** @internal */
export function unsafeLast<A>(self: L.List<A>): A {
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

/** @internal */
export function map<A, B>(f: (a: A) => B) {
  return (self: L.List<A>): L.List<B> => {
    if (isNil(self)) {
      return self as unknown as L.List<B>
    } else {
      const h = new ConsImpl(f(self.head), nil())
      let t = h
      let rest = self.tail
      while (!isNil(rest)) {
        const nx = new ConsImpl(f(rest.head), nil())
        t.tail = nx
        t = nx
        rest = rest.tail
      }
      return h
    }
  }
}

/** @internal */
export function partition<A>(f: Predicate<A>) {
  return (self: L.List<A>): readonly [L.List<A>, L.List<A>] => {
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

/** @internal */
export function partitionMap<A, B, C>(f: (a: A) => R.Result<B, C>) {
  return (self: L.List<A>): readonly [L.List<B>, L.List<C>] => {
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

/** @internal */
export function prepend<B>(elem: B) {
  return <A>(self: L.List<A>): L.Cons<A | B> => cons<A | B>(elem, self)
}

/** @internal */
export function reverse<A>(self: L.List<A>): L.List<A> {
  let result = empty<A>()
  let these = self
  while (!isNil(these)) {
    result = pipe(result, prepend(these.head))
    these = these.tail
  }
  return result
}

/** @internal */
export function splitAt(n: number) {
  return <A>(self: L.List<A>): readonly [L.List<A>, L.List<A>] => [take(n)(self), drop(n)(self)]
}

/** @internal */
export function tail<A>(self: L.List<A>): O.Option<L.List<A>> {
  return isNil(self) ? O.none : O.some(self.tail)
}

/** @internal */
export const Functor: _functor.Functor<L.ListTypeLambda> = {
  map
}

/** @internal */
export const of: <A>(a: A) => L.List<A> = (a) => cons(a, nil())

/** @internal */
export const FromIdentity: _fromIdentity.FromIdentity<L.ListTypeLambda> = {
  of
}

/** @internal */
export const ap: <A>(
  fa: L.List<A>
) => <B>(self: L.List<(a: A) => B>) => L.List<B> = (fa) =>
  (self) => pipe(self, flatMap((f) => pipe(fa, map((a) => f(a)))))

/** @internal */
export const Apply: _apply.Apply<L.ListTypeLambda> = {
  map,
  ap
}
