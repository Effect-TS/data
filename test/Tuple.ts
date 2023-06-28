import { pipe } from "@effect/data/Function"
import * as T from "@effect/data/Tuple"

describe.concurrent("Tuple", () => {
  it("exports", () => {
    expect(T.getOrder).exist
    expect(T.getEquivalence).exist
  })

  it("tuple", () => {
    expect(T.tuple("a", 1, true)).toEqual(["a", 1, true])
  })

  it("appendElement", () => {
    expect(pipe(T.tuple("a", 1), T.appendElement(true))).toEqual(["a", 1, true])
  })

  it("getFirst", () => {
    expect(T.getFirst(T.tuple("a", 1))).toEqual("a")
  })

  it("getSecond", () => {
    expect(T.getSecond(T.tuple("a", 1))).toEqual(1)
  })

  it("bimap", () => {
    expect(T.bimap(T.tuple("a", 1), (s) => s + "!", (n) => n * 2)).toEqual(["a!", 2])
  })

  it("swap", () => {
    expect(T.swap(T.tuple("a", 1))).toEqual([1, "a"])
  })
})
