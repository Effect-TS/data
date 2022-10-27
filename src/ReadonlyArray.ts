/**
 * @since 1.0.0
 */
import type { Kind, TypeLambda } from "@fp-ts/core/HKT"
import * as applicative from "@fp-ts/core/typeclass/Applicative"
import * as chainable from "@fp-ts/core/typeclass/Chainable"
import type * as compactable from "@fp-ts/core/typeclass/Compactable"
import type { Coproduct } from "@fp-ts/core/typeclass/Coproduct"
import * as covariant from "@fp-ts/core/typeclass/Covariant"
import * as filterable from "@fp-ts/core/typeclass/Filterable"
import * as flatMap_ from "@fp-ts/core/typeclass/FlatMap"
import * as foldable from "@fp-ts/core/typeclass/Foldable"
import * as invariant from "@fp-ts/core/typeclass/Invariant"
import type * as monad from "@fp-ts/core/typeclass/Monad"
import type { Monoid } from "@fp-ts/core/typeclass/Monoid"
import * as nonEmptyApplicative from "@fp-ts/core/typeclass/NonEmptyApplicative"
import * as nonEmptyProduct from "@fp-ts/core/typeclass/NonEmptyProduct"
import type * as of_ from "@fp-ts/core/typeclass/Of"
import * as order from "@fp-ts/core/typeclass/Order"
import type { Order } from "@fp-ts/core/typeclass/Order"
import type * as pointed from "@fp-ts/core/typeclass/Pointed"
import type * as product_ from "@fp-ts/core/typeclass/Product"
import type { Semigroup } from "@fp-ts/core/typeclass/Semigroup"
import { fromCombine } from "@fp-ts/core/typeclass/Semigroup"
import * as traversable from "@fp-ts/core/typeclass/Traversable"
import * as traversableFilterable from "@fp-ts/core/typeclass/TraversableFilterable"
import type { Either } from "@fp-ts/data/Either"
import type { Endomorphism } from "@fp-ts/data/Endomorphism"
import { equals } from "@fp-ts/data/Equal"
import { identity, pipe } from "@fp-ts/data/Function"
import type { LazyArg } from "@fp-ts/data/Function"
import * as internal from "@fp-ts/data/internal/Common"
import * as either from "@fp-ts/data/internal/Either"
import * as nonEmptyReadonlyArray from "@fp-ts/data/NonEmptyReadonlyArray"
import type { NonEmptyReadonlyArray } from "@fp-ts/data/NonEmptyReadonlyArray"
import * as number from "@fp-ts/data/Number"
import type { Option } from "@fp-ts/data/Option"
import type { Predicate } from "@fp-ts/data/Predicate"
import type { Refinement } from "@fp-ts/data/Refinement"
import * as fromOption_ from "@fp-ts/data/typeclasses/FromOption"

// -------------------------------------------------------------------------------------
// type lambdas
// -------------------------------------------------------------------------------------

/**
 * @category type lambdas
 * @since 1.0.0
 */
export interface ReadonlyArrayTypeLambda extends TypeLambda {
  readonly type: ReadonlyArray<this["Target"]>
}

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromIterable: <A>(collection: Iterable<A>) => ReadonlyArray<A> = internal.fromIterable

/**
 * Return a `ReadonlyArray` of length `n` with element `i` initialized with `f(i)`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @exampleTodo
 * import { makeBy } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * const double = (n: number): number => n * 2
 * assert.deepStrictEqual(pipe(5, makeBy(double)), [0, 2, 4, 6, 8])
 *
 * @category constructors
 * @since 1.0.0
 */
export const makeBy = <A>(f: (i: number) => A) =>
  (n: number): ReadonlyArray<A> => n <= 0 ? empty : nonEmptyReadonlyArray.makeBy(f)(n)

/**
 * Create a `ReadonlyArray` containing a range of integers, including both endpoints.
 *
 * @exampleTodo
 * import { range } from '@fp-ts/data/ReadonlyArray'
 *
 * assert.deepStrictEqual(range(1, 5), [1, 2, 3, 4, 5])
 *
 * @category constructors
 * @since 1.0.0
 */
export const range = nonEmptyReadonlyArray.range

/**
 * Create a `ReadonlyArray` containing a value repeated the specified number of times.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @exampleTodo
 * import { replicate } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * assert.deepStrictEqual(pipe(3, replicate('a')), ['a', 'a', 'a'])
 *
 * @category constructors
 * @since 1.0.0
 */
export const replicate = <A>(a: A): ((n: number) => ReadonlyArray<A>) => makeBy(() => a)

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromOption: <A>(fa: Option<A>) => ReadonlyArray<A> = (
  ma
) => (internal.isNone(ma) ? empty : [ma.value])

/**
 * Converts an `Either` to a `ReadonlyArray`.
 *
 * @category conversions
 * @since 1.0.0
 */
export const fromEither: <A>(fa: Either<unknown, A>) => ReadonlyArray<A> = (
  e
) => (either.isLeft(e) ? empty : [e.right])

/**
 * Break a `ReadonlyArray` into its first element and remaining elements.
 *
 * @exampleTodo
 * import { match } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 *
 * const len: <A>(as: ReadonlyArray<A>) => number = match(() => 0, (_, tail) => 1 + len(tail))
 * assert.strictEqual(len([1, 2, 3]), 3)
 *
 * @category pattern matching
 * @since 1.0.0
 */
export const match = <B, A, C = B>(
  onEmpty: LazyArg<B>,
  onNonEmpty: (head: A, tail: ReadonlyArray<A>) => C
) =>
  (as: ReadonlyArray<A>): B | C =>
    isNonEmpty(as) ?
      onNonEmpty(nonEmptyReadonlyArray.head(as), nonEmptyReadonlyArray.tail(as)) :
      onEmpty()

/**
 * Break a `ReadonlyArray` into its initial elements and the last element.
 *
 * @category pattern matching
 * @since 1.0.0
 */
export const matchRight = <B, A, C = B>(
  onEmpty: LazyArg<B>,
  onNonEmpty: (init: ReadonlyArray<A>, last: A) => C
) =>
  (as: ReadonlyArray<A>): B | C =>
    isNonEmpty(as) ?
      onNonEmpty(nonEmptyReadonlyArray.init(as), nonEmptyReadonlyArray.last(as)) :
      onEmpty()

/**
 * @since 1.0.0
 */
export const concat = <B>(that: ReadonlyArray<B>) =>
  <A>(self: ReadonlyArray<A>): ReadonlyArray<A | B> => (self as ReadonlyArray<A | B>).concat(that)

/**
 * Fold a `ReadonlyArray` from the left, keeping all intermediate results instead of only the final result.
 *
 * @exampleTodo
 * import { scanLeft } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 *
 * assert.deepStrictEqual(scanLeft(10, (b, a: number) => b - a)([1, 2, 3]), [10, 9, 7, 4])
 *
 * @since 1.0.0
 */
export const scanLeft = <B, A>(b: B, f: (b: B, a: A) => B) =>
  (as: ReadonlyArray<A>): NonEmptyReadonlyArray<B> => {
    const len = as.length
    const out = new Array(len + 1) as [B, ...Array<B>]
    out[0] = b
    for (let i = 0; i < len; i++) {
      out[i + 1] = f(out[i], as[i])
    }
    return out
  }

/**
 * Fold a `ReadonlyArray` from the right, keeping all intermediate results instead of only the final result.
 *
 * @exampleTodo
 * import { scanRight } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 *
 * assert.deepStrictEqual(scanRight(10, (a: number, b) => b - a)([1, 2, 3]), [4, 5, 7, 10])
 *
 * @since 1.0.0
 */
