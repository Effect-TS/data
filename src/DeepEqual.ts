/**
 * @since 1.0.0
 */
import { absurd } from "@fp-ts/core/Function"
import * as DH from "@fp-ts/data/DeepHash"

/**
 * @since 1.0.0
 * @category model
 */
export const DeepEqual: DeepEqualConstructor = {
  symbol: Symbol.for("@fp-ts/data/DeepEqual") as DeepEqualConstructor["symbol"]
}

/**
 * @since 1.0.0
 * @category model
 */
export interface DeepEqual extends DH.DeepHash {
  readonly [DeepEqual.symbol]: (that: unknown) => boolean
}

/**
 * @since 1.0.0
 * @category model
 */
export interface DeepEqualConstructor {
  readonly symbol: unique symbol
}

/**
 * @since 1.0.0
 * @category hashing
 */
export function deepEqual<B>(that: B): <A>(self: A) => boolean
/**
 * @since 1.0.0
 * @category hashing
 */
export function deepEqual<A, B>(self: A, that: B): boolean
export function deepEqual(...args: Array<any>): any {
  if (args.length === 1) {
    return (self: unknown) => equal(self, args[0])
  }
  return equal(args[0], args[1])
}

function isDeepEqual(u: unknown): u is DeepEqual {
  return typeof u === "object" && u !== null && DeepEqual.symbol in u
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
  if (!deepEqual(keysA, keysB)) {
    return false
  }
  for (const ka of keysA) {
    const va = self[ka]
    const vb = that[ka]
    if (!deepEqual(va, vb)) {
      return false
    }
  }
  return true
}

function equal<A, B>(self: A, that: B): boolean
function equal(self: unknown, that: unknown) {
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
          return self.length === that.length && self.every((v, i) => deepEqual(v, that[i]))
        } else {
          return false
        }
      }
      const hashSelf = DH.deepHash(self)
      const hashThat = DH.deepHash(that)
      if (hashSelf !== hashThat) {
        return false
      }
      if (isDeepEqual(self)) {
        if (isDeepEqual(that)) {
          return self[DeepEqual.symbol](that)
        } else {
          return false
        }
      }
      return object(self, that)
    }
    case "function": {
      if (isDeepEqual(self)) {
        if (isDeepEqual(that)) {
          const hashSelf = DH.deepHash(self)
          const hashThat = DH.deepHash(that)
          if (hashSelf !== hashThat) {
            return false
          }
          return self[DeepEqual.symbol](that)
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
