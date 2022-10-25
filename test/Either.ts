import * as _ from "@fp-ts/data/Either"
import { flow, identity, pipe } from "@fp-ts/data/Function"
import * as Number from "@fp-ts/data/Number"
import * as O from "@fp-ts/data/Option"
import * as String from "@fp-ts/data/String"
import { deepStrictEqual, double } from "@fp-ts/data/test/util"

describe.concurrent("Either", () => {
  it("instances and derived exports", () => {
    expect(_.Invariant).exist
    expect(_.imap).exist
    expect(_.tupled).exist
    expect(_.bindTo).exist

    expect(_.Covariant).exist
    expect(_.map).exist
    expect(_.let).exist
    expect(_.flap).exist
    expect(_.as).exist
    expect(_.asUnit).exist

    expect(_.Bicovariant).exist
    expect(_.bimap).exist
    expect(_.mapLeft).exist

    expect(_.Of).exist
    expect(_.of).exist
    expect(_.Do).exist

    expect(_.Pointed).exist

    expect(_.FlatMap).exist
    expect(_.flatMap).exist
    expect(_.flatten).exist
    expect(_.andThen).exist
    expect(_.composeKleisliArrow).exist

    expect(_.Chainable).exist
    expect(_.bind).exist
    expect(_.tap).exist
    expect(_.andThenDiscard).exist

    expect(_.Monad).exist

    expect(_.NonEmptyProduct).exist
    expect(_.product).exist
    expect(_.productMany).exist

    expect(_.Product).exist
    expect(_.productAll).exist
    expect(_.tuple).exist
    expect(_.struct).exist

    expect(_.NonEmptyApplicative).exist
    expect(_.liftSemigroup).exist
    expect(_.lift2).exist
    expect(_.lift3).exist
    expect(_.ap).exist
    expect(_.andThenDiscard).exist
    expect(_.andThen).exist

    expect(_.Applicative).exist
    expect(_.liftMonoid).exist

    expect(_.NonEmptyCoproduct).exist
    expect(_.coproduct).exist
    expect(_.coproductMany).exist
    expect(_.getSemigroup).exist
    expect(_.coproductEither).exist

    expect(_.NonEmptyAlternative).exist

    expect(_.Foldable).exist
    expect(_.reduce).exist
    expect(_.reduceRight).exist
    expect(_.foldMap).exist
    expect(_.toReadonlyArray).exist
    expect(_.toReadonlyArrayWith).exist
    expect(_.reduceKind).exist
    expect(_.reduceRightKind).exist
    expect(_.foldMapKind).exist

    expect(_.Traversable).exist
    expect(_.traverse).exist
    expect(_.sequence).exist
    expect(_.traverseTap).exist

    expect(_.compact).exist
    expect(_.separate).exist

    expect(_.filterMap).exist
    expect(_.filter).exist
    expect(_.partition).exist
    expect(_.partitionMap).exist
  })

  it("reduce", () => {
    deepStrictEqual(
      pipe(
        _.right("bar"),
        _.reduce("foo", (b, a) => b + a)
      ),
      "foobar"
    )
    deepStrictEqual(
      pipe(
        _.left("bar"),
        _.reduce("foo", (b, a) => b + a)
      ),
      "foo"
    )
  })

  it("foldMap", () => {
    deepStrictEqual(pipe(_.right("a"), _.foldMap(String.Monoid)(identity)), "a")
    deepStrictEqual(pipe(_.left(1), _.foldMap(String.Monoid)(identity)), "")
  })

  it("reduceRight", () => {
    const f = (a: string, acc: string) => acc + a
    deepStrictEqual(pipe(_.right("a"), _.reduceRight("", f)), "a")
    deepStrictEqual(pipe(_.left(1), _.reduceRight("", f)), "")
  })

  it("getRight", () => {
    deepStrictEqual(pipe(_.right(1), _.getRight), O.some(1))
    deepStrictEqual(pipe(_.left("a"), _.getRight), O.none)
  })

  it("getLeft", () => {
    deepStrictEqual(pipe(_.right(1), _.getLeft), O.none)
    deepStrictEqual(pipe(_.left("e"), _.getLeft), O.some("e"))
  })

  it("toNull", () => {
    deepStrictEqual(pipe(_.right(1), _.toNull), 1)
    deepStrictEqual(pipe(_.left("a"), _.toNull), null)
  })

  it("toUndefined", () => {
    deepStrictEqual(pipe(_.right(1), _.toUndefined), 1)
    deepStrictEqual(pipe(_.left("a"), _.toUndefined), undefined)
  })

  it("compact", () => {
    deepStrictEqual(
      pipe(
        _.right(O.some(1)),
        _.compact(() => "e2")
      ),
      _.right(1)
    )
    deepStrictEqual(pipe(_.right(O.none), _.compact("e2")), _.left("e2"))
    deepStrictEqual(pipe(_.left("e1"), _.compact("e2")), _.left("e1"))
  })

  it("separate", () => {
    deepStrictEqual(pipe(_.right(_.right(1)), _.separate("e2")), [
      _.left("e2"),
      _.right(1)
    ])
    deepStrictEqual(pipe(_.right(_.left("e1")), _.separate("e2")), [
      _.right("e1"),
      _.left("e2")
    ])
    deepStrictEqual(pipe(_.left("e1"), _.separate("e2")), [
      _.left("e1"),
      _.left("e1")
    ])
  })

  it("tapError", () => {
    deepStrictEqual(
      pipe(
        _.right(1),
        _.tapError(() => _.right(2))
      ),
      _.right(1)
    )
    deepStrictEqual(
      pipe(
        _.left("a"),
        _.tapError(() => _.right(2))
      ),
      _.left("a")
    )
    deepStrictEqual(
      pipe(
        _.left("a"),
        _.tapError(() => _.left("b"))
      ),
      _.left("b")
    )
  })

  it("andThenDiscard", () => {
    deepStrictEqual(
      pipe(_.right(1), _.andThenDiscard(_.right("a"))),
      _.right(1)
    )
    deepStrictEqual(
      pipe(_.right(1), _.andThenDiscard(_.left(true))),
      _.left(true)
    )
    deepStrictEqual(pipe(_.left(1), _.andThenDiscard(_.right("a"))), _.left(1))
    deepStrictEqual(pipe(_.left(1), _.andThenDiscard(_.left(true))), _.left(1))
  })

  it("andThen", () => {
    deepStrictEqual(
      pipe(_.right(1), _.andThen(_.right("a"))),
      _.right("a")
    )
    deepStrictEqual(pipe(_.right(1), _.andThen(_.left(true))), _.left(true))
    deepStrictEqual(pipe(_.left(1), _.andThen(_.right("a"))), _.left(1))
    deepStrictEqual(pipe(_.left(1), _.andThen(_.left(true))), _.left(1))
  })

  describe.concurrent("pipeables", () => {
    it("orElse", () => {
      const assertAlt = (
        a: _.Either<string, number>,
        b: _.Either<string, number>,
        expected: _.Either<string, number>
      ) => {
        deepStrictEqual(pipe(a, _.orElse(b)), expected)
      }
      assertAlt(_.right(1), _.right(2), _.right(1))
      assertAlt(_.right(1), _.left("b"), _.right(1))
      assertAlt(_.left("a"), _.right(2), _.right(2))
      assertAlt(_.left("a"), _.left("b"), _.left("b"))
    })

    it("map", () => {
      const f = _.map(String.size)
      deepStrictEqual(pipe(_.right("abc"), f), _.right(3))
      deepStrictEqual(pipe(_.left("s"), f), _.left("s"))
    })

    it("ap", () => {
      const assertAp = (
        a: _.Either<string, number>,
        b: _.Either<string, number>,
        expected: _.Either<string, number>
      ) => {
        deepStrictEqual(
          pipe(
            a,
            _.map((a) => (b: number) => a + b),
            _.ap(b)
          ),
          expected
        )
      }
      assertAp(_.right(1), _.right(2), _.right(3))
      assertAp(_.right(1), _.left("b"), _.left("b"))
      assertAp(_.left("a"), _.right(2), _.left("a"))
      assertAp(_.left("a"), _.left("b"), _.left("a"))
    })

    it("flatMap", () => {
      const f = _.flatMap<string, string, number>(flow(String.size, _.right))
      deepStrictEqual(pipe(_.right("abc"), f), _.right(3))
      deepStrictEqual(pipe(_.left("maError"), f), _.left("maError"))
    })

    it("tap", () => {
      const f = _.tap(flow(String.size, _.right))
      deepStrictEqual(pipe(_.right("abc"), f), _.right("abc"))
      deepStrictEqual(pipe(_.left("maError"), f), _.left("maError"))
    })

    it("flatten", () => {
      deepStrictEqual(
        pipe(_.right(_.right("a")), _.flatten),
        _.right("a")
      )
    })

    it("mapBoth", () => {
      const f = _.bimap(String.size, (n: number) => n > 2)
      deepStrictEqual(pipe(_.right(1), f), _.right(false))
    })

    it("mapError", () => {
      const f = _.mapLeft(double)
      deepStrictEqual(pipe(_.right("a"), f), _.right("a"))
      deepStrictEqual(pipe(_.left(1), f), _.left(2))
    })

    it("traverse", () => {
      const traverse = _.traverse(O.Applicative)((
        n: number
      ) => (n >= 2 ? O.some(n) : O.none))
      deepStrictEqual(pipe(_.left("a"), traverse), O.some(_.left("a")))
      deepStrictEqual(pipe(_.right(1), traverse), O.none)
      deepStrictEqual(pipe(_.right(3), traverse), O.some(_.right(3)))
    })

    it("sequence", () => {
      const sequence = _.sequence(O.Applicative)
      deepStrictEqual(sequence(_.right(O.some(1))), O.some(_.right(1)))
      deepStrictEqual(sequence(_.left("a")), O.some(_.left("a")))
      deepStrictEqual(sequence(_.right(O.none)), O.none)
    })
  })

  it("match", () => {
    const f = (s: string) => `left${s.length}`
    const g = (s: string) => `right${s.length}`
    const match = _.match(f, g)
    deepStrictEqual(match(_.left("abc")), "left3")
    deepStrictEqual(match(_.right("abc")), "right3")
  })

  it("getOrElse", () => {
    deepStrictEqual(pipe(_.right(12), _.getOrElse(17)), 12)
    deepStrictEqual(pipe(_.left("a"), _.getOrElse(17)), 17)
  })

  it("elem", () => {
    deepStrictEqual(pipe(_.left("a"), _.elem(2)), false)
    deepStrictEqual(pipe(_.right(2), _.elem(2)), true)
    deepStrictEqual(pipe(_.right(2), _.elem(1)), false)
  })

  it("filter", () => {
    const predicate = (n: number) => n > 10
    deepStrictEqual(pipe(_.right(12), _.filter(predicate, -1)), _.right(12))
    deepStrictEqual(pipe(_.right(7), _.filter(predicate, -1)), _.left(-1))
    deepStrictEqual(pipe(_.left(12), _.filter(predicate, -1)), _.left(12))
  })

  it("isLeft", () => {
    deepStrictEqual(_.isLeft(_.right(1)), false)
    deepStrictEqual(_.isLeft(_.left(1)), true)
  })

  it("isRight", () => {
    deepStrictEqual(_.isRight(_.right(1)), true)
    deepStrictEqual(_.isRight(_.left(1)), false)
  })

  it("catchAll", () => {
    deepStrictEqual(
      pipe(
        _.right(1),
        _.catchAll(() => _.right(2))
      ),
      _.right(1)
    )
    deepStrictEqual(
      pipe(
        _.right(1),
        _.catchAll(() => _.left("foo"))
      ),
      _.right(1)
    )
    deepStrictEqual(
      pipe(
        _.left("a"),
        _.catchAll(() => _.right(1))
      ),
      _.right(1)
    )
    deepStrictEqual(
      pipe(
        _.left("a"),
        _.catchAll(() => _.left("b"))
      ),
      _.left("b")
    )
  })

  it("swap", () => {
    deepStrictEqual(_.reverse(_.right("a")), _.left("a"))
    deepStrictEqual(_.reverse(_.left("b")), _.right("b"))
  })

  it("fromPredicate", () => {
    const f = _.liftPredicate((n: number) => n >= 2, "e")
    deepStrictEqual(f(3), _.right(3))
    deepStrictEqual(f(1), _.left("e"))
  })

  it("fromNullable", () => {
    deepStrictEqual(_.fromNullable("default")(null), _.left("default"))
    deepStrictEqual(_.fromNullable("default")(undefined), _.left("default"))
    deepStrictEqual(_.fromNullable("default")(1), _.right(1))
  })

  it("tryCatch", () => {
    deepStrictEqual(
      _.fromThrowable(() => {
        return 1
      }, identity),
      _.right(1)
    )

    deepStrictEqual(
      _.fromThrowable(() => {
        throw "string error"
      }, identity),
      _.left("string error")
    )
  })

  describe.concurrent("getCompactable", () => {
    const C = _.getCompactable(String.Monoid.empty)
    it("compact", () => {
      deepStrictEqual(C.compact(_.left("1")), _.left("1"))
      deepStrictEqual(C.compact(_.right(O.none)), _.left(String.Monoid.empty))
      deepStrictEqual(C.compact(_.right(O.some(123))), _.right(123))
    })
  })

  it("partition", () => {
    const p = (n: number) => n > 2
    deepStrictEqual(pipe(_.left("a"), _.partition(p, "")), [
      _.left("a"),
      _.left("a")
    ])
    deepStrictEqual(pipe(_.right(1), _.partition(p, "")), [
      _.right(1),
      _.left("")
    ])
    deepStrictEqual(pipe(_.right(3), _.partition(p, "")), [
      _.left(""),
      _.right(3)
    ])
  })

  it("partitionMap", () => {
    const p = (n: number) => n > 2
    const f = (n: number) => (p(n) ? _.right(n + 1) : _.left(n - 1))
    deepStrictEqual(pipe(_.left("123"), _.partitionMap(f, String.Monoid.empty)), [
      _.left("123"),
      _.left("123")
    ])
    deepStrictEqual(pipe(_.right(1), _.partitionMap(f, String.Monoid.empty)), [
      _.right(0),
      _.left(String.Monoid.empty)
    ])
    deepStrictEqual(pipe(_.right(3), _.partitionMap(f, String.Monoid.empty)), [
      _.left(String.Monoid.empty),
      _.right(4)
    ])
  })

  describe.concurrent("getFilterable", () => {
    const F = _.getFilterable(String.Monoid.empty)

    it("filterMap", () => {
      const p = (n: number) => n > 2
      const f = (n: number) => (p(n) ? O.some(n + 1) : O.none)
      deepStrictEqual(pipe(_.left("123"), F.filterMap(f)), _.left("123"))
      deepStrictEqual(pipe(_.right(1), F.filterMap(f)), _.left(String.Monoid.empty))
      deepStrictEqual(pipe(_.right(3), F.filterMap(f)), _.right(4))
    })
  })

  it("liftSemigroup", () => {
    const Semigroup = _.liftSemigroup(Number.SemigroupSum)<string>()
    deepStrictEqual(pipe(_.left("a"), Semigroup.combine(_.left("b"))), _.left("a"))
    deepStrictEqual(pipe(_.left("a"), Semigroup.combine(_.right(2))), _.right(2))
    deepStrictEqual(pipe(_.right(1), Semigroup.combine(_.left("b"))), _.right(1))
    deepStrictEqual(
      pipe(_.right(1), Semigroup.combine(_.right(2))),
      _.right(3)
    )
  })

  it("fromOption", () => {
    deepStrictEqual(_.fromOption("none")(O.none), _.left("none"))
    deepStrictEqual(_.fromOption("none")(O.some(1)), _.right(1))
  })

  it("liftOption", () => {
    const f = _.liftOption((n: number) => (n > 0 ? O.some(n) : O.none), "a")
    deepStrictEqual(f(1), _.right(1))
    deepStrictEqual(f(-1), _.left("a"))
  })

  it("flatMapOption", () => {
    const f = _.flatMapOption((n: number) => (n > 0 ? O.some(n) : O.none), "a")
    deepStrictEqual(f(_.right(1)), _.right(1))
    deepStrictEqual(f(_.right(-1)), _.left("a"))
    deepStrictEqual(f(_.left("b")), _.left("b"))
  })

  it("exists", () => {
    const gt2 = _.exists((n: number) => n > 2)
    deepStrictEqual(gt2(_.left("a")), false)
    deepStrictEqual(gt2(_.right(1)), false)
    deepStrictEqual(gt2(_.right(3)), true)
  })

  it("do notation", () => {
    deepStrictEqual(
      pipe(
        _.right(1),
        _.bindTo("a"),
        _.bind("b", () => _.right("b")),
        _.let("c", ({ a, b }) => [a, b])
      ),
      _.right({ a: 1, b: "b", c: [1, "b"] })
    )
  })

  it("bindEither", () => {
    deepStrictEqual(
      pipe(_.right(1), _.bindTo("a"), _.bindEither("b", _.right("b"))),
      _.right({ a: 1, b: "b" })
    )
  })

  it("product", () => {
    deepStrictEqual(pipe(_.right(1), _.product(_.right("a"))), _.right([1, "a"] as const))
    deepStrictEqual(pipe(_.right(1), _.product(_.left("e2"))), _.left("e2"))
    deepStrictEqual(pipe(_.left("e1"), _.product(_.right("a"))), _.left("e1"))
    deepStrictEqual(pipe(_.left("e1"), _.product(_.left("2"))), _.left("e1"))
  })

  it("productMany", () => {
    deepStrictEqual(pipe(_.right(1), _.productMany([])), _.right([1]))
    deepStrictEqual(
      pipe(_.right(1), _.productMany([_.right(2), _.right(3)])),
      _.right([1, 2, 3])
    )
    deepStrictEqual(
      pipe(_.right(1), _.productMany([_.left("e"), _.right(3)])),
      _.left("e")
    )
    deepStrictEqual(
      pipe(_.left("e"), _.productMany<string, number>([_.right(2), _.right(3)])),
      _.left("e")
    )
  })

  it("productAll", () => {
    deepStrictEqual(_.productAll([]), _.right([]))
    deepStrictEqual(
      _.productAll([_.right(1), _.right(2), _.right(3)]),
      _.right([1, 2, 3])
    )
    deepStrictEqual(
      _.productAll([_.left("e"), _.right(2), _.right(3)]),
      _.left("e")
    )
  })

  it("coproduct", () => {
    deepStrictEqual(pipe(_.right(1), _.coproduct(_.right(2))), _.right(1))
    deepStrictEqual(pipe(_.right(1), _.coproduct(_.left("e2"))), _.right(1))
    deepStrictEqual(pipe(_.left("e1"), _.coproduct(_.right(2))), _.right(2))
    deepStrictEqual(pipe(_.left("e1"), _.coproduct(_.left("e2"))), _.left("e2"))
  })

  it("coproductMany", () => {
    deepStrictEqual(pipe(_.right(1), _.coproductMany([_.right(2)])), _.right(1))
    deepStrictEqual(pipe(_.right(1), _.coproductMany<string, number>([_.left("e2")])), _.right(1))
    deepStrictEqual(pipe(_.left("e1"), _.coproductMany<string, number>([_.right(2)])), _.right(2))
    deepStrictEqual(pipe(_.left("e1"), _.coproductMany([_.left("e2")])), _.left("e2"))
  })

  it("productFlatten", () => {
    deepStrictEqual(
      pipe(_.right(1), _.tupled, _.productFlatten(_.right("b"))),
      _.right([1, "b"] as const)
    )
  })

  it("liftNullable", () => {
    const f = _.liftNullable((n: number) => (n > 0 ? n : null), "error")
    deepStrictEqual(f(1), _.right(1))
    deepStrictEqual(f(-1), _.left("error"))
  })

  it("flatMapNullable", () => {
    const f = _.flatMapNullable((n: number) => (n > 0 ? n : null), "error")
    deepStrictEqual(f(_.right(1)), _.right(1))
    deepStrictEqual(f(_.right(-1)), _.left("error"))
    deepStrictEqual(f(_.left("a")), _.left("a"))
  })

  it("toUnion", () => {
    deepStrictEqual(_.toUnion(_.right(1)), 1)
    deepStrictEqual(_.toUnion(_.left("a")), "a")
  })

  it("liftThrowable", () => {
    const f = _.liftThrowable((s: string) => {
      const len = s.length
      if (len > 0) {
        return len
      }
      throw new Error("empty string")
    }, identity)
    deepStrictEqual(f("a"), _.right(1))
    deepStrictEqual(f(""), _.left(new Error("empty string")))
  })
})
