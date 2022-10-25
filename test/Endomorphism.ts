import * as _ from "@fp-ts/data/Endomorphism"
import { pipe } from "@fp-ts/data/Function"
import { decrement, increment } from "@fp-ts/data/Number"
import { deepStrictEqual, double } from "@fp-ts/data/test/util"

describe.concurrent("Endomorphism", () => {
  it("instances and derived exports", () => {
    expect(_.compose).exist
  })

  it("getSemigroup", () => {
    const S = _.getSemigroup<number>()
    deepStrictEqual(pipe(increment, S.combine(double))(2), 6)
    deepStrictEqual(pipe(increment, S.combineMany([]))(2), 3)
    deepStrictEqual(pipe(increment, S.combineMany([double, decrement]))(2), 5)
  })

  it("getMonoid", () => {
    const M = _.getMonoid<number>()
    deepStrictEqual(pipe(M.empty, M.combine(double))(2), 4)
    deepStrictEqual(pipe(double, M.combine(M.empty))(2), 4)
    deepStrictEqual(M.combineAll([increment, double, decrement])(2), 5)
  })
})
