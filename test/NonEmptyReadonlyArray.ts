import * as Order from "@fp-ts/core/typeclass/Order"
import type { Endomorphism } from "@fp-ts/data/Endomorphism"
import { identity, pipe } from "@fp-ts/data/Function"
import * as NonEmptyReadonlyArray from "@fp-ts/data/NonEmptyReadonlyArray"
import * as Number from "@fp-ts/data/Number"
import * as Option from "@fp-ts/data/Option"
import * as String from "@fp-ts/data/String"
import { assertTrue, deepStrictEqual, double, strictEqual } from "@fp-ts/data/test/util"
import { assert } from "vitest"

describe.concurrent("NonEmptyReadonlyArray", () => {
  it("instances and derived exports", () => {
    expect(NonEmptyReadonlyArray.Invariant).exist
    expect(NonEmptyReadonlyArray.imap).exist
    expect(NonEmptyReadonlyArray.tupled).exist
    expect(NonEmptyReadonlyArray.bindTo).exist

    expect(NonEmptyReadonlyArray.Covariant).exist
    expect(NonEmptyReadonlyArray.map).exist
    expect(NonEmptyReadonlyArray.let).exist
    expect(NonEmptyReadonlyArray.flap).exist
    expect(NonEmptyReadonlyArray.as).exist
    expect(NonEmptyReadonlyArray.asUnit).exist

    expect(NonEmptyReadonlyArray.Of).exist
    expect(NonEmptyReadonlyArray.of).exist
    expect(NonEmptyReadonlyArray.Do).exist

    expect(NonEmptyReadonlyArray.Pointed).exist

    expect(NonEmptyReadonlyArray.FlatMap).exist
    expect(NonEmptyReadonlyArray.flatMap).exist
    expect(NonEmptyReadonlyArray.flatten).exist
    expect(NonEmptyReadonlyArray.andThen).exist
    expect(NonEmptyReadonlyArray.composeKleisliArrow).exist

    expect(NonEmptyReadonlyArray.Chainable).exist
    expect(NonEmptyReadonlyArray.bind).exist
    expect(NonEmptyReadonlyArray.tap).exist
    expect(NonEmptyReadonlyArray.andThenDiscard).exist

    expect(NonEmptyReadonlyArray.Monad).exist

    expect(NonEmptyReadonlyArray.NonEmptyProduct).exist
    expect(NonEmptyReadonlyArray.product).exist
    expect(NonEmptyReadonlyArray.productMany).exist

    expect(NonEmptyReadonlyArray.Product).exist
    expect(NonEmptyReadonlyArray.productAll).exist
    // expect(NonEmptyReadonlyArray.tuple).exist
    // expect(NonEmptyReadonlyArray.struct).exist

    expect(NonEmptyReadonlyArray.NonEmptyApplicative).exist
    expect(NonEmptyReadonlyArray.liftSemigroup).exist
    expect(NonEmptyReadonlyArray.lift2).exist
    expect(NonEmptyReadonlyArray.lift3).exist
    expect(NonEmptyReadonlyArray.ap).exist
    expect(NonEmptyReadonlyArray.andThenDiscard).exist
    expect(NonEmptyReadonlyArray.andThen).exist

    expect(NonEmptyReadonlyArray.Applicative).exist
    expect(NonEmptyReadonlyArray.liftMonoid).exist

    expect(NonEmptyReadonlyArray.Foldable).exist
    expect(NonEmptyReadonlyArray.reduce).exist
    expect(NonEmptyReadonlyArray.reduceRight).exist
    expect(NonEmptyReadonlyArray.foldMap).exist
    expect(NonEmptyReadonlyArray.reduceKind).exist
    expect(NonEmptyReadonlyArray.reduceRightKind).exist
    expect(NonEmptyReadonlyArray.foldMapKind).exist

    expect(NonEmptyReadonlyArray.Traversable).exist
    expect(NonEmptyReadonlyArray.traverse).exist
    expect(NonEmptyReadonlyArray.sequence).exist
    expect(NonEmptyReadonlyArray.traverseTap).exist
  })

  describe.concurrent("pipeables", () => {
    it("traverse", () => {
      const traverse = NonEmptyReadonlyArray.traverse(Option.Applicative)
      deepStrictEqual(
        pipe(
          NonEmptyReadonlyArray.make(1, 2, 3),
          traverse((n) => (n >= 0 ? Option.some(n) : Option.none))
        ),
        Option.some(NonEmptyReadonlyArray.make(1, 2, 3))
      )
      deepStrictEqual(
        pipe(
          NonEmptyReadonlyArray.make(1, 2, 3),
          traverse((n) => (n >= 2 ? Option.some(n) : Option.none))
        ),
        Option.none
      )
    })

    it("sequence", () => {
      const sequence = NonEmptyReadonlyArray.sequence(Option.Applicative)
      deepStrictEqual(
        sequence([Option.some(1), Option.some(2), Option.some(3)]),
        Option.some(NonEmptyReadonlyArray.make(1, 2, 3))
      )
      deepStrictEqual(sequence([Option.none, Option.some(2), Option.some(3)]), Option.none)
    })

    it("traverseWithIndex", () => {
      deepStrictEqual(
        pipe(
          NonEmptyReadonlyArray.make("a", "bb"),
          NonEmptyReadonlyArray.traverseWithIndex(Option.Applicative)((
            s,
            i
          ) => (s.length >= 1 ? Option.some(s + i) : Option.none))
        ),
        Option.some(NonEmptyReadonlyArray.make("a0", "bb1"))
      )
      deepStrictEqual(
        pipe(
          NonEmptyReadonlyArray.make("a", "bb"),
          NonEmptyReadonlyArray.traverseWithIndex(Option.Applicative)((
            s,
            i
          ) => (s.length > 1 ? Option.some(s + i) : Option.none))
        ),
        Option.none
      )
    })
  })

  it("head", () => {
    deepStrictEqual(NonEmptyReadonlyArray.head(NonEmptyReadonlyArray.make(1, 2)), 1)
  })

  it("tail", () => {
    deepStrictEqual(NonEmptyReadonlyArray.tail(NonEmptyReadonlyArray.make(1, 2)), [2])
  })

  it("map", () => {
    deepStrictEqual(
      pipe(
        NonEmptyReadonlyArray.make(1, 2),
        NonEmptyReadonlyArray.map((n) => n * 2)
      ),
      [2, 4]
    )
  })

  it("mapWithIndex", () => {
    const add = (s: string, i: number) => s + i
    deepStrictEqual(
      pipe(NonEmptyReadonlyArray.make("a", "b"), NonEmptyReadonlyArray.mapWithIndex(add)),
      ["a0", "b1"]
    )
  })

  it("of", () => {
    deepStrictEqual(NonEmptyReadonlyArray.of(1), [1])
  })

  it("ap", () => {
    const fab: NonEmptyReadonlyArray.NonEmptyReadonlyArray<(n: number) => number> = [
      double,
      double
    ]
    deepStrictEqual(pipe(fab, NonEmptyReadonlyArray.ap(NonEmptyReadonlyArray.make(1, 2))), [
      2,
      4,
      2,
      4
    ])
  })

  it("flatMap", () => {
    const f = (a: number): NonEmptyReadonlyArray.NonEmptyReadonlyArray<number> => [a, 4]
    deepStrictEqual(pipe(NonEmptyReadonlyArray.make(1, 2), NonEmptyReadonlyArray.flatMap(f)), [
      1,
      4,
      2,
      4
    ])
  })

  it("extend", () => {
    const sum = (as: NonEmptyReadonlyArray.NonEmptyReadonlyArray<number>): number => {
      const head = NonEmptyReadonlyArray.head(as)
      assertTrue(typeof (head as any) === "number")
      return Number.MonoidSum.combineAll([head, ...NonEmptyReadonlyArray.tail(as)])
    }
    deepStrictEqual(pipe([1, 2, 3, 4], NonEmptyReadonlyArray.extend(sum)), [10, 9, 7, 4])
    deepStrictEqual(pipe([1], NonEmptyReadonlyArray.extend(sum)), [1])
  })

  it("min", () => {
    deepStrictEqual(NonEmptyReadonlyArray.min(Number.Order)([2, 1, 3]), 1)
    deepStrictEqual(NonEmptyReadonlyArray.min(Number.Order)([3]), 3)
  })

  it("max", () => {
    deepStrictEqual(
      NonEmptyReadonlyArray.max(Number.Order)(NonEmptyReadonlyArray.make(1, 2, 3)),
      3
    )
    deepStrictEqual(NonEmptyReadonlyArray.max(Number.Order)([1]), 1)
  })

  it("reduce", () => {
    deepStrictEqual(
      pipe(
        ["a", "b"],
        NonEmptyReadonlyArray.reduce("", (b, a) => b + a)
      ),
      "ab"
    )
  })

  it("foldMap", () => {
    deepStrictEqual(
      pipe(
        NonEmptyReadonlyArray.make("a", "b", "c"),
        NonEmptyReadonlyArray.foldMap(String.Monoid)(identity)
      ),
      "abc"
    )
  })

  it("reduceRight", () => {
    const f = (a: string, acc: string) => acc + a
    deepStrictEqual(pipe(["a", "b", "c"], NonEmptyReadonlyArray.reduceRight("", f)), "cba")
  })

  it("from", () => {
    deepStrictEqual(NonEmptyReadonlyArray.from([]), Option.none)
    deepStrictEqual(
      NonEmptyReadonlyArray.from([1]),
      Option.some(NonEmptyReadonlyArray.make(1))
    )
    deepStrictEqual(
      NonEmptyReadonlyArray.from([1, 2]),
      Option.some(NonEmptyReadonlyArray.make(1, 2))
    )
  })

  // TODO
  // it("getSemigroup", () => {
  //   const S = NonEmptyReadonlyArray.getSemigroup<number>()
  //   deepStrictEqual(S.combine([2])([1]), NonEmptyReadonlyArray.make(1, 2))
  //   deepStrictEqual(S.combine([3, 4])(NonEmptyReadonlyArray.make(1, 2)), [1, 2, 3, 4])
  // })

  it("group", () => {
    deepStrictEqual(NonEmptyReadonlyArray.group([1, 2, 1, 1]), [[1], [2], [1, 1]])
    deepStrictEqual(NonEmptyReadonlyArray.group([1, 2, 1, 1, 3]), [[1], [2], [1, 1], [3]])
  })

  // TODO
  // it("groupSort", () => {
  //   deepStrictEqual(NonEmptyReadonlyArray.groupSort([1, 2, 1, 1]), [[1, 1, 1], [2]])
  // })

  it("last", () => {
    deepStrictEqual(NonEmptyReadonlyArray.last(NonEmptyReadonlyArray.make(1, 2, 3)), 3)
    deepStrictEqual(NonEmptyReadonlyArray.last([1]), 1)
  })

  it("init", () => {
    deepStrictEqual(
      NonEmptyReadonlyArray.init(NonEmptyReadonlyArray.make(1, 2, 3)),
      NonEmptyReadonlyArray.make(1, 2)
    )
    deepStrictEqual(NonEmptyReadonlyArray.init([1]), [])
  })

  it("sort", () => {
    const sort = NonEmptyReadonlyArray.sort(Number.Order)
    deepStrictEqual(sort([3, 2, 1]), NonEmptyReadonlyArray.make(1, 2, 3))
    // should optimize `1`-length `NonEmptyReadonlyArray`s
    const singleton: NonEmptyReadonlyArray.NonEmptyReadonlyArray<number> = [1]
    strictEqual(sort(singleton), singleton)
  })

  it("prependAll", () => {
    deepStrictEqual(NonEmptyReadonlyArray.prependAll(0)(NonEmptyReadonlyArray.make(1, 2, 3)), [
      0,
      1,
      0,
      2,
      0,
      3
    ])
    deepStrictEqual(NonEmptyReadonlyArray.prependAll(0)([1]), [0, 1])
    deepStrictEqual(NonEmptyReadonlyArray.prependAll(0)([1, 2, 3, 4]), [0, 1, 0, 2, 0, 3, 0, 4])
  })

  it("intersperse", () => {
    deepStrictEqual(NonEmptyReadonlyArray.intersperse(0)(NonEmptyReadonlyArray.make(1, 2, 3)), [
      1,
      0,
      2,
      0,
      3
    ])
    deepStrictEqual(NonEmptyReadonlyArray.intersperse(0)([1]), [1])
    deepStrictEqual(NonEmptyReadonlyArray.intersperse(0)(NonEmptyReadonlyArray.make(1, 2)), [
      1,
      0,
      2
    ])
    deepStrictEqual(NonEmptyReadonlyArray.intersperse(0)([1, 2, 3, 4]), [1, 0, 2, 0, 3, 0, 4])
  })

  it("intercalate", () => {
    deepStrictEqual(NonEmptyReadonlyArray.intercalate(String.Semigroup)("-")(["a"]), "a")
    deepStrictEqual(
      NonEmptyReadonlyArray.intercalate(String.Semigroup)("-")(["a", "b", "c"]),
      "a-b-c"
    )
    deepStrictEqual(
      NonEmptyReadonlyArray.intercalate(String.Semigroup)("-")(["a", "", "c"]),
      "a--c"
    )
    deepStrictEqual(NonEmptyReadonlyArray.intercalate(String.Semigroup)("-")(["a", "b"]), "a-b")
    deepStrictEqual(
      NonEmptyReadonlyArray.intercalate(String.Semigroup)("-")(["a", "b", "c", "d"]),
      "a-b-c-d"
    )
  })

  it("reverse", () => {
    const singleton: NonEmptyReadonlyArray.NonEmptyReadonlyArray<number> = [1]
    strictEqual(NonEmptyReadonlyArray.reverse(singleton), singleton)
    deepStrictEqual(NonEmptyReadonlyArray.reverse(NonEmptyReadonlyArray.make(1, 2, 3)), [3, 2, 1])
  })

  it("groupBy", () => {
    deepStrictEqual(NonEmptyReadonlyArray.groupBy((_) => "")([]), {})
    deepStrictEqual(NonEmptyReadonlyArray.groupBy((a) => `${a}`)([1]), { "1": [1] })
    deepStrictEqual(
      NonEmptyReadonlyArray.groupBy((s: string) => `${s.length}`)(["foo", "bar", "foobar"]),
      {
        "3": ["foo", "bar"],
        "6": ["foobar"]
      }
    )
  })

  // TODO
  // it("insertAt", () => {
  //   const make = (x: number) => ({ x })
  //   const a1 = make(1)
  //   const a2 = make(1)
  //   const a3 = make(2)
  //   const a4 = make(3)
  //   deepStrictEqual(pipe([], NonEmptyReadonlyArray.insertAt(1, 1)), Option.none)
  //   deepStrictEqual(
  //     NonEmptyReadonlyArray.insertAt(0, a4)([a1, a2, a3]),
  //     Option.some([a4, a1, a2, a3])
  //   )
  //   deepStrictEqual(NonEmptyReadonlyArray.insertAt(-1, a4)([a1, a2, a3]), Option.none)
  //   deepStrictEqual(
  //     NonEmptyReadonlyArray.insertAt(3, a4)([a1, a2, a3]),
  //     Option.some([a1, a2, a3, a4])
  //   )
  //   deepStrictEqual(
  //     NonEmptyReadonlyArray.insertAt(1, a4)([a1, a2, a3]),
  //     Option.some([a1, a4, a2, a3])
  //   )
  //   deepStrictEqual(NonEmptyReadonlyArray.insertAt(4, a4)([a1, a2, a3]), Option.none)
  // })

  it("updateAt", () => {
    const make2 = (x: number) => ({ x })
    const a1 = make2(1)
    const a2 = make2(1)
    const a3 = make2(2)
    const a4 = make2(3)
    const arr: NonEmptyReadonlyArray.NonEmptyReadonlyArray<{ readonly x: number }> = [a1, a2, a3]
    deepStrictEqual(
      NonEmptyReadonlyArray.updateAt(0, a4)(arr),
      Option.some(NonEmptyReadonlyArray.make(a4, a2, a3))
    )
    deepStrictEqual(NonEmptyReadonlyArray.updateAt(-1, a4)(arr), Option.none)
    deepStrictEqual(NonEmptyReadonlyArray.updateAt(3, a4)(arr), Option.none)
    deepStrictEqual(
      NonEmptyReadonlyArray.updateAt(1, a4)(arr),
      Option.some(NonEmptyReadonlyArray.make(a1, a4, a3))
    )
    // should return the same reference if nothing changed
    const r1 = NonEmptyReadonlyArray.updateAt(0, a1)(arr)
    if (Option.isSome(r1)) {
      deepStrictEqual(r1.value, arr)
    } else {
      assert.fail("is not a Some")
    }
    const r2 = NonEmptyReadonlyArray.updateAt(2, a3)(arr)
    if (Option.isSome(r2)) {
      deepStrictEqual(r2.value, arr)
    } else {
      assert.fail("is not a Some")
    }
  })

  it("modifyAt", () => {
    deepStrictEqual(NonEmptyReadonlyArray.modifyAt(1, double)([1]), Option.none)
    deepStrictEqual(
      NonEmptyReadonlyArray.modifyAt(1, double)(NonEmptyReadonlyArray.make(1, 2)),
      Option.some([1, 4] as const)
    )
    // should return the same reference if nothing changed
    const input: NonEmptyReadonlyArray.NonEmptyReadonlyArray<number> = NonEmptyReadonlyArray.make(
      1,
      2,
      3
    )
    deepStrictEqual(
      pipe(
        input,
        NonEmptyReadonlyArray.modifyAt(1, identity),
        Option.map((out) => out === input)
      ),
      Option.some(true)
    )
  })

  // TODO
  // it("filter", () => {
  //   const make = (x: number) => ({ x })
  //   const a1 = make(1)
  //   const a2 = make(1)
  //   const a3 = make(2)
  //   deepStrictEqual(
  //     NonEmptyReadonlyArray.filter(({ x }) => x !== 1)([a1, a2, a3]),
  //     Option.some([a3])
  //   )
  //   deepStrictEqual(
  //     NonEmptyReadonlyArray.filter(({ x }) => x !== 2)([a1, a2, a3]),
  //     Option.some([a1, a2])
  //   )
  //   deepStrictEqual(
  //     NonEmptyReadonlyArray.filter(({ x }) => {
  //       return !(x === 1 || x === 2)
  //     })([a1, a2, a3]),
  //     Option.none
  //   )
  //   deepStrictEqual(
  //     NonEmptyReadonlyArray.filter(({ x }) => x !== 10)([a1, a2, a3]),
  //     Option.some([a1, a2, a3])
  //   )

  //   // refinements
  //   const actual1 = NonEmptyReadonlyArray.filter(Option.isSome)([
  //     Option.some(3),
  //     Option.some(2),
  //     Option.some(1)
  //   ])
  //   deepStrictEqual(actual1, Option.some([Option.some(3), Option.some(2), Option.some(1)]))
  //   const actual2 = NonEmptyReadonlyArray.filter(Option.isSome)([
  //     Option.some(3),
  //     Option.none,
  //     Option.some(1)
  //   ])
  //   deepStrictEqual(actual2, Option.some([Option.some(3), Option.some(1)]))
  // })

  // TODO
  // it("filterWithIndex", () => {
  //   deepStrictEqual(
  //     NonEmptyReadonlyArray.filterWithIndex((i) => i % 2 === 0)(
  //       NonEmptyReadonlyArray.make(1, 2, 3)
  //     ),
  //     Option.some([1, 3])
  //   )
  //   deepStrictEqual(
  //     NonEmptyReadonlyArray.filterWithIndex((i, a: number) => i % 2 === 1 && a > 2)(
  //       NonEmptyReadonlyArray.make(1, 2, 3)
  //     ),
  //     Option.none
  //   )
  // })

  it("reduceWithIndex", () => {
    deepStrictEqual(
      pipe(
        ["a", "b"],
        NonEmptyReadonlyArray.reduceWithIndex("", (i, b, a) => b + i + a)
      ),
      "0a1b"
    )
  })

  it("foldMapWithIndex", () => {
    deepStrictEqual(
      pipe(
        NonEmptyReadonlyArray.make("a", "b"),
        NonEmptyReadonlyArray.foldMapWithIndex(String.Monoid)((i, a) => i + a)
      ),
      "0a1b"
    )
  })

  it("reduceRightWithIndex", () => {
    deepStrictEqual(
      pipe(
        ["a", "b"],
        NonEmptyReadonlyArray.reduceRightWithIndex("", (i, a, b) => b + i + a)
      ),
      "1b0a"
    )
  })

  it("prepend", () => {
    deepStrictEqual(
      pipe(NonEmptyReadonlyArray.make(2, 3, 4), NonEmptyReadonlyArray.prepend(1)),
      NonEmptyReadonlyArray.make(1, 2, 3, 4)
    )
  })

  it("append", () => {
    deepStrictEqual(NonEmptyReadonlyArray.append(0)([]), [0])
    deepStrictEqual(NonEmptyReadonlyArray.append(4)([1, 2, 3]), [1, 2, 3, 4])
  })

  it("unprepend", () => {
    deepStrictEqual(NonEmptyReadonlyArray.unprepend([0]), [0, []])
    deepStrictEqual(NonEmptyReadonlyArray.unprepend([1, 2, 3, 4]), [1, [2, 3, 4]])
  })

  it("unappend", () => {
    deepStrictEqual(NonEmptyReadonlyArray.unappend([0]), [[], 0])
    deepStrictEqual(NonEmptyReadonlyArray.unappend([1, 2, 3, 4]), [
      NonEmptyReadonlyArray.make(1, 2, 3),
      4
    ])
    deepStrictEqual(NonEmptyReadonlyArray.unappend([0]), [[], 0])
    deepStrictEqual(NonEmptyReadonlyArray.unappend([1, 2, 3, 4]), [
      NonEmptyReadonlyArray.make(1, 2, 3),
      4
    ])
  })

  it("alt", () => {
    deepStrictEqual(
      pipe(
        NonEmptyReadonlyArray.make("a"),
        NonEmptyReadonlyArray.orElse(NonEmptyReadonlyArray.make("b"))
      ),
      ["a", "b"]
    )
  })

  it("foldMap", () => {
    const f = NonEmptyReadonlyArray.foldMap(Number.SemigroupSum)((s: string) => s.length)
    deepStrictEqual(f(["a"]), 1)
    deepStrictEqual(f(NonEmptyReadonlyArray.make("a", "bb")), 3)
  })

  it("foldMapWithIndex", () => {
    const f = NonEmptyReadonlyArray.foldMapWithIndex(Number.SemigroupSum)((i: number, s: string) =>
      s.length + i
    )
    deepStrictEqual(f(["a"]), 1)
    deepStrictEqual(f(NonEmptyReadonlyArray.make("a", "bb")), 4)
  })

  it("concatAll", () => {
    const f = NonEmptyReadonlyArray.combineAll(String.Semigroup)
    deepStrictEqual(f(["a"]), "a")
    deepStrictEqual(f(NonEmptyReadonlyArray.make("a", "bb")), "abb")
  })

  it("do notation", () => {
    deepStrictEqual(
      pipe(
        NonEmptyReadonlyArray.of(1),
        NonEmptyReadonlyArray.bindTo("a"),
        NonEmptyReadonlyArray.bind("b", () => NonEmptyReadonlyArray.of("b")),
        NonEmptyReadonlyArray.let("c", ({ a, b }) => [a, b])
      ),
      [{ a: 1, b: "b", c: [1, "b"] }]
    )
  })

  it("zipWith", () => {
    deepStrictEqual(
      pipe(
        NonEmptyReadonlyArray.make(1, 2, 3),
        NonEmptyReadonlyArray.zipWith(
          NonEmptyReadonlyArray.make("a", "b", "c", "d"),
          (n, s) => s + n
        )
      ),
      ["a1", "b2", "c3"]
    )
  })

  it("zip", () => {
    deepStrictEqual(
      pipe(
        NonEmptyReadonlyArray.make(1, 2, 3),
        NonEmptyReadonlyArray.zip(["a", "b", "c", "d"])
      ),
      [
        [1, "a"],
        [2, "b"],
        [3, "c"]
      ]
    )
  })

  it("unzip", () => {
    deepStrictEqual(
      NonEmptyReadonlyArray.unzip([
        [1, "a"],
        [2, "b"],
        [3, "c"]
      ]),
      [[1, 2, 3], ["a", "b", "c"]]
    )
  })

  it("splitAt", () => {
    const assertSplitAt = (
      input: NonEmptyReadonlyArray.NonEmptyReadonlyArray<number>,
      index: number,
      expectedInit: ReadonlyArray<number>,
      expectedRest: ReadonlyArray<number>
    ) => {
      const [init, rest] = NonEmptyReadonlyArray.splitAt(index)(input)
      deepStrictEqual(init, expectedInit)
      deepStrictEqual(rest, expectedRest)
    }

    const two: NonEmptyReadonlyArray.NonEmptyReadonlyArray<number> = [1, 2]
    const empty: ReadonlyArray<number> = []

    deepStrictEqual(NonEmptyReadonlyArray.splitAt(1)(two), [[1], [2]])
    assertSplitAt(two, 2, two, empty)
    const singleton: NonEmptyReadonlyArray.NonEmptyReadonlyArray<number> = [1]
    assertSplitAt(singleton, 1, singleton, empty)

    // out of bounds
    assertSplitAt(singleton, 0, singleton, empty)
    assertSplitAt(singleton, 2, singleton, empty)
    deepStrictEqual(NonEmptyReadonlyArray.splitAt(0)(two), [[1], [2]])
    assertSplitAt(two, 3, two, empty)
  })

  it("chunksOf", () => {
    deepStrictEqual(NonEmptyReadonlyArray.chunksOf(2)([1, 2, 3, 4, 5]), [
      NonEmptyReadonlyArray.make(1, 2),
      [3, 4],
      [5]
    ])
    deepStrictEqual(NonEmptyReadonlyArray.chunksOf(2)([1, 2, 3, 4, 5, 6]), [
      NonEmptyReadonlyArray.make(1, 2),
      [3, 4],
      [5, 6]
    ])
    deepStrictEqual(NonEmptyReadonlyArray.chunksOf(1)([1, 2, 3, 4, 5]), [[1], [2], [3], [4], [5]])
    deepStrictEqual(NonEmptyReadonlyArray.chunksOf(5)([1, 2, 3, 4, 5]), [[1, 2, 3, 4, 5]])
    // out of bounds
    deepStrictEqual(NonEmptyReadonlyArray.chunksOf(0)([1, 2, 3, 4, 5]), [[1], [2], [3], [4], [5]])
    deepStrictEqual(NonEmptyReadonlyArray.chunksOf(-1)([1, 2, 3, 4, 5]), [[1], [2], [3], [4], [5]])

    const assertSingleChunk = (
      input: NonEmptyReadonlyArray.NonEmptyReadonlyArray<number>,
      n: number
    ) => {
      const chunks = NonEmptyReadonlyArray.chunksOf(n)(input)
      strictEqual(chunks.length, 1)
      strictEqual(NonEmptyReadonlyArray.head(chunks), input)
    }
    // n = length
    assertSingleChunk(NonEmptyReadonlyArray.make(1, 2), 2)
    // n out of bounds
    assertSingleChunk(NonEmptyReadonlyArray.make(1, 2), 3)
  })

  it("rotate", () => {
    const singleton: NonEmptyReadonlyArray.NonEmptyReadonlyArray<number> = [1]
    strictEqual(NonEmptyReadonlyArray.rotate(1)(singleton), singleton)
    strictEqual(NonEmptyReadonlyArray.rotate(2)(singleton), singleton)
    strictEqual(NonEmptyReadonlyArray.rotate(-1)(singleton), singleton)
    strictEqual(NonEmptyReadonlyArray.rotate(-2)(singleton), singleton)
    const two: NonEmptyReadonlyArray.NonEmptyReadonlyArray<number> = NonEmptyReadonlyArray.make(
      1,
      2
    )
    strictEqual(NonEmptyReadonlyArray.rotate(2)(two), two)
    strictEqual(NonEmptyReadonlyArray.rotate(0)(two), two)
    strictEqual(NonEmptyReadonlyArray.rotate(-2)(two), two)

    deepStrictEqual(NonEmptyReadonlyArray.rotate(1)(NonEmptyReadonlyArray.make(1, 2)), [2, 1])
    deepStrictEqual(NonEmptyReadonlyArray.rotate(1)([1, 2, 3, 4, 5]), [5, 1, 2, 3, 4])
    deepStrictEqual(NonEmptyReadonlyArray.rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
    deepStrictEqual(NonEmptyReadonlyArray.rotate(-1)([1, 2, 3, 4, 5]), [2, 3, 4, 5, 1])
    deepStrictEqual(NonEmptyReadonlyArray.rotate(-2)([1, 2, 3, 4, 5]), [3, 4, 5, 1, 2])

    deepStrictEqual(NonEmptyReadonlyArray.rotate(7)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
    deepStrictEqual(NonEmptyReadonlyArray.rotate(-7)([1, 2, 3, 4, 5]), [3, 4, 5, 1, 2])

    deepStrictEqual(NonEmptyReadonlyArray.rotate(2.2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
    deepStrictEqual(NonEmptyReadonlyArray.rotate(-2.2)([1, 2, 3, 4, 5]), [3, 4, 5, 1, 2])
  })

  // TODO
  // it("uniq", () => {
  //   interface A {
  //     readonly a: string
  //     readonly b: number
  //   }

  //   const eqA = pipe(
  //     Number.Eq,
  //     Eq.contramap((f: A) => f.b)
  //   )
  //   const arrA: A = { a: "a", b: 1 }
  //   const arrB: A = { a: "b", b: 1 }
  //   const arrC: A = { a: "c", b: 2 }
  //   const arrD: A = { a: "d", b: 2 }
  //   const arrUniq: NonEmptyReadonlyArray.NonEmptyReadonlyArray<A> = [arrA, arrC]

  //   deepStrictEqual(NonEmptyReadonlyArray.uniq(eqA)(arrUniq), arrUniq)
  //   deepStrictEqual(NonEmptyReadonlyArray.uniq(eqA)([arrA, arrB, arrC, arrD]), [arrA, arrC])
  //   deepStrictEqual(NonEmptyReadonlyArray.uniq(eqA)([arrB, arrA, arrC, arrD]), [arrB, arrC])
  //   deepStrictEqual(NonEmptyReadonlyArray.uniq(eqA)([arrA, arrA, arrC, arrD, arrA]), [arrA, arrC])
  //   deepStrictEqual(NonEmptyReadonlyArray.uniq(eqA)([arrA, arrC]), [arrA, arrC])
  //   deepStrictEqual(NonEmptyReadonlyArray.uniq(eqA)([arrC, arrA]), [arrC, arrA])
  //   deepStrictEqual(NonEmptyReadonlyArray.uniq(Boolean.Eq)([true, false, true, false]), [
  //     true,
  //     false
  //   ])
  //   deepStrictEqual(NonEmptyReadonlyArray.uniq(Number.Eq)([-0, -0]), [-0])
  //   deepStrictEqual(NonEmptyReadonlyArray.uniq(Number.Eq)([0, -0]), [0])
  //   deepStrictEqual(NonEmptyReadonlyArray.uniq(Number.Eq)([1]), [1])
  //   deepStrictEqual(NonEmptyReadonlyArray.uniq(Number.Eq)([2, 1, 2]), [2, 1])
  //   deepStrictEqual(
  //     NonEmptyReadonlyArray.uniq(Number.Eq)([1, 2, 1]),
  //     NonEmptyReadonlyArray.make(1, 2)
  //   )
  //   deepStrictEqual(NonEmptyReadonlyArray.uniq(Number.Eq)([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5])
  //   deepStrictEqual(NonEmptyReadonlyArray.uniq(Number.Eq)([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]), [
  //     1,
  //     2,
  //     3,
  //     4,
  //     5
  //   ])
  //   deepStrictEqual(NonEmptyReadonlyArray.uniq(Number.Eq)([1, 2, 3, 4, 5, 1, 2, 3, 4, 5]), [
  //     1,
  //     2,
  //     3,
  //     4,
  //     5
  //   ])
  //   deepStrictEqual(NonEmptyReadonlyArray.uniq(String.Eq)(["a", "b", "a"]), ["a", "b"])
  //   deepStrictEqual(NonEmptyReadonlyArray.uniq(String.Eq)(["a", "b", "A"]), ["a", "b", "A"])

  //   const as: NonEmptyReadonlyArray.NonEmptyReadonlyArray<number> = [1]
  //   U.strictEqual(NonEmptyReadonlyArray.uniq(Number.Eq)(as), as)
  // })

  it("sortBy", () => {
    interface X {
      readonly a: string
      readonly b: number
      readonly c: boolean
    }
    const byName = pipe(
      String.Order,
      Order.contramap((p: { readonly a: string; readonly b: number }) => p.a)
    )
    const byAge = pipe(
      Number.Order,
      Order.contramap((p: { readonly a: string; readonly b: number }) => p.b)
    )
    const f = NonEmptyReadonlyArray.sortBy([byName, byAge])
    const xs: NonEmptyReadonlyArray.NonEmptyReadonlyArray<X> = [
      { a: "a", b: 1, c: true },
      { a: "b", b: 3, c: true },
      { a: "c", b: 2, c: true },
      { a: "b", b: 2, c: true }
    ]
    deepStrictEqual(f(xs), [
      { a: "a", b: 1, c: true },
      { a: "b", b: 2, c: true },
      { a: "b", b: 3, c: true },
      { a: "c", b: 2, c: true }
    ])
    const sortByAgeByName = NonEmptyReadonlyArray.sortBy([byAge, byName])
    deepStrictEqual(sortByAgeByName(xs), [
      { a: "a", b: 1, c: true },
      { a: "b", b: 2, c: true },
      { a: "c", b: 2, c: true },
      { a: "b", b: 3, c: true }
    ])

    deepStrictEqual(NonEmptyReadonlyArray.sortBy([])(xs), xs)
  })

  // TODO
  // it("union", () => {
  //   const S = NonEmptyReadonlyArray.getUnionSemigroup()
  //   deepStrictEqual(S.combine([3, 4])([1, 2]), [1, 2, 3, 4])
  //   deepStrictEqual(S.combine([2, 3])([1, 2]), NonEmptyReadonlyArray.make(1, 2, 3))
  //   deepStrictEqual(S.combine(NonEmptyReadonlyArray.make(1, 2))([1, 2]), [1, 2])
  // })

  it("matchLeft", () => {
    deepStrictEqual(
      pipe(
        NonEmptyReadonlyArray.make(1, 2, 3),
        NonEmptyReadonlyArray.matchLeft((head, tail) => [head, tail])
      ),
      [1, [2, 3]]
    )
  })

  it("matchRight", () => {
    deepStrictEqual(
      pipe(
        NonEmptyReadonlyArray.make(1, 2, 3),
        NonEmptyReadonlyArray.matchRight((init, last) => [init, last])
      ),
      [NonEmptyReadonlyArray.make(1, 2), 3]
    )
  })

  it("modifyHead", () => {
    const f: Endomorphism<string> = (s) => s + "!"
    deepStrictEqual(pipe(["a"], NonEmptyReadonlyArray.modifyHead(f)), ["a!"])
    deepStrictEqual(pipe(["a", "b"], NonEmptyReadonlyArray.modifyHead(f)), ["a!", "b"])
    deepStrictEqual(pipe(["a", "b", "c"], NonEmptyReadonlyArray.modifyHead(f)), ["a!", "b", "c"])
  })

  it("modifyLast", () => {
    const f: Endomorphism<string> = (s) => s + "!"
    deepStrictEqual(pipe(["a"], NonEmptyReadonlyArray.modifyLast(f)), ["a!"])
    deepStrictEqual(pipe(["a", "b"], NonEmptyReadonlyArray.modifyLast(f)), ["a", "b!"])
    deepStrictEqual(pipe(["a", "b", "c"], NonEmptyReadonlyArray.modifyLast(f)), ["a", "b", "c!"])
  })

  it("makeBy", () => {
    const f = NonEmptyReadonlyArray.makeBy(double)
    deepStrictEqual(f(5), [0, 2, 4, 6, 8])
    // If `n` (must be a natural number) is non positive return `[f(0)]`.
    deepStrictEqual(f(0), [0])
    deepStrictEqual(f(-1), [0])
  })

  it("range", () => {
    deepStrictEqual(NonEmptyReadonlyArray.range(0, 0), [0])
    deepStrictEqual(NonEmptyReadonlyArray.range(0, 1), [0, 1])
    deepStrictEqual(NonEmptyReadonlyArray.range(1, 5), [1, 2, 3, 4, 5])
    deepStrictEqual(NonEmptyReadonlyArray.range(10, 15), [10, 11, 12, 13, 14, 15])
    deepStrictEqual(NonEmptyReadonlyArray.range(-1, 0), [-1, 0])
    deepStrictEqual(NonEmptyReadonlyArray.range(-5, -1), [-5, -4, -3, -2, -1])
    // out of bound
    deepStrictEqual(NonEmptyReadonlyArray.range(2, 1), [2])
    deepStrictEqual(NonEmptyReadonlyArray.range(-1, -2), [-1])
  })

  it("replicate", () => {
    const f = NonEmptyReadonlyArray.replicate("a")
    deepStrictEqual(pipe(0, f), ["a"])
    deepStrictEqual(pipe(1, f), ["a"])
    deepStrictEqual(pipe(2, f), ["a", "a"])
  })

  it("updateHead", () => {
    deepStrictEqual(pipe(["a"], NonEmptyReadonlyArray.updateHead("d")), ["d"])
    deepStrictEqual(pipe(["a", "b"], NonEmptyReadonlyArray.updateHead("d")), ["d", "b"])
    deepStrictEqual(pipe(["a", "b", "c"], NonEmptyReadonlyArray.updateHead("d")), ["d", "b", "c"])
  })

  it("updateLast", () => {
    deepStrictEqual(pipe(["a"], NonEmptyReadonlyArray.updateLast("d")), ["d"])
    deepStrictEqual(pipe(["a", "b"], NonEmptyReadonlyArray.updateLast("d")), ["a", "d"])
    deepStrictEqual(pipe(["a", "b", "c"], NonEmptyReadonlyArray.updateLast("d")), ["a", "b", "d"])
  })

  it("concat", () => {
    deepStrictEqual(pipe(["a"], NonEmptyReadonlyArray.concat(["b"])), ["a", "b"])
    deepStrictEqual(pipe([], NonEmptyReadonlyArray.concat(["b"])), ["b"])
    deepStrictEqual(NonEmptyReadonlyArray.concat(["b"])(["a"]), ["a", "b"])
    deepStrictEqual(NonEmptyReadonlyArray.concat([])(["a"]), ["a"])
    deepStrictEqual(NonEmptyReadonlyArray.concat(["b"])([]), ["b"])
  })

  test("zipMany", () => {
    const start = NonEmptyReadonlyArray.make(1, 2, 3, 4, 5)
    const others = [
      NonEmptyReadonlyArray.make(1, 2, 3, 4, 5, 6),
      NonEmptyReadonlyArray.make(1, 2, 3, 4),
      NonEmptyReadonlyArray.make(1, 2, 3, 4, 5)
    ]

    const actual = pipe(start, NonEmptyReadonlyArray.zipMany(others))
    const expected = [[1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4]]

    expect(actual).toStrictEqual(expected)
  })

  test("zipAll", () => {
    const arrays = [
      NonEmptyReadonlyArray.make(1, 2, 3, 4, 5, 6),
      NonEmptyReadonlyArray.make(1, 2, 3, 4),
      NonEmptyReadonlyArray.make(1, 2, 3, 4, 5)
    ]

    const actual = NonEmptyReadonlyArray.zipAll(arrays)
    const expected = [[1, 1, 1], [2, 2, 2], [3, 3, 3], [4, 4, 4]]

    expect(actual).toStrictEqual(expected)
  })

  test("product", () => {
    expect(pipe(
      NonEmptyReadonlyArray.make(1),
      NonEmptyReadonlyArray.product(NonEmptyReadonlyArray.make(2, 3, 4))
    )).toStrictEqual([[1, 2], [1, 3], [1, 4]])
    expect(pipe(
      NonEmptyReadonlyArray.make(1, 2, 3),
      NonEmptyReadonlyArray.product(NonEmptyReadonlyArray.make(2, 3, 4))
    )).toStrictEqual([[1, 2], [1, 3], [1, 4], [2, 2], [2, 3], [2, 4], [3, 2], [3, 3], [3, 4]])
  })

  test("productMany", () => {
    expect(pipe(
      NonEmptyReadonlyArray.make(1),
      NonEmptyReadonlyArray.productMany([])
    )).toStrictEqual([[1]])
  })

  test("productAll", () => {
    expect(NonEmptyReadonlyArray.productAll([])).toStrictEqual([[]])
    expect(NonEmptyReadonlyArray.productAll([
      [2, 3],
      [4, 5],
      [8, 9, 10]
    ])).toStrictEqual([[2, 4, 5, 8, 9, 10], [3, 4, 5, 8, 9, 10]])
  })

  test("unsafeFrom", () => {
    expect(NonEmptyReadonlyArray.unsafeFrom([1])).toStrictEqual([1])
    expect(() => NonEmptyReadonlyArray.unsafeFrom([])).toThrow(
      new Error("Cannot construct a NonEmptyReadonlyArray from an empty collection")
    )
  })
})
