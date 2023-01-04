import type * as Order from "@fp-ts/core/typeclass/Order"
import * as Chunk from "@fp-ts/data/Chunk"
import * as Equal from "@fp-ts/data/Equal"
import * as Hash from "@fp-ts/data/Hash"
import { Direction, RedBlackTreeIterator } from "@fp-ts/data/internal/RedBlackTree/iterator"
import * as Node from "@fp-ts/data/internal/RedBlackTree/node"
import { Stack } from "@fp-ts/data/internal/Stack"
import * as Option from "@fp-ts/data/Option"
import type * as Ordering from "@fp-ts/data/Ordering"
import type * as RBT from "@fp-ts/data/RedBlackTree"

const RedBlackTreeSymbolKey = "@fp-ts/data/RedBlackTree"
/** @internal */
export const RedBlackTreeTypeId: RBT.TypeId = Symbol.for(RedBlackTreeSymbolKey) as RBT.TypeId

export class RedBlackTreeImpl<K, V> implements RBT.RedBlackTree<K, V> {
  readonly _id: RBT.TypeId = RedBlackTreeTypeId

  constructor(
    readonly _ord: Order.Order<K>,
    readonly _root: Node.Node<K, V> | undefined
  ) {}

  [Hash.symbol](): number {
    return Hash.combine(Hash.hash(RedBlackTreeSymbolKey))(Hash.array(Array.from(this)))
  }

  [Equal.symbol](that: unknown): boolean {
    if (isRedBlackTree(that)) {
      if ((this._root?.count ?? 0) !== ((that as RedBlackTreeImpl<K, V>)._root?.count ?? 0)) {
        return false
      }
      return Equal.equals(Array.from(this), Array.from(that))
    }
    return false
  }

  [Symbol.iterator](): RedBlackTreeIterator<K, V> {
    const stack: Array<Node.Node<K, V>> = []
    let n = this._root
    while (n != null) {
      stack.push(n)
      n = n.left
    }
    return new RedBlackTreeIterator(this, stack, Direction.Forward)
  }

  toString() {
    return `RedBlackTree(${
      Array.from(this).map(([k, v]) => `[${String(k)}, ${String(v)}]`).join(", ")
    })`
  }

  toJSON() {
    return {
      _tag: "RedBlackTree",
      values: Array.from(this)
    }
  }

  [Symbol.for("nodejs.util.inspect.custom")]() {
    return this.toJSON()
  }
}

/** @internal */
export function isRedBlackTree<K, V>(u: Iterable<readonly [K, V]>): u is RBT.RedBlackTree<K, V>
export function isRedBlackTree(u: unknown): u is RBT.RedBlackTree<unknown, unknown>
export function isRedBlackTree(u: unknown): u is RBT.RedBlackTree<unknown, unknown> {
  return typeof u === "object" && u != null && "_id" in u && u["_id"] === RedBlackTreeTypeId
}

/** @internal */
export function empty<K, V = never>(ord: Order.Order<K>): RBT.RedBlackTree<K, V> {
  return new RedBlackTreeImpl<K, V>(ord, undefined)
}

/** @internal */
export function from<K, V>(ord: Order.Order<K>) {
  return (entries: Iterable<readonly [K, V]>): RBT.RedBlackTree<K, V> => {
    let tree = empty<K, V>(ord)
    for (const [key, value] of entries) {
      tree = insert(key, value)(tree)
    }
    return tree
  }
}

/** @internal */
export function make<K, Entries extends Array<readonly [K, any]>>(
  ord: Order.Order<K>
): (...entries: Entries) => RBT.RedBlackTree<
  K,
  Entries[number] extends readonly [any, infer V] ? V : never
> {
  return (...entries: Entries) => {
    return from<K, Entries[number] extends readonly [any, infer V] ? V : never>(ord)(entries)
  }
}

