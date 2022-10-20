import * as Either from "@fp-ts/data/Either"
import { flow, identity, pipe } from "@fp-ts/data/Function"
import * as Number from "@fp-ts/data/Number"
import * as Option from "@fp-ts/data/Option"
import * as ReadonlyArray from "@fp-ts/data/ReadonlyArray"
import * as String from "@fp-ts/data/String"
// import { gt } from "@fp-ts/data/typeclasses/Ord"
import { deepStrictEqual, double } from "@fp-ts/data/test/util"

describe.concurrent("Either", () => {
  it("reduce", () => {
    deepStrictEqual(
      pipe(
        Either.right("bar"),
        Either.reduce("foo", (b, a) => b + a)
      ),
      "foobar"
    )
    deepStrictEqual(
      pipe(
        Either.left("bar"),
        Either.reduce("foo", (b, a) => b + a)
      ),
      "foo"
    )
  })

  it("foldMap", () => {
    deepStrictEqual(pipe(Either.right("a"), Either.foldMap(String.Monoid)(identity)), "a")
    deepStrictEqual(pipe(Either.left(1), Either.foldMap(String.Monoid)(identity)), "")
  })

  it("reduceRight", () => {
    const f = (a: string, acc: string) => acc + a
    deepStrictEqual(pipe(Either.right("a"), Either.reduceRight("", f)), "a")
    deepStrictEqual(pipe(Either.left(1), Either.reduceRight("", f)), "")
  })

  it("getRight", () => {
    deepStrictEqual(pipe(Either.right(1), Either.getRight), Option.some(1))
    deepStrictEqual(pipe(Either.left("a"), Either.getRight), Option.none)
  })

  it("getLeft", () => {
    deepStrictEqual(pipe(Either.right(1), Either.getLeft), Option.none)
    deepStrictEqual(pipe(Either.left("e"), Either.getLeft), Option.some("e"))
  })

  it("toNull", () => {
    deepStrictEqual(pipe(Either.right(1), Either.toNull), 1)
    deepStrictEqual(pipe(Either.left("a"), Either.toNull), null)
  })

  it("toUndefined", () => {
    deepStrictEqual(pipe(Either.right(1), Either.toUndefined), 1)
    deepStrictEqual(pipe(Either.left("a"), Either.toUndefined), undefined)
  })

  it("compact", () => {
    deepStrictEqual(
      pipe(
        Either.right(Option.some(1)),
        Either.compact(() => "e2")
      ),
      Either.right(1)
    )
    deepStrictEqual(pipe(Either.right(Option.none), Either.compact("e2")), Either.left("e2"))
    deepStrictEqual(pipe(Either.left("e1"), Either.compact("e2")), Either.left("e1"))
  })

  it("separate", () => {
    deepStrictEqual(pipe(Either.right(Either.right(1)), Either.separate("e2")), [
      Either.left("e2"),
      Either.right(1)
    ])
    deepStrictEqual(pipe(Either.right(Either.left("e1")), Either.separate("e2")), [
      Either.right("e1"),
      Either.left("e2")
    ])
    deepStrictEqual(pipe(Either.left("e1"), Either.separate("e2")), [
      Either.left("e1"),
      Either.left("e1")
    ])
  })

  it("tapError", () => {
    deepStrictEqual(
      pipe(
        Either.right(1),
        Either.tapError(() => Either.right(2))
      ),
      Either.right(1)
    )
    deepStrictEqual(
      pipe(
        Either.left("a"),
        Either.tapError(() => Either.right(2))
      ),
      Either.left("a")
    )
    deepStrictEqual(
      pipe(
        Either.left("a"),
        Either.tapError(() => Either.left("b"))
      ),
      Either.left("b")
    )
  })

  it("zipLeft", () => {
    deepStrictEqual(pipe(Either.right(1), Either.zipLeft(Either.right("a"))), Either.right(1))
    deepStrictEqual(pipe(Either.right(1), Either.zipLeft(Either.left(true))), Either.left(true))
    deepStrictEqual(pipe(Either.left(1), Either.zipLeft(Either.right("a"))), Either.left(1))
    deepStrictEqual(pipe(Either.left(1), Either.zipLeft(Either.left(true))), Either.left(1))
  })

  it("zipRight", () => {
    deepStrictEqual(
      pipe(Either.right(1), Either.zipRight(Either.right("a"))),
      Either.right("a")
    )
    deepStrictEqual(pipe(Either.right(1), Either.zipRight(Either.left(true))), Either.left(true))
    deepStrictEqual(pipe(Either.left(1), Either.zipRight(Either.right("a"))), Either.left(1))
    deepStrictEqual(pipe(Either.left(1), Either.zipRight(Either.left(true))), Either.left(1))
  })

  describe.concurrent("pipeables", () => {
    it("orElse", () => {
      const assertAlt = (
        a: Either.Either<string, number>,
        b: Either.Either<string, number>,
        expected: Either.Either<string, number>
      ) => {
        deepStrictEqual(pipe(a, Either.orElse(b)), expected)
      }
      assertAlt(Either.right(1), Either.right(2), Either.right(1))
      assertAlt(Either.right(1), Either.left("b"), Either.right(1))
      assertAlt(Either.left("a"), Either.right(2), Either.right(2))
      assertAlt(Either.left("a"), Either.left("b"), Either.left("b"))
    })

    it("map", () => {
      const f = Either.map(String.size)
      deepStrictEqual(pipe(Either.right("abc"), f), Either.right(3))
      deepStrictEqual(pipe(Either.left("s"), f), Either.left("s"))
    })

    it("ap", () => {
      const assertAp = (
        a: Either.Either<string, number>,
        b: Either.Either<string, number>,
        expected: Either.Either<string, number>
      ) => {
        deepStrictEqual(
          pipe(
            a,
            Either.map((a) => (b: number) => a + b),
            Either.ap(b)
          ),
          expected
        )
      }
      assertAp(Either.right(1), Either.right(2), Either.right(3))
      assertAp(Either.right(1), Either.left("b"), Either.left("b"))
      assertAp(Either.left("a"), Either.right(2), Either.left("a"))
      assertAp(Either.left("a"), Either.left("b"), Either.left("a"))
    })

    it("flatMap", () => {
      const f = Either.flatMap<string, string, number>(flow(String.size, Either.right))
      deepStrictEqual(pipe(Either.right("abc"), f), Either.right(3))
      deepStrictEqual(pipe(Either.left("maError"), f), Either.left("maError"))
    })

    it("tap", () => {
      const f = Either.tap(flow(String.size, Either.right))
      deepStrictEqual(pipe(Either.right("abc"), f), Either.right("abc"))
      deepStrictEqual(pipe(Either.left("maError"), f), Either.left("maError"))
    })

    it("duplicate", () => {
      deepStrictEqual(
        pipe(Either.right("a"), Either.duplicate),
        Either.right(Either.right("a"))
      )
    })

    it("extend", () => {
      deepStrictEqual(
        pipe(
          Either.right(1),
          Either.extend(() => 2)
        ),
        Either.right(2)
      )
      deepStrictEqual(
        pipe(
          Either.left("err"),
          Either.extend(() => 2)
        ),
        Either.left("err")
      )
    })

    it("flatten", () => {
      deepStrictEqual(
        pipe(Either.right(Either.right("a")), Either.flatten),
        Either.right("a")
      )
    })

    it("mapBoth", () => {
      const f = Either.mapBoth(String.size, (n: number) => n > 2)
      deepStrictEqual(pipe(Either.right(1), f), Either.right(false))
    })

    it("mapError", () => {
      const f = Either.mapError(double)
      deepStrictEqual(pipe(Either.right("a"), f), Either.right("a"))
      deepStrictEqual(pipe(Either.left(1), f), Either.left(2))
    })

    it("traverse", () => {
      const traverse = Either.traverse(Option.Monoidal)((
        n: number
      ) => (n >= 2 ? Option.some(n) : Option.none))
      deepStrictEqual(pipe(Either.left("a"), traverse), Option.some(Either.left("a")))
      deepStrictEqual(pipe(Either.right(1), traverse), Option.none)
      deepStrictEqual(pipe(Either.right(3), traverse), Option.some(Either.right(3)))
    })

    it("sequence", () => {
      const sequence = Either.sequence(Option.Monoidal)
      deepStrictEqual(sequence(Either.right(Option.some(1))), Option.some(Either.right(1)))
      deepStrictEqual(sequence(Either.left("a")), Option.some(Either.left("a")))
      deepStrictEqual(sequence(Either.right(Option.none)), Option.none)
    })
  })

  it("match", () => {
    const f = (s: string) => `left${s.length}`
    const g = (s: string) => `right${s.length}`
    const match = Either.match(f, g)
    deepStrictEqual(match(Either.left("abc")), "left3")
    deepStrictEqual(match(Either.right("abc")), "right3")
  })

  it("getOrElse", () => {
    deepStrictEqual(pipe(Either.right(12), Either.getOrElse(17)), 12)
    deepStrictEqual(pipe(Either.left("a"), Either.getOrElse(17)), 17)
  })

  it("elem", () => {
    deepStrictEqual(pipe(Either.left("a"), Either.elem(2)), false)
    deepStrictEqual(pipe(Either.right(2), Either.elem(2)), true)
    deepStrictEqual(pipe(Either.right(2), Either.elem(1)), false)
  })

  it("filter", () => {
    const predicate = (n: number) => n > 10
    deepStrictEqual(pipe(Either.right(12), Either.filter(predicate, -1)), Either.right(12))
    deepStrictEqual(pipe(Either.right(7), Either.filter(predicate, -1)), Either.left(-1))
    deepStrictEqual(pipe(Either.left(12), Either.filter(predicate, -1)), Either.left(12))
  })

  it("isLeft", () => {
    deepStrictEqual(Either.isLeft(Either.right(1)), false)
    deepStrictEqual(Either.isLeft(Either.left(1)), true)
  })

  it("isRight", () => {
    deepStrictEqual(Either.isRight(Either.right(1)), true)
    deepStrictEqual(Either.isRight(Either.left(1)), false)
  })

  it("catchAll", () => {
    deepStrictEqual(
      pipe(
        Either.right(1),
        Either.catchAll(() => Either.right(2))
      ),
      Either.right(1)
    )
    deepStrictEqual(
      pipe(
        Either.right(1),
        Either.catchAll(() => Either.left("foo"))
      ),
      Either.right(1)
    )
    deepStrictEqual(
      pipe(
        Either.left("a"),
        Either.catchAll(() => Either.right(1))
      ),
      Either.right(1)
    )
    deepStrictEqual(
      pipe(
        Either.left("a"),
        Either.catchAll(() => Either.left("b"))
      ),
      Either.left("b")
    )
  })

  it("swap", () => {
    deepStrictEqual(Either.reverse(Either.right("a")), Either.left("a"))
    deepStrictEqual(Either.reverse(Either.left("b")), Either.right("b"))
  })

  it("fromPredicate", () => {
    const f = Either.liftPredicate((n: number) => n >= 2, "e")
    deepStrictEqual(f(3), Either.right(3))
    deepStrictEqual(f(1), Either.left("e"))
  })

  it("fromNullable", () => {
    deepStrictEqual(Either.fromNullable("default")(null), Either.left("default"))
    deepStrictEqual(Either.fromNullable("default")(undefined), Either.left("default"))
    deepStrictEqual(Either.fromNullable("default")(1), Either.right(1))
  })

  it("tryCatch", () => {
    deepStrictEqual(
      Either.fromThrowable(() => {
        return 1
      }, identity),
      Either.right(1)
    )

    deepStrictEqual(
      Either.fromThrowable(() => {
        throw "string error"
      }, identity),
      Either.left("string error")
    )
  })

  describe.concurrent("getCompactable", () => {
    const C = Either.getCompactable(String.Monoid.empty)
    it("compact", () => {
      deepStrictEqual(C.compact(Either.left("1")), Either.left("1"))
      deepStrictEqual(C.compact(Either.right(Option.none)), Either.left(String.Monoid.empty))
      deepStrictEqual(C.compact(Either.right(Option.some(123))), Either.right(123))
    })
  })

  it("partition", () => {
    const p = (n: number) => n > 2
    deepStrictEqual(pipe(Either.left("a"), Either.partition(p, "")), [
      Either.left("a"),
      Either.left("a")
    ])
    deepStrictEqual(pipe(Either.right(1), Either.partition(p, "")), [
      Either.right(1),
      Either.left("")
    ])
    deepStrictEqual(pipe(Either.right(3), Either.partition(p, "")), [
      Either.left(""),
      Either.right(3)
    ])
  })

  it("partitionMap", () => {
    const p = (n: number) => n > 2
    const f = (n: number) => (p(n) ? Either.right(n + 1) : Either.left(n - 1))
    deepStrictEqual(pipe(Either.left("123"), Either.partitionMap(f, String.Monoid.empty)), [
      Either.left("123"),
      Either.left("123")
    ])
    deepStrictEqual(pipe(Either.right(1), Either.partitionMap(f, String.Monoid.empty)), [
      Either.right(0),
      Either.left(String.Monoid.empty)
    ])
    deepStrictEqual(pipe(Either.right(3), Either.partitionMap(f, String.Monoid.empty)), [
      Either.left(String.Monoid.empty),
      Either.right(4)
    ])
  })

  describe.concurrent("getFilterable", () => {
    const F = Either.getFilterable(String.Monoid.empty)

    it("filterMap", () => {
      const p = (n: number) => n > 2
      const f = (n: number) => (p(n) ? Option.some(n + 1) : Option.none)
      deepStrictEqual(pipe(Either.left("123"), F.filterMap(f)), Either.left("123"))
      deepStrictEqual(pipe(Either.right(1), F.filterMap(f)), Either.left(String.Monoid.empty))
      deepStrictEqual(pipe(Either.right(3), F.filterMap(f)), Either.right(4))
    })
  })

  // TODO
  // describe.concurrent("getFilterableKind", () => {
  //   const FilterableKind = Result.getTraversableFilterable(String.Monoid.empty)
  //   const p = (n: number) => n > 2

  //   it("filterMapKind", async () => {
  //     const filterMapKind = FilterableKind.traverseFilterMap(T.ApplicativePar)
  //     const f = (n: number) => T.of(p(n) ? Option.some(n + 1) : Option.none)
  //     deepStrictEqual(await pipe(Result.left("foo"), filterMapKind(f))(), Result.left("foo"))
  //     deepStrictEqual(
  //       await pipe(Result.right(1), filterMapKind(f))(),
  //       Result.left(String.Monoid.empty)
  //     )
  //     deepStrictEqual(await pipe(Result.right(3), filterMapKind(f))(), Result.right(4))
  //   })

  //   it("partitionMapKind", async () => {
  //     const partitionMapKind = FilterableKind.traversePartitionMap(T.ApplicativePar)
  //     const f = (n: number) => T.of(p(n) ? Result.right(n + 1) : Result.left(n - 1))
  //     deepStrictEqual(await pipe(Result.left("foo"), partitionMapKind(f))(), [
  //       Result.left("foo"),
  //       Result.left("foo")
  //     ])
  //     deepStrictEqual(await pipe(Result.right(1), partitionMapKind(f))(), [
  //       Result.right(0),
  //       Result.left(String.Monoid.empty)
  //     ])
  //     deepStrictEqual(await pipe(Result.right(3), partitionMapKind(f))(), [
  //       Result.left(String.Monoid.empty),
  //       Result.right(4)
  //     ])
  //   })
  // })

  it("getSemigroup", () => {
    const Semigroup = Either.getSemigroup(Number.SemigroupSum)<string>()
    deepStrictEqual(pipe(Either.left("a"), Semigroup.combine(Either.left("b"))), Either.left("a"))
    deepStrictEqual(pipe(Either.left("a"), Semigroup.combine(Either.right(2))), Either.right(2))
    deepStrictEqual(pipe(Either.right(1), Semigroup.combine(Either.left("b"))), Either.right(1))
    deepStrictEqual(
      pipe(Either.right(1), Semigroup.combine(Either.right(2))),
      Either.right(3)
    )
  })

  it("getApplicativeValidation", () => {
    const A = Either.getValidatedMonoidal(String.Monoid)

    const flatZipPar = <B>(fb: Either.Either<string, B>) =>
      <A extends ReadonlyArray<unknown>>(
        fas: Either.Either<string, A>
      ): Either.Either<string, readonly [...A, B]> =>
        pipe(
          fas,
          Either.map((a) => (b: B): readonly [...A, B] => [...a, b]),
          A.zipWith(
            fb,
            (f, b) => f(b)
          )
        )

    deepStrictEqual(pipe(Either.left("a"), flatZipPar(Either.left("b"))), Either.left("ab"))
    deepStrictEqual(pipe(Either.right([1]), flatZipPar(Either.left("b"))), Either.left("b"))
    deepStrictEqual(
      pipe(Either.right([1]), flatZipPar(Either.right(2))),
      Either.right([1, 2] as const)
    )
  })

  // TODO
  // it("getValidatedAlt", () => {
  //   const A = Result.getValidatedAlt(String.Monoid)
  //   deepStrictEqual(pipe(Result.left("a"), A.orElse(Result.left("b"))), Result.left("ab"))
  //   deepStrictEqual(pipe(Result.right(1), A.orElse(Result.left("b"))), Result.right(1))
  //   deepStrictEqual(pipe(Result.left("a"), A.orElse(Result.right(2))), Result.right(2))
  // })

  it("fromOption", () => {
    deepStrictEqual(Either.fromOption("none")(Option.none), Either.left("none"))
    deepStrictEqual(Either.fromOption("none")(Option.some(1)), Either.right(1))
  })

  it("liftOption", () => {
    const f = Either.liftOption((n: number) => (n > 0 ? Option.some(n) : Option.none), "a")
    deepStrictEqual(f(1), Either.right(1))
    deepStrictEqual(f(-1), Either.left("a"))
  })

  it("flatMapOption", () => {
    const f = Either.flatMapOption((n: number) => (n > 0 ? Option.some(n) : Option.none), "a")
    deepStrictEqual(f(Either.right(1)), Either.right(1))
    deepStrictEqual(f(Either.right(-1)), Either.left("a"))
    deepStrictEqual(f(Either.left("b")), Either.left("b"))
  })

  it("exists", () => {
    const gt2 = Either.exists((n: number) => n > 2)
    deepStrictEqual(gt2(Either.left("a")), false)
    deepStrictEqual(gt2(Either.right(1)), false)
    deepStrictEqual(gt2(Either.right(3)), true)
  })

  it("do notation", () => {
    deepStrictEqual(
      pipe(
        Either.right(1),
        Either.bindTo("a"),
        Either.bind("b", () => Either.right("b")),
        Either.let("c", ({ a, b }) => [a, b])
      ),
      Either.right({ a: 1, b: "b", c: [1, "b"] })
    )
  })

  it("apS", () => {
    deepStrictEqual(
      pipe(Either.right(1), Either.bindTo("a"), Either.bindRight("b", Either.right("b"))),
      Either.right({ a: 1, b: "b" })
    )
  })

  it("zipFlatten", () => {
    deepStrictEqual(
      pipe(Either.right(1), Either.tupled, Either.zipFlatten(Either.right("b"))),
      Either.right([1, "b"] as const)
    )
  })

  it("liftNullable", () => {
    const f = Either.liftNullable((n: number) => (n > 0 ? n : null), "error")
    deepStrictEqual(f(1), Either.right(1))
    deepStrictEqual(f(-1), Either.left("error"))
  })

  it("flatMapNullable", () => {
    const f = Either.flatMapNullable((n: number) => (n > 0 ? n : null), "error")
    deepStrictEqual(f(Either.right(1)), Either.right(1))
    deepStrictEqual(f(Either.right(-1)), Either.left("error"))
    deepStrictEqual(f(Either.left("a")), Either.left("a"))
  })

  it("toUnion", () => {
    deepStrictEqual(Either.toUnion(Either.right(1)), 1)
    deepStrictEqual(Either.toUnion(Either.left("a")), "a")
  })

  it("liftThrowable", () => {
    const f = Either.liftThrowable((s: string) => {
      const len = s.length
      if (len > 0) {
        return len
      }
      throw new Error("empty string")
    }, identity)
    deepStrictEqual(f("a"), Either.right(1))
    deepStrictEqual(f(""), Either.left(new Error("empty string")))
  })

  it("traverseNonEmptyReadonlyArray", () => {
    const f = Either.traverseNonEmptyReadonlyArray((
      a: string
    ) => (a.length > 0 ? Either.right(a) : Either.left("e")))
    deepStrictEqual(pipe(["a", "b"], f), Either.right(["a", "b"] as const))
    deepStrictEqual(pipe(["a", ""], f), Either.left("e"))
  })

  it("traverseReadonlyArrayWithIndex", () => {
    const f = Either.traverseReadonlyArrayWithIndex((
      i,
      a: string
    ) => (a.length > 0 ? Either.right(a + i) : Either.left("e")))
    deepStrictEqual(pipe(ReadonlyArray.empty, f), Either.right(ReadonlyArray.empty))
    deepStrictEqual(pipe(["a", "b"], f), Either.right(["a0", "b1"]))
    deepStrictEqual(pipe(["a", ""], f), Either.left("e"))
  })

  it("sequenceReadonlyArray", () => {
    deepStrictEqual(
      pipe([Either.right("a"), Either.right("b")], Either.sequenceReadonlyArray),
      Either.right(["a", "b"])
    )
    deepStrictEqual(
      pipe([Either.right("a"), Either.left("e")], Either.sequenceReadonlyArray),
      Either.left("e")
    )
  })
})
