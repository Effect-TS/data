import * as Order from "@fp-ts/core/typeclass/Order"
import type { Endomorphism } from "@fp-ts/data/Endomorphism"
import { identity, pipe } from "@fp-ts/data/Function"
import * as RA from "@fp-ts/data/NonEmptyReadonlyArray"
import * as Number from "@fp-ts/data/Number"
import * as Option from "@fp-ts/data/Option"
import * as String from "@fp-ts/data/String"
import { assertTrue, deepStrictEqual, double, strictEqual } from "@fp-ts/data/test/util"
import { assert } from "vitest"

describe.concurrent("NonEmptyReadonlyArray", () => {
  it("instances and derived exports", () => {
    expect(RA.Invariant).exist
    expect(RA.imap).exist
    expect(RA.tupled).exist
    expect(RA.bindTo).exist

    expect(RA.Covariant).exist
    expect(RA.map).exist
    expect(RA.let).exist
    expect(RA.flap).exist
    expect(RA.as).exist
    expect(RA.asUnit).exist

    expect(RA.Of).exist
    expect(RA.of).exist
    expect(RA.Do).exist

    expect(RA.Pointed).exist

    expect(RA.FlatMap).exist
    expect(RA.flatMap).exist
    expect(RA.flatten).exist
    expect(RA.andThen).exist
    expect(RA.composeKleisliArrow).exist

    expect(RA.Chainable).exist
    expect(RA.bind).exist
    expect(RA.tap).exist
    expect(RA.andThenDiscard).exist

    expect(RA.Monad).exist

    expect(RA.NonEmptyProduct).exist
    expect(RA.product).exist
    expect(RA.productMany).exist

    expect(RA.Product).exist
    expect(RA.productAll).exist
    // expect(NonEmptyReadonlyArray.tuple).exist
    // expect(NonEmptyReadonlyArray.struct).exist

    expect(RA.NonEmptyApplicative).exist
    expect(RA.liftSemigroup).exist
    expect(RA.lift2).exist
    expect(RA.lift3).exist
    expect(RA.ap).exist
    expect(RA.andThenDiscard).exist
    expect(RA.andThen).exist

    expect(RA.Applicative).exist
    expect(RA.liftMonoid).exist

    expect(RA.Foldable).exist
    expect(RA.reduce).exist
    expect(RA.reduceRight).exist
    expect(RA.foldMap).exist
    expect(RA.reduceKind).exist
    expect(RA.reduceRightKind).exist
    expect(RA.foldMapKind).exist

    expect(RA.Traversable).exist
    expect(RA.traverse).exist
    expect(RA.sequence).exist
    expect(RA.traverseTap).exist
  })

  describe.concurrent("pipeables", () => {
    it("traverse", () => {
      const traverse = RA.traverse(Option.Applicative)
      deepStrictEqual(
        pipe(
          RA.make(1, 2, 3),
          traverse((n) => (n >= 0 ? Option.some(n) : Option.none))
        ),
        Option.some(RA.make(1, 2, 3))
      )
      deepStrictEqual(
        pipe(
          RA.make(1, 2, 3),
          traverse((n) => (n >= 2 ? Option.some(n) : Option.none))
        ),
        Option.none
      )
    })

    it("sequence", () => {
      const sequence = RA.sequence(Option.Applicative)
      deepStrictEqual(
        sequence([Option.some(1), Option.some(2), Option.some(3)]),
        Option.some(RA.make(1, 2, 3))
      )
      deepStrictEqual(sequence([Option.none, Option.some(2), Option.some(3)]), Option.none)
    })

    it("traverseWithIndex", () => {
      deepStrictEqual(
        pipe(
          RA.make("a", "bb"),
          RA.traverseWithIndex(Option.Applicative)((
            s,
            i
          ) => (s.length >= 1 ? Option.some(s + i) : Option.none))
        ),
        Option.some(RA.make("a0", "bb1"))
      )
      deepStrictEqual(
        pipe(
          RA.make("a", "bb"),
          RA.traverseWithIndex(Option.Applicative)((
            s,
            i
          ) => (s.length > 1 ? Option.some(s + i) : Option.none))
        ),
        Option.none
      )
    })
  })

  it("head", () => {
    deepStrictEqual(RA.head(RA.make(1, 2)), 1)
  })

  it("tail", () => {
    deepStrictEqual(RA.tail(RA.make(1, 2)), [2])
  })

  it("map", () => {
    deepStrictEqual(
      pipe(
        RA.make(1, 2),
        RA.map((n) => n * 2)
      ),
      [2, 4]
    )
  })

  it("mapWithIndex", () => {
    const add = (s: string, i: number) => s + i
    deepStrictEqual(
      pipe(RA.make("a", "b"), RA.mapWithIndex(add)),
      ["a0", "b1"]
    )
  })

  it("of", () => {
    deepStrictEqual(RA.of(1), [1])
  })

  it("ap", () => {
    const fab: RA.NonEmptyReadonlyArray<(n: number) => number> = [
      double,
      double
    ]
    deepStrictEqual(pipe(fab, RA.ap(RA.make(1, 2))), [
      2,
      4,
      2,
      4
    ])
  })

  it("flatMap", () => {
    const f = (a: number): RA.NonEmptyReadonlyArray<number> => [a, 4]
    deepStrictEqual(pipe(RA.make(1, 2), RA.flatMap(f)), [
      1,
      4,
      2,
      4
    ])
  })

  it("extend", () => {
    const sum = (as: RA.NonEmptyReadonlyArray<number>): number => {
      const head = RA.head(as)
      assertTrue(typeof (head as any) === "number")
      return Number.MonoidSum.combineAll([head, ...RA.tail(as)])
    }
    deepStrictEqual(pipe([1, 2, 3, 4], RA.extend(sum)), [10, 9, 7, 4])
    deepStrictEqual(pipe([1], RA.extend(sum)), [1])
  })

  it("min", () => {
    deepStrictEqual(RA.min(Number.Order)([2, 1, 3]), 1)
    deepStrictEqual(RA.min(Number.Order)([3]), 3)
  })

  it("max", () => {
    deepStrictEqual(
      RA.max(Number.Order)(RA.make(1, 2, 3)),
      3
    )
    deepStrictEqual(RA.max(Number.Order)([1]), 1)
  })

  it("reduce", () => {
    deepStrictEqual(
      pipe(
        ["a", "b"],
        RA.reduce("", (b, a) => b + a)
      ),
      "ab"
    )
  })

  it("foldMap", () => {
    deepStrictEqual(
      pipe(
        RA.make("a", "b", "c"),
        RA.foldMap(String.Monoid)(identity)
      ),
      "abc"
    )
  })

  it("reduceRight", () => {
    const f = (b: string, a: string) => b + a
    deepStrictEqual(pipe(["a", "b", "c"], RA.reduceRight("", f)), "cba")
  })

  it("from", () => {
    deepStrictEqual(RA.from([]), Option.none)
    deepStrictEqual(
      RA.from([1]),
      Option.some(RA.make(1))
    )
    deepStrictEqual(
      RA.from([1, 2]),
      Option.some(RA.make(1, 2))
    )
  })

  // TODO
  // it("getSemigroup", () => {
  //   const S = NonEmptyReadonlyArray.getSemigroup<number>()
  //   deepStrictEqual(S.combine([2])([1]), NonEmptyReadonlyArray.make(1, 2))
  //   deepStrictEqual(S.combine([3, 4])(NonEmptyReadonlyArray.make(1, 2)), [1, 2, 3, 4])
  // })

  it("group", () => {
    deepStrictEqual(RA.group([1, 2, 1, 1]), [[1], [2], [1, 1]])
    deepStrictEqual(RA.group([1, 2, 1, 1, 3]), [[1], [2], [1, 1], [3]])
  })

  // TODO
  // it("groupSort", () => {
  //   deepStrictEqual(NonEmptyReadonlyArray.groupSort([1, 2, 1, 1]), [[1, 1, 1], [2]])
  // })

  it("last", () => {
    deepStrictEqual(RA.last(RA.make(1, 2, 3)), 3)
    deepStrictEqual(RA.last([1]), 1)
  })

  it("init", () => {
    deepStrictEqual(
      RA.init(RA.make(1, 2, 3)),
      RA.make(1, 2)
    )
    deepStrictEqual(RA.init([1]), [])
  })

  it("sort", () => {
    const sort = RA.sort(Number.Order)
    deepStrictEqual(sort([3, 2, 1]), RA.make(1, 2, 3))
    // should optimize `1`-length `NonEmptyReadonlyArray`s
    const singleton: RA.NonEmptyReadonlyArray<number> = [1]
    strictEqual(sort(singleton), singleton)
  })

  it("prependAll", () => {
    deepStrictEqual(RA.prependAll(0)(RA.make(1, 2, 3)), [
      0,
      1,
      0,
      2,
      0,
      3
    ])
    deepStrictEqual(RA.prependAll(0)([1]), [0, 1])
    deepStrictEqual(RA.prependAll(0)([1, 2, 3, 4]), [0, 1, 0, 2, 0, 3, 0, 4])
  })

  it("intersperse", () => {
    deepStrictEqual(RA.intersperse(0)(RA.make(1, 2, 3)), [
      1,
      0,
      2,
      0,
      3
    ])
    deepStrictEqual(RA.intersperse(0)([1]), [1])
    deepStrictEqual(RA.intersperse(0)(RA.make(1, 2)), [
      1,
      0,
      2
    ])
    deepStrictEqual(RA.intersperse(0)([1, 2, 3, 4]), [1, 0, 2, 0, 3, 0, 4])
  })

  it("intercalate", () => {
    deepStrictEqual(RA.intercalate(String.Semigroup)("-")(["a"]), "a")
    deepStrictEqual(
      RA.intercalate(String.Semigroup)("-")(["a", "b", "c"]),
      "a-b-c"
    )
    deepStrictEqual(
      RA.intercalate(String.Semigroup)("-")(["a", "", "c"]),
      "a--c"
    )
    deepStrictEqual(RA.intercalate(String.Semigroup)("-")(["a", "b"]), "a-b")
    deepStrictEqual(
      RA.intercalate(String.Semigroup)("-")(["a", "b", "c", "d"]),
      "a-b-c-d"
    )
  })

  it("reverse", () => {
    const singleton: RA.NonEmptyReadonlyArray<number> = [1]
    strictEqual(RA.reverse(singleton), singleton)
    deepStrictEqual(RA.reverse(RA.make(1, 2, 3)), [3, 2, 1])
  })

  it("groupBy", () => {
    deepStrictEqual(RA.groupBy((_) => "")([]), {})
    deepStrictEqual(RA.groupBy((a) => `${a}`)([1]), { "1": [1] })
    deepStrictEqual(
      RA.groupBy((s: string) => `${s.length}`)(["foo", "bar", "foobar"]),
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
    const arr: RA.NonEmptyReadonlyArray<{ readonly x: number }> = [a1, a2, a3]
    deepStrictEqual(
      RA.updateAt(0, a4)(arr),
      Option.some(RA.make(a4, a2, a3))
    )
    deepStrictEqual(RA.updateAt(-1, a4)(arr), Option.none)
    deepStrictEqual(RA.updateAt(3, a4)(arr), Option.none)
    deepStrictEqual(
      RA.updateAt(1, a4)(arr),
      Option.some(RA.make(a1, a4, a3))
    )
    // should return the same reference if nothing changed
    const r1 = RA.updateAt(0, a1)(arr)
    if (Option.isSome(r1)) {
      deepStrictEqual(r1.value, arr)
    } else {
      assert.fail("is not a Some")
    }
    const r2 = RA.updateAt(2, a3)(arr)
    if (Option.isSome(r2)) {
      deepStrictEqual(r2.value, arr)
    } else {
      assert.fail("is not a Some")
    }
  })

  it("modifyAt", () => {
    deepStrictEqual(RA.modifyAt(1, double)([1]), Option.none)
    deepStrictEqual(
      RA.modifyAt(1, double)(RA.make(1, 2)),
      Option.some([1, 4] as const)
    )
    // should return the same reference if nothing changed
    const input: RA.NonEmptyReadonlyArray<number> = RA.make(
      1,
      2,
      3
    )
    deepStrictEqual(
      pipe(
        input,
        RA.modifyAt(1, identity),
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
        RA.reduceWithIndex("", (b, a, i) => b + i + a)
      ),
      "0a1b"
    )
  })

  it("foldMapWithIndex", () => {
    deepStrictEqual(
      pipe(
        RA.make("a", "b"),
        RA.foldMapWithIndex(String.Monoid)((a, i) => i + a)
      ),
      "0a1b"
    )
  })

  it("reduceRightWithIndex", () => {
    deepStrictEqual(
      pipe(
        ["a", "b"],
        RA.reduceRightWithIndex("", (b, a, i) => b + i + a)
      ),
      "1b0a"
    )
  })

  it("prepend", () => {
    deepStrictEqual(
      pipe(RA.make(2, 3, 4), RA.prepend(1)),
      RA.make(1, 2, 3, 4)
    )
  })

  it("append", () => {
    deepStrictEqual(RA.append(0)([]), [0])
    deepStrictEqual(RA.append(4)([1, 2, 3]), [1, 2, 3, 4])
  })

  it("unprepend", () => {
    deepStrictEqual(RA.unprepend([0]), [0, []])
    deepStrictEqual(RA.unprepend([1, 2, 3, 4]), [1, [2, 3, 4]])
  })

  it("unappend", () => {
    deepStrictEqual(RA.unappend([0]), [[], 0])
    deepStrictEqual(RA.unappend([1, 2, 3, 4]), [
      RA.make(1, 2, 3),
      4
    ])
    deepStrictEqual(RA.unappend([0]), [[], 0])
    deepStrictEqual(RA.unappend([1, 2, 3, 4]), [
      RA.make(1, 2, 3),
      4
    ])
  })

  it("alt", () => {
    deepStrictEqual(
      pipe(
        RA.make("a"),
        RA.orElse(RA.make("b"))
      ),
      ["a", "b"]
    )
  })

  it("foldMap", () => {
    const f = RA.foldMap(Number.SemigroupSum)((s: string) => s.length)
    deepStrictEqual(f(["a"]), 1)
    deepStrictEqual(f(RA.make("a", "bb")), 3)
  })

  it("foldMapWithIndex", () => {
    const f = RA.foldMapWithIndex(Number.SemigroupSum)((s: string, i: number) => s.length + i)
    deepStrictEqual(f(["a"]), 1)
    deepStrictEqual(f(RA.make("a", "bb")), 4)
  })

  it("concatAll", () => {
    const f = RA.combineAll(String.Semigroup)
    deepStrictEqual(f(["a"]), "a")
    deepStrictEqual(f(RA.make("a", "bb")), "abb")
  })

  it("do notation", () => {
    deepStrictEqual(
      pipe(
        RA.of(1),
        RA.bindTo("a"),
        RA.bind("b", () => RA.of("b")),
        RA.let("c", ({ a, b }) => [a, b])
      ),
      [{ a: 1, b: "b", c: [1, "b"] }]
    )
  })

  it("zipWith", () => {
    deepStrictEqual(
      pipe(
        RA.make(1, 2, 3),
        RA.zipWith(
          RA.make("a", "b", "c", "d"),
          (n, s) => s + n
        )
      ),
      ["a1", "b2", "c3"]
    )
  })

  it("zip", () => {
    deepStrictEqual(
      pipe(
        RA.make(1, 2, 3),
        RA.zip(["a", "b", "c", "d"])
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
      RA.unzip([
        [1, "a"],
        [2, "b"],
        [3, "c"]
      ]),
      [[1, 2, 3], ["a", "b", "c"]]
    )
  })

  it("splitAt", () => {
    const assertSplitAt = (
      input: RA.NonEmptyReadonlyArray<number>,
      index: number,
      expectedInit: ReadonlyArray<number>,
      expectedRest: ReadonlyArray<number>
    ) => {
      const [init, rest] = RA.splitAt(index)(input)
      deepStrictEqual(init, expectedInit)
      deepStrictEqual(rest, expectedRest)
    }

    const two: RA.NonEmptyReadonlyArray<number> = [1, 2]
    const empty: ReadonlyArray<number> = []

    deepStrictEqual(RA.splitAt(1)(two), [[1], [2]])
    assertSplitAt(two, 2, two, empty)
    const singleton: RA.NonEmptyReadonlyArray<number> = [1]
    assertSplitAt(singleton, 1, singleton, empty)

    // out of bounds
    assertSplitAt(singleton, 0, singleton, empty)
    assertSplitAt(singleton, 2, singleton, empty)
    deepStrictEqual(RA.splitAt(0)(two), [[1], [2]])
    assertSplitAt(two, 3, two, empty)
  })

  it("chunksOf", () => {
    deepStrictEqual(RA.chunksOf(2)([1, 2, 3, 4, 5]), [
      RA.make(1, 2),
      [3, 4],
      [5]
    ])
    deepStrictEqual(RA.chunksOf(2)([1, 2, 3, 4, 5, 6]), [
      RA.make(1, 2),
      [3, 4],
      [5, 6]
    ])
    deepStrictEqual(RA.chunksOf(1)([1, 2, 3, 4, 5]), [[1], [2], [3], [4], [5]])
    deepStrictEqual(RA.chunksOf(5)([1, 2, 3, 4, 5]), [[1, 2, 3, 4, 5]])
    // out of bounds
    deepStrictEqual(RA.chunksOf(0)([1, 2, 3, 4, 5]), [[1], [2], [3], [4], [5]])
    deepStrictEqual(RA.chunksOf(-1)([1, 2, 3, 4, 5]), [[1], [2], [3], [4], [5]])

    const assertSingleChunk = (
      input: RA.NonEmptyReadonlyArray<number>,
      n: number
    ) => {
      const chunks = RA.chunksOf(n)(input)
      strictEqual(chunks.length, 1)
      strictEqual(RA.head(chunks), input)
    }
    // n = length
    assertSingleChunk(RA.make(1, 2), 2)
    // n out of bounds
    assertSingleChunk(RA.make(1, 2), 3)
  })

  it("rotate", () => {
    const singleton: RA.NonEmptyReadonlyArray<number> = [1]
    strictEqual(RA.rotate(1)(singleton), singleton)
    strictEqual(RA.rotate(2)(singleton), singleton)
    strictEqual(RA.rotate(-1)(singleton), singleton)
    strictEqual(RA.rotate(-2)(singleton), singleton)
    const two: RA.NonEmptyReadonlyArray<number> = RA.make(
      1,
      2
    )
    strictEqual(RA.rotate(2)(two), two)
    strictEqual(RA.rotate(0)(two), two)
    strictEqual(RA.rotate(-2)(two), two)

    deepStrictEqual(RA.rotate(1)(RA.make(1, 2)), [2, 1])
    deepStrictEqual(RA.rotate(1)([1, 2, 3, 4, 5]), [5, 1, 2, 3, 4])
    deepStrictEqual(RA.rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
    deepStrictEqual(RA.rotate(-1)([1, 2, 3, 4, 5]), [2, 3, 4, 5, 1])
    deepStrictEqual(RA.rotate(-2)([1, 2, 3, 4, 5]), [3, 4, 5, 1, 2])

    deepStrictEqual(RA.rotate(7)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
    deepStrictEqual(RA.rotate(-7)([1, 2, 3, 4, 5]), [3, 4, 5, 1, 2])

    deepStrictEqual(RA.rotate(2.2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
    deepStrictEqual(RA.rotate(-2.2)([1, 2, 3, 4, 5]), [3, 4, 5, 1, 2])
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
    const f = RA.sortBy([byName, byAge])
    const xs: RA.NonEmptyReadonlyArray<X> = [
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
    const sortByAgeByName = RA.sortBy([byAge, byName])
    deepStrictEqual(sortByAgeByName(xs), [
      { a: "a", b: 1, c: true },
      { a: "b", b: 2, c: true },
      { a: "c", b: 2, c: true },
      { a: "b", b: 3, c: true }
    ])

    deepStrictEqual(RA.sortBy([])(xs), xs)
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
        RA.make(1, 2, 3),
        RA.matchLeft((head, tail) => [head, tail])
      ),
      [1, [2, 3]]
    )
  })

  it("matchRight", () => {
    deepStrictEqual(
      pipe(
        RA.make(1, 2, 3),
        RA.matchRight((init, last) => [init, last])
      ),
      [RA.make(1, 2), 3]
    )
  })

  it("modifyHead", () => {
    const f: Endomorphism<string> = (s) => s + "!"
    deepStrictEqual(pipe(["a"], RA.modifyHead(f)), ["a!"])
    deepStrictEqual(pipe(["a", "b"], RA.modifyHead(f)), ["a!", "b"])
    deepStrictEqual(pipe(["a", "b", "c"], RA.modifyHead(f)), ["a!", "b", "c"])
  })

  it("modifyLast", () => {
    const f: Endomorphism<string> = (s) => s + "!"
    deepStrictEqual(pipe(["a"], RA.modifyLast(f)), ["a!"])
    deepStrictEqual(pipe(["a", "b"], RA.modifyLast(f)), ["a", "b!"])
    deepStrictEqual(pipe(["a", "b", "c"], RA.modifyLast(f)), ["a", "b", "c!"])
  })

  it("makeBy", () => {
    const f = RA.makeBy(double)
    deepStrictEqual(f(5), [0, 2, 4, 6, 8])
    // If `n` (must be a natural number) is non positive return `[f(0)]`.
    deepStrictEqual(f(0), [0])
    deepStrictEqual(f(-1), [0])
  })

  it("range", () => {
    deepStrictEqual(RA.range(0, 0), [0])
    deepStrictEqual(RA.range(0, 1), [0, 1])
    deepStrictEqual(RA.range(1, 5), [1, 2, 3, 4, 5])
    deepStrictEqual(RA.range(10, 15), [10, 11, 12, 13, 14, 15])
    deepStrictEqual(RA.range(-1, 0), [-1, 0])
    deepStrictEqual(RA.range(-5, -1), [-5, -4, -3, -2, -1])
    // out of bound
    deepStrictEqual(RA.range(2, 1), [2])
    deepStrictEqual(RA.range(-1, -2), [-1])
  })

  it("replicate", () => {
    const f = RA.replicate("a")
    deepStrictEqual(pipe(0, f), ["a"])
    deepStrictEqual(pipe(1, f), ["a"])
    deepStrictEqual(pipe(2, f), ["a", "a"])
  })

  it("updateHead", () => {
    deepStrictEqual(pipe(["a"], RA.updateHead("d")), ["d"])
    deepStrictEqual(pipe(["a", "b"], RA.updateHead("d")), ["d", "b"])
    deepStrictEqual(pipe(["a", "b", "c"], RA.updateHead("d")), ["d", "b", "c"])
  })

  it("updateLast", () => {
    deepStrictEqual(pipe(["a"], RA.updateLast("d")), ["d"])
    deepStrictEqual(pipe(["a", "b"], RA.updateLast("d")), ["a", "d"])
    deepStrictEqual(pipe(["a", "b", "c"], RA.updateLast("d")), ["a", "b", "d"])
  })

  it("concat", () => {
    deepStrictEqual(pipe(["a"], RA.concat(["b"])), ["a", "b"])
    deepStrictEqual(pipe([], RA.concat(["b"])), ["b"])
    deepStrictEqual(RA.concat(["b"])(["a"]), ["a", "b"])
    deepStrictEqual(RA.concat([])(["a"]), ["a"])
    deepStrictEqual(RA.concat(["b"])([]), ["b"])
  })

  test("zipMany", () => {
    const start = RA.make(1, 2, 3, 4, 5)
    const others = [
      RA.make(1, 2, 3, 4, 5, 6),
      RA.make(1, 2, 3, 4),
      RA.make(1, 2, 3, 4, 5)
    ]

    const actual = pipe(start, RA.zipMany(others))
    const expected = [[1, 1, 1, 1], [2, 2, 2, 2], [3, 3, 3, 3], [4, 4, 4, 4]]

    expect(actual).toStrictEqual(expected)
  })

  test("zipAll", () => {
    const arrays = [
      RA.make(1, 2, 3, 4, 5, 6),
      RA.make(1, 2, 3, 4),
      RA.make(1, 2, 3, 4, 5)
    ]

    const actual = RA.zipAll(arrays)
    const expected = [[1, 1, 1], [2, 2, 2], [3, 3, 3], [4, 4, 4]]

    expect(actual).toStrictEqual(expected)
  })

  test("product", () => {
    expect(pipe(
      RA.make(1),
      RA.product(RA.make(2, 3, 4))
    )).toStrictEqual([[1, 2], [1, 3], [1, 4]])
    expect(pipe(
      RA.make(1, 2, 3),
      RA.product(RA.make(2, 3, 4))
    )).toStrictEqual([[1, 2], [1, 3], [1, 4], [2, 2], [2, 3], [2, 4], [3, 2], [3, 3], [3, 4]])
  })

  test("productMany", () => {
    expect(pipe(
      RA.make(1),
      RA.productMany([])
    )).toStrictEqual([[1]])
  })

  test("productAll", () => {
    expect(RA.productAll([])).toStrictEqual([[]])
    expect(RA.productAll([
      [2, 3],
      [4, 5],
      [8, 9, 10]
    ])).toStrictEqual([[2, 4, 5, 8, 9, 10], [3, 4, 5, 8, 9, 10]])
  })

  test("unsafeFrom", () => {
    expect(RA.unsafeFrom([1])).toStrictEqual([1])
    expect(() => RA.unsafeFrom([])).toThrow(
      new Error("Cannot construct a NonEmptyReadonlyArray from an empty collection")
    )
  })
})
