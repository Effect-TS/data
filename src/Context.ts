/**
 * @since 1.0.0
 */

import type { Equal } from "@fp-ts/data/Equal"
import * as C from "@fp-ts/data/internal/Context"
import type { Option } from "@fp-ts/data/Option"

const TagTypeId: unique symbol = C.TagTypeId

/**
 * @since 1.0.0
 * @category symbol
 */
export type TagTypeId = typeof TagTypeId

/**
 * @since 1.0.0
 * @category models
 */
export interface Tag<Service> extends Equal {
  readonly _id: TagTypeId
  readonly _S: (_: Service) => Service
}

/**
 * @since 1.0.0
 */
export declare namespace Tag {
  type Service<T extends Tag<any>> = T extends Tag<infer A> ? A : never
}

/**
 * @since 1.0.0
 * @category constructors
 */
export const Tag = <Service>(): Tag<Service> => new C.TagImpl()

const TypeId: unique symbol = C.ContextTypeId as TypeId

/**
 * @since 1.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * @since 1.0.0
 * @category models
 */
export type Tags<R> = R extends infer S ? Tag<S> : never

/**
 * @since 1.0.0
 * @category models
 */
export interface Context<Services> extends Equal {
  readonly _id: TypeId
  readonly _S: (_: Services) => unknown
  /** @internal */
  readonly unsafeMap: Map<Tag<any>, any>
}

/**
 * @since 1.0.0
 * @category guards
 */
export const isContext: (u: unknown) => u is Context<never> = C.isContext

/**
 * @since 1.0.0
 * @category guards
 */
export const isTag: (u: unknown) => u is Tag<never> = C.isTag

/**
 * @since 1.0.0
 * @category constructors
 */
export const empty: () => Context<never> = C.empty

/**
 * @since 1.0.0
 * @category mutations
 */
export const add: <S>(
  tag: Tag<S>
) => (
  service: S
) => <Services>(self: Context<Services>) => Context<S | Services> = C.add

/**
 * @since 1.0.0
 * @category getters
 */
export const get: <Services, T extends Tags<Services>>(
  tag: T
) => (self: Context<Services>) => T extends Tag<infer S> ? S : never = C.get

/**
 * @since 1.0.0
 * @category unsafe
 */
export const unsafeGet: <S>(tag: Tag<S>) => <Services>(self: Context<Services>) => S = C.unsafeGet

/**
 * @since 1.0.0
 * @category getters
 */
export const getOption: <S>(tag: Tag<S>) => <Services>(self: Context<Services>) => Option<S> =
  C.getOption

/**
 * @since 1.0.0
 * @category mutations
 */
export const merge: <R1>(
  that: Context<R1>
) => <Services>(
  self: Context<Services>
) => Context<R1 | Services> = C.merge

/**
 * @since 1.0.0
 * @category mutations
 */
export const prune: <Services, S extends Array<Tags<Services>>>(
  ...tags: S
) => (
  self: Context<Services>
) => Context<{ [k in keyof S]: Tag.Service<S[k]> }[number]> = C.prune
