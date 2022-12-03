import * as E from "@fp-ts/data/Either"
import { equals } from "@fp-ts/data/Equal"
import { pipe } from "@fp-ts/data/Function"
import * as L from "@fp-ts/data/List"
import * as LB from "@fp-ts/data/mutable/MutableListBuilder"
import * as R from "@fp-ts/data/Record"
import { assertFalse, assertTrue } from "@fp-ts/data/test/util"

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
  it("Record", () => {
    assertTrue(equals(
      R.record({ hello: "world", foo: "bar" }),
      R.record({ foo: "bar", hello: "world" })
    ))
    assertFalse(equals(
      { hello: "world", foo: "bar" },
      { hello: "world", foo: "bar" }
    ))
    assertTrue(equals(
      R.record({ a: 0, b: 1 }),
      pipe(R.record({ a: 0, b: 1, c: 2 }), R.omit("c"))
    ))
    assertTrue(equals(
      R.record({ a: 0, b: 1 }),
      pipe(R.record({ a: 0, b: 1, c: 2 }), R.pick("a", "b"))
    ))
    assertTrue(equals(
      R.record({ a: 0, b: 1 }),
      pipe(R.record({ a: 0 }), R.spread(R.record({ b: 1 })))
    ))
  })
})
