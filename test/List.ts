import { equals } from "@fp-ts/data/Equal"
import { pipe } from "@fp-ts/data/Function"
import * as L from "@fp-ts/data/List"
import * as LB from "@fp-ts/data/mutable/MutableListBuilder"
import * as Number from "@fp-ts/data/Number"
import { assertTrue } from "@fp-ts/data/test/util"

describe.concurrent("List", () => {
  it("constructs a list", () => {
    assertTrue(equals(Array.from(L.List(0, 1, 2, 3)), [0, 1, 2, 3]))
  })

  it("constructs a list via builder", () => {
    const builder = LB.empty<number>()
    for (let i = 0; i <= 3; i++) {
      pipe(builder, LB.append(i))
    }
    assertTrue(pipe(builder, LB.toList, equals(L.List(0, 1, 2, 3))))
  })

  it("sort", () => {
    expect(pipe(L.List(0, 1, 3, 2), L.sort(Number.Order))).toStrictEqual(L.List(0, 1, 2, 3))
  })
})
