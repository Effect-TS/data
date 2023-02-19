import * as E from "@effect/data/Either"
import * as Gen from "@effect/data/Gen"
import * as O from "@effect/data/Option"

describe("Gen", () => {
  it("Option", () => {
    expect(Gen.Option(function*($) {
      const a = yield* $(O.some(1))
      const b = yield* $(O.some(2))
      return a + b
    })).toEqual(O.some(3))
  })

  it("Either", () => {
    expect(Gen.Either(function*($) {
      const a = yield* $(E.right(1))
      const b = yield* $(E.right(2))
      return a + b
    })).toEqual(E.right(3))
  })
})
