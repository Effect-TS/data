import * as S from "@effect/data/Symbol"

describe.concurrent("Symbol", () => {
  it("isSymbol", () => {
    expect(S.isSymbol(Symbol.for("@effect/data/test/a"))).toEqual(true)
    expect(S.isSymbol(1n)).toEqual(false)
    expect(S.isSymbol(1)).toEqual(false)
    expect(S.isSymbol("a")).toEqual(false)
    expect(S.isSymbol(true)).toEqual(false)
  })

  it("Equivalence", () => {
    const eq = S.Equivalence
    expect(eq(Symbol.for("@effect/data/test/a"), Symbol.for("@effect/data/test/a"))).toBe(true)
    expect(eq(Symbol.for("@effect/data/test/a"), Symbol.for("@effect/data/test/b"))).toBe(false)
  })
})
