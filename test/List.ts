import * as L from "@fp-ts/data/List"
import { deepStrictEqual } from "@fp-ts/data/test/util"

describe("List", () => {
  it("constructs a list", () => {
    deepStrictEqual(Array.from(L.make(0, 1, 2, 3)), [0, 1, 2, 3])
  })

  it("constructs a list via builder", () => {
    const builder = L.builder<number>()
    for (let i = 0; i <= 3; i++) {
      builder.append(i)
    }
    deepStrictEqual(Array.from(builder.build()), [0, 1, 2, 3])
  })
})
