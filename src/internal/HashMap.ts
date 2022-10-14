import { identity, pipe } from "@fp-ts/core/Function"
import * as Option from "@fp-ts/core/Option"
import type { Predicate } from "@fp-ts/core/Predicate"
import type { Refinement } from "@fp-ts/core/Refinement"
import * as Equal from "@fp-ts/data/Equal"
import * as Hash from "@fp-ts/data/Hash"
import type * as HM from "@fp-ts/data/HashMap"
import { fromBitmap, hashFragment, toBitmap } from "@fp-ts/data/internal/HashMap/bitwise"
import { SIZE } from "@fp-ts/data/internal/HashMap/config"
import * as Node from "@fp-ts/data/internal/HashMap/node"

/** @internal */
export const HashMapTypeId: HM.TypeId = Symbol.for("@fp-ts/data/HashMap") as HM.TypeId

type TraversalFn<K, V, A> = (k: K, v: V) => A

type Cont<K, V, A> =
  | [
    len: number,
    children: Array<Node.Node<K, V>>,
    i: number,
    f: TraversalFn<K, V, A>,
    cont: Cont<K, V, A>
  ]
  | undefined

interface VisitResult<K, V, A> {
  value: A
  cont: Cont<K, V, A>
}

function variance<A, B>(_: A): B {
  return _ as unknown as B
}

/** @internal */
export class HashMapImpl<K, V> implements HM.HashMap<K, V> {
  readonly _id: HM.TypeId = HashMapTypeId
  readonly _Key: (_: never) => K = variance
  readonly _Value: (_: never) => V = variance
  constructor(
    public _editable: boolean,
    public _edit: number,
    public _root: Node.Node<K, V>,
    public _size: number
  ) {}
  [Symbol.iterator](): Iterator<readonly [K, V]> {
    return new HashMapIterator(this, (k, v) => [k, v])
  }
  [Hash.symbol](): number {
    let hash = Hash.evaluate("HashMap")
    for (const item of this) {
      hash ^= Hash.combine(Hash.evaluate(item[0]))(Hash.evaluate(item[1]))
    }
    return hash
  }

  [Equal.symbol](that: unknown): boolean {
    if (isHashMap(that)) {
      if ((that as HashMapImpl<K, V>)._size !== this._size) {
        return false
      }
      for (const item of this) {
        const elem = pipe(
          that as HM.HashMap<K, V>,
          getHash(item[0], Hash.evaluate(item[0]))
        )
        if (Option.isNone(elem)) {
          return false
        } else {
          if (!Equal.equals(item[1], elem.value)) {
            return false
          }
        }
      }
      return true
    }
    return false
  }
}

class HashMapIterator<K, V, T> implements IterableIterator<T> {
  v = visitLazy(this.map._root, this.f, undefined)

  constructor(readonly map: HashMapImpl<K, V>, readonly f: TraversalFn<K, V, T>) {}

  next(): IteratorResult<T> {
    if (Option.isNone(this.v)) {
      return { done: true, value: undefined }
    }
    const v0 = this.v.value
    this.v = applyCont(v0.cont)
    return { done: false, value: v0.value }
  }

  [Symbol.iterator](): IterableIterator<T> {
    return new HashMapIterator(this.map, this.f)
  }
}

function applyCont<K, V, A>(cont: Cont<K, V, A>) {
  return cont
    ? visitLazyChildren(cont[0], cont[1], cont[2], cont[3], cont[4])
    : Option.none
}

function visitLazy<K, V, A>(
  node: Node.Node<K, V>,
  f: TraversalFn<K, V, A>,
  cont: Cont<K, V, A> = undefined
): Option.Option<VisitResult<K, V, A>> {
  switch (node._tag) {
    case "LeafNode": {
      return Option.isSome(node.value)
        ? Option.some({
          value: f(node.key, node.value.value),
          cont
        })
        : applyCont(cont)
    }
    case "CollisionNode":
    case "ArrayNode":
    case "IndexedNode": {
      const children = node.children
      return visitLazyChildren(children.length, children, 0, f, cont)
    }
    default: {
      return applyCont(cont)
    }
  }
}

function visitLazyChildren<K, V, A>(
  len: number,
  children: Array<Node.Node<K, V>>,
  i: number,
  f: TraversalFn<K, V, A>,
  cont: Cont<K, V, A>
): Option.Option<VisitResult<K, V, A>> {
  while (i < len) {
    const child = children[i++]
    if (child && !Node.isEmptyNode(child)) {
      return visitLazy(child, f, [len, children, i, f, cont])
    }
  }
  return applyCont(cont)
}

