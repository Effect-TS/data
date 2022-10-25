/**
 * ```ts
 * type Either<E, A> = Left<E> | Right<A>
 * ```
 *
 * Represents a value of one of two possible types (a disjoint union).
 *
 * An instance of `Either` is either an instance of `Left` or `Right`.
 *
 * A common use of `Either` is as an alternative to `Option` for dealing with possible missing values. In this usage,
 * `None` is replaced with a `Left` which can contain useful information. `Right` takes the place of `Some`. Convention
 * dictates that `Left` is used for Left and `Right` is used for Right.
 *
 * @since 1.0.0
 */
import * as bifunctor from "@fp-ts/core/Bifunctor"
import type * as extendable from "@fp-ts/core/Extendable"
import * as flatMap_ from "@fp-ts/core/FlatMap"
import * as functor from "@fp-ts/core/Functor"
import type { Kind, TypeLambda } from "@fp-ts/core/HKT"
import type * as monad from "@fp-ts/core/Monad"
import type { Monoid } from "@fp-ts/core/Monoid"
import type * as monoidal from "@fp-ts/core/Monoidal"
import type * as pointed from "@fp-ts/core/Pointed"
import type { Semigroup } from "@fp-ts/core/Semigroup"
import { fromCombine } from "@fp-ts/core/Semigroup"
import * as semigroupal from "@fp-ts/core/Semigroupal"
import * as traversable from "@fp-ts/core/Traversable"
import { equals } from "@fp-ts/data/Equal"
import { flow, identity, pipe, SK } from "@fp-ts/data/Function"
import * as internal from "@fp-ts/data/internal/Common"
import * as either from "@fp-ts/data/internal/Either"
import type { NonEmptyReadonlyArray } from "@fp-ts/data/NonEmptyReadonlyArray"
import type { Option } from "@fp-ts/data/Option"
import type { Predicate } from "@fp-ts/data/Predicate"
import { not } from "@fp-ts/data/Predicate"
import type { Refinement } from "@fp-ts/data/Refinement"
import type { Compactable } from "@fp-ts/data/typeclasses/Compactable"
import type * as filterable from "@fp-ts/data/typeclasses/Filterable"
import type { TraversableFilterable } from "@fp-ts/data/typeclasses/TraversableFilterable"

/**
 * @category models
 * @since 1.0.0
 */
export interface Left<E> {
  readonly _tag: "Left"
  readonly left: E
}

/**
 * @category models
 * @since 1.0.0
 */
export interface Right<A> {
  readonly _tag: "Right"
  readonly right: A
}

/**
 * @category models
 * @since 1.0.0
 */
export type Either<E, A> = Left<E> | Right<A>

// -------------------------------------------------------------------------------------
// type lambdas
// -------------------------------------------------------------------------------------

/**
 * @category type lambdas
 * @since 1.0.0
 */
export interface EitherTypeLambda extends TypeLambda {
  readonly type: Either<this["Out2"], this["Out1"]>
}

/**
 * @category type lambdas
 * @since 1.0.0
 */
export interface EitherTypeLambdaFix<E> extends TypeLambda {
  readonly type: Either<E, this["Out1"]>
}

/**
 * @category type lambdas
 * @since 1.0.0
 */
export interface ValidatedT<F extends TypeLambda, E> extends TypeLambda {
  readonly type: Kind<F, this["InOut1"], this["In1"], this["Out3"], E, this["Out1"]>
}

/**
 * Returns `true` if the specified value is an instance of `Either`, `false`
 * otherwise.
 *
 * @category guards
 * @since 1.0.0
 */
export const isEither: (u: unknown) => u is Either<unknown, unknown> = either.isEither

/**
 * Returns `true` if the either is an instance of `Left`, `false` otherwise.
 *
 * @category refinements
 * @since 1.0.0
 */
export const isLeft: <E, A>(self: Either<E, A>) => self is Left<E> = either.isLeft

/**
 * Returns `true` if the either is an instance of `Right`, `false` otherwise.
 *
 * @category refinements
 * @since 1.0.0
 */
export const isRight: <E, A>(self: Either<E, A>) => self is Right<A> = either.isRight

/**
 * Constructs a new `Either` holding a `Left` value. This usually represents a Left, due to the right-bias of this
 * structure.
 *
 * @category constructors
 * @since 1.0.0
 */
export const left: <E>(e: E) => Either<E, never> = either.left

/**
 * Constructs a new `Either` holding a `Right` value. This usually represents a Rightful value due to the right bias
 * of this structure.
 *
 * @category constructors
 * @since 1.0.0
 */
export const right: <A>(a: A) => Either<never, A> = either.right

// -------------------------------------------------------------------------------------
// pattern matching
// -------------------------------------------------------------------------------------

/**
 * Takes two functions and an `Either` value, if the value is a `Left` the inner value is applied to the first function,
 * if the value is a `Right` the inner value is applied to the second function.
 *
 * @example
 * import * as E from '@fp-ts/data/Either'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * const onError  = (errors: ReadonlyArray<string>): string => `Errors: ${errors.join(', ')}`
 *
 * const onRight = (value: number): string => `Ok: ${value}`
 *
 * assert.strictEqual(
 *   pipe(
 *     E.right(1),
 *     E.match(onError , onRight)
 *   ),
 *   'Ok: 1'
 * )
 * assert.strictEqual(
 *   pipe(
 *     E.left(['error 1', 'error 2']),
 *     E.match(onError , onRight)
 *   ),
 *   'Errors: error 1, error 2'
 * )
 *
 * @category pattern matching
 * @since 1.0.0
 */
