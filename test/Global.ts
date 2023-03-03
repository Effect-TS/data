import * as G from "@effect/data/Global"

const a = G.globalValue("id", () => ({}))
const b = G.globalValue("id", () => ({}))

describe("Global", () => {
  it("should give the same value when invoked with the same id", () => {
    assert.strictEqual(a, b)
  })
})
