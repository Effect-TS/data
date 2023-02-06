import * as D from "@effect/data/Duration"
import { pipe } from "@fp-ts/core/Function"

describe.concurrent("Duration", () => {
  it("equals", () => {
    assert.isTrue(pipe(D.hours(1), D.equals(D.minutes(60))))
  })
  it("times", () => {
    assert.isTrue(
      pipe(D.minutes(1), D.equals(pipe(D.seconds(1), D.times(60))))
    )
  })
  it("add", () => {
    assert.isTrue(
      pipe(D.minutes(1), D.equals(pipe(D.seconds(30), D.add(D.seconds(30)))))
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
})