export const match = <E, B, A, C = B>(onError: (e: E) => B, onRight: (a: A) => C) =>
  (self: Either<E, A>): B | C => isLeft(self) ? onError(self.left) : onRight(self.right)

/**
 * Returns the wrapped value if it's a `Right` or a default value if is a `Left`.
 *
 * @example
 * import * as E from '@fp-ts/data/Either'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(1),
 *     E.getOrElse(0)
 *   ),
 *   1
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.left('error'),
 *     E.getOrElse(0)
 *   ),
 *   0
 * )
 *
 * @category error handling
 * @since 1.0.0
 */
export const getOrElse = <B>(onError: B) =>
  <A>(self: Either<unknown, A>): A | B => isLeft(self) ? onError : self.right

/**
 * Takes a lazy default and a nullable value, if the value is not nully, turn it into a `Right`, if the value is nully use
 * the provided default as a `Left`.
 *
 * @example
 * import * as E from '@fp-ts/data/Either'
 *
 * const parse = E.fromNullable('nully')
 *
 * assert.deepStrictEqual(parse(1), E.right(1))
 * assert.deepStrictEqual(parse(null), E.left('nully'))
 *
 * @category conversions
 * @since 1.0.0
 */
export const fromNullable: <E>(onNullable: E) => <A>(a: A) => Either<E, NonNullable<A>> =
  either.fromNullable

/**
 * @category lifting
 * @since 1.0.0
 */
export const liftNullable = <A extends ReadonlyArray<unknown>, B, E>(
  f: (...a: A) => B | null | undefined,
  onNullable: E
) => {
  const from = fromNullable(onNullable)
  return (...a: A): Either<E, NonNullable<B>> => from(f(...a))
}

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapNullable = <A, B, E2>(
  f: (a: A) => B | null | undefined,
  onNullable: E2
): (<E1>(self: Either<E1, A>) => Either<E1 | E2, NonNullable<B>>) =>
  flatMap(liftNullable(f, onNullable))

/**
 * Constructs a new `Either` from a function that might throw.
 *
 * @example
 * import * as E from '@fp-ts/data/Either'
 * import { identity } from '@fp-ts/data/Function'
 *
 * const unsafeHead = <A>(as: ReadonlyArray<A>): A => {
 *   if (as.length > 0) {
 *     return as[0]
 *   } else {
 *     throw new Error('empty array')
 *   }
 * }
 *
 * const head = <A>(as: ReadonlyArray<A>): E.Either<unknown, A> =>
 *   E.fromThrowable(() => unsafeHead(as), identity)
 *
 * assert.deepStrictEqual(head([]), E.left(new Error('empty array')))
 * assert.deepStrictEqual(head([1, 2, 3]), E.right(1))
 *
 * @see {@link liftThrowable}
 * @category interop
 * @since 1.0.0
 */
export const fromThrowable = <A, E>(f: () => A, onThrow: (error: unknown) => E): Either<E, A> => {
  try {
    return right(f())
  } catch (e) {
    return left(onThrow(e))
  }
}

/**
 * Lifts a function that may throw to one returning a `Either`.
 *
 * @category interop
 * @since 1.0.0
 */
export const liftThrowable = <A extends ReadonlyArray<unknown>, B, E>(
  f: (...a: A) => B,
  onThrow: (error: unknown) => E
): ((...a: A) => Either<E, B>) => (...a) => fromThrowable(() => f(...a), onThrow)

/**
 * @category conversions
 * @since 1.0.0
 */
export const toUnion: <E, A>(fa: Either<E, A>) => E | A = match(identity, identity)

/**
 * @since 1.0.0
 */
export const reverse = <E, A>(ma: Either<E, A>): Either<A, E> =>
  isLeft(ma) ? right(ma.left) : left(ma.right)

/**
 * Recovers from all errors.
 *
 * @category error handling
 * @since 1.0.0
 */
export const catchAll: <E1, E2, B>(
  onError: (e: E1) => Either<E2, B>
) => <A>(self: Either<E1, A>) => Either<E2, A | B> = (onError) =>
  (self) => isLeft(self) ? onError(self.left) : self

/**
 * Returns an effect whose Left and Right channels have been mapped by
 * the specified pair of functions, `f` and `g`.
 *
 * @category mapping
 * @since 1.0.0
 */
export const mapBoth: <E, G, A, B>(
  f: (e: E) => G,
  g: (a: A) => B
) => (self: Either<E, A>) => Either<G, B> = (f, g) =>
  (fa) => isLeft(fa) ? left(f(fa.left)) : right(g(fa.right))

