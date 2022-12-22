/**
 * @since 1.0.0
 */
import { pipe } from "@fp-ts/data/Function"
import { PCGRandom } from "@fp-ts/data/Random"

const hashCache = new WeakMap<object, number>()
const byRefCache = new WeakSet<object>()
const globals = Reflect.ownKeys(globalThis).flatMap((k) => {
  try {
    return typeof globalThis[k] === "function" &&
        k !== "Array" &&
        k !== "Object" &&
        "prototype" in globalThis[k] ?
      [globalThis[k]["prototype"]] :
      []
  } catch {
    return []
  }
})
const byRefProtoCache = new WeakSet<object>(globals)
const circularCache = new WeakMap<object, WeakSet<object>>()
const shortCircuitTags: Array<string> = ["_tag"]
const shortCircuitTagsSet: Set<string> = new Set(shortCircuitTags)

/**
 * @since 1.0.0
 */
export const considerByRef = <A extends object>(self: A) => {
  byRefCache.add(self)
  return self
}

/**
 * @since 1.0.0
 */
export const addTagToPreCheck = <K extends string>(self: K) => {
  if (!shortCircuitTagsSet.has(self)) {
    shortCircuitTags.push(self)
    shortCircuitTagsSet.add(self)
  }
}

/**
 * @since 1.0.0
 */
export const considerProtoByRef = <A extends object>(self: A) => {
  byRefProtoCache.add(self)
  return self
}

/**
 * @since 1.0.0
 * @category symbols
 */
export const symbolHash: unique symbol = Symbol.for("@fp-ts/data/Equal/hash")

/**
 * @since 1.0.0
 * @category symbols
 */
export const symbolEqual: unique symbol = Symbol.for("@fp-ts/data/Equal/equal")

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
  if (!hashCache.has(self)) {
    const h = hashOptimize(pcgr.integer(Number.MAX_SAFE_INTEGER))
    hashCache.set(self, h)
  }
  return hashCache.get(self)!
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
  const selfCircular = circularCache.get(self)
  let added = false

  if (selfCircular) {
    if (selfCircular.has(that)) {
      return true
    }
    selfCircular.add(that)
  } else {
    circularCache.set(self, new WeakSet([that]))
    added = true
  }

  try {
    for (let i = 0; i < shortCircuitTags.length; i++) {
      const tag = shortCircuitTags[i]!
      if (tag in self) {
        if (tag in that) {
          if (!equals(self[tag], that[tag])) {
            return false
          }
        } else {
          return false
        }
      }
    }

    const keysA = Object.getOwnPropertyNames(self)
    const keysB = Object.getOwnPropertyNames(that)

    if (keysA.length !== keysB.length) {
      return false
    }

    const keysBSet = new Set(Object.getOwnPropertyNames(that))

    for (const ka of keysA) {
      if (!shortCircuitTagsSet.has(ka)) {
        if (!keysBSet.has(ka)) {
          return false
        }
        const va = self[ka]
        const vb = that[ka]
        if (!equals(va, vb)) {
          return false
        }
      }
    }

    const symbolsA = Object.getOwnPropertySymbols(self)
    const symbolsB = Object.getOwnPropertySymbols(that)

    if (symbolsA.length !== symbolsB.length) {
      return false
    }

    const symbolsBSet = new Set(symbolsB)

    for (const ka of symbolsA) {
      if (!symbolsBSet.has(ka)) {
        return false
      }
      const va = self[ka]
      const vb = that[ka]
      if (!equals(va, vb)) {
        return false
      }
    }

    return true
  } finally {
    if (added) {
      circularCache.delete(self)
    } else {
      circularCache.get(self)?.delete(that)
    }
  }
}

const compareBothTable = {
  "object": (self: object, that: unknown) => {
    if (
      self == null ||
      that == null ||
      typeof that !== "object" ||
      byRefCache.has(self) ||
      byRefCache.has(that)
    ) {
      return false
    }

    const selfProto = Object.getPrototypeOf(self)
    const thatProto = Object.getPrototypeOf(that)

    if (byRefProtoCache.has(selfProto) || byRefProtoCache.has(thatProto)) {
      return false
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

    if (selfProto !== thatProto) {
      return false
    }

    if (selfProto === Array.prototype) {
      return (self as Array<any>).length === (that as Array<any>).length &&
        (self as Array<any>).every((v, i) => equals(v, that[i]))
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

function hashStructure(o: object): number {
  hashCache.set(o, hashNumber(pcgr.number()))
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

function hashObject(value: object): number {
  if (hashCache.has(value)) return hashCache.get(value)!
  if (byRefCache.has(value)) {
    hashCache.set(value, hashRandom(value))
    return hashCache.get(value)!
  }
  let h: number
  if (isDeepEqual(value)) {
    h = value[symbolHash]()
  } else {
    if (Object.getPrototypeOf(value) === Array.prototype) {
      h = hashArray(value as any)
    } else {
      h = hashStructure(value as any)
    }
  }
  hashCache.set(value, h)
  return h
}

function hashGeneric<A>(self: A): number
function hashGeneric(self: unknown) {
  switch (typeof self) {
    case "number": {
      return hashNumber(self)
    }
    case "bigint": {
      return hashString(self.toString(10))
    }
    case "boolean": {
      return hashString(String(self))
    }
    case "symbol": {
      return hashString(String(self))
    }
    case "string": {
      return hashString(self)
    }
    case "undefined": {
      return hashString("undefined")
    }
    case "object": {
      if (self == null) {
        return hashString("null")
      }
      return hashObject(self)
    }
    case "function": {
      if (!hashCache.has(self)) {
        hashCache.set(self, isDeepEqual(self) ? self[symbolHash]() : hashNumber(pcgr.number()))
      }
      return hashCache.get(self)!
    }
    default: {
      throw new Error("Bug in Equal.hashGeneric")
    }
  }
}