/** @internal */
export function keys(direction: RBT.RedBlackTree.Direction = Direction.Forward) {
  return <K, V>(self: RBT.RedBlackTree<K, V>): IterableIterator<K> => {
    const begin: RedBlackTreeIterator<K, V> = self[Symbol.iterator]() as RedBlackTreeIterator<K, V>
    let count = 0
    return {
      [Symbol.iterator]: () => keys(direction)(self),
      next: (): IteratorResult<K, number> => {
        count++
        const entry = begin.key
        if (direction === Direction.Forward) {
          begin.moveNext()
        } else {
          begin.movePrev()
        }
        switch (entry._tag) {
          case "None": {
            return { done: true, value: count }
          }
          case "Some": {
            return { done: false, value: entry.value }
          }
        }
      }
    }
  }
}

/** @internal */
export function values(direction: RBT.RedBlackTree.Direction = Direction.Forward) {
  return <K, V>(self: RBT.RedBlackTree<K, V>): IterableIterator<V> => {
    const begin: RedBlackTreeIterator<K, V> = self[Symbol.iterator]() as RedBlackTreeIterator<K, V>
    let count = 0
    return {
      [Symbol.iterator]: () => values(direction)(self),
      next: (): IteratorResult<V, number> => {
        count++
        const entry = begin.value
        if (direction === Direction.Forward) {
          begin.moveNext()
        } else {
          begin.movePrev()
        }
        switch (entry._tag) {
          case "None": {
            return { done: true, value: count }
          }
          case "Some": {
            return { done: false, value: entry.value }
          }
        }
      }
    }
  }
}

/** @internal */
export function first<K, V>(tree: RBT.RedBlackTree<K, V>): Option.Option<readonly [K, V]> {
  let node: Node.Node<K, V> | undefined = (tree as RedBlackTreeImpl<K, V>)._root
  let current: Node.Node<K, V> | undefined = (tree as RedBlackTreeImpl<K, V>)._root
  while (node != null) {
    current = node
    node = node.left
  }
  return current ? Option.some([current.key, current.value]) : Option.none
}

/** @internal */
export function last<K, V>(tree: RBT.RedBlackTree<K, V>): Option.Option<readonly [K, V]> {
  let node: Node.Node<K, V> | undefined = (tree as RedBlackTreeImpl<K, V>)._root
  let current: Node.Node<K, V> | undefined = (tree as RedBlackTreeImpl<K, V>)._root
  while (node != null) {
    current = node
    node = node.right
  }
  return current ? Option.some([current.key, current.value]) : Option.none
}

/** @internal */
export function size<K, V>(self: RBT.RedBlackTree<K, V>): number {
  return (self as RedBlackTreeImpl<K, V>)._root?.count ?? 0
}

/** @internal */
export function has<K>(key: K) {
  return <V>(self: RBT.RedBlackTree<K, V>): boolean => {
    return Option.isSome(findFirst(key)(self))
  }
}

/** @internal */
export function getAt(index: number) {
  return <K, V>(self: RBT.RedBlackTree<K, V>): Option.Option<readonly [K, V]> => {
    if (index < 0) {
      return Option.none
    }
    let root = (self as RedBlackTreeImpl<K, V>)._root
    let node: Node.Node<K, V> | undefined = undefined
    while (root != null) {
      node = root
      if (root.left) {
        if (index < root.left.count) {
          root = root.left
          continue
        }
        index -= root.left.count
      }
      if (!index) {
        return Option.some([node.key, node.value])
      }
      index -= 1
      if (root.right) {
        if (index >= root.right.count) {
          break
        }
        root = root.right
      } else {
        break
      }
    }
    return Option.none
  }
}

/** @internal */
export function getOrder<K, V>(tree: RBT.RedBlackTree<K, V>): Order.Order<K> {
  return (tree as RedBlackTreeImpl<K, V>)._ord
}

/** @internal */
export function find<K>(key: K) {
  return <V>(self: RBT.RedBlackTree<K, V>): Chunk.Chunk<V> => {
    const cmp = (self as RedBlackTreeImpl<K, V>)._ord.compare
    let node = (self as RedBlackTreeImpl<K, V>)._root
    let result = Chunk.empty<V>()
    while (node != null) {
      const d = cmp(node.key)(key)
      if (d === 0 && Equal.equals(key, node.key)) {
        result = Chunk.prepend(node.value)(result)
      }
      if (d <= 0) {
        node = node.left
      } else {
        node = node.right
      }
    }
    return result
  }
}

