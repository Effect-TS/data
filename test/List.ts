import { pipe } from "@fp-ts/core/Function"
import { deepEqual } from "@fp-ts/data/DeepEqual"
import * as L from "@fp-ts/data/List"
import * as LB from "@fp-ts/data/MutableListBuilder"
import { assertTrue } from "@fp-ts/data/test/util"

describe("List", () => {
  it("constructs a list", () => {
    assertTrue(deepEqual(Array.from(L.make(0, 1, 2, 3)), [0, 1, 2, 3]))
  })

  it("constructs a list via builder", () => {
    const builder = LB.make<number>()
    for (let i = 0; i <= 3; i++) {
      pipe(builder, LB.append(i))
    }
    assertTrue(pipe(builder, LB.toList, deepEqual(L.make(0, 1, 2, 3))))
  })
})
