import type { Predicate, Refinement } from "@fp-ts/core/Predicate"
import * as Equal from "@fp-ts/data/Equal"
import * as Hash from "@fp-ts/data/Hash"
import type { HashMap } from "@fp-ts/data/HashMap"
import type * as HS from "@fp-ts/data/HashSet"
import * as HM from "@fp-ts/data/internal/HashMap"

/** @internal */
export const HashSetTypeId: HS.TypeId = Symbol.for("@fp-ts/data/HashSet") as HS.TypeId

/** @internal */
export class HashSetImpl<A> implements HS.HashSet<A> {
  readonly _id: HS.TypeId = HashSetTypeId

  constructor(readonly _keyMap: HashMap<A, unknown>) {}

  [Symbol.iterator](): Iterator<A> {
    return HM.keys(this._keyMap)
  }

  [Hash.symbol](): number {
    return Hash.combine(Hash.hash(this._keyMap))(Hash.hash("HashSet"))
  }

  [Equal.symbol](that: unknown): boolean {
    if (isHashSet(that)) {
      return (
        HM.size(this._keyMap) === HM.size((that as HashSetImpl<A>)._keyMap) &&
        Equal.equals(this._keyMap, (that as HashSetImpl<A>)._keyMap)
      )
    }
    return false
  }

  toString() {
    return `HashSet(${Array.from(this).map(String).join(", ")})`
  }

  toJSON() {
    return {
      _tag: "HashSet",
      values: Array.from(this)
    }
  }

  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toJSON()
  }
}

/** @internal */
export function isHashSet<A>(u: Iterable<A>): u is HS.HashSet<A>
export function isHashSet(u: unknown): u is HS.HashSet<unknown>
export function isHashSet(u: unknown): u is HS.HashSet<unknown> {
  return typeof u === "object" && u != null && "_id" in u && u["_id"] === HashSetTypeId
}

/** @internal */
export function empty<A = never>(): HS.HashSet<A> {
  return new HashSetImpl(HM.empty<A, unknown>())
}

/** @internal */
export function from<A>(elements: Iterable<A>): HS.HashSet<A> {
  const set = beginMutation(empty<A>())
  for (const value of elements) {
    add(value)(set)
  }
  return endMutation(set)
}

/** @internal */
export function make<As extends ReadonlyArray<any>>(...elements: As): HS.HashSet<As[number]> {
  const set = beginMutation(empty<As[number]>())
  for (const value of elements) {
    add(value)(set)
  }
  return endMutation(set)
}

/** @internal */
export function has<A>(value: A) {
  return (self: HS.HashSet<A>): boolean => {
    return HM.has(value)((self as HashSetImpl<A>)._keyMap)
  }
}

/** @internal */
export function some<A>(f: Predicate<A>) {
  return (self: HS.HashSet<A>): boolean => {
    let found = false
    for (const value of self) {
      found = f(value)
      if (found) {
        break
      }
    }
    return found
  }
}

/** @internal */
export function every<A>(f: Predicate<A>) {
  return (self: HS.HashSet<A>): boolean => {
    return !some<A>((a) => !f(a))(self)
  }
}

/** @internal */
export function isSubset<A>(that: HS.HashSet<A>) {
  return (self: HS.HashSet<A>): boolean => {
    return every<A>((value) => has(value)(that))(self)
  }
}

/** @internal */
export function values<A>(self: HS.HashSet<A>): IterableIterator<A> {
  return HM.keys((self as HashSetImpl<A>)._keyMap)
}

/** @internal */
export function size<A>(self: HS.HashSet<A>): number {
  return HM.size((self as HashSetImpl<A>)._keyMap)
}

/** @internal */
export function beginMutation<A>(self: HS.HashSet<A>): HS.HashSet<A> {
  return new HashSetImpl(HM.beginMutation((self as HashSetImpl<A>)._keyMap))
}

/** @internal */
export function endMutation<A>(self: HS.HashSet<A>): HS.HashSet<A> {
  ;((self as HashSetImpl<A>)._keyMap as HM.HashMapImpl<A, unknown>)._editable = false
  return self
}

/** @internal */
export function mutate<A>(f: (set: HS.HashSet<A>) => void) {
  return (self: HS.HashSet<A>): HS.HashSet<A> => {
    const transient = beginMutation(self)
    f(transient)
    return endMutation(transient)
  }
}

/** @internal */
export function add<A>(value: A) {
  return (self: HS.HashSet<A>): HS.HashSet<A> => {
    return ((self as HashSetImpl<A>)._keyMap as HM.HashMapImpl<A, unknown>)._editable
      ? (HM.set(value as A, true as unknown)((self as HashSetImpl<A>)._keyMap), self)
      : new HashSetImpl(HM.set(value as A, true as unknown)((self as HashSetImpl<A>)._keyMap))
  }
}

