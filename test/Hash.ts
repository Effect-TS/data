import * as R from "@fp-ts/core/Result"
import { evaluate } from "@fp-ts/data/Hash"
import * as L from "@fp-ts/data/List"
import { assertTrue } from "@fp-ts/data/test/util"

describe("Hash", () => {
  it("list", () => {
    assertTrue(evaluate(L.make(0, 1, 2)) === evaluate(L.make(0, 1, 2)))
  })
  it("array", () => {
    assertTrue(evaluate([0, 1, 2]) === evaluate([0, 1, 2]))
  })
  it("object", () => {
    assertTrue(evaluate({ a: 0, b: 1 }) === evaluate({ b: 1, a: 0 }))
  })
  it("result", () => {
    assertTrue(evaluate(R.succeed(1)) === evaluate(R.succeed(1)))
    assertTrue(evaluate(R.fail(1)) === evaluate(R.fail(1)))
    assertTrue(evaluate(R.fail(1)) !== evaluate(R.succeed(1)))
  })
})
