import * as G from "@effect/data/Global"

const a = G.value("id", () => ({}))
const b = G.value("id", () => ({}))

describe("Global", () => {
  it("should give the same value when invoked with the same id", () => {
    assert.strictEqual(a, b)
  })
})
