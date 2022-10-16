/**
 * @since 1.0.0
 */
import { pipe } from "@fp-ts/data/Function"
import { PCGRandom } from "@fp-ts/data/internal/Random"

/**
 * @since 1.0.0
 * @category models
 */
export const Hash: HashConstructor = {
  symbol: Symbol.for("@fp-ts/data/DeepHash") as HashConstructor["symbol"]
}

/**
 * @since 1.0.0
 * @category symbol
 */
export const symbol: HashConstructor["symbol"] = Hash.symbol

/**
 * @since 1.0.0
 * @category models
 */
export interface Hash {
  readonly [Hash.symbol]: () => number
}

/**
 * @since 1.0.0
 * @category models
 */
export interface HashConstructor {
  readonly symbol: unique symbol
}

/**
 * @since 1.0.0
 * @category hashing
 */
export const evaluate: <A>(self: A) => number = <A>(self: A) => {
  return optimize(computeHash(self))
}

const pcgr = new PCGRandom()

/**
 * @since 1.0.0
 * @category hashing
 */
export const random: <A extends object>(self: A) => number = (self) => {
  if (!CACHE.has(self)) {
    const h = optimize(pcgr.number())
    CACHE.set(self, h)
  }
  return CACHE.get(self)!
}

/**
 * @since 1.0.0
 * @category combining
 */
export const combine: (b: number) => (self: number) => number = (b) => (self) => (self * 53) ^ b

function isDeepHash(u: unknown): u is Hash {
  return typeof u === "object" && u !== null && Hash.symbol in u
}

function number(n: number) {
  if (n !== n || n === Infinity) return 0
  let h = n | 0
  if (h !== n) h ^= n * 0xffffffff
  while (n > 0xffffffff) h ^= n /= 0xffffffff
  return n
}

function string(str: string): number {
  let h = 5381,
    i = str.length
  while (i) h = (h * 33) ^ str.charCodeAt(--i)
  return h
}

const CACHE = new WeakMap()

function structure(o: object): number {
  CACHE.set(o, number(pcgr.number()))
  const keys = Object.keys(o)
  let h = 12289
  for (let i = 0; i < keys.length; i++) {
    h ^= pipe(string(keys[i]!), combine(evaluate((o as any)[keys[i]!])))
  }
  return h
}

function array(arr: ReadonlyArray<any>): number {
  let h = 6151
  for (let i = 0; i < arr.length; i++) {
    h = pipe(h, combine(evaluate(arr[i])))
  }
  return h
}

const protoMap = new Map<any, (_: any) => number>([
  [Array.prototype, array],
  [Object.prototype, structure]
])

function object(value: object): number {
  if (CACHE.has(value)) return CACHE.get(value)
  let h: number
  if (isDeepHash(value)) {
    h = value[Hash.symbol]()
  } else {
    h = (
      protoMap.get(Object.getPrototypeOf(value))
        ?? protoMap.get(Object.prototype)
    )!(value as any)
  }
  CACHE.set(value, h)
  return h
}

function optimize(n: number) {
  return (n & 0xbfffffff) | ((n >>> 1) & 0x40000000)
}

function computeHash<A>(self: A) {
  if (typeof self === "number") {
    return number(self)
  }
  if (typeof self === "string") {
    return string(self)
  }
  if (typeof self === "symbol") {
    return string(String(self))
  }
  if (typeof self === "bigint") {
    return string(self.toString(10))
  }
  if (typeof self === "undefined") {
    return string("undefined")
  }
  if (typeof self === "object") {
    if (self == null) {
      return string("null")
    }
    return object(self)
  }
  if (typeof self === "function") {
    if (CACHE.has(self)) {
      CACHE.set(self, isDeepHash(self) ? self[Hash.symbol]() : number(pcgr.number()))
    }
    return CACHE.get(self)!
  }
}
