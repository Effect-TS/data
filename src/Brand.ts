/**
 * @since 1.0.0
 */
import * as Either from "@fp-ts/core/Either"
import { identity, pipe } from "@fp-ts/core/Function"
import * as Option from "@fp-ts/core/Option"
import type { Predicate, Refinement } from "@fp-ts/core/Predicate"
import * as ReadonlyArray from "@fp-ts/core/ReadonlyArray"

/**
 * @since 1.0.0
 * @category symbols
 */
export const BrandTypeId: unique symbol = Symbol.for("@effect/data/Brand")

/**
 * @since 1.0.0
 * @category symbols
 */
export type BrandTypeId = typeof BrandTypeId

/**
 * @since 1.0.0
 * @category symbols
 */
export const NominalConstructorTypeId: unique symbol = Symbol.for("@effect/data/Brand/Nominal")

/**
 * @since 1.0.0
 * @category symbols
 */
export type NominalConstructorTypeId = typeof NominalConstructorTypeId

/**
 * @since 1.0.0
 * @category symbols
 */
export const RefinedConstructorsTypeId: unique symbol = Symbol.for("@effect/data/Brand/Refined")

/**
 * @since 1.0.0
 * @category symbols
 */
export type RefinedConstructorsTypeId = typeof RefinedConstructorsTypeId

/**
 * @since 1.0.0
 * @category models
 */
export interface Brand<in out K extends string> {
  readonly [BrandTypeId]: {
    readonly [k in K]: K
  }
}

/**
 * @since 1.0.0
 */
export declare namespace Brand {
  /**
   * @since 1.0.0
   * @category models
   */
  export interface BrandErrors extends ReadonlyArray<RefinementError> {}

  /**
   * @since 1.0.0
   * @category models
   */
  export interface RefinementError {
    readonly meta: unknown
    readonly message: string
  }

  /**
   * @since 1.0.0
   * @category models
   */
  export type Constructor<A extends Brand<any>> =
    | Brand.NominalConstructor<A>
    | Brand.RefinedConstructors<A>

  /**
   * @since 1.0.0
   * @category models
   */
  export interface NominalConstructor<in out A extends Brand<any>> {
    readonly [NominalConstructorTypeId]: NominalConstructorTypeId
    /**
     * Constructs a branded type from a value of type `A`.
     */
    (args: Omit<Brand.Unbranded<A>, BrandTypeId>): A
  }

  /**
   * @since 1.0.0
   * @category models
   */
  export interface RefinedConstructors<in out A extends Brand<any>> {
    readonly [RefinedConstructorsTypeId]: RefinedConstructorsTypeId
    /**
     * Constructs a branded type from a value of type `A`, throwing an error if
     * the provided `A` is not valid.
     */
    of: (args: Brand.Unbranded<A>) => A
    /**
     * Constructs a branded type from a value of type `A`, returning `Some<A>`
     * if the provided `A` is valid, `None` otherwise.
     */
    option: (args: Brand.Unbranded<A>) => Option.Option<A>
    /**
     * Constructs a branded type from a value of type `A`, returning `Right<A>`
     * if the provided `A` is valid, `Left<BrandError>` otherwise.
     */
    either: (args: Brand.Unbranded<A>) => Either.Either<Brand.BrandErrors, A>
    /**
     * Attempts to refine the provided value of type `A`, returning `true` if
     * the provided `A` is valid, `false` otherwise.
     */
    refine: Refinement<Brand.Unbranded<A>, Brand.Unbranded<A> & A>
  }

  /**
   * A utility type to extract a branded type from a `Brand.Constructor`.
   *
   * @since 1.0.0
   * @category models
   */
  export type FromConstructor<A> = A extends Brand.Constructor<infer B> ? B : never

  /**
   * A utility type to extract the value type from a brand.
   *
   * @since 1.0.0
   * @category models
   */
  export type Unbranded<P> = P extends infer Q & Brands<P> ? Q : P

  /**
   * A utility type to extract the brands from a branded type.
   *
   * @since 1.0.0
   * @category models
   */
  export type Brands<P> = P extends Brand<any> ? Brand.UnionToIntersection<
    {
      [k in keyof P[BrandTypeId]]: k extends string ? Brand<k>
        : never
    }[keyof P[BrandTypeId]]
  >
    : never

