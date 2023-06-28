import * as E from "@effect/data/Either"
import * as Equivalence from "@effect/data/Equivalence"
import { pipe } from "@effect/data/Function"
import * as N from "@effect/data/Number"
import * as _ from "@effect/data/Option"
import * as S from "@effect/data/String"
import * as Util from "@effect/data/test/util"
import { inspect } from "node:util"

const p = (n: number): boolean => n > 2

describe.concurrent("Option", () => {
  it("toString", () => {
    expect(String(_.none())).toEqual("none()")
    expect(String(_.some(1))).toEqual("some(1)")
  })

  it("toJSON", () => {
    expect(JSON.stringify(_.none())).toEqual(
      JSON.stringify({ _tag: "None" })
    )
    expect(JSON.stringify(_.some(1))).toEqual(
      JSON.stringify({ _tag: "Some", value: 1 })
    )
  })

  it("inspect", () => {
    expect(inspect(_.none())).toEqual(inspect({ _tag: "None" }))
    expect(inspect(_.some(1))).toEqual(inspect({ _tag: "Some", value: 1 }))
  })

  it("getRight", () => {
    expect(_.getRight(E.right(1))).toEqual(_.some(1))
    expect(_.getRight(E.left("a"))).toEqual(_.none())
  })

  it("getLeft", () => {
    expect(_.getLeft(E.right(1))).toEqual(_.none())
    expect(_.getLeft(E.left("a"))).toEqual(_.some("a"))
  })

  it("toRefinement", () => {
    const f = (
      s: string | number
    ): _.Option<string> => (typeof s === "string" ? _.some(s) : _.none())
    const isString = _.toRefinement(f)
    Util.deepStrictEqual(isString("s"), true)
    Util.deepStrictEqual(isString(1), false)
    type A = { readonly type: "A" }
    type B = { readonly type: "B" }
    type C = A | B
    const isA = _.toRefinement<C, A>((c) => (c.type === "A" ? _.some(c) : _.none()))
    Util.deepStrictEqual(isA({ type: "A" }), true)
    Util.deepStrictEqual(isA({ type: "B" }), false)
  })

  it("isOption", () => {
    Util.deepStrictEqual(pipe(_.some(1), _.isOption), true)
    Util.deepStrictEqual(pipe(_.none(), _.isOption), true)
    Util.deepStrictEqual(pipe(E.right(1), _.isOption), false)
  })

  it("firstSomeOf", () => {
    Util.deepStrictEqual(_.firstSomeOf([]), _.none())
    Util.deepStrictEqual(_.firstSomeOf([_.some(1)]), _.some(1))
    Util.deepStrictEqual(_.firstSomeOf([_.none()]), _.none())
    Util.deepStrictEqual(
      _.firstSomeOf([_.none(), _.none(), _.none(), _.none(), _.some(1)]),
      _.some(1)
    )
    Util.deepStrictEqual(
      _.firstSomeOf([_.none(), _.none(), _.none(), _.none()]),
      _.none()
    )
  })

  it("orElseEither", () => {
    expect(pipe(_.some(1), _.orElseEither(() => _.some(2)))).toEqual(_.some(E.left(1)))
    expect(pipe(_.some(1), _.orElseEither(() => _.none()))).toEqual(_.some(E.left(1)))
    expect(pipe(_.none(), _.orElseEither(() => _.some(2)))).toEqual(_.some(E.right(2)))
    expect(pipe(_.none(), _.orElseEither(() => _.none()))).toEqual(_.none())
  })

  it("inspectSome", () => {
    const log: Array<number> = []
    pipe(
      _.some(1),
      _.inspectSome(() => log.push(1))
    )
    pipe(
      _.none(),
      _.inspectSome(() => log.push(2))
    )
    Util.deepStrictEqual(
      log,
      [1]
    )
  })

  it("inspectNone", () => {
    const log: Array<number> = []
    pipe(
      _.some(1),
      _.inspectNone(() => log.push(1))
    )
    pipe(
      _.none(),
      _.inspectNone(() => log.push(2))
    )
    Util.deepStrictEqual(
      log,
      [2]
    )
  })

  it("getOrThrow", () => {
    expect(pipe(_.some(1), _.getOrThrow)).toEqual(1)
    expect(() => pipe(_.none(), _.getOrThrow)).toThrowError(
      new Error("getOrThrow called on a None")
    )
  })

  it("getOrThrowWith", () => {
    expect(pipe(_.some(1), _.getOrThrowWith(() => new Error("Unexpected None")))).toEqual(1)
    expect(() => pipe(_.none(), _.getOrThrowWith(() => new Error("Unexpected None")))).toThrowError(
      new Error("Unexpected None")
    )
  })

  it("unit", () => {
    Util.deepStrictEqual(_.unit, _.some(undefined))
  })

  it("product", () => {
    const product = _.product
    Util.deepStrictEqual(product(_.none(), _.none()), _.none())
    Util.deepStrictEqual(product(_.some(1), _.none()), _.none())
    Util.deepStrictEqual(product(_.none(), _.some("a")), _.none())
    Util.deepStrictEqual(
      product(_.some(1), _.some("a")),
      _.some([1, "a"])
    )
  })

  it("productMany", () => {
    const productMany = _.productMany
    Util.deepStrictEqual(productMany(_.none(), []), _.none())
    Util.deepStrictEqual(productMany(_.some(1), []), _.some([1]))
    Util.deepStrictEqual(productMany(_.some(1), [_.none()]), _.none())
    Util.deepStrictEqual(productMany(_.some(1), [_.some(2)]), _.some([1, 2]))
  })

  it("all", () => {
    Util.deepStrictEqual(_.all([]), _.some([]))
    Util.deepStrictEqual(_.all([_.none()]), _.none())
    Util.deepStrictEqual(_.all([_.some(1), _.some(2)]), _.some([1, 2]))
    Util.deepStrictEqual(_.all([_.some(1), _.none()]), _.none())
  })

  it("fromIterable", () => {
    Util.deepStrictEqual(_.fromIterable([]), _.none())
    Util.deepStrictEqual(_.fromIterable(["a"]), _.some("a"))
  })

  it("map", () => {
    Util.deepStrictEqual(pipe(_.some(2), _.map(Util.double)), _.some(4))
    Util.deepStrictEqual(pipe(_.none(), _.map(Util.double)), _.none())
  })

  it("flatMap", () => {
    const f = (n: number) => _.some(n * 2)
    const g = () => _.none()
    Util.deepStrictEqual(pipe(_.some(1), _.flatMap(f)), _.some(2))
    Util.deepStrictEqual(pipe(_.none(), _.flatMap(f)), _.none())
    Util.deepStrictEqual(pipe(_.some(1), _.flatMap(g)), _.none())
    Util.deepStrictEqual(pipe(_.none(), _.flatMap(g)), _.none())
  })

  it("orElse", () => {
    const assertAlt = (
      a: _.Option<number>,
      b: _.Option<number>,
      expected: _.Option<number>
    ) => {
      Util.deepStrictEqual(pipe(a, _.orElse(() => b)), expected)
    }
    assertAlt(_.some(1), _.some(2), _.some(1))
    assertAlt(_.some(1), _.none(), _.some(1))
    assertAlt(_.none(), _.some(2), _.some(2))
    assertAlt(_.none(), _.none(), _.none())
  })

  it("partitionMap", () => {
    const f = (n: number) => (p(n) ? E.right(n + 1) : E.left(n - 1))
    assert.deepStrictEqual(pipe(_.none(), _.partitionMap(f)), [_.none(), _.none()])
    assert.deepStrictEqual(pipe(_.some(1), _.partitionMap(f)), [_.some(0), _.none()])
    assert.deepStrictEqual(pipe(_.some(3), _.partitionMap(f)), [_.none(), _.some(4)])
  })

  it("filterMap", () => {
    const f = (n: number) => (p(n) ? _.some(n + 1) : _.none())
    Util.deepStrictEqual(pipe(_.none(), _.filterMap(f)), _.none())
    Util.deepStrictEqual(pipe(_.some(1), _.filterMap(f)), _.none())
    Util.deepStrictEqual(pipe(_.some(3), _.filterMap(f)), _.some(4))
  })

  it("match", () => {
    const f = () => "none"
    const g = (s: string) => `some${s.length}`
    const match = _.match(f, g)
    Util.deepStrictEqual(match(_.none()), "none")
    Util.deepStrictEqual(match(_.some("abc")), "some3")
  })

  it("getOrElse", () => {
    Util.deepStrictEqual(pipe(_.some(1), _.getOrElse(() => 0)), 1)
    Util.deepStrictEqual(pipe(_.none(), _.getOrElse(() => 0)), 0)
  })

  it("getOrNull", () => {
    Util.deepStrictEqual(_.getOrNull(_.none()), null)
    Util.deepStrictEqual(_.getOrNull(_.some(1)), 1)
  })

  it("getOrUndefined", () => {
    Util.deepStrictEqual(_.getOrUndefined(_.none()), undefined)
    Util.deepStrictEqual(_.getOrUndefined(_.some(1)), 1)
  })

  it("getOrder", () => {
    const OS = _.getOrder(S.Order)
    Util.deepStrictEqual(OS.compare(_.none(), _.none()), 0)
    Util.deepStrictEqual(OS.compare(_.some("a"), _.none()), 1)
    Util.deepStrictEqual(OS.compare(_.none(), _.some("a")), -1)
    Util.deepStrictEqual(OS.compare(_.some("a"), _.some("a")), 0)
    Util.deepStrictEqual(OS.compare(_.some("a"), _.some("b")), -1)
    Util.deepStrictEqual(OS.compare(_.some("b"), _.some("a")), 1)
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
    Util.deepStrictEqual(
      pipe(
        _.fromNullable(x1.a),
        _.flatMapNullable((x) => x.b),
        _.flatMapNullable((x) => x.c),
        _.flatMapNullable((x) => x.d)
      ),
      _.none()
    )
    Util.deepStrictEqual(
      pipe(
        _.fromNullable(x2.a),
        _.flatMapNullable((x) => x.b),
        _.flatMapNullable((x) => x.c),
        _.flatMapNullable((x) => x.d)
      ),
      _.none()
    )
    Util.deepStrictEqual(
      pipe(
        _.fromNullable(x3.a),
        _.flatMapNullable((x) => x.b),
        _.flatMapNullable((x) => x.c),
        _.flatMapNullable((x) => x.d)
      ),
      _.some(1)
    )
  })

  it("fromNullable", () => {
    Util.deepStrictEqual(_.fromNullable(2), _.some(2))
    Util.deepStrictEqual(_.fromNullable(null), _.none())
    Util.deepStrictEqual(_.fromNullable(undefined), _.none())
  })

  it("liftPredicate", () => {
    const f = _.liftPredicate(p)
    Util.deepStrictEqual(f(1), _.none())
    Util.deepStrictEqual(f(3), _.some(3))

    type Direction = "asc" | "desc"
    const parseDirection = _.liftPredicate((s: string): s is Direction => s === "asc" || s === "desc")
    Util.deepStrictEqual(parseDirection("asc"), _.some("asc"))
    Util.deepStrictEqual(parseDirection("foo"), _.none())
  })

  it("contains", () => {
    const contains = _.contains(Equivalence.number)
    Util.deepStrictEqual(pipe(_.none(), contains(2)), false)
    Util.deepStrictEqual(pipe(_.some(2), contains(2)), true)
    Util.deepStrictEqual(pipe(_.some(2), contains(1)), false)
  })

  it("isNone", () => {
    Util.deepStrictEqual(_.isNone(_.none()), true)
    Util.deepStrictEqual(_.isNone(_.some(1)), false)
  })

  it("isSome", () => {
    Util.deepStrictEqual(_.isSome(_.none()), false)
    Util.deepStrictEqual(_.isSome(_.some(1)), true)
  })

  it("exists", () => {
    const predicate = (a: number) => a === 2
    Util.deepStrictEqual(pipe(_.none(), _.exists(predicate)), false)
    Util.deepStrictEqual(pipe(_.some(1), _.exists(predicate)), false)
    Util.deepStrictEqual(pipe(_.some(2), _.exists(predicate)), true)
  })

  it("do notation", () => {
    Util.deepStrictEqual(
      pipe(
        _.some(1),
        _.bindTo("a"),
        _.bind("b", () => _.some("b")),
        _.let("c", () => true)
      ),
      _.some({ a: 1, b: "b", c: true })
    )
  })

  it("element", () => {
    expect(pipe(_.some(1), _.tupled, _.appendElement(_.some("b")))).toEqual(
      _.some([1, "b"])
    )
  })

  it("liftNullable", () => {
    const f = _.liftNullable((n: number) => (n > 0 ? n : null))
    Util.deepStrictEqual(f(1), _.some(1))
    Util.deepStrictEqual(f(-1), _.none())
  })

  it("liftThrowable", () => {
    const parse = _.liftThrowable(JSON.parse)
    Util.deepStrictEqual(parse("1"), _.some(1))
    Util.deepStrictEqual(parse(""), _.none())
  })

  it("tap", () => {
    Util.deepStrictEqual(_.tap(_.none(), () => _.none()), _.none())
    Util.deepStrictEqual(_.tap(_.some(1), () => _.none()), _.none())
    Util.deepStrictEqual(_.tap(_.none(), (n) => _.some(n * 2)), _.none())
    Util.deepStrictEqual(_.tap(_.some(1), (n) => _.some(n * 2)), _.some(1))
  })

  it("guard", () => {
    Util.deepStrictEqual(
      pipe(
        _.Do(),
        _.bind("x", () => _.some("a")),
        _.bind("y", () => _.some("a")),
        _.filter(({ x, y }) => x === y)
      ),
      _.some({ x: "a", y: "a" })
    )
    Util.deepStrictEqual(
      pipe(
        _.Do(),
        _.bind("x", () => _.some("a")),
        _.bind("y", () => _.some("b")),
        _.filter(({ x, y }) => x === y)
      ),
      _.none()
    )
  })

  it("zipWith", () => {
    expect(pipe(_.none(), _.zipWith(_.some(2), (a, b) => a + b))).toEqual(_.none())
    expect(pipe(_.some(1), _.zipWith(_.none(), (a, b) => a + b))).toEqual(_.none())
    expect(pipe(_.some(1), _.zipWith(_.some(2), (a, b) => a + b))).toEqual(_.some(3))
  })

  it("reduceCompact", () => {
    const sumCompact = _.reduceCompact(0, N.sum)
    expect(sumCompact([])).toEqual(0)
    expect(sumCompact([_.some(2), _.some(3)])).toEqual(5)
    expect(sumCompact([_.some(2), _.none(), _.some(3)])).toEqual(5)
  })

  it("sum", () => {
    expect(pipe(_.none(), _.sum(_.some(2)))).toEqual(_.none())
    expect(pipe(_.some(1), _.sum(_.none()))).toEqual(_.none())
    expect(pipe(_.some(2), _.sum(_.some(3)))).toEqual(_.some(5))
  })

  it("multiply", () => {
    expect(pipe(_.none(), _.multiply(_.some(2)))).toEqual(_.none())
    expect(pipe(_.some(1), _.multiply(_.none()))).toEqual(_.none())
    expect(pipe(_.some(2), _.multiply(_.some(3)))).toEqual(_.some(6))
  })

  it("subtract", () => {
    expect(pipe(_.none(), _.subtract(_.some(2)))).toEqual(_.none())
    expect(pipe(_.some(1), _.subtract(_.none()))).toEqual(_.none())
    expect(pipe(_.some(2), _.subtract(_.some(3)))).toEqual(_.some(-1))
  })

  it("divide", () => {
    expect(pipe(_.none(), _.divide(_.some(2)))).toEqual(_.none())
    expect(pipe(_.some(1), _.divide(_.none()))).toEqual(_.none())
    expect(pipe(_.some(6), _.divide(_.some(3)))).toEqual(_.some(2))
  })

  it("sumCompact", () => {
    expect(_.sumCompact([])).toEqual(0)
    expect(_.sumCompact([_.some(2), _.some(3)])).toEqual(5)
    expect(_.sumCompact([_.some(2), _.none(), _.some(3)])).toEqual(5)
  })

  it("multiplyCompact", () => {
    expect(_.multiplyCompact([])).toEqual(1)
    expect(_.multiplyCompact([_.some(2), _.some(3)])).toEqual(6)
    expect(_.multiplyCompact([_.some(2), _.none(), _.some(3)])).toEqual(6)
    expect(_.multiplyCompact([_.some(2), _.some(0), _.some(3)])).toEqual(0)
  })

  it("getEquivalence", () => {
    const isEquivalent = _.getEquivalence(N.Equivalence)
    expect(isEquivalent(_.none(), _.none())).toEqual(true)
    expect(isEquivalent(_.none(), _.some(1))).toEqual(false)
    expect(isEquivalent(_.some(1), _.none())).toEqual(false)
    expect(isEquivalent(_.some(2), _.some(1))).toEqual(false)
    expect(isEquivalent(_.some(1), _.some(2))).toEqual(false)
    expect(isEquivalent(_.some(2), _.some(2))).toEqual(true)
  })

  it("tuple", () => {
    assert.deepStrictEqual(_.tuple(), _.some([]))
    assert.deepStrictEqual(_.tuple(_.some(1), _.some("hello")), _.some([1, "hello"]))
    assert.deepStrictEqual(_.tuple(_.some(1), _.none()), _.none())
  })

  it("struct", () => {
    assert.deepStrictEqual(_.struct({ a: _.some(1), b: _.some("hello") }), _.some({ a: 1, b: "hello" }))
    assert.deepStrictEqual(_.struct({ a: _.some(1), b: _.none() }), _.none())
  })
})
