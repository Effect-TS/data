import { pipe } from "@fp-ts/data/Function"
import * as _ from "@fp-ts/data/Predicate"
import { deepStrictEqual } from "@fp-ts/data/test/util"

const isPositive: _.Predicate<number> = (n) => n > 0
const isNegative: _.Predicate<number> = (n) => n < 0
const lt2: _.Predicate<number> = (n) => n < 2

describe("Predicate", () => {
  it("contramap", () => {
    type A = {
      readonly a: number
    }
    const predicate = pipe(
      isPositive,
      _.contramap((a: A) => a.a)
    )
    deepStrictEqual(predicate({ a: -1 }), false)
    deepStrictEqual(predicate({ a: 0 }), false)
    deepStrictEqual(predicate({ a: 1 }), true)
  })

  it("not", () => {
    const predicate = _.not(isPositive)
    deepStrictEqual(predicate(1), false)
    deepStrictEqual(predicate(0), true)
    deepStrictEqual(predicate(-1), true)
  })

  it("getMonoidAny", () => {
    const M = _.getMonoidAny<number>()
    const predicate = pipe(isPositive, M.combine(isNegative))
    deepStrictEqual(predicate(0), false)
    deepStrictEqual(predicate(-1), true)
    deepStrictEqual(predicate(1), true)
  })

  it("getMonoidAll", () => {
    const M = _.getMonoidAll<number>()
    const predicate = pipe(isPositive, M.combine(lt2))
    deepStrictEqual(predicate(0), false)
    deepStrictEqual(predicate(-2), false)
    deepStrictEqual(predicate(1), true)
  })

  it("any", () => {
    const predicate = _.any([isPositive, isNegative])
    deepStrictEqual(predicate(0), false)
    deepStrictEqual(predicate(-1), true)
    deepStrictEqual(predicate(1), true)
  })

  it("all", () => {
    const predicate = _.all([isPositive, lt2])
    deepStrictEqual(predicate(0), false)
    deepStrictEqual(predicate(-2), false)
    deepStrictEqual(predicate(1), true)
  })
})
