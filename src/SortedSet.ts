/**
 * @since 1.0.0
 */

import { pipe } from "@fp-ts/core/Function"
import type { Predicate, Refinement } from "@fp-ts/core/Predicate"
import type { Order } from "@fp-ts/core/typeclass/Order"
import * as Equal from "@fp-ts/data/Equal"
import * as Hash from "@fp-ts/data/Hash"
import * as RBT from "@fp-ts/data/RedBlackTree"

const TypeId: unique symbol = Symbol.for("@fp-ts/data/SortedSet")

/**
 * @since 1.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * @since 1.0.0
 * @category models
 */
export interface SortedSet<A> extends Iterable<A>, Equal.Equal {
  readonly _id: TypeId
  /** @internal */
  readonly keyTree: RBT.RedBlackTree<A, boolean>
}

/** @internal */
class SortedSetImpl<A> implements Iterable<A>, Equal.Equal {
  readonly _id: TypeId = TypeId

  constructor(readonly keyTree: RBT.RedBlackTree<A, boolean>) {}

  [Hash.symbol](): number {
    return pipe(Hash.hash(this.keyTree), Hash.combine(Hash.hash("@fp-ts/data/SortedSet")))
  }

  [Equal.symbol](that: unknown): boolean {
    return isSortedSet(that) && Equal.equals(this.keyTree, that.keyTree)
  }

  [Symbol.iterator](): Iterator<A> {
    return RBT.keys()(this.keyTree)
  }

  toString() {
    return `SortedSet(${Array.from(this).map(String).join(", ")})`
  }

  toJSON() {
    return {
      _tag: "SortedSet",
      values: Array.from(this)
    }
  }

  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toJSON()
  }
}

/**
 * @since 1.0.0
 * @category refinements
 */
export const isSortedSet: {
  <A>(u: Iterable<A>): u is SortedSet<A>
  (u: unknown): u is SortedSet<unknown>
} = (u: unknown): u is SortedSet<unknown> =>
  typeof u === "object" && u != null && "_id" in u && u["_id"] === TypeId

/**
 * @since 1.0.0
 * @category constructors
 */
export const empty = <A>(O: Order<A>): SortedSet<A> => new SortedSetImpl(RBT.empty(O))

/**
 * @since 1.0.0
 * @category constructors
 */
export const from = <K>(ord: Order<K>) =>
  (
    iterable: Iterable<K>
  ): SortedSet<K> =>
    new SortedSetImpl(RBT.from<K, boolean>(ord)(Array.from(iterable).map((k) => [k, true])))

/**
 * @since 1.0.0
 * @category getters
 */
export const values = <A>(self: SortedSet<A>): IterableIterator<A> => RBT.keys()(self.keyTree)

/**
 * @since 1.0.0
 * @category getters
 */
export const size = <A>(self: SortedSet<A>): number => RBT.size(self.keyTree)

/**
 * @since 1.0.0
 * @category elements
 */
export const add = <A>(value: A) =>
  (self: SortedSet<A>): SortedSet<A> =>
    RBT.has(value)(self.keyTree) ? self : new SortedSetImpl(RBT.insert(value, true)(self.keyTree))

/**
 * @since 1.0.0
 * @category elements
 */
export const remove = <A>(value: A) =>
  (self: SortedSet<A>): SortedSet<A> => new SortedSetImpl(RBT.removeFirst(value)(self.keyTree))

/**
 * @since 1.0.0
 * @category elements
 */
export const toggle = <A>(value: A) =>
  (self: SortedSet<A>): SortedSet<A> => has(value)(self) ? remove(value)(self) : add(value)(self)

/**
 * @since 1.0.0
 * @category elements
 */
export const has = <A>(value: A) => (self: SortedSet<A>): boolean => RBT.has(value)(self.keyTree)

/**
 * @since 1.0.0
 * @category mutations
 */
export const difference = <A, B extends A>(that: Iterable<B>) =>
  (self: SortedSet<A>): SortedSet<A> => {
    let out = self
    for (const value of that) {
      out = remove<A | B>(value)(out)
    }
    return out
  }

