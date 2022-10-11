import { deepHash } from "@fp-ts/data/DeepHash"
import * as L from "@fp-ts/data/List"
import { strictEqual } from "@fp-ts/data/test/util"

describe("DeepHash", () => {
  it("list", () => {
    strictEqual(deepHash(L.make(0, 1, 2)), deepHash(L.make(0, 1, 2)))
  })
  it("array", () => {
    strictEqual(deepHash([0, 1, 2]), deepHash([0, 1, 2]))
  })
  it("object", () => {
    strictEqual(deepHash({ a: 0, b: 1 }), deepHash({ b: 1, a: 0 }))
  })
})
