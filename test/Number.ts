import { pipe } from "@effect/data/Function"
import * as Number from "@effect/data/Number"
import { deepStrictEqual } from "@effect/data/test/util"

describe.concurrent("Number", () => {
  it("isNumber", () => {
    expect(Number.isNumber(1)).toEqual(true)
    expect(Number.isNumber("a")).toEqual(false)
    expect(Number.isNumber(true)).toEqual(false)
  })

  it("sum", () => {
    deepStrictEqual(pipe(1, Number.sum(2)), 3)
  })

  it("multiply", () => {
    deepStrictEqual(pipe(2, Number.multiply(3)), 6)
  })

  it("subtract", () => {
    deepStrictEqual(pipe(3, Number.subtract(1)), 2)
  })

  it("divide", () => {
    deepStrictEqual(pipe(6, Number.divide(2)), 3)
  })

  it("increment", () => {
    deepStrictEqual(Number.increment(2), 3)
  })

  it("decrement", () => {
    deepStrictEqual(Number.decrement(2), 1)
  })

  it("Equivalence", () => {
    expect(Number.Equivalence(1, 1)).toBe(true)
    expect(Number.Equivalence(1, 2)).toBe(false)
  })

  it("Order", () => {
    deepStrictEqual(Number.Order.compare(1, 2), -1)
    deepStrictEqual(Number.Order.compare(2, 1), 1)
    deepStrictEqual(Number.Order.compare(2, 2), 0)
  })

  it("sign", () => {
    deepStrictEqual(Number.sign(0), 0)
    deepStrictEqual(Number.sign(0.0), 0)
    deepStrictEqual(Number.sign(-0.1), -1)
    deepStrictEqual(Number.sign(-10), -1)
    deepStrictEqual(Number.sign(10), 1)
    deepStrictEqual(Number.sign(0.1), 1)
  })

  it("remainder", () => {
    assert.deepStrictEqual(Number.remainder(2, 2), 0)
    assert.deepStrictEqual(Number.remainder(3, 2), 1)
    assert.deepStrictEqual(Number.remainder(4, 2), 0)
    assert.deepStrictEqual(Number.remainder(2.5, 2), 0.5)
    assert.deepStrictEqual(Number.remainder(-2, 2), -0)
    assert.deepStrictEqual(Number.remainder(-3, 2), -1)
    assert.deepStrictEqual(Number.remainder(-4, 2), -0)
    assert.deepStrictEqual(Number.remainder(-2.8, -.2), -0)
    assert.deepStrictEqual(Number.remainder(-2, -.2), -0)
    assert.deepStrictEqual(Number.remainder(-1.5, -.2), -0.1)
    assert.deepStrictEqual(Number.remainder(0, -.2), 0)
    assert.deepStrictEqual(Number.remainder(1, -.2), 0)
    assert.deepStrictEqual(Number.remainder(2.6, -.2), 0)
    assert.deepStrictEqual(Number.remainder(3.1, -.2), 0.1)
  })

  it("multiplyAll", () => {
    expect(Number.multiplyAll([2, 3, 4])).toEqual(24)
  })
})
