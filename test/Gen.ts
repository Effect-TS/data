import * as Gen from "@effect/data/Gen"
import * as E from "@fp-ts/core/Either"
import * as O from "@fp-ts/core/Option"
import * as T from "@fp-ts/core/These"

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
  it("These", () => {
    expect(Gen.These(function*($) {
      const a = yield* $(T.right(1))
      const b = yield* $(T.right(2))
      return a + b
    })).toEqual(T.right(3))
  })
})