/** @internal */
export function empty<K = never, V = never>(): HM.HashMap<K, V> {
  return new HashMapImpl<K, V>(false, 0, new Node.EmptyNode(), 0)
}

/** @internal */
export function make<Entries extends ReadonlyArray<readonly [any, any]>>(
  ...entries: Entries
): HM.HashMap<
  Entries[number] extends readonly [infer K, any] ? K : never,
  Entries[number] extends readonly [any, infer V] ? V : never
> {
  return from(entries)
}

/** @internal */
export function from<K, V>(entries: Iterable<readonly [K, V]>): HM.HashMap<K, V> {
  const map = beginMutation(empty<K, V>())
  for (const entry of entries) {
    set(entry[0], entry[1])(map)
  }
  return endMutation(map)
}

/** @internal */
export function isHashMap<K, V>(u: Iterable<readonly [K, V]>): u is HM.HashMap<K, V>
export function isHashMap(u: unknown): u is HM.HashMap<unknown, unknown>
export function isHashMap(u: unknown): u is HM.HashMap<unknown, unknown> {
  return typeof u === "object" && u != null && "_id" in u && u["_id"] === HashMapTypeId
}

/** @internal */
export function isEmpty<K, V>(self: HM.HashMap<K, V>): boolean {
  return self && Node.isEmptyNode((self as HashMapImpl<K, V>)._root)
}

/** @internal */
export function get<K, V>(key: K) {
  return (self: HM.HashMap<K, V>): Option.Option<V> => pipe(self, getHash(key, Hash.evaluate(key)))
}

/** @internal */
export function getHash<K, V>(key: K, hash: number) {
  return (self: HM.HashMap<K, V>): Option.Option<V> => {
    let node = (self as HashMapImpl<K, V>)._root
    let shift = 0
    // eslint-disable-next-line no-constant-condition
    while (true) {
      switch (node._tag) {
        case "LeafNode": {
          return Equal.equals(key, node.key) ? node.value : Option.none
        }
        case "CollisionNode": {
          if (hash === node.hash) {
            const children = node.children
            for (let i = 0, len = children.length; i < len; ++i) {
              const child = children[i]!
              if ("key" in child && Equal.equals(key, child.key)) return child.value
            }
          }
          return Option.none
        }
        case "IndexedNode": {
          const frag = hashFragment(shift, hash)
          const bit = toBitmap(frag)
          if (node.mask & bit) {
            node = node.children[fromBitmap(node.mask, bit)]!
            shift += SIZE
            break
          }
          return Option.none
        }
        case "ArrayNode": {
          node = node.children[hashFragment(shift, hash)]!
          if (node) {
            shift += SIZE
            break
          }
          return Option.none
        }
        default:
          return Option.none
      }
    }
  }
}

/** @internal */
export function unsafeGet<K, V>(key: K) {
  return (self: HM.HashMap<K, V>): V => {
    const element = pipe(self, getHash(key, Hash.evaluate(key)))
    if (Option.isNone(element)) {
      throw new Error("Expected map to contain key")
    }
    return element.value
  }
}

/** @internal */
export function has<K, V>(key: K) {
  return (self: HM.HashMap<K, V>): boolean => {
    return Option.isSome(pipe(self, getHash(key, Hash.evaluate(key))))
  }
}

/** @internal */
export function hasHash<K, V>(key: K, hash: number) {
  return (self: HM.HashMap<K, V>): boolean => {
    return Option.isSome(pipe(self, getHash(key, hash)))
  }
}

/** @internal */
export function set<K, V>(key: K, value: V) {
  return (self: HM.HashMap<K, V>): HM.HashMap<K, V> => {
    return pipe(self, modify(key, () => Option.some(value)))
  }
}

/** @internal */
export function setTree<K, V>(newRoot: Node.Node<K, V>, newSize: number) {
  return (self: HM.HashMap<K, V>): HM.HashMap<K, V> => {
    if ((self as HashMapImpl<K, V>)._editable) {
      ;(self as HashMapImpl<K, V>)._root = newRoot
      ;(self as HashMapImpl<K, V>)._size = newSize
      return self
    }
    return newRoot === (self as HashMapImpl<K, V>)._root
      ? self
      : new HashMapImpl(
        (self as HashMapImpl<K, V>)._editable,
        (self as HashMapImpl<K, V>)._edit,
        newRoot,
        newSize
      )
  }
}

