import * as Either from "@effect/data/Either"
import { flow, identity, pipe } from "@effect/data/Function"
import * as N from "@effect/data/Number"
import * as O from "@effect/data/Option"
import * as S from "@effect/data/String"
import * as Util from "@effect/data/test/util"
import { inspect } from "node:util"

describe.concurrent("Either", () => {
  it("exports", () => {
    expect(Either.EitherTypeId).exist

    expect(Either.toOption).exist
    expect(Either.getRight).exist
    expect(Either.getLeft).exist

    expect(Either.Invariant).exist
    expect(Either.tupled).exist
    expect(Either.bindTo).exist

    expect(Either.Covariant).exist
    expect(Either.map).exist
    expect(Either.let).exist
    expect(Either.flap).exist
    expect(Either.as).exist
    expect(Either.asUnit).exist

    expect(Either.Bicovariant).exist
    expect(Either.bimap).exist
    expect(Either.mapLeft).exist

    expect(Either.unit).exist
    expect(Either.Do).exist

    expect(Either.Pointed).exist

    expect(Either.FlatMap).exist
    expect(Either.flatMap).exist
    expect(Either.flatten).exist
    expect(Either.zipRight).exist
    expect(Either.composeK).exist

    expect(Either.Chainable).exist
    expect(Either.bind).exist
    expect(Either.tap).exist
    expect(Either.zipLeft).exist

    expect(Either.Monad).exist

    expect(Either.SemiProduct).exist

    expect(Either.Product).exist
    expect(Either.all).exist
    expect(Either.tuple).exist
    expect(Either.struct).exist

    expect(Either.SemiApplicative).exist
    expect(Either.getFirstLeftSemigroup).exist // liftSemigroup
    expect(Either.lift2).exist
    expect(Either.ap).exist
    expect(Either.zipLeft).exist
    expect(Either.zipRight).exist

    expect(Either.Applicative).exist
    expect(Either.getFirstLeftMonoid).exist // liftMonoid

    expect(Either.SemiCoproduct).exist
    expect(Either.getFirstRightSemigroup).exist // getSemigroup

    expect(Either.SemiAlternative).exist

    expect(Either.Foldable).exist

    expect(Either.Traversable).exist
    expect(Either.traverse).exist
    expect(Either.sequence).exist
    expect(Either.traverseTap).exist
  })

  it("validateAll", () => {
    const f = (n: number) => n > 0 ? Either.right(n) : Either.left(`${n} is negative`)
    expect(Either.validateAll([], f)).toEqual(Either.right([]))
    expect(Either.validateAll([1], f)).toEqual(Either.right([1]))
    expect(Either.validateAll([1, 2], f)).toEqual(Either.right([1, 2]))
    expect(Either.validateAll([1, -1], f)).toEqual(Either.left(["-1 is negative"]))
    expect(Either.validateAll([1, -1, -2], f)).toEqual(
      Either.left(["-1 is negative", "-2 is negative"])
    )
  })

  it("validateAllDiscard", () => {
    const f = (n: number) => n > 0 ? Either.right(n) : Either.left(`${n} is negative`)
    expect(Either.validateAllDiscard([], f)).toEqual(Either.right(undefined))
    expect(Either.validateAllDiscard([1], f)).toEqual(Either.right(undefined))
    expect(Either.validateAllDiscard([1, 2], f)).toEqual(Either.right(undefined))
    expect(Either.validateAllDiscard([1, -1], f)).toEqual(Either.left(["-1 is negative"]))
    expect(Either.validateAllDiscard([1, -1, -2], f)).toEqual(
      Either.left(["-1 is negative", "-2 is negative"])
    )
  })

  it("validateFirst", () => {
    const f = (n: number) => n > 0 ? Either.right(n) : Either.left(`${n} is negative`)
    expect(Either.validateFirst([], f)).toEqual(Either.left([]))
    expect(Either.validateFirst([1], f)).toEqual(Either.right(1))
    expect(Either.validateFirst([1, 2], f)).toEqual(Either.right(1))
    expect(Either.validateFirst([1, -1], f)).toEqual(Either.right(1))
    expect(Either.validateFirst([-1, 2], f)).toEqual(Either.right(2))
    expect(Either.validateFirst([-1, -2], f)).toEqual(
      Either.left(["-1 is negative", "-2 is negative"])
    )
  })

  it("toString", () => {
    expect(String(Either.right(1))).toEqual("right(1)")
    expect(String(Either.left("e"))).toEqual(`left(e)`)
  })

  it("toJSON", () => {
    expect(JSON.stringify(Either.right(1))).toEqual(
      JSON.stringify({ _tag: "Right", right: 1 })
    )
    expect(JSON.stringify(Either.left("e"))).toEqual(
      JSON.stringify({ _tag: "Left", left: "e" })
    )
  })

  it("inspect", () => {
    expect(inspect(Either.right(1))).toEqual(inspect({ _tag: "Right", right: 1 }))
    expect(inspect(Either.left("e"))).toEqual(inspect({ _tag: "Left", left: "e" }))
  })

  it("toRefinement", () => {
    const f = (s: string | number): Either.Either<string, string> =>
      typeof s === "string" ? Either.right(s) : Either.left("not a string")
    const isString = Either.toRefinement(f)
    Util.deepStrictEqual(isString("s"), true)
    Util.deepStrictEqual(isString(1), false)
    type A = { readonly type: "A" }
    type B = { readonly type: "B" }
    type C = A | B
    const isA = Either.toRefinement((
      c: C
    ) => (c.type === "A" ? Either.right(c) : Either.left("not as A")))
    Util.deepStrictEqual(isA({ type: "A" }), true)
    Util.deepStrictEqual(isA({ type: "B" }), false)
  })

  it("isEither", () => {
    Util.deepStrictEqual(pipe(Either.right(1), Either.isEither), true)
    Util.deepStrictEqual(pipe(Either.left("e"), Either.isEither), true)
    Util.deepStrictEqual(pipe(O.some(1), Either.isEither), false)
  })

  it("orElseFail", () => {
    Util.deepStrictEqual(pipe(Either.right(1), Either.orElseFail(() => "e2")), Either.right(1))
    Util.deepStrictEqual(pipe(Either.left("e1"), Either.orElseFail(() => "e2")), Either.left("e2"))
  })

  it("reduce", () => {
    Util.deepStrictEqual(pipe(Either.right("bar"), Either.Foldable.reduce("foo", (b, a) => b + a)), "foobar")
    Util.deepStrictEqual(pipe(Either.left("bar"), Either.Foldable.reduce("foo", (b, a) => b + a)), "foo")
  })

  it("getRight", () => {
    Util.deepStrictEqual(pipe(Either.right(1), Either.getRight), O.some(1))
    Util.deepStrictEqual(pipe(Either.left("a"), Either.getRight), O.none())
  })

  it("getLeft", () => {
    Util.deepStrictEqual(pipe(Either.right(1), Either.getLeft), O.none())
    Util.deepStrictEqual(pipe(Either.left("e"), Either.getLeft), O.some("e"))
  })

  it("getOrNull", () => {
    Util.deepStrictEqual(pipe(Either.right(1), Either.getOrNull), 1)
    Util.deepStrictEqual(pipe(Either.left("a"), Either.getOrNull), null)
  })

  it("getOrUndefined", () => {
    Util.deepStrictEqual(pipe(Either.right(1), Either.getOrUndefined), 1)
    Util.deepStrictEqual(pipe(Either.left("a"), Either.getOrUndefined), undefined)
  })

  it("compact", () => {
    Util.deepStrictEqual(pipe(Either.right(O.some(1)), Either.compact(() => "e2")), Either.right(1))
    Util.deepStrictEqual(pipe(Either.right(O.none()), Either.compact(() => "e2")), Either.left("e2"))
    Util.deepStrictEqual(pipe(Either.left("e1"), Either.compact(() => "e2")), Either.left("e1"))
  })

  it("inspectRight", () => {
    const log: Array<number> = []
    pipe(Either.right(1), Either.inspectRight((e) => log.push(e)))
    pipe(Either.left("e"), Either.inspectRight((e) => log.push(e)))
    Util.deepStrictEqual(log, [1])
  })

  it("tapError", () => {
    Util.deepStrictEqual(pipe(Either.right(1), Either.tapError(() => Either.right(2))), Either.right(1))
    Util.deepStrictEqual(pipe(Either.left("a"), Either.tapError(() => Either.right(2))), Either.left("a"))
    Util.deepStrictEqual(pipe(Either.left("a"), Either.tapError(() => Either.left("b"))), Either.left("b"))
  })

  it("inspectLeft", () => {
    const log: Array<string> = []
    pipe(Either.right(1), Either.inspectLeft((e) => log.push(e)))
    pipe(Either.left("e"), Either.inspectLeft((e) => log.push(e)))
    Util.deepStrictEqual(log, ["e"])
  })

  it("getOrThrow", () => {
    expect(pipe(Either.right(1), Either.getOrThrow)).toEqual(1)
    expect(() => pipe(Either.left("e"), Either.getOrThrow)).toThrowError(
      new Error("getOrThrow called on a Left")
    )
  })

  it("getOrThrowWith", () => {
    expect(pipe(Either.right(1), Either.getOrThrowWith((e) => new Error(`Unexpected Left: ${e}`)))).toEqual(1)
    expect(() => pipe(Either.left("e"), Either.getOrThrowWith((e) => new Error(`Unexpected Left: ${e}`))))
      .toThrowError(
        new Error("Unexpected Left: e")
      )
  })

  it("andThenDiscard", () => {
    Util.deepStrictEqual(pipe(Either.right(1), Either.zipLeft(Either.right("a"))), Either.right(1))
    Util.deepStrictEqual(pipe(Either.right(1), Either.zipLeft(Either.left(true))), Either.left(true))
    Util.deepStrictEqual(pipe(Either.left(1), Either.zipLeft(Either.right("a"))), Either.left(1))
    Util.deepStrictEqual(pipe(Either.left(1), Either.zipLeft(Either.left(true))), Either.left(1))
  })

  it("andThen", () => {
    Util.deepStrictEqual(pipe(Either.right(1), Either.zipRight(Either.right("a"))), Either.right("a"))
    Util.deepStrictEqual(pipe(Either.right(1), Either.zipRight(Either.left(true))), Either.left(true))
    Util.deepStrictEqual(pipe(Either.left(1), Either.zipRight(Either.right("a"))), Either.left(1))
    Util.deepStrictEqual(pipe(Either.left(1), Either.zipRight(Either.left(true))), Either.left(1))
  })

  it("orElse", () => {
    Util.deepStrictEqual(pipe(Either.right(1), Either.orElse(() => Either.right(2))), Either.right(1))
    Util.deepStrictEqual(pipe(Either.right(1), Either.orElse(() => Either.left("b"))), Either.right(1))
    Util.deepStrictEqual(pipe(Either.left("a"), Either.orElse(() => Either.right(2))), Either.right(2))
    Util.deepStrictEqual(pipe(Either.left("a"), Either.orElse(() => Either.left("b"))), Either.left("b"))
  })

  it("orElseEither", () => {
    expect(pipe(Either.right(1), Either.orElseEither(() => Either.right(2)))).toEqual(Either.right(Either.left(1)))
    expect(pipe(Either.right(1), Either.orElseEither(() => Either.left("b")))).toEqual(Either.right(Either.left(1)))
    expect(pipe(Either.left("a"), Either.orElseEither(() => Either.right(2)))).toEqual(Either.right(Either.right(2)))
    expect(pipe(Either.left("a"), Either.orElseEither(() => Either.left("b")))).toEqual(Either.left("b"))
  })

  it("map", () => {
    const f = Either.map(S.length)
    Util.deepStrictEqual(pipe(Either.right("abc"), f), Either.right(3))
    Util.deepStrictEqual(pipe(Either.left("s"), f), Either.left("s"))
  })

  it("flatMap", () => {
    const f = Either.flatMap<string, string, number>(flow(S.length, Either.right))
    Util.deepStrictEqual(pipe(Either.right("abc"), f), Either.right(3))
    Util.deepStrictEqual(pipe(Either.left("maError"), f), Either.left("maError"))
  })

  it("bimap", () => {
    const f = Either.bimap(S.length, (n: number) => n > 2)
    Util.deepStrictEqual(pipe(Either.right(1), f), Either.right(false))
  })

  it("mapLeft", () => {
    const f = Either.mapLeft(Util.double)
    Util.deepStrictEqual(pipe(Either.right("a"), f), Either.right("a"))
    Util.deepStrictEqual(pipe(Either.left(1), f), Either.left(2))
  })

  it("traverse", () => {
    const traverse = Either.traverse(O.Applicative)((
      n: number
    ) => (n >= 2 ? O.some(n) : O.none()))
    Util.deepStrictEqual(pipe(Either.left("a"), traverse), O.some(Either.left("a")))
    Util.deepStrictEqual(pipe(Either.right(1), traverse), O.none())
    Util.deepStrictEqual(pipe(Either.right(3), traverse), O.some(Either.right(3)))
  })

  it("sequence", () => {
    const sequence = Either.sequence(O.Applicative)
    Util.deepStrictEqual(sequence(Either.right(O.some(1))), O.some(Either.right(1)))
    Util.deepStrictEqual(sequence(Either.left("a")), O.some(Either.left("a")))
    Util.deepStrictEqual(sequence(Either.right(O.none())), O.none())
  })

  it("match", () => {
    const f = (s: string) => `left${s.length}`
    const g = (s: string) => `right${s.length}`
    const match = Either.match(f, g)
    Util.deepStrictEqual(match(Either.left("abc")), "left3")
    Util.deepStrictEqual(match(Either.right("abc")), "right3")
  })

  it("getOrElse", () => {
    Util.deepStrictEqual(pipe(Either.right(12), Either.getOrElse(() => 17)), 12)
    Util.deepStrictEqual(pipe(Either.left("a"), Either.getOrElse(() => 17)), 17)
  })

  it("contains", () => {
    const contains = Either.contains(N.Equivalence)
    Util.deepStrictEqual(pipe(Either.left("a"), contains(2)), false)
    Util.deepStrictEqual(pipe(Either.right(2), contains(2)), true)
    Util.deepStrictEqual(pipe(Either.right(2), contains(1)), false)
  })

  it("filter", () => {
    const predicate = (n: number) => n > 10
    Util.deepStrictEqual(pipe(Either.right(12), Either.filter(predicate, () => -1)), Either.right(12))
    Util.deepStrictEqual(pipe(Either.right(7), Either.filter(predicate, () => -1)), Either.left(-1))
    Util.deepStrictEqual(pipe(Either.left(12), Either.filter(predicate, () => -1)), Either.left(12))
  })

  it("isLeft", () => {
    Util.deepStrictEqual(Either.isLeft(Either.right(1)), false)
    Util.deepStrictEqual(Either.isLeft(Either.left(1)), true)
  })

  it("isRight", () => {
    Util.deepStrictEqual(Either.isRight(Either.right(1)), true)
    Util.deepStrictEqual(Either.isRight(Either.left(1)), false)
  })

  it("swap", () => {
    Util.deepStrictEqual(Either.reverse(Either.right("a")), Either.left("a"))
    Util.deepStrictEqual(Either.reverse(Either.left("b")), Either.right("b"))
  })

  it("liftPredicate", () => {
    const f = Either.liftPredicate((n: number) => n >= 2, () => "e")
    Util.deepStrictEqual(f(3), Either.right(3))
    Util.deepStrictEqual(f(1), Either.left("e"))
  })

  it("fromNullable", () => {
    Util.deepStrictEqual(Either.fromNullable(() => "default")(null), Either.left("default"))
    Util.deepStrictEqual(Either.fromNullable(() => "default")(undefined), Either.left("default"))
    Util.deepStrictEqual(Either.fromNullable(() => "default")(1), Either.right(1))
  })

  it("filterMap", () => {
    const p = (n: number) => n > 2
    const f = (n: number) => (p(n) ? O.some(n + 1) : O.none())
    Util.deepStrictEqual(pipe(Either.left("123"), Either.filterMap(f, () => "")), Either.left("123"))
    Util.deepStrictEqual(pipe(Either.right(1), Either.filterMap(f, () => "")), Either.left(S.Monoid.empty))
    Util.deepStrictEqual(pipe(Either.right(3), Either.filterMap(f, () => "")), Either.right(4))
  })

  it("fromIterable", () => {
    Util.deepStrictEqual(Either.fromIterable(() => "e")([]), Either.left("e"))
    Util.deepStrictEqual(Either.fromIterable(() => "e")(["a"]), Either.right("a"))
  })

  it("firstRightOf", () => {
    Util.deepStrictEqual(pipe(Either.right(1), Either.firstRightOf([])), Either.right(1))
    Util.deepStrictEqual(pipe(Either.left("e"), Either.firstRightOf([])), Either.left("e"))
    Util.deepStrictEqual(
      pipe(
        Either.left("e1"),
        Either.firstRightOf([Either.left("e2"), Either.left("e3"), Either.left("e4"), Either.right(1)])
      ),
      Either.right(1)
    )
    Util.deepStrictEqual(
      pipe(Either.left("e1"), Either.firstRightOf([Either.left("e2"), Either.left("e3"), Either.left("e4")])),
      Either.left("e4")
    )
  })

  it("fromOption", () => {
    Util.deepStrictEqual(Either.fromOption(() => "none")(O.none()), Either.left("none"))
    Util.deepStrictEqual(Either.fromOption(() => "none")(O.some(1)), Either.right(1))
  })

  it("liftOption", () => {
    const f = Either.liftOption((n: number) => (n > 0 ? O.some(n) : O.none()), () => "a")
    Util.deepStrictEqual(f(1), Either.right(1))
    Util.deepStrictEqual(f(-1), Either.left("a"))
  })

  it("flatMapOption", () => {
    const f = Either.flatMapOption((n: number) => (n > 0 ? O.some(n) : O.none()), () => "a")
    Util.deepStrictEqual(f(Either.right(1)), Either.right(1))
    Util.deepStrictEqual(f(Either.right(-1)), Either.left("a"))
    Util.deepStrictEqual(f(Either.left("b")), Either.left("b"))
  })

  it("exists", () => {
    const gt2 = Either.exists((n: number) => n > 2)
    Util.deepStrictEqual(gt2(Either.left("a")), false)
    Util.deepStrictEqual(gt2(Either.right(1)), false)
    Util.deepStrictEqual(gt2(Either.right(3)), true)
  })

  it("do notation", () => {
    Util.deepStrictEqual(
      pipe(
        Either.right(1),
        Either.bindTo("a"),
        Either.bind("b", () => Either.right("b")),
        Either.let("c", ({ a, b }) => [a, b])
      ),
      Either.right({ a: 1, b: "b", c: [1, "b"] })
    )
  })

  it("andThenBind", () => {
    Util.deepStrictEqual(
      pipe(Either.right(1), Either.bindTo("a"), Either.bindDiscard("b", Either.right("b"))),
      Either.right({ a: 1, b: "b" })
    )
  })

  it("product", () => {
    const product = Either.SemiProduct.product
    Util.deepStrictEqual(product(Either.right(1), Either.right("a")), Either.right([1, "a"]))
    Util.deepStrictEqual(product(Either.right(1), Either.left("e2")), Either.left("e2"))
    Util.deepStrictEqual(product(Either.left("e1"), Either.right("a")), Either.left("e1"))
    Util.deepStrictEqual(product(Either.left("e1"), Either.left("2")), Either.left("e1"))
  })

  it("productMany", () => {
    const productMany: <E, A>(
      self: Either.Either<E, A>,
      collection: Iterable<Either.Either<E, A>>
    ) => Either.Either<E, [A, ...Array<A>]> = Either.SemiProduct.productMany

    Util.deepStrictEqual(productMany(Either.right(1), []), Either.right([1]))
    Util.deepStrictEqual(
      productMany(Either.right(1), [Either.right(2), Either.right(3)]),
      Either.right([1, 2, 3])
    )
    Util.deepStrictEqual(
      productMany(Either.right(1), [Either.left("e"), Either.right(3)]),
      Either.left("e")
    )
    expect(
      productMany(Either.left("e"), [Either.right(2), Either.right(3)])
    ).toEqual(Either.left("e"))
  })

  it("productAll", () => {
    const productAll = Either.Product.productAll
    Util.deepStrictEqual(productAll([]), Either.right([]))
    Util.deepStrictEqual(
      productAll([Either.right(1), Either.right(2), Either.right(3)]),
      Either.right([1, 2, 3])
    )
    Util.deepStrictEqual(
      productAll([Either.left("e"), Either.right(2), Either.right(3)]),
      Either.left("e")
    )
  })

  it("coproduct", () => {
    const coproduct = Either.SemiCoproduct.coproduct
    Util.deepStrictEqual(coproduct(Either.right(1), Either.right(2)), Either.right(1))
    Util.deepStrictEqual(coproduct(Either.right(1), Either.left("e2")), Either.right(1))
    Util.deepStrictEqual(coproduct(Either.left("e1"), Either.right(2)), Either.right(2))
    Util.deepStrictEqual(coproduct(Either.left("e1"), Either.left("e2")), Either.left("e2"))
  })

  it("coproductMany", () => {
    const coproductMany = Either.SemiCoproduct.coproductMany
    Util.deepStrictEqual(coproductMany(Either.right(1), [Either.right(2)]), Either.right(1))
    Util.deepStrictEqual(
      coproductMany(Either.right(1), [Either.left("e2")]),
      Either.right(1)
    )
    Util.deepStrictEqual(coproductMany(Either.left("e1"), [Either.right(2)]), Either.right(2))
    Util.deepStrictEqual(coproductMany(Either.left("e1"), [Either.left("e2")]), Either.left("e2"))
  })

  it("element", () => {
    expect(pipe(Either.right(1), Either.tupled, Either.appendElement(Either.right("b")))).toEqual(
      Either.right([1, "b"])
    )
  })

  it("liftNullable", () => {
    const f = Either.liftNullable((n: number) => (n > 0 ? n : null), () => "error")
    Util.deepStrictEqual(f(1), Either.right(1))
    Util.deepStrictEqual(f(-1), Either.left("error"))
  })

  it("flatMapNullable", () => {
    const f = Either.flatMapNullable((n: number) => (n > 0 ? n : null), () => "error")
    Util.deepStrictEqual(f(Either.right(1)), Either.right(1))
    Util.deepStrictEqual(f(Either.right(-1)), Either.left("error"))
    Util.deepStrictEqual(f(Either.left("a")), Either.left("a"))
  })

  it("merge", () => {
    Util.deepStrictEqual(Either.merge(Either.right(1)), 1)
    Util.deepStrictEqual(Either.merge(Either.left("a")), "a")
  })

  it("liftThrowable", () => {
    const f = Either.liftThrowable((s: string) => {
      const len = s.length
      if (len > 0) {
        return len
      }
      throw new Error("empty string")
    }, identity)
    Util.deepStrictEqual(f("a"), Either.right(1))
    Util.deepStrictEqual(f(""), Either.left(new Error("empty string")))
  })

  it("zipWith", () => {
    expect(pipe(Either.left("a"), Either.zipWith(Either.right(2), (a, b) => a + b))).toEqual(Either.left("a"))
    expect(pipe(Either.right(1), Either.zipWith(Either.left("a"), (a, b) => a + b))).toEqual(Either.left("a"))
    expect(pipe(Either.right(1), Either.zipWith(Either.right(2), (a, b) => a + b))).toEqual(Either.right(3))
  })

  it("sum", () => {
    expect(pipe(Either.left("a"), Either.sum(Either.right(2)))).toEqual(Either.left("a"))
    expect(pipe(Either.right(1), Either.sum(Either.left("a")))).toEqual(Either.left("a"))
    expect(pipe(Either.right(2), Either.sum(Either.right(3)))).toEqual(Either.right(5))
  })

  it("multiply", () => {
    expect(pipe(Either.left("a"), Either.multiply(Either.right(2)))).toEqual(Either.left("a"))
    expect(pipe(Either.right(1), Either.multiply(Either.left("a")))).toEqual(Either.left("a"))
    expect(pipe(Either.right(2), Either.multiply(Either.right(3)))).toEqual(Either.right(6))
  })

  it("subtract", () => {
    expect(pipe(Either.left("a"), Either.subtract(Either.right(2)))).toEqual(Either.left("a"))
    expect(pipe(Either.right(1), Either.subtract(Either.left("a")))).toEqual(Either.left("a"))
    expect(pipe(Either.right(2), Either.subtract(Either.right(3)))).toEqual(Either.right(-1))
  })

  it("divide", () => {
    expect(pipe(Either.left("a"), Either.divide(Either.right(2)))).toEqual(Either.left("a"))
    expect(pipe(Either.right(1), Either.divide(Either.left("a")))).toEqual(Either.left("a"))
    expect(pipe(Either.right(6), Either.divide(Either.right(3)))).toEqual(Either.right(2))
  })

  it("getOptionalSemigroup", () => {
    const OS = Either.getOptionalSemigroup(S.Semigroup)
    Util.deepStrictEqual(OS.combine(Either.left("e"), Either.left("e")), Either.left("e"))
    Util.deepStrictEqual(OS.combine(Either.left("e"), Either.right("a")), Either.right("a"))
    Util.deepStrictEqual(OS.combine(Either.right("a"), Either.left("e")), Either.right("a"))
    Util.deepStrictEqual(OS.combine(Either.right("b"), Either.right("a")), Either.right("ba"))
    Util.deepStrictEqual(OS.combine(Either.right("a"), Either.right("b")), Either.right("ab"))

    Util.deepStrictEqual(OS.combineMany(Either.right("a"), [Either.right("b")]), Either.right("ab"))
    Util.deepStrictEqual(OS.combineMany(Either.left("e"), [Either.right("b")]), Either.right("b"))
    Util.deepStrictEqual(OS.combineMany(Either.right("a"), [Either.left("e")]), Either.right("a"))
  })

  it("getEquivalence", () => {
    const isEquivalent = Either.getEquivalence(S.Equivalence, N.Equivalence)
    Util.deepStrictEqual(isEquivalent(Either.right(1), Either.right(1)), true)
    Util.deepStrictEqual(isEquivalent(Either.right(1), Either.right(2)), false)
    Util.deepStrictEqual(isEquivalent(Either.right(1), Either.left("foo")), false)
    Util.deepStrictEqual(isEquivalent(Either.left("foo"), Either.left("foo")), true)
    Util.deepStrictEqual(isEquivalent(Either.left("foo"), Either.left("bar")), false)
    Util.deepStrictEqual(isEquivalent(Either.left("foo"), Either.right(1)), false)
  })

  it("toArray", () => {
    expect(Either.toArray(Either.right(1))).toEqual([1])
    expect(Either.toArray(Either.left("error"))).toEqual([])
  })

  it("gen", () => {
    expect(Either.gen(function*($) {
      const a = yield* $(Either.right(1))
      const b = yield* $(Either.right(2))
      return a + b
    })).toEqual(Either.right(3))
  })
})
