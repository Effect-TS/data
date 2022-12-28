import * as E from "@fp-ts/data/Either"
import { pipe } from "@fp-ts/data/Function"
import * as _ from "@fp-ts/data/Json"
import * as O from "@fp-ts/data/Option"
import * as T from "@fp-ts/data/These"
import * as U from "./util"

describe("Json", () => {
  it("parse", () => {
    U.deepStrictEqual(pipe("{\"a\":1}", _.parse), E.right({ a: 1 }))
    U.deepStrictEqual(
      pipe("{\"a\":}", _.parse),
      E.left(new SyntaxError(`Unexpected token '}', "{"a":}" is not valid JSON`))
    )
  })

  it("stringify", () => {
    U.deepStrictEqual(pipe({ a: 1 }, _.stringify), E.right("{\"a\":1}"))
    const circular: any = { ref: null }
    circular.ref = circular
    U.deepStrictEqual(
      pipe(
        circular,
        _.stringify,
        E.mapLeft((e) => (e as Error).message.includes("Converting circular structure to JSON"))
      ),
      E.left(true)
    )
    type Person = {
      readonly name: string
      readonly age: number
    }
    const person: Person = { name: "Giulio", age: 45 }
    U.deepStrictEqual(pipe(person, _.stringify), E.right("{\"name\":\"Giulio\",\"age\":45}"))

    U.deepStrictEqual(
      _.stringify(undefined as any),
      E.left(new Error("Converting unsupported structure to JSON"))
    )
  })

  it("Option should be assignable to Json", () => {
    const x1: _.Json = O.none
    expect(x1).toEqual(O.none)
    const x2: _.Json = O.some(1)
    expect(x2).toEqual(O.some(1))
  })

  it("Either should be assignable to Json", () => {
    const x1: _.Json = E.right(1)
    expect(x1).toEqual(E.right(1))
    const x2: _.Json = E.left("a")
    expect(x2).toEqual(E.left("a"))
  })

  it("These should be assignable to Json", () => {
    const x1: _.Json = T.right(1)
    expect(x1).toEqual(T.right(1))
    const x2: _.Json = T.left("a")
    expect(x2).toEqual(T.left("a"))
    const x3: _.Json = T.both("a", 1)
    expect(x3).toEqual(T.both("a", 1))
  })
})
