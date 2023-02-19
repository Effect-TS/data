import { pipe } from "@effect/data/Function"
import * as S from "@effect/data/Struct"

describe.concurrent("Struct", () => {
  it("exports", () => {
    expect(S.getEquivalence).exist
    expect(S.getOrder).exist
    expect(S.getSemigroup).exist
    expect(S.getMonoid).exist
  })

  it("pick", () => {
    expect(pipe({ a: "a", b: 1, c: true }, S.pick("a", "b"))).toEqual({ a: "a", b: 1 })
  })

  it("omit", () => {
    expect(pipe({ a: "a", b: 1, c: true }, S.omit("c"))).toEqual({ a: "a", b: 1 })
  })
})
