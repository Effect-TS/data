import * as E from "@fp-ts/data/Either"
import * as Equal from "@fp-ts/data/Equal"
import * as L from "@fp-ts/data/List"
import * as LB from "@fp-ts/data/mutable/MutableListBuilder"
import { assertFalse, assertTrue } from "@fp-ts/data/test/util"
import * as fc from "fast-check"

describe.concurrent("Equal", () => {
  it("List", () => {
    assertTrue(Equal.equals(L.make(0, 1, 2), L.make(0, 1, 2)))
  })
  it("ListBuilder", () => {
    assertTrue(!Equal.equals(LB.empty(), LB.empty()))
  })
  it("Result", () => {
    assertTrue(Equal.equals(E.right(1), E.right(1)))
    assertTrue(!Equal.equals(E.right(1), E.right(2)))
    assertTrue(!Equal.equals(E.right(1), E.left(2)))
    assertTrue(Equal.equals(E.left(1), E.left(1)))
  })
  it("doesn't blow on circular structures", () => {
    const x = {
      a: 0
    }
    x["x"] = x
    const y = {
      a: 0
    }
    y["x"] = y
    const z = {
      a: 0
    }
    z["x"] = z
    z[Symbol()] = z
    assertTrue(Equal.equals(x, y))
    assertTrue(Equal.equals(x, x))
    assertFalse(Equal.equals(x, z))
    assertTrue(Equal.equals(Equal.hash(x), Equal.hash(x)))
  })
  it("class by instance", () => {
    class Hello {
      constructor(readonly value: number) {
        Equal.considerByRef(this)
      }
    }
    assertFalse(Equal.equals(new Hello(0), new Hello(0)))
  })
  it("class by instance via prototype", () => {
    class Hello {
      constructor(readonly value: number) {}
    }

    Equal.considerProtoByRef(Hello.prototype)

    assertFalse(Equal.equals(new Hello(0), new Hello(0)))
  })
  it("class by value", () => {
    class Hello {
      constructor(readonly value: number) {}
    }
    assertTrue(Equal.equals(new Hello(0), new Hello(0)))
    assertFalse(Equal.equals(new Hello(0), new Hello(1)))
  })
  it("doesn't crash", () => {
    fc.assert(
      fc.property(fc.anything(), fc.anything(), (a, b) => {
        Equal.equals(a, b)
      }),
      { numRuns: 100_000 }
    )
  })
  it("set/map", () => {
    assertFalse(Equal.equals(new Set([0]), new Set()))
    assertFalse(Equal.equals(new Map([[0, 1]]), new Map()))
  })
})