/** @internal */
export function findFirst<K>(key: K) {
  return <V>(self: RBT.RedBlackTree<K, V>): Option.Option<V> => {
    const cmp = (self as RedBlackTreeImpl<K, V>)._ord.compare
    let node = (self as RedBlackTreeImpl<K, V>)._root
    while (node != null) {
      const d = cmp(node.key)(key)
      if (Equal.equals(key, node.key)) {
        return Option.some(node.value)
      }
      if (d <= 0) {
        node = node.left
      } else {
        node = node.right
      }
    }
    return Option.none
  }
}

/** @internal */
export function insert<K, V>(key: K, value: V) {
  return (self: RBT.RedBlackTree<K, V>): RBT.RedBlackTree<K, V> => {
    const cmp = (self as RedBlackTreeImpl<K, V>)._ord.compare
    // Find point to insert new node at
    let n: Node.Node<K, V> | undefined = (self as RedBlackTreeImpl<K, V>)._root
    const n_stack: Array<Node.Node<K, V>> = []
    const d_stack: Array<Ordering.Ordering> = []
    while (n != null) {
      const d = cmp(n.key)(key)
      n_stack.push(n)
      d_stack.push(d)
      if (d <= 0) {
        n = n.left
      } else {
        n = n.right
      }
    }
    // Rebuild path to leaf node
    n_stack.push(new Node.Node(Node.Color.Red, key, value, undefined, undefined, 1))
    for (let s = n_stack.length - 2; s >= 0; --s) {
      const n2 = n_stack[s]!
      if (d_stack[s]! <= 0) {
        n_stack[s] = new Node.Node(
          n2.color,
          n2.key,
          n2.value,
          n_stack[s + 1],
          n2.right,
          n2.count + 1
        )
      } else {
        n_stack[s] = new Node.Node(
          n2.color,
          n2.key,
          n2.value,
          n2.left,
          n_stack[s + 1],
          n2.count + 1
        )
      }
    }
    // Rebalance tree using rotations
    for (let s = n_stack.length - 1; s > 1; --s) {
      const p = n_stack[s - 1]!
      const n3 = n_stack[s]!
      if (p.color === Node.Color.Black || n3.color === Node.Color.Black) {
        break
      }
      const pp = n_stack[s - 2]!
      if (pp.left === p) {
        if (p.left === n3) {
          const y = pp.right
          if (y && y.color === Node.Color.Red) {
            p.color = Node.Color.Black
            pp.right = Node.repaint(y, Node.Color.Black)
            pp.color = Node.Color.Red
            s -= 1
          } else {
            pp.color = Node.Color.Red
            pp.left = p.right
            p.color = Node.Color.Black
            p.right = pp
            n_stack[s - 2] = p
            n_stack[s - 1] = n3
            Node.recount(pp)
            Node.recount(p)
            if (s >= 3) {
              const ppp = n_stack[s - 3]!
              if (ppp.left === pp) {
                ppp.left = p
              } else {
                ppp.right = p
              }
            }
            break
          }
        } else {
          const y = pp.right
          if (y && y.color === Node.Color.Red) {
            p.color = Node.Color.Black
            pp.right = Node.repaint(y, Node.Color.Black)
            pp.color = Node.Color.Red
            s -= 1
          } else {
            p.right = n3.left
            pp.color = Node.Color.Red
            pp.left = n3.right
            n3.color = Node.Color.Black
            n3.left = p
            n3.right = pp
            n_stack[s - 2] = n3
            n_stack[s - 1] = p
            Node.recount(pp)
            Node.recount(p)
            Node.recount(n3)
            if (s >= 3) {
              const ppp = n_stack[s - 3]!
              if (ppp.left === pp) {
                ppp.left = n3
              } else {
                ppp.right = n3
              }
            }
            break
          }
        }
      } else {
        if (p.right === n3) {
          const y = pp.left
          if (y && y.color === Node.Color.Red) {
            p.color = Node.Color.Black
            pp.left = Node.repaint(y, Node.Color.Black)
            pp.color = Node.Color.Red
            s -= 1
          } else {
            pp.color = Node.Color.Red
            pp.right = p.left
            p.color = Node.Color.Black
            p.left = pp
            n_stack[s - 2] = p
            n_stack[s - 1] = n3
            Node.recount(pp)
            Node.recount(p)
            if (s >= 3) {
              const ppp = n_stack[s - 3]!
              if (ppp.right === pp) {
                ppp.right = p
              } else {
                ppp.left = p
              }
            }
            break
          }
        } else {
          const y = pp.left
          if (y && y.color === Node.Color.Red) {
            p.color = Node.Color.Black
            pp.left = Node.repaint(y, Node.Color.Black)
            pp.color = Node.Color.Red
            s -= 1
          } else {
            p.left = n3.right
            pp.color = Node.Color.Red
            pp.right = n3.left
            n3.color = Node.Color.Black
            n3.right = p
            n3.left = pp
            n_stack[s - 2] = n3
            n_stack[s - 1] = p
            Node.recount(pp)
            Node.recount(p)
            Node.recount(n3)
            if (s >= 3) {
              const ppp = n_stack[s - 3]!
              if (ppp.right === pp) {
                ppp.right = n3
              } else {
                ppp.left = n3
              }
            }
            break
          }
        }
      }
    }
    // Return new tree
    n_stack[0]!.color = Node.Color.Black
    return new RedBlackTreeImpl((self as RedBlackTreeImpl<K, V>)._ord, n_stack[0])
  }
}

