import * as Data from "@effect/data/Data"
import * as Equal from "@effect/data/Equal"

describe.concurrent("Data", () => {
  it("struct", () => {
    const x = Data.struct({ a: 0, b: 1, c: 2 })
    const y = Data.struct({ a: 0, b: 1, c: 2 })
    const { a, b, c } = x
    expect(a).toBe(0)
    expect(b).toBe(1)
    expect(c).toBe(2)
    expect(Equal.equals(x, y)).toBe(true)
    expect(Equal.equals(x, Data.struct({ a: 0 }))).toBe(false)

    // different keys length
    expect(Data.struct({ a: 0, b: 1 })[Equal.symbol](Data.struct({ a: 0 }))).toBe(false)
    // same length but different keys
    expect(Data.struct({ a: 0 })[Equal.symbol](Data.struct({ b: 1 }))).toBe(false)
  })

  it("unsafeStruct", () => {
    const x = Data.unsafeStruct({ a: 0, b: 1, c: 2 })
    const y = Data.unsafeStruct({ a: 0, b: 1, c: 2 })
    const { a, b, c } = x
    expect(a).toBe(0)
    expect(b).toBe(1)
    expect(c).toBe(2)
    expect(Equal.equals(x, y)).toBe(true)
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

    // different length
    expect(Data.array([0, 1, 2])[Equal.symbol](Data.array([0, 1]))).toBe(false)
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

    const Empty = Data.case()
    expect(Equal.equals(Empty(), Empty())).toBe(true)
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

    expect(a._tag).toBe("Person")
    expect(a.name).toBe("Mike")
    expect(b.name).toBe("Mike")
    expect(c.name).toBe("Foo")
    expect(Equal.equals(a, b)).toBe(true)
    expect(Equal.equals(a, c)).toBe(false)
  })

  it("case class", () => {
    class Person extends Data.Class<{ name: string }> {}
    const a = new Person({ name: "Mike" })
    const b = new Person({ name: "Mike" })
    const c = new Person({ name: "Foo" })

    expect(a.name).toBe("Mike")
    expect(b.name).toBe("Mike")
    expect(c.name).toBe("Foo")
    expect(Equal.equals(a, b)).toBe(true)
    expect(Equal.equals(a, c)).toBe(false)

    // different keys length
    class D extends Data.Class<{ d: string; e: string }> {}
    const d = new D({ d: "d", e: "e" })
    expect(a[Equal.symbol](d)).toBe(false)
    // same length but different keys
    class E extends Data.Class<{ e: string }> {}
    const e = new E({ e: "e" })
    expect(a[Equal.symbol](e)).toBe(false)
  })

  it("tagged class", () => {
    class Person extends Data.TaggedClass("Person")<{ name: string }> {}
    const a = new Person({ name: "Mike" })
    const b = new Person({ name: "Mike" })
    const c = new Person({ name: "Foo" })

    expect(a._tag).toBe("Person")
    expect(a.name).toBe("Mike")
    expect(b.name).toBe("Mike")
    expect(c.name).toBe("Foo")
    expect(Equal.equals(a, b)).toBe(true)
    expect(Equal.equals(a, c)).toBe(false)
  })

  it("tagged - empty", () => {
    interface Person extends Data.Case {
      readonly _tag: "Person"
    }

    const Person = Data.tagged<Person>("Person")

    const a = Person()
    const b = Person()

    expect(Equal.equals(a, b)).toBe(true)
  })

  it("TaggedClass - empty", () => {
    class Person extends Data.TaggedClass("Person")<{}> {}

    const a = new Person()
    const b = new Person()

    expect(Equal.equals(a, b)).toBe(true)
  })

  it("tagged - don't override tag", () => {
    interface Foo extends Data.Case {
      readonly _tag: "Foo"
      readonly value: string
    }
    const Foo = Data.tagged<Foo>("Foo")
    interface Bar extends Data.Case {
      readonly _tag: "Bar"
      readonly value: number
    }
    const Bar = Data.tagged<Bar>("Bar")

    const foo = Foo({ value: "test" })
    const bar = Bar({ ...foo, value: 10 })

    expect(bar._tag).toStrictEqual("Bar")
  })
})
