import * as Ord from "@fp-ts/core/Sortable"
import * as Equal from "@fp-ts/data/Equal"
import { pipe } from "@fp-ts/data/Function"
import * as number from "@fp-ts/data/Number"
import * as Option from "@fp-ts/data/Option"
import * as RedBlackTree from "@fp-ts/data/RedBlackTree"
import { deepStrictEqual } from "@fp-ts/data/test/util"

describe.concurrent("RedBlackTree", () => {
  it("forEach", () => {
    const ordered: Array<[number, string]> = []
    pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e"),
      RedBlackTree.forEach((n, s) => {
        ordered.push([n, s])
      })
    )

    deepStrictEqual(ordered, [
      [-2, "d"],
      [-1, "c"],
      [0, "b"],
      [1, "a"],
      [3, "e"]
    ])
  })

  it("iterable", () => {
    const tree = pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e")
    )

    assert.strictEqual(RedBlackTree.size(tree), 5)
    deepStrictEqual(Array.from(tree), [
      [-2, "d"],
      [-1, "c"],
      [0, "b"],
      [1, "a"],
      [3, "e"]
    ])
  })

  it("iterable empty", () => {
    const tree = RedBlackTree.empty<number, string>(number.Order)

    assert.strictEqual(RedBlackTree.size(tree), 0)
    deepStrictEqual(Array.from(tree), [])
  })

  it("backwards", () => {
    const tree = pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e")
    )

    assert.strictEqual(RedBlackTree.size(tree), 5)
    deepStrictEqual(Array.from(RedBlackTree.backwards(tree)), [
      [3, "e"],
      [1, "a"],
      [0, "b"],
      [-1, "c"],
      [-2, "d"]
    ])
  })

  it("backwards empty", () => {
    const tree = RedBlackTree.empty<number, string>(number.Order)

    assert.strictEqual(RedBlackTree.size(tree), 0)
    deepStrictEqual(Array.from(RedBlackTree.backwards(tree)), [])
  })

  it("values", () => {
    const tree = pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e")
    )

    assert.strictEqual(RedBlackTree.size(tree), 5)
    deepStrictEqual(Array.from(RedBlackTree.values()(tree)), ["d", "c", "b", "a", "e"])
  })

  it("keys", () => {
    const tree = pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e")
    )

    assert.strictEqual(RedBlackTree.size(tree), 5)
    deepStrictEqual(Array.from(RedBlackTree.keys()(tree)), [-2, -1, 0, 1, 3])
  })

  it("begin/end", () => {
    const tree = pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e")
    )

    deepStrictEqual(RedBlackTree.first(tree), Option.some([-2, "d"] as const))
    deepStrictEqual(RedBlackTree.last(tree), Option.some([3, "e"] as const))
    deepStrictEqual(RedBlackTree.getAt(1)(tree), Option.some([-1, "c"] as const))
  })

  it("forEachGreaterThanEqual", () => {
    const ordered: Array<[number, string]> = []
    pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e"),
      RedBlackTree.forEachGreaterThanEqual(0, (k, v) => {
        ordered.push([k, v])
      })
    )

    deepStrictEqual(ordered, [[0, "b"], [1, "a"], [3, "e"]])
  })

  it("forEachLessThan", () => {
    const ordered: Array<[number, string]> = []
    pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e"),
      RedBlackTree.forEachLessThan(0, (k, v) => {
        ordered.push([k, v])
      })
    )

    deepStrictEqual(ordered, [[-2, "d"], [-1, "c"]])
  })

  it("forEachBetween", () => {
    const ordered: Array<[number, string]> = []
    pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e"),
      RedBlackTree.forEachBetween(-1, 2, (k, v) => {
        ordered.push([k, v])
      })
    )

    deepStrictEqual(ordered, [[-1, "c"], [0, "b"], [1, "a"]])
  })

  it("greaterThanEqual", () => {
    const tree = pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(0, "b"),
      RedBlackTree.insert(-1, "c"),
      RedBlackTree.insert(-2, "d"),
      RedBlackTree.insert(3, "e")
    )

    deepStrictEqual(Array.from(RedBlackTree.greaterThanEqual(0)(tree)), [
      [0, "b"],
      [1, "a"],
      [3, "e"]
    ])
    deepStrictEqual(
      Array.from(RedBlackTree.greaterThanEqual(0, RedBlackTree.Direction.Backward)(tree)),
      [
        [0, "b"],
        [-1, "c"],
        [-2, "d"]
      ]
    )
  })

  it("find", () => {
    const tree = pipe(
      RedBlackTree.empty<number, string>(number.Order),
      RedBlackTree.insert(1, "a"),
      RedBlackTree.insert(2, "c"),
      RedBlackTree.insert(1, "b"),
      RedBlackTree.insert(3, "d"),
      RedBlackTree.insert(1, "e")
    )

    deepStrictEqual(Array.from(RedBlackTree.find(1)(tree)), ["e", "b", "a"])
  })

  it("find Eq/Ord", () => {
    class Key {
      constructor(readonly n: number, readonly s: string) {}

      [Equal.symbolHash](): number {
        return Equal.hashCombine(Equal.hash(this.n))(Equal.hash(this.s))
      }

      [Equal.symbolEqual](that: unknown): boolean {
        return that instanceof Key && this.n === that.n && this.s === that.s
      }
    }

    const ord = pipe(number.Order, Ord.contramap((key: Key) => key.n))

    const tree = pipe(
      RedBlackTree.empty<Key, string>(ord),
      RedBlackTree.insert(new Key(1, "0"), "a"),
      RedBlackTree.insert(new Key(2, "0"), "c"),
      RedBlackTree.insert(new Key(1, "1"), "b"),
      RedBlackTree.insert(new Key(3, "0"), "d"),
      RedBlackTree.insert(new Key(1, "0"), "e"),
      RedBlackTree.insert(new Key(1, "0"), "f"),
      RedBlackTree.insert(new Key(1, "1"), "g")
    )

    deepStrictEqual(Array.from(RedBlackTree.values()(tree)), ["g", "f", "e", "b", "a", "c", "d"])
    deepStrictEqual(Array.from(RedBlackTree.find(new Key(1, "0"))(tree)), ["f", "e", "a"])
    deepStrictEqual(
      Array.from(RedBlackTree.values()(RedBlackTree.removeFirst(new Key(1, "1"))(tree))),
      [
        "f",
        "e",
        "b",
        "a",
        "c",
        "d"
      ]
    )
    deepStrictEqual(
      Array.from(RedBlackTree.values()(RedBlackTree.removeFirst(new Key(1, "0"))(tree))),
      [
        "g",
        "f",
        "e",
        "b",
        "c",
        "d"
      ]
    )
  })
})
