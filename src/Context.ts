/**
 * @since 1.0.0
 */
import type { Option } from "@fp-ts/core/Option"
import * as O from "@fp-ts/core/Option"
import { DeepEqual } from "@fp-ts/data/DeepEqual"
import { DeepHash, deepHash, randomHash } from "@fp-ts/data/DeepHash"

const TagTypeId: unique symbol = Symbol.for("@fp-ts/data/Context/Tag") as TagTypeId

/**
 * @since 1.0.0
 * @category symbol
 */
export type TagTypeId = typeof TagTypeId

/**
 * @since 1.0.0
 * @category model
 */
export interface Tag<Service> extends DeepEqual {
  readonly _id: TagTypeId
  readonly _S: (_: Service) => Service
}

/**
 * @since 1.0.0
 */
export declare namespace Tag {
  type Service<T extends Tag<any>> = T extends Tag<infer A> ? A : never
}

/** @internal */
class TagImpl<Service> implements Tag<Service> {
  readonly _id: typeof TagTypeId = TagTypeId
  readonly _S: (_: Service) => Service = (_) => _;

  [DeepEqual.symbol](that: unknown) {
    return this === that
  }

  [DeepHash.symbol](): number {
    return randomHash(this)
  }
}

/**
 * @since 1.0.0
 * @category constructors
 */
export const Tag = <Service>(): Tag<Service> => new TagImpl()

const TypeId: unique symbol = Symbol.for("@fp-ts/data/Context") as TypeId

/**
 * @since 1.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * @since 1.0.0
 * @category model
 */
export type Tags<R> = R extends infer S ? Tag<S> : never

/**
 * @since 1.0.0
 * @category model
 */
export interface Context<Services> extends DeepEqual {
  readonly _id: TypeId
  readonly _S: (_: Services) => unknown
  /** @internal */
  readonly unsafeMap: Map<Tag<any>, any>
}

class ContextImpl<Services> implements Context<Services> {
  _id: typeof TypeId = TypeId
  _S = (_: Services) => _;

  [DeepEqual.symbol](that: unknown): boolean {
    if (isContext(that)) {
      if (this.unsafeMap.size === that.unsafeMap.size) {
        for (const k of this.unsafeMap.keys()) {
          if (!that.unsafeMap.has(k)) {
            return false
          }
        }
        return true
      }
    }
    return false
  }

  [DeepHash.symbol](): number {
    return deepHash(this.unsafeMap.size)
  }

  constructor(readonly unsafeMap: Map<Tag<any>, any>) {}
}

/**
 * @since 1.0.0
 * @category guards
 */
export const isContext = (u: unknown): u is Context<never> => {
  return typeof u === "object" && u !== null && "_id" in u && u["_id"] === TypeId
}

/**
 * @since 1.0.0
 * @category constructors
 */
export const empty = (): Context<never> => new ContextImpl<never>(new Map())

/**
 * @since 1.0.0
 * @category mutations
 */
export const add = <S>(tag: Tag<S>) =>
  (service: S) =>
    <Services>(self: Context<Services>): Context<Services | S> => {
      const map = new Map(self.unsafeMap)
      map.set(tag, service)
      return new ContextImpl<Services | S>(map)
    }

/**
 * @since 1.0.0
 * @category getters
 */
export const get = <Services, T extends Tags<Services>>(tag: T) =>
  (self: Context<Services>): T extends Tag<infer S> ? S : never => {
    if (!self.unsafeMap.has(tag)) {
      throw new Error("Service not found")
    }
    return self.unsafeMap.get(tag)!
  }

/**
 * @since 1.0.0
 * @category unsafe
 */
export const unsafeGet = <S>(tag: Tag<S>) =>
  <Services>(self: Context<Services>): S => {
    if (!self.unsafeMap.has(tag)) {
      throw new Error("Service not found")
    }
    return self.unsafeMap.get(tag)!
  }

/**
 * @since 1.0.0
 * @category getters
 */
export const getOption = <S>(tag: Tag<S>) =>
  <Services>(self: Context<Services>): Option<S> => {
    if (!self.unsafeMap.has(tag)) {
      return O.none
    }
    return O.some(self.unsafeMap.get(tag)!)
  }

/**
 * @since 1.0.0
 * @category mutations
 */
export const merge = <R1>(that: Context<R1>) =>
  <Services>(self: Context<Services>): Context<Services | R1> => {
    const map = new Map(self.unsafeMap)
    for (const [tag, s] of that.unsafeMap) {
      map.set(tag, s)
    }
    return new ContextImpl<Services | R1>(map)
  }

/**
 * @since 1.0.0
 * @category mutations
 */
export const prune = <Services, S extends Array<Tags<Services>>>(...tags: S) =>
  (self: Context<Services>): Context<{ [k in keyof S]: Tag.Service<S[k]> }[number]> => {
    const tagSet = new Set<Tag<any>>(tags)
    const newEnv = new Map()
    for (const [tag, s] of self.unsafeMap.entries()) {
      if (tagSet.has(tag)) {
        newEnv.set(tag, s)
      }
    }
    return new ContextImpl<{ [k in keyof S]: Tag.Service<S[k]> }[number]>(newEnv)
  }
