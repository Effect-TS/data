import * as R from "@fp-ts/core/Result"
import { deepHash } from "@fp-ts/data/DeepHash"
import * as L from "@fp-ts/data/List"
import { assertTrue } from "@fp-ts/data/test/util"

describe("DeepHash", () => {
  it("list", () => {
    assertTrue(deepHash(L.make(0, 1, 2)) === deepHash(L.make(0, 1, 2)))
  })
  it("array", () => {
    assertTrue(deepHash([0, 1, 2]) === deepHash([0, 1, 2]))
  })
  it("object", () => {
    assertTrue(deepHash({ a: 0, b: 1 }) === deepHash({ b: 1, a: 0 }))
  })
  it("result", () => {
    assertTrue(deepHash(R.succeed(1)) === deepHash(R.succeed(1)))
    assertTrue(deepHash(R.fail(1)) === deepHash(R.fail(1)))
    assertTrue(deepHash(R.fail(1)) !== deepHash(R.succeed(1)))
  })
})
