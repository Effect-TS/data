/**
 * @since 1.0.0
 */
import * as Dual from "@effect/data/Dual"
import * as Equal from "@effect/data/Equal"
import * as Hash from "@effect/data/Hash"
import * as RBT from "@effect/data/RedBlackTree"
import { pipe } from "@fp-ts/core/Function"
import type { Predicate, Refinement } from "@fp-ts/core/Predicate"
import type { Order } from "@fp-ts/core/typeclass/Order"

const TypeId: unique symbol = Symbol.for("@effect/data/SortedSet")

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
    return pipe(Hash.hash(this.keyTree), Hash.combine(Hash.hash("@effect/data/SortedSet")))
  }

  [Equal.symbol](that: unknown): boolean {
    return isSortedSet(that) && Equal.equals(this.keyTree, that.keyTree)
  }

  [Symbol.iterator](): Iterator<A> {
    return RBT.keys(this.keyTree)
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
} = (u: unknown): u is SortedSet<unknown> => typeof u === "object" && u != null && "_id" in u && u["_id"] === TypeId

/**
 * @since 1.0.0
 * @category constructors
 */
export const empty = <A>(O: Order<A>): SortedSet<A> => new SortedSetImpl(RBT.empty(O))

/**
 * @since 1.0.0
 * @category constructors
 */
export const fromIterable = <K>(ord: Order<K>) =>
  (
    iterable: Iterable<K>
  ): SortedSet<K> => new SortedSetImpl(RBT.fromIterable<K, boolean>(ord)(Array.from(iterable).map((k) => [k, true])))

/**
 * @since 1.0.0
 * @category constructors
 */
export const make = <K>(ord: Order<K>) =>
  <Entries extends ReadonlyArray<K>>(...entries: Entries): SortedSet<Entries[number]> => fromIterable(ord)(entries)

/**
 * @since 1.0.0
 * @category elements
 */
export const add: {
  <A>(self: SortedSet<A>, value: A): SortedSet<A>
  <A>(value: A): (self: SortedSet<A>) => SortedSet<A>
} = Dual.dual<
  <A>(self: SortedSet<A>, value: A) => SortedSet<A>,
  <A>(value: A) => (self: SortedSet<A>) => SortedSet<A>
>(2, (self, value) =>
  RBT.has(self.keyTree, value)
    ? self
    : new SortedSetImpl(RBT.insert(self.keyTree, value, true)))

/**
 * @since 1.0.0
 * @category mutations
 */
export const difference: {
  <A, B extends A>(self: SortedSet<A>, that: Iterable<B>): SortedSet<A>
  <A, B extends A>(that: Iterable<B>): (self: SortedSet<A>) => SortedSet<A>
} = Dual.dual<
  <A, B extends A>(self: SortedSet<A>, that: Iterable<B>) => SortedSet<A>,
  <A, B extends A>(that: Iterable<B>) => (self: SortedSet<A>) => SortedSet<A>
>(2, <A, B extends A>(self: SortedSet<A>, that: Iterable<B>) => {
  let out = self
  for (const value of that) {
    out = remove<A | B>(out, value)
  }
  return out
})

/**
 * @since 1.0.0
 * @category elements
 */
export const every: {
  <A>(self: SortedSet<A>, predicate: Predicate<A>): boolean
  <A>(predicate: Predicate<A>): (self: SortedSet<A>) => boolean
} = Dual.dual<
  <A>(self: SortedSet<A>, predicate: Predicate<A>) => boolean,
  <A>(predicate: Predicate<A>) => (self: SortedSet<A>) => boolean
>(2, (self, predicate) => {
  for (const value of self) {
    if (!predicate(value)) {
      return false
    }
  }
  return true
})

/**
 * @since 1.0.0
 * @category filtering
 */
export const filter: {
  <A, B extends A>(self: SortedSet<A>, refinement: Refinement<A, B>): SortedSet<B>
  <A>(self: SortedSet<A>, predicate: Predicate<A>): SortedSet<A>
  <A, B extends A>(refinement: Refinement<A, B>): (self: SortedSet<A>) => SortedSet<B>
  <A>(predicate: Predicate<A>): (self: SortedSet<A>) => SortedSet<A>
} = Dual.dual<
  {
    <A, B extends A>(self: SortedSet<A>, refinement: Refinement<A, B>): SortedSet<B>
    <A>(self: SortedSet<A>, predicate: Predicate<A>): SortedSet<A>
  },
  {
    <A, B extends A>(refinement: Refinement<A, B>): (self: SortedSet<A>) => SortedSet<B>
    <A>(predicate: Predicate<A>): (self: SortedSet<A>) => SortedSet<A>
  }