export const scanRight = <B, A>(b: B, f: (a: A, b: B) => B) =>
  (as: ReadonlyArray<A>): NonEmptyReadonlyArray<B> => {
    const len = as.length
    const out = new Array(len + 1) as [B, ...Array<B>]
    out[len] = b
    for (let i = len - 1; i >= 0; i--) {
      out[i] = f(as[i], out[i + 1])
    }
    return out
  }

/**
 * Test whether a `ReadonlyArray` is empty.
 *
 * @exampleTodo
 * import { isEmpty } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 *
 * assert.strictEqual(isEmpty([]), true)
 *
 * @since 1.0.0
 */
export const isEmpty = <A>(as: ReadonlyArray<A>): as is readonly [] => as.length === 0

/**
 * Test whether a `ReadonlyArray` is non empty narrowing down the type to `NonEmptyReadonlyArray<A>`
 *
 * @category refinements
 * @since 1.0.0
 */
export const isNonEmpty: <A>(as: ReadonlyArray<A>) => as is NonEmptyReadonlyArray<A> =
  internal.isNonEmpty

/**
 * Calculate the number of elements in a `ReadonlyArray`.
 *
 * @since 1.0.0
 */
export const size = <A>(as: ReadonlyArray<A>): number => as.length

/**
 * Test whether a `ReadonlyArray` contains a particular index
 *
 * @since 1.0.0
 */
export const isOutOfBound: <A>(i: number, as: ReadonlyArray<A>) => boolean =
  nonEmptyReadonlyArray.isOutOfBound

/**
 * This function provides a safe way to read a value at a particular index from a `ReadonlyArray`
 *
 * @exampleTodo
 * import { lookup } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { some, none } from '@fp-ts/core/typeclass/data/Option'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], lookup(1)), some(2))
 * assert.deepStrictEqual(pipe([1, 2, 3], lookup(3)), none)
 *
 * @since 1.0.0
 */
export const lookup = (i: number) =>
  <A>(as: ReadonlyArray<A>): Option<A> => isOutOfBound(i, as) ? internal.none : internal.some(as[i])

/**
 * Prepend an element to the front of a `ReadonlyArray`, creating a new `NonEmptyReadonlyArray`.
 *
 * @exampleTodo
 * import { prepend } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], prepend(0)), [0, 1, 2, 3])
 *
 * @category constructors
 * @since 1.0.0
 */
export const prepend: <B>(elem: B) => <A>(self: ReadonlyArray<A>) => NonEmptyReadonlyArray<A | B> =
  nonEmptyReadonlyArray.prepend

/**
 * Append an element to the end of a `ReadonlyArray`, creating a new `NonEmptyReadonlyArray`.
 *
 * @exampleTodo
 * import { append } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], append(4)), [1, 2, 3, 4])
 *
 * @category constructors
 * @since 1.0.0
 */
export const append: <B>(end: B) => <A>(init: ReadonlyArray<A>) => NonEmptyReadonlyArray<A | B> =
  nonEmptyReadonlyArray.append

/**
 * Get the first element of a `ReadonlyArray`, or `None` if the `ReadonlyArray` is empty.
 *
 * @exampleTodo
 * import { head } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { some, none } from '@fp-ts/core/typeclass/data/Option'
 *
 * assert.deepStrictEqual(head([1, 2, 3]), some(1))
 * assert.deepStrictEqual(head([]), none)
 *
 * @since 1.0.0
 */
export const head = <A>(
  self: ReadonlyArray<A>
): Option<A> => (isNonEmpty(self) ? internal.some(self[0]) : internal.none)

/**
 * Get the last element in a `ReadonlyArray`, or `None` if the `ReadonlyArray` is empty.
 *
 * @exampleTodo
 * import { last } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { some, none } from '@fp-ts/core/typeclass/data/Option'
 *
 * assert.deepStrictEqual(last([1, 2, 3]), some(3))
 * assert.deepStrictEqual(last([]), none)
 *
 * @since 1.0.0
 */
export const last = <A>(as: ReadonlyArray<A>): Option<A> =>
  isNonEmpty(as) ? internal.some(nonEmptyReadonlyArray.last(as)) : internal.none

/**
 * Get all but the first element of a `ReadonlyArray`, creating a new `ReadonlyArray`, or `None` if the `ReadonlyArray` is empty.
 *
 * @exampleTodo
 * import { tail } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { some, none } from '@fp-ts/core/typeclass/data/Option'
 *
 * assert.deepStrictEqual(tail([1, 2, 3]), some([2, 3]))
 * assert.deepStrictEqual(tail([]), none)
 *
 * @since 1.0.0
 */
export const tail = <A>(as: ReadonlyArray<A>): Option<ReadonlyArray<A>> =>
  isNonEmpty(as) ? internal.some(nonEmptyReadonlyArray.tail(as)) : internal.none

/**
 * Get all but the last element of a `ReadonlyArray`, creating a new `ReadonlyArray`, or `None` if the `ReadonlyArray` is empty.
 *
 * @exampleTodo
 * import { init } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { some, none } from '@fp-ts/core/typeclass/data/Option'
 *
 * assert.deepStrictEqual(init([1, 2, 3]), some([1, 2]))
 * assert.deepStrictEqual(init([]), none)
 *
 * @since 1.0.0
 */
export const init = <A>(as: ReadonlyArray<A>): Option<ReadonlyArray<A>> =>
  isNonEmpty(as) ? internal.some(nonEmptyReadonlyArray.init(as)) : internal.none

/**
 * Keep only a max number of elements from the start of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @exampleTodo
 * import * as RA from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * const input: ReadonlyArray<number> = [1, 2, 3]
 * assert.deepStrictEqual(pipe(input, RA.take(2)), [1, 2])
 *
 * @since 1.0.0
 */
export const take = (n: number) =>
  <A>(as: ReadonlyArray<A>): ReadonlyArray<A> =>
    n <= 0 ? empty : n >= as.length ? as : as.slice(0, n)

/**
 * Keep only a max number of elements from the end of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @exampleTodo
 * import * as RA from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * const input: ReadonlyArray<number> = [1, 2, 3]
 * assert.deepStrictEqual(pipe(input, RA.takeRight(2)), [2, 3])
 *
 * // out of bounds
 * assert.strictEqual(pipe(input, RA.takeRight(4)), input)
 * assert.strictEqual(pipe(input, RA.takeRight(-1)), input)
 *
 * @since 1.0.0
 */
export const takeRight = (n: number) =>
  <A>(as: ReadonlyArray<A>): ReadonlyArray<A> =>
    isOutOfBound(n, as) ? as : n === 0 ? empty : as.slice(-n)

/**
 * Calculate the longest initial subarray for which all element satisfy the specified predicate, creating a new `ReadonlyArray`.
 *
 * @exampleTodo
 * import { takeLeftWhile } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 *
 * assert.deepStrictEqual(takeLeftWhile((n: number) => n % 2 === 0)([2, 4, 3, 6]), [2, 4])
 *
 * @since 1.0.0
 */
export function takeWhile<A, B extends A>(
  refinement: Refinement<A, B>
): (as: ReadonlyArray<A>) => ReadonlyArray<B>
export function takeWhile<A>(
  predicate: Predicate<A>
): <B extends A>(bs: ReadonlyArray<B>) => ReadonlyArray<B>
export function takeWhile<A>(
  predicate: Predicate<A>
): (as: ReadonlyArray<A>) => ReadonlyArray<A>
export function takeWhile<A>(
  predicate: Predicate<A>
): (as: ReadonlyArray<A>) => ReadonlyArray<A> {
  return (as: ReadonlyArray<A>) => {
    const out: Array<A> = []
    for (const a of as) {
      if (!predicate(a)) {
        break
      }
      out.push(a)
    }
    const len = out.length
    return len === as.length ? as : len === 0 ? empty : out
  }
}