/**
 * Identifies an associative operation on a type constructor. It is similar to `Semigroup`, except that it applies to
 * types of kind `* -> *`.
 *
 * In case of `Either` returns the left-most non-`Left` value (or the right-most `Left` value if both values are `Left`).
 *
 * | x          | y          | pipe(x, orElse(y) |
 * | ---------- | ---------- | ------------------|
 * | left(a)    | left(b)    | left(b)           |
 * | left(a)    | right(2)   | right(2)          |
 * | right(1)   | left(b)    | right(1)          |
 * | right(1)   | right(2)   | right(1)          |
 *
 * @example
 * import * as E from '@fp-ts/data/Either'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     E.left('a'),
 *     E.orElse(E.left('b'))
 *   ),
 *   E.left('b')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.left('a'),
 *     E.orElse(E.right(2))
 *   ),
 *   E.right(2)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(1),
 *     E.orElse(E.left('b'))
 *   ),
 *   E.right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(1),
 *     E.orElse(E.right(2))
 *   ),
 *   E.right(1)
 * )
 *
 * @category error handling
 * @since 1.0.0
 */
export const orElse: <E2, B>(
  that: Either<E2, B>
) => <E1, A>(self: Either<E1, A>) => Either<E2, A | B> = (that) => (fa) => isLeft(fa) ? that : fa

/**
 * @since 1.0.0
 */
export const extend: <E, A, B>(f: (wa: Either<E, A>) => B) => (wa: Either<E, A>) => Either<E, B> = (
  f
) => (wa) => isLeft(wa) ? wa : right(f(wa))

/**
 * @since 1.0.0
 */
export const duplicate: <E, A>(ma: Either<E, A>) => Either<E, Either<E, A>> = extend(identity)

/**
 * Map each element of a structure to an action, evaluate these actions from left to right, and collect the Eithers.
 *
 * @example
 * import { pipe } from '@fp-ts/data/Function'
 * import * as RA from '@fp-ts/data/ReadonlyArray'
 * import * as E from '@fp-ts/data/Either'
 * import * as O from '@fp-ts/data/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(E.right(['a']), E.traverse(O.Monoidal)(RA.head)),
 *   O.some(E.right('a')),
 *  )
 *
 * assert.deepStrictEqual(
 *   pipe(E.right([]), E.traverse(O.Monoidal)(RA.head)),
 *   O.none,
 * )
 *
 * @category traversing
 * @since 1.0.0
 */
export const traverse = <F extends TypeLambda>(Monoidal: monoidal.Monoidal<F>) =>
  <A, FS, FR, FO, FE, B>(f: (a: A) => Kind<F, FS, FR, FO, FE, B>) =>
    <E>(ta: Either<E, A>): Kind<F, FS, FR, FO, FE, Either<E, B>> =>
      isLeft(ta) ? Monoidal.of(left(ta.left)) : pipe(f(ta.right), Monoidal.map(right))

/**
 * Semigroup returning the left-most non-`Left` value. If both operands are `Right`es then the inner values are
 * combined using the provided `Semigroup`.
 *
 * @example
 * import * as E from '@fp-ts/data/Either'
 * import * as N from '@fp-ts/data/Number'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * const S = E.getSemigroup(N.SemigroupSum)<string>()
 * assert.deepStrictEqual(pipe(E.left('a'), S.combine(E.left('b'))), E.left('a'))
 * assert.deepStrictEqual(pipe(E.left('a'), S.combine(E.right(2))), E.right(2))
 * assert.deepStrictEqual(pipe(E.right(1), S.combine(E.left('b'))), E.right(1))
 * assert.deepStrictEqual(pipe(E.right(1), S.combine(E.right(2))), E.right(3))
 *
 * @category instances
 * @since 1.0.0
 */
export const getSemigroup = <A>(Semigroup: Semigroup<A>) =>
  <E>(): Semigroup<Either<E, A>> =>
    fromCombine((that) =>
      (self) =>
        isLeft(that) ?
          self :
          isLeft(self) ?
          that :
          right(Semigroup.combine(that.right)(self.right))
    )

/**
 * @category filtering
 * @since 1.0.0
 */
export const compact: <E>(onNone: E) => <A>(self: Either<E, Option<A>>) => Either<E, A> = (e) =>
  (self) => isLeft(self) ? self : internal.isNone(self.right) ? left(e) : right(self.right.value)

/**
 * @category filtering
 * @since 1.0.0
 */
export const separate: <E>(
  onEmpty: E
) => <A, B>(self: Either<E, Either<A, B>>) => readonly [Either<E, A>, Either<E, B>] = (onEmpty) => {
  return (self) =>
    isLeft(self)
      ? [self, self]
      : isLeft(self.right)
      ? [right(self.right.left), left(onEmpty)]
      : [left(onEmpty), right(self.right.right)]
}

/**
 * @category instances
 * @since 1.0.0
 */
export const getCompactable = <E>(onNone: E): Compactable<ValidatedT<EitherTypeLambda, E>> => {
  return {
    compact: compact(onNone)
  }
}

/**
 * @category instances
 * @since 1.0.0
 */
export const getFilterable = <E>(
  onEmpty: E
): filterable.Filterable<ValidatedT<EitherTypeLambda, E>> => {
  return {
    filterMap: (f) => filterMap(f, onEmpty)
  }
}

/**
 * @category filtering
 * @since 1.0.0
 */
export const traverseFilterMap = <F extends TypeLambda>(
  Monoidal: monoidal.Monoidal<F>
) => {
  const traverse_ = traverse(Monoidal)
  return <A, S, R, O, FE, B, E>(
    f: (a: A) => Kind<F, S, R, O, FE, Option<B>>,
    onNone: E
  ): ((self: Either<E, A>) => Kind<F, S, R, O, FE, Either<E, B>>) => {
    return flow(traverse_(f), Monoidal.map(compact(onNone)))
  }
}

