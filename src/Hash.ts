/**
 * @since 1.0.0
 */
import { pipe } from "@fp-ts/data/Function"
import { PCGRandom } from "@fp-ts/data/Random"

/** @internal */
const hashCache = new WeakMap<object, number>()
/** @internal */
const pcgr = new PCGRandom()

/**
 * @since 1.0.0
 * @category symbols
 */
export const symbol: unique symbol = Symbol.for("@fp-ts/data/Hash")

/**
 * @since 1.0.0
 * @category models
 */
export interface Hash {
  [symbol](): number
}

/**
 * @since 1.0.0
 * @category hashing
 */
export const hash: <A>(self: A) => number = <A>(self: A) => {
  switch (typeof self) {
    case "number": {
      return number(self)
    }
    case "bigint": {
      return string(self.toString(10))
    }
    case "boolean": {
      return string(String(self))
    }
    case "symbol": {
      return string(String(self))
    }
    case "string": {
      return string(self)
    }
    case "undefined": {
      return string("undefined")
    }
    case "function":
    case "object": {
      if (self === null) {
        return string("null")
      }
      if (hashCache.has(self)) {
        return hashCache.get(self)!
      }
      if (isHash(self)) {
        return self[symbol]()
      } else {
        hashCache.set(self, random(self))
        return hashCache.get(self)!
      }
    }
    default: {
      throw new Error("Bug in Equal.hashGeneric")
    }
  }
}

/**
 * @since 1.0.0
 * @category hashing
 */
export const random: <A extends object>(self: A) => number = (self) => {
  if (!hashCache.has(self)) {
    const h = optimize(pcgr.integer(Number.MAX_SAFE_INTEGER))
    hashCache.set(self, h)
  }
  return hashCache.get(self)!
}

/**
 * @since 1.0.0
 * @category hashing
 */
export const combine: (b: number) => (self: number) => number = (b) => (self) => (self * 53) ^ b

/**
 * @since 1.0.0
 * @category hashing
 */
export const optimize = (n: number): number => (n & 0xbfffffff) | ((n >>> 1) & 0x40000000)

/**
 * @since 1.0.0
 * @category guards
 */
export const isHash = (u: unknown): u is Hash => typeof u === "object" && u !== null && symbol in u

/**
 * @since 1.0.0
 * @category hashing
 */
export const number = (n: number) => {
  if (n !== n || n === Infinity) {
    return 0
  }
  let h = n | 0
  if (h !== n) {
    h ^= n * 0xffffffff
  }
  while (n > 0xffffffff) {
    h ^= n /= 0xffffffff
  }
  return optimize(n)
}

/**
 * @since 1.0.0
 * @category hashing
 */
export const string = (str: string) => {
  let h = 5381, i = str.length
  while (i) {
    h = (h * 33) ^ str.charCodeAt(--i)
  }
  return optimize(h)
}

/**
 * @since 1.0.0
 * @category hashing
 */
export const structure = <A extends object>(o: A) => {
  hashCache.set(o, number(pcgr.number()))
  const keys = Object.keys(o)
  let h = 12289
  for (let i = 0; i < keys.length; i++) {
    h ^= pipe(string(keys[i]!), combine(hash((o as any)[keys[i]!])))
  }
  return optimize(h)
}

/**
 * @since 1.0.0
 * @category hashing
 */
export const array = <A>(arr: ReadonlyArray<A>) => {
  let h = 6151
  for (let i = 0; i < arr.length; i++) {
    h = pipe(h, combine(hash(arr[i])))
  }
  return optimize(h)
}