const spanLeftIndex = <A>(as: ReadonlyArray<A>, predicate: Predicate<A>): number => {
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
 * @exampleTodo
 * import { spanLeft } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 *
 * assert.deepStrictEqual(spanLeft((n: number) => n % 2 === 1)([1, 3, 2, 4, 5]), [[1, 3], [2, 4, 5]])
 *
 * @since 1.0.0
 */
export function spanLeft<A, B extends A>(
  refinement: Refinement<A, B>
): (as: ReadonlyArray<A>) => readonly [init: ReadonlyArray<B>, rest: ReadonlyArray<A>]
export function spanLeft<A>(
  predicate: Predicate<A>
): <B extends A>(bs: ReadonlyArray<B>) => readonly [init: ReadonlyArray<B>, rest: ReadonlyArray<B>]
export function spanLeft<A>(
  predicate: Predicate<A>
): (as: ReadonlyArray<A>) => readonly [init: ReadonlyArray<A>, rest: ReadonlyArray<A>]
export function spanLeft<A>(
  predicate: Predicate<A>
): (as: ReadonlyArray<A>) => readonly [init: ReadonlyArray<A>, rest: ReadonlyArray<A>] {
  return (as) => splitAt(spanLeftIndex(as, predicate))(as)
}

/**
 * Drop a max number of elements from the start of an `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * **Note**. `n` is normalized to a non negative integer.
 *
 * @exampleTodo
 * import * as RA from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * const input: ReadonlyArray<number> = [1, 2, 3]
 * assert.deepStrictEqual(pipe(input, RA.drop(2)), [3])
 * assert.strictEqual(pipe(input, RA.drop(0)), input)
 * assert.strictEqual(pipe(input, RA.drop(-1)), input)
 *
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
 * @exampleTodo
 * import * as RA from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * const input: ReadonlyArray<number> = [1, 2, 3]
 * assert.deepStrictEqual(pipe(input, RA.dropRight(2)), [1])
 * assert.strictEqual(pipe(input, RA.dropRight(0)), input)
 * assert.strictEqual(pipe(input, RA.dropRight(-1)), input)
 *
 * @since 1.0.0
 */
export const dropRight = (n: number) =>
  <A>(as: ReadonlyArray<A>): ReadonlyArray<A> =>
    n <= 0 || isEmpty(as) ? as : n >= as.length ? empty : as.slice(0, as.length - n)

/**
 * Remove the longest initial subarray for which all element satisfy the specified predicate, creating a new `ReadonlyArray`.
 *
 * @exampleTodo
 * import { dropLeftWhile } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 *
 * assert.deepStrictEqual(dropLeftWhile((n: number) => n % 2 === 1)([1, 3, 2, 4, 5]), [2, 4, 5])
 *
 * @since 1.0.0
 */
export function dropLeftWhile<A, B extends A>(
  refinement: Refinement<A, B>
): (as: ReadonlyArray<A>) => ReadonlyArray<B>
export function dropLeftWhile<A>(
  predicate: Predicate<A>
): <B extends A>(bs: ReadonlyArray<B>) => ReadonlyArray<B>
export function dropLeftWhile<A>(
  predicate: Predicate<A>
): (as: ReadonlyArray<A>) => ReadonlyArray<A>
export function dropLeftWhile<A>(
  predicate: Predicate<A>
): (as: ReadonlyArray<A>) => ReadonlyArray<A> {
  return (as) => {
    const i = spanLeftIndex(as, predicate)
    return i === 0 ? as : i === as.length ? empty : as.slice(i)
  }
}

/**
 * Find the first index for which a predicate holds
 *
 * @exampleTodo
 * import { findIndex } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { some, none } from '@fp-ts/core/typeclass/data/Option'
 *
 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([1, 2, 3]), some(1))
 * assert.deepStrictEqual(findIndex((n: number) => n === 2)([]), none)
 *
 * @since 1.0.0
 */
export const findIndex = <A>(predicate: Predicate<A>) =>
  (as: ReadonlyArray<A>): Option<number> => {
    const len = as.length
    for (let i = 0; i < len; i++) {
      if (predicate(as[i])) {
        return internal.some(i)
      }
    }
    return internal.none
  }

/**
 * Find the first element which satisfies a predicate (or a refinement) function
 *
 * @exampleTodo
 * import { findFirst } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { some } from '@fp-ts/core/typeclass/data/Option'
 *
 * assert.deepStrictEqual(findFirst((x: { a: number, b: number }) => x.a === 1)([{ a: 1, b: 1 }, { a: 1, b: 2 }]), some({ a: 1, b: 1 }))
 *
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
        return internal.some(as[i])
      }
    }
    return internal.none
  }
}

/**
 * Find the first element returned by an option based selector function
 *
 * @exampleTodo
 * import { findFirstMap } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { some, none } from '@fp-ts/core/typeclass/data/Option'
 *
 * interface Person {
 *   name: string
 *   age?: number
 * }
 *
 * const persons: ReadonlyArray<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
 *
 * // returns the name of the first person that has an age
 * assert.deepStrictEqual(findFirstMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons), some('Mary'))
 *
 * @since 1.0.0
 */
export const findFirstMap = <A, B>(f: (a: A) => Option<B>) =>
  (as: ReadonlyArray<A>): Option<B> => {
    const len = as.length
    for (let i = 0; i < len; i++) {
      const v = f(as[i])
      if (internal.isSome(v)) {
        return v
      }
    }
    return internal.none
  }

/**
 * Find the last element which satisfies a predicate function
 *
 * @exampleTodo
 * import { findLast } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { some } from '@fp-ts/core/typeclass/data/Option'
 *
 * assert.deepStrictEqual(findLast((x: { a: number, b: number }) => x.a === 1)([{ a: 1, b: 1 }, { a: 1, b: 2 }]), some({ a: 1, b: 2 }))
 *
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
        return internal.some(as[i])
      }
    }
    return internal.none
  }
}

/**
 * Find the last element returned by an option based selector function
 *
 * @exampleTodo
 * import { findLastMap } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { some, none } from '@fp-ts/core/typeclass/data/Option'
 *
 * interface Person {
 *   name: string
 *   age?: number
 * }
 *
 * const persons: ReadonlyArray<Person> = [{ name: 'John' }, { name: 'Mary', age: 45 }, { name: 'Joey', age: 28 }]
 *
 * // returns the name of the last person that has an age
 * assert.deepStrictEqual(findLastMap((p: Person) => (p.age === undefined ? none : some(p.name)))(persons), some('Joey'))
 *
 * @since 1.0.0
 */
export const findLastMap = <A, B>(f: (a: A) => Option<B>) =>
  (as: ReadonlyArray<A>): Option<B> => {
    const len = as.length
    for (let i = len - 1; i >= 0; i--) {
      const v = f(as[i])
      if (internal.isSome(v)) {
        return v
      }
    }
    return internal.none
  }

/**
 * Returns the index of the last element of the list which matches the predicate
 *
 * @exampleTodo
 * import { findLastIndex } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { some, none } from '@fp-ts/core/typeclass/data/Option'
 *
 * interface X {
 *   a: number
 *   b: number
 * }
 * const xs: ReadonlyArray<X> = [{ a: 1, b: 0 }, { a: 1, b: 1 }]
 * assert.deepStrictEqual(findLastIndex((x: { a: number }) => x.a === 1)(xs), some(1))
 * assert.deepStrictEqual(findLastIndex((x: { a: number }) => x.a === 4)(xs), none)
 *
 * @since 1.0.0
 */
export const findLastIndex = <A>(predicate: Predicate<A>) =>
  (as: ReadonlyArray<A>): Option<number> => {
    const len = as.length
    for (let i = len - 1; i >= 0; i--) {
      if (predicate(as[i])) {
        return internal.some(i)
      }
    }
    return internal.none
  }

/**
 * Insert an element at the specified index, creating a new `ReadonlyArray`, or returning `None` if the index is out of bounds.
 *
 * @exampleTodo
 * import { insertAt } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { some } from '@fp-ts/core/typeclass/data/Option'
 *
 * assert.deepStrictEqual(insertAt(2, 5)([1, 2, 3, 4]), some([1, 2, 5, 3, 4]))
 *
 * @since 1.0.0
 */
export const insertAt = <A>(i: number, a: A) =>
  (as: ReadonlyArray<A>): Option<NonEmptyReadonlyArray<A>> => {
    if (i < 0 || i > as.length) {
      return internal.none
    }
    if (isNonEmpty(as)) {
      const out = internal.fromNonEmptyReadonlyArray(as)
      out.splice(i, 0, a)
      return internal.some(out)
    }
    return internal.some([a])
  }

/**
 * Change the element at the specified index, creating a new `ReadonlyArray`, or returning `None` if the index is out of bounds.
 *
 * @exampleTodo
 * import { updateAt } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { some, none } from '@fp-ts/core/typeclass/data/Option'
 *
 * assert.deepStrictEqual(updateAt(1, 1)([1, 2, 3]), some([1, 1, 3]))
 * assert.deepStrictEqual(updateAt(1, 1)([]), none)
 *
 * @since 1.0.0
 */
export const updateAt = <A>(
  i: number,
  a: A
): ((as: ReadonlyArray<A>) => Option<ReadonlyArray<A>>) => modifyAt(i, () => a)

/**
 * Apply a function to the element at the specified index, creating a new `ReadonlyArray`, or returning `None` if the index is out
 * of bounds.
 *
 * @exampleTodo
 * import { modifyAt } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { some, none } from '@fp-ts/core/typeclass/data/Option'
 *
 * const double = (x: number): number => x * 2
 * assert.deepStrictEqual(modifyAt(1, double)([1, 2, 3]), some([1, 4, 3]))
 * assert.deepStrictEqual(modifyAt(1, double)([]), none)
 *
 * @since 1.0.0
 */
export const modifyAt = <A>(i: number, f: Endomorphism<A>) =>
  (as: ReadonlyArray<A>): Option<ReadonlyArray<A>> => {
    if (isOutOfBound(i, as)) {
      return internal.none
    }
    const prev = as[i]
    const next = f(prev)
    if (next === prev) {
      return internal.some(as)
    }
    const out = as.slice()
    out[i] = next
    return internal.some(out)
  }

const unsafeDeleteAt = <A>(i: number, as: ReadonlyArray<A>): ReadonlyArray<A> => {
  const xs = as.slice()
  xs.splice(i, 1)
  return xs
}

/**
 * Delete the element at the specified index, creating a new `ReadonlyArray`, or returning `None` if the index is out of bounds.
 *
 * @exampleTodo
 * import { deleteAt } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { some, none } from '@fp-ts/core/typeclass/data/Option'
 *
 * assert.deepStrictEqual(deleteAt(0)([1, 2, 3]), some([2, 3]))
 * assert.deepStrictEqual(deleteAt(1)([]), none)
 *
 * @since 1.0.0
 */
export const deleteAt = (i: number) =>
  <A>(as: ReadonlyArray<A>): Option<ReadonlyArray<A>> =>
    isOutOfBound(i, as) ? internal.none : internal.some(unsafeDeleteAt(i, as))

/**
 * Reverse a `ReadonlyArray`, creating a new `ReadonlyArray`.
 *
 * @exampleTodo
 * import { reverse } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 *
 * assert.deepStrictEqual(reverse([1, 2, 3]), [3, 2, 1])
 *
 * @since 1.0.0
 */
export const reverse = <A>(
  as: ReadonlyArray<A>
): ReadonlyArray<A> => (as.length <= 1 ? as : as.slice().reverse())

/**
 * Extracts from a `ReadonlyArray` of `Either`s all the `Success` elements.
 *
 * @exampleTodo
 * import { rights } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { right, left } from '@fp-ts/core/typeclass/data/Either'
 *
 * assert.deepStrictEqual(rights([succeed(1), left('foo'), right(2)]), [1, 2])
 *
 * @since 1.0.0
 */
export const rights = <E, A>(as: ReadonlyArray<Either<E, A>>): ReadonlyArray<A> => {
  const len = as.length
  const out: Array<A> = []
  for (let i = 0; i < len; i++) {
    const a = as[i]
    if (either.isRight(a)) {
      out.push(a.right)
    }
  }
  return out
}

/**
 * Extracts from a `ReadonlyArray` of `Either` all the `Failure` elements. All the `Failure` elements are extracted in order
 *
 * @exampleTodo
 * import { lefts } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { left, right } from '@fp-ts/core/typeclass/data/Either'
 *
 * assert.deepStrictEqual(failures([right(1), left('foo'), right(2)]), ['foo'])
 *
 * @since 1.0.0
 */
export const lefts = <E, A>(as: ReadonlyArray<Either<E, A>>): ReadonlyArray<E> => {
  const out: Array<E> = []
  const len = as.length
  for (let i = 0; i < len; i++) {
    const a = as[i]
    if (either.isLeft(a)) {
      out.push(a.left)
    }
  }
  return out
}

/**
 * Sort the elements of a `ReadonlyArray` in increasing order, creating a new `ReadonlyArray`.
 *
 * @exampleTodo
 * import { sort } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import * as N from '@fp-ts/core/typeclass/data/number'
 *
 * assert.deepStrictEqual(sort(N.Order)([3, 2, 1]), [1, 2, 3])
 *
 * @since 1.0.0
 */
export const sort = <B>(O: Order<B>) =>
  <A extends B>(as: ReadonlyArray<A>): ReadonlyArray<A> =>
    as.length <= 1 ? as : as.slice().sort((self, that) => O.compare(that)(self))

/**
 * Apply a function to pairs of elements at the same index in two `ReadonlyArray`s, collecting the results in a new `ReadonlyArray`. If one
 * input `ReadonlyArray` is short, excess elements of the longer `ReadonlyArray` are discarded.
 *
 * @exampleTodo
 * import { zipWith } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], zipWith(['a', 'b', 'c', 'd'], (n, s) => s + n)), ['a1', 'b2', 'c3'])
 *
 * @since 1.0.0
 */
export const zipWith = <B, A, C>(fb: ReadonlyArray<B>, f: (a: A, b: B) => C) =>
  (fa: ReadonlyArray<A>): ReadonlyArray<C> => {
    const out: Array<C> = []
    const len = Math.min(fa.length, fb.length)
    for (let i = 0; i < len; i++) {
      out[i] = f(fa[i], fb[i])
    }
    return out
  }

/**
 * Takes two `ReadonlyArray`s and returns a `ReadonlyArray` of corresponding pairs. If one input `ReadonlyArray` is short, excess elements of the
 * longer `ReadonlyArray` are discarded.
 *
 * @exampleTodo
 * import { zip } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], zip(['a', 'b', 'c', 'd'])), [[1, 'a'], [2, 'b'], [3, 'c']])
 *
 * @since 1.0.0
 */
export const zip: <B>(
  bs: ReadonlyArray<B>
) => <A>(as: ReadonlyArray<A>) => ReadonlyArray<readonly [A, B]> = (bs) =>
  zipWith(bs, (a, b) => [a, b])

/**
 * @since 1.0.0
 */
export const zipMany = <A>(collection: Iterable<ReadonlyArray<A>>) =>
  (self: ReadonlyArray<A>): ReadonlyArray<readonly [A, ...Array<A>]> => {
    if (self.length === 0) {
      return []
    }

    const arrays = Array.from(collection)
    const out: Array<[A, ...Array<A>]> = []

    for (let i = 0; i < self.length; i++) {
      const inner: [A, ...Array<A>] = [self[i]]
      for (const array of arrays) {
        if (i > array.length - 1) {
          return out
        }
        inner.push(array[i])
      }
      out.push(inner)
    }

    return out
  }

/**
 * @since 1.0.0
 */
export const zipAll = <A>(
  collection: Iterable<ReadonlyArray<A>>
): ReadonlyArray<ReadonlyArray<A>> => {
  const arrays = Array.from(collection)
  if (arrays.length === 0) {
    return []
  }
  return zipMany(arrays.slice(1))(arrays[0])
}

/**
 * This function is the inverse of `zip`. Takes a `ReadonlyArray` of pairs and return two corresponding `ReadonlyArray`s.
 *
 * @exampleTodo
 * import { unzip } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 *
 * assert.deepStrictEqual(unzip([[1, 'a'], [2, 'b'], [3, 'c']]), [[1, 2, 3], ['a', 'b', 'c']])
 *
 * @since 1.0.0
 */
export const unzip = <A, B>(
  as: ReadonlyArray<readonly [A, B]>
): readonly [ReadonlyArray<A>, ReadonlyArray<B>] => {
  const fa: Array<A> = []
  const fb: Array<B> = []
  for (let i = 0; i < as.length; i++) {
    fa[i] = as[i][0]
    fb[i] = as[i][1]
  }
  return [fa, fb]
}

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
export const productMany = <A>(collection: Iterable<ReadonlyArray<A>>) =>
  (self: ReadonlyArray<A>): ReadonlyArray<readonly [A, ...Array<A>]> => {
    if (isEmpty(self)) {
      return empty
    }

    const arrays = Array.from(collection)
    const out: Array<[A, ...Array<A>]> = []

    for (let i = 0; i < self.length; i++) {
      const inner: [A, ...Array<A>] = [self[i]]
      for (const array of arrays) {
        for (let j = 0; j < array.length; j++) {
          inner.push(array[j])
        }
      }
      out.push(inner)
    }

    return out
  }

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
 * @since 1.0.0
 */
export const prependAll = <B>(prefix: ReadonlyArray<B>) =>
  <A>(self: ReadonlyArray<A>): ReadonlyArray<A | B> => (prefix as ReadonlyArray<A | B>).concat(self)

/**
 * Places an element in between members of a `ReadonlyArray`
 *
 * @exampleTodo
 * import { intersperse } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * assert.deepStrictEqual(pipe([1, 2, 3, 4], intersperse(9)), [1, 9, 2, 9, 3, 9, 4])
 *
 * @since 1.0.0
 */
export const intersperse = <A>(middle: A): ((as: ReadonlyArray<A>) => ReadonlyArray<A>) => {
  const f = nonEmptyReadonlyArray.intersperse(middle)
  return (as) => (isNonEmpty(as) ? f(as) : as)
}

/**
 * Rotate a `ReadonlyArray` by `n` steps.
 *
 * @exampleTodo
 * import { rotate } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 *
 * assert.deepStrictEqual(rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
 * assert.deepStrictEqual(rotate(-2)([1, 2, 3, 4, 5]), [3, 4, 5, 1, 2])
 *
 * @since 1.0.0
 */
export const rotate = (n: number): (<A>(as: ReadonlyArray<A>) => ReadonlyArray<A>) => {
  const f = nonEmptyReadonlyArray.rotate(n)
  return (as) => (isNonEmpty(as) ? f(as) : as)
}

/**
 * Tests whether a value is a member of a `ReadonlyArray`.
 *
 * @exampleTodo
 * import { elem } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import * as N from '@fp-ts/core/typeclass/data/number'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * assert.strictEqual(pipe([1, 2, 3], elem(N.Eq)(2)), true)
 * assert.strictEqual(pipe([1, 2, 3], elem(N.Eq)(0)), false)
 *
 * @since 1.0.0
 */
export const elem = <B>(a: B) =>
  <A>(as: ReadonlyArray<A>): boolean => {
    let i = 0
    const len = as.length
    for (; i < len; i++) {
      if (equals(a, as[i])) {
        return true
      }
    }
    return false
  }

/**
 * Remove duplicates from a `ReadonlyArray`, keeping the first occurrence of an element.
 *
 * @exampleTodo
 * import { uniq } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import * as N from '@fp-ts/core/typeclass/data/number'
 *
 * assert.deepStrictEqual(uniq(N.Eq)([1, 2, 1]), [1, 2])
 *
 * @since 1.0.0
 */
export const uniq = <A>(
  self: ReadonlyArray<A>
) => (isNonEmpty(self) ? nonEmptyReadonlyArray.uniq(self) : self)

/**
 * Sort the elements of a `ReadonlyArray` in increasing order, where elements are compared using first `ords[0]`, then `ords[1]`,
 * etc...
 *
 * @exampleTodo
 * import { sortBy } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { contramap } from '@fp-ts/core/typeclass/Order'
 * import * as S from '@fp-ts/core/typeclass/data/string'
 * import * as N from '@fp-ts/core/typeclass/data/number'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * interface Person {
 *   name: string
 *   age: number
 * }
 * const byName = pipe(S.Order, contramap((p: Person) => p.name))
 * const byAge = pipe(N.Order, contramap((p: Person) => p.age))
 *
 * const sortByNameByAge = sortBy([byName, byAge])
 *
 * const persons = [{ name: 'a', age: 1 }, { name: 'b', age: 3 }, { name: 'c', age: 2 }, { name: 'b', age: 2 }]
 * assert.deepStrictEqual(sortByNameByAge(persons), [
 *   { name: 'a', age: 1 },
 *   { name: 'b', age: 2 },
 *   { name: 'b', age: 3 },
 *   { name: 'c', age: 2 }
 * ])
 *
 * @since 1.0.0
 */
export const sortBy = <B>(
  orders: ReadonlyArray<Order<B>>
): (<A extends B>(as: ReadonlyArray<A>) => ReadonlyArray<A>) => {
  const f = nonEmptyReadonlyArray.sortBy(orders)
  return (as) => (isNonEmpty(as) ? f(as) : as)
}

/**
 * A useful recursion pattern for processing a `ReadonlyArray` to produce a new `ReadonlyArray`, often used for "chopping" up the input
 * `ReadonlyArray`. Typically chop is called with some function that will consume an initial prefix of the `ReadonlyArray` and produce a
 * value and the rest of the `ReadonlyArray`.
 *
 * @exampleTodo
 * import { Eq } from '@fp-ts/core/typeclass/typeclasses/Eq'
 * import * as N from '@fp-ts/core/typeclass/data/number'
 * import * as RA from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * const group = <A>(E: Eq<A>): ((as: ReadonlyArray<A>) => ReadonlyArray<ReadonlyArray<A>>) => {
 *   return RA.chop(as => pipe(as, RA.spanLeft(E.equals(as[0]))))
 * }
 * assert.deepStrictEqual(group(N.Eq)([1, 1, 2, 3, 3, 4]), [[1, 1], [2], [3, 3], [4]])
 *
 * @since 1.0.0
 */
export const chop = <A, B>(
  f: (as: NonEmptyReadonlyArray<A>) => readonly [B, ReadonlyArray<A>]
): ((as: ReadonlyArray<A>) => ReadonlyArray<B>) => {
  const g = nonEmptyReadonlyArray.chop(f)
  return (as) => (isNonEmpty(as) ? g(as) : empty)
}

/**
 * Splits a `ReadonlyArray` into two pieces, the first piece has max `n` elements.
 *
 * @exampleTodo
 * import { splitAt } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 *
 * assert.deepStrictEqual(splitAt(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4, 5]])
 *
 * @since 1.0.0
 */
export const splitAt = (n: number) =>
  <A>(as: ReadonlyArray<A>): readonly [ReadonlyArray<A>, ReadonlyArray<A>] =>
    n >= 1 && isNonEmpty(as) ?
      nonEmptyReadonlyArray.splitAt(n)(as) :
      isEmpty(as) ?
      [as, empty] :
      [empty, as]

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
 * @exampleTodo
 * import { chunksOf } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 *
 * assert.deepStrictEqual(chunksOf(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4], [5]])
 *
 * @since 1.0.0
 */
