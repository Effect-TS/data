/**
 * @since 1.0.0
 */
import { pipe } from "@fp-ts/data/Function"
import { PCGRandom } from "@fp-ts/data/Random"

/**
 * @since 1.0.0
 * @category symbols
 */
export const symbolHash: unique symbol = Symbol.for("@fp-ts/data/DeepEqual/hash")

/**
 * @since 1.0.0
 * @category symbols
 */
export const symbolEqual: unique symbol = Symbol.for("@fp-ts/data/DeepEqual/equal")

/**
 * @since 1.0.0
 * @category models
 */
export interface Equal {
  [symbolEqual](that: unknown): boolean
  [symbolHash](): number
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

/**
 * @since 1.0.0
 * @category hashing
 */
export const hash: <A>(self: A) => number = <A>(self: A) => {
  return hashOptimize(hashGeneric(self))
}

/**
 * @since 1.0.0
 * @category hashing
 */
export const hashRandom: <A extends object>(self: A) => number = (self) => {
  if (!CACHE.has(self)) {
    const h = hashOptimize(pcgr.number())
    CACHE.set(self, h)
  }
  return CACHE.get(self)!
}

/**
 * @since 1.0.0
 * @category hashing
 */
export const hashCombine: (b: number) => (self: number) => number = (b) => (self) => (self * 53) ^ b

/**
 * @since 1.0.0
 * @category hashing
 */
export const hashOptimize = (n: number): number => (n & 0xbfffffff) | ((n >>> 1) & 0x40000000)

function isDeepEqual(u: unknown): u is Equal {
  return typeof u === "object" && u !== null && symbolEqual in u && symbolHash in u
}

const compareBothTable = {
  "object": (self: object, that: unknown) => {
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
    if (isDeepEqual(self)) {
      if (isDeepEqual(that)) {
        const hashSelf = hash(self)
        const hashThat = hash(that)
        if (hashSelf !== hashThat) {
          return false
        }
        return self[symbolEqual](that)
      } else {
        return false
      }
    }
    return self === that
  },
  "function": (self: Function, that: unknown) => {
    if (isDeepEqual(self)) {
      if (isDeepEqual(that)) {
        const hashSelf = hash(self)
        const hashThat = hash(that)
        if (hashSelf !== hashThat) {
          return false
        }
        return self[symbolEqual](that)
      } else {
        return false
      }
    }
    return false
  }
}

function compareBoth<A, B>(self: A, that: B): boolean
function compareBoth(self: unknown, that: unknown) {
  if (self === that) {
    return true
  }
  const cmp = compareBothTable[typeof self]
  return cmp ? cmp(self, that) : false
}

/** @internal */
const pcgr = new PCGRandom()

/**
 * @since 1.0.0
 * @category hashing
 */
export function hashNumber(n: number) {
  if (n !== n || n === Infinity) return 0
  let h = n | 0
  if (h !== n) h ^= n * 0xffffffff
  while (n > 0xffffffff) h ^= n /= 0xffffffff
  return n
}

/**
 * @since 1.0.0
 * @category hashing
 */
export function hashString(str: string): number {
  let h = 5381,
    i = str.length
  while (i) h = (h * 33) ^ str.charCodeAt(--i)
  return h
}

const CACHE = new WeakMap()

/**
 * @since 1.0.0
 * @category hashing
 */
export function hashStructure(o: object): number {
  CACHE.set(o, hashNumber(pcgr.number()))
  const keys = Object.keys(o)
  let h = 12289
  for (let i = 0; i < keys.length; i++) {
    h ^= pipe(hashString(keys[i]!), hashCombine(hash((o as any)[keys[i]!])))
  }
  return h
}

/**
 * @since 1.0.0
 * @category hashing
 */
export function hashArray(arr: ReadonlyArray<any>): number {
  let h = 6151
  for (let i = 0; i < arr.length; i++) {
    h = pipe(h, hashCombine(hash(arr[i])))
  }
  return h
}

/**
 * @since 1.0.0
 * @category hashing
 */
export function hashGeneric<A>(self: A): number
export function hashGeneric(self: unknown): number {
  switch (typeof self) {
    case "number": {
      return hashNumber(self)
    }
    case "string": {
      return hashString(self)
    }
    case "symbol": {
      return hashString(String(self))
    }
    case "bigint": {
      return hashString((self).toString(10))
    }
    case "undefined": {
      return hashString("undefined")
    }
    case "function": {
      if (isDeepEqual(self)) {
        return self[symbolHash]()
      }
      return hashRandom(self)
    }
    case "object": {
      if (self == null) {
        return hashString("null")
      }
      if (Array.isArray(self)) {
        return hashArray(self)
      }
      if (isDeepEqual(self)) {
        return self[symbolHash]()
      }
      return hashRandom(self)
    }
    case "boolean": {
      return hashString(String(self))
    }
  }
}
