import * as Function from "@fp-ts/data/Function"
import * as Number from "@fp-ts/data/Number"
import * as String from "@fp-ts/data/String"
import { deepStrictEqual, double } from "@fp-ts/data/test/util"
import * as assert from "assert"

const f = Number.increment
const g = double

describe.concurrent("Function", () => {
  it("getSemigroup", () => {
    const S = Function.getSemigroup(Number.SemigroupSum)<string>()
    const f = (s: string) => s === "a" ? 0 : 1
    const g = Function.pipe(String.size, S.combine(f))
    deepStrictEqual(g(""), 1)
    deepStrictEqual(g("a"), 1)
    deepStrictEqual(g("b"), 2)
    deepStrictEqual(S.combineMany([String.size, String.size])(String.size)("a"), 3)
  })

  it("getMonoid", () => {
    const M = Function.getMonoid(Number.MonoidSum)<string>()
    const f = (s: string) => s === "a" ? 0 : 1
    const g = Function.pipe(String.size, M.combine(f))
    deepStrictEqual(g(""), 1)
    deepStrictEqual(g("a"), 1)
    deepStrictEqual(g("b"), 2)
    deepStrictEqual(Function.pipe(String.size, M.combine(M.empty))("a"), 1)
    deepStrictEqual(Function.pipe(M.empty, M.combine(String.size))("a"), 1)
    deepStrictEqual(M.combineAll([String.size, String.size])("a"), 2)
  })

  it("apply", () => {
    deepStrictEqual(Function.apply("a")(String.size), 1)
  })

  it("flip", () => {
    const f = (a: number) => (b: string) => a - b.length
    deepStrictEqual(Function.flip(f)("aaa")(2), -1)
  })

  it("compose", () => {
    deepStrictEqual(Function.pipe(String.size, Function.compose(double))("aaa"), 6)
  })

  it("unsafeCoerce", () => {
    deepStrictEqual(Function.unsafeCoerce, Function.identity)
  })

  it("constTrue", () => {
    deepStrictEqual(Function.constTrue(), true)
  })

  it("constFalse", () => {
    deepStrictEqual(Function.constFalse(), false)
  })

  it("constNull", () => {
    deepStrictEqual(Function.constNull(), null)
  })

  it("constUndefined", () => {
    deepStrictEqual(Function.constUndefined(), undefined)
  })

  it("constVoid", () => {
    deepStrictEqual(Function.constVoid(), undefined)
  })

  it("absurd", () => {
    assert.throws(() => Function.absurd<string>(null as any as never))
  })

  it("flow", () => {
    deepStrictEqual(Function.flow(f)(2), 3)
    deepStrictEqual(Function.flow(f, g)(2), 6)
    deepStrictEqual(Function.flow(f, g, f)(2), 7)
    deepStrictEqual(Function.flow(f, g, f, g)(2), 14)
    deepStrictEqual(Function.flow(f, g, f, g, f)(2), 15)
    deepStrictEqual(Function.flow(f, g, f, g, f, g)(2), 30)
    deepStrictEqual(Function.flow(f, g, f, g, f, g, f)(2), 31)
    deepStrictEqual(Function.flow(f, g, f, g, f, g, f, g)(2), 62)
    deepStrictEqual(Function.flow(f, g, f, g, f, g, f, g, f)(2), 63)
    // this is just to satisfy noImplicitReturns and 100% coverage
    deepStrictEqual((Function.flow as any)(...[f, g, f, g, f, g, f, g, f, g]), undefined)
  })

  it("tupled", () => {
    const f1 = (a: number): number => a * 2
    const f2 = (a: number, b: number): number => a + b
    const u1 = Function.tupled(f1)
    const u2 = Function.tupled(f2)
    deepStrictEqual(u1([1]), 2)
    deepStrictEqual(u2([1, 2]), 3)
  })

  it("untupled", () => {
    const f1 = (a: readonly [number]): number => a[0] * 2
    const f2 = (a: readonly [number, number]): number => a[0] + a[1]
    const u1 = Function.untupled(f1)
    const u2 = Function.untupled(f2)
    deepStrictEqual(u1(1), 2)
    deepStrictEqual(u2(1, 2), 3)
  })

  it("pipe", () => {
    deepStrictEqual(Function.pipe(2), 2)
    deepStrictEqual(Function.pipe(2, f), 3)
    deepStrictEqual(Function.pipe(2, f, g), 6)
    deepStrictEqual(Function.pipe(2, f, g, f), 7)
    deepStrictEqual(Function.pipe(2, f, g, f, g), 14)
    deepStrictEqual(Function.pipe(2, f, g, f, g, f), 15)
    deepStrictEqual(Function.pipe(2, f, g, f, g, f, g), 30)
    deepStrictEqual(Function.pipe(2, f, g, f, g, f, g, f), 31)
    deepStrictEqual(Function.pipe(2, f, g, f, g, f, g, f, g), 62)
    deepStrictEqual(Function.pipe(2, f, g, f, g, f, g, f, g, f), 63)
    deepStrictEqual(Function.pipe(2, f, g, f, g, f, g, f, g, f, g), 126)
    deepStrictEqual(Function.pipe(2, f, g, f, g, f, g, f, g, f, g, f), 127)
    deepStrictEqual(Function.pipe(2, f, g, f, g, f, g, f, g, f, g, f, g), 254)
    deepStrictEqual(Function.pipe(2, f, g, f, g, f, g, f, g, f, g, f, g, f), 255)
    deepStrictEqual(Function.pipe(2, f, g, f, g, f, g, f, g, f, g, f, g, f, g), 510)
    deepStrictEqual(Function.pipe(2, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f), 511)
    deepStrictEqual(Function.pipe(2, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f, g), 1022)
    deepStrictEqual(Function.pipe(2, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f), 1023)
    deepStrictEqual(Function.pipe(2, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f, g), 2046)
    deepStrictEqual(Function.pipe(2, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f), 2047)
    deepStrictEqual(
      (Function.pipe as any)(...[2, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f, g, f, g]),
      4094
    )
  })

  // TODO
  // it("getMonoid", () => {
  //   const getPredicateMonoidAll = Function.getMonoid(B.MonoidAll)
  //   const getPredicateMonoidAny = Function.getMonoid(B.MonoidAny)

  //   const isLessThan10 = (n: number) => n <= 10
  //   const isEven = (n: number) => n % 2 === 0

  //   deepStrictEqual(
  //     Function.pipe(
  //       [1, 2, 3, 40],
  //       RA.filter(combineAll(getPredicateMonoidAll<number>())([isLessThan10, isEven]))
  //     ),
  //     [2]
  //   )
  //   deepStrictEqual(
  //     Function.pipe(
  //       [1, 2, 3, 40, 41],
  //       RA.filter(combineAll(getPredicateMonoidAny<number>())([isLessThan10, isEven]))
  //     ),
  //     [1, 2, 3, 40]
  //   )
  // })
})
