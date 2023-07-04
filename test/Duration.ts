import * as D from "@effect/data/Duration"
import * as Equal from "@effect/data/Equal"
import { pipe } from "@effect/data/Function"
import { deepStrictEqual } from "@effect/data/test/util"
import { inspect } from "node:util"

describe.concurrent("Duration", () => {
  it("decodeDuration", () => {
    const millis100 = D.millis(100)
    expect(D.decodeDuration(millis100) === millis100).toEqual(true)

    expect(D.decodeDuration(100)).toEqual(millis100)

    expect(D.decodeDuration(10n)).toEqual(D.nanos(10n))

    expect(D.decodeDuration("10 nanos")).toEqual(D.nanos(10n))
    expect(D.decodeDuration("10 micros")).toEqual(D.micros(10n))
    expect(D.decodeDuration("10 millis")).toEqual(D.millis(10))
    expect(D.decodeDuration("10 seconds")).toEqual(D.seconds(10))
    expect(D.decodeDuration("10 minutes")).toEqual(D.minutes(10))
    expect(D.decodeDuration("10 hours")).toEqual(D.hours(10))
    expect(D.decodeDuration("10 days")).toEqual(D.days(10))
    expect(D.decodeDuration("10 weeks")).toEqual(D.weeks(10))

    expect(D.decodeDuration("1.5 seconds")).toEqual(D.seconds(1.5))

    expect(() => D.decodeDuration("1.5 secs" as any)).toThrowError(new Error("Invalid duration input"))
  })

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
  it("pipe", () => {
    expect(D.seconds(1).pipe(D.sum(D.seconds(1)))).toEqual(D.seconds(2))
  })

  it("isDuration", () => {
    expect(D.isDuration(D.millis(100))).toBe(true)
    expect(D.isDuration(null)).toBe(false)
  })

  it(`inspect`, () => {
    expect(inspect(D.millis(1000))).toEqual(inspect({ _tag: "Duration", millis: 1000, hrtime: [1000, 0] }))
  })

  it("zero", () => {
    expect(D.zero.millis).toBe(0)
  })

  it("infinity", () => {
    expect(D.infinity.millis).toBe(Infinity)
  })

  it("weeks", () => {
    expect(Equal.equals(D.weeks(1), D.days(7))).toBe(true)
    expect(Equal.equals(D.weeks(1), D.days(1))).toBe(false)
  })
})
