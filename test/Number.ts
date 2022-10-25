import { pipe } from "@fp-ts/data/Function"
import * as Number from "@fp-ts/data/Number"
import { deepStrictEqual } from "@fp-ts/data/test/util"

describe.concurrent("Number", () => {
  it("sum", () => {
    deepStrictEqual(Number.sum(1)(2), 3)
  })

  it("sub", () => {
    deepStrictEqual(Number.sub(1)(2), 1)
  })

  it("multiply", () => {
    deepStrictEqual(Number.multiply(3)(2), 6)
  })

  it("increment", () => {
    deepStrictEqual(Number.increment(2), 3)
  })

  it("decrement", () => {
    deepStrictEqual(Number.decrement(2), 1)
  })

  it("Order", () => {
    deepStrictEqual(pipe(1, Number.Order.compare(2)), -1)
    deepStrictEqual(pipe(2, Number.Order.compare(1)), 1)
    deepStrictEqual(pipe(2, Number.Order.compare(2)), 0)
  })

  it("SemigroupSum", () => {
    deepStrictEqual(pipe(2, Number.SemigroupSum.combine(3)), 5)
  })

  it("MonoidSum", () => {
    deepStrictEqual(Number.MonoidSum.combineAll([1, 2, 3]), 6)
  })

  it("SemigroupMultiply", () => {
    deepStrictEqual(pipe(2, Number.SemigroupMultiply.combine(3)), 6)
  })

  it("MonoidMultiply", () => {
    deepStrictEqual(Number.MonoidMultiply.combineAll([2, 3, 4]), 24)
  })
})