/** @internal */
export function removeFirst<K>(key: K) {
  return <V>(self: RBT.RedBlackTree<K, V>): RBT.RedBlackTree<K, V> => {
    if (!has(key)(self)) {
      return self
    }
    const ord = (self as RedBlackTreeImpl<K, V>)._ord
    const cmp = ord.compare
    let node: Node.Node<K, V> | undefined = (self as RedBlackTreeImpl<K, V>)._root
    const stack = []
    while (node != null) {
      const d = cmp(node.key)(key)
      stack.push(node)
      if (Equal.equals(key, node.key)) {
        node = undefined
      } else if (d <= 0) {
        node = node.left
      } else {
        node = node.right
      }
    }
    if (stack.length === 0) {
      return self
    }
    const cstack = new Array<Node.Node<K, V>>(stack.length)
    let n = stack[stack.length - 1]!
    cstack[cstack.length - 1] = new Node.Node(
      n.color,
      n.key,
      n.value,
      n.left,
      n.right,
      n.count
    )
    for (let i = stack.length - 2; i >= 0; --i) {
      n = stack[i]!
      if (n.left === stack[i + 1]) {
        cstack[i] = new Node.Node(n.color, n.key, n.value, cstack[i + 1], n.right, n.count)
      } else {
        cstack[i] = new Node.Node(n.color, n.key, n.value, n.left, cstack[i + 1], n.count)
      }
    }
    // Get node
    n = cstack[cstack.length - 1]!
    // If not leaf, then swap with previous node
    if (n.left != null && n.right != null) {
      // First walk to previous leaf
      const split = cstack.length
      n = n.left
      while (n.right != null) {
        cstack.push(n)
        n = n.right
      }
      // Copy path to leaf
      const v = cstack[split - 1]
      cstack.push(new Node.Node(n.color, v!.key, v!.value, n.left, n.right, n.count))
      cstack[split - 1]!.key = n.key
      cstack[split - 1]!.value = n.value
      // Fix up stack
      for (let i = cstack.length - 2; i >= split; --i) {
        n = cstack[i]!
        cstack[i] = new Node.Node(n.color, n.key, n.value, n.left, cstack[i + 1], n.count)
      }
      cstack[split - 1]!.left = cstack[split]
    }

    // Remove leaf node
    n = cstack[cstack.length - 1]!
    if (n.color === Node.Color.Red) {
      // Easy case: removing red leaf
      const p = cstack[cstack.length - 2]!
      if (p.left === n) {
        p.left = undefined
      } else if (p.right === n) {
        p.right = undefined
      }
      cstack.pop()
      for (let i = 0; i < cstack.length; ++i) {
        cstack[i]!.count--
      }
      return new RedBlackTreeImpl(ord, cstack[0])
    } else {
      if (n.left != null || n.right != null) {
        // Second easy case:  Single child black parent
        if (n.left != null) {
          Node.swap(n, n.left)
        } else if (n.right != null) {
          Node.swap(n, n.right)
        }
        // Child must be red, so repaint it black to balance color
        n.color = Node.Color.Black
        for (let i = 0; i < cstack.length - 1; ++i) {
          cstack[i]!.count--
        }
        return new RedBlackTreeImpl(ord, cstack[0])
      } else if (cstack.length === 1) {
        // Third easy case: root
        return new RedBlackTreeImpl(ord, undefined)
      } else {
        // Hard case: Repaint n, and then do some nasty stuff
        for (let i = 0; i < cstack.length; ++i) {
          cstack[i]!.count--
        }
        const parent = cstack[cstack.length - 2]
        fixDoubleBlack(cstack)
        // Fix up links
        if (parent!.left === n) {
          parent!.left = undefined
        } else {
          parent!.right = undefined
        }
      }
    }
    return new RedBlackTreeImpl(ord, cstack[0])
  }
}

