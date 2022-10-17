import { flow, identity, pipe } from "@fp-ts/data/Function"
import * as Number from "@fp-ts/data/Number"
import * as Option from "@fp-ts/data/Option"
import * as ReadonlyArray from "@fp-ts/data/ReadonlyArray"
import * as Result from "@fp-ts/data/Result"
import * as String from "@fp-ts/data/String"
// import { gt } from "@fp-ts/data/typeclasses/Ord"
import { deepStrictEqual, double } from "@fp-ts/data/test/util"

describe.concurrent("Result", () => {
  it("reduce", () => {
    deepStrictEqual(
      pipe(
        Result.succeed("bar"),
        Result.reduce("foo", (b, a) => b + a)
      ),
      "foobar"
    )
    deepStrictEqual(
      pipe(
        Result.fail("bar"),
        Result.reduce("foo", (b, a) => b + a)
      ),
      "foo"
    )
  })

  it("foldMap", () => {
    deepStrictEqual(pipe(Result.succeed("a"), Result.foldMap(String.Monoid)(identity)), "a")
    deepStrictEqual(pipe(Result.fail(1), Result.foldMap(String.Monoid)(identity)), "")
  })

  it("reduceRight", () => {
    const f = (a: string, acc: string) => acc + a
    deepStrictEqual(pipe(Result.succeed("a"), Result.reduceRight("", f)), "a")
    deepStrictEqual(pipe(Result.fail(1), Result.reduceRight("", f)), "")
  })

  it("getSuccess", () => {
    deepStrictEqual(pipe(Result.succeed(1), Result.getSuccess), Option.some(1))
    deepStrictEqual(pipe(Result.fail("a"), Result.getSuccess), Option.none)
  })

  it("getFailure", () => {
    deepStrictEqual(pipe(Result.succeed(1), Result.getFailure), Option.none)
    deepStrictEqual(pipe(Result.fail("e"), Result.getFailure), Option.some("e"))
  })

  it("toNull", () => {
    deepStrictEqual(pipe(Result.succeed(1), Result.toNull), 1)
    deepStrictEqual(pipe(Result.fail("a"), Result.toNull), null)
  })

  it("toUndefined", () => {
    deepStrictEqual(pipe(Result.succeed(1), Result.toUndefined), 1)
    deepStrictEqual(pipe(Result.fail("a"), Result.toUndefined), undefined)
  })

  it("compact", () => {
    deepStrictEqual(
      pipe(
        Result.succeed(Option.some(1)),
        Result.compact(() => "e2")
      ),
      Result.succeed(1)
    )
    deepStrictEqual(pipe(Result.succeed(Option.none), Result.compact("e2")), Result.fail("e2"))
    deepStrictEqual(pipe(Result.fail("e1"), Result.compact("e2")), Result.fail("e1"))
  })

  it("separate", () => {
    deepStrictEqual(pipe(Result.succeed(Result.succeed(1)), Result.separate("e2")), [
      Result.fail("e2"),
      Result.succeed(1)
    ])
    deepStrictEqual(pipe(Result.succeed(Result.fail("e1")), Result.separate("e2")), [
      Result.succeed("e1"),
      Result.fail("e2")
    ])
    deepStrictEqual(pipe(Result.fail("e1"), Result.separate("e2")), [
      Result.fail("e1"),
      Result.fail("e1")
    ])
  })

  it("tapError", () => {
    deepStrictEqual(
      pipe(
        Result.succeed(1),
        Result.tapError(() => Result.succeed(2))
      ),
      Result.succeed(1)
    )
    deepStrictEqual(
      pipe(
        Result.fail("a"),
        Result.tapError(() => Result.succeed(2))
      ),
      Result.fail("a")
    )
    deepStrictEqual(
      pipe(
        Result.fail("a"),
        Result.tapError(() => Result.fail("b"))
      ),
      Result.fail("b")
    )
  })

  it("zipLeft", () => {
    deepStrictEqual(pipe(Result.succeed(1), Result.zipLeft(Result.succeed("a"))), Result.succeed(1))
    deepStrictEqual(pipe(Result.succeed(1), Result.zipLeft(Result.fail(true))), Result.fail(true))
    deepStrictEqual(pipe(Result.fail(1), Result.zipLeft(Result.succeed("a"))), Result.fail(1))
    deepStrictEqual(pipe(Result.fail(1), Result.zipLeft(Result.fail(true))), Result.fail(1))
  })

  it("zipRight", () => {
    deepStrictEqual(
      pipe(Result.succeed(1), Result.zipRight(Result.succeed("a"))),
      Result.succeed("a")
    )
    deepStrictEqual(pipe(Result.succeed(1), Result.zipRight(Result.fail(true))), Result.fail(true))
    deepStrictEqual(pipe(Result.fail(1), Result.zipRight(Result.succeed("a"))), Result.fail(1))
    deepStrictEqual(pipe(Result.fail(1), Result.zipRight(Result.fail(true))), Result.fail(1))
  })

  describe.concurrent("pipeables", () => {
    it("orElse", () => {
      const assertAlt = (
        a: Result.Result<string, number>,
        b: Result.Result<string, number>,
        expected: Result.Result<string, number>
      ) => {
        deepStrictEqual(pipe(a, Result.orElse(b)), expected)
      }
      assertAlt(Result.succeed(1), Result.succeed(2), Result.succeed(1))
      assertAlt(Result.succeed(1), Result.fail("b"), Result.succeed(1))
      assertAlt(Result.fail("a"), Result.succeed(2), Result.succeed(2))
      assertAlt(Result.fail("a"), Result.fail("b"), Result.fail("b"))
    })

    it("map", () => {
      const f = Result.map(String.size)
      deepStrictEqual(pipe(Result.succeed("abc"), f), Result.succeed(3))
      deepStrictEqual(pipe(Result.fail("s"), f), Result.fail("s"))
    })

    it("ap", () => {
      const assertAp = (
        a: Result.Result<string, number>,
        b: Result.Result<string, number>,
        expected: Result.Result<string, number>
      ) => {
        deepStrictEqual(
          pipe(
            a,
            Result.map((a) => (b: number) => a + b),
            Result.ap(b)
          ),
          expected
        )
      }
      assertAp(Result.succeed(1), Result.succeed(2), Result.succeed(3))
      assertAp(Result.succeed(1), Result.fail("b"), Result.fail("b"))
      assertAp(Result.fail("a"), Result.succeed(2), Result.fail("a"))
      assertAp(Result.fail("a"), Result.fail("b"), Result.fail("a"))
    })

    it("flatMap", () => {
      const f = Result.flatMap<string, string, number>(flow(String.size, Result.succeed))
      deepStrictEqual(pipe(Result.succeed("abc"), f), Result.succeed(3))
      deepStrictEqual(pipe(Result.fail("maError"), f), Result.fail("maError"))
    })

    it("tap", () => {
      const f = Result.tap(flow(String.size, Result.succeed))
      deepStrictEqual(pipe(Result.succeed("abc"), f), Result.succeed("abc"))
      deepStrictEqual(pipe(Result.fail("maError"), f), Result.fail("maError"))
    })

    it("duplicate", () => {
      deepStrictEqual(
        pipe(Result.succeed("a"), Result.duplicate),
        Result.succeed(Result.succeed("a"))
      )
    })

    it("extend", () => {
      deepStrictEqual(
        pipe(
          Result.succeed(1),
          Result.extend(() => 2)
        ),
        Result.succeed(2)
      )
      deepStrictEqual(
        pipe(
          Result.fail("err"),
          Result.extend(() => 2)
        ),
        Result.fail("err")
      )
    })

    it("flatten", () => {
      deepStrictEqual(
        pipe(Result.succeed(Result.succeed("a")), Result.flatten),
        Result.succeed("a")
      )
    })

    it("mapBoth", () => {
      const f = Result.mapBoth(String.size, (n: number) => n > 2)
      deepStrictEqual(pipe(Result.succeed(1), f), Result.succeed(false))
    })

    it("mapError", () => {
      const f = Result.mapError(double)
      deepStrictEqual(pipe(Result.succeed("a"), f), Result.succeed("a"))
      deepStrictEqual(pipe(Result.fail(1), f), Result.fail(2))
    })

    it("traverse", () => {
      const traverse = Result.traverse(Option.Applicative)((
        n: number
      ) => (n >= 2 ? Option.some(n) : Option.none))
      deepStrictEqual(pipe(Result.fail("a"), traverse), Option.some(Result.fail("a")))
      deepStrictEqual(pipe(Result.succeed(1), traverse), Option.none)
      deepStrictEqual(pipe(Result.succeed(3), traverse), Option.some(Result.succeed(3)))
    })

    it("sequence", () => {
      const sequence = Result.sequence(Option.Applicative)
      deepStrictEqual(sequence(Result.succeed(Option.some(1))), Option.some(Result.succeed(1)))
      deepStrictEqual(sequence(Result.fail("a")), Option.some(Result.fail("a")))
      deepStrictEqual(sequence(Result.succeed(Option.none)), Option.none)
    })
  })

  it("match", () => {
    const f = (s: string) => `left${s.length}`
    const g = (s: string) => `right${s.length}`
    const match = Result.match(f, g)
    deepStrictEqual(match(Result.fail("abc")), "left3")
    deepStrictEqual(match(Result.succeed("abc")), "right3")
  })

  it("getOrElse", () => {
    deepStrictEqual(pipe(Result.succeed(12), Result.getOrElse(17)), 12)
    deepStrictEqual(pipe(Result.fail("a"), Result.getOrElse(17)), 17)
  })

  it("elem", () => {
    deepStrictEqual(pipe(Result.fail("a"), Result.elem(2)), false)
    deepStrictEqual(pipe(Result.succeed(2), Result.elem(2)), true)
    deepStrictEqual(pipe(Result.succeed(2), Result.elem(1)), false)
  })

  it("filter", () => {
    const predicate = (n: number) => n > 10
    deepStrictEqual(pipe(Result.succeed(12), Result.filter(predicate, -1)), Result.succeed(12))
    deepStrictEqual(pipe(Result.succeed(7), Result.filter(predicate, -1)), Result.fail(-1))
    deepStrictEqual(pipe(Result.fail(12), Result.filter(predicate, -1)), Result.fail(12))
  })

  it("isLeft", () => {
    deepStrictEqual(Result.isFailure(Result.succeed(1)), false)
    deepStrictEqual(Result.isFailure(Result.fail(1)), true)
  })

  it("isRight", () => {
    deepStrictEqual(Result.isSuccess(Result.succeed(1)), true)
    deepStrictEqual(Result.isSuccess(Result.fail(1)), false)
  })

  it("catchAll", () => {
    deepStrictEqual(
      pipe(
        Result.succeed(1),
        Result.catchAll(() => Result.succeed(2))
      ),
      Result.succeed(1)
    )
    deepStrictEqual(
      pipe(
        Result.succeed(1),
        Result.catchAll(() => Result.fail("foo"))
      ),
      Result.succeed(1)
    )
    deepStrictEqual(
      pipe(
        Result.fail("a"),
        Result.catchAll(() => Result.succeed(1))
      ),
      Result.succeed(1)
    )
    deepStrictEqual(
      pipe(
        Result.fail("a"),
        Result.catchAll(() => Result.fail("b"))
      ),
      Result.fail("b")
    )
  })

  it("swap", () => {
    deepStrictEqual(Result.reverse(Result.succeed("a")), Result.fail("a"))
    deepStrictEqual(Result.reverse(Result.fail("b")), Result.succeed("b"))
  })

  it("fromPredicate", () => {
    const f = Result.liftPredicate((n: number) => n >= 2, "e")
    deepStrictEqual(f(3), Result.succeed(3))
    deepStrictEqual(f(1), Result.fail("e"))
  })

  it("fromNullable", () => {
    deepStrictEqual(Result.fromNullable("default")(null), Result.fail("default"))
    deepStrictEqual(Result.fromNullable("default")(undefined), Result.fail("default"))
    deepStrictEqual(Result.fromNullable("default")(1), Result.succeed(1))
  })

  it("tryCatch", () => {
    deepStrictEqual(
      Result.fromThrowable(() => {
        return 1
      }, identity),
      Result.succeed(1)
    )

    deepStrictEqual(
      Result.fromThrowable(() => {
        throw "string error"
      }, identity),
      Result.fail("string error")
    )
  })

  describe.concurrent("getCompactable", () => {
    const C = Result.getCompactable(String.Monoid.empty)
    it("compact", () => {
      deepStrictEqual(C.compact(Result.fail("1")), Result.fail("1"))
      deepStrictEqual(C.compact(Result.succeed(Option.none)), Result.fail(String.Monoid.empty))
      deepStrictEqual(C.compact(Result.succeed(Option.some(123))), Result.succeed(123))
    })
  })

  it("partition", () => {
    const p = (n: number) => n > 2
    deepStrictEqual(pipe(Result.fail("a"), Result.partition(p, "")), [
      Result.fail("a"),
      Result.fail("a")
    ])
    deepStrictEqual(pipe(Result.succeed(1), Result.partition(p, "")), [
      Result.succeed(1),
      Result.fail("")
    ])
    deepStrictEqual(pipe(Result.succeed(3), Result.partition(p, "")), [
      Result.fail(""),
      Result.succeed(3)
    ])
  })

  it("partitionMap", () => {
    const p = (n: number) => n > 2
    const f = (n: number) => (p(n) ? Result.succeed(n + 1) : Result.fail(n - 1))
    deepStrictEqual(pipe(Result.fail("123"), Result.partitionMap(f, String.Monoid.empty)), [
      Result.fail("123"),
      Result.fail("123")
    ])
    deepStrictEqual(pipe(Result.succeed(1), Result.partitionMap(f, String.Monoid.empty)), [
      Result.succeed(0),
      Result.fail(String.Monoid.empty)
    ])
    deepStrictEqual(pipe(Result.succeed(3), Result.partitionMap(f, String.Monoid.empty)), [
      Result.fail(String.Monoid.empty),
      Result.succeed(4)
    ])
  })

  describe.concurrent("getFilterable", () => {
    const F = Result.getFilterable(String.Monoid.empty)

    it("filterMap", () => {
      const p = (n: number) => n > 2
      const f = (n: number) => (p(n) ? Option.some(n + 1) : Option.none)
      deepStrictEqual(pipe(Result.fail("123"), F.filterMap(f)), Result.fail("123"))
      deepStrictEqual(pipe(Result.succeed(1), F.filterMap(f)), Result.fail(String.Monoid.empty))
      deepStrictEqual(pipe(Result.succeed(3), F.filterMap(f)), Result.succeed(4))
    })
  })

  // TODO
  // describe.concurrent("getFilterableKind", () => {
  //   const FilterableKind = Result.getTraversableFilterable(String.Monoid.empty)
  //   const p = (n: number) => n > 2

  //   it("filterMapKind", async () => {
  //     const filterMapKind = FilterableKind.traverseFilterMap(T.ApplicativePar)
  //     const f = (n: number) => T.of(p(n) ? Option.some(n + 1) : Option.none)
  //     deepStrictEqual(await pipe(Result.fail("foo"), filterMapKind(f))(), Result.fail("foo"))
  //     deepStrictEqual(
  //       await pipe(Result.succeed(1), filterMapKind(f))(),
  //       Result.fail(String.Monoid.empty)
  //     )
  //     deepStrictEqual(await pipe(Result.succeed(3), filterMapKind(f))(), Result.succeed(4))
  //   })

  //   it("partitionMapKind", async () => {
  //     const partitionMapKind = FilterableKind.traversePartitionMap(T.ApplicativePar)
  //     const f = (n: number) => T.of(p(n) ? Result.succeed(n + 1) : Result.fail(n - 1))
  //     deepStrictEqual(await pipe(Result.fail("foo"), partitionMapKind(f))(), [
  //       Result.fail("foo"),
  //       Result.fail("foo")
  //     ])
  //     deepStrictEqual(await pipe(Result.succeed(1), partitionMapKind(f))(), [
  //       Result.succeed(0),
  //       Result.fail(String.Monoid.empty)
  //     ])
  //     deepStrictEqual(await pipe(Result.succeed(3), partitionMapKind(f))(), [
  //       Result.fail(String.Monoid.empty),
  //       Result.succeed(4)
  //     ])
  //   })
  // })

  it("getSemigroup", () => {
    const Semigroup = Result.getSemigroup(Number.SemigroupSum)<string>()
    deepStrictEqual(pipe(Result.fail("a"), Semigroup.combine(Result.fail("b"))), Result.fail("a"))
    deepStrictEqual(pipe(Result.fail("a"), Semigroup.combine(Result.succeed(2))), Result.succeed(2))
    deepStrictEqual(pipe(Result.succeed(1), Semigroup.combine(Result.fail("b"))), Result.succeed(1))
    deepStrictEqual(
      pipe(Result.succeed(1), Semigroup.combine(Result.succeed(2))),
      Result.succeed(3)
    )
  })

  it("getApplicativeValidation", () => {
    const A = Result.getValidatedApplicative(String.Monoid)

    const flatZipPar = <B>(fb: Result.Result<string, B>) =>
      <A extends ReadonlyArray<unknown>>(
        fas: Result.Result<string, A>
      ): Result.Result<string, readonly [...A, B]> =>
        pipe(
          fas,
          Result.map((a) => (b: B): readonly [...A, B] => [...a, b]),
          A.zipWith(
            fb,
            (f, b) => f(b)
          )
        )

    deepStrictEqual(pipe(Result.fail("a"), flatZipPar(Result.fail("b"))), Result.fail("ab"))
    deepStrictEqual(pipe(Result.succeed([1]), flatZipPar(Result.fail("b"))), Result.fail("b"))
    deepStrictEqual(
      pipe(Result.succeed([1]), flatZipPar(Result.succeed(2))),
      Result.succeed([1, 2] as const)
    )
  })

  // TODO
  // it("getValidatedAlt", () => {
  //   const A = Result.getValidatedAlt(String.Monoid)
  //   deepStrictEqual(pipe(Result.fail("a"), A.orElse(Result.fail("b"))), Result.fail("ab"))
  //   deepStrictEqual(pipe(Result.succeed(1), A.orElse(Result.fail("b"))), Result.succeed(1))
  //   deepStrictEqual(pipe(Result.fail("a"), A.orElse(Result.succeed(2))), Result.succeed(2))
  // })

  it("fromOption", () => {
    deepStrictEqual(Result.fromOption("none")(Option.none), Result.fail("none"))
    deepStrictEqual(Result.fromOption("none")(Option.some(1)), Result.succeed(1))
  })

  it("liftOption", () => {
    const f = Result.liftOption((n: number) => (n > 0 ? Option.some(n) : Option.none), "a")
    deepStrictEqual(f(1), Result.succeed(1))
    deepStrictEqual(f(-1), Result.fail("a"))
  })

  it("flatMapOption", () => {
    const f = Result.flatMapOption((n: number) => (n > 0 ? Option.some(n) : Option.none), "a")
    deepStrictEqual(f(Result.succeed(1)), Result.succeed(1))
    deepStrictEqual(f(Result.succeed(-1)), Result.fail("a"))
    deepStrictEqual(f(Result.fail("b")), Result.fail("b"))
  })

  it("exists", () => {
    const gt2 = Result.exists((n: number) => n > 2)
    deepStrictEqual(gt2(Result.fail("a")), false)
    deepStrictEqual(gt2(Result.succeed(1)), false)
    deepStrictEqual(gt2(Result.succeed(3)), true)
  })

  it("do notation", () => {
    deepStrictEqual(
      pipe(
        Result.succeed(1),
        Result.bindTo("a"),
        Result.bind("b", () => Result.succeed("b")),
        Result.let("c", ({ a, b }) => [a, b])
      ),
      Result.succeed({ a: 1, b: "b", c: [1, "b"] })
    )
  })

  it("apS", () => {
    deepStrictEqual(
      pipe(Result.succeed(1), Result.bindTo("a"), Result.bindRight("b", Result.succeed("b"))),
      Result.succeed({ a: 1, b: "b" })
    )
  })

  it("zipFlatten", () => {
    deepStrictEqual(
      pipe(Result.succeed(1), Result.tupled, Result.zipFlatten(Result.succeed("b"))),
      Result.succeed([1, "b"] as const)
    )
  })

  it("liftNullable", () => {
    const f = Result.liftNullable((n: number) => (n > 0 ? n : null), "error")
    deepStrictEqual(f(1), Result.succeed(1))
    deepStrictEqual(f(-1), Result.fail("error"))
  })

  it("flatMapNullable", () => {
    const f = Result.flatMapNullable((n: number) => (n > 0 ? n : null), "error")
    deepStrictEqual(f(Result.succeed(1)), Result.succeed(1))
    deepStrictEqual(f(Result.succeed(-1)), Result.fail("error"))
    deepStrictEqual(f(Result.fail("a")), Result.fail("a"))
  })

  it("toUnion", () => {
    deepStrictEqual(Result.toUnion(Result.succeed(1)), 1)
    deepStrictEqual(Result.toUnion(Result.fail("a")), "a")
  })

  it("liftThrowable", () => {
    const f = Result.liftThrowable((s: string) => {
      const len = s.length
      if (len > 0) {
        return len
      }
      throw new Error("empty string")
    }, identity)
    deepStrictEqual(f("a"), Result.succeed(1))
    deepStrictEqual(f(""), Result.fail(new Error("empty string")))
  })

  it("traverseNonEmptyReadonlyArray", () => {
    const f = Result.traverseNonEmptyReadonlyArray((
      a: string
    ) => (a.length > 0 ? Result.succeed(a) : Result.fail("e")))
    deepStrictEqual(pipe(["a", "b"], f), Result.succeed(["a", "b"] as const))
    deepStrictEqual(pipe(["a", ""], f), Result.fail("e"))
  })

  it("traverseReadonlyArrayWithIndex", () => {
    const f = Result.traverseReadonlyArrayWithIndex((
      i,
      a: string
    ) => (a.length > 0 ? Result.succeed(a + i) : Result.fail("e")))
    deepStrictEqual(pipe(ReadonlyArray.empty, f), Result.succeed(ReadonlyArray.empty))
    deepStrictEqual(pipe(["a", "b"], f), Result.succeed(["a0", "b1"]))
    deepStrictEqual(pipe(["a", ""], f), Result.fail("e"))
  })

  it("sequenceReadonlyArray", () => {
    deepStrictEqual(
      pipe([Result.succeed("a"), Result.succeed("b")], Result.sequenceReadonlyArray),
      Result.succeed(["a", "b"])
    )
    deepStrictEqual(
      pipe([Result.succeed("a"), Result.fail("e")], Result.sequenceReadonlyArray),
      Result.fail("e")
    )
  })
})
