import * as MutableList from "@effect/data/MutableList"
import { deepStrictEqual, strictEqual } from "@effect/data/test/util"
import { pipe } from "@fp-ts/core/Function"
import { inspect } from "node:util"

describe.concurrent("MutableList", () => {
  it("toString", () => {
    expect(String(MutableList.make(0, 1, 2))).toEqual("MutableList(0, 1, 2)")
  })

  it("toJSON", () => {
    expect(JSON.stringify(MutableList.make(0, 1, 2))).toEqual(
      JSON.stringify({ _tag: "MutableList", values: [0, 1, 2] })
    )
  })

  it("inspect", () => {
    expect(inspect(MutableList.make(0, 1, 2))).toEqual(
      inspect({ _tag: "MutableList", values: [0, 1, 2] })
    )
  })

  it("empty", () => {
    deepStrictEqual(Array.from(MutableList.empty<number>()), [])
  })

  it("from", () => {
    deepStrictEqual(Array.from(MutableList.from([])), [])
    deepStrictEqual(Array.from(MutableList.from([1, 2, 3])), [1, 2, 3])
  })

  it("make", () => {
    deepStrictEqual(Array.from(MutableList.make()), [])
    deepStrictEqual(Array.from(MutableList.make(1, 2, 3)), [1, 2, 3])
  })

  it("isEmpty", () => {
    strictEqual(MutableList.isEmpty(MutableList.empty<number>()), true)
    strictEqual(MutableList.isEmpty(MutableList.make(1, 2, 3)), false)
  })

  it("length", () => {
    strictEqual(MutableList.length(MutableList.empty<number>()), 0)
    strictEqual(MutableList.length(MutableList.make(1, 2, 3)), 3)
  })

  it("tail", () => {
    deepStrictEqual(MutableList.tail(MutableList.make()), undefined)
    deepStrictEqual(MutableList.tail(MutableList.make(1, 2, 3)), 3)
  })

  it("head", () => {
    deepStrictEqual(MutableList.head(MutableList.make()), undefined)
    deepStrictEqual(MutableList.head(MutableList.make(1, 2, 3)), 1)
  })

  it("forEach", () => {
    const accumulator: Array<number> = []
    const list = MutableList.make(1, 2, 3)
    pipe(
      list,
      MutableList.forEach((n) => {
        accumulator.push(n * 2)
      })
    )

    deepStrictEqual(Array.from(list), [1, 2, 3])
    deepStrictEqual(accumulator, [2, 4, 6])
  })

  it("reset", () => {
    const list = MutableList.make(1, 2, 3)
    deepStrictEqual(Array.from(list), [1, 2, 3])
    deepStrictEqual(Array.from(MutableList.reset(list)), [])
  })

  it("append", () => {
    const list = pipe(
      MutableList.empty<number>(),
      MutableList.append(1),
      MutableList.append(2),
      MutableList.append(3)
    )

    deepStrictEqual(Array.from(list), [1, 2, 3])
  })

  it("shift", () => {
    const list = MutableList.make(1, 2, 3)
    deepStrictEqual(MutableList.shift(list), 1)
    deepStrictEqual(MutableList.shift(list), 2)
    deepStrictEqual(MutableList.shift(list), 3)
    deepStrictEqual(MutableList.shift(list), undefined)
  })

  it("pop", () => {
    const list = MutableList.make(1, 2, 3)
    deepStrictEqual(MutableList.pop(list), 3)
    deepStrictEqual(MutableList.pop(list), 2)
    deepStrictEqual(MutableList.pop(list), 1)
    deepStrictEqual(MutableList.pop(list), undefined)
  })
})
