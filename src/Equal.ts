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

function compareObject(self: object, that: object) {
  const selfProto = Object.getPrototypeOf(self)
  const thatProto = Object.getPrototypeOf(self)

  if (selfProto !== thatProto) {
    return false
  }

  if (selfProto !== Object.prototype) {
    return self === that
  }

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
    const hashSelf = hash(self)
    const hashThat = hash(that)
    if (hashSelf !== hashThat) {
      return false
    }
    if (isDeepEqual(self)) {
      if (isDeepEqual(that)) {
        return self[symbolEqual](that)
      } else {
        return false
      }
    }
    return compareObject(self, that)
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

function hashNumber(n: number) {
  if (n !== n || n === Infinity) return 0
  let h = n | 0
  if (h !== n) h ^= n * 0xffffffff
  while (n > 0xffffffff) h ^= n /= 0xffffffff
  return n
}

function hashString(str: string): number {
  let h = 5381,
    i = str.length
  while (i) h = (h * 33) ^ str.charCodeAt(--i)
  return h
}

const CACHE = new WeakMap()

function hashStructure(o: object): number {
  CACHE.set(o, hashNumber(pcgr.number()))
  const keys = Object.keys(o)
  let h = 12289
  for (let i = 0; i < keys.length; i++) {
    h ^= pipe(hashString(keys[i]!), hashCombine(hash((o as any)[keys[i]!])))
  }
  return h
}

function hashArray(arr: ReadonlyArray<any>): number {
  let h = 6151
  for (let i = 0; i < arr.length; i++) {
    h = pipe(h, hashCombine(hash(arr[i])))
  }
  return h
}

const hashProtoMap = new Map<any, (_: any) => number>([
  [Array.prototype, hashArray],
  [Object.prototype, hashStructure]
])

function hashObject(value: object): number {
  if (CACHE.has(value)) return CACHE.get(value)
  let h: number
  if (isDeepEqual(value)) {
    h = value[symbolHash]()
  } else {
    h = (
      hashProtoMap.get(Object.getPrototypeOf(value))
        ?? hashProtoMap.get(Object.prototype)
    )!(value as any)
  }
  CACHE.set(value, h)
  return h
}

function hashGeneric<A>(self: A) {
  if (typeof self === "number") {
    return hashNumber(self)
  }
  if (typeof self === "string") {
    return hashString(self)
  }
  if (typeof self === "symbol") {
    return hashString(String(self))
  }
  if (typeof self === "bigint") {
    return hashString(self.toString(10))
  }
  if (typeof self === "undefined") {
    return hashString("undefined")
  }
  if (typeof self === "object") {
    if (self == null) {
      return hashString("null")
    }
    return hashObject(self)
  }
  if (typeof self === "function") {
    if (CACHE.has(self)) {
      CACHE.set(self, isDeepEqual(self) ? self[symbolHash]() : hashNumber(pcgr.number()))
    }
    return CACHE.get(self)!
  }
}
