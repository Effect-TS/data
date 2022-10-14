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
import { pipe } from "@fp-ts/core/Function"
import * as O from "@fp-ts/core/Option"
import type { Predicate } from "@fp-ts/core/Predicate"
import type { Refinement } from "@fp-ts/core/Refinement"
import type * as _fromIdentity from "@fp-ts/core/typeclasses/FromIdentity"
import type * as _functor from "@fp-ts/core/typeclasses/Functor"
import * as DE from "@fp-ts/data/Equal"
import * as DH from "@fp-ts/data/Hash"
import type * as IQ from "@fp-ts/data/ImmutableQueue"
import * as II from "@fp-ts/data/internal/Iterable"
import * as LI from "@fp-ts/data/internal/List"
import * as L from "@fp-ts/data/List"

export const ImmutableQueueTypeId: IQ.TypeId = Symbol.for(
  "@fp-ts/data/ImmutableQueue"
) as IQ.TypeId

class ImmutableQueueImpl<A> implements IQ.ImmutableQueue<A>, Iterable<A>, DE.Equal {
  readonly _id: IQ.TypeId = ImmutableQueueTypeId
  readonly _A: (_: never) => A = (_) => _
  constructor(public _in: L.List<A>, public _out: L.List<A>) {}
  [Symbol.iterator](): Iterator<A> {
    return pipe(this._out, II.concat(L.reverse(this._in)))[Symbol.iterator]()
  }
  [DH.Hash.symbol](): number {
    return pipe(
      DH.evaluate(this._id),
      DH.combine(DH.evaluate(this._in)),
      DH.combine(DH.evaluate(this._out))
    )
  }
  [DE.Equal.symbol](that: unknown): boolean {
    return (
      isImmutableQueue(that) &&
      pipe(this._in, DE.equals(that._in)) &&
      pipe(this._out, DE.equals(that._out))
    )
  }
}

const _Empty = new ImmutableQueueImpl(LI._Nil, LI._Nil)

/** @internal */
export function isImmutableQueue<A>(u: Iterable<A>): u is IQ.ImmutableQueue<A>
export function isImmutableQueue(u: unknown): u is IQ.ImmutableQueue<unknown>
export function isImmutableQueue(u: unknown): u is IQ.ImmutableQueue<unknown> {
  return (
    typeof u === "object" &&
    u != null &&
    "_id" in u &&
    u["_id"] === ImmutableQueueTypeId
  )
}

/** @internal */
export function empty<A>(): IQ.ImmutableQueue<A> {
  return _Empty
}

/** @internal */
export function of<A>(a: A): IQ.ImmutableQueue<A> {
  return new ImmutableQueueImpl(LI._Nil, L.cons(a, LI._Nil))
}

/** @internal */
export function from<A>(source: Iterable<A>): IQ.ImmutableQueue<A> {
  if (isImmutableQueue(source)) {
    return source
  }
  return new ImmutableQueueImpl(LI._Nil, L.fromIterable(source))
}

/** @internal */
export function make<As extends ReadonlyArray<any>>(
  ...items: As
): IQ.ImmutableQueue<As[number]> {
  return from(items)
}

/** @internal */
export function isEmpty<A>(self: IQ.ImmutableQueue<A>): boolean {
  return L.isNil(self._in) && L.isNil(self._out)
}

/** @internal */
export function isNonEmpty<A>(self: IQ.ImmutableQueue<A>): boolean {
  return L.isCons(self._in) || L.isCons(self._out)
}

/** @internal */
export function length<A>(self: IQ.ImmutableQueue<A>): number {
  return LI.length(self._in) + LI.length(self._out)
}

/** @internal */
export function unsafeHead<A>(self: IQ.ImmutableQueue<A>): A {
  if (L.isCons(self._out)) {
    return L.unsafeHead(self._out)
  } else if (L.isCons(self._in)) {
    return L.unsafeLast(self._in)
  } else {
    throw new Error("Expected ImmutableQueue to be not empty")
  }
}

/** @internal */
export function unsafeTail<A>(
  self: IQ.ImmutableQueue<A>
): IQ.ImmutableQueue<A> {
  if (L.isCons(self._out)) {
    return new ImmutableQueueImpl(self._in, self._out.tail)
  } else if (L.isCons(self._in)) {
    return new ImmutableQueueImpl(
      LI._Nil,
      pipe(self._in, L.reverse, L.unsafeTail)
    )
  } else {
    throw new Error("Expected ImmutableQueue to be not empty")
  }
}

/** @internal */
export function head<A>(self: IQ.ImmutableQueue<A>): O.Option<A> {
  return isEmpty(self) ? O.none : O.some(unsafeHead(self))
}

/** @internal */
export function tail<A>(
  self: IQ.ImmutableQueue<A>
): O.Option<IQ.ImmutableQueue<A>> {
  return isEmpty(self) ? O.none : O.some(unsafeTail(self))
}

