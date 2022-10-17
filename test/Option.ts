import { identity, pipe } from "@fp-ts/data/Function"
import * as Option from "@fp-ts/data/Option"
import * as ReadonlyArray from "@fp-ts/data/ReadonlyArray"
import * as Result from "@fp-ts/data/Result"
import * as String from "@fp-ts/data/String"
import { deepStrictEqual, double } from "@fp-ts/data/test/util"

const p = (n: number): boolean => n > 2

describe.concurrent("Option", () => {
  // TODO
  // describe.concurrent("firstSuccessOf", () => {
  //   it("baseline", () => {
  //     deepStrictEqual(O.firstSuccessOf([]), O.none)
  //     deepStrictEqual(O.firstSuccessOf([O.none]), O.none)
  //     deepStrictEqual(O.firstSuccessOf([O.none, O.some(1)]), O.some(1))
  //   })

  //   it("should accept an Iterable", () => {
  //     deepStrictEqual(O.firstSuccessOf(new Set([O.none, O.some(1)])), O.some(1))
  //   })
  // })

  it("reduce", () => {
    deepStrictEqual(
      pipe(
        Option.none,
        Option.reduce(2, (b, a) => b + a)
      ),
      2
    )
    deepStrictEqual(
      pipe(
        Option.some(3),
        Option.reduce(2, (b, a) => b + a)
      ),
      5
    )
  })

  it("foldMap", () => {
    deepStrictEqual(pipe(Option.some("a"), Option.foldMap(String.Monoid)(identity)), "a")
    deepStrictEqual(pipe(Option.none, Option.foldMap(String.Monoid)(identity)), "")
  })

  it("reduceRight", () => {
    const f = (a: string, acc: string) => acc + a
    deepStrictEqual(pipe(Option.some("a"), Option.reduceRight("", f)), "a")
    deepStrictEqual(pipe(Option.none, Option.reduceRight("", f)), "")
  })

  it("fromIterable", () => {
    deepStrictEqual(Option.fromIterable([]), Option.none)
    deepStrictEqual(Option.fromIterable(["a"]), Option.some("a"))
  })

  // TODO
  // it("idKleisli", () => {
  //   deepStrictEqual(O.idKleisli<number>()(1), O.some(1))
  // })

  // TODO
  // it("composeKleisli", () => {
  //   const g = (n: number): O.Option<number> => (n !== 0 ? O.some(n / 2) : O.none)
  //   const h = pipe(RA.head<number>, O.composeKleisli(g))
  //   deepStrictEqual(h([2]), O.some(1))
  //   deepStrictEqual(h([]), O.none)
  //   deepStrictEqual(h([0]), O.none)
  // })

  it("lift2", () => {
    const f = (a: number, b: number) => a + b
    const g = Option.lift2(f)
    deepStrictEqual(g(Option.none, Option.none), Option.none)
    deepStrictEqual(g(Option.some(1), Option.none), Option.none)
    deepStrictEqual(g(Option.none, Option.some(2)), Option.none)
    deepStrictEqual(g(Option.some(1), Option.some(2)), Option.some(3))
  })

  it("lift3", () => {
    const f = (a: number, b: number, c: number) => a + b + c
    const g = Option.lift3(f)
    deepStrictEqual(g(Option.none, Option.none, Option.none), Option.none)
    deepStrictEqual(g(Option.some(1), Option.none, Option.none), Option.none)
    deepStrictEqual(g(Option.none, Option.some(2), Option.none), Option.none)
    deepStrictEqual(g(Option.none, Option.none, Option.some(3)), Option.none)
    deepStrictEqual(g(Option.some(1), Option.some(2), Option.none), Option.none)
    deepStrictEqual(g(Option.some(1), Option.none, Option.some(3)), Option.none)
    deepStrictEqual(g(Option.none, Option.some(2), Option.some(3)), Option.none)
    deepStrictEqual(g(Option.some(1), Option.some(2), Option.some(3)), Option.some(6))
  })

  describe.concurrent("pipeables", () => {
    it("map", () => {
      deepStrictEqual(pipe(Option.some(2), Option.map(double)), Option.some(4))
      deepStrictEqual(pipe(Option.none, Option.map(double)), Option.none)
    })

    it("ap", () => {
      deepStrictEqual(pipe(Option.some(double), Option.ap(Option.some(2))), Option.some(4))
      deepStrictEqual(pipe(Option.some(double), Option.ap(Option.none)), Option.none)
      deepStrictEqual(pipe(Option.none, Option.ap(Option.some(2))), Option.none)
      deepStrictEqual(pipe(Option.none, Option.ap(Option.none)), Option.none)
    })

    it("flatMap", () => {
      const f = (n: number) => Option.some(n * 2)
      const g = () => Option.none
      deepStrictEqual(pipe(Option.some(1), Option.flatMap(f)), Option.some(2))
      deepStrictEqual(pipe(Option.none, Option.flatMap(f)), Option.none)
      deepStrictEqual(pipe(Option.some(1), Option.flatMap(g)), Option.none)
      deepStrictEqual(pipe(Option.none, Option.flatMap(g)), Option.none)
    })

    it("tap", () => {
      const f = (n: number) => Option.some(n * 2)
      deepStrictEqual(pipe(Option.some(1), Option.tap(f)), Option.some(1))
    })

    it("duplicate", () => {
      deepStrictEqual(pipe(Option.some(1), Option.duplicate), Option.some(Option.some(1)))
    })

    it("flatten", () => {
      deepStrictEqual(pipe(Option.some(Option.some(1)), Option.flatten), Option.some(1))
    })

    it("orElse", () => {
      const assertAlt = (
        a: Option.Option<number>,
        b: Option.Option<number>,
        expected: Option.Option<number>
      ) => {
        deepStrictEqual(pipe(a, Option.orElse(b)), expected)
      }
      assertAlt(Option.some(1), Option.some(2), Option.some(1))
      assertAlt(Option.some(1), Option.none, Option.some(1))
      assertAlt(Option.none, Option.some(2), Option.some(2))
      assertAlt(Option.none, Option.none, Option.none)
    })

    it("extend", () => {
      const f = Option.getOrElse(() => 0)
      deepStrictEqual(pipe(Option.some(2), Option.extend(f)), Option.some(2))
      deepStrictEqual(pipe(Option.none, Option.extend(f)), Option.none)
    })

    it("compact", () => {
      deepStrictEqual(Option.compact(Option.none), Option.none)
      deepStrictEqual(Option.compact(Option.some(Option.none)), Option.none)
      deepStrictEqual(Option.compact(Option.some(Option.some("123"))), Option.some("123"))
    })

    it("separate", () => {
      deepStrictEqual(Option.separate(Option.none), [Option.none, Option.none])
      deepStrictEqual(Option.separate(Option.some(Result.fail("123"))), [
        Option.some("123"),
        Option.none
      ])
      deepStrictEqual(Option.separate(Option.some(Result.succeed("123"))), [
        Option.none,
        Option.some("123")
      ])
    })

    it("filter", () => {
      const predicate = (a: number) => a === 2
      deepStrictEqual(pipe(Option.none, Option.filter(predicate)), Option.none)
      deepStrictEqual(pipe(Option.some(1), Option.filter(predicate)), Option.none)
      deepStrictEqual(pipe(Option.some(2), Option.filter(predicate)), Option.some(2))
    })

    it("filterMap", () => {
      const f = (n: number) => (p(n) ? Option.some(n + 1) : Option.none)
      deepStrictEqual(pipe(Option.none, Option.filterMap(f)), Option.none)
      deepStrictEqual(pipe(Option.some(1), Option.filterMap(f)), Option.none)
      deepStrictEqual(pipe(Option.some(3), Option.filterMap(f)), Option.some(4))
    })

    it("partition", () => {
      deepStrictEqual(pipe(Option.none, Option.partition(p)), [Option.none, Option.none])
      deepStrictEqual(pipe(Option.some(1), Option.partition(p)), [Option.some(1), Option.none])
      deepStrictEqual(pipe(Option.some(3), Option.partition(p)), [Option.none, Option.some(3)])
    })

    it("partitionMap", () => {
      const f = (n: number) => (p(n) ? Result.succeed(n + 1) : Result.fail(n - 1))
      deepStrictEqual(pipe(Option.none, Option.partitionMap(f)), [Option.none, Option.none])
      deepStrictEqual(pipe(Option.some(1), Option.partitionMap(f)), [Option.some(0), Option.none])
      deepStrictEqual(pipe(Option.some(3), Option.partitionMap(f)), [Option.none, Option.some(4)])
    })

    it("traverse", () => {
      deepStrictEqual(
        pipe(
          Option.some("hello"),
          Option.traverse(ReadonlyArray.Applicative)(() => [])
        ),
        []
      )
      deepStrictEqual(
        pipe(
          Option.some("hello"),
          Option.traverse(ReadonlyArray.Applicative)((s) => [s.length])
        ),
        [Option.some(5)]
      )
      deepStrictEqual(
        pipe(
          Option.none,
          Option.traverse(ReadonlyArray.Applicative)((s) => [s])
        ),
        [Option.none]
      )
    })

    it("sequence", () => {
      const sequence = Option.sequence(ReadonlyArray.Applicative)
      deepStrictEqual(sequence(Option.some([1, 2])), [Option.some(1), Option.some(2)])
      deepStrictEqual(sequence(Option.none), [Option.none])
    })

    // TODO
    // it("filterMapKind", async () => {
    //   const filterMapKind = O.traverseFilterMap(T.ApplicativePar)((n: number) =>
    //     T.of(p(n) ? O.some(n + 1) : O.none)
    //   )
    //   deepStrictEqual(await pipe(O.none, filterMapKind)(), O.none)
    //   deepStrictEqual(await pipe(O.some(1), filterMapKind)(), O.none)
    //   deepStrictEqual(await pipe(O.some(3), filterMapKind)(), O.some(4))
    // })

    // TODO
    // it("partitionMapKind", async () => {
    //   const partitionMapKind = O.traversePartitionMap(T.ApplicativePar)((n: number) =>
    //     T.of(p(n) ? E.succeed(n + 1) : E.fail(n - 1))
    //   )
    //   deepStrictEqual(await pipe(O.none, partitionMapKind)(), [O.none, O.none])
    //   deepStrictEqual(await pipe(O.some(1), partitionMapKind)(), [O.some(0), O.none])
    //   deepStrictEqual(await pipe(O.some(3), partitionMapKind)(), [O.none, O.some(4)])
    // })
  })

  it("toResult", () => {
    deepStrictEqual(pipe(Option.none, Option.toResult("e")), Result.fail("e"))
    deepStrictEqual(pipe(Option.some(1), Option.toResult("e")), Result.succeed(1))
  })

  it("match", () => {
    const f = () => "none"
    const g = (s: string) => `some${s.length}`
    const match = Option.match(f, g)
    deepStrictEqual(match(Option.none), "none")
    deepStrictEqual(match(Option.some("abc")), "some3")
  })

  it("toNullable", () => {
    deepStrictEqual(Option.toNull(Option.none), null)
    deepStrictEqual(Option.toNull(Option.some(1)), 1)
  })

  it("toUndefined", () => {
    deepStrictEqual(Option.toUndefined(Option.none), undefined)
    deepStrictEqual(Option.toUndefined(Option.some(1)), 1)
  })

  it("getOrElse", () => {
    deepStrictEqual(pipe(Option.some(1), Option.getOrElse(0)), 1)
    deepStrictEqual(pipe(Option.none, Option.getOrElse(0)), 0)
  })

  it("getOrd", () => {
    const OS = Option.liftOrd(String.Ord)
    deepStrictEqual(pipe(Option.none, OS.compare(Option.none)), 0)
    deepStrictEqual(pipe(Option.some("a"), OS.compare(Option.none)), 1)
    deepStrictEqual(pipe(Option.none, OS.compare(Option.some("a"))), -1)
    deepStrictEqual(pipe(Option.some("a"), OS.compare(Option.some("a"))), 0)
    deepStrictEqual(pipe(Option.some("a"), OS.compare(Option.some("b"))), -1)
    deepStrictEqual(pipe(Option.some("b"), OS.compare(Option.some("a"))), 1)
  })

  it("flatMapNullable", () => {
    interface X {
      readonly a?: {
        readonly b?: {
          readonly c?: {
            readonly d: number
          }
        }
      }
    }
    const x1: X = { a: {} }
    const x2: X = { a: { b: {} } }
    const x3: X = { a: { b: { c: { d: 1 } } } }
    deepStrictEqual(
      pipe(
        Option.fromNullable(x1.a),
        Option.flatMapNullable((x) => x.b),
        Option.flatMapNullable((x) => x.c),
        Option.flatMapNullable((x) => x.d)
      ),
      Option.none
    )
    deepStrictEqual(
      pipe(
        Option.fromNullable(x2.a),
        Option.flatMapNullable((x) => x.b),
        Option.flatMapNullable((x) => x.c),
        Option.flatMapNullable((x) => x.d)
      ),
      Option.none
    )
    deepStrictEqual(
      pipe(
        Option.fromNullable(x3.a),
        Option.flatMapNullable((x) => x.b),
        Option.flatMapNullable((x) => x.c),
        Option.flatMapNullable((x) => x.d)
      ),
      Option.some(1)
    )
  })

  it("getMonoid", () => {
    const M = Option.getMonoid(String.Semigroup)
    deepStrictEqual(pipe(Option.none, M.combine(Option.none)), Option.none)
    deepStrictEqual(pipe(Option.none, M.combine(Option.some("a"))), Option.some("a"))
    deepStrictEqual(pipe(Option.some("a"), M.combine(Option.none)), Option.some("a"))
    deepStrictEqual(pipe(Option.some("b"), M.combine(Option.some("a"))), Option.some("ba"))
    deepStrictEqual(pipe(Option.some("a"), M.combine(Option.some("b"))), Option.some("ab"))
  })

  it("fromNullable", () => {
    deepStrictEqual(Option.fromNullable(2), Option.some(2))
    deepStrictEqual(Option.fromNullable(null), Option.none)
    deepStrictEqual(Option.fromNullable(undefined), Option.none)
  })

  it("fromPredicate", () => {
    const f = Option.liftPredicate(p)
    deepStrictEqual(f(1), Option.none)
    deepStrictEqual(f(3), Option.some(3))

    type Direction = "asc" | "desc"
    const parseDirection = Option.liftPredicate((s: string): s is Direction =>
      s === "asc" || s === "desc"
    )
    deepStrictEqual(parseDirection("asc"), Option.some("asc"))
    deepStrictEqual(parseDirection("foo"), Option.none)
  })

  it("elem", () => {
    deepStrictEqual(pipe(Option.none, Option.elem(2)), false)
    deepStrictEqual(pipe(Option.some(2), Option.elem(2)), true)
    deepStrictEqual(pipe(Option.some(2), Option.elem(1)), false)
  })

  it("isNone", () => {
    deepStrictEqual(Option.isNone(Option.none), true)
    deepStrictEqual(Option.isNone(Option.some(1)), false)
  })

  it("isSome", () => {
    deepStrictEqual(Option.isSome(Option.none), false)
    deepStrictEqual(Option.isSome(Option.some(1)), true)
  })

  it("exists", () => {
    const predicate = (a: number) => a === 2
    deepStrictEqual(pipe(Option.none, Option.exists(predicate)), false)
    deepStrictEqual(pipe(Option.some(1), Option.exists(predicate)), false)
    deepStrictEqual(pipe(Option.some(2), Option.exists(predicate)), true)
  })

  it("tryCatch", () => {
    deepStrictEqual(
      Option.fromThrowable(() => JSON.parse("2")),
      Option.some(2)
    )
    deepStrictEqual(
      Option.fromThrowable(() => JSON.parse("(")),
      Option.none
    )
  })

  // TODO
  // it("liftShow", () => {
  //   const Sh = O.liftShow(S.Show)
  //   deepStrictEqual(Sh.show(O.some("a")), `some("a")`)
  //   deepStrictEqual(Sh.show(O.none), `none`)
  // })

  it("fromResult", () => {
    deepStrictEqual(Option.fromResult(Result.succeed(1)), Option.some(1))
    deepStrictEqual(Option.fromResult(Result.fail("e")), Option.none)
  })

  it("do notation", () => {
    deepStrictEqual(
      pipe(
        Option.some(1),
        Option.bindTo("a"),
        Option.bind("b", () => Option.some("b"))
      ),
      Option.some({ a: 1, b: "b" })
    )
  })

  it("apS", () => {
    deepStrictEqual(
      pipe(Option.some(1), Option.bindTo("a"), Option.bindRight("b", Option.some("b"))),
      Option.some({ a: 1, b: "b" })
    )
  })

  it("zipFlatten", () => {
    deepStrictEqual(
      pipe(Option.some(1), Option.tupled, Option.zipFlatten(Option.some("b"))),
      Option.some([1, "b"] as const)
    )
  })

  it("liftNullable", () => {
    const f = Option.liftNullable((n: number) => (n > 0 ? n : null))
    deepStrictEqual(f(1), Option.some(1))
    deepStrictEqual(f(-1), Option.none)
  })

  it("liftThrowable", () => {
    const f = Option.liftThrowable((s: string) => {
      const len = s.length
      if (len > 0) {
        return len
      }
      throw new Error("empty string")
    })
    deepStrictEqual(f("a"), Option.some(1))
    deepStrictEqual(f(""), Option.none)
  })

  it("guard", () => {
    deepStrictEqual(
      pipe(
        Option.Do,
        Option.bind("x", () => Option.some("a")),
        Option.bind("y", () => Option.some("a")),
        Option.filter(({ x, y }) => x === y)
      ),
      Option.some({ x: "a", y: "a" })
    )
    deepStrictEqual(
      pipe(
        Option.Do,
        Option.bind("x", () => Option.some("a")),
        Option.bind("y", () => Option.some("b")),
        Option.filter(({ x, y }) => x === y)
      ),
      Option.none
    )
  })

  // -------------------------------------------------------------------------------------
  // array utils
  // -------------------------------------------------------------------------------------

  it("traverseReadonlyArrayWithIndex", () => {
    const f = Option.traverseReadonlyArrayWithIndex((
      i,
      a: string
    ) => (a.length > 0 ? Option.some(a + i) : Option.none))
    deepStrictEqual(pipe(ReadonlyArray.empty, f), Option.some(ReadonlyArray.empty))
    deepStrictEqual(pipe(["a", "b"], f), Option.some(["a0", "b1"]))
    deepStrictEqual(pipe(["a", ""], f), Option.none)
  })

  it("traverseNonEmptyReadonlyArray", () => {
    const f = Option.traverseNonEmptyReadonlyArray((
      a: string
    ) => (a.length > 0 ? Option.some(a) : Option.none))
    deepStrictEqual(pipe(["a", "b"], f), Option.some(["a", "b"] as const))
    deepStrictEqual(pipe(["a", ""], f), Option.none)
  })

  it("sequenceReadonlyArray", () => {
    deepStrictEqual(
      pipe([Option.some("a"), Option.some("b")], Option.sequenceReadonlyArray),
      Option.some(["a", "b"])
    )
    deepStrictEqual(
      pipe([Option.some("a"), Option.none], Option.sequenceReadonlyArray),
      Option.none
    )
  })
})
