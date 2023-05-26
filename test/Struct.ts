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

  it("evolve", () => {
    const res1 = pipe(
      { a: "a", b: 1, c: true, d: "extra" },
      S.evolve({
        a: (s) => s.length,
        b: (b) => b > 0,
        c: (c) => !c
      })
    )

    expect(res1).toEqual({ a: 1, b: true, c: false, d: "extra" })

    const x: Record<"b", number> = Object.create({ a: 1 })
    x.b = 1
    const res2 = pipe(x, S.evolve({ b: (b) => b > 0 }))

    expect(res2).toEqual({ b: true })

    // dual
    const res3 = S.evolve({ a: 1 }, { a: (x) => x > 0 })
    expect(res3).toEqual({ a: true })
  })
})
