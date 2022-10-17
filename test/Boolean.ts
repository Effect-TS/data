import * as Boolean from "@fp-ts/data/Boolean"
import { deepStrictEqual } from "@fp-ts/data/test/util"

describe.concurrent("Boolean", () => {
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

  describe.concurrent("match", () => {
    it("baseline", () => {
      const match = Boolean.match(() => "false", () => "true")
      deepStrictEqual(match(true), "true")
      deepStrictEqual(match(false), "false")
    })
  })

  // TODO
  // describe.concurrent("Ord", () => {
  //   it("baseline", () => {
  //     deepStrictEqual(pipe(false, Boolean.Ord.compare(true)), -1)
  //     deepStrictEqual(pipe(true, Boolean.Ord.compare(false)), 1)
  //     deepStrictEqual(pipe(true, Boolean.Ord.compare(true)), 0)
  //   })
  // })
})
