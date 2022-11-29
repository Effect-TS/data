import * as Equal from "@fp-ts/data/Equal"
import { identity, pipe } from "@fp-ts/data/Function"
import type * as HM from "@fp-ts/data/HashMap"
import { fromBitmap, hashFragment, toBitmap } from "@fp-ts/data/internal/HashMap/bitwise"
import { SIZE } from "@fp-ts/data/internal/HashMap/config"
import * as Node from "@fp-ts/data/internal/HashMap/node"
import * as Option from "@fp-ts/data/Option"
import type { Predicate, Refinement } from "@fp-ts/data/Predicate"

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

/** @internal */
export class HashMapImpl<K, V> implements HM.HashMap<K, V> {
  readonly _id: HM.TypeId = HashMapTypeId
  constructor(
    public _editable: boolean,
    public _edit: number,
    public _root: Node.Node<K, V>,
    public _size: number
  ) {}
  [Symbol.iterator](): Iterator<readonly [K, V]> {
    return new HashMapIterator(this, (k, v) => [k, v])
  }
  [Equal.symbolHash](): number {
    let hash = Equal.hash("HashMap")
    for (const item of this) {
      hash ^= Equal.hashCombine(Equal.hash(item[0]))(Equal.hash(item[1]))
    }
    return hash
  }

  [Equal.symbolEqual](that: unknown): boolean {
    if (isHashMap(that)) {
      if ((that as HashMapImpl<K, V>)._size !== this._size) {
        return false
      }
      for (const item of this) {
        const elem = pipe(
          that as HM.HashMap<K, V>,
          getHash(item[0], Equal.hash(item[0]))
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
  v: Option.Option<VisitResult<K, V, T>>

  constructor(readonly map: HashMapImpl<K, V>, readonly f: TraversalFn<K, V, T>) {
    this.v = visitLazy(this.map._root, this.f, undefined)
  }

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
  return (self: HM.HashMap<K, V>): Option.Option<V> => pipe(self, getHash(key, Equal.hash(key)))
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
    const element = pipe(self, getHash(key, Equal.hash(key)))
    if (Option.isNone(element)) {
      throw new Error("Expected map to contain key")
    }
    return element.value
  }
}

/** @internal */
export function has<K, V>(key: K) {
  return (self: HM.HashMap<K, V>): boolean => {
    return Option.isSome(pipe(self, getHash(key, Equal.hash(key))))
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
  return (self: HM.HashMap<K, V>): HM.HashMap<K, V> => modifyHash(key, Equal.hash(key), f)(self)
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
export function replace<K, V>(key: K, f: (v: V) => V) {
  return (self: HM.HashMap<K, V>): HM.HashMap<K, V> => {
    return pipe(self, modify(key, (maybe) => pipe(maybe, Option.map(f))))
  }
}

/** @internal */
export function union<K1, V1>(that: HM.HashMap<K1, V1>) {
  return <K0, V0>(self: HM.HashMap<K0, V0>): HM.HashMap<K0 | K1, V0 | V1> => {
    const result: HM.HashMap<K0 | K1, V0 | V1> = beginMutation(self)
    forEachWithIndex((v, k) => {
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
    return mapWithIndex<A, V, K>(f)(self)
  }
}

/**
 * Maps over the entries of the `HashMap` using the specified function.
 *
 * @since 1.0.0
 * @category mapping
 */
export function mapWithIndex<A, V, K>(f: (value: V, key: K) => A) {
  return (self: HM.HashMap<K, V>): HM.HashMap<K, A> => {
    return reduceWithIndex<HM.HashMap<K, A>, V, K>(
      empty<K, A>(),
      (map, value, key) => set(key, f(value, key))(map)
    )(self)
  }
}

/** @internal */
export function flatMap<K, A, B>(f: (value: A) => HM.HashMap<K, B>) {
  return (self: HM.HashMap<K, A>): HM.HashMap<K, B> => {
    return pipe(self, flatMapWithIndex(f))
  }
}

/** @internal */
export function flatMapWithIndex<A, K, B>(f: (value: A, key: K) => HM.HashMap<K, B>) {
  return (self: HM.HashMap<K, A>): HM.HashMap<K, B> => {
    return pipe(
      self,
      reduceWithIndex(empty<K, B>(), (zero, value, key) =>
        pipe(
          zero,
          mutate((map) =>
            pipe(
              f(value, key),
              forEachWithIndex((value, key) => {
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
    return pipe(self, forEachWithIndex(f))
  }
}

/** @internal */
export function forEachWithIndex<V, K>(f: (value: V, key: K) => void) {
  return (self: HM.HashMap<K, V>): void => {
    return pipe(self, reduceWithIndex(undefined as void, (_, value, key) => f(value, key)))
  }
}

/** @internal */
export function reduce<V, Z>(z: Z, f: (z: Z, v: V) => Z) {
  return <K>(self: HM.HashMap<K, V>): Z => {
    return reduceWithIndex<Z, V, K>(z, (z, v, _) => f(z, v))(self)
  }
}

/** @internal */
export function reduceWithIndex<Z, V, K>(zero: Z, f: (accumulator: Z, value: V, key: K) => Z) {
  return (self: HM.HashMap<K, V>): Z => {
    const root = (self as HashMapImpl<K, V>)._root
    if (root._tag === "LeafNode") {
      return Option.isSome(root.value) ? f(zero, root.value.value, root.key) : zero
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
              zero = f(zero, child.value.value, child.key)
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
    return pipe(self, filterWithIndex(f))
  }
}

/** @internal */
export function filterWithIndex<K, A, B extends A>(
  f: (a: A, k: K) => a is B
): (self: HM.HashMap<K, A>) => HM.HashMap<K, B>
export function filterWithIndex<K, A>(
  f: (a: A, k: K) => boolean
): (self: HM.HashMap<K, A>) => HM.HashMap<K, A>
export function filterWithIndex<K, A>(f: (a: A, k: K) => boolean) {
  return (self: HM.HashMap<K, A>): HM.HashMap<K, A> => {
    return pipe(
      empty<K, A>(),
      mutate((map) => {
        for (const [k, a] of self) {
          if (f(a, k)) {
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
    return pipe(self, filterMapWithIndex(f))
  }
}

/** @internal */
export function filterMapWithIndex<A, K, B>(f: (value: A, key: K) => Option.Option<B>) {
  return (self: HM.HashMap<K, A>): HM.HashMap<K, B> => {
    return pipe(
      empty<K, B>(),
      mutate((map) => {
        for (const [k, a] of self) {
          const option = f(a, k)
          if (Option.isSome(option)) {
            pipe(map, set(k, option.value))
          }
        }
      })
    )
  }
}
