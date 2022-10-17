import * as Sortable from "@fp-ts/core/Sortable"
import * as Equal from "@fp-ts/data/Equal"
import { identity, pipe } from "@fp-ts/data/Function"
import * as Number from "@fp-ts/data/Number"
import * as Option from "@fp-ts/data/Option"
import type { Predicate } from "@fp-ts/data/Predicate"
import * as ReadonlyArray from "@fp-ts/data/ReadonlyArray"
import * as Result from "@fp-ts/data/Result"
import * as String from "@fp-ts/data/String"
import { deepStrictEqual, double, strictEqual } from "@fp-ts/data/test/util"
import * as assert from "assert"
import * as fc from "fast-check"

describe("ReadonlyArray", () => {
  describe("pipeables", () => {
    it("traverse", () => {
      const traverse = ReadonlyArray.traverse(Option.Monoidal)((
        n: number
      ): Option.Option<number> => (n % 2 === 0 ? Option.none : Option.some(n)))
      deepStrictEqual(traverse([1, 2]), Option.none)
      deepStrictEqual(traverse([1, 3]), Option.some([1, 3]))
    })

    it("sequence", () => {
      const sequence = ReadonlyArray.sequence(Option.Monoidal)
      deepStrictEqual(sequence([Option.some(1), Option.some(3)]), Option.some([1, 3]))
      deepStrictEqual(sequence([Option.some(1), Option.none]), Option.none)
    })

    it("traverseWithIndex", () => {
      deepStrictEqual(
        pipe(
          ["a", "bb"],
          ReadonlyArray.traverseWithIndex(Option.Monoidal)((
            i,
            s
          ) => (s.length >= 1 ? Option.some(s + i) : Option.none))
        ),
        Option.some(["a0", "bb1"])
      )
      deepStrictEqual(
        pipe(
          ["a", "bb"],
          ReadonlyArray.traverseWithIndex(Option.Monoidal)((
            i,
            s
          ) => (s.length > 1 ? Option.some(s + i) : Option.none))
        ),
        Option.none
      )
    })

    it("lookup", () => {
      deepStrictEqual(ReadonlyArray.lookup(0)([1, 2, 3]), Option.some(1))
      deepStrictEqual(ReadonlyArray.lookup(3)([1, 2, 3]), Option.none)
      deepStrictEqual(pipe([1, 2, 3], ReadonlyArray.lookup(0)), Option.some(1))
      deepStrictEqual(pipe([1, 2, 3], ReadonlyArray.lookup(3)), Option.none)
    })

    it("elem", () => {
      deepStrictEqual(ReadonlyArray.elem(2)([1, 2, 3]), true)
      deepStrictEqual(ReadonlyArray.elem(0)([1, 2, 3]), false)
      deepStrictEqual(pipe([1, 2, 3], ReadonlyArray.elem(2)), true)
      deepStrictEqual(pipe([1, 2, 3], ReadonlyArray.elem(0)), false)
    })

    it("unfold", () => {
      const as = ReadonlyArray.unfold(5, (n) => (n > 0 ? Option.some([n, n - 1]) : Option.none))
      deepStrictEqual(as, [5, 4, 3, 2, 1])
    })

    // TODO
    // it("wither", async () => {
    //   const wither = ReadonlyArray.wither(T.ApplicativePar)((n: number) =>
    //     T.of(n > 2 ? Option.some(n + 1) : Option.none)
    //   )
    //   deepStrictEqual(await pipe([], wither)(), [])
    //   deepStrictEqual(await pipe([1, 3], wither)(), [4])
    // })

    // TODO
    // it("wilt", async () => {
    //   const wilt = ReadonlyArray.wilt(T.ApplicativePar)((n: number) =>
    //     T.of(n > 2 ? Result.succeed(n + 1) : Result.fail(n - 1))
    //   )
    //   deepStrictEqual(await pipe([], wilt)(), separated([], []))
    //   deepStrictEqual(await pipe([1, 3], wilt)(), separated([0], [4]))
    // })

    it("map", () => {
      deepStrictEqual(
        pipe(
          [1, 2, 3],
          ReadonlyArray.map((n) => n * 2)
        ),
        [2, 4, 6]
      )
    })

    it("mapWithIndex", () => {
      deepStrictEqual(
        pipe(
          [1, 2, 3],
          ReadonlyArray.mapWithIndex((i, n) => n + i)
        ),
        [1, 3, 5]
      )
    })

    it("orElse", () => {
      deepStrictEqual(
        pipe(
          [1, 2],
          ReadonlyArray.orElse([3, 4])
        ),
        [1, 2, 3, 4]
      )
    })

    it("ap", () => {
      deepStrictEqual(
        pipe([(x: number) => x * 2, (x: number) => x * 3], ReadonlyArray.ap([1, 2, 3])),
        [
          2,
          4,
          6,
          3,
          6,
          9
        ]
      )
    })

    it("zipLeft", () => {
      deepStrictEqual(pipe([1, 2], ReadonlyArray.zipLeft(["a", "b", "c"])), [1, 1, 1, 2, 2, 2])
    })

    it("zipRigth", () => {
      deepStrictEqual(pipe([1, 2], ReadonlyArray.zipRight(["a", "b", "c"])), [
        "a",
        "b",
        "c",
        "a",
        "b",
        "c"
      ])
    })

    it("flatMap", () => {
      deepStrictEqual(
        pipe(
          [1, 2, 3],
          ReadonlyArray.flatMap((n) => [n, n + 1])
        ),
        [1, 2, 2, 3, 3, 4]
      )
    })

    it("flatMapWithIndex", () => {
      const f = ReadonlyArray.flatMapWithIndex((i, n: number) => [n + i])
      deepStrictEqual(pipe([1, 2, 3], f), [1, 3, 5])
      strictEqual(pipe(ReadonlyArray.empty, f), ReadonlyArray.empty)
      const empty: ReadonlyArray<number> = []
      strictEqual(pipe(empty, f), ReadonlyArray.empty)
    })

    it("chainFirst", () => {
      deepStrictEqual(
        pipe(
          [1, 2, 3],
          ReadonlyArray.tap((n) => [n, n + 1])
        ),
        [1, 1, 2, 2, 3, 3]
      )
    })

    it("extend", () => {
      const sum = (as: ReadonlyArray<number>) => Number.MonoidSum.combineAll(as)
      deepStrictEqual(pipe([1, 2, 3, 4], ReadonlyArray.extend(sum)), [10, 9, 7, 4])
      deepStrictEqual(pipe([1, 2, 3, 4], ReadonlyArray.extend(identity)), [
        [1, 2, 3, 4],
        [2, 3, 4],
        [3, 4],
        [
          4
        ]
      ])
    })

    it("foldMap", () => {
      deepStrictEqual(pipe(["a", "b", "c"], ReadonlyArray.foldMap(String.Monoid)(identity)), "abc")
      deepStrictEqual(pipe([], ReadonlyArray.foldMap(String.Monoid)(identity)), "")
    })

    it("compact", () => {
      deepStrictEqual(ReadonlyArray.compact([]), [])
      deepStrictEqual(ReadonlyArray.compact([Option.some(1), Option.some(2), Option.some(3)]), [
        1,
        2,
        3
      ])
      deepStrictEqual(ReadonlyArray.compact([Option.some(1), Option.none, Option.some(3)]), [
        1,
        3
      ])
    })

    it("separate", () => {
      deepStrictEqual(ReadonlyArray.separate([]), [[], []])
      deepStrictEqual(
        ReadonlyArray.separate([Result.fail(123), Result.succeed("123")]),
        [[123], ["123"]]
      )
    })

    it("filter", () => {
      const g = (n: number) => n % 2 === 1
      deepStrictEqual(pipe([1, 2, 3], ReadonlyArray.filter(g)), [1, 3])
      const x = pipe(
        [Option.some(3), Option.some(2), Option.some(1)],
        ReadonlyArray.filter(Option.isSome)
      )
      assert.deepStrictEqual(x, [Option.some(3), Option.some(2), Option.some(1)])
      const y = pipe(
        [Option.some(3), Option.none, Option.some(1)],
        ReadonlyArray.filter(Option.isSome)
      )
      assert.deepStrictEqual(y, [Option.some(3), Option.some(1)])
    })

    it("filterWithIndex", () => {
      const f = (n: number) => n % 2 === 0
      deepStrictEqual(pipe(["a", "b", "c"], ReadonlyArray.filterWithIndex(f)), ["a", "c"])
    })

    it("filterMap", () => {
      const f = (n: number) => (n % 2 === 0 ? Option.none : Option.some(n))
      deepStrictEqual(pipe([1, 2, 3], ReadonlyArray.filterMap(f)), [1, 3])
      deepStrictEqual(pipe([], ReadonlyArray.filterMap(f)), [])
    })

    it("foldMapWithIndex", () => {
      deepStrictEqual(
        pipe(
          ["a", "b"],
          ReadonlyArray.foldMapWithIndex(String.Monoid)((i, a) => i + a)
        ),
        "0a1b"
      )
    })

    it("filterMapWithIndex", () => {
      const f = (i: number, n: number) => ((i + n) % 2 === 0 ? Option.none : Option.some(n))
      deepStrictEqual(pipe([1, 2, 4], ReadonlyArray.filterMapWithIndex(f)), [1, 2])
      deepStrictEqual(pipe([], ReadonlyArray.filterMapWithIndex(f)), [])
    })

    it("partitionMap", () => {
      deepStrictEqual(pipe([], ReadonlyArray.partitionMap(identity)), [[], []])
      deepStrictEqual(
        pipe(
          [Result.succeed(1), Result.fail("foo"), Result.succeed(2)],
          ReadonlyArray.partitionMap(identity)
        ),
        [["foo"], [1, 2]]
      )
    })

    it("partition", () => {
      deepStrictEqual(
        pipe([], ReadonlyArray.partition((n) => n > 2)),
        [[], []]
      )
      deepStrictEqual(
        pipe([1, 3], ReadonlyArray.partition((n) => n > 2)),
        [[1], [3]]
      )
    })

    it("partitionMapWithIndex", () => {
      deepStrictEqual(
        pipe([], ReadonlyArray.partitionMapWithIndex((_, a) => a)),
        [[], []]
      )
      deepStrictEqual(
        pipe(
          [Result.succeed(1), Result.fail("foo"), Result.succeed(2)],
          ReadonlyArray.partitionMapWithIndex((i, a) => pipe(a, Result.filter((n) => n > i, "err")))
        ),
        [["foo", "err"], [1]]
      )
    })

    it("partitionWithIndex", () => {
      deepStrictEqual(
        pipe([], ReadonlyArray.partitionWithIndex((i, n) => i + n > 2)),
        [[], []]
      )
      deepStrictEqual(
        pipe([1, 2], ReadonlyArray.partitionWithIndex((i, n) => i + n > 2)),
        [[1], [2]]
      )
    })

    it("reduce", () => {
      deepStrictEqual(
        pipe(
          ["a", "b", "c"],
          ReadonlyArray.reduce("", (acc, a) => acc + a)
        ),
        "abc"
      )
    })

    it("reduceWithIndex", () => {
      deepStrictEqual(
        pipe(
          ["a", "b"],
          ReadonlyArray.reduceWithIndex("", (i, b, a) => b + i + a)
        ),
        "0a1b"
      )
    })

    it("reduceRight", () => {
      const as: ReadonlyArray<string> = ["a", "b", "c"]
      const b = ""
      const f = (a: string, acc: string) => acc + a
      deepStrictEqual(pipe(as, ReadonlyArray.reduceRight(b, f)), "cba")
      const x2: ReadonlyArray<string> = []
      deepStrictEqual(pipe(x2, ReadonlyArray.reduceRight(b, f)), "")
    })

    it("reduceRightWithIndex", () => {
      deepStrictEqual(
        pipe(
          ["a", "b"],
          ReadonlyArray.reduceRightWithIndex("", (i, a, b) => b + i + a)
        ),
        "1b0a"
      )
    })

    it("duplicate", () => {
      deepStrictEqual(pipe(["a", "b"], ReadonlyArray.duplicate), [["a", "b"], ["b"]])
    })
  })

  it("getMonoid", () => {
    const M = ReadonlyArray.getMonoid<number>()
    deepStrictEqual(M.combine([3, 4])([1, 2]), [1, 2, 3, 4])
    const x = [1, 2]
    strictEqual(M.combine(M.empty)(x), x)
    strictEqual(M.combine(x)(M.empty), x)
  })

  it("getEq", () => {
    strictEqual(Equal.equals([], []), true)
    strictEqual(Equal.equals(["a"], ["a"]), true)
    strictEqual(Equal.equals(["a", "b"], ["a", "b"]), true)
    strictEqual(Equal.equals(["a"], []), false)
    strictEqual(Equal.equals([], ["a"]), false)
    strictEqual(Equal.equals(["a"], ["b"]), false)
    strictEqual(Equal.equals(["a", "b"], ["b", "a"]), false)
    strictEqual(Equal.equals(["a", "a"], ["a"]), false)
  })

  // TODO
  // it("getOrd", () => {
  //   const O = ReadonlyArray.getOrd(String.Ord)
  //   deepStrictEqual(O.compare([], []), 0)
  //   deepStrictEqual(O.compare(["a"], ["a"]), 0)

  //   deepStrictEqual(O.compare(["b"], ["a"]), 1)
  //   deepStrictEqual(O.compare(["a"], ["b"]), -1)

  //   deepStrictEqual(O.compare(["a"], []), 1)
  //   deepStrictEqual(O.compare([], ["a"]), -1)
  //   deepStrictEqual(O.compare(["a", "a"], ["a"]), 1)
  //   deepStrictEqual(O.compare(["a", "a"], ["b"]), -1)

  //   deepStrictEqual(O.compare(["a", "a"], ["a", "a"]), 0)
  //   deepStrictEqual(O.compare(["a", "b"], ["a", "b"]), 0)

  //   deepStrictEqual(O.compare(["a", "a"], ["a", "b"]), -1)
  //   deepStrictEqual(O.compare(["a", "b"], ["a", "a"]), 1)

  //   deepStrictEqual(O.compare(["a", "b"], ["b", "a"]), -1)
  //   deepStrictEqual(O.compare(["b", "a"], ["a", "a"]), 1)
  //   deepStrictEqual(O.compare(["b", "a"], ["a", "b"]), 1)
  //   deepStrictEqual(O.compare(["b", "b"], ["b", "a"]), 1)
  //   deepStrictEqual(O.compare(["b", "a"], ["b", "b"]), -1)
  // })

  it("isEmpty", () => {
    const as: ReadonlyArray<number> = [1, 2, 3]
    deepStrictEqual(ReadonlyArray.isEmpty(as), false)
    deepStrictEqual(ReadonlyArray.isEmpty([]), true)
  })

  it("isNotEmpty", () => {
    const as: ReadonlyArray<number> = [1, 2, 3]
    deepStrictEqual(ReadonlyArray.isNonEmpty(as), true)
    deepStrictEqual(ReadonlyArray.isNonEmpty([]), false)
  })

  it("prepend", () => {
    deepStrictEqual(pipe([1, 2, 3], ReadonlyArray.prepend(0)), [0, 1, 2, 3])
    deepStrictEqual(pipe([[2]], ReadonlyArray.prepend([1])), [[1], [2]])
  })

  it("append", () => {
    const as: ReadonlyArray<number> = [1, 2, 3]
    deepStrictEqual(ReadonlyArray.append(4)(as), [1, 2, 3, 4])
    deepStrictEqual(ReadonlyArray.append([2])([[1]]), [[1], [2]])
  })

  it("head", () => {
    const as: ReadonlyArray<number> = [1, 2, 3]
    deepStrictEqual(ReadonlyArray.head(as), Option.some(1))
    deepStrictEqual(ReadonlyArray.head([]), Option.none)
  })

  it("last", () => {
    const as: ReadonlyArray<number> = [1, 2, 3]
    deepStrictEqual(ReadonlyArray.last(as), Option.some(3))
    deepStrictEqual(ReadonlyArray.last([]), Option.none)
  })

  it("tail", () => {
    const as: ReadonlyArray<number> = [1, 2, 3]
    deepStrictEqual(ReadonlyArray.tail(as), Option.some([2, 3]))
    deepStrictEqual(ReadonlyArray.tail([]), Option.none)
  })

  it("takeLeft", () => {
    // _.empty
    strictEqual(ReadonlyArray.takeLeft(0)(ReadonlyArray.empty), ReadonlyArray.empty)
    // empty
    const empty: ReadonlyArray<number> = []
    strictEqual(ReadonlyArray.takeLeft(0)(empty), empty)
    const full: ReadonlyArray<number> = [1, 2]
    // non empty
    strictEqual(ReadonlyArray.takeLeft(0)(full), ReadonlyArray.empty)
    deepStrictEqual(ReadonlyArray.takeLeft(1)(full), [1])
    // full
    strictEqual(ReadonlyArray.takeLeft(2)(full), full)
    // out of bound
    strictEqual(ReadonlyArray.takeLeft(1)(ReadonlyArray.empty), ReadonlyArray.empty)
    strictEqual(ReadonlyArray.takeLeft(1)(empty), empty)
    strictEqual(ReadonlyArray.takeLeft(3)(full), full)
    strictEqual(ReadonlyArray.takeLeft(-1)(ReadonlyArray.empty), ReadonlyArray.empty)
    strictEqual(ReadonlyArray.takeLeft(-1)(empty), empty)
    strictEqual(ReadonlyArray.takeLeft(-1)(full), full)
  })

  it("takeRight", () => {
    // _.empty
    strictEqual(ReadonlyArray.takeRight(0)(ReadonlyArray.empty), ReadonlyArray.empty)
    // empty
    const empty: ReadonlyArray<number> = []
    strictEqual(ReadonlyArray.takeRight(0)(empty), empty)
    const full: ReadonlyArray<number> = [1, 2]
    // non empty
    strictEqual(ReadonlyArray.takeRight(0)(full), ReadonlyArray.empty)
    deepStrictEqual(ReadonlyArray.takeRight(1)(full), [2])
    // full
    strictEqual(ReadonlyArray.takeRight(2)(full), full)
    // out of bound
    strictEqual(ReadonlyArray.takeRight(1)(ReadonlyArray.empty), ReadonlyArray.empty)
    strictEqual(ReadonlyArray.takeRight(1)(empty), empty)
    strictEqual(ReadonlyArray.takeRight(3)(full), full)
    strictEqual(ReadonlyArray.takeRight(-1)(ReadonlyArray.empty), ReadonlyArray.empty)
    strictEqual(ReadonlyArray.takeRight(-1)(empty), empty)
    strictEqual(ReadonlyArray.takeRight(-1)(full), full)
  })

  it("spanLeft", () => {
    const f = ReadonlyArray.spanLeft((n: number) => n % 2 === 1)
    const assertSpanLeft = (
      input: ReadonlyArray<number>,
      expectedInit: ReadonlyArray<number>,
      expectedRest: ReadonlyArray<number>
    ) => {
      const [init, rest] = f(input)
      strictEqual(init, expectedInit)
      strictEqual(rest, expectedRest)
    }
    deepStrictEqual(f([1, 3, 2, 4, 5]), [[1, 3], [2, 4, 5]])
    const empty: ReadonlyArray<number> = []
    assertSpanLeft(empty, empty, ReadonlyArray.empty)
    assertSpanLeft(ReadonlyArray.empty, ReadonlyArray.empty, ReadonlyArray.empty)
    const inputAll: ReadonlyArray<number> = [1, 3]
    assertSpanLeft(inputAll, inputAll, ReadonlyArray.empty)
    const inputNone: ReadonlyArray<number> = [2, 4]
    assertSpanLeft(inputNone, ReadonlyArray.empty, inputNone)
  })

  it("takeLeftWhile", () => {
    const f = (n: number) => n % 2 === 0
    deepStrictEqual(ReadonlyArray.takeLeftWhile(f)([2, 4, 3, 6]), [2, 4])
    const empty: ReadonlyArray<number> = []
    strictEqual(ReadonlyArray.takeLeftWhile(f)(empty), empty)
    strictEqual(ReadonlyArray.takeLeftWhile(f)(ReadonlyArray.empty), ReadonlyArray.empty)
    strictEqual(ReadonlyArray.takeLeftWhile(f)([1, 2, 4]), ReadonlyArray.empty)
    const input: ReadonlyArray<number> = [2, 4]
    strictEqual(ReadonlyArray.takeLeftWhile(f)(input), input)
  })

  it("dropLeft", () => {
    // _.empty
    strictEqual(ReadonlyArray.dropLeft(0)(ReadonlyArray.empty), ReadonlyArray.empty)
    // empty
    const empty: ReadonlyArray<number> = []
    strictEqual(ReadonlyArray.dropLeft(0)(empty), empty)
    const full: ReadonlyArray<number> = [1, 2]
    // non empty
    strictEqual(ReadonlyArray.dropLeft(0)(full), full)
    deepStrictEqual(ReadonlyArray.dropLeft(1)(full), [2])
    // full
    strictEqual(ReadonlyArray.dropLeft(2)(full), ReadonlyArray.empty)
    // out of bound
    strictEqual(ReadonlyArray.dropLeft(1)(ReadonlyArray.empty), ReadonlyArray.empty)
    strictEqual(ReadonlyArray.dropLeft(1)(empty), empty)
    strictEqual(ReadonlyArray.dropLeft(3)(full), ReadonlyArray.empty)
    strictEqual(ReadonlyArray.dropLeft(-1)(ReadonlyArray.empty), ReadonlyArray.empty)
    strictEqual(ReadonlyArray.dropLeft(-1)(empty), empty)
    strictEqual(ReadonlyArray.dropLeft(-1)(full), full)
  })

  it("dropRight", () => {
    // _.empty
    strictEqual(ReadonlyArray.dropRight(0)(ReadonlyArray.empty), ReadonlyArray.empty)
    // empty
    const empty: ReadonlyArray<number> = []
    strictEqual(ReadonlyArray.dropRight(0)(empty), empty)
    const full: ReadonlyArray<number> = [1, 2]
    // non empty
    strictEqual(ReadonlyArray.dropRight(0)(full), full)
    deepStrictEqual(ReadonlyArray.dropRight(1)(full), [1])
    // full
    strictEqual(ReadonlyArray.dropRight(2)(full), ReadonlyArray.empty)
    // out of bound
    strictEqual(ReadonlyArray.dropRight(1)(ReadonlyArray.empty), ReadonlyArray.empty)
    strictEqual(ReadonlyArray.dropRight(1)(empty), empty)
    strictEqual(ReadonlyArray.dropRight(3)(full), ReadonlyArray.empty)
    strictEqual(ReadonlyArray.dropRight(-1)(ReadonlyArray.empty), ReadonlyArray.empty)
    strictEqual(ReadonlyArray.dropRight(-1)(empty), empty)
    strictEqual(ReadonlyArray.dropRight(-1)(full), full)
  })

  it("dropLeftWhile", () => {
    const f = ReadonlyArray.dropLeftWhile((n: number) => n > 0)
    strictEqual(f(ReadonlyArray.empty), ReadonlyArray.empty)
    const empty: ReadonlyArray<number> = []
    strictEqual(f(empty), empty)
    strictEqual(f([1, 2]), ReadonlyArray.empty)
    const x1: ReadonlyArray<number> = [-1, -2]
    strictEqual(f(x1), x1)
    const x2: ReadonlyArray<number> = [-1, 2]
    strictEqual(f(x2), x2)
    deepStrictEqual(f([1, -2, 3]), [-2, 3])
  })

  it("init", () => {
    const as: ReadonlyArray<number> = [1, 2, 3]
    deepStrictEqual(ReadonlyArray.init(as), Option.some([1, 2]))
    deepStrictEqual(ReadonlyArray.init([]), Option.none)
  })

  it("findIndex", () => {
    deepStrictEqual(ReadonlyArray.findIndex((x) => x === 2)([1, 2, 3]), Option.some(1))
    deepStrictEqual(ReadonlyArray.findIndex((x) => x === 2)([]), Option.none)
  })

  it("findFirst", () => {
    deepStrictEqual(
      pipe(
        [],
        ReadonlyArray.findFirst((x: { readonly a: number }) => x.a > 1)
      ),
      Option.none
    )
    deepStrictEqual(
      pipe(
        [{ a: 1 }, { a: 2 }, { a: 3 }],
        ReadonlyArray.findFirst((x) => x.a > 1)
      ),
      Option.some({ a: 2 })
    )
    deepStrictEqual(
      pipe(
        [{ a: 1 }, { a: 2 }, { a: 3 }],
        ReadonlyArray.findFirst((x) => x.a > 3)
      ),
      Option.none
    )
  })

  it("findFirstMap", () => {
    deepStrictEqual(
      pipe(
        [1, 2, 3],
        ReadonlyArray.findFirstMap((n) => (n > 1 ? Option.some(n * 2) : Option.none))
      ),
      Option.some(4)
    )
    deepStrictEqual(
      pipe(
        [1],
        ReadonlyArray.findFirstMap((n) => (n < 1 ? Option.some(n * 2) : Option.none))
      ),
      Option.none
    )
  })

  it("findLast", () => {
    deepStrictEqual(
      pipe(
        [],
        ReadonlyArray.findLast((x: { readonly a: number }) => x.a > 1)
      ),
      Option.none
    )
    deepStrictEqual(
      pipe(
        [{ a: 1 }, { a: 2 }, { a: 3 }],
        ReadonlyArray.findLast((x) => x.a > 1)
      ),
      Option.some({ a: 3 })
    )
    deepStrictEqual(
      pipe(
        [{ a: 1 }, { a: 2 }, { a: 3 }],
        ReadonlyArray.findLast((x) => x.a > 3)
      ),
      Option.none
    )
  })

  it("findLastMap", () => {
    deepStrictEqual(
      pipe(
        [1, 2, 3],
        ReadonlyArray.findLastMap((n) => (n > 1 ? Option.some(n * 2) : Option.none))
      ),
      Option.some(6)
    )
    deepStrictEqual(
      pipe(
        [1],
        ReadonlyArray.findLastMap((n) => (n > 1 ? Option.some(n * 2) : Option.none))
      ),
      Option.none
    )
  })

  it("findLastIndex", () => {
    interface X {
      readonly a: number
      readonly b: number
    }
    const xs: ReadonlyArray<X> = [
      { a: 1, b: 0 },
      { a: 1, b: 1 }
    ]
    deepStrictEqual(ReadonlyArray.findLastIndex((x: X) => x.a === 1)(xs), Option.some(1))
    deepStrictEqual(ReadonlyArray.findLastIndex((x: X) => x.a === 4)(xs), Option.none)
    deepStrictEqual(ReadonlyArray.findLastIndex((x: X) => x.a === 1)([]), Option.none)
  })

  it("insertAt", () => {
    deepStrictEqual(ReadonlyArray.insertAt(1, 1)([]), Option.none)
    deepStrictEqual(ReadonlyArray.insertAt(0, 1)([]), Option.some([1] as const))
    deepStrictEqual(
      ReadonlyArray.insertAt(2, 5)([1, 2, 3, 4]),
      Option.some([1, 2, 5, 3, 4] as const)
    )
  })

  // TODO
  // it("unsafeUpdateAt", () => {
  //   const empty: ReadonlyArray<number> = []
  //   strictEqual(ReadonlyArray.unsafeUpdateAt(1, 2, empty), empty)
  //   strictEqual(ReadonlyArray.unsafeUpdateAt(1, 2, ReadonlyArray.empty), ReadonlyArray.empty)
  //   // should return the same reference if nothing changed
  //   const input: ReadonlyArray<number> = [1, 2, 3]
  //   deepStrictEqual(
  //     pipe(ReadonlyArray.unsafeUpdateAt(1, 2, input), (out) => out === input),
  //     true
  //   )
  // })

  it("updateAt", () => {
    const as: ReadonlyArray<number> = [1, 2, 3]
    deepStrictEqual(ReadonlyArray.updateAt(1, 1)(as), Option.some([1, 1, 3]))
    deepStrictEqual(ReadonlyArray.updateAt(1, 1)([]), Option.none)
  })

  it("deleteAt", () => {
    const as: ReadonlyArray<number> = [1, 2, 3]
    deepStrictEqual(ReadonlyArray.deleteAt(0)(as), Option.some([2, 3]))
    deepStrictEqual(ReadonlyArray.deleteAt(1)([]), Option.none)
  })

  it("modifyAt", () => {
    deepStrictEqual(ReadonlyArray.modifyAt(1, double)([1, 2, 3]), Option.some([1, 4, 3]))
    deepStrictEqual(ReadonlyArray.modifyAt(1, double)([]), Option.none)
    // should return the same reference if nothing changed
    const input: ReadonlyArray<number> = [1, 2, 3]
    deepStrictEqual(
      pipe(
        input,
        ReadonlyArray.modifyAt(1, identity),
        Option.map((out) => out === input)
      ),
      Option.some(true)
    )
  })

  it("sort", () => {
    const S = pipe(
      Number.Sortable,
      Sortable.contramap((x: { readonly a: number }) => x.a)
    )
    deepStrictEqual(
      pipe(
        [
          { a: 3, b: "b1" },
          { a: 2, b: "b2" },
          { a: 1, b: "b3" }
        ],
        ReadonlyArray.sort(S)
      ),
      [
        { a: 1, b: "b3" },
        { a: 2, b: "b2" },
        { a: 3, b: "b1" }
      ]
    )
    strictEqual(ReadonlyArray.sort(Number.Sortable)(ReadonlyArray.empty), ReadonlyArray.empty)
    const as: ReadonlyArray<number> = [1]
    strictEqual(ReadonlyArray.sort(Number.Sortable)(as), as)
  })

  it("zipWith", () => {
    deepStrictEqual(
      pipe([1, 2, 3], ReadonlyArray.zipWith([], (n, s) => s + n)),
      []
    )
    deepStrictEqual(
      pipe([], ReadonlyArray.zipWith(["a", "b", "c", "d"], (n, s) => s + n)),
      []
    )
    deepStrictEqual(
      pipe([], ReadonlyArray.zipWith([], (n, s) => s + n)),
      []
    )
    deepStrictEqual(
      pipe([1, 2, 3], ReadonlyArray.zipWith(["a", "b", "c", "d"], (n, s) => s + n)),
      ["a1", "b2", "c3"]
    )
  })

  it("zip", () => {
    deepStrictEqual(pipe([], ReadonlyArray.zip(["a", "b", "c", "d"])), [])
    deepStrictEqual(pipe([1, 2, 3], ReadonlyArray.zip([])), [])
    deepStrictEqual(pipe([1, 2, 3], ReadonlyArray.zip(["a", "b", "c", "d"])), [
      [1, "a"],
      [2, "b"],
      [3, "c"]
    ])
    deepStrictEqual(pipe([1, 2, 3], ReadonlyArray.zip(["a", "b", "c", "d"])), [
      [1, "a"],
      [2, "b"],
      [3, "c"]
    ])
  })

  it("unzip", () => {
    deepStrictEqual(ReadonlyArray.unzip([]), [[], []])
    deepStrictEqual(
      ReadonlyArray.unzip([
        [1, "a"],
        [2, "b"],
        [3, "c"]
      ]),
      [
        [1, 2, 3],
        ["a", "b", "c"]
      ]
    )
  })

  it("successes", () => {
    deepStrictEqual(
      ReadonlyArray.successes([Result.succeed(1), Result.fail("foo"), Result.succeed(2)]),
      [1, 2]
    )
    deepStrictEqual(ReadonlyArray.successes([]), [])
  })

  it("failures", () => {
    deepStrictEqual(
      ReadonlyArray.failures([Result.succeed(1), Result.fail("foo"), Result.succeed(2)]),
      ["foo"]
    )
    deepStrictEqual(ReadonlyArray.failures([]), [])
  })

  it("flatten", () => {
    deepStrictEqual(ReadonlyArray.flatten([[1], [2], [3]]), [1, 2, 3])
  })

  it("prependAll", () => {
    const empty: ReadonlyArray<number> = []
    strictEqual(ReadonlyArray.prependAll(0)(empty), empty)
    strictEqual(ReadonlyArray.prependAll(0)(ReadonlyArray.empty), ReadonlyArray.empty)
    deepStrictEqual(ReadonlyArray.prependAll(0)([1, 2, 3]), [0, 1, 0, 2, 0, 3])
    deepStrictEqual(ReadonlyArray.prependAll(0)([1]), [0, 1])
    deepStrictEqual(ReadonlyArray.prependAll(0)([1, 2, 3, 4]), [0, 1, 0, 2, 0, 3, 0, 4])
  })

  it("intersperse", () => {
    const empty: ReadonlyArray<number> = []
    strictEqual(ReadonlyArray.intersperse(0)(empty), empty)
    strictEqual(ReadonlyArray.intersperse(0)(ReadonlyArray.empty), ReadonlyArray.empty)
    const singleton = [1]
    strictEqual(ReadonlyArray.intersperse(0)(singleton), singleton)
    deepStrictEqual(ReadonlyArray.intersperse(0)([1, 2, 3]), [1, 0, 2, 0, 3])
    deepStrictEqual(ReadonlyArray.intersperse(0)([1, 2]), [1, 0, 2])
    deepStrictEqual(ReadonlyArray.intersperse(0)([1, 2, 3, 4]), [1, 0, 2, 0, 3, 0, 4])
  })

  it("intercalate", () => {
    deepStrictEqual(ReadonlyArray.intercalate(String.Monoid)("-")([]), "")
    deepStrictEqual(ReadonlyArray.intercalate(String.Monoid)("-")(["a"]), "a")
    deepStrictEqual(ReadonlyArray.intercalate(String.Monoid)("-")(["a", "b", "c"]), "a-b-c")
    deepStrictEqual(ReadonlyArray.intercalate(String.Monoid)("-")(["a", "", "c"]), "a--c")
    deepStrictEqual(ReadonlyArray.intercalate(String.Monoid)("-")(["a", "b"]), "a-b")
    deepStrictEqual(ReadonlyArray.intercalate(String.Monoid)("-")(["a", "b", "c", "d"]), "a-b-c-d")
  })

  it("rotate", () => {
    strictEqual(ReadonlyArray.rotate(0)(ReadonlyArray.empty), ReadonlyArray.empty)
    strictEqual(ReadonlyArray.rotate(1)(ReadonlyArray.empty), ReadonlyArray.empty)

    const singleton: ReadonlyArray<number> = [1]
    strictEqual(ReadonlyArray.rotate(1)(singleton), singleton)
    strictEqual(ReadonlyArray.rotate(2)(singleton), singleton)
    strictEqual(ReadonlyArray.rotate(-1)(singleton), singleton)
    strictEqual(ReadonlyArray.rotate(-2)(singleton), singleton)
    const two: ReadonlyArray<number> = [1, 2]
    strictEqual(ReadonlyArray.rotate(2)(two), two)
    strictEqual(ReadonlyArray.rotate(0)(two), two)
    strictEqual(ReadonlyArray.rotate(-2)(two), two)

    deepStrictEqual(ReadonlyArray.rotate(1)([1, 2]), [2, 1])
    deepStrictEqual(ReadonlyArray.rotate(1)([1, 2, 3, 4, 5]), [5, 1, 2, 3, 4])
    deepStrictEqual(ReadonlyArray.rotate(2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
    deepStrictEqual(ReadonlyArray.rotate(-1)([1, 2, 3, 4, 5]), [2, 3, 4, 5, 1])
    deepStrictEqual(ReadonlyArray.rotate(-2)([1, 2, 3, 4, 5]), [3, 4, 5, 1, 2])

    deepStrictEqual(ReadonlyArray.rotate(7)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
    deepStrictEqual(ReadonlyArray.rotate(-7)([1, 2, 3, 4, 5]), [3, 4, 5, 1, 2])

    deepStrictEqual(ReadonlyArray.rotate(2.2)([1, 2, 3, 4, 5]), [4, 5, 1, 2, 3])
    deepStrictEqual(ReadonlyArray.rotate(-2.2)([1, 2, 3, 4, 5]), [3, 4, 5, 1, 2])
  })

  it("reverse", () => {
    const empty: ReadonlyArray<number> = []
    strictEqual(ReadonlyArray.reverse(empty), empty)
    strictEqual(ReadonlyArray.reverse(ReadonlyArray.empty), ReadonlyArray.empty)
    const singleton: ReadonlyArray<number> = [1]
    strictEqual(ReadonlyArray.reverse(singleton), singleton)
    deepStrictEqual(ReadonlyArray.reverse([1, 2, 3]), [3, 2, 1])
  })

  it("matchLeft", () => {
    const len: <A>(as: ReadonlyArray<A>) => number = ReadonlyArray.matchLeft(
      () => 0,
      (_, tail) => 1 + len(tail)
    )
    deepStrictEqual(len([1, 2, 3]), 3)
  })

  it("matchRight", () => {
    const len: <A>(as: ReadonlyArray<A>) => number = ReadonlyArray.matchRight(
      () => 0,
      (init, _) => 1 + len(init)
    )
    deepStrictEqual(len([1, 2, 3]), 3)
  })

  it("scanLeft", () => {
    const f = (b: number, a: number) => b - a
    deepStrictEqual(ReadonlyArray.scanLeft(10, f)([1, 2, 3]), [10, 9, 7, 4])
    deepStrictEqual(ReadonlyArray.scanLeft(10, f)([0]), [10, 10])
    deepStrictEqual(ReadonlyArray.scanLeft(10, f)([]), [10])
  })

  it("scanRight", () => {
    const f = (b: number, a: number) => b - a
    deepStrictEqual(ReadonlyArray.scanRight(10, f)([1, 2, 3]), [-8, 9, -7, 10])
    deepStrictEqual(ReadonlyArray.scanRight(10, f)([0]), [-10, 10])
    deepStrictEqual(ReadonlyArray.scanRight(10, f)([]), [10])
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
  //   const arrUniq: ReadonlyArray<A> = [arrA, arrC]

  //   deepStrictEqual(ReadonlyArray.uniq(eqA)(arrUniq), arrUniq)
  //   deepStrictEqual(ReadonlyArray.uniq(eqA)([arrA, arrB, arrC, arrD]), [arrA, arrC])
  //   deepStrictEqual(ReadonlyArray.uniq(eqA)([arrB, arrA, arrC, arrD]), [arrB, arrC])
  //   deepStrictEqual(ReadonlyArray.uniq(eqA)([arrA, arrA, arrC, arrD, arrA]), [arrA, arrC])
  //   deepStrictEqual(ReadonlyArray.uniq(eqA)([arrA, arrC]), [arrA, arrC])
  //   deepStrictEqual(ReadonlyArray.uniq(eqA)([arrC, arrA]), [arrC, arrA])
  //   deepStrictEqual(ReadonlyArray.uniq(Boolean.Eq)([true, false, true, false]), [true, false])
  //   deepStrictEqual(ReadonlyArray.uniq(Number.Eq)([-0, -0]), [-0])
  //   deepStrictEqual(ReadonlyArray.uniq(Number.Eq)([0, -0]), [0])
  //   deepStrictEqual(ReadonlyArray.uniq(Number.Eq)([1]), [1])
  //   deepStrictEqual(ReadonlyArray.uniq(Number.Eq)([2, 1, 2]), [2, 1])
  //   deepStrictEqual(ReadonlyArray.uniq(Number.Eq)([1, 2, 1]), [1, 2])
  //   deepStrictEqual(ReadonlyArray.uniq(Number.Eq)([1, 2, 3, 4, 5]), [1, 2, 3, 4, 5])
  //   deepStrictEqual(ReadonlyArray.uniq(Number.Eq)([1, 1, 2, 2, 3, 3, 4, 4, 5, 5]), [1, 2, 3, 4, 5])
  //   deepStrictEqual(ReadonlyArray.uniq(Number.Eq)([1, 2, 3, 4, 5, 1, 2, 3, 4, 5]), [1, 2, 3, 4, 5])
  //   deepStrictEqual(ReadonlyArray.uniq(String.Eq)(["a", "b", "a"]), ["a", "b"])
  //   deepStrictEqual(ReadonlyArray.uniq(String.Eq)(["a", "b", "A"]), ["a", "b", "A"])

  //   strictEqual(ReadonlyArray.uniq(Number.Eq)(ReadonlyArray.empty), ReadonlyArray.empty)
  //   const as: ReadonlyArray<number> = [1]
  //   strictEqual(ReadonlyArray.uniq(Number.Eq)(as), as)
  // })

  it("sortBy", () => {
    interface X {
      readonly a: string
      readonly b: number
      readonly c: boolean
    }
    const byName = pipe(
      String.Sortable,
      Sortable.contramap((p: { readonly a: string; readonly b: number }) => p.a)
    )
    const byAge = pipe(
      Number.Sortable,
      Sortable.contramap((p: { readonly a: string; readonly b: number }) => p.b)
    )
    const f = ReadonlyArray.sortBy([byName, byAge])
    const xs: ReadonlyArray<X> = [
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
    const sortByAgeByName = ReadonlyArray.sortBy([byAge, byName])
    deepStrictEqual(sortByAgeByName(xs), [
      { a: "a", b: 1, c: true },
      { a: "b", b: 2, c: true },
      { a: "c", b: 2, c: true },
      { a: "b", b: 3, c: true }
    ])

    strictEqual(f(ReadonlyArray.empty), ReadonlyArray.empty)
    strictEqual(ReadonlyArray.sortBy([])(xs), xs)
  })

  it("chop", () => {
    const f = ReadonlyArray.chop<number, number>((as) => [as[0] * 2, as.slice(1)])
    const empty: ReadonlyArray<number> = []
    strictEqual(f(empty), ReadonlyArray.empty)
    strictEqual(f(ReadonlyArray.empty), ReadonlyArray.empty)
    deepStrictEqual(f([1, 2, 3]), [2, 4, 6])
  })

  it("splitAt", () => {
    const assertSplitAt = (
      input: ReadonlyArray<number>,
      index: number,
      expectedInit: ReadonlyArray<number>,
      expectedRest: ReadonlyArray<number>
    ) => {
      const [init, rest] = ReadonlyArray.splitAt(index)(input)
      strictEqual(init, expectedInit)
      strictEqual(rest, expectedRest)
    }
    deepStrictEqual(ReadonlyArray.splitAt(1)([1, 2]), [[1], [2]])
    const two: ReadonlyArray<number> = [1, 2]
    assertSplitAt(two, 2, two, ReadonlyArray.empty)
    deepStrictEqual(ReadonlyArray.splitAt(2)([1, 2, 3, 4, 5]), [
      [1, 2],
      [3, 4, 5]
    ])
    // zero
    const empty: ReadonlyArray<number> = []
    assertSplitAt(ReadonlyArray.empty, 0, ReadonlyArray.empty, ReadonlyArray.empty)
    assertSplitAt(empty, 0, empty, ReadonlyArray.empty)
    assertSplitAt(two, 0, ReadonlyArray.empty, two)
    // out of bounds
    assertSplitAt(ReadonlyArray.empty, -1, ReadonlyArray.empty, ReadonlyArray.empty)
    assertSplitAt(empty, -1, empty, ReadonlyArray.empty)
    assertSplitAt(two, -1, ReadonlyArray.empty, two)
    assertSplitAt(two, 3, two, ReadonlyArray.empty)
    assertSplitAt(ReadonlyArray.empty, 3, ReadonlyArray.empty, ReadonlyArray.empty)
    assertSplitAt(empty, 3, empty, ReadonlyArray.empty)
  })

  describe("chunksOf", () => {
    it("should split a `ReadonlyArray` into length-n pieces", () => {
      deepStrictEqual(ReadonlyArray.chunksOf(2)([1, 2, 3, 4, 5]), [[1, 2], [3, 4], [5]])
      deepStrictEqual(ReadonlyArray.chunksOf(2)([1, 2, 3, 4, 5, 6]), [
        [1, 2],
        [3, 4],
        [5, 6]
      ])
      deepStrictEqual(ReadonlyArray.chunksOf(1)([1, 2, 3, 4, 5]), [[1], [2], [3], [4], [5]])
      deepStrictEqual(ReadonlyArray.chunksOf(5)([1, 2, 3, 4, 5]), [[1, 2, 3, 4, 5]])
      // out of bounds
      deepStrictEqual(ReadonlyArray.chunksOf(0)([1, 2, 3, 4, 5]), [[1], [2], [3], [4], [5]])
      deepStrictEqual(ReadonlyArray.chunksOf(-1)([1, 2, 3, 4, 5]), [[1], [2], [3], [4], [5]])

      const assertSingleChunk = (input: ReadonlyArray<number>, n: number) => {
        const chunks = ReadonlyArray.chunksOf(n)(input)
        strictEqual(chunks.length, 1)
        strictEqual(chunks[0], input)
      }
      // n = length
      assertSingleChunk([1, 2], 2)
      // n out of bounds
      assertSingleChunk([1, 2], 3)
    })

    it("returns an empty array if provided an empty array", () => {
      const empty: ReadonlyArray<number> = []
      strictEqual(ReadonlyArray.chunksOf(0)(empty), ReadonlyArray.empty)
      strictEqual(ReadonlyArray.chunksOf(0)(ReadonlyArray.empty), ReadonlyArray.empty)
      strictEqual(ReadonlyArray.chunksOf(1)(empty), ReadonlyArray.empty)
      strictEqual(ReadonlyArray.chunksOf(1)(ReadonlyArray.empty), ReadonlyArray.empty)
      strictEqual(ReadonlyArray.chunksOf(2)(empty), ReadonlyArray.empty)
      strictEqual(ReadonlyArray.chunksOf(2)(ReadonlyArray.empty), ReadonlyArray.empty)
    })

    it("should respect the law: chunksOf(n)(xs).concat(chunksOf(n)(ys)) == chunksOf(n)(xs.concat(ys)))", () => {
      const xs: ReadonlyArray<number> = []
      const ys: ReadonlyArray<number> = [1, 2]
      deepStrictEqual(
        ReadonlyArray.chunksOf(2)(xs).concat(ReadonlyArray.chunksOf(2)(ys)),
        ReadonlyArray.chunksOf(2)(xs.concat(ys))
      )
      fc.assert(
        fc.property(
          fc.array(fc.integer()).filter((xs) => xs.length % 2 === 0), // Ensures `xs.length` is even
          fc.array(fc.integer()),
          fc.integer({ min: 1, max: 1 }).map((x) => x * 2), // Generates `n` to be even so that it evenly divides `xs`
          (xs, ys, n) => {
            const as = ReadonlyArray.chunksOf(n)(xs).concat(ReadonlyArray.chunksOf(n)(ys))
            const bs = ReadonlyArray.chunksOf(n)(xs.concat(ys))
            deepStrictEqual(as, bs)
          }
        )
      )
    })
  })

  it("makeBy", () => {
    deepStrictEqual(ReadonlyArray.makeBy(double)(5), [0, 2, 4, 6, 8])
    strictEqual(ReadonlyArray.makeBy(double)(0), ReadonlyArray.empty)
    strictEqual(ReadonlyArray.makeBy(double)(-1), ReadonlyArray.empty)
    deepStrictEqual(ReadonlyArray.makeBy(double)(2.2), [0, 2])
  })

  it("replicate", () => {
    strictEqual(ReadonlyArray.replicate("a")(0), ReadonlyArray.empty)
    strictEqual(ReadonlyArray.replicate("a")(-1), ReadonlyArray.empty)
    deepStrictEqual(ReadonlyArray.replicate("a")(3), ["a", "a", "a"])
    deepStrictEqual(ReadonlyArray.replicate("a")(2.2), ["a", "a"])
  })

  it("range", () => {
    deepStrictEqual(ReadonlyArray.range(0, 0), [0])
    deepStrictEqual(ReadonlyArray.range(0, 1), [0, 1])
    deepStrictEqual(ReadonlyArray.range(1, 5), [1, 2, 3, 4, 5])
    deepStrictEqual(ReadonlyArray.range(10, 15), [10, 11, 12, 13, 14, 15])
    deepStrictEqual(ReadonlyArray.range(-1, 0), [-1, 0])
    deepStrictEqual(ReadonlyArray.range(-5, -1), [-5, -4, -3, -2, -1])
    // out of bound
    deepStrictEqual(ReadonlyArray.range(2, 1), [2])
    deepStrictEqual(ReadonlyArray.range(-1, -2), [-1])
  })

  it("union", () => {
    const two: ReadonlyArray<number> = [1, 2]
    deepStrictEqual(pipe(two, ReadonlyArray.union([3, 4])), [1, 2, 3, 4])
    deepStrictEqual(pipe(two, ReadonlyArray.union([2, 3])), [1, 2, 3])
    deepStrictEqual(pipe(two, ReadonlyArray.union([1, 2])), [1, 2])
    strictEqual(pipe(two, ReadonlyArray.union(ReadonlyArray.empty)), two)
    strictEqual(pipe(ReadonlyArray.empty, ReadonlyArray.union(two)), two)
    strictEqual(
      pipe(ReadonlyArray.empty, ReadonlyArray.union(ReadonlyArray.empty)),
      ReadonlyArray.empty
    )
  })

  it("intersection", () => {
    deepStrictEqual(pipe([1, 2], ReadonlyArray.intersection([3, 4])), [])
    deepStrictEqual(pipe([1, 2], ReadonlyArray.intersection([2, 3])), [2])
    deepStrictEqual(pipe([1, 2], ReadonlyArray.intersection([1, 2])), [1, 2])
  })

  it("difference", () => {
    deepStrictEqual(pipe([1, 2], ReadonlyArray.difference([3, 4])), [1, 2])
    deepStrictEqual(pipe([1, 2], ReadonlyArray.difference([2, 3])), [1])
    deepStrictEqual(pipe([1, 2], ReadonlyArray.difference([1, 2])), [])
  })

  it("getUnionMonoid", () => {
    const M = ReadonlyArray.getUnionMonoid<number>()
    const two: ReadonlyArray<number> = [1, 2]
    deepStrictEqual(M.combine([3, 4])(two), [1, 2, 3, 4])
    deepStrictEqual(M.combine([2, 3])(two), [1, 2, 3])
    deepStrictEqual(M.combine([1, 2])(two), [1, 2])

    strictEqual(M.combine(two)(M.empty), two)
    strictEqual(M.combine(M.empty)(two), two)
    strictEqual(M.combine(M.empty)(M.empty), M.empty)
  })

  it("getIntersectionSemigroup", () => {
    const S = ReadonlyArray.getIntersectionSemigroup<number>()
    deepStrictEqual(S.combine([1, 2])([3, 4]), [])
    deepStrictEqual(S.combine([1, 2])([2, 3]), [2])
    deepStrictEqual(S.combine([1, 2])([1, 2]), [1, 2])
  })

  it("should be safe when calling map with a binary function", () => {
    interface Foo {
      readonly bar: () => number
    }
    const f = (a: number, x?: Foo) => (x !== undefined ? `${a}${x.bar()}` : `${a}`)
    deepStrictEqual(pipe([1, 2], ReadonlyArray.map(f)), ["1", "2"])
  })

  it("empty", () => {
    strictEqual(ReadonlyArray.empty.length, 0)
  })

  it("do notation", () => {
    deepStrictEqual(
      pipe(
        ReadonlyArray.Do,
        ReadonlyArray.bind("a", () => [1, 2, 3]),
        ReadonlyArray.map(({ a }) => a * 2)
      ),
      [2, 4, 6]
    )

    deepStrictEqual(
      pipe(
        ReadonlyArray.Do,
        ReadonlyArray.bind("a", () => [1, 2, 3]),
        ReadonlyArray.bind("b", () => ["a", "b"]),
        ReadonlyArray.map(({ a, b }) => [a, b] as const)
      ),
      [
        [1, "a"],
        [1, "b"],
        [2, "a"],
        [2, "b"],
        [3, "a"],
        [3, "b"]
      ]
    )

    deepStrictEqual(
      pipe(
        ReadonlyArray.Do,
        ReadonlyArray.bind("a", () => [1, 2, 3]),
        ReadonlyArray.bind("b", () => ["a", "b"]),
        ReadonlyArray.map(({ a, b }) => [a, b] as const),
        ReadonlyArray.filter(([a, b]) => (a + b.length) % 2 === 0)
      ),
      [
        [1, "a"],
        [1, "b"],
        [3, "a"],
        [3, "b"]
      ]
    )
  })

  it("every", () => {
    const isPositive: Predicate<number> = (n) => n > 0
    deepStrictEqual(pipe([1, 2, 3], ReadonlyArray.every(isPositive)), true)
    deepStrictEqual(pipe([1, 2, -3], ReadonlyArray.every(isPositive)), false)
  })

  it("some", () => {
    const isPositive: Predicate<number> = (n) => n > 0
    deepStrictEqual(pipe([-1, -2, 3], ReadonlyArray.some(isPositive)), true)
    deepStrictEqual(pipe([-1, -2, -3], ReadonlyArray.some(isPositive)), false)
  })

  it("size", () => {
    deepStrictEqual(ReadonlyArray.size(ReadonlyArray.empty), 0)
    deepStrictEqual(ReadonlyArray.size([]), 0)
    deepStrictEqual(ReadonlyArray.size(["a"]), 1)
  })

  it("fromOption", () => {
    deepStrictEqual(ReadonlyArray.fromOption(Option.some("hello")), ["hello"])
    deepStrictEqual(ReadonlyArray.fromOption(Option.none), [])
  })

  it("fromResult", () => {
    deepStrictEqual(ReadonlyArray.fromResult(Result.succeed(1)), [1])
    strictEqual(ReadonlyArray.fromResult(Result.fail("a")), ReadonlyArray.empty)
  })

  it("match", () => {
    const f = ReadonlyArray.match(
      () => "empty",
      (as) => `nonEmpty ${as.length}`
    )
    deepStrictEqual(pipe(ReadonlyArray.empty, f), "empty")
    deepStrictEqual(pipe([1, 2, 3], f), "nonEmpty 3")
  })
})
