import type * as C from "@effect/data/Context"
import * as Dual from "@effect/data/Dual"
import * as Equal from "@effect/data/Equal"
import * as Hash from "@effect/data/Hash"
import type * as O from "@fp-ts/core/Option"
import * as option from "@fp-ts/core/Option"

/** @internal */
export const TagTypeId: C.TagTypeId = Symbol.for("@effect/data/Context/Tag") as C.TagTypeId

/** @internal */
export class TagImpl<Service> implements C.Tag<Service> {
  readonly _id: typeof TagTypeId = TagTypeId
  readonly _S: (_: Service) => Service = (_) => _

  constructor(readonly key?: string) {
    if (key) {
      if (!(TagTypeId in globalThis)) {
        globalThis[TagTypeId] = {}
      }
      if (!(key in globalThis[TagTypeId])) {
        globalThis[TagTypeId][key] = this
      }
      return globalThis[TagTypeId][key]
    }
  }
}

/** @internal */
export const ContextTypeId: C.TypeId = Symbol.for("@effect/data/Context") as C.TypeId

/** @internal */
export class ContextImpl<Services> implements C.Context<Services> {
  _id: C.TypeId = ContextTypeId
  _S = (_: Services) => _;

  [Equal.symbol](that: unknown): boolean {
    if (isContext(that)) {
      if (this.unsafeMap.size === that.unsafeMap.size) {
        for (const k of this.unsafeMap.keys()) {
          if (
            !that.unsafeMap.has(k) || !Equal.equals(this.unsafeMap.get(k), that.unsafeMap.get(k))
          ) {
            return false
          }
        }
        return true
      }
    }
    return false
  }

  [Hash.symbol](): number {
    return Hash.number(this.unsafeMap.size)
  }

  constructor(readonly unsafeMap: Map<C.Tag<any>, any>) {}
}

/** @internal */
export const isContext = (u: unknown): u is C.Context<never> =>
  typeof u === "object" && u !== null && "_id" in u && u["_id"] === ContextTypeId

/** @internal */
export const isTag = (u: unknown): u is C.Tag<never> =>
  typeof u === "object" && u !== null && "_id" in u && u["_id"] === TagTypeId

/** @internal */
export const empty = (): C.Context<never> => new ContextImpl<never>(new Map())

/** @internal */
export const make = <T extends C.Tag<any>>(
  tag: T,
  service: C.Tag.Service<T>
): C.Context<C.Tag.Service<T>> => new ContextImpl(new Map([[tag, service]]))

/** @internal */
export const add = Dual.dual<
  <Services, T extends C.Tag<any>>(
    self: C.Context<Services>,
    tag: C.Tag<T>,
    service: C.Tag.Service<T>
  ) => C.Context<Services | C.Tag.Service<T>>,
  <T extends C.Tag<any>>(
    tag: T,
    service: C.Tag.Service<T>
  ) => <Services>(
    self: C.Context<Services>
  ) => C.Context<Services | C.Tag.Service<T>>
>(3, (self, tag, service) => {
  const map = new Map(self.unsafeMap)
  map.set(tag, service)
  return new ContextImpl(map)
})

/** @internal */
export const get = Dual.dual<
  <Services, T extends C.Tags<Services>>(
    self: C.Context<Services>,
    tag: T
  ) => T extends C.Tag<infer S> ? S : never,
  <Services, T extends C.Tags<Services>>(
    tag: T
  ) => (
    self: C.Context<Services>
  ) => T extends C.Tag<infer S> ? S : never
>(2, (self, tag) => {
  if (!self.unsafeMap.has(tag)) {
    throw new Error("Service not found")
  }
  return self.unsafeMap.get(tag)!
})

/** @internal */
export const unsafeGet = Dual.dual<
  <Services, S>(self: C.Context<Services>, tag: C.Tag<S>) => S,
  <S>(tag: C.Tag<S>) => <Services>(self: C.Context<Services>) => S
>(2, (self, tag) => {
  if (!self.unsafeMap.has(tag)) {
    throw new Error("Service not found")
  }
  return self.unsafeMap.get(tag)!
})

/** @internal */
export const getOption = Dual.dual<
  <Services, S>(self: C.Context<Services>, tag: C.Tag<S>) => O.Option<S>,
  <S>(tag: C.Tag<S>) => <Services>(self: C.Context<Services>) => O.Option<S>
>(2, (self, tag) => {
  if (!self.unsafeMap.has(tag)) {
    return option.none()
  }
  return option.some(self.unsafeMap.get(tag)!)
})

/** @internal */
export const merge = Dual.dual<
  <Services, R1>(self: C.Context<Services>, that: C.Context<R1>) => C.Context<Services | R1>,
  <R1>(that: C.Context<R1>) => <Services>(self: C.Context<Services>) => C.Context<Services | R1>
>(2, (self, that) => {
  const map = new Map(self.unsafeMap)
  for (const [tag, s] of that.unsafeMap) {
    map.set(tag, s)
  }
  return new ContextImpl(map)
})

/** @internal */
export const prune = <Services, S extends Array<C.Tags<Services>>>(...tags: S) =>
  (self: C.Context<Services>): C.Context<
    { [k in keyof S]: C.Tag.Service<S[k]> }[number]
  > => {
    const tagSet = new Set<C.Tag<any>>(tags)
    const newEnv = new Map()
    for (const [tag, s] of self.unsafeMap.entries()) {
      if (tagSet.has(tag)) {
        newEnv.set(tag, s)
      }
    }
    return new ContextImpl<{ [k in keyof S]: C.Tag.Service<S[k]> }[number]>(newEnv)
  }
