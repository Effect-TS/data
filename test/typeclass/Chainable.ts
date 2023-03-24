import { pipe } from "@effect/data/Function"
import * as O from "@effect/data/Option"
import * as _ from "@effect/data/typeclass/Chainable"
import * as U from "../util"

describe.concurrent("Chainable", () => {
  it("andThenDiscard", () => {
    const andThenDiscard = _.andThenDiscard(O.Chainable)
    U.deepStrictEqual(pipe(O.none(), andThenDiscard(O.none())), O.none())
    U.deepStrictEqual(pipe(O.none(), andThenDiscard(O.some(2))), O.none())
    U.deepStrictEqual(pipe(O.some(1), andThenDiscard(O.none())), O.none())
    U.deepStrictEqual(pipe(O.some(1), andThenDiscard(O.some(2))), O.some(1))
  })

  it("setProp", () => {
    const setProp = _.setPropFlat(O.Chainable)
    U.deepStrictEqual(pipe(O.ofStruct, setProp("a", () => O.none())), O.none())
    U.deepStrictEqual(pipe(O.ofStruct, setProp("a", () => O.some(1))), O.some({ a: 1 }))
  })

  it("tap", () => {
    const tap = _.tap(O.Chainable)
    U.deepStrictEqual(pipe(O.none(), tap(() => O.none())), O.none())
    U.deepStrictEqual(pipe(O.none(), tap(() => O.some(2))), O.none())
    U.deepStrictEqual(pipe(O.some(1), tap(() => O.none())), O.none())
    U.deepStrictEqual(pipe(O.some(1), tap(() => O.some(2))), O.some(1))
  })
})
