/**
 * @since 1.0.0
 */
import { pipe } from "@fp-ts/core/Function"

/**
 * @since 1.0.0
 * @category model
 */
export const DeepHash: DeepHashConstructor = {
  symbol: Symbol.for("@fp-ts/data/DeepHash") as DeepHashConstructor["symbol"]
}

/**
 * @since 1.0.0
 * @category model
 */
export interface DeepHash {
  readonly [DeepHash.symbol]: () => number
}

/**
 * @since 1.0.0
 * @category model
 */
export interface DeepHashConstructor {
  readonly symbol: unique symbol
}

/**
 * @since 1.0.0
 * @category hashing
 */
export const deepHash: <A>(self: A) => number = <A>(self: A) => {
  return optimize(hash(self))
}

/**
 * @since 1.0.0
 * @category combining
 */
export const combine: (b: number) => (self: number) => number = (b) => (self) => (self * 53) ^ b

function isDeepHash(u: unknown): u is DeepHash {
  return typeof u === "object" && u !== null && DeepHash.symbol in u
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
  CACHE.set(o, number(Math.random()))
  const keys = Object.keys(o)
  let h = 12289
  for (let i = 0; i < keys.length; i++) {
    h ^= pipe(string(keys[i]!), combine(deepHash((o as any)[keys[i]!])))
  }
  return h
}

function array(arr: ReadonlyArray<any>): number {
  let h = 6151
  for (let i = 0; i < arr.length; i++) {
    h = pipe(h, combine(deepHash(arr[i])))
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
    h = value[DeepHash.symbol]()
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

function hash<A>(self: A) {
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
      CACHE.set(self, isDeepHash(self) ? self[DeepHash.symbol]() : number(Math.random()))
    }
    return CACHE.get(self)!
  }
}