/** @internal */
export function at(index: number, direction: RBT.RedBlackTree.Direction = Direction.Forward) {
  return <K, V>(self: RBT.RedBlackTree<K, V>): Iterable<readonly [K, V]> => {
    return {
      [Symbol.iterator]: () => {
        if (index < 0) {
          return new RedBlackTreeIterator(self, [], direction)
        }
        let node = (self as RedBlackTreeImpl<K, V>)._root
        const stack: Array<Node.Node<K, V>> = []
        while (node != null) {
          stack.push(node)
          if (node.left != null) {
            if (index < node.left.count) {
              node = node.left
              continue
            }
            index -= node.left.count
          }
          if (!index) {
            return new RedBlackTreeIterator(self, stack, direction)
          }
          index -= 1
          if (node.right != null) {
            if (index >= node.right.count) {
              break
            }
            node = node.right
          } else {
            break
          }
        }
        return new RedBlackTreeIterator(self, [], direction)
      }
    }
  }
}

/** @internal */
export function backwards<K, V>(self: RBT.RedBlackTree<K, V>): Iterable<readonly [K, V]> {
  return {
    [Symbol.iterator]: () => {
      const stack: Array<Node.Node<K, V>> = []
      let node = (self as RedBlackTreeImpl<K, V>)._root
      while (node != null) {
        stack.push(node)
        node = node.right
      }
      return new RedBlackTreeIterator(self, stack, Direction.Backward)
    }
  }
}

/** @internal */
export function greaterThan<K>(key: K, direction: RBT.RedBlackTree.Direction = Direction.Forward) {
  return <V>(self: RBT.RedBlackTree<K, V>): Iterable<readonly [K, V]> => {
    return {
      [Symbol.iterator]: () => {
        const cmp = (self as RedBlackTreeImpl<K, V>)._ord.compare
        let node = (self as RedBlackTreeImpl<K, V>)._root
        const stack = []
        let last_ptr = 0
        while (node != null) {
          const d = cmp(node.key)(key)
          stack.push(node)
          if (d < 0) {
            last_ptr = stack.length
          }
          if (d < 0) {
            node = node.left
          } else {
            node = node.right
          }
        }
        stack.length = last_ptr
        return new RedBlackTreeIterator(self, stack, direction)
      }
    }
  }
}

/** @internal */
export function greaterThanEqual<K>(
  key: K,
  direction: RBT.RedBlackTree.Direction = Direction.Forward
) {
  return <V>(self: RBT.RedBlackTree<K, V>): Iterable<readonly [K, V]> => {
    return {
      [Symbol.iterator]: () => {
        const cmp = (self as RedBlackTreeImpl<K, V>)._ord.compare
        let node = (self as RedBlackTreeImpl<K, V>)._root
        const stack = []
        let last_ptr = 0
        while (node != null) {
          const d = cmp(node.key)(key)
          stack.push(node)
          if (d <= 0) {
            last_ptr = stack.length
          }
          if (d <= 0) {
            node = node.left
          } else {
            node = node.right
          }
        }
        stack.length = last_ptr
        return new RedBlackTreeIterator(self, stack, direction)
      }
    }
  }
}

