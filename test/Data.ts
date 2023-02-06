import * as Data from "@effect/data/Data"
import * as Equal from "@effect/data/Equal"

describe("Data", () => {
  it("struct", () => {
    const x = Data.struct({ a: 0, b: 1, c: 2 })
    const y = Data.struct({ a: 0, b: 1, c: 2 })
    const { a, b, c } = x
    expect(a).toBe(0)
    expect(b).toBe(1)
    expect(c).toBe(2)
    expect(Equal.equals(x, y)).toBe(true)
    expect(Equal.equals(x, Data.struct({ a: 0 }))).toBe(false)
  })

  it("tuple", () => {
    const x = Data.tuple(0, 1, 2)
    const y = Data.tuple(0, 1, 2)
    const [a, b, c] = x
    expect(a).toBe(0)
    expect(b).toBe(1)
    expect(c).toBe(2)
    expect(Equal.equals(x, y)).toBe(true)
    expect(Equal.equals(x, Data.tuple(0, 1))).toBe(false)
  })

  it("array", () => {
    const x = Data.array([0, 1, 2])
    const y = Data.array([0, 1, 2])
    const [a, b, c] = x
    expect(a).toBe(0)
    expect(b).toBe(1)
    expect(c).toBe(2)
    expect(Equal.equals(x, y)).toBe(true)
    expect(Equal.equals(x, Data.tuple(0, 1, 2))).toBe(true)
    expect(Equal.equals(x, Data.array([0, 1]))).toBe(false)
  })

  it("case", () => {
    interface Person extends Data.Case {
      readonly name: string
    }

    const Person = Data.case<Person>()

    const a = Person({ name: "Mike" })
    const b = Person({ name: "Mike" })
    const c = Person({ name: "Foo" })

    expect(a.name).toBe("Mike")
    expect(b.name).toBe("Mike")
    expect(c.name).toBe("Foo")
    expect(Equal.equals(a, b)).toBe(true)
    expect(Equal.equals(a, c)).toBe(false)
  })

  it("tagged", () => {
    interface Person extends Data.Case {
      readonly _tag: "Person"
      readonly name: string
    }

    const Person = Data.tagged<Person>("Person")

    const a = Person({ name: "Mike" })
    const b = Person({ name: "Mike" })
    const c = Person({ name: "Foo" })

    expect(a.name).toBe("Mike")
    expect(b.name).toBe("Mike")
    expect(c.name).toBe("Foo")
    expect(Equal.equals(a, b)).toBe(true)
    expect(Equal.equals(a, c)).toBe(false)
  })
})
