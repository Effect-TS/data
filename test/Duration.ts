import * as D from "@effect/data/Duration"
import { pipe } from "@effect/data/Function"
import { deepStrictEqual } from "@effect/data/test/util"

describe.concurrent("Duration", () => {
  it("exports", () => {
    expect(D.Bounded).exist
    expect(D.SemigroupSum).exist
    expect(D.MonoidSum).exist
    expect(D.SemigroupMin).exist
    expect(D.MonoidMin).exist
    expect(D.SemigroupMax).exist
    expect(D.MonoidMax).exist
    expect(D.Order).exist
    expect(D.Equivalence).exist
    expect(D.sum).exist
    expect(D.sumAll).exist
    expect(D.times).exist
    expect(D.subtract).exist
    expect(D.zero).exist
    expect(D.millis).exist
    expect(D.seconds).exist
    expect(D.minutes).exist
    expect(D.hours).exist
    expect(D.days).exist
    expect(D.weeks).exist
    expect(D.infinity).exist
    expect(D.between).exist
    expect(D.lessThan).exist
    expect(D.lessThanOrEqualTo).exist
    expect(D.greaterThan).exist
    expect(D.greaterThanOrEqualTo).exist
    expect(D.clamp).exist
    expect(D.max).exist
    expect(D.min).exist
  })

  it("Order", () => {
    deepStrictEqual(D.Order.compare(D.millis(1), D.millis(2)), -1)
    deepStrictEqual(D.Order.compare(D.millis(2), D.millis(1)), 1)
    deepStrictEqual(D.Order.compare(D.millis(2), D.millis(2)), 0)
  })

  it("Bounded", () => {
    expect(D.Bounded.maxBound).toEqual(D.infinity)
    expect(D.Bounded.minBound).toEqual(D.zero)
  })

  it("Equivalence", () => {
    deepStrictEqual(D.Equivalence(D.millis(1), D.millis(1)), true)
    deepStrictEqual(D.Equivalence(D.millis(1), D.millis(2)), false)
    deepStrictEqual(D.Equivalence(D.millis(1), D.millis(2)), false)
  })

  it("SemigroupMax", () => {
    deepStrictEqual(D.SemigroupMax.combine(D.millis(1), D.millis(2)), D.millis(2))
    deepStrictEqual(D.SemigroupMax.combine(D.minutes(1), D.millis(2)), D.minutes(1))
  })

  it("MonoidMax", () => {
    deepStrictEqual(D.MonoidMax.combine(D.millis(1), D.millis(2)), D.millis(2))
    deepStrictEqual(D.MonoidMax.combine(D.minutes(1), D.MonoidMax.empty), D.minutes(1))
  })

  it("SemigroupMin", () => {
    deepStrictEqual(D.SemigroupMin.combine(D.millis(1), D.millis(2)), D.millis(1))
    deepStrictEqual(D.SemigroupMin.combine(D.minutes(1), D.millis(2)), D.millis(2))
  })

  it("MonoidMin", () => {
    deepStrictEqual(D.MonoidMin.combine(D.millis(1), D.millis(2)), D.millis(1))
    deepStrictEqual(D.MonoidMin.combine(D.minutes(1), D.MonoidMin.empty), D.minutes(1))
  })

  it("SemigroupSum", () => {
    deepStrictEqual(D.SemigroupSum.combine(D.seconds(30), D.seconds(30)), D.minutes(1))
    deepStrictEqual(D.SemigroupSum.combine(D.millis(999), D.millis(1)), D.seconds(1))
  })

  it("MonoidSum", () => {
    deepStrictEqual(D.MonoidSum.combine(D.seconds(30), D.seconds(30)), D.minutes(1))
    deepStrictEqual(D.MonoidSum.combine(D.minutes(1), D.MonoidSum.empty), D.minutes(1))
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
  it("sumAll", () => {
    assert.isTrue(
      D.equals(
        D.sumAll([D.seconds(30), D.seconds(15), D.seconds(15)]),
        D.minutes(1)
      )
    )
  })
  it(">", () => {
    assert.isTrue(pipe(D.seconds(30), D.greaterThan(D.seconds(20))))
    assert.isFalse(pipe(D.seconds(30), D.greaterThan(D.seconds(30))))
    assert.isFalse(pipe(D.seconds(30), D.greaterThan(D.minutes(1))))
  })
  it(">/ Infinity", () => {
    assert.isTrue(pipe(D.infinity, D.greaterThan(D.seconds(20))))
    assert.isFalse(pipe(D.seconds(-Infinity), D.greaterThan(D.infinity)))
    assert.isFalse(pipe(D.nanos(1n), D.greaterThan(D.infinity)))
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
      JSON.stringify({ _tag: "Duration", millis: 2000, hrtime: [2000, 0] })
    )
  })
  it("toJSON/ millis", () => {
    expect(JSON.stringify(D.millis(1.5))).toEqual(
      JSON.stringify({ _tag: "Duration", millis: 1.5, hrtime: [1, 500000] })
    )
  })
  it("toJSON/ nanos", () => {
    expect(JSON.stringify(D.nanos(5n))).toEqual(
      JSON.stringify({ _tag: "Duration", millis: 0.000005, hrtime: [0, 5] })
    )
  })
  it("sum/ Infinity", () => {
    expect(D.sum(D.seconds(1), D.infinity)).toEqual(D.infinity)
  })
  it("subtract/ Infinity", () => {
    expect(D.subtract(D.seconds(1), D.infinity)).toEqual(D.nanos(-Infinity as any))
  })
})