>(2, <A>(self: SortedSet<A>, predicate: Predicate<A>) => {
  const ord = RBT.getOrder(self.keyTree)
  let out = empty<A>(ord)
  for (const value of self) {
    if (predicate(value)) {
      out = add(out, value)
    }
  }
  return out
})

/**
 * @since 1.0.0
 * @category sequencing
 */
export const flatMap: {
  <A, B>(self: SortedSet<A>, O: Order<B>, f: (a: A) => Iterable<B>): SortedSet<B>
  <B, A>(O: Order<B>, f: (a: A) => Iterable<B>): (self: SortedSet<A>) => SortedSet<B>
} = Dual.dual<
  <A, B>(self: SortedSet<A>, O: Order<B>, f: (a: A) => Iterable<B>) => SortedSet<B>,
  <B, A>(O: Order<B>, f: (a: A) => Iterable<B>) => (self: SortedSet<A>) => SortedSet<B>
>(3, (self, O, f) => {
  let out = empty(O)
  forEach(self, (a) => {
    for (const b of f(a)) {
      out = add(out, b)
    }
  })
  return out
})

/**
 * @since 1.0.0
 * @category traversing
 */
export const forEach: {
  <A>(self: SortedSet<A>, f: (a: A) => void): void
  <A>(f: (a: A) => void): (self: SortedSet<A>) => void
} = Dual.dual<
  <A>(self: SortedSet<A>, f: (a: A) => void) => void,
  <A>(f: (a: A) => void) => (self: SortedSet<A>) => void
>(2, (self, f) => RBT.forEach(self.keyTree, f))

/**
 * @since 1.0.0
 * @category elements
 */
export const has: {
  <A>(self: SortedSet<A>, value: A): boolean
  <A>(value: A): (self: SortedSet<A>) => boolean
} = Dual.dual<
  <A>(self: SortedSet<A>, value: A) => boolean,
  <A>(value: A) => (self: SortedSet<A>) => boolean
>(2, (self, value) => RBT.has(self.keyTree, value))

/**
 * @since 1.0.0
 * @category mutations
 */
export const intersection: {
  <A>(self: SortedSet<A>, that: Iterable<A>): SortedSet<A>
  <A>(that: Iterable<A>): (self: SortedSet<A>) => SortedSet<A>
} = Dual.dual<
  <A>(self: SortedSet<A>, that: Iterable<A>) => SortedSet<A>,
  <A>(that: Iterable<A>) => (self: SortedSet<A>) => SortedSet<A>
>(2, (self, that) => {
  const ord = RBT.getOrder(self.keyTree)
  let out = empty(ord)
  for (const value of that) {
    if (has(self, value)) {
      out = add(out, value)
    }
  }
  return out
})

/**
 * @since 1.0.0
 * @category elements
 */
export const isSubset: {
  <A>(self: SortedSet<A>, that: SortedSet<A>): boolean
  <A>(that: SortedSet<A>): (self: SortedSet<A>) => boolean
} = Dual.dual<
  <A>(self: SortedSet<A>, that: SortedSet<A>) => boolean,
  <A>(that: SortedSet<A>) => (self: SortedSet<A>) => boolean
>(2, (self, that) => every(self, (a) => has(that, a)))

/**
 * @since 1.0.0
 * @category mapping
 */
export const map: {
  <B, A>(self: SortedSet<A>, O: Order<B>, f: (a: A) => B): SortedSet<B>
  <B, A>(O: Order<B>, f: (a: A) => B): (self: SortedSet<A>) => SortedSet<B>
} = Dual.dual<
  <B, A>(self: SortedSet<A>, O: Order<B>, f: (a: A) => B) => SortedSet<B>,
  <B, A>(O: Order<B>, f: (a: A) => B) => (self: SortedSet<A>) => SortedSet<B>
>(3, (self, O, f) => {
  let out = empty(O)
  forEach(self, (a) => {
    const b = f(a)
    if (!has(out, b)) {
      out = add(out, b)
    }
  })
  return out
})

