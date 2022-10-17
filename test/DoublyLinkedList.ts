import { pipe } from "@fp-ts/data/Function"
import * as DoublyLinkedList from "@fp-ts/data/mutable/DoublyLinkedList"
import { deepStrictEqual, strictEqual } from "@fp-ts/data/test/util"

describe("DoublyLinkedList", () => {
  it("empty", () => {
    deepStrictEqual(Array.from(DoublyLinkedList.empty<number>()), [])
  })

  it("from", () => {
    deepStrictEqual(Array.from(DoublyLinkedList.from([])), [])
    deepStrictEqual(Array.from(DoublyLinkedList.from([1, 2, 3])), [1, 2, 3])
  })

  it("make", () => {
    deepStrictEqual(Array.from(DoublyLinkedList.make()), [])
    deepStrictEqual(Array.from(DoublyLinkedList.make(1, 2, 3)), [1, 2, 3])
  })

  it("isEmpty", () => {
    strictEqual(DoublyLinkedList.isEmpty(DoublyLinkedList.empty<number>()), true)
    strictEqual(DoublyLinkedList.isEmpty(DoublyLinkedList.make(1, 2, 3)), false)
  })

  it("length", () => {
    strictEqual(DoublyLinkedList.length(DoublyLinkedList.empty<number>()), 0)
    strictEqual(DoublyLinkedList.length(DoublyLinkedList.make(1, 2, 3)), 3)
  })

  it("tail", () => {
    deepStrictEqual(DoublyLinkedList.tail(DoublyLinkedList.make()), undefined)
    deepStrictEqual(DoublyLinkedList.tail(DoublyLinkedList.make(1, 2, 3)), 3)
  })

  it("head", () => {
    deepStrictEqual(DoublyLinkedList.head(DoublyLinkedList.make()), undefined)
    deepStrictEqual(DoublyLinkedList.head(DoublyLinkedList.make(1, 2, 3)), 1)
  })

  it("forEach", () => {
    const accumulator: Array<number> = []
    const list = DoublyLinkedList.make(1, 2, 3)
    pipe(
      list,
      DoublyLinkedList.forEach((n) => {
        accumulator.push(n * 2)
      })
    )

    deepStrictEqual(Array.from(list), [1, 2, 3])
    deepStrictEqual(accumulator, [2, 4, 6])
  })

  it("reset", () => {
    const list = DoublyLinkedList.make(1, 2, 3)
    deepStrictEqual(Array.from(list), [1, 2, 3])
    deepStrictEqual(Array.from(DoublyLinkedList.reset(list)), [])
  })

  it("append", () => {
    const list = pipe(
      DoublyLinkedList.empty<number>(),
      DoublyLinkedList.append(1),
      DoublyLinkedList.append(2),
      DoublyLinkedList.append(3)
    )

    deepStrictEqual(Array.from(list), [1, 2, 3])
  })

  it("shift", () => {
    const list = DoublyLinkedList.make(1, 2, 3)
    deepStrictEqual(DoublyLinkedList.shift(list), 1)
    deepStrictEqual(DoublyLinkedList.shift(list), 2)
    deepStrictEqual(DoublyLinkedList.shift(list), 3)
    deepStrictEqual(DoublyLinkedList.shift(list), undefined)
  })

  it("pop", () => {
    const list = DoublyLinkedList.make(1, 2, 3)
    deepStrictEqual(DoublyLinkedList.pop(list), 3)
    deepStrictEqual(DoublyLinkedList.pop(list), 2)
    deepStrictEqual(DoublyLinkedList.pop(list), 1)
    deepStrictEqual(DoublyLinkedList.pop(list), undefined)
  })
})