/**
 * @category filtering
 * @since 1.0.0
 */
export const traversePartitionMap = <F extends TypeLambda>(
  Monoidal: monoidal.Monoidal<F>
) => {
  const traverse_ = traverse(Monoidal)
  return <A, S, R, O, FE, B, C, E>(
    f: (a: A) => Kind<F, S, R, O, FE, Either<B, C>>,
    onNone: E
  ): ((self: Either<E, A>) => Kind<F, S, R, O, FE, readonly [Either<E, B>, Either<E, C>]>) => {
    return flow(traverse_(f), Monoidal.map(separate(onNone)))
  }
}

/**
 * @category instances
 * @since 1.0.0
 */
export const getTraversableFilterable = <E>(
  onEmpty: E
): TraversableFilterable<ValidatedT<EitherTypeLambda, E>> => {
  return {
    traverseFilterMap: (Monoidal) => {
      const traverseFilterMap_ = traverseFilterMap(Monoidal)
      return (f) => traverseFilterMap_(f, onEmpty)
    },
    traversePartitionMap: (Monoidal) => {
      const traversePartitionMap_ = traversePartitionMap(Monoidal)
      return (f) => traversePartitionMap_(f, onEmpty)
    }
  }
}

/**
 * @category instances
 * @since 1.0.0
 */
export const Bifunctor: bifunctor.Bifunctor<EitherTypeLambda> = {
  mapBoth
}

/**
 * Returns an effect with its error channel mapped using the specified
 * function. This can be used to lift a "smaller" error into a "larger" error.
 *
 * @category error handling
 * @since 1.0.0
 */
export const mapError: <E, G>(f: (e: E) => G) => <A>(self: Either<E, A>) => Either<G, A> = bifunctor
  .mapLeft(Bifunctor)

/**
 * Returns an effect whose Right is mapped by the specified `f` function.
 *
 * @category mapping
 * @since 1.0.0
 */
export const map: <A, B>(f: (a: A) => B) => <E>(fa: Either<E, A>) => Either<E, B> = bifunctor.map(
  Bifunctor
)

/**
 * @category instances
 * @since 1.0.0
 */
export const Functor: functor.Functor<EitherTypeLambda> = {
  map
}

/**
 * @category mapping
 * @since 1.0.0
 */
export const flap: <A>(a: A) => <E, B>(fab: Either<E, (a: A) => B>) => Either<E, B> = functor.flap(
  Functor
)

/**
 * Maps the Right value of this effect to the specified constant value.
 *
 * @category mapping
 * @since 1.0.0
 */
export const as: <B>(b: B) => <E>(self: Either<E, unknown>) => Either<E, B> = functor.as(Functor)

/**
 * Returns the effect Eithering from mapping the Right of this effect to unit.
 *
 * @category mapping
 * @since 1.0.0
 */
export const unit: <E>(self: Either<E, unknown>) => Either<E, void> = functor.unit(Functor)

/**
 * @category instances
 * @since 1.0.0
 */
export const Succeed: pointed.Pointed<EitherTypeLambda> = {
  of: right
}

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMap: <A, E2, B>(
  f: (a: A) => Either<E2, B>
) => <E1>(self: Either<E1, A>) => Either<E1 | E2, B> = (f) =>
  (self) => isLeft(self) ? self : f(self.right)

/**
 * The `flatten` function is the conventional monad join operator. It is used to remove one level of monadic structure, projecting its bound argument into the outer level.
 *
 * @example
 * import * as E from '@fp-ts/data/Either'
 *
 * assert.deepStrictEqual(E.flatten(E.right(E.right('a'))), E.right('a'))
 * assert.deepStrictEqual(E.flatten(E.right(E.left('e'))), E.left('e'))
 * assert.deepStrictEqual(E.flatten(E.left('e')), E.left('e'))
 *
 * @category sequencing
 * @since 1.0.0
 */
export const flatten: <E1, E2, A>(mma: Either<E1, Either<E2, A>>) => Either<E1 | E2, A> = flatMap(
  identity
)

/**
 * @category instances
 * @since 1.0.0
 */
export const FlatMap: flatMap_.FlatMap<EitherTypeLambda> = {
  map,
  flatMap
}

/**
 * Sequences the specified effect after this effect, but ignores the value
 * produced by the effect.
 *
 * @category sequencing
 * @since 1.0.0
 */
export const zipLeft: <E2>(
  that: Either<E2, unknown>
) => <E1, A>(self: Either<E1, A>) => Either<E2 | E1, A> = flatMap_.zipLeft(FlatMap)

/**
 * A variant of `flatMap` that ignores the value produced by this effect.
 *
 * @category sequencing
 * @since 1.0.0
 */
export const zipRight: <E2, A>(
  that: Either<E2, A>
) => <E1>(self: Either<E1, unknown>) => Either<E2 | E1, A> = flatMap_.zipRight(FlatMap)

/**
 * Sequentially zips this effect with the specified effect using the specified combiner function.
 *
 * @category tuple sequencing
 * @since 1.0.0
 */