export const chunksOf = (
  n: number
): (<A>(as: ReadonlyArray<A>) => ReadonlyArray<NonEmptyReadonlyArray<A>>) => {
  const f = nonEmptyReadonlyArray.chunksOf(n)
  return (as) => (isNonEmpty(as) ? f(as) : empty)
}

/**
 * Creates a `ReadonlyArray` of unique values, in order, from all given `ReadonlyArray`s using a `Eq` for equality comparisons.
 *
 * @exampleTodo
 * import { union } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import * as N from '@fp-ts/core/typeclass/data/number'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * assert.deepStrictEqual(pipe([1, 2], union(N.Eq)([2, 3])), [1, 2, 3])
 *
 * @since 1.0.0
 */
export const union = <B>(that: ReadonlyArray<B>) =>
  <A>(self: ReadonlyArray<A>) =>
    isNonEmpty(self) && isNonEmpty(that) ?
      nonEmptyReadonlyArray.union(that)(self) :
      isNonEmpty(self) ?
      self :
      that

/**
 * Creates a `ReadonlyArray` of unique values that are included in all given `ReadonlyArray`s using a `Eq` for equality
 * comparisons. The order and references of result values are determined by the first `ReadonlyArray`.
 *
 * @exampleTodo
 * import { intersection } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import * as N from '@fp-ts/core/typeclass/data/number'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * assert.deepStrictEqual(pipe([1, 2], intersection(N.Eq)([2, 3])), [2])
 *
 * @since 1.0.0
 */
