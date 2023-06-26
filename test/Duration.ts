import * as D from "@effect/data/Duration"
import { pipe } from "@effect/data/Function"
import { deepStrictEqual } from "@effect/data/test/util"

describe.concurrent("Duration", () => {
  it("Order", () => {
    deepStrictEqual(D.Order.compare(D.millis(1), D.millis(2)), -1)
    deepStrictEqual(D.Order.compare(D.millis(2), D.millis(1)), 1)
    deepStrictEqual(D.Order.compare(D.millis(2), D.millis(2)), 0)
  })

  it("Equivalence", () => {
    deepStrictEqual(D.Equivalence(D.millis(1), D.millis(1)), true)
    deepStrictEqual(D.Equivalence(D.millis(1), D.millis(2)), false)
    deepStrictEqual(D.Equivalence(D.millis(1), D.millis(2)), false)
  })

  it("max", () => {
    deepStrictEqual(D.max(D.millis(1), D.millis(2)), D.millis(2))
    deepStrictEqual(D.max(D.minutes(1), D.millis(2)), D.minutes(1))
  })

  it("min", () => {
    deepStrictEqual(D.min(D.millis(1), D.millis(2)), D.millis(1))
    deepStrictEqual(D.min(D.minutes(1), D.millis(2)), D.millis(2))
  })

  it("clamp", () => {
    deepStrictEqual(D.clamp(D.millis(1), D.millis(2), D.millis(3)), D.millis(2))
    deepStrictEqual(D.clamp(D.minutes(1.5), D.minutes(1), D.minutes(2)), D.minutes(1.5))
  })

  it("equals", () => {
    assert.isTrue(pipe(D.hours(1), D.equals(D.minutes(60))))
  })

  it("between", () => {
    assert.isTrue(D.between(D.hours(1), D.minutes(59), D.minutes(61)))
    assert.isTrue(D.between(D.minutes(1), D.seconds(59), D.seconds(61)))
  })

  it("times", () => {
    assert.isTrue(
      pipe(D.minutes(1), D.equals(pipe(D.seconds(1), D.times(60))))
    )
  })
  it("sum", () => {
    assert.isTrue(
      pipe(D.minutes(1), D.equals(pipe(D.seconds(30), D.sum(D.seconds(30)))))
    )
  })
  it(">", () => {
    assert.isTrue(pipe(D.seconds(30), D.greaterThan(D.seconds(20))))
    assert.isFalse(pipe(D.seconds(30), D.greaterThan(D.seconds(30))))
    assert.isFalse(pipe(D.seconds(30), D.greaterThan(D.minutes(1))))
  })
  it(">=", () => {
    assert.isTrue(pipe(D.seconds(30), D.greaterThanOrEqualTo(D.seconds(20))))
    assert.isTrue(pipe(D.seconds(30), D.greaterThanOrEqualTo(D.seconds(30))))
    assert.isFalse(pipe(D.seconds(30), D.greaterThanOrEqualTo(D.minutes(1))))
  })
  it("<", () => {
    assert.isTrue(pipe(D.seconds(20), D.lessThan(D.seconds(30))))
    assert.isFalse(pipe(D.seconds(30), D.lessThan(D.seconds(30))))
    assert.isFalse(pipe(D.minutes(1), D.lessThan(D.seconds(30))))
  })
  it("<=", () => {
    assert.isTrue(pipe(D.seconds(20), D.lessThanOrEqualTo(D.seconds(30))))
    assert.isTrue(pipe(D.seconds(30), D.lessThanOrEqualTo(D.seconds(30))))
    assert.isFalse(pipe(D.minutes(1), D.lessThanOrEqualTo(D.seconds(30))))
  })
  it("toString", () => {
    expect(String(D.seconds(2))).toEqual("Duration(2000)")
  })
  it("toJSON", () => {
    expect(JSON.stringify(D.seconds(2))).toEqual(
      JSON.stringify({ _tag: "Duration", millis: 2000 })
    )
  })
})
