/**
 * @since 1.0.0
 */
import { absurd } from "@fp-ts/core/Function"
import type { Eq } from "@fp-ts/core/typeclasses/Eq"
import * as DH from "@fp-ts/data/Hash"

/**
 * @since 1.0.0
 * @category model
 */
export const Equal: EqualConstructor = {
  symbol: Symbol.for("@fp-ts/data/DeepEqual") as EqualConstructor["symbol"]
}

/**
 * @since 1.0.0
 * @category symbol
 */
export const symbol: EqualConstructor["symbol"] = Equal.symbol

/**
 * @since 1.0.0
 * @category model
 */
export interface Equal extends DH.Hash {
  readonly [Equal.symbol]: (that: unknown) => boolean
}

/**
 * @since 1.0.0
 * @category model
 */
export interface EqualConstructor {
  readonly symbol: unique symbol
}

/**
 * @since 1.0.0
 * @category equality
 */
export function equals<B>(that: B): <A>(self: A) => boolean
/**
 * @since 1.0.0
 * @category equality
 */
export function equals<A, B>(self: A, that: B): boolean
export function equals(): any {
  if (arguments.length === 1) {
    return (self: unknown) => compareBoth(self, arguments[0])
  }
  return compareBoth(arguments[0], arguments[1])
}

/** @internal */
export function getEq<A>(): Eq<A> {
  return {
    equals: (that) => (self) => compareBoth(self, that)
  }
}

function isDeepEqual(u: unknown): u is Equal {
  return typeof u === "object" && u !== null && Equal.symbol in u
}

function object(self: object, that: object) {
  if ("_tag" in self) {
    if ("_tag" in that) {
      if (self["_tag"] !== that["_tag"]) {
        return false
      }
    } else {
      return false
    }
  }
  const keysA = Object.keys(self).sort()
  const keysB = Object.keys(that).sort()
  if (keysA.length !== keysB.length) {
    return false
  }
  if (!equals(keysA, keysB)) {
    return false
  }
  for (const ka of keysA) {
    const va = self[ka]
    const vb = that[ka]
    if (!equals(va, vb)) {
      return false
    }
  }
  return true
}

function compareBoth<A, B>(self: A, that: B): boolean
function compareBoth(self: unknown, that: unknown) {
  const selfType = typeof self
  switch (selfType) {
    case "number": {
      return self === that
    }
    case "string": {
      return self === that
    }
    case "symbol": {
      return self === that
    }
    case "bigint": {
      return self === that
    }
    case "boolean": {
      return self === that
    }
    case "undefined": {
      return self === that
    }
    case "object": {
      if (self == null || that == null || typeof that !== "object") {
        return self === that
      }
      if (Array.isArray(self)) {
        if (Array.isArray(that)) {
          return self.length === that.length && self.every((v, i) => equals(v, that[i]))
        } else {
          return false
        }
      }
      const hashSelf = DH.evaluate(self)
      const hashThat = DH.evaluate(that)
      if (hashSelf !== hashThat) {
        return false
      }
      if (isDeepEqual(self)) {
        if (isDeepEqual(that)) {
          return self[Equal.symbol](that)
        } else {
          return false
        }
      }
      return object(self, that)
    }
    case "function": {
      if (isDeepEqual(self)) {
        if (isDeepEqual(that)) {
          const hashSelf = DH.evaluate(self)
          const hashThat = DH.evaluate(that)
          if (hashSelf !== hashThat) {
            return false
          }
          return self[Equal.symbol](that)
        } else {
          return false
        }
      }
      return self === that
    }
    default: {
      absurd(selfType)
    }
  }
}