/** @internal */
export function lessThan<K>(key: K, direction: RBT.RedBlackTree.Direction = Direction.Forward) {
  return <V>(self: RBT.RedBlackTree<K, V>): Iterable<readonly [K, V]> => {
    return {
      [Symbol.iterator]: () => {
        const cmp = (self as RedBlackTreeImpl<K, V>)._ord.compare
        let node = (self as RedBlackTreeImpl<K, V>)._root
        const stack = []
        let last_ptr = 0
        while (node != null) {
          const d = cmp(node.key)(key)
          stack.push(node)
          if (d > 0) {
            last_ptr = stack.length
          }
          if (d <= 0) {
            node = node.left
          } else {
            node = node.right
          }
        }
        stack.length = last_ptr
        return new RedBlackTreeIterator(self, stack, direction)
      }
    }
  }
}

/** @internal */
export function lessThanEqual<K>(
  key: K,
  direction: RBT.RedBlackTree.Direction = Direction.Forward
) {
  return <V>(self: RBT.RedBlackTree<K, V>): Iterable<readonly [K, V]> => {
    return {
      [Symbol.iterator]: () => {
        const cmp = (self as RedBlackTreeImpl<K, V>)._ord.compare
        let node = (self as RedBlackTreeImpl<K, V>)._root
        const stack = []
        let last_ptr = 0
        while (node != null) {
          const d = cmp(node.key)(key)
          stack.push(node)
          if (d >= 0) {
            last_ptr = stack.length
          }
          if (d < 0) {
            node = node.left
          } else {
            node = node.right
          }
        }
        stack.length = last_ptr
        return new RedBlackTreeIterator(self, stack, direction)
      }
    }
  }
}

/** @internal */
export function forEach<K, V>(f: (key: K, value: V) => void) {
  return (self: RBT.RedBlackTree<K, V>): void => {
    const root = (self as RedBlackTreeImpl<K, V>)._root
    if (root != null) {
      visitFull(root, (key, value) => {
        f(key, value)
        return Option.none
      })
    }
  }
}

/** @internal */
export function forEachGreaterThanEqual<K, V>(min: K, f: (key: K, value: V) => void) {
  return (self: RBT.RedBlackTree<K, V>): void => {
    const root = (self as RedBlackTreeImpl<K, V>)._root
    const ord = (self as RedBlackTreeImpl<K, V>)._ord
    if (root != null) {
      visitGreaterThanEqual(root, min, ord, (key, value) => {
        f(key, value)
        return Option.none
      })
    }
  }
}

/** @internal */
export function forEachLessThan<K, V>(max: K, f: (key: K, value: V) => void) {
  return (self: RBT.RedBlackTree<K, V>): void => {
    const root = (self as RedBlackTreeImpl<K, V>)._root
    const ord = (self as RedBlackTreeImpl<K, V>)._ord
    if (root != null) {
      visitLessThan(root, max, ord, (key, value) => {
        f(key, value)
        return Option.none
      })
    }
  }
}

/** @internal */
export function forEachBetween<K, V>(min: K, max: K, f: (key: K, value: V) => void) {
  return (self: RBT.RedBlackTree<K, V>): void => {
    const root = (self as RedBlackTreeImpl<K, V>)._root
    const ord = (self as RedBlackTreeImpl<K, V>)._ord
    if (root) {
      visitBetween(root, min, max, ord, (key, value) => {
        f(key, value)
        return Option.none
      })
    }
  }
}

/** @internal */
export function reduce<Z, V>(zero: Z, f: (accumulator: Z, value: V) => Z) {
  return <K>(self: RBT.RedBlackTree<K, V>): Z => {
    return reduceWithIndex(zero, (accumulator, value: V, _: K) => f(accumulator, value))(self)
  }
}

