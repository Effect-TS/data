/**
 * @since 1.0.0
 */
import * as Dual from "@fp-ts/data/Dual"
import * as MutableHashMap from "@fp-ts/data/MutableHashMap"

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
export interface MutableHashSet<V> extends Iterable<V> {
  readonly _id: TypeId
  readonly _V: (_: V) => V

  /** @internal */
  readonly keyMap: MutableHashMap.MutableHashMap<V, boolean>
}

/** @internal */
class MutableHashSetImpl<V> implements MutableHashSet<V> {
  readonly _id: TypeId = TypeId
  readonly _V: (_: V) => V = (_) => _

  constructor(readonly keyMap: MutableHashMap.MutableHashMap<V, boolean>) {}

  get length() {
    return this.keyMap.length
  }

  [Symbol.iterator](): Iterator<V> {
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
export const empty = <K = never>(): MutableHashSet<K> =>
  new MutableHashSetImpl(MutableHashMap.empty())

/**
 * @since 1.0.0
 * @category constructors
 */
export const fromIterable = <K = never>(keys: Iterable<K>): MutableHashSet<K> =>
  new MutableHashSetImpl(MutableHashMap.fromIterable(Array.from(keys).map((k) => [k, true])))

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
export const add: {
  <V>(self: MutableHashSet<V>, key: V): MutableHashSet<V>
  <V>(key: V): (self: MutableHashSet<V>) => MutableHashSet<V>
} = Dual.dual<
  <V>(self: MutableHashSet<V>, key: V) => MutableHashSet<V>,
  <V>(key: V) => (self: MutableHashSet<V>) => MutableHashSet<V>
>(2, (self, key) => (MutableHashMap.set(self.keyMap, key, true), self))

/**
 * @since 1.0.0
 * @category elements
 */
export const has: {
  <V>(self: MutableHashSet<V>, key: V): boolean
  <V>(key: V): (self: MutableHashSet<V>) => boolean
} = Dual.dual<
  <V>(self: MutableHashSet<V>, key: V) => boolean,
  <V>(key: V) => (self: MutableHashSet<V>) => boolean
>(2, (self, key) => MutableHashMap.has(self.keyMap, key))

/**
 * @since 1.0.0
 * @category elements
 */
export const remove: {
  <V>(self: MutableHashSet<V>, key: V): MutableHashSet<V>
  <V>(key: V): (self: MutableHashSet<V>) => MutableHashSet<V>
} = Dual.dual<
  <V>(self: MutableHashSet<V>, key: V) => MutableHashSet<V>,
  <V>(key: V) => (self: MutableHashSet<V>) => MutableHashSet<V>
>(2, (self, key) => (MutableHashMap.remove(self.keyMap, key), self))

/**
 * @since 1.0.0
 * @category elements
 */
export const size = <V>(self: MutableHashSet<V>): number => MutableHashMap.size(self.keyMap)
