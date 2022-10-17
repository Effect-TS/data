import * as Function from "@fp-ts/data/Function"
import * as String from "@fp-ts/data/String"
import { deepStrictEqual, double } from "@fp-ts/data/test/util"
import * as assert from "assert"

const f = Function.increment
const g = double

describe.concurrent("Function", () => {
  it("flip", () => {
    const f = (a: number) => (b: string) => a - b.length
    deepStrictEqual(Function.flip(f)("aaa")(2), -1)
  })

  it("id", () => {
    const x = Function.id<number>()
    deepStrictEqual(x(1), 1)
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

  it("increment", () => {
    deepStrictEqual(Function.increment(2), 3)
  })

  it("decrement", () => {
    deepStrictEqual(Function.decrement(2), 1)
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