export const zipWith: <E2, B, A, C>(
  that: Either<E2, B>,
  f: (a: A, b: B) => C
) => <E1>(self: Either<E1, A>) => Either<E2 | E1, C> = (that, f) =>
  (self) => pipe(self, flatMap((a) => pipe(that, map((b) => f(a, b)))))

/**
 * @category instances
 * @since 1.0.0
 */
export const Semigroupal: semigroupal.Semigroupal<EitherTypeLambda> = {
  map,
  zipWith,
  zipMany: <E, A>(
    others: Iterable<Either<E, A>>
  ) =>
    (start: Either<E, A>): Either<E, [A, ...Array<A>]> => {
      if (isLeft(start)) {
        return left(start.left)
      }
      const res: [A, ...Array<A>] = [start.right]
      for (const o of others) {
        if (isLeft(o)) {
          return left(o.left)
        }
        res.push(o.right)
      }
      return right(res)
    }
}

/**
 * @since 1.0.0
 */
export const ap: <E2, A>(
  fa: Either<E2, A>
) => <E1, B>(fab: Either<E1, (a: A) => B>) => Either<E1 | E2, B> = semigroupal.ap(Semigroupal)

/**
 * Lifts a binary function into `Either`.
 *
 * @category lifting
 * @since 1.0.0
 */
export const lift2: <A, B, C>(
  f: (a: A, b: B) => C
) => <E1, E2>(fa: Either<E1, A>, fb: Either<E2, B>) => Either<E1 | E2, C> = semigroupal.lift2(
  Semigroupal
)

/**
 * Lifts a ternary function into `Either`.
 *
 * @category lifting
 * @since 1.0.0
 */
export const lift3: <A, B, C, D>(
  f: (a: A, b: B, c: C) => D
) => <E1, E2, E3>(
  fa: Either<E1, A>,
  fb: Either<E2, B>,
  fc: Either<E3, C>
) => Either<E1 | E2 | E3, D> = semigroupal.lift3(Semigroupal)

/**
 * @category instances
 * @since 1.0.0
 */
export const Monoidal: monoidal.Monoidal<EitherTypeLambda> = {
  map,
  of: right,
  zipMany: Semigroupal.zipMany,
  zipWith: Semigroupal.zipWith,
  zipAll: <E, A>(collection: Iterable<Either<E, A>>): Either<E, ReadonlyArray<A>> => {
    const res: Array<A> = []
    for (const o of collection) {
      if (isLeft(o)) {
        return left(o.left)
      }
      res.push(o.right)
    }
    return right(res)
  }
}

/**
 * The default [`Monoidal`](#monoidal) instance returns the first error, if you want to
 * get all errors you need to provide a way to combine them via a `Semigroup`.
 *
 * @example
 * import * as A from '@fp-ts/core/Semigroupal'
 * import * as E from '@fp-ts/data/Either'
 * import { pipe } from '@fp-ts/data/Function'
 * import * as S from '@fp-ts/core/Semigroup'
 * import * as string from '@fp-ts/data/String'
 *
 * const parseString = (u: unknown): E.Either<string, string> =>
 *   typeof u === 'string' ? E.right(u) : E.left('not a string')
 *
 * const parseNumber = (u: unknown): E.Either<string, number> =>
 *   typeof u === 'number' ? E.right(u) : E.left('not a number')
 *
 * interface Person {
 *   readonly name: string
 *   readonly age: number
 * }
 *
 * const parsePerson = (
 *   input: Record<string, unknown>
 * ): E.Either<string, Person> =>
 *   pipe(
 *     E.Do,
 *     E.bindRight('name', parseString(input.name)),
 *     E.bindRight('age', parseNumber(input.age))
 *   )
 *
 * assert.deepStrictEqual(parsePerson({}), E.left('not a string')) // <= first error
 *
 * const Monoidal = E.getValidatedMonoidal(
 *   pipe(string.Semigroup, S.intercalate(', '))
 * )
 *
 * const bindRight = A.bindRight(Monoidal)
 *
 * const parsePersonAll = (
 *   input: Record<string, unknown>
 * ): E.Either<string, Person> =>
 *   pipe(
 *     E.Do,
 *     bindRight('name', parseString(input.name)),
 *     bindRight('age', parseNumber(input.age))
 *   )
 *
 * assert.deepStrictEqual(parsePersonAll({}), E.left('not a string, not a number')) // <= all errors
 *
 * @category error handling
 * @since 1.0.0
 */