  /**
   * @since 1.0.0
   * @category models
   */
  export type EnsureCommonBase<
    Brands extends readonly [Brand.Constructor<any>, ...Array<Brand.Constructor<any>>]
  > = {
    [B in keyof Brands]: Brand.Unbranded<Brand.FromConstructor<Brands[0]>> extends
      Brand.Unbranded<Brand.FromConstructor<Brands[B]>>
      ? Brand.Unbranded<Brand.FromConstructor<Brands[B]>> extends Brand.Unbranded<Brand.FromConstructor<Brands[0]>>
        ? Brands[B]
      : Brands[B]
      : "ERROR: All brands should have the same base type"
  }

  /**
   * @since 1.0.0
   * @category models
   */
  export type UnionToIntersection<T> = (T extends any ? (x: T) => any : never) extends (x: infer R) => any ? R
    : never
}

/**
 * @since 1.0.0
 * @category constructors
 */
export const error = (message: string, meta?: unknown): Brand.BrandErrors => [{
  message,
  meta
}]

/**
 * @since 1.0.0
 * @category constructors
 */
export const errors = (...errors: Array<Brand.BrandErrors>): Brand.BrandErrors => ReadonlyArray.flatten(errors)

/**
 * Returns `true` if the provided `Brand` is nominal, `false` otherwise.
 *
 * @since 1.0.0
 * @category refinements
 */
export const isNominal = <A extends Brand<any>>(
  u: Brand.Constructor<A>
): u is Brand.NominalConstructor<A> => NominalConstructorTypeId in u

/**
 * Returns `true` if the provided `Brand` is refined, `false` otherwise.
 *
 * @since 1.0.0
 * @category refinements
 */
export const isRefined = <A extends Brand<any>>(
  u: Brand.Constructor<A>
): u is Brand.RefinedConstructors<A> => RefinedConstructorsTypeId in u

/**
 * @since 1.0.0
 * @category constructors
 */
export const nominal = <A extends Brand<any>>(): Brand.NominalConstructor<A> =>
  // @ts-expect-error
  Object.assign((args) => args, {
    [NominalConstructorTypeId]: NominalConstructorTypeId
  })

/**
 * @since 1.0.0
 * @category constructors
 */
export const refined = <A extends Brand<any>>(
  refinement: Predicate<Brand.Unbranded<A>>,
  onFailure: (a: Brand.Unbranded<A>) => Brand.BrandErrors
): Brand.RefinedConstructors<A> => {
  const either = (args: Brand.Unbranded<A>): Either.Either<Brand.BrandErrors, A> =>
    refinement(args) ? Either.right(args as A) : Either.left(onFailure(args))
  return {
    [RefinedConstructorsTypeId]: RefinedConstructorsTypeId,
    of: (args) => pipe(either(args), Either.getOrThrow(identity)),
    option: (args) => Option.fromEither(either(args)),
    either,
    refine: (args): args is Brand.Unbranded<A> & A => Either.isRight(either(args))
  }
}

/**
 * Composes two brands together to form a single branded type.
 *
 * @since 1.0.0
 * @category mutations
 */
export const all = <
  Brands extends readonly [Brand.Constructor<any>, ...Array<Brand.Constructor<any>>]
>(...brands: Brand.EnsureCommonBase<Brands>): Brand.RefinedConstructors<
  Brand.UnionToIntersection<
    {
      [B in keyof Brands]: Brand.FromConstructor<Brands[B]>
    }[number]
  > extends infer X extends Brand<any> ? X : Brand<any>
> => {
  const either = (args: any): Either.Either<Brand.BrandErrors, any> => {
    let result: Either.Either<Brand.BrandErrors, any> = Either.right(args)
    for (const brand of brands) {
      if (isRefined(brand)) {
        const nextResult = brand.either(args)
        if (Either.isLeft(result) && Either.isLeft(nextResult)) {
          result = Either.left([...result.left, ...nextResult.left])
        } else {
          result = Either.isLeft(result) ? result : nextResult
        }
      }
    }
    return result
  }
  return {
    [RefinedConstructorsTypeId]: RefinedConstructorsTypeId,
    of: (args) => pipe(either(args), Either.getOrThrow(identity)),
    option: (args) => Option.fromEither(either(args)),
    either,
    refine: (args): args is any => Either.isRight(either(args))
  }
}