/** @internal */
export function reduceWithIndex<Z, V, K>(zero: Z, f: (accumulator: Z, value: V, key: K) => Z) {
  return (self: RBT.RedBlackTree<K, V>): Z => {
    let accumulator = zero
    for (const [key, value] of self) {
      accumulator = f(accumulator, value, key)
    }
    return accumulator
  }
}

function visitFull<K, V, A>(
  node: Node.Node<K, V>,
  visit: (key: K, value: V) => Option.Option<A>
): Option.Option<A> {
  let current: Node.Node<K, V> | undefined = node
  let stack: Stack<Node.Node<K, V>> | undefined = undefined
  let done = false
  while (!done) {
    if (current != null) {
      stack = new Stack(current, stack)
      current = current.left
    } else if (stack != null) {
      const value = visit(stack.value.key, stack.value.value)
      if (Option.isSome(value)) {
        return value
      }
      current = stack.value.right
      stack = stack.previous
    } else {
      done = true
    }
  }
  return Option.none
}

function visitGreaterThanEqual<K, V, A>(
  node: Node.Node<K, V>,
  min: K,
  ord: Order.Order<K>,
  visit: (key: K, value: V) => Option.Option<A>
): Option.Option<A> {
  let current: Node.Node<K, V> | undefined = node
  let stack: Stack<Node.Node<K, V>> | undefined = undefined
  let done = false
  while (!done) {
    if (current != null) {
      stack = new Stack(current, stack)
      if (ord.compare(current.key)(min) <= 0) {
        current = current.left
      } else {
        current = undefined
      }
    } else if (stack != null) {
      if (ord.compare(stack.value.key)(min) <= 0) {
        const value = visit(stack.value.key, stack.value.value)
        if (Option.isSome(value)) {
          return value
        }
      }
      current = stack.value.right
      stack = stack.previous
    } else {
      done = true
    }
  }
  return Option.none
}

function visitLessThan<K, V, A>(
  node: Node.Node<K, V>,
  max: K,
  ord: Order.Order<K>,
  visit: (key: K, value: V) => Option.Option<A>
): Option.Option<A> {
  let current: Node.Node<K, V> | undefined = node
  let stack: Stack<Node.Node<K, V>> | undefined = undefined
  let done = false
  while (!done) {
    if (current != null) {
      stack = new Stack(current, stack)
      current = current.left
    } else if (stack != null && ord.compare(stack.value.key)(max) > 0) {
      const value = visit(stack.value.key, stack.value.value)
      if (Option.isSome(value)) {
        return value
      }
      current = stack.value.right
      stack = stack.previous
    } else {
      done = true
    }
  }
  return Option.none
}

function visitBetween<K, V, A>(
  node: Node.Node<K, V>,
  min: K,
  max: K,
  ord: Order.Order<K>,
  visit: (key: K, value: V) => Option.Option<A>
): Option.Option<A> {
  let current: Node.Node<K, V> | undefined = node
  let stack: Stack<Node.Node<K, V>> | undefined = undefined
  let done = false
  while (!done) {
    if (current != null) {
      stack = new Stack(current, stack)
      if (ord.compare(current.key)(min) <= 0) {
        current = current.left
      } else {
        current = undefined
      }
    } else if (stack != null && ord.compare(stack.value.key)(max) > 0) {
      if (ord.compare(stack.value.key)(min) <= 0) {
        const value = visit(stack.value.key, stack.value.value)
        if (Option.isSome(value)) {
          return value
        }
      }
      current = stack.value.right
      stack = stack.previous
    } else {
      done = true
    }
  }
  return Option.none
}

/**
 * Fix up a double black node in a Red-Black Tree.
 */