export const intersection = <A>(that: ReadonlyArray<A>) =>
  <B>(self: ReadonlyArray<B>): ReadonlyArray<A & B> => self.filter((a): a is A & B => elem(a)(that))

/**
 * Creates a `ReadonlyArray` of values not included in the other given `ReadonlyArray` using a `Eq` for equality
 * comparisons. The order and references of result values are determined by the first `ReadonlyArray`.
 *
 * @exampleTodo
 * import { difference } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import * as N from '@fp-ts/core/typeclass/data/number'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * assert.deepStrictEqual(pipe([1, 2], difference(N.Eq)([2, 3])), [1])
 *
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
export const of: <A>(a: A) => ReadonlyArray<A> = nonEmptyReadonlyArray.of

/**
 * @since 1.0.0
 */
export const empty: ReadonlyArray<never> = internal.empty

/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `ReadonlyArray` concatenates the inputs into a single array.
 *
 * @exampleTodo
 * import * as RA from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.orElse([4, 5])
 *   ),
 *   [1, 2, 3, 4, 5]
 * )
 *
 * @since 1.0.0
 */
export const orElse = <B>(that: ReadonlyArray<B>) =>
  <A>(self: ReadonlyArray<A>): ReadonlyArray<A | B> => (self as ReadonlyArray<A | B>).concat(that)

