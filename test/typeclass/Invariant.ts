import { pipe } from "@effect/data/Function"
import * as O from "@effect/data/Option"
import * as P from "@effect/data/Predicate"
import * as String from "@effect/data/String"
import * as _ from "@effect/data/typeclass/Invariant"
import * as semigroup from "@effect/data/typeclass/Semigroup"
import * as U from "../util"

describe.concurrent("Invariant", () => {
  it("imapComposition", () => {
    const imap = _.imapComposition(semigroup.Invariant, O.Invariant)
    const S = imap(O.getOptionalMonoid(String.Semigroup), (s) => [s], ([s]) => s)
    U.deepStrictEqual(S.combine(O.none(), O.none()), O.none())
    U.deepStrictEqual(S.combine(O.none(), O.some(["b"])), O.some(["b"]))
    U.deepStrictEqual(S.combine(O.some(["a"]), O.none()), O.some(["a"]))
    U.deepStrictEqual(
      S.combine(O.some(["a"]), O.some(["b"])),
      O.some(["ab"])
    )
  })

  describe.concurrent("asProp", () => {
    it("Covariant (Option)", () => {
      const asProp = _.asProp(O.Invariant)
      U.deepStrictEqual(pipe(O.none(), asProp("a")), O.none())
      U.deepStrictEqual(pipe(O.some(1), asProp("a")), O.some({ a: 1 }))
    })

    it("Contravariant (Predicate)", () => {
      const asProp = _.asProp(P.Invariant)
      const p = pipe(String.isString, asProp("a"))
      U.deepStrictEqual(p({ a: "a" }), true)
      U.deepStrictEqual(p({ a: 1 }), false)
    })
  })

  describe.concurrent("asTuple", () => {
    it("Covariant (Option)", () => {
      const asTuple = _.asTuple(O.Invariant)
      U.deepStrictEqual(pipe(O.none(), asTuple), O.none())
      U.deepStrictEqual(pipe(O.some(1), asTuple), O.some([1]))
    })

    it("Contravariant (Predicate)", () => {
      const asTuple = _.asTuple(P.Invariant)
      const p = pipe(String.isString, asTuple)
      U.deepStrictEqual(p(["a"]), true)
      U.deepStrictEqual(p([1]), false)
    })
  })
})
