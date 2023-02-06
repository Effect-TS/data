import * as List from "@effect/data/List"
import * as Either from "@fp-ts/core/Either"
import * as Option from "@fp-ts/core/Option"
import { describe, expect, it } from "vitest"

describe.concurrent("List", () => {
  it("is an iterable", () => {
    expect(Array.from(List.make(0, 1, 2, 3))).toEqual([0, 1, 2, 3])
  })

  it("concat", () => {
    expect(List.concat(List.make(1, 2), List.make(3, 4))).toEqual(List.make(1, 2, 3, 4))
  })

  it("drop", () => {
    expect(List.drop(List.make(1, 2, 3, 4), 2)).toEqual(List.make(3, 4))
  })

  it("every", () => {
    expect(List.every(List.empty(), (n) => n > 2)).toEqual(true)
    expect(List.every(List.make(1, 2), (n) => n > 2)).toEqual(false)
    expect(List.every(List.make(2, 3), (n) => n > 2)).toEqual(false)
    expect(List.every(List.make(3, 4), (n) => n > 2)).toEqual(true)
  })

  it("findFirst", () => {
    const item = (a: string, b: string) => ({ a, b })
    const itemToFind = item("a2", "b2")
    const list = List.make(item("a1", "b1"), itemToFind, item("a3", itemToFind.b))
    expect(List.findFirst(list, ({ b }) => b === itemToFind.b)).toEqual(Option.some(itemToFind))
  })

  it("flatMap", () => {
    expect(List.flatMap(List.make(1, 2, 3, 4), (n) => List.make(n - 1, n + 1))).toEqual(
      List.make(0, 2, 1, 3, 2, 4, 3, 5)
    )
  })

  it("forEach", () => {
    const as: Array<number> = []
    List.forEach(List.make(1, 2, 3, 4), (n) => as.push(n))
    expect(as).toEqual([1, 2, 3, 4])
  })

  it("head", () => {
    expect(List.head(List.empty())).toEqual(Option.none())
    expect(List.head(List.make(1, 2, 3))).toEqual(Option.some(1))
  })

  it("isCons", () => {
    expect(List.isCons(List.empty())).toBe(false)
    expect(List.isCons(List.make(1))).toBe(true)
  })

  it("isNil", () => {
    expect(List.isNil(List.nil())).toBe(true)
    expect(List.isNil(List.make(1))).toBe(false)
  })

  it("map", () => {
    expect(List.map(List.make(1, 2, 3, 4), (n) => n + 1)).toEqual(List.make(2, 3, 4, 5))
  })

  it("partition", () => {
    expect(List.partition(List.make(1, 2, 3, 4), (n) => n > 2)).toEqual([
      List.make(1, 2),
      List.make(3, 4)
    ])
  })

  it("partitionMap", () => {
    expect(List.partitionMap(List.make(1, 2, 3, 4), (n) =>
      n > 2 ?
        Either.right(n) :
        Either.left(n))).toEqual([List.make(1, 2), List.make(3, 4)])
  })

  it("prependAll", () => {
    expect(List.prependAll(List.make(3), List.make(1, 2))).toEqual(List.make(1, 2, 3))
  })

  it("reduce", () => {
    expect(List.reduce(List.empty(), "-", (b, a) => b + a)).toEqual("-")
    expect(List.reduce(List.make("a", "b", "c"), "-", (b, a) => b + a)).toEqual("-abc")
  })

  it("some", () => {
    expect(List.some(List.empty(), (n) => n > 2)).toEqual(false)
    expect(List.some(List.make(1, 2), (n) => n > 2)).toEqual(false)
    expect(List.some(List.make(2, 3), (n) => n > 2)).toEqual(true)
    expect(List.some(List.make(3, 4), (n) => n > 2)).toEqual(true)
  })

  it("splitAt", () => {
    expect(List.splitAt(List.make(1, 2, 3, 4), 2)).toEqual([List.make(1, 2), List.make(3, 4)])
  })

  it("take", () => {
    expect(List.take(List.make(1, 2, 3, 4), 2)).toEqual(List.make(1, 2))
    expect(List.take(List.make(1, 2, 3, 4), 0)).toEqual(List.nil())
    expect(List.take(List.make(1, 2, 3, 4), -10)).toEqual(List.nil())
    expect(List.take(List.make(1, 2, 3, 4), 10)).toEqual(List.make(1, 2, 3, 4))
  })

  it("tail", () => {
    expect(List.tail(List.empty())).toEqual(Option.none())
    expect(List.tail(List.make(1, 2, 3))).toEqual(Option.some(List.make(2, 3)))
  })

  it("unsafeLast", () => {
    expect(() => List.unsafeLast(List.empty())).toThrowError(
      new Error("Error: Expected List to be non-empty")
    )
    expect(List.unsafeLast(List.make(1, 2, 3, 4))).toEqual(4)
  })
})