export const getValidatedMonoidal = <E>(
  Semigroup: Semigroup<E>
): monoidal.Monoidal<ValidatedT<EitherTypeLambda, E>> => ({
  map,
  of: right,
  zipWith: <A, B, C>(
    fb: Either<E, B>,
    f: (a: A, b: B) => C
  ) =>
    (fa: Either<E, A>): Either<E, C> => {
      if (isLeft(fa)) {
        if (isLeft(fb)) {
          return left(Semigroup.combine(fb.left)(fa.left))
        } else {
          return left(fa.left)
        }
      } else if (isLeft(fb)) {
        return left(fb.left)
      }
      return right(f(fa.right, fb.right))
    },
  zipMany: <A>(
    others: Iterable<Either<E, A>>
  ) =>
    (start: Either<E, A>): Either<E, [A, ...Array<A>]> => {
      const Lefts: Array<E> = []
      const res: Array<A> = []
      if (isLeft(start)) {
        Lefts.push(start.left)
      } else {
        res.push(start.right)
      }
      for (const o of others) {
        if (isLeft(o)) {
          Lefts.push(o.left)
        } else {
          res.push(o.right)
        }
      }
      if (Lefts.length > 0) {
        if (Lefts.length > 1) {
          return left(Semigroup.combineMany((Lefts.shift(), Lefts))(Lefts[0]))
        }
        return left(Lefts[0])
      }
      return right(res as [A, ...Array<A>])
    },
  zipAll: <A>(collection: Iterable<Either<E, A>>): Either<E, ReadonlyArray<A>> => {
    const Lefts: Array<E> = []
    const res: Array<A> = []
    for (const o of collection) {
      if (isLeft(o)) {
        Lefts.push(o.left)
      } else {
        res.push(o.right)
      }
    }
    if (Lefts.length > 0) {
      if (Lefts.length > 1) {
        return left(Semigroup.combineMany((Lefts.shift(), Lefts))(Lefts[0]))
      }
      return left(Lefts[0])
    }
    return right(res as [A, ...Array<A>])
  }
})

/**
 * @category instances
 * @since 1.0.0
 */
export const Monad: monad.Monad<EitherTypeLambda> = {
  map,
  of: right,
  flatMap
}

/**
 * Returns an effect that effectfully "peeks" at the Left of this effect.
 *
 * @category error handling
 * @since 1.0.0
 */
export const tapError: <E1, E2>(
  onError: (e: E1) => Either<E2, unknown>
) => <A>(self: Either<E1, A>) => Either<E1 | E2, A> = (onError) =>
  (self) => {
    if (isRight(self)) {
      return self
    }
    const out = onError(self.left)
    return isLeft(out) ? out : self
  }

/**
 * Returns an effect that effectfully "peeks" at the Right of this effect.
 *
 * @since 1.0.0
 */
export const tap: <A, E2>(
  f: (a: A) => Either<E2, unknown>
) => <E1>(self: Either<E1, A>) => Either<E1 | E2, A> = flatMap_.tap(FlatMap)

/**
 * @category conversions
 * @since 1.0.0
 */
export const toReadonlyArray = <E, A>(self: Either<E, A>): ReadonlyArray<A> =>
  isLeft(self) ? internal.empty : [self.right]

/**
 * @category folding
 * @since 1.0.0
 */
export const reduce = <B, A>(b: B, f: (b: B, a: A) => B) =>
  <E>(self: Either<E, A>): B => isLeft(self) ? b : f(b, self.right)

/**
 * @category folding
 * @since 1.0.0
 */
export const foldMap = <M>(Monoid: Monoid<M>) =>
  <A>(f: (a: A) => M) => <E>(self: Either<E, A>): M => isLeft(self) ? Monoid.empty : f(self.right)

/**
 * @category folding
 * @since 1.0.0
 */
export const reduceRight = <B, A>(b: B, f: (a: A, b: B) => B) =>
  <E>(self: Either<E, A>): B => isLeft(self) ? b : f(self.right, b)

/**
 * @category instances
 * @since 1.0.0
 */
export const Traversable: traversable.Traversable<EitherTypeLambda> = {
  traverse
}

/**
 * @category traversing
 * @since 1.0.0
 */
export const sequence: <F extends TypeLambda>(
  F: monoidal.Monoidal<F>
) => <E, FS, FR, FO, FE, A>(
  fa: Either<E, Kind<F, FS, FR, FO, FE, A>>
) => Kind<F, FS, FR, FO, FE, Either<E, A>> = traversable.sequence(Traversable)

/**
 * @category instances
 * @since 1.0.0
 */
export const Extendable: extendable.Extendable<EitherTypeLambda> = {
  map,
  extend
}

/**
 * @example
 * import * as E from '@fp-ts/data/Either'
 * import { pipe } from '@fp-ts/data/Function'
 * import * as O from '@fp-ts/data/Option'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     O.some(1),
 *     E.fromOption('error')
 *   ),
 *   E.right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     O.none,
 *     E.fromOption('error')
 *   ),
 *   E.left('error')
 * )
 *
 * @category conversions
 * @since 1.0.0
 */
export const fromOption: <E>(onNone: E) => <A>(fa: Option<A>) => Either<E, A> = either.fromOption

/**
 * Converts a `Either` to an `Option` discarding the Right.
 *
 * @example
 * import * as O from '@fp-ts/data/Option'
 * import * as E from '@fp-ts/data/Either'
 *
 * assert.deepStrictEqual(E.getLeft(E.right('ok')), O.none)
 * assert.deepStrictEqual(E.getLeft(E.left('err')), O.some('err'))
 *
 * @category conversions
 * @since 1.0.0
 */
export const getLeft: <E, A>(self: Either<E, A>) => Option<E> = either.getLeft

/**
 * Converts a `Either` to an `Option` discarding the error.
 *
 * @example
 * import * as O from '@fp-ts/data/Option'
 * import * as E from '@fp-ts/data/Either'
 *
 * assert.deepStrictEqual(E.getRight(E.right('ok')), O.some('ok'))
 * assert.deepStrictEqual(E.getRight(E.left('err')), O.none)
 *
 * @category conversions
 * @since 1.0.0
 */
