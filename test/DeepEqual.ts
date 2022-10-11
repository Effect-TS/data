import * as R from "@fp-ts/core/Result"
import { deepEqual } from "@fp-ts/data/DeepEqual"
import * as L from "@fp-ts/data/List"
import { assertTrue } from "@fp-ts/data/test/util"

describe("DeepEqual", () => {
  it("List", () => {
    assertTrue(deepEqual(L.make(0, 1, 2), L.make(0, 1, 2)))
  })
  it("ListBuilder", () => {
    assertTrue(!deepEqual(L.builder(), L.builder()))
  })
  it("Result", () => {
    assertTrue(deepEqual(R.succeed(1), R.succeed(1)))
    assertTrue(!deepEqual(R.succeed(1), R.succeed(2)))
    assertTrue(!deepEqual(R.succeed(1), R.fail(2)))
    assertTrue(deepEqual(R.fail(1), R.fail(1)))
  })
})