/**
 * Returns an effect whose success is mapped by the specified `f` function.
 *
 * @category mapping
 * @since 1.0.0
 */
export const map = <A, B>(f: (a: A) => B) =>
  (fa: ReadonlyArray<A>): ReadonlyArray<B> => fa.map((a) => f(a)) // <= intended eta expansion

/**
 * @category instances
 * @since 1.0.0
 */
export const Of: of_.Of<ReadonlyArrayTypeLambda> = {
  of
}

/**
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
 * @since 1.0.0
 */
export const tupled: <A>(self: ReadonlyArray<A>) => ReadonlyArray<readonly [A]> = invariant.tupled(
  Invariant
)

/**
 * @category do notation
 * @since 1.0.0
 */
export const bindTo: <N extends string>(
  name: N
) => <A>(self: ReadonlyArray<A>) => ReadonlyArray<{ readonly [K in N]: A }> = invariant.bindTo(
  Invariant
)

/**
 * @category instances
 * @since 1.0.0
 */
export const Covariant: covariant.Covariant<ReadonlyArrayTypeLambda> = {
  ...Invariant,
  map
}

/**
 * Returns the effect resulting from mapping the success of this effect to unit.
 *
 * @category mapping
 * @since 1.0.0
 */
export const asUnit: <_>(self: ReadonlyArray<_>) => ReadonlyArray<void> = covariant.asUnit(
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
 * @exampleTodo
 * import * as RA from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.flatMap((n) => [`a${n}`, `b${n}`])
 *   ),
 *   ['a1', 'b1', 'a2', 'b2', 'a3', 'b3']
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.flatMap(() => [])
 *   ),
 *   []
 * )
 *
 * @category sequencing
 * @since 1.0.0
 */
export const flatMap: <A, B>(
  f: (a: A) => ReadonlyArray<B>
) => (self: ReadonlyArray<A>) => ReadonlyArray<B> = (f) => flatMapWithIndex(f)

/**
 * @category instances
 * @since 1.0.0
 */
export const FlatMap: flatMap_.FlatMap<ReadonlyArrayTypeLambda> = {
  flatMap
}

/**
 * @since 1.0.0
 */
export const andThen: <B>(
  that: ReadonlyArray<B>
) => <_>(self: ReadonlyArray<_>) => ReadonlyArray<B> = flatMap_
  .andThen(FlatMap)

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
 * Sequences the specified effect after this effect, but ignores the value
 * produced by the effect.
 *
 * @category sequencing
 * @since 1.0.0
 */
export const andThenDiscard: <_>(
  that: ReadonlyArray<_>
) => <A>(self: ReadonlyArray<A>) => ReadonlyArray<A> = chainable
  .andThenDiscard(Chainable)

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
 * @since 1.0.0
 */
export const ap: <A>(
  fa: ReadonlyArray<A>
) => <B>(self: ReadonlyArray<(a: A) => B>) => ReadonlyArray<B> = (fa) =>
  (fb) => pipe(fb, flatMap((f) => pipe(fa, map((a) => f(a)))))

/**
 * @since 1.0.0
 */
export const flatMapWithIndex = <A, B>(f: (a: A, i: number) => ReadonlyArray<B>) =>
  (as: ReadonlyArray<A>): ReadonlyArray<B> => {
    if (isEmpty(as)) {
      return empty
    }
    const out: Array<B> = []
    for (let i = 0; i < as.length; i++) {
      out.push(...f(as[i], i))
    }
    return out
  }

/**
 * Removes one level of nesting
 *
 * @exampleTodo
 * import { flatten } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 *
 * assert.deepStrictEqual(flatten([[1], [2, 3], [4]]), [1, 2, 3, 4])
 *
 * @since 1.0.0
 */