/** @internal */
export function keys<K, V>(self: HM.HashMap<K, V>): IterableIterator<K> {
  return new HashMapIterator(self as HashMapImpl<K, V>, (key) => key)
}

/** @internal */
export function values<K, V>(self: HM.HashMap<K, V>): IterableIterator<V> {
  return new HashMapIterator(self as HashMapImpl<K, V>, (_, value) => value)
}

/** @internal */
export function size<K, V>(self: HM.HashMap<K, V>): number {
  return (self as HashMapImpl<K, V>)._size
}

/** @internal */
export function beginMutation<K, V>(self: HM.HashMap<K, V>): HM.HashMap<K, V> {
  return new HashMapImpl(
    true,
    (self as HashMapImpl<K, V>)._edit + 1,
    (self as HashMapImpl<K, V>)._root,
    (self as HashMapImpl<K, V>)._size
  )
}

/** @internal */
export function endMutation<K, V>(self: HM.HashMap<K, V>): HM.HashMap<K, V> {
  ;(self as HashMapImpl<K, V>)._editable = false
  return self
}

/** @internal */
export function mutate<K, V>(f: (self: HM.HashMap<K, V>) => void) {
  return (self: HM.HashMap<K, V>): HM.HashMap<K, V> => {
    const transient = beginMutation(self)
    f(transient)
    return endMutation(transient)
  }
}

/** @internal */
export function modify<K, V>(key: K, f: Node.UpdateFn<V>) {
  return (self: HM.HashMap<K, V>): HM.HashMap<K, V> => modifyHash(key, Hash.evaluate(key), f)(self)
}

/** @internal */
export function modifyHash<K, V>(key: K, hash: number, f: Node.UpdateFn<V>) {
  return (self: HM.HashMap<K, V>): HM.HashMap<K, V> => {
    const size = { value: (self as HashMapImpl<K, V>)._size }
    const newRoot = (self as HashMapImpl<K, V>)._root.modify(
      (self as HashMapImpl<K, V>)._editable ?
        (self as HashMapImpl<K, V>)._edit :
        NaN,
      0,
      f,
      hash,
      key,
      size
    )
    return pipe(self, setTree(newRoot, size.value))
  }
}

/** @internal */
export function update<K, V>(key: K, f: (v: V) => V) {
  return (self: HM.HashMap<K, V>): HM.HashMap<K, V> => {
    return pipe(self, modify(key, (maybe) => pipe(maybe, Option.map(f))))
  }
}

/** @internal */
export function union<K1, V1>(that: HM.HashMap<K1, V1>) {
  return <K0, V0>(self: HM.HashMap<K0, V0>): HM.HashMap<K0 | K1, V0 | V1> => {
    const result: HM.HashMap<K0 | K1, V0 | V1> = beginMutation(self)
    forEachWithIndex((k, v) => {
      set(k, v)(result)
    })(that)
    return endMutation(result)
  }
}

/** @internal */
export function remove<K>(key: K) {
  return <V>(self: HM.HashMap<K, V>): HM.HashMap<K, V> => {
    return modify<K, V>(key, () => Option.none)(self)
  }
}

/** @internal */
export function removeMany<K>(keys: Iterable<K>) {
  return <V>(self: HM.HashMap<K, V>): HM.HashMap<K, V> => {
    return mutate<K, V>((map) => {
      for (const key of keys) {
        remove(key)(map)
      }
    })(self)
  }
}

/** @internal */
export function map<V, A>(f: (value: V) => A) {
  return <K>(self: HM.HashMap<K, V>): HM.HashMap<K, A> => {
    return mapWithIndex<K, V, A>((_, value) => f(value))(self)
  }
}

/**
 * Maps over the entries of the `HashMap` using the specified function.
 *
 * @since 1.0.0
 * @category mapping
 */
export function mapWithIndex<K, V, A>(f: (key: K, value: V) => A) {
  return (self: HM.HashMap<K, V>): HM.HashMap<K, A> => {
    return reduceWithIndex<K, V, HM.HashMap<K, A>>(
      empty<K, A>(),
      (map, key, value) => set(key, f(key, value))(map)
    )(self)
  }
}

/** @internal */
export function flatMap<K, A, B>(f: (value: A) => HM.HashMap<K, B>) {
  return (self: HM.HashMap<K, A>): HM.HashMap<K, B> => {
    return pipe(self, flatMapWithIndex((_, a) => f(a)))
  }
}

