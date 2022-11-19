import type * as C from "@fp-ts/data/Context"
import * as Equal from "@fp-ts/data/Equal"
import * as O from "@fp-ts/data/Option"

/** @internal */
export const TagTypeId: C.TagTypeId = Symbol.for("@fp-ts/data/Context/Tag") as C.TagTypeId

/** @internal */
export class TagImpl<Service> implements C.Tag<Service> {
  readonly _id: typeof TagTypeId = TagTypeId
  readonly _S: (_: Service) => Service = (_) => _;

  [Equal.symbolEqual](that: unknown) {
    return this === that
  }

  [Equal.symbolHash](): number {
    return Equal.hashRandom(this)
  }

  [Symbol.iterator]() {
    return new SingleShotGen<this, Service>(this)
  }
}

/** @internal */
export class SingleShotGen<T, A> implements Generator<T, A> {
  called = false

  constructor(readonly self: T) {}

  next(a: A): IteratorResult<T, A> {
    return this.called ?
      ({
        value: a,
        done: true
      }) :
      (this.called = true,
        ({
          value: this.self,
          done: false
        }))
  }

  return(a: A): IteratorResult<T, A> {
    return ({
      value: a,
      done: true
    })
  }

  throw(e: unknown): IteratorResult<T, A> {
    throw e
  }

  [Symbol.iterator](): Generator<T, A> {
    return new SingleShotGen<T, A>(this.self)
  }
}

/** @internal */
export const ContextTypeId: C.TypeId = Symbol.for("@fp-ts/data/Context") as C.TypeId

/** @internal */
export class ContextImpl<Services> implements C.Context<Services> {
  _id: C.TypeId = ContextTypeId
  _S = (_: Services) => _;

  [Equal.symbolEqual](that: unknown): boolean {
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

  [Equal.symbolHash](): number {
    return Equal.hash(this.unsafeMap.size)
  }

  constructor(readonly unsafeMap: Map<C.Tag<any>, any>) {}
}

/** @internal */
export function isContext(u: unknown): u is C.Context<never> {
  return typeof u === "object" && u !== null && "_id" in u && u["_id"] === ContextTypeId
}

/** @internal */
export function isTag(u: unknown): u is C.Tag<never> {
  return typeof u === "object" && u !== null && "_id" in u && u["_id"] === TagTypeId
}

/** @internal */
export function empty(): C.Context<never> {
  return new ContextImpl<never>(new Map())
}

export function add<S>(tag: C.Tag<S>) {
  return (service: S) => {
    return <Services>(self: C.Context<Services>): C.Context<Services | S> => {
      const map = new Map(self.unsafeMap)
      map.set(tag, service)
      return new ContextImpl<Services | S>(map)
    }
  }
}

/** @internal */
export function get<Services, T extends C.Tags<Services>>(tag: T) {
  return (self: C.Context<Services>): T extends C.Tag<infer S> ? S : never => {
    if (!self.unsafeMap.has(tag)) {
      throw new Error("Service not found")
    }
    return self.unsafeMap.get(tag)!
  }
}

/** @internal */
export function unsafeGet<S>(tag: C.Tag<S>) {
  return <Services>(self: C.Context<Services>): S => {
    if (!self.unsafeMap.has(tag)) {
      throw new Error("Service not found")
    }
    return self.unsafeMap.get(tag)!
  }
}

/** @internal */
export function getOption<S>(tag: C.Tag<S>) {
  return <Services>(self: C.Context<Services>): O.Option<S> => {
    if (!self.unsafeMap.has(tag)) {
      return O.none
    }
    return O.some(self.unsafeMap.get(tag)!)
  }
}

/** @internal */
export function merge<R1>(that: C.Context<R1>) {
  return <Services>(self: C.Context<Services>): C.Context<Services | R1> => {
    const map = new Map(self.unsafeMap)
    for (const [tag, s] of that.unsafeMap) {
      map.set(tag, s)
    }
    return new ContextImpl<Services | R1>(map)
  }
}

/** @internal */
export function prune<Services, S extends Array<C.Tags<Services>>>(...tags: S) {
  return (self: C.Context<Services>): C.Context<
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
}