/**
 * @since 1.0.0
 * @category mutations
 */
export const union = <A>(that: Iterable<A>) =>
  (self: SortedSet<A>): SortedSet<A> => {
    const ord = RBT.getOrder(self.keyTree)
    let out = empty<A>(ord)
    for (const value of self) {
      out = add(value)(out)
    }
    for (const value of that) {
      out = add(value)(out)
    }
    return out
  }

/**
 * @since 1.0.0
 * @category mutations
 */
export const intersection = <A>(that: Iterable<A>) =>
  (self: SortedSet<A>): SortedSet<A> => {
    const ord = RBT.getOrder(self.keyTree)
    let out = empty(ord)
    for (const value of that) {
      if (has(value)(self)) {
        out = add(value)(out)
      }
    }
    return out
  }

/**
 * @since 1.0.0
 * @category elements
 */
export const every = <A>(predicate: Predicate<A>) =>
  (self: SortedSet<A>): boolean => {
    for (const value of self) {
      if (!predicate(value)) {
        return false
      }
    }
    return true
  }

/**
 * @since 1.0.0
 * @category elements
 */
export const some = <A>(predicate: Predicate<A>) =>
  (self: SortedSet<A>): boolean => {
    for (const value of self) {
      if (predicate(value)) {
        return true
      }
    }
    return false
  }

/**
 * @since 1.0.0
 * @category traversing
 */
export const forEach = <A>(f: (a: A) => void) =>
  (self: SortedSet<A>): void => {
    RBT.forEach(f)(self.keyTree)
  }

/**
 * @since 1.0.0
 * @category sequencing
 */
export const flatMap = <B>(O: Order<B>) =>
  <A>(f: (a: A) => Iterable<B>) =>
    (self: SortedSet<A>): SortedSet<B> => {
      let out = empty(O)
      pipe(
        self,
        forEach((a) => {
          for (const b of f(a)) {
            out = add(b)(out)
          }
        })
      )
      return out
    }

/**
 * @since 1.0.0
 * @category mapping
 */
export const map = <B>(O: Order<B>) =>
  <A>(f: (a: A) => B) =>
    (self: SortedSet<A>): SortedSet<B> => {
      let out = empty(O)
      pipe(
        self,
        forEach((a) => {
          const b = f(a)
          if (!has(b)(out)) {
            out = add(b)(out)
          }
        })
      )
      return out
    }

/**
 * @since 1.0.0
 * @category elements
 */
export const isSubset = <A>(that: SortedSet<A>) =>
  (self: SortedSet<A>): boolean => pipe(self, every((a) => has(a)(that)))

/**
 * @since 1.0.0
 * @category filtering
 */
export const filter: {
  <A, B extends A>(refinement: Refinement<A, B>): (self: SortedSet<A>) => SortedSet<B>
  <A>(predicate: Predicate<A>): (self: SortedSet<A>) => SortedSet<A>
} = <A>(predicate: Predicate<A>) =>
  (self: SortedSet<A>): SortedSet<A> => {
    const ord = RBT.getOrder(self.keyTree)
    let out = empty<A>(ord)
    for (const value of self) {
      if (predicate(value)) {
        out = add(value)(out)
      }
    }
    return out
  }

/**
 * @since 1.0.0
 * @category filtering
 */
export const partition: {
  <A, B extends A>(
    refinement: Refinement<A, B>
  ): (self: SortedSet<A>) => readonly [SortedSet<A>, SortedSet<B>]
  <A>(predicate: Predicate<A>): (self: SortedSet<A>) => readonly [SortedSet<A>, SortedSet<A>]
} = <A>(predicate: Predicate<A>) =>
  (self: SortedSet<A>): readonly [SortedSet<A>, SortedSet<A>] => {
    const ord = RBT.getOrder(self.keyTree)
    let right = empty(ord)
    let left = empty(ord)
    for (const value of self) {
      if (predicate(value)) {
        right = add(value)(right)
      } else {
        left = add(value)(left)
      }
    }
    return [left, right]
  }