function fixDoubleBlack<K, V>(stack: Array<Node.Node<K, V>>) {
  let n, p, s, z
  for (let i = stack.length - 1; i >= 0; --i) {
    n = stack[i]!
    if (i === 0) {
      n.color = Node.Color.Black
      return
    }
    p = stack[i - 1]!
    if (p.left === n) {
      s = p.right
      if (s != null && s.right != null && s.right.color === Node.Color.Red) {
        s = p.right = Node.clone(s)
        z = s.right = Node.clone(s.right!)
        p.right = s.left
        s.left = p
        s.right = z
        s.color = p.color
        n.color = Node.Color.Black
        p.color = Node.Color.Black
        z.color = Node.Color.Black
        Node.recount(p)
        Node.recount(s)
        if (i > 1) {
          const pp = stack[i - 2]!
          if (pp.left === p) {
            pp.left = s
          } else {
            pp.right = s
          }
        }
        stack[i - 1] = s
        return
      } else if (s != null && s.left != null && s.left.color === Node.Color.Red) {
        s = p.right = Node.clone(s)
        z = s.left = Node.clone(s.left!)
        p.right = z.left
        s.left = z.right
        z.left = p
        z.right = s
        z.color = p.color
        p.color = Node.Color.Black
        s.color = Node.Color.Black
        n.color = Node.Color.Black
        Node.recount(p)
        Node.recount(s)
        Node.recount(z)
        if (i > 1) {
          const pp = stack[i - 2]!
          if (pp.left === p) {
            pp.left = z
          } else {
            pp.right = z
          }
        }
        stack[i - 1] = z
        return
      }
      if (s != null && s.color === Node.Color.Black) {
        if (p.color === Node.Color.Red) {
          p.color = Node.Color.Black
          p.right = Node.repaint(s, Node.Color.Red)
          return
        } else {
          p.right = Node.repaint(s, Node.Color.Red)
          continue
        }
      } else if (s != null) {
        s = Node.clone(s)
        p.right = s.left
        s.left = p
        s.color = p.color
        p.color = Node.Color.Red
        Node.recount(p)
        Node.recount(s)
        if (i > 1) {
          const pp = stack[i - 2]!
          if (pp.left === p) {
            pp.left = s
          } else {
            pp.right = s
          }
        }
        stack[i - 1] = s
        stack[i] = p
        if (i + 1 < stack.length) {
          stack[i + 1] = n
        } else {
          stack.push(n)
        }
        i = i + 2
      }
    } else {
      s = p.left
      if (s && s.left && s.left.color === Node.Color.Red) {
        s = p.left = Node.clone(s)
        z = s.left = Node.clone(s.left!)
        p.left = s.right
        s.right = p
        s.left = z
        s.color = p.color
        n.color = Node.Color.Black
        p.color = Node.Color.Black
        z.color = Node.Color.Black
        Node.recount(p)
        Node.recount(s)
        if (i > 1) {
          const pp = stack[i - 2]!
          if (pp.right === p) {
            pp.right = s
          } else {
            pp.left = s
          }
        }
        stack[i - 1] = s
        return
      } else if (s != null && s.right != null && s.right.color === Node.Color.Red) {
        s = p.left = Node.clone(s)
        z = s.right = Node.clone(s.right!)
        p.left = z.right
        s.right = z.left
        z.right = p
        z.left = s
        z.color = p.color
        p.color = Node.Color.Black
        s.color = Node.Color.Black
        n.color = Node.Color.Black
        Node.recount(p)
        Node.recount(s)
        Node.recount(z)
        if (i > 1) {
          const pp = stack[i - 2]!
          if (pp.right === p) {
            pp.right = z
          } else {
            pp.left = z
          }
        }
        stack[i - 1] = z
        return
      }
      if (s != null && s.color === Node.Color.Black) {
        if (p.color === Node.Color.Red) {
          p.color = Node.Color.Black
          p.left = Node.repaint(s, Node.Color.Red)
          return
        } else {
          p.left = Node.repaint(s, Node.Color.Red)
          continue
        }
      } else if (s != null) {
        s = Node.clone(s)
        p.left = s.right
        s.right = p
        s.color = p.color
        p.color = Node.Color.Red
        Node.recount(p)
        Node.recount(s)
        if (i > 1) {
          const pp = stack[i - 2]!
          if (pp.right === p) {
            pp.right = s
          } else {
            pp.left = s
          }
        }
        stack[i - 1] = s
        stack[i] = p
        if (i + 1 < stack.length) {
          stack[i + 1] = n
        } else {
          stack.push(n)
        }
        i = i + 2
      }
    }
  }
}