/** @internal */
export function prepend<B>(elem: B) {
  return <A>(self: IQ.ImmutableQueue<A>): IQ.ImmutableQueue<A | B> => {
    return new ImmutableQueueImpl(self._in, pipe(self._out, L.prepend(elem)))
  }
}

/** @internal */
export function enqueue<B>(elem: B) {
  return <A>(self: IQ.ImmutableQueue<A>): IQ.ImmutableQueue<A | B> => {
    return new ImmutableQueueImpl(pipe(self._in, L.prepend(elem)), self._out)
  }
}

/** @internal */
export function unsafeDequeue<A>(
  self: IQ.ImmutableQueue<A>
): readonly [A, IQ.ImmutableQueue<A>] {
  if (L.isNil(self._out) && L.isCons(self._in)) {
    const rev = L.reverse(self._in)
    return [
      L.unsafeHead(rev),
      new ImmutableQueueImpl(LI._Nil, L.unsafeTail(rev))
    ]
  } else if (L.isCons(self._out)) {
    return [
      L.unsafeHead(self._out),
      new ImmutableQueueImpl(self._in, L.unsafeTail(self._out))
    ]
  } else {
    throw new Error("Expected ImmutableQueue to be not empty")
  }
}

/** @internal */
export function dequeue<A>(
  self: IQ.ImmutableQueue<A>
): O.Option<readonly [A, IQ.ImmutableQueue<A>]> {
  return isEmpty(self) ? O.none : O.some(unsafeDequeue(self))
}

/** @internal */
export function map<A, B>(f: (a: A) => B) {
  return (self: IQ.ImmutableQueue<A>): IQ.ImmutableQueue<B> => {
    return new ImmutableQueueImpl(
      pipe(self._in, L.map(f)),
      pipe(self._out, L.map(f))
    )
  }
}

/** @internal */
export function reduce<A, B>(b: B, f: (b: B, a: A) => B) {
  return (self: IQ.ImmutableQueue<A>): B => {
    let acc = b
    let these = self
    while (isNonEmpty(these)) {
      acc = f(acc, unsafeHead(these))
      these = unsafeTail(these)
    }
    return acc
  }
}

/** @internal */
export function some<A>(predicate: Predicate<A>) {
  return (self: IQ.ImmutableQueue<A>): boolean => {
    return (
      pipe(self._in, LI.any(predicate)) || pipe(self._out, LI.any(predicate))
    )
  }
}

/** @internal */
export function findFirst<A, B extends A>(
  refinement: Refinement<A, B>
): (self: IQ.ImmutableQueue<A>) => O.Option<B>
export function findFirst<A>(
  predicate: Predicate<A>
): (self: IQ.ImmutableQueue<A>) => O.Option<A>
export function findFirst<A>(predicate: Predicate<A>) {
  return (self: IQ.ImmutableQueue<A>): O.Option<A> => {
    let these = self
    while (isNonEmpty(these)) {
      const head = unsafeHead(these)
      if (predicate(head)) {
        return O.some(head)
      }
      these = unsafeTail(these)
    }
    return O.none
  }
}

/** @internal */
export function filter<A, B extends A>(
  refinement: Refinement<A, B>
): (self: IQ.ImmutableQueue<A>) => IQ.ImmutableQueue<B>
export function filter<A>(
  predicate: Predicate<A>
): (self: IQ.ImmutableQueue<A>) => IQ.ImmutableQueue<A>
export function filter<A>(predicate: Predicate<A>) {
  return (self: IQ.ImmutableQueue<A>): IQ.ImmutableQueue<A> => {
    return new ImmutableQueueImpl(
      pipe(self._in, L.filter(predicate)),
      pipe(self._out, L.filter(predicate))
    )
  }
}

/** @internal */
export function enqueueAll<B>(iter: Iterable<B>) {
  return <A>(self: IQ.ImmutableQueue<A>): IQ.ImmutableQueue<A | B> => {
    let newIn: L.List<A | B>
    if (isImmutableQueue(iter)) {
      newIn = pipe(
        iter._in,
        L.concat(pipe(iter._out, LI.reversePrependAll(self._in)))
      )
    } else if (L.isList(iter)) {
      newIn = pipe(iter, LI.reversePrependAll(self._in))
    } else {
      let result: L.List<A | B> = self._in
      for (const b of iter) {
        result = new LI.ConsImpl(b, result)
      }
      newIn = result
    }
    if (newIn === self._in) {
      return self
    } else {
      return new ImmutableQueueImpl<A | B>(newIn, self._out)
    }
  }
}

/** @internal */
export const Functor: _functor.Functor<IQ.ImmutableQueueTypeLambda> = {
  map
}

/** @internal */
export const FromIdentity: _fromIdentity.FromIdentity<IQ.ImmutableQueueTypeLambda> = {
  of
}
