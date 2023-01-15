/**
 * @since 1.0.0
 */
import * as MHashMap from "@fp-ts/data/MutableHashMap"

const TypeId: unique symbol = Symbol.for("@fp-ts/data/MutableHashSet") as TypeId

/**
 * @since 1.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * @since 1.0.0
 * @category models
 */
export interface MutableHashSet<K> extends Iterable<K> {
  readonly _id: TypeId
  readonly _V: (_: K) => K

  /** @internal */
  readonly keyMap: MHashMap.MutableHashMap<K, boolean>
}

/** @internal */
class MutableHashSetImpl<K> implements MutableHashSet<K> {
  readonly _id: TypeId = TypeId
  readonly _V: (_: K) => K = (_) => _

  constructor(readonly keyMap: MHashMap.MutableHashMap<K, boolean>) {}

  get length() {
    return this.keyMap.length
  }

  [Symbol.iterator](): Iterator<K> {
    return Array.from(this.keyMap).map(([_]) => _)[Symbol.iterator]()
  }

  toString() {
    return `MutableHashSet(${Array.from(this).map(String).join(", ")})`
  }

  toJSON() {
    return {
      _tag: "MutableHashSet",
      values: Array.from(this)
    }
  }

  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toJSON()
  }
}

/**
 * @since 1.0.0
 * @category constructors
 */
export const empty = <K = never>(): MutableHashSet<K> => new MutableHashSetImpl(MHashMap.empty())

/**
 * @since 1.0.0
 * @category constructors
 */
export const fromIterable = <K = never>(keys: Iterable<K>): MutableHashSet<K> =>
  new MutableHashSetImpl(MHashMap.fromIterable(Array.from(keys).map((k) => [k, true])))

/**
 * @since 1.0.0
 * @category constructors
 */
export const make = <Keys extends ReadonlyArray<unknown>>(
  ...keys: Keys
): MutableHashSet<Keys[number]> => fromIterable(keys)

/**
 * @since 1.0.0
 * @category elements
 */
export const has = <K>(key: K) =>
  (self: MutableHashSet<K>): boolean => MHashMap.has(key)(self.keyMap)

/**
 * @since 1.0.0
 * @category elements
 */
export const add = <K>(key: K) =>
  (self: MutableHashSet<K>): MutableHashSet<K> => (MHashMap.set(key, true)(self.keyMap), self)

/**
 * @since 1.0.0
 * @category elements
 */
export const remove = <K>(key: K) =>
  (self: MutableHashSet<K>): MutableHashSet<K> => (MHashMap.remove(key)(self.keyMap), self)

/**
 * @since 1.0.0
 * @category elements
 */
export const size = <K>(self: MutableHashSet<K>): number => MHashMap.size(self.keyMap)