/**
 * @since 1.0.0
 * @category filtering
 */
export const partition: {
  <A, B extends A>(
    self: SortedSet<A>,
    refinement: Refinement<A, B>
  ): readonly [SortedSet<A>, SortedSet<B>]
  <A>(self: SortedSet<A>, predicate: Predicate<A>): readonly [SortedSet<A>, SortedSet<A>]
  <A, B extends A>(
    refinement: Refinement<A, B>
  ): (self: SortedSet<A>) => readonly [SortedSet<A>, SortedSet<B>]
  <A>(predicate: Predicate<A>): (self: SortedSet<A>) => readonly [SortedSet<A>, SortedSet<A>]
} = Dual.dual<
  {
    <A, B extends A>(
      self: SortedSet<A>,
      refinement: Refinement<A, B>
    ): readonly [SortedSet<A>, SortedSet<B>]
    <A>(self: SortedSet<A>, predicate: Predicate<A>): readonly [SortedSet<A>, SortedSet<A>]
  },
  {
    <A, B extends A>(
      refinement: Refinement<A, B>
    ): (self: SortedSet<A>) => readonly [SortedSet<A>, SortedSet<B>]
    <A>(predicate: Predicate<A>): (self: SortedSet<A>) => readonly [SortedSet<A>, SortedSet<A>]
  }
>(2, <A>(self: SortedSet<A>, predicate: Predicate<A>) => {
  const ord = RBT.getOrder(self.keyTree)
  let right = empty(ord)
  let left = empty(ord)
  for (const value of self) {
    if (predicate(value)) {
      right = add(right, value)
    } else {
      left = add(left, value)
    }
  }
  return [left, right] as const
})

/**
 * @since 1.0.0
 * @category elements
 */
export const remove: {
  <A>(self: SortedSet<A>, value: A): SortedSet<A>
  <A>(value: A): (self: SortedSet<A>) => SortedSet<A>
} = Dual.dual<
  <A>(self: SortedSet<A>, value: A) => SortedSet<A>,
  <A>(value: A) => (self: SortedSet<A>) => SortedSet<A>
>(2, (self, value) => new SortedSetImpl(RBT.removeFirst(self.keyTree, value)))

/**
 * @since 1.0.0
 * @category getters
 */
export const size = <A>(self: SortedSet<A>): number => RBT.size(self.keyTree)

/**
 * @since 1.0.0
 * @category elements
 */
export const some: {
  <A>(self: SortedSet<A>, predicate: Predicate<A>): boolean
  <A>(predicate: Predicate<A>): (self: SortedSet<A>) => boolean
} = Dual.dual<
  <A>(self: SortedSet<A>, predicate: Predicate<A>) => boolean,
  <A>(predicate: Predicate<A>) => (self: SortedSet<A>) => boolean
>(2, (self, predicate) => {
  for (const value of self) {
    if (predicate(value)) {
      return true
    }
  }
  return false
})

/**
 * @since 1.0.0
 * @category elements
 */
export const toggle: {
  <A>(self: SortedSet<A>, value: A): SortedSet<A>
  <A>(value: A): (self: SortedSet<A>) => SortedSet<A>
} = Dual.dual<
  <A>(self: SortedSet<A>, value: A) => SortedSet<A>,
  <A>(value: A) => (self: SortedSet<A>) => SortedSet<A>
>(2, (self, value) => has(self, value) ? remove(self, value) : add(self, value))

/**
 * @since 1.0.0
 * @category mutations
 */
export const union: {
  <A>(self: SortedSet<A>, that: Iterable<A>): SortedSet<A>
  <A>(that: Iterable<A>): (self: SortedSet<A>) => SortedSet<A>
} = Dual.dual<
  <A>(self: SortedSet<A>, that: Iterable<A>) => SortedSet<A>,
  <A>(that: Iterable<A>) => (self: SortedSet<A>) => SortedSet<A>
>(2, <A>(self: SortedSet<A>, that: Iterable<A>) => {
  const ord = RBT.getOrder(self.keyTree)
  let out = empty<A>(ord)
  for (const value of self) {
    out = add(value)(out)
  }
  for (const value of that) {
    out = add(value)(out)
  }
  return out
})

/**
 * @since 1.0.0
 * @category getters
 */
export const values = <A>(self: SortedSet<A>): IterableIterator<A> => RBT.keys(self.keyTree)
