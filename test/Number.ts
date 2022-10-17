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

  it("sumAll", () => {
    deepStrictEqual(Number.sumAll([1, 2, 3]), 6)
  })

  it("multiplyAll", () => {
    deepStrictEqual(Number.multiplyAll([2, 3, 4]), 24)
  })

  it("Ord", () => {
    deepStrictEqual(pipe(1, Number.Ord.compare(2)), -1)
    deepStrictEqual(pipe(2, Number.Ord.compare(1)), 1)
    deepStrictEqual(pipe(2, Number.Ord.compare(2)), 0)
  })

  it("SemigroupMultiply", () => {
    deepStrictEqual(pipe(2, Number.SemigroupMultiply.combine(3)), 6)
  })

  it("SemigroupSum", () => {
    deepStrictEqual(pipe(2, Number.SemigroupSum.combine(3)), 5)
  })
})
