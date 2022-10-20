import * as E from "@fp-ts/data/Either"
import { equals } from "@fp-ts/data/Equal"
import * as L from "@fp-ts/data/List"
import * as LB from "@fp-ts/data/mutable/MutableListBuilder"
import { assertTrue } from "@fp-ts/data/test/util"

describe.concurrent("Equal", () => {
  it("List", () => {
    assertTrue(equals(L.make(0, 1, 2), L.make(0, 1, 2)))
  })
  it("ListBuilder", () => {
    assertTrue(!equals(LB.empty(), LB.empty()))
  })
  it("Result", () => {
    assertTrue(equals(E.right(1), E.right(1)))
    assertTrue(!equals(E.right(1), E.right(2)))
    assertTrue(!equals(E.right(1), E.left(2)))
    assertTrue(equals(E.left(1), E.left(1)))
  })
})