export const getRight: <E, A>(self: Either<E, A>) => Option<A> = either.getRight

/**
 * @category conversions
 * @since 1.0.0
 */
export const toNull: <E, A>(self: Either<E, A>) => A | null = getOrElse(null)

/**
 * @category conversions
 * @since 1.0.0
 */
export const toUndefined: <E, A>(self: Either<E, A>) => A | undefined = getOrElse(undefined)

/**
 * @example
 * import { liftPredicate, left, right } from '@fp-ts/data/Either'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     1,
 *     liftPredicate((n) => n > 0, 'error')
 *   ),
 *   right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     -1,
 *     liftPredicate((n) => n > 0, 'error')
 *   ),
 *   left('error')
 * )
 *
 * @category lifting
 * @since 1.0.0
 */
export const liftPredicate: {
  <C extends A, B extends A, E, A = C>(
    refinement: Refinement<A, B>,
    onFalse: E
  ): (c: C) => Either<E, B>
  <B extends A, E, A = B>(predicate: Predicate<A>, onFalse: E): (b: B) => Either<E, B>
} = <B extends A, E, A = B>(predicate: Predicate<A>, onFalse: E) =>
  (b: B) => predicate(b) ? right(b) : left(onFalse)

/**
 * @category lifting
 * @since 1.0.0
 */
export const liftOption = <A extends ReadonlyArray<unknown>, B, E>(
  f: (...a: A) => Option<B>,
  onNone: E
) => (...a: A): Either<E, B> => fromOption(onNone)(f(...a))

/**
 * @example
 * import * as E from '@fp-ts/data/Either'
 * import { pipe } from '@fp-ts/data/Function'
 *
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(1),
 *     E.filter((n) => n > 0, 'error')
 *   ),
 *   E.right(1)
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.right(-1),
 *     E.filter((n) => n > 0, 'error')
 *   ),
 *   E.left('error')
 * )
 * assert.deepStrictEqual(
 *   pipe(
 *     E.left('a'),
 *     E.filter((n) => n > 0, 'error')
 *   ),
 *   E.left('a')
 * )
 *
 * @category filtering
 * @since 1.0.0
 */
export const filter: {
  <C extends A, B extends A, E2, A = C>(refinement: Refinement<A, B>, onFalse: E2): <E1>(
    self: Either<E1, C>
  ) => Either<E2 | E1, B>
  <B extends A, E2, A = B>(
    predicate: Predicate<A>,
    onFalse: E2
  ): <E1>(self: Either<E1, B>) => Either<E2 | E1, B>
} = <B extends A, E2, A = B>(
  predicate: Predicate<A>,
  onFalse: E2
) =>
  <E1>(self: Either<E1, B>) => pipe(self, flatMap((b) => predicate(b) ? right(b) : left(onFalse)))

/**
 * @category filtering
 * @since 1.0.0
 */
export const filterMap = <A, B, E>(
  f: (a: A) => Option<B>,
  onNone: E
) =>
  (self: Either<E, A>): Either<E, B> =>
    pipe(
      self,
      flatMap((a) => {
        const ob = f(a)
        return internal.isNone(ob) ? left(onNone) : right(ob.value)
      })
    )

/**
 * @category filtering
 * @since 1.0.0
 */
export const partition: {
  <C extends A, B extends A, E, A = C>(refinement: Refinement<A, B>, onFalse: E): (
    self: Either<E, C>
  ) => readonly [Either<E, C>, Either<E, B>]
  <B extends A, E, A = B>(predicate: Predicate<A>, onFalse: E): (
    self: Either<E, B>
  ) => readonly [Either<E, B>, Either<E, B>]
} = <B extends A, E, A = B>(predicate: Predicate<A>, onFalse: E) =>
  (
    self: Either<E, B>
  ): readonly [Either<E, B>, Either<E, B>] => [
    pipe(self, filter(not(predicate), onFalse)),
    pipe(self, filter(predicate, onFalse))
  ]

/**
 * @category filtering
 * @since 1.0.0
 */
export const partitionMap = <A, B, C, E>(
  f: (a: A) => Either<B, C>,
  onEmpty: E
) =>
  (self: Either<E, A>): readonly [Either<E, B>, Either<E, C>] => [
    pipe(self, filterMap(flow(f, getLeft), onEmpty)),
    pipe(self, filterMap(flow(f, getRight), onEmpty))
  ]

/**
 * @category sequencing
 * @since 1.0.0
 */
export const flatMapOption = <A, B, E2>(
  f: (a: A) => Option<B>,
  onNone: E2
) => <E1>(self: Either<E1, A>): Either<E2 | E1, B> => pipe(self, flatMap(liftOption(f, onNone)))

/**
 * Tests whether a value is a member of a `Either`.
 *
 * @since 1.0.0
 */
export const elem = <B>(a: B) =>
  <A, E>(ma: Either<E, A>): boolean => isLeft(ma) ? false : equals(ma.right)(a)

/**
 * Returns `false` if `Left` or returns the Either of the application of the given predicate to the `Right` value.
 *
 * @example
 * import * as E from '@fp-ts/data/Either'
 *
 * const f = E.exists((n: number) => n > 2)
 *
 * assert.strictEqual(f(E.left('a')), false)
 * assert.strictEqual(f(E.right(1)), false)
 * assert.strictEqual(f(E.right(3)), true)
 *
 * @since 1.0.0
 */