/** @internal */
export function flatMapWithIndex<K, A, B>(f: (key: K, value: A) => HM.HashMap<K, B>) {
  return (self: HM.HashMap<K, A>): HM.HashMap<K, B> => {
    return pipe(
      self,
      reduceWithIndex(empty<K, B>(), (zero, key, value) =>
        pipe(
          zero,
          mutate((map) =>
            pipe(
              f(key, value),
              forEachWithIndex((key, value) => {
                pipe(map, set(key, value))
              })
            )
          )
        ))
    )
  }
}

/** @internal */
export function forEach<V>(f: (value: V) => void) {
  return <K>(self: HM.HashMap<K, V>): void => {
    return pipe(self, forEachWithIndex((_, value) => f(value)))
  }
}

/** @internal */
export function forEachWithIndex<K, V>(f: (key: K, value: V) => void) {
  return (self: HM.HashMap<K, V>): void => {
    return pipe(self, reduceWithIndex(undefined as void, (_, key, value) => f(key, value)))
  }
}

/** @internal */
export function reduce<V, Z>(z: Z, f: (z: Z, v: V) => Z) {
  return <K>(self: HM.HashMap<K, V>): Z => {
    return reduceWithIndex<K, V, Z>(z, (z, _, v) => f(z, v))(self)
  }
}

/** @internal */
export function reduceWithIndex<K, V, Z>(zero: Z, f: (accumulator: Z, key: K, value: V) => Z) {
  return (self: HM.HashMap<K, V>): Z => {
    const root = (self as HashMapImpl<K, V>)._root
    if (root._tag === "LeafNode") {
      return Option.isSome(root.value) ? f(zero, root.key, root.value.value) : zero
    }
    if (root._tag === "EmptyNode") {
      return zero
    }
    const toVisit = [root.children]
    let children
    while ((children = toVisit.pop())) {
      for (let i = 0, len = children.length; i < len;) {
        const child = children[i++]
        if (child && !Node.isEmptyNode(child)) {
          if (child._tag === "LeafNode") {
            if (Option.isSome(child.value)) {
              zero = f(zero, child.key, child.value.value)
            }
          } else toVisit.push(child.children)
        }
      }
    }
    return zero
  }
}

/** @internal */
export function filter<A, B extends A>(
  f: Refinement<A, B>
): <K>(self: HM.HashMap<K, A>) => HM.HashMap<K, B>
export function filter<A>(
  f: Predicate<A>
): <K>(self: HM.HashMap<K, A>) => HM.HashMap<K, A>
export function filter<A>(f: Predicate<A>) {
  return <K>(self: HM.HashMap<K, A>): HM.HashMap<K, A> => {
    return pipe(self, filterWithIndex((_, a) => f(a)))
  }
}

/** @internal */
export function filterWithIndex<K, A, B extends A>(
  f: (k: K, a: A) => a is B
): (self: HM.HashMap<K, A>) => HM.HashMap<K, B>
export function filterWithIndex<K, A>(
  f: (k: K, a: A) => boolean
): (self: HM.HashMap<K, A>) => HM.HashMap<K, A>
export function filterWithIndex<K, A>(f: (k: K, a: A) => boolean) {
  return (self: HM.HashMap<K, A>): HM.HashMap<K, A> => {
    return pipe(
      empty<K, A>(),
      mutate((map) => {
        for (const [k, a] of self) {
          if (f(k, a)) {
            pipe(map, set(k, a))
          }
        }
      })
    )
  }
}

/** @internal */
export function compact<K, A>(self: HM.HashMap<K, Option.Option<A>>): HM.HashMap<K, A> {
  return pipe(self, filterMap(identity))
}

/** @internal */
export function filterMap<A, B>(f: (value: A) => Option.Option<B>) {
  return <K>(self: HM.HashMap<K, A>): HM.HashMap<K, B> => {
    return pipe(self, filterMapWithIndex((_, a) => f(a)))
  }
}

/** @internal */
export function filterMapWithIndex<K, A, B>(f: (key: K, value: A) => Option.Option<B>) {
  return (self: HM.HashMap<K, A>): HM.HashMap<K, B> => {
    return pipe(
      empty<K, B>(),
      mutate((map) => {
        for (const [k, a] of self) {
          const option = f(k, a)
          if (Option.isSome(option)) {
            pipe(map, set(k, option.value))
          }
        }
      })
    )
  }
}
