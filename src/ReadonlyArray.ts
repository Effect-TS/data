/**
 * @since 1.0.0
 */
import type { Kind, TypeLambda } from "@fp-ts/core/HKT"
import * as applicative from "@fp-ts/core/typeclass/Applicative"
import * as chainable from "@fp-ts/core/typeclass/Chainable"
import type { Coproduct } from "@fp-ts/core/typeclass/Coproduct"
import * as covariant from "@fp-ts/core/typeclass/Covariant"
import * as filterable from "@fp-ts/core/typeclass/Filterable"
import * as flatMap_ from "@fp-ts/core/typeclass/FlatMap"
import * as foldable from "@fp-ts/core/typeclass/Foldable"
import type * as invariant from "@fp-ts/core/typeclass/Invariant"
import type * as monad from "@fp-ts/core/typeclass/Monad"
import type { Monoid } from "@fp-ts/core/typeclass/Monoid"
import * as of_ from "@fp-ts/core/typeclass/Of"
import * as order from "@fp-ts/core/typeclass/Order"
import type { Order } from "@fp-ts/core/typeclass/Order"
import type * as pointed from "@fp-ts/core/typeclass/Pointed"
import type * as product_ from "@fp-ts/core/typeclass/Product"
import * as semiApplicative from "@fp-ts/core/typeclass/SemiApplicative"
import type { Semigroup } from "@fp-ts/core/typeclass/Semigroup"
import * as semigroup from "@fp-ts/core/typeclass/Semigroup"
import { fromCombine } from "@fp-ts/core/typeclass/Semigroup"
import * as semiProduct from "@fp-ts/core/typeclass/SemiProduct"
import * as traversable from "@fp-ts/core/typeclass/Traversable"
import * as traversableFilterable from "@fp-ts/core/typeclass/TraversableFilterable"
import type { Either } from "@fp-ts/data/Either"
import { equals } from "@fp-ts/data/Equal"
import { identity, pipe } from "@fp-ts/data/Function"
import type { LazyArg } from "@fp-ts/data/Function"
import * as internal from "@fp-ts/data/internal/Common"
import * as either from "@fp-ts/data/internal/Either"
import * as option from "@fp-ts/data/internal/Option"
import * as string from "@fp-ts/data/internal/String"
import * as number from "@fp-ts/data/Number"
import type { Option } from "@fp-ts/data/Option"
import type { Predicate, Refinement } from "@fp-ts/data/Predicate"
import type * as compactable from "@fp-ts/data/typeclass/Compactable"

/**
 * @category type lambdas
 * @since 1.0.0
 */
export interface ReadonlyArrayTypeLambda extends TypeLambda {
  readonly type: ReadonlyArray<this["Target"]>
}

/**
 * @category models
 * @since 1.0.0
 */
export type NonEmptyReadonlyArray<A> = readonly [A, ...Array<A>]

/**
 * Builds a `NonEmptyReadonlyArray` from an non-empty collection of elements.
 *
 * @category constructors
 * @since 1.0.0
 */
export const make = <As extends NonEmptyReadonlyArray<any>>(
  ...as: As
): NonEmptyReadonlyArray<As[number]> => as

/**
 * Return a `ReadonlyArray` of length `n` with element `i` initialized with `f(i)`.
 *
 * **Note**. `n` is normalized to an integer >= 1.
 *
 * @category constructors
 * @since 1.0.0
 */
export const makeBy = <A>(f: (i: number) => A) =>
  (n: number): NonEmptyReadonlyArray<A> => {
    const max = Math.max(1, Math.floor(n))
    const out: internal.NonEmptyArray<A> = [f(0)]
    for (let i = 1; i < max; i++) {
      out.push(f(i))
    }
    return out
  }

/**
 * Create a non empty `ReadonlyArray` containing a range of integers, including both endpoints.
 *
 * @category constructors
 * @since 1.0.0
 */
export const range = (start: number, end: number): NonEmptyReadonlyArray<number> =>
  start <= end ? makeBy((i) => start + i)(end - start + 1) : [start]

/**
 * Create a `ReadonlyArray` containing a value repeated the specified number of times.
 *
 * **Note**. `n` is normalized to an integer >= 1.
 *
 * @category constructors
 * @since 1.0.0
 */
export const replicate = <A>(a: A): ((n: number) => NonEmptyReadonlyArray<A>) => makeBy(() => a)

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromIterable: <A>(collection: Iterable<A>) => ReadonlyArray<A> = internal.fromIterable

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromOption = <A>(
  o: Option<A>
): ReadonlyArray<A> => (option.isNone(o) ? empty : [o.value])

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromEither = <A>(
  e: Either<unknown, A>
): ReadonlyArray<A> => (either.isLeft(e) ? empty : [e.right])

/**
 * @category pattern matching
 * @since 1.0.0
 */
export const match = <B, A, C = B>(
  onEmpty: LazyArg<B>,
  onNonEmpty: (head: A, tail: ReadonlyArray<A>) => C
) =>
  (self: ReadonlyArray<A>): B | C =>
    isNonEmpty(self) ? onNonEmpty(headNonEmpty(self), tailNonEmpty(self)) : onEmpty()

/**
 * @category pattern matching
 * @since 1.0.0
 */
export const matchRight = <B, A, C = B>(
  onEmpty: LazyArg<B>,
  onNonEmpty: (init: ReadonlyArray<A>, last: A) => C
) =>
  (self: ReadonlyArray<A>): B | C =>
    isNonEmpty(self) ?
      onNonEmpty(initNonEmpty(self), lastNonEmpty(self)) :
      onEmpty()

/**
 * Prepend an element to the front of a `ReadonlyArray`, creating a new non empty `ReadonlyArray`.
 *
 * @category mutations
 * @since 1.0.0
 */
export const prepend = <B>(
  head: B
) => <A>(self: ReadonlyArray<A>): NonEmptyReadonlyArray<A | B> => [head, ...self]

/**
 * @category mutations
 * @since 1.0.0
 */
export const prependAll = <B>(prefix: ReadonlyArray<B>) =>
  <A>(self: ReadonlyArray<A>): ReadonlyArray<A | B> => (prefix as ReadonlyArray<A | B>).concat(self)

/**
 * @category mutations
 * @since 1.0.0
 */
