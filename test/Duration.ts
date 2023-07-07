import * as D from "@effect/data/Duration"
import * as Equal from "@effect/data/Equal"
import { pipe } from "@effect/data/Function"
import * as Option from "@effect/data/Option"
import { deepStrictEqual } from "@effect/data/test/util"
import { inspect } from "node:util"

describe.concurrent("Duration", () => {
  it("decode", () => {
    const millis100 = D.millis(100)
    expect(D.decode(millis100) === millis100).toEqual(true)

    expect(D.decode(100)).toEqual(millis100)

    expect(D.decode(10n)).toEqual(D.nanos(10n))

    expect(D.decode("10 nanos")).toEqual(D.nanos(10n))
    expect(D.decode("10 micros")).toEqual(D.micros(10n))
    expect(D.decode("10 millis")).toEqual(D.millis(10))
    expect(D.decode("10 seconds")).toEqual(D.seconds(10))
    expect(D.decode("10 minutes")).toEqual(D.minutes(10))
    expect(D.decode("10 hours")).toEqual(D.hours(10))
    expect(D.decode("10 days")).toEqual(D.days(10))
    expect(D.decode("10 weeks")).toEqual(D.weeks(10))

    expect(D.decode("1.5 seconds")).toEqual(D.seconds(1.5))
    expect(D.decode("-1.5 seconds")).toEqual(D.zero)

    expect(() => D.decode("1.5 secs" as any)).toThrowError(new Error("Invalid duration input"))
  })

  it("Order", () => {
    deepStrictEqual(D.Order(D.millis(1), D.millis(2)), -1)
    deepStrictEqual(D.Order(D.millis(2), D.millis(1)), 1)
    deepStrictEqual(D.Order(D.millis(2), D.millis(2)), 0)

    deepStrictEqual(D.Order(D.nanos(1n), D.nanos(2n)), -1)
    deepStrictEqual(D.Order(D.nanos(2n), D.nanos(1n)), 1)
    deepStrictEqual(D.Order(D.nanos(2n), D.nanos(2n)), 0)
  })

  it("Equivalence", () => {
    deepStrictEqual(D.Equivalence(D.millis(1), D.millis(1)), true)
    deepStrictEqual(D.Equivalence(D.millis(1), D.millis(2)), false)
    deepStrictEqual(D.Equivalence(D.millis(1), D.millis(2)), false)

    deepStrictEqual(D.Equivalence(D.nanos(1n), D.nanos(1n)), true)
    deepStrictEqual(D.Equivalence(D.nanos(1n), D.nanos(2n)), false)
    deepStrictEqual(D.Equivalence(D.nanos(1n), D.nanos(2n)), false)
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
    expect(D.times(D.seconds(1), 60)).toEqual(D.minutes(1))
    expect(D.times(D.nanos(2n), 10)).toEqual(D.nanos(20n))
    expect(D.times(D.seconds(Infinity), 60)).toEqual(D.seconds(Infinity))
  })

  it("sum", () => {
    expect(D.sum(D.seconds(30), D.seconds(30))).toEqual(D.minutes(1))
    expect(D.sum(D.nanos(30n), D.nanos(30n))).toEqual(D.nanos(60n))
    expect(D.sum(D.seconds(Infinity), D.seconds(30))).toEqual(D.seconds(Infinity))
    expect(D.sum(D.seconds(30), D.seconds(Infinity))).toEqual(D.seconds(Infinity))
  })

  it(">", () => {
    assert.isTrue(pipe(D.seconds(30), D.greaterThan(D.seconds(20))))
    assert.isFalse(pipe(D.seconds(30), D.greaterThan(D.seconds(30))))
    assert.isFalse(pipe(D.seconds(30), D.greaterThan(D.seconds(60))))

    assert.isTrue(pipe(D.nanos(30n), D.greaterThan(D.nanos(20n))))
    assert.isFalse(pipe(D.nanos(30n), D.greaterThan(D.nanos(30n))))
    assert.isFalse(pipe(D.nanos(30n), D.greaterThan(D.nanos(60n))))

    assert.isTrue(pipe(D.millis(1), D.greaterThan(D.nanos(1n))))
  })

  it(">/ Infinity", () => {
    assert.isTrue(pipe(D.infinity, D.greaterThan(D.seconds(20))))
    assert.isFalse(pipe(D.seconds(-Infinity), D.greaterThan(D.infinity)))
    assert.isFalse(pipe(D.nanos(1n), D.greaterThan(D.infinity)))
  })

  it(">=", () => {
    assert.isTrue(pipe(D.seconds(30), D.greaterThanOrEqualTo(D.seconds(20))))
    assert.isTrue(pipe(D.seconds(30), D.greaterThanOrEqualTo(D.seconds(30))))
    assert.isFalse(pipe(D.seconds(30), D.greaterThanOrEqualTo(D.seconds(60))))

    assert.isTrue(pipe(D.nanos(30n), D.greaterThanOrEqualTo(D.nanos(20n))))
    assert.isTrue(pipe(D.nanos(30n), D.greaterThanOrEqualTo(D.nanos(30n))))
    assert.isFalse(pipe(D.nanos(30n), D.greaterThanOrEqualTo(D.nanos(60n))))
  })

  it("<", () => {
    assert.isTrue(pipe(D.seconds(20), D.lessThan(D.seconds(30))))
    assert.isFalse(pipe(D.seconds(30), D.lessThan(D.seconds(30))))
    assert.isFalse(pipe(D.seconds(60), D.lessThan(D.seconds(30))))

    assert.isTrue(pipe(D.nanos(20n), D.lessThan(D.nanos(30n))))
    assert.isFalse(pipe(D.nanos(30n), D.lessThan(D.nanos(30n))))
    assert.isFalse(pipe(D.nanos(60n), D.lessThan(D.nanos(30n))))

    assert.isTrue(pipe(D.nanos(1n), D.lessThan(D.millis(1))))
  })

  it("<=", () => {
    assert.isTrue(pipe(D.seconds(20), D.lessThanOrEqualTo(D.seconds(30))))
    assert.isTrue(pipe(D.seconds(30), D.lessThanOrEqualTo(D.seconds(30))))
    assert.isFalse(pipe(D.seconds(60), D.lessThanOrEqualTo(D.seconds(30))))

    assert.isTrue(pipe(D.nanos(20n), D.lessThanOrEqualTo(D.nanos(30n))))
    assert.isTrue(pipe(D.nanos(30n), D.lessThanOrEqualTo(D.nanos(30n))))
    assert.isFalse(pipe(D.nanos(60n), D.lessThanOrEqualTo(D.nanos(30n))))
  })

  it("toString", () => {
    expect(String(D.seconds(2))).toEqual(`Duration("2000 millis")`)
    expect(String(D.nanos(10n))).toEqual(`Duration("10 nanos")`)
    expect(String(D.millis(Infinity))).toEqual("Duration(Infinity)")
  })

  it("toJSON", () => {
    expect(JSON.stringify(D.seconds(2))).toEqual(
      JSON.stringify({ _tag: "Duration", value: { _tag: "Millis", millis: 2000 } })
    )
  })

  it("toJSON/ non-integer millis", () => {
    expect(JSON.stringify(D.millis(1.5))).toEqual(
      JSON.stringify({ _tag: "Duration", value: { _tag: "Nanos", hrtime: [0, 1_500_000] } })
    )
  })

  it("toJSON/ nanos", () => {
    expect(JSON.stringify(D.nanos(5n))).toEqual(
      JSON.stringify({ _tag: "Duration", value: { _tag: "Nanos", hrtime: [0, 5] } })
    )
  })

  it("toJSON/ infinity", () => {
    expect(JSON.stringify(D.infinity)).toEqual(
      JSON.stringify({ _tag: "Duration", value: { _tag: "Infinity" } })
    )
  })

  it("sum/ Infinity", () => {
    expect(D.sum(D.seconds(1), D.infinity)).toEqual(D.infinity)
  })

  it(".pipe()", () => {
    expect(D.seconds(1).pipe(D.sum(D.seconds(1)))).toEqual(D.seconds(2))
  })

  it("isDuration", () => {
    expect(D.isDuration(D.millis(100))).toBe(true)
    expect(D.isDuration(null)).toBe(false)
  })

  it(`inspect`, () => {
    expect(inspect(D.millis(1000))).toEqual(inspect({ _tag: "Duration", value: { _tag: "Millis", millis: 1000 } }))
  })

  it("zero", () => {
    expect(D.zero.value).toEqual({ _tag: "Millis", millis: 0 })
  })

  it("infinity", () => {
    expect(D.infinity.value).toEqual({ _tag: "Infinity" })
  })

  it("weeks", () => {
    expect(Equal.equals(D.weeks(1), D.days(7))).toBe(true)
    expect(Equal.equals(D.weeks(1), D.days(1))).toBe(false)
  })

  it("toMillis", () => {
    expect(D.millis(1).pipe(D.toMillis)).toBe(1)
    expect(D.nanos(1n).pipe(D.toMillis)).toBe(0.000001)
    expect(D.infinity.pipe(D.toMillis)).toBe(Infinity)
  })

  it("toNanos", () => {
    expect(D.nanos(1n).pipe(D.toNanos)).toEqual(Option.some(1n))
    expect(D.infinity.pipe(D.toNanos)).toEqual(Option.none())
    expect(D.millis(1.0005).pipe(D.toNanos)).toEqual(Option.some(1_000_500n))
    expect(D.millis(100).pipe(D.toNanos)).toEqual(Option.some(100_000_000n))
  })

  it("unsafeToNanos", () => {
    expect(D.nanos(1n).pipe(D.unsafeToNanos)).toBe(1n)
    expect(() => D.infinity.pipe(D.unsafeToNanos)).toThrow()
    expect(D.millis(1.0005).pipe(D.unsafeToNanos)).toBe(1_000_500n)
    expect(D.millis(100).pipe(D.unsafeToNanos)).toEqual(100_000_000n)
  })

  it("toHrTime", () => {
    expect(D.millis(1).pipe(D.toHrTime)).toEqual([0, 1_000_000])
    expect(D.nanos(1n).pipe(D.toHrTime)).toEqual([0, 1])
    expect(D.nanos(1_000_000_001n).pipe(D.toHrTime)).toEqual([1, 1])
    expect(D.millis(1001).pipe(D.toHrTime)).toEqual([1, 1_000_000])
    expect(D.infinity.pipe(D.toHrTime)).toEqual([Infinity, 0])
  })

  it("floor is 0", () => {
    expect(D.millis(-1)).toEqual(D.zero)
    expect(D.nanos(-1n)).toEqual(D.zero)
  })

  it("match", () => {
    const match = D.match({
      onMillis: () => "millis",
      onNanos: () => "nanos"
    })
    expect(match(D.decode("100 millis"))).toEqual("millis")
    expect(match(D.decode("10 nanos"))).toEqual("nanos")
    expect(match(D.decode(Infinity))).toEqual("millis")
  })
})
