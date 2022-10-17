import { identity, pipe } from "@fp-ts/data/Function"
import * as _ from "@fp-ts/data/Identity"
import * as O from "@fp-ts/data/Option"
import * as S from "@fp-ts/data/String"
import * as U from "./util"

describe("Identity", () => {
  it("toReadonlyArray", () => {
    U.deepStrictEqual(
      pipe(
        "a",
        _.toReadonlyArray
      ),
      ["a"]
    )
  })

  it("of", () => {
    U.deepStrictEqual(pipe("a", _.of), "a")
    U.deepStrictEqual(pipe("a", _.Pointed.of), "a")
  })

  it("idKind", () => {
    U.deepStrictEqual(pipe("a", _.idKind()), "a")
  })

  it("combineKind", () => {
    const f = (a: string): _.Identity<number> => a.length
    const g = (n: number): _.Identity<boolean> => n > 2
    U.deepStrictEqual(pipe(f, _.composeKind(g))("aaa"), true)
    U.deepStrictEqual(pipe(f, _.ComposableKind.composeKind(g))("aaa"), true)
    U.deepStrictEqual(pipe(f, _.CategoryKind.composeKind(g))("aaa"), true)
  })

  it("zipLeft", () => {
    U.deepStrictEqual(pipe("a", _.zipLeft("b")), "a")
  })

  it("zipRight", () => {
    U.deepStrictEqual(pipe("a", _.zipRight("b")), "b")
  })

  it("combineKind", () => {
    U.deepStrictEqual(pipe("a", _.combineKind("b")), "a")
    U.deepStrictEqual(pipe("a", _.SemigroupKind.combineKind("b")), "a")
  })

  it("combineKindMany", () => {
    U.deepStrictEqual(pipe("a", _.combineKindMany(["b", "c"])), "a")
    U.deepStrictEqual(pipe("a", _.SemigroupKind.combineKindMany(["b", "c"])), "a")
  })

  it("zipWith", () => {
    U.deepStrictEqual(pipe("a", _.zipWith("b", (a, b) => [a, b])), ["a", "b"])
    U.deepStrictEqual(pipe("a", _.Semigroupal.zipWith("b", (a, b) => [a, b])), ["a", "b"])
    U.deepStrictEqual(pipe("a", _.Monoidal.zipWith("b", (a, b) => [a, b])), ["a", "b"])
  })

  it("zipMany", () => {
    U.deepStrictEqual(pipe("a", _.zipMany(["b", "c"])), ["a", "b", "c"])
    U.deepStrictEqual(pipe("a", _.Semigroupal.zipMany(["b", "c"])), ["a", "b", "c"])
    U.deepStrictEqual(pipe("a", _.Monoidal.zipMany(["b", "c"])), ["a", "b", "c"])
  })

  it("lift2", () => {
    U.deepStrictEqual(_.lift2((a: number, b: number): number => a + b)(1, 2), 3)
  })

  it("lift3", () => {
    U.deepStrictEqual(_.lift3((a: number, b: number, c: number): number => a + b + c)(1, 2, 3), 6)
  })

  it("zipAll", () => {
    U.deepStrictEqual(_.zipAll([1, 2, 3]), [1, 2, 3])
    U.deepStrictEqual(_.Monoidal.zipAll([1, 2, 3]), [1, 2, 3])
  })

  it("map", () => {
    U.deepStrictEqual(pipe("aaa", _.map((s) => s.length)), 3)
    U.deepStrictEqual(pipe("aaa", _.Functor.map((s) => s.length)), 3)
  })

  it("flap", () => {
    U.deepStrictEqual(pipe((s: string) => s.length, _.flap("aaa")), 3)
  })

  it("as", () => {
    U.deepStrictEqual(pipe("a", _.as("b")), "b")
  })

  it("unit", () => {
    U.deepStrictEqual(pipe("a", _.unit), undefined)
  })

  it("reduce", () => {
    U.deepStrictEqual(
      pipe(
        "b",
        _.reduce("a", (b, a) => b + a)
      ),
      "ab"
    )
    U.deepStrictEqual(
      pipe(
        "b",
        _.Foldable.reduce("a", (b, a) => b + a)
      ),
      "ab"
    )
  })

  it("foldMap", () => {
    U.deepStrictEqual(pipe("a", _.foldMap(S.Monoid)(identity)), "a")
  })

  it("reduceRight", () => {
    const f = (a: string, acc: string) => acc + a
    U.deepStrictEqual(pipe("a", _.reduceRight("", f)), "a")
    U.deepStrictEqual(pipe("a", _.Foldable.reduceRight("", f)), "a")
  })

  describe("pipeables", () => {
    it("map", () => {
      U.deepStrictEqual(pipe(1, _.map(U.double)), 2)
    })

    it("ap", () => {
      const fab = U.double
      U.deepStrictEqual(pipe(fab, _.ap(1)), 2)
    })

    it("flatMap", () => {
      U.deepStrictEqual(pipe(1, _.flatMap(U.double)), 2)
      U.deepStrictEqual(pipe(1, _.FlatMap.flatMap(U.double)), 2)
      U.deepStrictEqual(pipe(1, _.Monad.flatMap(U.double)), 2)
    })

    it("extract", () => {
      U.deepStrictEqual(pipe(1, _.extract), 1)
      U.deepStrictEqual(pipe(1, _.Comonad.extract), 1)
    })

    it("extend", () => {
      U.deepStrictEqual(pipe("foo", _.extend(S.size)), 3)
      U.deepStrictEqual(pipe("foo", _.Extendable.extend(S.size)), 3)
    })

    it("duplicate", () => {
      U.deepStrictEqual(pipe("a", _.duplicate), "a")
    })

    it("flatten", () => {
      U.deepStrictEqual(pipe("a", _.flatten), "a")
    })

    it("traverse", () => {
      U.deepStrictEqual(pipe(1, _.traverse(O.Applicative)(O.some)), O.some(1))
      U.deepStrictEqual(
        pipe(
          1,
          _.traverse(O.Applicative)(() => O.none)
        ),
        O.none
      )

      U.deepStrictEqual(pipe(1, _.Traversable.traverse(O.Applicative)(O.some)), O.some(1))
      U.deepStrictEqual(
        pipe(
          1,
          _.Traversable.traverse(O.Applicative)(() => O.none)
        ),
        O.none
      )
    })

    it("sequence", () => {
      const sequence = _.sequence(O.Applicative)
      U.deepStrictEqual(sequence(O.some("a")), O.some("a"))
      U.deepStrictEqual(sequence(O.none), O.none)
    })
  })

  it("Zip", () => {
    U.deepStrictEqual(_.Zip, [])
  })

  describe("do notation", () => {
    it("Do", () => {
      U.deepStrictEqual(_.Do, {})
    })

    it("bindTo", () => {
      U.deepStrictEqual(_.Do, {})
      U.deepStrictEqual(
        pipe(
          _.of(1),
          _.bindTo("a")
        ),
        { a: 1 }
      )
    })

    it("bind", () => {
      U.deepStrictEqual(_.Do, {})
      U.deepStrictEqual(
        pipe(
          _.Do,
          _.bind("a", () => _.of(1))
        ),
        { a: 1 }
      )
    })

    it("let", () => {
      U.deepStrictEqual(_.Do, {})
      U.deepStrictEqual(
        pipe(
          _.Do,
          _.bind("a", () => _.of(1)),
          _.let("b", ({ a }) => a * 2)
        ),
        { a: 1, b: 2 }
      )
    })
  })

  it("bindRight", () => {
    U.deepStrictEqual(pipe(_.of(1), _.bindTo("a"), _.bindRight("b", _.of("b"))), { a: 1, b: "b" })
  })

  it("zipFlatten", () => {
    U.deepStrictEqual(pipe(_.of(1), _.tupled, _.zipFlatten(_.of("b"))), [1, "b"])
  })
})