/** @internal */
export function remove<A>(value: A) {
  return (self: HS.HashSet<A>): HS.HashSet<A> => {
    return (((self as HashSetImpl<A>)._keyMap) as HM.HashMapImpl<A, unknown>)._editable
      ? (HM.remove(value)((self as HashSetImpl<A>)._keyMap), self)
      : new HashSetImpl(HM.remove(value)((self as HashSetImpl<A>)._keyMap))
  }
}

/** @internal */
export function difference<A>(that: Iterable<A>) {
  return (self: HS.HashSet<A>): HS.HashSet<A> => {
    return mutate<A>((set) => {
      for (const value of that) {
        remove(value)(set)
      }
    })(self)
  }
}

/** @internal */
export function intersection<A>(that: Iterable<A>) {
  return (self: HS.HashSet<A>): HS.HashSet<A> => {
    return mutate<A>((set) => {
      for (const value of that) {
        if (has(value)(self)) {
          add(value)(set)
        }
      }
    })(empty<A>())
  }
}

/** @internal */
export function union<A>(that: Iterable<A>) {
  return (self: HS.HashSet<A>): HS.HashSet<A> => {
    return mutate<A>((set) => {
      forEach((value) => {
        add(value)(set)
      })(self)
      for (const value of that) {
        add(value)(set)
      }
    })(empty<A>())
  }
}

/** @internal */
export function toggle<A>(value: A) {
  return (self: HS.HashSet<A>): HS.HashSet<A> => {
    return has(value)(self) ? remove(value)(self) : add(value)(self)
  }
}

/** @internal */
export function map<A, B>(f: (a: A) => B) {
  return (self: HS.HashSet<A>): HS.HashSet<B> => {
    return mutate<B>((set) => {
      forEach<A>((a) => {
        const b = f(a)
        if (!has(b)(set)) {
          add(b)(set)
        }
      })(self)
    })(empty<B>())
  }
}

/** @internal */
export function flatMap<A, B>(f: (a: A) => Iterable<B>) {
  return (self: HS.HashSet<A>): HS.HashSet<B> => {
    return mutate<B>((set) => {
      forEach<A>((a) => {
        for (const b of f(a)) {
          if (!has(b)(set)) {
            add(b)(set)
          }
        }
      })(self)
    })(empty<B>())
  }
}

/** @internal */
export function forEach<A>(f: (value: A) => void) {
  return (self: HS.HashSet<A>): void => {
    HM.forEachWithIndex<unknown, A>((_, k) => {
      f(k)
    })((self as HashSetImpl<A>)._keyMap)
  }
}

/** @internal */
export function reduce<A, Z>(zero: Z, f: (accumulator: Z, value: A) => Z) {
  return (self: HS.HashSet<A>): Z => {
    return HM.reduceWithIndex<Z, unknown, A>(zero, (z, _, a) => f(z, a))(
      (self as HashSetImpl<A>)._keyMap
    )
  }
}

/** @internal */
export function filter<A, B extends A>(f: Refinement<A, B>): (self: HS.HashSet<A>) => HS.HashSet<B>
export function filter<A>(f: Predicate<A>): (self: HS.HashSet<A>) => HS.HashSet<A>
export function filter<A>(f: Predicate<A>) {
  return (self: HS.HashSet<A>): HS.HashSet<A> => {
    return mutate<A>((set) => {
      const iterator = values(self)
      let next: IteratorResult<A, any>
      while (!(next = iterator.next()).done) {
        const value = next.value
        if (f(value)) {
          add(value)(set)
        }
      }
    })(empty<A>())
  }
}

/** @internal */
export function partition<A, B extends A>(
  f: Refinement<A, B>
): (self: HS.HashSet<A>) => readonly [HS.HashSet<A>, HS.HashSet<B>]
export function partition<A>(
  f: Predicate<A>
): (self: HS.HashSet<A>) => readonly [HS.HashSet<A>, HS.HashSet<A>]
export function partition<A>(
  f: Predicate<A>
) {
  return (self: HS.HashSet<A>): readonly [HS.HashSet<A>, HS.HashSet<A>] => {
    const iterator = values(self)
    let next: IteratorResult<A, any>
    const right = beginMutation(empty<A>())
    const left = beginMutation(empty<A>())
    while (!(next = iterator.next()).done) {
      const value = next.value
      if (f(value)) {
        add(value)(right)
      } else {
        add(value)(left)
      }
    }
    return [endMutation(left), endMutation(right)]
  }
}
