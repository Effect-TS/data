import * as _ from "@effect/data/Equivalence"
import { pipe } from "@effect/data/Function"

describe.concurrent("Equivalence", () => {
  it("array", () => {
    const eq = _.array(_.number)

    expect(eq([], [])).toEqual(true)
    expect(eq([1, 2, 3], [1, 2, 3])).toEqual(true)
    expect(eq([1, 2, 3], [1, 2, 4])).toEqual(false)
    expect(eq([1, 2, 3], [1, 2])).toEqual(false)
  })

  test("strict returns an Equivalence that uses strict equality (===) to compare values", () => {
    const eq = _.strict<{ a: number }>()
    const a = { a: 1 }
    expect(eq(a, a)).toBe(true)
    expect(eq({ a: 1 }, { a: 1 })).toBe(false)
  })

  it("contramap", () => {
    interface Person {
      readonly name: string
      readonly age: number
    }
    const eqPerson = pipe(_.string, _.contramap((p: Person) => p.name))
    expect(eqPerson({ name: "a", age: 1 }, { name: "a", age: 2 })).toEqual(true)
    expect(eqPerson({ name: "a", age: 1 }, { name: "a", age: 1 })).toEqual(true)
    expect(eqPerson({ name: "a", age: 1 }, { name: "b", age: 1 })).toEqual(false)
    expect(eqPerson({ name: "a", age: 1 }, { name: "b", age: 2 })).toEqual(false)
  })

  it("product", () => {
    const eq = _.product(_.string, _.string)
    expect(eq(["a", "b"], ["a", "b"])).toEqual(true)
    expect(eq(["a", "b"], ["c", "b"])).toEqual(false)
    expect(eq(["a", "b"], ["a", "c"])).toEqual(false)
  })

  it("productMany", () => {
    const eq = _.productMany(_.string, [_.string])
    expect(eq(["a", "b"], ["a", "b"])).toEqual(true)
    expect(eq(["a", "b"], ["a", "b", "c"])).toEqual(true)
    expect(eq(["a", "b", "c"], ["a", "b"])).toEqual(true)
    expect(eq(["a", "b"], ["c", "b"])).toEqual(false)
    expect(eq(["a", "b"], ["a", "c"])).toEqual(false)
  })

  it("all", () => {
    const eq = _.all([_.string, _.string])
    expect(eq([], [])).toEqual(true)
    expect(eq([], ["a"])).toEqual(true)
    expect(eq(["a"], [])).toEqual(true)
    expect(eq(["a"], ["a"])).toEqual(true)
    expect(eq(["a"], ["b"])).toEqual(false)
    expect(eq(["a"], ["a", "b"])).toEqual(true)
    expect(eq(["a", "b"], ["a"])).toEqual(true)
    expect(eq(["a", "b"], ["a", "b"])).toEqual(true)
    expect(eq(["a", "b"], ["a", "c"])).toEqual(false)
  })
})