export const flatten: <A>(mma: ReadonlyArray<ReadonlyArray<A>>) => ReadonlyArray<A> = flatMap(
  identity
)

/**
 * @since 1.0.0
 */
export const mapWithIndex = <A, B>(
  f: (a: A, i: number) => B
) => (self: ReadonlyArray<A>): ReadonlyArray<B> => self.map(f)

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterMapWithIndex = <A, B>(f: (a: A, i: number) => Option<B>) =>
  (self: Iterable<A>): ReadonlyArray<B> => {
    const as = internal.fromIterable(self)
    const out: Array<B> = []
    for (let i = 0; i < as.length; i++) {
      const o = f(as[i], i)
      if (internal.isSome(o)) {
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
export const compact: <A>(foa: ReadonlyArray<Option<A>>) => ReadonlyArray<A> = filterMap(identity)

/**
 * @category filtering
 * @since 1.0.0
 */
export const separate: <A, B>(
  fe: ReadonlyArray<Either<A, B>>
) => readonly [ReadonlyArray<A>, ReadonlyArray<B>] = <
  A,
  B
>(
  fa: ReadonlyArray<Either<A, B>>
) => {
  const left: Array<A> = []
  const right: Array<B> = []
  for (const e of fa) {
    if (either.isLeft(e)) {
      left.push(e.left)
    } else {
      right.push(e.right)
    }
  }
  return [left, right]
}

/**
 * @category filtering
 * @since 1.0.0
 */
export const partitionMap: <A, B, C>(
  f: (a: A) => Either<B, C>
) => (fa: ReadonlyArray<A>) => readonly [ReadonlyArray<B>, ReadonlyArray<C>] = (f) =>
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
 * @since 1.0.0
 */
export const extend: <A, B>(
  f: (fa: ReadonlyArray<A>) => B
) => (self: ReadonlyArray<A>) => ReadonlyArray<B> = (f) =>
  (wa) => wa.map((_, i, as) => f(as.slice(i)))

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
export const traverse = <F extends TypeLambda>(F: applicative.Applicative<F>) =>
  <A, R, O, E, B>(
    f: (a: A) => Kind<F, R, O, E, B>
  ): ((self: ReadonlyArray<A>) => Kind<F, R, O, E, ReadonlyArray<B>>) => traverseWithIndex(F)(f)

/**
 * @since 1.0.0
 */
export const unfold: <B, A>(b: B, f: (b: B) => Option<readonly [A, B]>) => ReadonlyArray<A> = <
  B,
  A
>(
  b: B,
  f: (b: B) => Option<readonly [A, B]>
) => {
  const out: Array<A> = []
  let next: B = b
  let o: Option<readonly [A, B]>
  while (internal.isSome(o = f(next))) {
    const [a, b] = o.value
    out.push(a)
    next = b
  }
  return out
}

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

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
    combineAll: (all) => S.combineMany(all)(empty),
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
 * @exampleTodo
 * import { getSemigroup } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * const S = getSemigroup<number>()
 * assert.deepStrictEqual(pipe([1, 2], S.combine([3, 4])), [1, 2, 3, 4])
 *
 * @category instances
 * @since 1.0.0
 */
export const getSemigroup = <A>(): Semigroup<ReadonlyArray<A>> => fromCombine(concat)

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
    combineAll: (all) => S.combineMany(all)(empty),
    empty
  })
}

/**
 * Derives an `Order` over the `ReadonlyArray` of a given element type from the `Order` of that type. The ordering between two such
 * `ReadonlyArray`s is equal to: the first non equal comparison of each `ReadonlyArray`s elements taken pairwise in increasing order, in
 * case of equality over all the pairwise elements; the longest `ReadonlyArray` is considered the greatest, if both `ReadonlyArray`s have
 * the same length, the result is equality.
 *
 * @exampleTodo
 * import { liftOrder } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import * as S from '@fp-ts/core/typeclass/data/string'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * const O = liftOrder(S.Order)
 * assert.strictEqual(pipe(['b'], O.compare(['a'])), 1)
 * assert.strictEqual(pipe(['a'], O.compare(['a'])), 0)
 * assert.strictEqual(pipe(['a'], O.compare(['b'])), -1)
 *
 * @category instances
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

/**
 * @category mapping
 * @since 1.0.0
 */
