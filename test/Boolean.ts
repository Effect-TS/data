import { pipe } from "@fp-ts/core/internal/Function"
import * as Boolean from "@fp-ts/data/Boolean"
import { deepStrictEqual } from "@fp-ts/data/test/util"

describe.concurrent("Boolean", () => {
  it("derived instances", () => {
    expect(Boolean.SemigroupAll).exist
    expect(Boolean.MonoidAll).exist
    expect(Boolean.SemigroupAny).exist
    expect(Boolean.MonoidAny).exist
  })

  it("and", () => {
    deepStrictEqual(pipe(true, Boolean.and(true)), true)
    deepStrictEqual(pipe(true, Boolean.and(false)), false)
    deepStrictEqual(pipe(false, Boolean.and(true)), false)
    deepStrictEqual(pipe(false, Boolean.and(false)), false)
  })

  it("or", () => {
    deepStrictEqual(pipe(true, Boolean.or(true)), true)
    deepStrictEqual(pipe(true, Boolean.or(false)), true)
    deepStrictEqual(pipe(false, Boolean.or(true)), true)
    deepStrictEqual(pipe(false, Boolean.or(false)), false)
  })

  describe.concurrent("all", () => {
    it("baseline", () => {
      deepStrictEqual(Boolean.all([true, true, true]), true)
      deepStrictEqual(Boolean.all([true, true, false]), false)
    })

    it("should handle iterables", () => {
      deepStrictEqual(Boolean.all(new Set([true, true])), true)
      deepStrictEqual(Boolean.all(new Set([true, false])), false)
      deepStrictEqual(Boolean.all(new Set([false, false])), false)
    })
  })

  describe.concurrent("any", () => {
    it("baseline", () => {
      deepStrictEqual(Boolean.any([true, true, true]), true)
      deepStrictEqual(Boolean.any([true, true, false]), true)
      deepStrictEqual(Boolean.any([false, false, false]), false)
    })

    it("should handle iterables", () => {
      deepStrictEqual(Boolean.any(new Set([true, true])), true)
      deepStrictEqual(Boolean.any(new Set([true, false])), true)
      deepStrictEqual(Boolean.any(new Set([false, false])), false)
    })
  })

  it("match", () => {
    const match = Boolean.match(() => "false", () => "true")
    deepStrictEqual(match(true), "true")
    deepStrictEqual(match(false), "false")
  })

  it("Order", () => {
    deepStrictEqual(pipe(false, Boolean.Order.compare(true)), -1)
    deepStrictEqual(pipe(true, Boolean.Order.compare(false)), 1)
    deepStrictEqual(pipe(true, Boolean.Order.compare(true)), 0)
  })
})
