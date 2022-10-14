import * as R from "@fp-ts/core/Result"
import { equals } from "@fp-ts/data/Equal"
import * as L from "@fp-ts/data/List"
import * as LB from "@fp-ts/data/MutableListBuilder"
import { assertTrue } from "@fp-ts/data/test/util"

describe("Equal", () => {
  it("List", () => {
    assertTrue(equals(L.make(0, 1, 2), L.make(0, 1, 2)))
  })
  it("ListBuilder", () => {
    assertTrue(!equals(LB.empty(), LB.empty()))
  })
  it("Result", () => {
    assertTrue(equals(R.succeed(1), R.succeed(1)))
    assertTrue(!equals(R.succeed(1), R.succeed(2)))
    assertTrue(!equals(R.succeed(1), R.fail(2)))
    assertTrue(equals(R.fail(1), R.fail(1)))
  })
})
