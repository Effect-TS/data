import * as Endomorphism from "@fp-ts/data/Endomorphism"
import { pipe } from "@fp-ts/data/Function"
import { deepStrictEqual, double } from "@fp-ts/data/test/util"

describe.concurrent("Endomorphism", () => {
  it("getMonoid", () => {
    const M = Endomorphism.getMonoid<number>()
    const inc = (n: number) => n + 1
    const f = pipe(inc, M.combine(double))
    deepStrictEqual(f(3), 8)
  })
})