export function prependAllNonEmpty<B>(
  that: NonEmptyReadonlyArray<B>
): <A>(self: ReadonlyArray<A>) => NonEmptyReadonlyArray<A | B>
export function prependAllNonEmpty<B>(
  that: ReadonlyArray<B>
): <A>(self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<A | B>
export function prependAllNonEmpty<B>(
  that: ReadonlyArray<B>
): <A>(self: NonEmptyReadonlyArray<A>) => ReadonlyArray<A | B> {
  return <A>(self: NonEmptyReadonlyArray<A | B>) => (that as ReadonlyArray<A | B>).concat(self)
}

/**
 * Append an element to the end of a `ReadonlyArray`, creating a new non empty `ReadonlyArray`.
 *
 * @category mutations
 * @since 1.0.0
 */
export const append = <B>(
  last: B
) => <A>(self: ReadonlyArray<A>): NonEmptyReadonlyArray<A | B> => [...self, last] as any

/**
 * @category mutations
 * @since 1.0.0
 */
export const appendAll = <B>(that: ReadonlyArray<B>) =>
  <A>(self: ReadonlyArray<A>): ReadonlyArray<A | B> => (self as ReadonlyArray<A | B>).concat(that)

/**
 * @category mutations
 * @since 1.0.0
 */
export function appendAllNonEmpty<B>(
  that: NonEmptyReadonlyArray<B>
): <A>(self: ReadonlyArray<A>) => NonEmptyReadonlyArray<A | B>
export function appendAllNonEmpty<B>(
  that: ReadonlyArray<B>
): <A>(self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<A | B>
export function appendAllNonEmpty<B>(
  that: ReadonlyArray<B>
): <A>(self: NonEmptyReadonlyArray<A>) => ReadonlyArray<A | B> {
  return <A>(self: NonEmptyReadonlyArray<A | B>) => self.concat(that)
}

/**
 * Fold a `ReadonlyArray` from the left, keeping all intermediate results instead of only the final result.
 *
 * @category folding
 * @since 1.0.0
 */
export const scan = <B, A>(b: B, f: (b: B, a: A) => B) =>
  (self: ReadonlyArray<A>): NonEmptyReadonlyArray<B> => {
    const len = self.length
    const out = new Array(len + 1) as [B, ...Array<B>]
    out[0] = b
    for (let i = 0; i < len; i++) {
      out[i + 1] = f(out[i], self[i])
    }
    return out
  }

/**
 * Fold a `ReadonlyArray` from the right, keeping all intermediate results instead of only the final result.
 *
 * @category folding
 * @since 1.0.0
 */
export const scanRight = <B, A>(b: B, f: (b: B, a: A) => B) =>
  (self: ReadonlyArray<A>): NonEmptyReadonlyArray<B> => {
    const len = self.length
    const out = new Array(len + 1) as [B, ...Array<B>]
    out[len] = b
    for (let i = len - 1; i >= 0; i--) {
      out[i] = f(out[i + 1], self[i])
    }
    return out
  }

/**
 * Test whether a `ReadonlyArray` is empty.
 *
 * @category predicates
 * @since 1.0.0
 */
export const isEmpty = <A>(self: ReadonlyArray<A>): self is readonly [] => self.length === 0

/**
 * Test whether a `ReadonlyArray` is non empty narrowing down the type to `NonEmptyReadonlyArray<A>`
 *
 * @category predicates
 * @since 1.0.0
 */
export const isNonEmpty: <A>(self: ReadonlyArray<A>) => self is NonEmptyReadonlyArray<A> =
  internal.isNonEmpty

/**
 * Calculate the number of elements in a `ReadonlyArray`.
 *
 * @category getters
 * @since 1.0.0
 */
export const size = <A>(self: ReadonlyArray<A>): number => self.length

const isOutOfBound = <A>(i: number, as: ReadonlyArray<A>): boolean => i < 0 || i >= as.length

/**
 * This function provides a safe way to read a value at a particular index from a `ReadonlyArray`
 *
 * @category getters
 * @since 1.0.0
 */
export const get = (i: number) =>
  <A>(self: ReadonlyArray<A>): Option<A> =>
    isOutOfBound(i, self) ? option.none : option.some(self[i])

/**
 * Produces a couple of the first element of the array, and a new array of the remaining elements, if any.
 *
 * @category getters
 * @since 1.0.0
 */
export const unprepend = <A>(
  self: NonEmptyReadonlyArray<A>
): readonly [A, ReadonlyArray<A>] => [headNonEmpty(self), tailNonEmpty(self)]

/**
 * Produces a couple of a copy of the array without its last element, and that last element.
 *
 * @category getters
 * @since 1.0.0
 */
export const unappend = <A>(
  self: NonEmptyReadonlyArray<A>
): readonly [ReadonlyArray<A>, A] => [initNonEmpty(self), lastNonEmpty(self)]

/**
 * Get the first element of a `ReadonlyArray`, or `None` if the `ReadonlyArray` is empty.
 *
 * @category getters
 * @since 1.0.0
 */
export const head: <A>(self: ReadonlyArray<A>) => Option<A> = get(0)

/**
 * Gets an element unsafely, will throw on out of bounds.
 *
 * @since 1.0.0
 * @category unsafe
 */
export const unsafeGet = (index: number) =>
  <A>(self: ReadonlyArray<A>): A => {
    if (isOutOfBound(index, self)) {
      throw new Error(`Index out of bounds`)
    }
    return self[index]
  }

/**
 * @category getters
 * @since 1.0.0
 */
export const headNonEmpty: <A>(self: NonEmptyReadonlyArray<A>) => A = unsafeGet(0)

/**
 * Get the last element in a `ReadonlyArray`, or `None` if the `ReadonlyArray` is empty.
 *
 * @category getters
 * @since 1.0.0
 */
export const last = <A>(self: ReadonlyArray<A>): Option<A> =>
  isNonEmpty(self) ? option.some(lastNonEmpty(self)) : option.none

/**
 * @category getters
 * @since 1.0.0
 */
export const lastNonEmpty = <A>(as: NonEmptyReadonlyArray<A>): A => as[as.length - 1]

/**
 * Get all but the first element of a `ReadonlyArray`, creating a new `ReadonlyArray`, or `None` if the `ReadonlyArray` is empty.
 *
 * @category getters
 * @since 1.0.0
 */
export const tail = <A>(self: ReadonlyArray<A>): Option<ReadonlyArray<A>> =>
  isNonEmpty(self) ? option.some(tailNonEmpty(self)) : option.none

/**
 * @category getters
 * @since 1.0.0
 */
export const tailNonEmpty = <A>(self: NonEmptyReadonlyArray<A>): ReadonlyArray<A> => self.slice(1)

/**
 * Get all but the last element of a `ReadonlyArray`, creating a new `ReadonlyArray`, or `None` if the `ReadonlyArray` is empty.
 *
 * @category getters
 * @since 1.0.0
 */
export const init = <A>(self: ReadonlyArray<A>): Option<ReadonlyArray<A>> =>
  isNonEmpty(self) ? option.some(initNonEmpty(self)) : option.none

/**
 * Get all but the last element of a non empty array, creating a new array.
 *
 * @category getters
 * @since 1.0.0
 */
export const initNonEmpty = <A>(self: NonEmptyReadonlyArray<A>): ReadonlyArray<A> =>
  self.slice(0, -1)

/**
 * Keep only a max number of elements from the start of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @category getters
 * @since 1.0.0
 */
export const take = (n: number) =>
  <A>(self: ReadonlyArray<A>): ReadonlyArray<A> =>
    n <= 0 ? empty : n >= self.length ? self : self.slice(0, n)

/**
 * Keep only a max number of elements from the end of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @category getters
 * @since 1.0.0
 */
export const takeRight = (n: number) =>
  <A>(as: ReadonlyArray<A>): ReadonlyArray<A> =>
    isOutOfBound(n, as) ? as : n === 0 ? empty : as.slice(-n)

/**
 * Calculate the longest initial subarray for which all element satisfy the specified predicate, creating a new `ReadonlyArray`.
 *
 * @category getters
 * @since 1.0.0
 */
export function takeWhile<A, B extends A>(
  refinement: Refinement<A, B>
): (self: ReadonlyArray<A>) => ReadonlyArray<B>
export function takeWhile<A>(
  predicate: Predicate<A>
): <B extends A>(self: ReadonlyArray<B>) => ReadonlyArray<B>
export function takeWhile<A>(
  predicate: Predicate<A>
): (self: ReadonlyArray<A>) => ReadonlyArray<A> {
  return (self: ReadonlyArray<A>) => {
    const out: Array<A> = []
    for (const a of self) {
      if (!predicate(a)) {
        break
      }
      out.push(a)
    }
    return out
  }
}

const spanIndex = <A>(as: ReadonlyArray<A>, predicate: Predicate<A>): number => {
  const l = as.length
  let i = 0
  for (; i < l; i++) {
    if (!predicate(as[i])) {
      break
    }
  }
  return i
}

/**
 * Split a `ReadonlyArray` into two parts:
 * 1. the longest initial subarray for which all elements satisfy the specified predicate
 * 2. the remaining elements
 *
 * @category filtering
 * @since 1.0.0
 */
export function span<A, B extends A>(
  refinement: Refinement<A, B>
): (as: ReadonlyArray<A>) => readonly [init: ReadonlyArray<B>, rest: ReadonlyArray<A>]
export function span<A>(
  predicate: Predicate<A>
): <B extends A>(bs: ReadonlyArray<B>) => readonly [init: ReadonlyArray<B>, rest: ReadonlyArray<B>]
export function span<A>(
  predicate: Predicate<A>
): (as: ReadonlyArray<A>) => readonly [init: ReadonlyArray<A>, rest: ReadonlyArray<A>]
export function span<A>(
  predicate: Predicate<A>
): (as: ReadonlyArray<A>) => readonly [init: ReadonlyArray<A>, rest: ReadonlyArray<A>] {
  return (as) => splitAt(spanIndex(as, predicate))(as)
}

/**
 * Drop a max number of elements from the start of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @category getters
 * @since 1.0.0
 */
export const drop = (n: number) =>
  <A>(as: ReadonlyArray<A>): ReadonlyArray<A> =>
    n <= 0 || isEmpty(as) ? as : n >= as.length ? empty : as.slice(n, as.length)

/**
 * Drop a max number of elements from the end of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @category getters
 * @since 1.0.0
 */
export const dropRight = (n: number) =>
  <A>(as: ReadonlyArray<A>): ReadonlyArray<A> =>
    n <= 0 || isEmpty(as) ? as : n >= as.length ? empty : as.slice(0, as.length - n)

/**
 * Remove the longest initial subarray for which all element satisfy the specified predicate, creating a new `ReadonlyArray`.
 *
 * @category getters
 * @since 1.0.0
 */
export function dropWhile<A, B extends A>(
  refinement: Refinement<A, B>
): (as: ReadonlyArray<A>) => ReadonlyArray<B>
export function dropWhile<A>(
  predicate: Predicate<A>
): <B extends A>(bs: ReadonlyArray<B>) => ReadonlyArray<B>
export function dropWhile<A>(
  predicate: Predicate<A>
): (as: ReadonlyArray<A>) => ReadonlyArray<A>
export function dropWhile<A>(
  predicate: Predicate<A>
): (as: ReadonlyArray<A>) => ReadonlyArray<A> {
  return (as) => {
    const i = spanIndex(as, predicate)
    return i === 0 ? as : i === as.length ? empty : as.slice(i)
  }
}

/**
 * Find the first index for which a predicate holds
 *
 * @category getters
 * @since 1.0.0
 */
export const findFirstIndex = <A>(predicate: Predicate<A>) =>
  (as: ReadonlyArray<A>): Option<number> => {
    const len = as.length
    for (let i = 0; i < len; i++) {
      if (predicate(as[i])) {
        return option.some(i)
      }
    }
    return option.none
  }

/**
 * Returns the index of the last element of the list which matches the predicate
 *
 * @category getters
 * @since 1.0.0
 */
export const findLastIndex = <A>(predicate: Predicate<A>) =>
  (as: ReadonlyArray<A>): Option<number> => {
    const len = as.length
    for (let i = len - 1; i >= 0; i--) {
      if (predicate(as[i])) {
        return option.some(i)
      }
    }
    return option.none
  }

/**
 * Find the first element which satisfies a predicate function.
 *
 * @category getters
 * @since 1.0.0
 */
export function findFirst<A, B extends A>(
  refinement: Refinement<A, B>
): (as: ReadonlyArray<A>) => Option<B>
export function findFirst<A>(
  predicate: Predicate<A>
): <B extends A>(bs: ReadonlyArray<B>) => Option<B>
export function findFirst<A>(predicate: Predicate<A>): (as: ReadonlyArray<A>) => Option<A>
export function findFirst<A>(predicate: Predicate<A>): (as: ReadonlyArray<A>) => Option<A> {
  return (as) => {
    const len = as.length
    for (let i = 0; i < len; i++) {
      if (predicate(as[i])) {
        return option.some(as[i])
      }
    }
    return option.none
  }
}

/**
 * Find the last element which satisfies a predicate function.
 *
 * @category getters
 * @since 1.0.0
 */
export function findLast<A, B extends A>(
  refinement: Refinement<A, B>
): (as: ReadonlyArray<A>) => Option<B>
export function findLast<A>(
  predicate: Predicate<A>
): <B extends A>(bs: ReadonlyArray<B>) => Option<B>
export function findLast<A>(predicate: Predicate<A>): (as: ReadonlyArray<A>) => Option<A>
export function findLast<A>(predicate: Predicate<A>): (as: ReadonlyArray<A>) => Option<A> {
  return (as) => {
    const len = as.length
    for (let i = len - 1; i >= 0; i--) {
      if (predicate(as[i])) {
        return option.some(as[i])
      }
    }
    return option.none
  }
}

/**
 * Insert an element at the specified index, creating a new `ReadonlyArray`, or returning `None` if the index is out of bounds.
 *
 * @category mutations
 * @since 1.0.0
 */
export const insertAt = <B>(i: number, a: B) =>
  <A>(self: ReadonlyArray<A>): Option<NonEmptyReadonlyArray<A | B>> => {
    if (i < 0 || i > self.length) {
      return option.none
    }
    if (isNonEmpty(self)) {
      const out: internal.NonEmptyArray<A | B> = internal.fromNonEmptyReadonlyArray(self)
      out.splice(i, 0, a)
      return option.some(out)
    }
    return option.some([a])
  }

/**
 * Change the element at the specified index, creating a new `ReadonlyArray`, or returning `None` if the index is out of bounds.
 *
 * @category mutations
 * @since 1.0.0
 */
export const updateAt = <B>(
  i: number,
  b: B
): (<A>(self: ReadonlyArray<A>) => Option<ReadonlyArray<A | B>>) => modifyAt(i, () => b)

/**
 * Apply a function to the element at the specified index, creating a new `ReadonlyArray`, or returning `None` if the index is out
 * of bounds.
 *
 * @category mutations
 * @since 1.0.0
 */
export const modifyAt = <A, B>(i: number, f: (a: A) => B) =>
  (self: ReadonlyArray<A>): Option<ReadonlyArray<A | B>> => {
    if (isOutOfBound(i, self)) {
      return option.none
    }
    const prev = self[i]
    const next = f(prev)
    const out: Array<A | B> = self.slice()
    out[i] = next
    return option.some(out)
  }

const unsafeDeleteAt = <A>(i: number, as: ReadonlyArray<A>): ReadonlyArray<A> => {
  const xs = as.slice()
  xs.splice(i, 1)
  return xs
}

/**
 * Delete the element at the specified index, creating a new `ReadonlyArray`, or returning `None` if the index is out of bounds.
 *
 * @category mutations
 * @since 1.0.0
 */
export const deleteAt = (i: number) =>
  <A>(self: ReadonlyArray<A>): Option<ReadonlyArray<A>> =>
    isOutOfBound(i, self) ? option.none : option.some(unsafeDeleteAt(i, self))

/**
 * Reverse a `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * @category mutations
 * @since 1.0.0
 */
export const reverse = <A>(
  self: ReadonlyArray<A>
): ReadonlyArray<A> => (self.length <= 1 ? self : self.slice().reverse())

/**
 * @since 1.0.0
 */
export const reverseNonEmpty = <A>(self: NonEmptyReadonlyArray<A>): NonEmptyReadonlyArray<A> =>
  self.length === 1 ? self : [lastNonEmpty(self), ...self.slice(0, -1).reverse()]

/**
 * Extracts from a `ReadonlyArray` of `Either`s all the `Right` elements.
 *
 * @category getters
 * @since 1.0.0
 */
export const rights = <A>(self: ReadonlyArray<Either<unknown, A>>): ReadonlyArray<A> => {
  const out: Array<A> = []
  for (let i = 0; i < self.length; i++) {
    const a = self[i]
    if (either.isRight(a)) {
      out.push(a.right)
    }
  }
  return out
}

/**
 * Extracts from a `ReadonlyArray` of `Either` all the `Left` elements.
 *
 * @category getters
 * @since 1.0.0
 */
export const lefts = <E>(self: ReadonlyArray<Either<E, unknown>>): ReadonlyArray<E> => {
  const out: Array<E> = []
  for (let i = 0; i < self.length; i++) {
    const a = self[i]
    if (either.isLeft(a)) {
      out.push(a.left)
    }
  }
  return out
}

/**
 * Sort the elements of a `ReadonlyArray` in increasing order, creating a new `ReadonlyArray`.
 *
 * @category sorting
 * @since 1.0.0
 */
export const sort = <B>(O: Order<B>) =>
  <A extends B>(self: ReadonlyArray<A>): ReadonlyArray<A> =>
    self.length <= 1 ? self : self.slice().sort((self, that) => O.compare(that)(self))

/**
 * Sort the elements of a `NonEmptyReadonlyArray` in increasing order, creating a new `NonEmptyReadonlyArray`.
 *
 * @category sorting
 * @since 1.0.0
 */
export const sortNonEmpty = <B>(O: Order<B>) =>
  <A extends B>(self: NonEmptyReadonlyArray<A>): NonEmptyReadonlyArray<A> =>
    self.length === 1 ? self : (self.slice().sort((self, that) => O.compare(that)(self)) as any)

/**
 * Sort the elements of a `ReadonlyArray` in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
 * etc...
 *
 * @category sorting
 * @since 1.0.0
 */
export const sortBy = <B>(
  orders: ReadonlyArray<Order<B>>
) =>
  <A extends B>(
    self: ReadonlyArray<A>
  ): ReadonlyArray<A> => (isNonEmpty(self) ? sortByNonEmpty(orders)(self) : self)

/**
 * @category sorting
 * @since 1.0.0
 */
export const sortByNonEmpty = <B>(
  orders: ReadonlyArray<Order<B>>
): (<A extends B>(as: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<A>) =>
  sortNonEmpty(order.getMonoid<B>().combineAll(orders))

/**
 * Takes two `ReadonlyArray`s and returns a `ReadonlyArray` of corresponding pairs. If one input `ReadonlyArray` is short, excess elements of the
 * longer `ReadonlyArray` are discarded.
 *
 * @category mutations
 * @since 1.0.0
 */
export const zip = <B>(
  that: ReadonlyArray<B>
): <A>(self: ReadonlyArray<A>) => ReadonlyArray<readonly [A, B]> => zipWith(that, (a, b) => [a, b])

/**
 * Apply a function to pairs of elements at the same index in two `ReadonlyArray`s, collecting the results in a new `ReadonlyArray`. If one
 * input `ReadonlyArray` is short, excess elements of the longer `ReadonlyArray` are discarded.
 *
 * @category mutations
 * @since 1.0.0
 */
export const zipWith = <B, A, C>(that: ReadonlyArray<B>, f: (a: A, b: B) => C) =>
  (self: ReadonlyArray<A>): ReadonlyArray<C> =>
    isNonEmpty(self) && isNonEmpty(that) ? zipNonEmptyWith(that, f)(self) : internal.empty

/**
 * @category mutations
 * @since 1.0.0
 */
export const zipNonEmpty = <B>(that: NonEmptyReadonlyArray<B>) =>
  <A>(self: NonEmptyReadonlyArray<A>): NonEmptyReadonlyArray<readonly [A, B]> =>
    pipe(
      self,
      zipNonEmptyWith(that, (a, b) => [a, b])
    )

/**
 * @category mutations
 * @since 1.0.0
 */
export const zipNonEmptyWith = <B, A, C>(that: NonEmptyReadonlyArray<B>, f: (a: A, b: B) => C) =>
  (self: NonEmptyReadonlyArray<A>): NonEmptyReadonlyArray<C> => {
    const cs: internal.NonEmptyArray<C> = [f(headNonEmpty(self), headNonEmpty(that))]
    const len = Math.min(self.length, that.length)
    for (let i = 1; i < len; i++) {
      cs[i] = f(self[i], that[i])
    }
    return cs
  }

/**
 * This function is the inverse of `zip`. Takes a `ReadonlyArray` of pairs and return two corresponding `ReadonlyArray`s.
 *
 * @category mutations
 * @since 1.0.0
 */
export const unzip = <A, B>(
  self: ReadonlyArray<readonly [A, B]>
): readonly [ReadonlyArray<A>, ReadonlyArray<B>] =>
  isNonEmpty(self) ? unzipNonEmpty(self) : [[], []]

/**
 * @category mutations
 * @since 1.0.0
 */
export const unzipNonEmpty = <A, B>(
  self: NonEmptyReadonlyArray<readonly [A, B]>
): readonly [NonEmptyReadonlyArray<A>, NonEmptyReadonlyArray<B>] => {
  const fa: internal.NonEmptyArray<A> = [self[0][0]]
  const fb: internal.NonEmptyArray<B> = [self[0][1]]
  for (let i = 1; i < self.length; i++) {
    fa[i] = self[i][0]
    fb[i] = self[i][1]
  }
  return [fa, fb]
}

/**
 * Places an element in between members of a `ReadonlyArray`
 *
 * @category mutations
 * @since 1.0.0
 */
export const intersperse = <B>(middle: B) =>
  <A>(
    self: ReadonlyArray<A>
  ): ReadonlyArray<A | B> => (isNonEmpty(self) ? intersperseNonEmpty(middle)(self) : self)

/**
 * Places an element in between members of a `NonEmptyReadonlyArray`
 *
 * @category mutations
 * @since 1.0.0
 */
export const intersperseNonEmpty = <B>(middle: B) =>
  <A>(self: NonEmptyReadonlyArray<A>): NonEmptyReadonlyArray<A | B> => {
    const out: internal.NonEmptyArray<A | B> = [headNonEmpty(self)]
    const tail = tailNonEmpty(self)
    for (let i = 0; i < tail.length; i++) {
      if (i < tail.length) {
        out.push(middle)
      }
      out.push(tail[i])
    }
    return out
  }

/**
 * Apply a function to the head, creating a new `NonEmptyReadonlyArray`.
 *
 * @category mutations
 * @since 1.0.0
 */
export const modifyNonEmptyHead = <A, B>(f: (a: A) => B) =>
  (
    self: NonEmptyReadonlyArray<A>
  ): NonEmptyReadonlyArray<A | B> => [f(headNonEmpty(self)), ...tailNonEmpty(self)]

/**
 * Change the head, creating a new `NonEmptyReadonlyArray`.
 *
 * @category mutations
 * @since 1.0.0
 */
export const updateNonEmptyHead = <B>(
  b: B
): (<A>(self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<A | B>) =>
  modifyNonEmptyHead(() => b)

/**
 * Apply a function to the last element, creating a new `NonEmptyReadonlyArray`.
 *
 * @category mutations
 * @since 1.0.0
 */
export const modifyNonEmptyLast = <A, B>(f: (a: A) => B) =>
  (self: NonEmptyReadonlyArray<A>): NonEmptyReadonlyArray<A | B> =>
    pipe(initNonEmpty(self), append(f(lastNonEmpty(self))))

/**
 * Change the last element, creating a new `NonEmptyReadonlyArray`.
 *
 * @category mutations
 * @since 1.0.0
 */
export const updateNonEmptyLast = <B>(
  b: B
): (<A>(self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<A | B>) =>
  modifyNonEmptyLast(() => b)

/**
 * Rotate a `ReadonlyArray` by `n` steps.
 *
 * @category mutations
 * @since 1.0.0
 */
export const rotate = (n: number) =>
  <A>(
    self: ReadonlyArray<A>
  ): ReadonlyArray<A> => (isNonEmpty(self) ? rotateNonEmpty(n)(self) : self)

/**
 * Rotate a `NonEmptyReadonlyArray` by `n` steps.
 *
 * @category mutations
 * @since 1.0.0
 */
export const rotateNonEmpty = (n: number) =>
  <A>(self: NonEmptyReadonlyArray<A>): NonEmptyReadonlyArray<A> => {
    const len = self.length
    const m = Math.round(n) % len
    if (isOutOfBound(Math.abs(m), self) || m === 0) {
      return self
    }
    if (m < 0) {
      const [f, s] = splitNonEmptyAt(-m)(self)
      return appendAllNonEmpty(f)(s)
    } else {
      return rotateNonEmpty(m - len)(self)
    }
  }

/**
 * Tests whether a value is a member of a `ReadonlyArray`.
 *
 * @category predicates
 * @since 1.0.0
 */
export const elem = <B>(b: B) =>
  <A>(self: ReadonlyArray<A>): boolean => {
    let i = 0
    const len = self.length
    for (; i < len; i++) {
      if (equals(b, self[i])) {
        return true
      }
    }
    return false
  }

/**
 * Remove duplicates from a `ReadonlyArray`, keeping the first occurrence of an element.
 *
 * @category mutations
 * @since 1.0.0
 */
export const uniq = <A>(
  self: ReadonlyArray<A>
) => (isNonEmpty(self) ? uniqNonEmpty(self) : self)

/**
 * Remove duplicates from a `NonEmptyReadonlyArray`, keeping the first occurrence of an element.
 *
 * @category mutations
 * @since 1.0.0
 */
export const uniqNonEmpty = <A>(self: NonEmptyReadonlyArray<A>): NonEmptyReadonlyArray<A> => {
  if (self.length === 1) {
    return self
  }
  const out: internal.NonEmptyArray<A> = [headNonEmpty(self)]
  const rest = tailNonEmpty(self)
  for (const a of rest) {
    if (out.every((o) => !equals(o)(a))) {
      out.push(a)
    }
  }
  return out
}

/**
 * A useful recursion pattern for processing a `ReadonlyArray` to produce a new `ReadonlyArray`, often used for "chopping" up the input
 * `ReadonlyArray`. Typically chop is called with some function that will consume an initial prefix of the `ReadonlyArray` and produce a
 * value and the rest of the `ReadonlyArray`.
 *
 * @since 1.0.0
 */
export const chop = <A, B>(
  f: (as: NonEmptyReadonlyArray<A>) => readonly [B, ReadonlyArray<A>]
) =>
  (self: ReadonlyArray<A>): ReadonlyArray<B> => (isNonEmpty(self) ? chopNonEmpty(f)(self) : empty)

/**
 * A useful recursion pattern for processing a `NonEmptyReadonlyArray` to produce a new `NonEmptyReadonlyArray`, often used for "chopping" up the input
 * `NonEmptyReadonlyArray`. Typically `chop` is called with some function that will consume an initial prefix of the `NonEmptyReadonlyArray` and produce a
 * value and the tail of the `NonEmptyReadonlyArray`.
 *
 * @since 1.0.0
 */
export const chopNonEmpty = <A, B>(
  f: (as: NonEmptyReadonlyArray<A>) => readonly [B, ReadonlyArray<A>]
) =>
  (self: NonEmptyReadonlyArray<A>): NonEmptyReadonlyArray<B> => {
    const [b, rest] = f(self)
    const out: internal.NonEmptyArray<B> = [b]
    let next: ReadonlyArray<A> = rest
    while (internal.isNonEmpty(next)) {
      const [b, rest] = f(next)
      out.push(b)
      next = rest
    }
    return out
  }

/**
 * Splits a `ReadonlyArray` into two pieces, the first piece has max `n` elements.
 *
 * @category getters
 * @since 1.0.0
 */
export const splitAt = (n: number) =>
  <A>(self: ReadonlyArray<A>): readonly [ReadonlyArray<A>, ReadonlyArray<A>] =>
    n >= 1 && isNonEmpty(self) ?
      splitNonEmptyAt(n)(self) :
      isEmpty(self) ?
      [self, empty] :
      [empty, self]

/**
 * Splits a `NonEmptyReadonlyArray` into two pieces, the first piece has max `n` elements.
 *
 * @category getters
 * @since 1.0.0
 */
export const splitNonEmptyAt = (n: number) =>
  <A>(self: NonEmptyReadonlyArray<A>): readonly [NonEmptyReadonlyArray<A>, ReadonlyArray<A>] => {
    const m = Math.max(1, n)
    return m >= self.length ?
      [self, internal.empty] :
      [pipe(self.slice(1, m), prepend(headNonEmpty(self))), self.slice(m)]
  }

/**
 * Splits a `ReadonlyArray` into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the `ReadonlyArray`. Note that `chunksOf(n)([])` is `[]`, not `[[]]`. This is intentional, and is consistent with a recursive
 * definition of `chunksOf`; it satisfies the property that
 *
 * ```ts
 * chunksOf(n)(xs).concat(chunksOf(n)(ys)) == chunksOf(n)(xs.concat(ys)))
 * ```
 *
 * whenever `n` evenly divides the length of `as`.
 *
 * @category getters
 * @since 1.0.0
 */
export const chunksOf = (n: number) =>
  <A>(
    self: ReadonlyArray<A>
  ): ReadonlyArray<
    NonEmptyReadonlyArray<A>
  > => (isNonEmpty(self) ? chunksOfNonEmpty(n)(self) : empty)

/**
 * Splits a `NonEmptyReadonlyArray` into length-`n` pieces. The last piece will be shorter if `n` does not evenly divide the length of
 * the `NonEmptyReadonlyArray`.
 *
 * @category getters
 * @since 1.0.0
 */
export const chunksOfNonEmpty = (
  n: number
): (<A>(self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<NonEmptyReadonlyArray<A>>) =>
  chopNonEmpty(splitNonEmptyAt(n))

/**
 * Group equal, consecutive elements of a `NonEmptyReadonlyArray` into `NonEmptyReadonlyArray`s.
 *
 * @category grouping
 * @since 1.0.0
 */
export const group = <A>(
  self: NonEmptyReadonlyArray<A>
): NonEmptyReadonlyArray<NonEmptyReadonlyArray<A>> =>
  pipe(
    self,
    chopNonEmpty((as) => {
      const h = headNonEmpty(as)
      const out: internal.NonEmptyArray<A> = [h]
      let i = 1
      for (; i < as.length; i++) {
        const a = as[i]
        if (equals(a, h)) {
          out.push(a)
        } else {
          break
        }
      }
      return [out, as.slice(i)]
    })
  )

/**
 * Splits an array into sub-non-empty-arrays stored in an object, based on the result of calling a `string`-returning
 * function on each element, and grouping the results according to values returned
 *
 * @category grouping
 * @since 1.0.0
 */
export const groupBy = <A>(f: (a: A) => string) =>
  (self: ReadonlyArray<A>): Readonly<Record<string, NonEmptyReadonlyArray<A>>> => {
    const out: Record<string, internal.NonEmptyArray<A>> = {}
    for (const a of self) {
      const k = f(a)
      if (internal.has.call(out, k)) {
        out[k].push(a)
      } else {
        out[k] = [a]
      }
    }
    return out
  }

/**
 * @category mutations
 * @since 1.0.0
 */
export const union = <B>(that: ReadonlyArray<B>) =>
  <A>(self: ReadonlyArray<A>): ReadonlyArray<A | B> =>
    isNonEmpty(self) && isNonEmpty(that) ?
      unionNonEmpty(that)(self) :
      isNonEmpty(self) ?
      self :
      that

/**
 * @category mutations
 * @since 1.0.0
 */
export function unionNonEmpty<B>(
  that: NonEmptyReadonlyArray<B>
): <A>(self: ReadonlyArray<A>) => NonEmptyReadonlyArray<A | B>
export function unionNonEmpty<B>(
  that: ReadonlyArray<B>
): <A>(self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<A | B>
export function unionNonEmpty<B>(
  that: ReadonlyArray<B>
): <A>(self: NonEmptyReadonlyArray<A>) => ReadonlyArray<A | B> {
  return <A>(self: NonEmptyReadonlyArray<A | B>) => uniqNonEmpty(appendAllNonEmpty(that)(self))
}

/**
 * Creates a `ReadonlyArray` of unique values that are included in all given `ReadonlyArray`s using a `Eq` for equality
 * comparisons. The order and references of result values are determined by the first `ReadonlyArray`.
 *
 * @category mutations
 * @since 1.0.0
 */
export const intersection = <A>(that: ReadonlyArray<A>) =>
  <B>(self: ReadonlyArray<B>): ReadonlyArray<A & B> => self.filter((a): a is A & B => elem(a)(that))

/**
 * Creates a `ReadonlyArray` of values not included in the other given `ReadonlyArray` using a `Eq` for equality
 * comparisons. The order and references of result values are determined by the first `ReadonlyArray`.
 *
 * @category mutations
 * @since 1.0.0
 */
export const difference = <B>(that: ReadonlyArray<B>) =>
  <A>(self: ReadonlyArray<A>): ReadonlyArray<A> => {
    return self.filter((a) => !elem(a)(that))
  }

/**
 * @category constructors
 * @since 1.0.0
 */
export const of = <A>(a: A): NonEmptyReadonlyArray<A> => [a]

/**
 * @category constructors
 * @since 1.0.0
 */
export const empty: ReadonlyArray<never> = internal.empty

/**
 * @category mapping
 * @since 1.0.0
 */
export const map = <A, B>(f: (a: A) => B): (self: ReadonlyArray<A>) => ReadonlyArray<B> =>
  mapWithIndex((a) => f(a))

/**
 * @category mapping
 * @since 1.0.0
 */
export const mapNonEmpty = <A, B>(
  f: (a: A) => B
): (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<B> => mapNonEmptyWithIndex(f)

/**
 * @category mapping
 * @since 1.0.0
 */
export const mapWithIndex = <A, B>(
  f: (a: A, i: number) => B
) => (self: ReadonlyArray<A>): ReadonlyArray<B> => self.map((a, i) => f(a, i))

/**
 * @category mapping
 * @since 1.0.0
 */
export const mapNonEmptyWithIndex = <A, B>(
  f: (a: A, i: number) => B
) =>
  (self: NonEmptyReadonlyArray<A>): NonEmptyReadonlyArray<B> => {
    const out: internal.NonEmptyArray<B> = [f(headNonEmpty(self), 0)]
    for (let i = 1; i < self.length; i++) {
      out.push(f(self[i], i))
    }
    return out
  }

/**
 * @category instances
 * @since 1.0.0
 */
export const Of: of_.Of<ReadonlyArrayTypeLambda> = {
  of
}

/**
 * @category do notation
 * @since 1.0.0
 */
export const Do: ReadonlyArray<{}> = of_.Do(Of)

/**
 * @category mapping
 * @since 1.0.0
 */
export const imap: <A, B>(
  to: (a: A) => B,
  from: (b: B) => A
) => (self: ReadonlyArray<A>) => ReadonlyArray<B> = covariant.imap<
  ReadonlyArrayTypeLambda
>(map)

/**
 * @category instances
 * @since 1.0.0
 */
export const Invariant: invariant.Invariant<ReadonlyArrayTypeLambda> = {
  imap
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Covariant: covariant.Covariant<ReadonlyArrayTypeLambda> = covariant.make(map)

const let_: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (
  self: ReadonlyArray<A>
) => ReadonlyArray<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }> = covariant.let(
  Covariant
)

export {
  /**
   * @category do notation
   * @since 1.0.0
   */
  let_ as let
}

/**
 * @category mapping
 * @since 1.0.0
 */
export const flap: <A>(a: A) => <B>(
  self: ReadonlyArray<(a: A) => B>
) => ReadonlyArray<B> = covariant
  .flap(Covariant)

/**
 * Maps the success value of this effect to the specified constant value.
 *
 * @category mapping
 * @since 1.0.0
 */
export const as: <B>(b: B) => (self: ReadonlyArray<unknown>) => ReadonlyArray<B> = covariant.as(
  Covariant
)

/**
 * @category instances
 * @since 1.0.0
 */
export const Pointed: pointed.Pointed<ReadonlyArrayTypeLambda> = {
  ...Of,
  ...Covariant
}

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapWithIndex = <A, B>(f: (a: A, i: number) => ReadonlyArray<B>) =>
  (self: ReadonlyArray<A>): ReadonlyArray<B> => {
    if (isEmpty(self)) {
      return empty
    }
    const out: Array<B> = []
    for (let i = 0; i < self.length; i++) {
      out.push(...f(self[i], i))
    }
    return out
  }

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMap: <A, B>(
  f: (a: A) => ReadonlyArray<B>
) => (self: ReadonlyArray<A>) => ReadonlyArray<B> = (f) => flatMapWithIndex(f)

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapNonEmptyWithIndex = <A, B>(f: (a: A, i: number) => NonEmptyReadonlyArray<B>) =>
  (self: NonEmptyReadonlyArray<A>): NonEmptyReadonlyArray<B> => {
    const out: internal.NonEmptyArray<B> = internal.fromNonEmptyReadonlyArray(
      f(headNonEmpty(self), 0)
    )
    for (let i = 1; i < self.length; i++) {
      out.push(...f(self[i], i))
    }
    return out
  }

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapNonEmpty: <A, B>(
  f: (a: A) => NonEmptyReadonlyArray<B>
) => (self: NonEmptyReadonlyArray<A>) => NonEmptyReadonlyArray<B> = (f) =>
  flatMapNonEmptyWithIndex(f)

/**
 * @category instances
 * @since 1.0.0
 */
export const FlatMap: flatMap_.FlatMap<ReadonlyArrayTypeLambda> = {
  flatMap
}

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatten: <A>(self: ReadonlyArray<ReadonlyArray<A>>) => ReadonlyArray<A> = flatMap_
  .flatten(FlatMap)

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flattenNonEmpty: <A>(
  self: NonEmptyReadonlyArray<NonEmptyReadonlyArray<A>>
) => NonEmptyReadonlyArray<A> = flatMapNonEmpty(identity)

/**
 * @since 1.0.0
 */
export const composeKleisliArrow: <B, C>(
  bfc: (b: B) => ReadonlyArray<C>
) => <A>(afb: (a: A) => ReadonlyArray<B>) => (a: A) => ReadonlyArray<C> = flatMap_
  .composeKleisliArrow(FlatMap)

/**
 * @category instances
 * @since 1.0.0
 */
export const Chainable: chainable.Chainable<ReadonlyArrayTypeLambda> = {
  ...FlatMap,
  ...Covariant
}

/**
 * @category do notation
 * @since 1.0.0
 */
export const bind: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => ReadonlyArray<B>
) => (
  self: ReadonlyArray<A>
) => ReadonlyArray<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }> = chainable
  .bind(Chainable)

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterMapWithIndex = <A, B>(f: (a: A, i: number) => Option<B>) =>
  (self: Iterable<A>): ReadonlyArray<B> => {
    const as = fromIterable(self)
    const out: Array<B> = []
    for (let i = 0; i < as.length; i++) {
      const o = f(as[i], i)
      if (option.isSome(o)) {
        out.push(o.value)
      }
    }
    return out
  }

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterMap: <A, B>(f: (a: A) => Option<B>) => (self: Iterable<A>) => ReadonlyArray<B> =
  (f) => filterMapWithIndex(f)

/**
 * @category filtering
 * @since 1.0.0
 */
export const compact: <A>(self: Iterable<Option<A>>) => ReadonlyArray<A> = filterMap(identity)

/**
 * @category instances
 * @since 1.0.0
 */
export const Compactable: compactable.Compactable<ReadonlyArrayTypeLambda> = {
  compact
}

/**
 * @category filtering
 * @since 1.0.0
 */
export const separate = <A, B>(
  self: ReadonlyArray<Either<A, B>>
): readonly [ReadonlyArray<A>, ReadonlyArray<B>] => {
  const left: Array<A> = []
  const right: Array<B> = []
  for (const e of self) {
    if (either.isLeft(e)) {
      left.push(e.left)
    } else {
      right.push(e.right)
    }
  }
  return [left, right]
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Filterable: filterable.Filterable<ReadonlyArrayTypeLambda> = {
  filterMap
}

/**
 * @category filtering
 * @since 1.0.0
 */
export const filter: {
  <C extends A, B extends A, A = C>(
    refinement: Refinement<A, B>
  ): (self: ReadonlyArray<C>) => ReadonlyArray<B>
  <B extends A, A = B>(predicate: Predicate<A>): (self: ReadonlyArray<B>) => ReadonlyArray<B>
} = filterable.filter(Filterable)

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterWithIndex: {
  <C extends A, B extends A, A = C>(
    refinement: (a: A, i: number) => a is B
  ): (fc: ReadonlyArray<C>) => ReadonlyArray<B>
  <B extends A, A = B>(
    predicate: (a: A, i: number) => boolean
  ): (fb: ReadonlyArray<B>) => ReadonlyArray<B>
} = <B extends A, A = B>(
  predicate: (a: A, i: number) => boolean
): ((fb: ReadonlyArray<B>) => ReadonlyArray<B>) =>
  filterMapWithIndex((b, i) => (predicate(b, i) ? option.some(b) : option.none))

/**
 * @category filtering
 * @since 1.0.0
 */
export const partition: {
  <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (
    self: ReadonlyArray<C>
  ) => readonly [ReadonlyArray<C>, ReadonlyArray<B>]
  <B extends A, A = B>(
    predicate: Predicate<A>
  ): (self: ReadonlyArray<B>) => readonly [ReadonlyArray<B>, ReadonlyArray<B>]
} = filterable.partition(Filterable)

/**
 * @category filtering
 * @since 1.0.0
 */
export const partitionWithIndex: {
  <C extends A, B extends A, A = C>(refinement: (a: A, i: number) => a is B): (
    fb: ReadonlyArray<C>
  ) => readonly [ReadonlyArray<C>, ReadonlyArray<B>]
  <B extends A, A = B>(predicate: (a: A, i: number) => boolean): (
    fb: ReadonlyArray<B>
  ) => readonly [ReadonlyArray<B>, ReadonlyArray<B>]
} = <B extends A, A = B>(
  predicate: (a: A, i: number) => boolean
): ((fb: ReadonlyArray<B>) => readonly [ReadonlyArray<B>, ReadonlyArray<B>]) =>
  partitionMapWithIndex((b, i) => (predicate(b, i) ? either.right(b) : either.left(b)))

/**
 * @category filtering
 * @since 1.0.0
 */
export const partitionMap: <A, B, C>(
  f: (a: A) => Either<B, C>
) => (self: ReadonlyArray<A>) => readonly [ReadonlyArray<B>, ReadonlyArray<C>] = (f) =>
  partitionMapWithIndex(f)

/**
 * @category filtering
 * @since 1.0.0
 */
export const partitionMapWithIndex = <A, B, C>(f: (a: A, i: number) => Either<B, C>) =>
  (fa: ReadonlyArray<A>): readonly [ReadonlyArray<B>, ReadonlyArray<C>] => {
    const left: Array<B> = []
    const right: Array<C> = []
    for (let i = 0; i < fa.length; i++) {
      const e = f(fa[i], i)
      if (either.isLeft(e)) {
        left.push(e.left)
      } else {
        right.push(e.right)
      }
    }
    return [left, right]
  }

/**
 * @category traversing
 * @since 1.0.0
 */
export const traverse = <F extends TypeLambda>(F: applicative.Applicative<F>) =>
  <A, R, O, E, B>(
    f: (a: A) => Kind<F, R, O, E, B>
  ): ((self: ReadonlyArray<A>) => Kind<F, R, O, E, ReadonlyArray<B>>) => traverseWithIndex(F)(f)

/**
 * @category traversing
 * @since 1.0.0
 */
export const traverseWithIndex = <F extends TypeLambda>(F: applicative.Applicative<F>) =>
  <A, R, O, E, B>(f: (a: A, i: number) => Kind<F, R, O, E, B>) =>
    (self: ReadonlyArray<A>): Kind<F, R, O, E, ReadonlyArray<B>> => F.productAll(self.map(f))

/**
 * @category traversing
 * @since 1.0.0
 */
export const traverseNonEmpty = <F extends TypeLambda>(
  F: semiApplicative.SemiApplicative<F>
) =>
  <A, R, O, E, B>(
    f: (a: A) => Kind<F, R, O, E, B>
  ): ((self: NonEmptyReadonlyArray<A>) => Kind<F, R, O, E, NonEmptyReadonlyArray<B>>) =>
    traverseNonEmptyWithIndex(F)(f)

/**
 * @category traversing
 * @since 1.0.0
 */
export const traverseNonEmptyWithIndex = <F extends TypeLambda>(
  F: semiApplicative.SemiApplicative<F>
) =>
  <A, R, O, E, B>(f: (a: A, i: number) => Kind<F, R, O, E, B>) =>
    (self: NonEmptyReadonlyArray<A>): Kind<F, R, O, E, NonEmptyReadonlyArray<B>> => {
      const fbs = pipe(self, mapNonEmptyWithIndex(f))
      return pipe(headNonEmpty(fbs), F.productMany(tailNonEmpty(fbs)))
    }

/**
 * @category traversing
 * @since 1.0.0
 */
export const sequence: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <R, O, E, A>(
  self: ReadonlyArray<Kind<F, R, O, E, A>>
) => Kind<F, R, O, E, ReadonlyArray<A>> = traversable.sequence<ReadonlyArrayTypeLambda>(traverse)

/**
 * @category instances
 * @since 1.0.0
 */
export const Traversable: traversable.Traversable<ReadonlyArrayTypeLambda> = {
  traverse,
  sequence
}

/**
 * @category traversing
 * @since 1.0.0
 */
export const traverseTap: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B>(
  f: (a: A) => Kind<F, R, O, E, B>
) => (self: ReadonlyArray<A>) => Kind<F, R, O, E, ReadonlyArray<A>> = traversable
  .traverseTap(
    Traversable
  )

/**
 * @category traversing
 * @since 1.0.0
 */
export const sequenceNonEmpty = <F extends TypeLambda>(
  F: semiApplicative.SemiApplicative<F>
): (<R, O, E, A>(
  self: NonEmptyReadonlyArray<Kind<F, R, O, E, A>>
) => Kind<F, R, O, E, NonEmptyReadonlyArray<A>>) => traverseNonEmpty(F)(identity)

/**
 * @since 1.0.0
 */
export const product = <B>(
  that: ReadonlyArray<B>
) =>
  <A>(self: ReadonlyArray<A>): ReadonlyArray<readonly [A, B]> => {
    if (isEmpty(self) || isEmpty(that)) {
      return empty
    }
    const out: Array<readonly [A, B]> = []
    for (let i = 0; i < self.length; i++) {
      for (let j = 0; j < that.length; j++) {
        out.push([self[i], that[j]])
      }
    }
    return out
  }

/**
 * @since 1.0.0
 */
export const productMany: <A>(
  collection: Iterable<ReadonlyArray<A>>
) => (self: ReadonlyArray<A>) => ReadonlyArray<NonEmptyReadonlyArray<A>> = semiProduct
  .productMany(
    Covariant,
    product
  )

/**
 * @since 1.0.0
 */
export const productAll = <A>(
  collection: Iterable<ReadonlyArray<A>>
): ReadonlyArray<ReadonlyArray<A>> => {
  const arrays = Array.from(collection)
  if (isEmpty(arrays)) {
    return empty
  }
  return productMany(arrays.slice(1))(arrays[0])
}

/**
 * @category instances
 * @since 1.0.0
 */
export const SemiProduct: semiProduct.SemiProduct<ReadonlyArrayTypeLambda> = {
  ...Invariant,
  product,
  productMany
}

/**
 * A variant of `bind` that sequentially ignores the scope.
 *
 * @category do notation
 * @since 1.0.0
 */
export const andThenBind: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  fb: ReadonlyArray<B>
) => (
  self: ReadonlyArray<A>
) => ReadonlyArray<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }> = semiProduct
  .andThenBind(
    SemiProduct
  )

/**
 * @category instances
 * @since 1.0.0
 */
export const SemiApplicative: semiApplicative.SemiApplicative<ReadonlyArrayTypeLambda> = {
  ...SemiProduct,
  ...Covariant
}

/**
 * @since 1.0.0
 */
export const ap: <A>(
  fa: ReadonlyArray<A>
) => <B>(self: ReadonlyArray<(a: A) => B>) => ReadonlyArray<B> = semiApplicative.ap(
  SemiApplicative
)

/**
 * Lifts a binary function into `ReadonlyArray`.
 *
 * @category lifting
 * @since 1.0.0
 */
export const lift2: <A, B, C>(
  f: (a: A, b: B) => C
) => (fa: ReadonlyArray<A>, fb: ReadonlyArray<B>) => ReadonlyArray<C> = semiApplicative.lift2(
  SemiApplicative
)

/**
 * Lifts a ternary function into `ReadonlyArray`.
 *
 * @category lifting
 * @since 1.0.0
 */
export const lift3: <A, B, C, D>(
  f: (a: A, b: B, c: C) => D
) => (fa: ReadonlyArray<A>, fb: ReadonlyArray<B>, fc: ReadonlyArray<C>) => ReadonlyArray<D> =
  semiApplicative.lift3(SemiApplicative)

/**
 * @category lifting
 * @since 1.0.0
 */
export const liftSemigroup: <A>(S: Semigroup<A>) => Semigroup<ReadonlyArray<A>> = semiApplicative
  .liftSemigroup(
    SemiApplicative
  )

/**
 * @category instances
 * @since 1.0.0
 */
export const Product: product_.Product<ReadonlyArrayTypeLambda> = {
  ...Of,
  ...SemiProduct,
  productAll
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Applicative: applicative.Applicative<ReadonlyArrayTypeLambda> = {
  ...SemiApplicative,
  ...Product
}

/**
 * @category lifting
 * @since 1.0.0
 */
export const liftMonoid: <A>(M: Monoid<A>) => Monoid<ReadonlyArray<A>> = applicative
  .liftMonoid(
    Applicative
  )

/**
 * @category instances
 * @since 1.0.0
 */
export const Monad: monad.Monad<ReadonlyArrayTypeLambda> = {
  ...Pointed,
  ...FlatMap
}

/**
 * @category folding
 * @since 1.0.0
 */
export const reduce = <B, A>(b: B, f: (b: B, a: A) => B) =>
  (self: ReadonlyArray<A>): B => self.reduce((b, a) => f(b, a), b)

/**
 * @category folding
 * @since 1.0.0
 */
export const reduceWithIndex = <B, A>(b: B, f: (b: B, a: A, i: number) => B) =>
  (self: ReadonlyArray<A>): B => self.reduce((b, a, i) => f(b, a, i), b)

/**
 * @category folding
 * @since 1.0.0
 */
export const reduceRight = <B, A>(b: B, f: (b: B, a: A) => B) =>
  (self: ReadonlyArray<A>): B => self.reduceRight((b, a) => f(b, a), b)

/**
 * @category folding
 * @since 1.0.0
 */
export const reduceRightWithIndex = <B, A>(b: B, f: (b: B, a: A, i: number) => B) =>
  (self: ReadonlyArray<A>): B => self.reduceRight((b, a, i) => f(b, a, i), b)

/**
 * @category instances
 * @since 1.0.0
 */
export const Foldable: foldable.Foldable<ReadonlyArrayTypeLambda> = {
  reduce
}

/**
 * @category folding
 * @since 1.0.0
 */
export const foldMap: <M>(
  M: Monoid<M>
) => <A>(f: (a: A) => M) => (self: ReadonlyArray<A>) => M = foldable.foldMap(
  Foldable
)

/**
 * @category folding
 * @since 1.0.0
 */
export const foldMapWithIndex = <M>(Monoid: Monoid<M>) =>
  <A>(f: (a: A, i: number) => M) =>
    (self: ReadonlyArray<A>): M =>
      self.reduce((m, a, i) => Monoid.combine(f(a, i))(m), Monoid.empty)

/**
 * @category folding
 * @since 1.0.0
 */
export const foldMapNonEmpty = <S>(S: Semigroup<S>) =>
  <A>(f: (a: A) => S): (self: NonEmptyReadonlyArray<A>) => S => foldMapNonEmptyWithIndex(S)(f)

/**
 * @category folding
 * @since 1.0.0
 */
export const foldMapNonEmptyWithIndex = <S>(S: Semigroup<S>) =>
  <A>(f: (a: A, i: number) => S) =>
    (self: NonEmptyReadonlyArray<A>): S =>
      tailNonEmpty(self).reduce((s, a, i) => S.combine(f(a, i + 1))(s), f(headNonEmpty(self), 0))

/**
 * @category folding
 * @since 1.0.0
 */
export const reduceKind: <F extends TypeLambda>(
  F: monad.Monad<F>
) => <B, A, R, O, E>(
  b: B,
  f: (b: B, a: A) => Kind<F, R, O, E, B>
) => (self: ReadonlyArray<A>) => Kind<F, R, O, E, B> = foldable.reduceKind(
  Foldable
)

/**
 * @category folding
 * @since 1.0.0
 */
export const reduceRightKind: <F extends TypeLambda>(
  F: monad.Monad<F>
) => <B, A, R, O, E>(
  b: B,
  f: (b: B, a: A) => Kind<F, R, O, E, B>
) => (self: ReadonlyArray<A>) => Kind<F, R, O, E, B> = foldable
  .reduceRightKind(
    Foldable
  )

/**
 * @category folding
 * @since 1.0.0
 */
export const foldMapKind: <F extends TypeLambda>(
  F: Coproduct<F>
) => <A, R, O, E, B>(
  f: (a: A) => Kind<F, R, O, E, B>
) => (self: ReadonlyArray<A>) => Kind<F, R, O, E, B> = foldable.foldMapKind(
  Foldable
)

/**
 * @category filtering
 * @since 1.0.0
 */
export const traverseFilterMap: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B>(
  f: (a: A) => Kind<F, R, O, E, Option<B>>
) => (ta: ReadonlyArray<A>) => Kind<F, R, O, E, ReadonlyArray<B>> = traversableFilterable
  .traverseFilterMap({ ...Traversable, ...Compactable })

/**
 * @category filtering
 * @since 1.0.0
 */
export const traversePartitionMap: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <A, R, O, E, B, C>(
  f: (a: A) => Kind<F, R, O, E, Either<B, C>>
) => (self: ReadonlyArray<A>) => Kind<F, R, O, E, readonly [ReadonlyArray<B>, ReadonlyArray<C>]> =
  traversableFilterable.traversePartitionMap({ ...Traversable, ...Covariant, ...Compactable })

/**
 * @category instances
 * @since 1.0.0
 */
export const TraversableFilterable: traversableFilterable.TraversableFilterable<
  ReadonlyArrayTypeLambda
> = {
  traverseFilterMap,
  traversePartitionMap
}

/**
 * Filter values inside a context.
 *
 * @since 1.0.0
 */
export const traverseFilter: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <B extends A, R, O, E, A = B>(
  predicate: (a: A) => Kind<F, R, O, E, boolean>
) => (self: ReadonlyArray<B>) => Kind<F, R, O, E, ReadonlyArray<B>> = traversableFilterable
  .traverseFilter(TraversableFilterable)

/**
 * @since 1.0.0
 */
export const traversePartition: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <B extends A, R, O, E, A = B>(
  predicate: (a: A) => Kind<F, R, O, E, boolean>
) => (
  self: ReadonlyArray<B>
) => Kind<F, R, O, E, readonly [ReadonlyArray<B>, ReadonlyArray<B>]> = traversableFilterable
  .traversePartition(TraversableFilterable)

/**
 * @category lifting
 * @since 1.0.0
 */
export const liftPredicate: {
  <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (c: C) => ReadonlyArray<B>
  <B extends A, A = B>(predicate: Predicate<A>): (b: B) => ReadonlyArray<B>
} = <B extends A, A = B>(predicate: Predicate<A>) => (b: B) => predicate(b) ? [b] : empty

/**
 * @category lifting
 * @since 1.0.0
 */
export const liftOption = <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Option<B>
) => (...a: A): ReadonlyArray<B> => fromOption(f(...a))

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromNullable = <A>(a: A): ReadonlyArray<NonNullable<A>> =>
  a == null ? empty : [a as NonNullable<A>]

/**
 * @category lifting
 * @since 1.0.0
 */
export const liftNullable = <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => B | null | undefined
): (...a: A) => ReadonlyArray<NonNullable<B>> => (...a) => fromNullable(f(...a))

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapNullable = <A, B>(
  f: (a: A) => B | null | undefined
) =>
  (self: ReadonlyArray<A>): ReadonlyArray<NonNullable<B>> =>
    isNonEmpty(self) ? fromNullable(f(headNonEmpty(self))) : empty

/**
 * @category lifting
 * @since 1.0.0
 */
export const liftEither = <A extends ReadonlyArray<unknown>, E, B>(
  f: (...a: A) => Either<E, B>
) =>
  (...a: A): ReadonlyArray<B> => {
    const e = f(...a)
    return either.isLeft(e) ? [] : [e.right]
  }

/**
 * Check if a predicate holds true for every `ReadonlyArray` member.
 *
 * @category lifting
 * @since 1.0.0
 */
export function every<A, B extends A>(
  refinement: Refinement<A, B>
): Refinement<ReadonlyArray<A>, ReadonlyArray<B>>
export function every<A>(predicate: Predicate<A>): Predicate<ReadonlyArray<A>>
export function every<A>(predicate: Predicate<A>): Predicate<ReadonlyArray<A>> {
  return (self) => self.every(predicate)
}

/**
 * Check if a predicate holds true for any `ReadonlyArray` member.
 *
 * @category predicates
 * @since 1.0.0
 */
export const some = <A>(predicate: Predicate<A>) =>
  (self: ReadonlyArray<A>): self is NonEmptyReadonlyArray<A> => self.some(predicate)

/**
 * Alias of [`some`](#some)
 *
 * @since 1.0.0
 */
export const has = some

/**
 * Fold a data structure, accumulating values in some `Monoid`, combining adjacent elements
 * using the specified separator.
 *
 * @since 1.0.0
 */
export const intercalate = <A>(M: Monoid<A>) =>
  (middle: A) =>
    (self: ReadonlyArray<A>): A => isNonEmpty(self) ? intercalateNonEmpty(M)(middle)(self) : M.empty

/**
 * Places an element in between members of a `NonEmptyReadonlyArray`, then folds the results using the provided `Semigroup`.
 *
 * @since 1.0.0
 */
export const intercalateNonEmpty = <A>(
  S: Semigroup<A>
) =>
  (middle: A) =>
    (self: NonEmptyReadonlyArray<A>): A =>
      semigroup.intercalate(middle)(S).combineMany(tailNonEmpty(self))(headNonEmpty(self))

/**
 * @since 1.0.0
 */
export const join: (sep: string) => (self: ReadonlyArray<string>) => string = intercalate(
  string.Monoid
)

/**
 * @since 1.0.0
 */
export const productFlatten: <B>(
  that: ReadonlyArray<B>
) => <A extends ReadonlyArray<unknown>>(
  self: ReadonlyArray<A>
) => ReadonlyArray<readonly [...A, B]> = semiProduct.productFlatten(SemiProduct)

/**
 * @since 1.0.0
 */
export const extend = <A, B>(
  f: (as: ReadonlyArray<A>) => B
) => (self: ReadonlyArray<A>): ReadonlyArray<B> => self.map((_, i, as) => f(as.slice(i)))

/**
 * @since 1.0.0
 */
export const min = <A>(O: Order<A>): ((self: NonEmptyReadonlyArray<A>) => A) => {
  const S = semigroup.min(O)
  return (self) => self.reduce((a, acc) => S.combine(acc)(a))
}

/**
 * @since 1.0.0
 */
export const max = <A>(O: Order<A>): ((self: NonEmptyReadonlyArray<A>) => A) => {
  const S = semigroup.max(O)
  return (self) => self.reduce((a, acc) => S.combine(acc)(a))
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const unfold = <B, A>(b: B, f: (b: B) => Option<readonly [A, B]>): ReadonlyArray<A> => {
  const out: Array<A> = []
  let next: B = b
  let o: Option<readonly [A, B]>
  while (option.isSome(o = f(next))) {
    const [a, b] = o.value
    out.push(a)
    next = b
  }
  return out
}

/**
 * @category instances
 * @since 1.0.0
 */
export const getUnionSemigroup = <A>(): Semigroup<ReadonlyArray<A>> => fromCombine(union)

/**
 * @category instances
 * @since 1.0.0
 */
export const getUnionMonoid = <A>(): Monoid<ReadonlyArray<A>> => {
  const S = getUnionSemigroup<A>()
  return ({
    combine: S.combine,
    combineMany: S.combineMany,
    combineAll: (collection) => S.combineMany(collection)(empty),
    empty
  })
}

/**
 * @category instances
 * @since 1.0.0
 */
export const getIntersectionSemigroup = <A>(): Semigroup<ReadonlyArray<A>> =>
  fromCombine(intersection)

/**
 * Returns a `Semigroup` for `ReadonlyArray<A>`.
 *
 * @category instances
 * @since 1.0.0
 */
export const getSemigroup = <A>(): Semigroup<ReadonlyArray<A>> => fromCombine(appendAll)

/**
 * Returns a `Monoid` for `ReadonlyArray<A>`.
 *
 * @category instances
 * @since 1.0.0
 */
export const getMonoid = <A>(): Monoid<ReadonlyArray<A>> => {
  const S = getSemigroup<A>()
  return ({
    combine: S.combine,
    combineMany: S.combineMany,
    combineAll: (collection) => S.combineMany(collection)(empty),
    empty
  })
}

/**
 * Derives an `Order` over the `ReadonlyArray` of a given element type from the `Order` of that type. The ordering between two such
 * `ReadonlyArray`s is equal to: the first non equal comparison of each `ReadonlyArray`s elements taken pairwise in increasing order, in
 * case of equality over all the pairwise elements; the longest `ReadonlyArray` is considered the greatest, if both `ReadonlyArray`s have
 * the same length, the result is equality.
 *
 * @category lifting
 * @since 1.0.0
 */
export const liftOrder = <A>(O: Order<A>): Order<ReadonlyArray<A>> =>
  order.fromCompare((that) =>
    (self) => {
      const aLen = self.length
      const bLen = that.length
      const len = Math.min(aLen, bLen)
      for (let i = 0; i < len; i++) {
        const o = O.compare(that[i])(self[i])
        if (o !== 0) {
          return o
        }
      }
      return number.Order.compare(bLen)(aLen)
    }
  )