export const flap: <A>(a: A) => <B>(
  fab: ReadonlyArray<(a: A) => B>
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
export const NonEmptyProduct: nonEmptyProduct.NonEmptyProduct<ReadonlyArrayTypeLambda> = {
  ...Invariant,
  product,
  productMany
}

/**
 * @category instances
 * @since 1.0.0
 */
export const NonEmptyApplicative: nonEmptyApplicative.NonEmptyApplicative<ReadonlyArrayTypeLambda> =
  {
    ...NonEmptyProduct,
    ...Covariant
  }

/**
 * Lifts a binary function into `ReadonlyArray`.
 *
 * @category lifting
 * @since 1.0.0
 */
export const lift2: <A, B, C>(
  f: (a: A, b: B) => C
) => (fa: ReadonlyArray<A>, fb: ReadonlyArray<B>) => ReadonlyArray<C> = nonEmptyApplicative.lift2(
  NonEmptyApplicative
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
  nonEmptyApplicative.lift3(NonEmptyApplicative)

/**
 * @since 1.0.0
 */
export const liftSemigroup: <A>(S: Semigroup<A>) => Semigroup<ReadonlyArray<A>> =
  nonEmptyApplicative.liftSemigroup(
    NonEmptyApplicative
  )

/**
 * @category instances
 * @since 1.0.0
 */
export const Product: product_.Product<ReadonlyArrayTypeLambda> = {
  ...Of,
  ...NonEmptyProduct,
  productAll
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Applicative: applicative.Applicative<ReadonlyArrayTypeLambda> = {
  ...NonEmptyApplicative,
  ...Product
}

/**
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
 * Returns an effect that effectfully "peeks" at the success of this effect.
 *
 * @exampleTodo
 * import * as RA from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.tap(() => ['a', 'b'])
 *   ),
 *   [1, 1, 2, 2, 3, 3]
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     [1, 2, 3],
 *     RA.tap(() => [])
 *   ),
 *   []
 * )
 *
 * @since 1.0.0
 */
export const tap: <A, _>(
  f: (a: A) => ReadonlyArray<_>
) => (self: ReadonlyArray<A>) => ReadonlyArray<A> = chainable.tap(
  Chainable
)

/**
 * @category instances
 * @since 1.0.0
 */
export const Compactable: compactable.Compactable<ReadonlyArrayTypeLambda> = {
  compact
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Filterable: filterable.Filterable<ReadonlyArrayTypeLambda> = {
  filterMap
}

// TODO: perf
/**
 * @category filtering
 * @since 1.0.0
 */
export const filter: {
  <C extends A, B extends A, A = C>(
    refinement: Refinement<A, B>
  ): (fc: ReadonlyArray<C>) => ReadonlyArray<B>
  <B extends A, A = B>(predicate: Predicate<A>): (fb: ReadonlyArray<B>) => ReadonlyArray<B>
} = filterable.filter(Filterable)

/**
 * @category filtering
 * @since 1.0.0
 */
export const partition: {
  <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (
    fc: ReadonlyArray<C>
  ) => readonly [ReadonlyArray<C>, ReadonlyArray<B>]
  <B extends A, A = B>(
    predicate: Predicate<A>
  ): (fb: ReadonlyArray<B>) => readonly [ReadonlyArray<B>, ReadonlyArray<B>]
} = filterable.partition(Filterable)

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
  filterMapWithIndex((b, i) => (predicate(b, i) ? internal.some(b) : internal.none))

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
 * @category folding
 * @since 1.0.0
 */
export const reduce = <B, A>(b: B, f: (b: B, a: A) => B) =>
  (self: ReadonlyArray<A>): B => self.reduce((b, a) => f(b, a), b)

/**
 * @category folding
 * @since 1.0.0
 */
export const reduceRight = <B, A>(b: B, f: (b: B, a: A) => B) =>
  (self: ReadonlyArray<A>): B => self.reduceRight((b, a) => f(b, a), b)

/**
 * @category instances
 * @since 1.0.0
 */
export const Foldable: foldable.Foldable<ReadonlyArrayTypeLambda> = {
  reduce,
  reduceRight
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
export const reduceKind: <G extends TypeLambda>(
  G: monad.Monad<G>
) => <B, A, R, O, E>(
  b: B,
  f: (b: B, a: A) => Kind<G, R, O, E, B>
) => (self: ReadonlyArray<A>) => Kind<G, R, O, E, B> = foldable.reduceKind(
  Foldable
)

/**
 * @category folding
 * @since 1.0.0
 */
export const reduceRightKind: <G extends TypeLambda>(
  G: monad.Monad<G>
) => <B, A, R, O, E>(
  b: B,
  f: (b: B, a: A) => Kind<G, R, O, E, B>
) => (self: ReadonlyArray<A>) => Kind<G, R, O, E, B> = foldable
  .reduceRightKind(
    Foldable
  )

/**
 * @category folding
 * @since 1.0.0
 */
export const foldMapKind: <G extends TypeLambda>(
  G: Coproduct<G>
) => <A, R, O, E, B>(
  f: (a: A) => Kind<G, R, O, E, B>
) => (self: ReadonlyArray<A>) => Kind<G, R, O, E, B> = foldable.foldMapKind(
  Foldable
)

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
export const foldMapWithIndex = <M>(Monoid: Monoid<M>) =>
  <A>(f: (a: A, i: number) => M) =>
    (self: ReadonlyArray<A>): M =>
      self.reduce((m, a, i) => Monoid.combine(f(a, i))(m), Monoid.empty)

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
export const Traversable: traversable.Traversable<ReadonlyArrayTypeLambda> = {
  traverse
}

/**
 * @category traversing
 * @since 1.0.0
 */
export const sequence: <F extends TypeLambda>(
  F: applicative.Applicative<F>
) => <R, O, E, A>(
  fas: ReadonlyArray<Kind<F, R, O, E, A>>
) => Kind<F, R, O, E, ReadonlyArray<A>> = traversable.sequence(Traversable)

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
) => (wa: ReadonlyArray<A>) => Kind<F, R, O, E, readonly [ReadonlyArray<B>, ReadonlyArray<C>]> =
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
 * @exampleTodo
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 * import * as RA from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import * as T from '@fp-ts/core/typeclass/data/Async'
 *
 * const traverseFilter = RA.traverseFilter(T.MonoidalPar)
 * async function test() {
 *   assert.deepStrictEqual(
 *     await pipe(
 *       [-1, 2, 3],
 *       traverseFilter((n) => T.of(n > 0))
 *     )(),
 *     [2, 3]
 *   )
 * }
 * test()
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
 * @category instances
 * @since 1.0.0
 */
export const FromOption: fromOption_.FromOption<ReadonlyArrayTypeLambda> = {
  fromOption
}

/**
 * @category lifting
 * @since 1.0.0
 */
export const liftPredicate: {
  <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (c: C) => ReadonlyArray<B>
  <B extends A, A = B>(predicate: Predicate<A>): (b: B) => ReadonlyArray<B>
} = fromOption_.liftPredicate(FromOption)

/**
 * @category lifting
 * @since 1.0.0
 */
export const liftOption: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => Option<B>
) => (...a: A) => ReadonlyArray<B> = fromOption_.liftOption(FromOption)

/**
 * @category conversions
 * @since 1.0.0
 */
export const fromNullable: <A>(a: A) => ReadonlyArray<NonNullable<A>> = fromOption_.fromNullable(
  FromOption
)

/**
 * @category lifting
 * @since 1.0.0
 */
export const liftNullable: <A extends ReadonlyArray<unknown>, B>(
  f: (...a: A) => B | null | undefined
) => (...a: A) => ReadonlyArray<NonNullable<B>> = fromOption_.liftNullable(FromOption)

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapNullable: <A, B>(
  f: (a: A) => B | null | undefined
) => (ma: ReadonlyArray<A>) => ReadonlyArray<NonNullable<B>> = fromOption_.flatMapNullable(
  FromOption,
  FlatMap
)

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
 * @exampleTodo
 * import { every } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * const isPositive = (n: number): boolean => n > 0
 *
 * assert.deepStrictEqual(pipe([1, 2, 3], every(isPositive)), true)
 * assert.deepStrictEqual(pipe([1, 2, -3], every(isPositive)), false)
 *
 * @since 1.0.0
 */
export function every<A, B extends A>(
  refinement: Refinement<A, B>
): Refinement<ReadonlyArray<A>, ReadonlyArray<B>>
export function every<A>(predicate: Predicate<A>): Predicate<ReadonlyArray<A>>
export function every<A>(predicate: Predicate<A>): Predicate<ReadonlyArray<A>> {
  return (as) => as.every(predicate)
}

/**
 * Check if a predicate holds true for any `ReadonlyArray` member.
 *
 * @exampleTodo
 * import { some } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 * import { pipe } from '@fp-ts/core/typeclass/data/Function'
 *
 * const isPositive = (n: number): boolean => n > 0
 *
 * assert.deepStrictEqual(pipe([-1, -2, 3], some(isPositive)), true)
 * assert.deepStrictEqual(pipe([-1, -2, -3], some(isPositive)), false)
 *
 * @since 1.0.0
 */
export const some = <A>(predicate: Predicate<A>) =>
  (as: ReadonlyArray<A>): as is NonEmptyReadonlyArray<A> => as.some(predicate)

/**
 * Alias of [`some`](#some)
 *
 * @since 1.0.0
 */
export const exists = some

/**
 * Fold a data structure, accumulating values in some `Monoid`, combining adjacent elements
 * using the specified separator.
 *
 * @exampleTodo
 * import * as S from '@fp-ts/core/typeclass/data/string'
 * import { intercalate } from '@fp-ts/core/typeclass/data/ReadonlyArray'
 *
 * assert.deepStrictEqual(intercalate(S.Monoid)('-')(['a', 'b', 'c']), 'a-b-c')
 *
 * @since 1.0.0
 */
export const intercalate = <A>(M: Monoid<A>) =>
  (middle: A) =>
    (as: ReadonlyArray<A>): A => {
      let out = M.empty
      if (isNonEmpty(as)) {
        out = as[0]
        for (const a of as.slice(1)) {
          out = M.combineMany([middle, a])(out)
        }
      }
      return out
    }

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------

/**
 * @category do notation
 * @since 1.0.0
 */
export const Do: ReadonlyArray<{}> = of(internal.Do)

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
 * A variant of `bind` that sequentially ignores the scope.
 *
 * @category do notation
 * @since 1.0.0
 */
export const bindReadonlyArray: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  fb: ReadonlyArray<B>
) => (
  self: ReadonlyArray<A>
) => ReadonlyArray<{ readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }> = nonEmptyProduct
  .bindKind(
    NonEmptyProduct
  )

/**
 * @since 1.0.0
 */
export const productFlatten: <B>(
  fb: ReadonlyArray<B>
) => <A extends ReadonlyArray<unknown>>(
  self: ReadonlyArray<A>
) => ReadonlyArray<readonly [...A, B]> = nonEmptyProduct.productFlatten(NonEmptyProduct)
