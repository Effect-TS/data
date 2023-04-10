import type * as C from "@effect/data/Context"
import type { Trace } from "@effect/data/Debug"
import { makeTraced } from "@effect/data/Debug"
import * as Equal from "@effect/data/Equal"
import * as Dual from "@effect/data/Function"
import * as G from "@effect/data/Global"
import * as Hash from "@effect/data/Hash"
import type * as O from "@effect/data/Option"
import * as option from "@effect/data/Option"

/** @internal */
export const TagTypeId: C.TagTypeId = Symbol.for("@effect/data/Context/Tag") as C.TagTypeId

/** @internal */
const effectVariance = {
  _R: (_: never) => _,
  _E: (_: never) => _,
  _A: (_: never) => _
}

const EffectTypeId = Symbol.for("@effect/io/Effect")

/** @internal */
export class TagImpl<Identifier, Service> implements C.Tag<Identifier, Service> {
  readonly _tag = "Tag"
  public i0 = undefined
  public i1 = undefined
  public i2 = undefined
  public trace = undefined;
  [EffectTypeId] = effectVariance;
  [Equal.symbol](this: {}, that: unknown) {
    return this === that
  }
  [Hash.symbol](this: {}) {
    return Hash.random(this)
  }
  get [TagTypeId]() {
    return {
      _S: (_: Service) => _,
      _I: (_: Identifier) => _
    }
  }
  constructor(id?: unknown) {
    if (typeof id !== "undefined") {
      return G.globalValue(id, () => this)
    }
  }
  traced(this: this, trace: Trace): C.TracedTag<Identifier, Service> | this {
    if (trace) {
      return makeTraced(this, trace)
    }
    return this
  }
  of(self: Service): Service {
    return self
  }
  context(this: C.Tag<Identifier, Service>, self: Service): C.Context<Identifier> {
    return make(this, self)
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
          if (!that.unsafeMap.has(k) || !Equal.equals(this.unsafeMap.get(k), that.unsafeMap.get(k))) {
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

  constructor(readonly unsafeMap: Map<C.Tag<unknown, unknown>, any>) {}
}

/** @internal */
export const isContext = (u: unknown): u is C.Context<never> =>
  typeof u === "object" && u !== null && "_id" in u && u["_id"] === ContextTypeId

/** @internal */
export const isTag = (u: unknown): u is C.Tag<any, any> => typeof u === "object" && u !== null && TagTypeId in u

/** @internal */
export const empty = (): C.Context<never> => new ContextImpl<never>(new Map())

/** @internal */
export const make = <T extends C.Tag<any, any>>(
  tag: T,
  service: C.Tag.Service<T>
): C.Context<C.Tag.Identifier<T>> => new ContextImpl(new Map([[tag, service]]))

/** @internal */
export const add = Dual.dual<
  <T extends C.Tag<any, any>>(
    tag: T,
    service: C.Tag.Service<T>
  ) => <Services>(
    self: C.Context<Services>
  ) => C.Context<Services | C.Tag.Identifier<T>>,
  <Services, T extends C.Tag<any, any>>(
    self: C.Context<Services>,
    tag: T,
    service: C.Tag.Service<T>
  ) => C.Context<Services | C.Tag.Identifier<T>>
>(3, (self, tag, service) => {
  const map = new Map(self.unsafeMap)
  map.set(tag as C.Tag<unknown, unknown>, service)
  return new ContextImpl(map)
})

/** @internal */
export const get = Dual.dual<
  <Services, T extends C.ValidTagsById<Services>>(tag: T) => (self: C.Context<Services>) => C.Tag.Service<T>,
  <Services, T extends C.ValidTagsById<Services>>(self: C.Context<Services>, tag: T) => C.Tag.Service<T>
>(2, (self, tag) => {
  if (!self.unsafeMap.has(tag)) {
    throw new Error("Service not found")
  }
  return self.unsafeMap.get(tag)! as any
})

/** @internal */
export const unsafeGet = Dual.dual<
  <S, I>(tag: C.Tag<I, S>) => <Services>(self: C.Context<Services>) => S,
  <Services, S, I>(self: C.Context<Services>, tag: C.Tag<I, S>) => S
>(2, (self, tag) => {
  if (!self.unsafeMap.has(tag)) {
    throw new Error("Service not found")
  }
  return self.unsafeMap.get(tag)! as any
})

/** @internal */
export const getOption = Dual.dual<
  <S, I>(tag: C.Tag<I, S>) => <Services>(self: C.Context<Services>) => O.Option<S>,
  <Services, S, I>(self: C.Context<Services>, tag: C.Tag<I, S>) => O.Option<S>
>(2, (self, tag) => {
  if (!self.unsafeMap.has(tag)) {
    return option.none()
  }
  return option.some(self.unsafeMap.get(tag)! as any)
})

/** @internal */
export const merge = Dual.dual<
  <R1>(that: C.Context<R1>) => <Services>(self: C.Context<Services>) => C.Context<Services | R1>,
  <Services, R1>(self: C.Context<Services>, that: C.Context<R1>) => C.Context<Services | R1>
>(2, (self, that) => {
  const map = new Map(self.unsafeMap)
  for (const [tag, s] of that.unsafeMap) {
    map.set(tag, s)
  }
  return new ContextImpl(map)
})

/** @internal */
export const pick = <Services, S extends Array<C.ValidTagsById<Services>>>(...tags: S) =>
  (self: C.Context<Services>): C.Context<
    { [k in keyof S]: C.Tag.Identifier<S[k]> }[number]
  > => {
    const tagSet = new Set<unknown>(tags)
    const newEnv = new Map()
    for (const [tag, s] of self.unsafeMap.entries()) {
      if (tagSet.has(tag)) {
        newEnv.set(tag, s)
      }
    }
    return new ContextImpl<{ [k in keyof S]: C.Tag.Identifier<S[k]> }[number]>(newEnv)
  }

/** @internal */
export const omit = <Services, S extends Array<C.ValidTagsById<Services>>>(...tags: S) =>
  (self: C.Context<Services>): C.Context<
    Exclude<Services, { [k in keyof S]: C.Tag.Identifier<S[k]> }[keyof S]>
  > => {
    const newEnv = new Map(self.unsafeMap)
    for (const tag of tags) {
      newEnv.delete(tag)
    }
    return new ContextImpl(newEnv)
  }