export const exists = <A>(predicate: Predicate<A>) =>
  (ma: Either<unknown, A>): boolean => isLeft(ma) ? false : predicate(ma.right)

// -------------------------------------------------------------------------------------
// do notation
// -------------------------------------------------------------------------------------

/**
 * @category do notation
 * @since 1.0.0
 */
export const Do: Either<never, {}> = right(internal.Do)

/**
 * @category do notation
 * @since 1.0.0
 */
export const bindTo: <N extends string>(
  name: N
) => <E, A>(self: Either<E, A>) => Either<E, { readonly [K in N]: A }> = functor.bindTo(Functor)

const let_: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => <E>(
  self: Either<E, A>
) => Either<E, { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }> = functor.let(Functor)

export {
  /**
   * @category do notation
   * @since 1.0.0
   */
  let_ as let
}

/**
 * @category do notation
 * @since 1.0.0
 */
export const bind: <N extends string, A extends object, E2, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => Either<E2, B>
) => <E1>(
  self: Either<E1, A>
) => Either<E1 | E2, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }> = flatMap_
  .bind(FlatMap)

/**
 * A variant of `bind` that sequentially ignores the scope.
 *
 * @category do notation
 * @since 1.0.0
 */
export const bindRight: <N extends string, A extends object, E2, B>(
  name: Exclude<N, keyof A>,
  fb: Either<E2, B>
) => <E1>(
  self: Either<E1, A>
) => Either<E1 | E2, { readonly [K in keyof A | N]: K extends keyof A ? A[K] : B }> = semigroupal
  .bindRight(Semigroupal)

// -------------------------------------------------------------------------------------
// tuple sequencing
// -------------------------------------------------------------------------------------

/**
 * @category tuple sequencing
 * @since 1.0.0
 */
export const Zip: Either<never, readonly []> = right(internal.empty)

/**
 * @category tuple sequencing
 * @since 1.0.0
 */
export const tupled: <E, A>(self: Either<E, A>) => Either<E, readonly [A]> = functor.tupled(Functor)

/**
 * Sequentially zips this effect with the specified effect.
 *
 * @category tuple sequencing
 * @since 1.0.0
 */
export const zipFlatten: <E2, B>(
  fb: Either<E2, B>
) => <E1, A extends ReadonlyArray<unknown>>(
  self: Either<E1, A>
) => Either<E1 | E2, readonly [...A, B]> = semigroupal.zipFlatten(Semigroupal)

// -------------------------------------------------------------------------------------
// array utils
// -------------------------------------------------------------------------------------

/**
 * Equivalent to `NonEmptyReadonlyArray#traverseWithIndex(Semigroupal)`.
 *
 * @category traversing
 * @since 1.0.0
 */
export const traverseNonEmptyReadonlyArrayWithIndex = <A, E, B>(
  f: (index: number, a: A) => Either<E, B>
) =>
  (as: NonEmptyReadonlyArray<A>): Either<E, NonEmptyReadonlyArray<B>> => {
    const e = f(0, internal.head(as))
    if (isLeft(e)) {
      return e
    }
    const out: internal.NonEmptyArray<B> = [e.right]
    for (let i = 1; i < as.length; i++) {
      const e = f(i, as[i])
      if (isLeft(e)) {
        return e
      }
      out.push(e.right)
    }
    return right(out)
  }

/**
 * Equivalent to `ReadonlyArray#traverseWithIndex(Monoidal)`.
 *
 * @category traversing
 * @since 1.0.0
 */
export const traverseReadonlyArrayWithIndex = <A, E, B>(
  f: (index: number, a: A) => Either<E, B>
): ((as: ReadonlyArray<A>) => Either<E, ReadonlyArray<B>>) => {
  const g = traverseNonEmptyReadonlyArrayWithIndex(f)
  return (as) => (internal.isNonEmpty(as) ? g(as) : Zip)
}

/**
 * Equivalent to `NonEmptyReadonlyArray#traverse(Semigroupal)`.
 *
 * @category traversing
 * @since 1.0.0
 */
export const traverseNonEmptyReadonlyArray = <A, E, B>(
  f: (a: A) => Either<E, B>
): ((as: NonEmptyReadonlyArray<A>) => Either<E, NonEmptyReadonlyArray<B>>) => {
  return traverseNonEmptyReadonlyArrayWithIndex(flow(SK, f))
}

/**
 * Equivalent to `ReadonlyArray#traverse(Monoidal)`.
 *
 * @category traversing
 * @since 1.0.0
 */
export const traverseReadonlyArray = <A, E, B>(
  f: (a: A) => Either<E, B>
): ((as: ReadonlyArray<A>) => Either<E, ReadonlyArray<B>>) => {
  return traverseReadonlyArrayWithIndex(flow(SK, f))
}

/**
 * Equivalent to `ReadonlyArray#sequence(Monoidal)`.
 *
 * @category traversing
 * @since 1.0.0
 */
export const sequenceReadonlyArray: <E, A>(
  arr: ReadonlyArray<Either<E, A>>
) => Either<E, ReadonlyArray<A>> = traverseReadonlyArray(identity)
