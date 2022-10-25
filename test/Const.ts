import * as _ from "@fp-ts/data/Const"
import { pipe } from "@fp-ts/data/Function"
import * as number from "@fp-ts/data/Number"
import * as string from "@fp-ts/data/String"
import * as U from "./util"

describe.concurrent("Const", () => {
  it("instances and derived exports", () => {
    expect(_.Invariant).exist
    expect(_.imap).exist
    expect(_.tupled).exist
    expect(_.bindTo).exist

    expect(_.Covariant).exist
    expect(_.map).exist
    expect(_.let).exist
    expect(_.flap).exist
    expect(_.as).exist
    expect(_.asUnit).exist
  })

  it("execute", () => {
    U.deepStrictEqual(pipe(_.make("a"), _.execute), "a")
  })

  it("map", () => {
    U.deepStrictEqual(pipe(_.make("a"), _.map(U.double)), _.make("a"))
    U.deepStrictEqual(pipe(_.make("a"), _.Covariant.map(U.double)), _.make("a"))
  })

  it("contramap", () => {
    U.deepStrictEqual(pipe(_.make("a"), _.contramap(U.double)), _.make("a"))
    U.deepStrictEqual(pipe(_.make("a"), _.Contravariant.contramap(U.double)), _.make("a"))
  })

  it("bimap", () => {
    U.deepStrictEqual(pipe(_.make("a"), _.bimap(string.toUpperCase, U.double)), _.make("A"))
    U.deepStrictEqual(
      pipe(_.make("a"), _.Bicovariant.bimap(string.toUpperCase, U.double)),
      _.make("A")
    )
  })

  it("mapLeft", () => {
    const f = _.mapLeft(string.toUpperCase)
    U.deepStrictEqual(pipe(_.make("a"), f), _.make("A"))
  })

  it("getPointed", () => {
    const Pointed = _.getPointed(string.Monoid)
    U.deepStrictEqual(Pointed.of(1), _.make(""))
  })

  it("getNonEmptyApplicative", () => {
    const NonEmptyApplicative = _.getNonEmptyApplicative(string.Semigroup)
    U.deepStrictEqual(
      pipe(_.make("a"), NonEmptyApplicative.product(_.make("b"))),
      _.make("ab")
    )
    U.deepStrictEqual(pipe(_.make("a"), NonEmptyApplicative.productMany([])), _.make("a"))
    U.deepStrictEqual(
      pipe(_.make("a"), NonEmptyApplicative.productMany([_.make("b"), _.make("c")])),
      _.make("abc")
    )
  })

  it("getMonoidal", () => {
    const Monoidal = _.getApplicative(string.Monoid)
    U.deepStrictEqual(Monoidal.productAll([]), _.make(""))
    U.deepStrictEqual(Monoidal.productAll([_.make("a"), _.make("b")]), _.make("ab"))
  })

  it("liftOrder", () => {
    const Order = _.liftOrder(number.Order)
    U.deepStrictEqual(Order.compare(_.make(1))(_.make(1)), 0)
    U.deepStrictEqual(Order.compare(_.make(1))(_.make(2)), 1)
    U.deepStrictEqual(Order.compare(_.make(2))(_.make(1)), -1)
  })

  it("liftBounded", () => {
    const Bounded = _.liftBounded(number.Bounded)
    U.deepStrictEqual(Bounded.compare(_.make(1))(_.make(1)), 0)
    U.deepStrictEqual(Bounded.compare(_.make(1))(_.make(2)), 1)
    U.deepStrictEqual(Bounded.compare(_.make(2))(_.make(1)), -1)
    U.deepStrictEqual(Bounded.maxBound, _.make(Infinity))
    U.deepStrictEqual(Bounded.minBound, _.make(-Infinity))
  })

  it("liftSemigroup", () => {
    const S = _.liftSemigroup(string.Semigroup)
    U.deepStrictEqual(pipe(_.make("a"), S.combine(_.make("b"))), _.make("ab"))
    U.deepStrictEqual(pipe(_.make("a"), S.combineMany([])), _.make("a"))
    U.deepStrictEqual(pipe(_.make("a"), S.combineMany([_.make("b")])), _.make("ab"))
    U.deepStrictEqual(
      pipe(_.make("a"), S.combineMany([_.make("b"), _.make("c"), _.make("d")])),
      _.make("abcd")
    )
  })

  it("liftMonoid", () => {
    const M = _.liftMonoid(string.Monoid)
    U.deepStrictEqual(pipe(_.make("a"), M.combine(_.make("b"))), _.make("ab"))
    U.deepStrictEqual(pipe(_.make("a"), M.combine(M.empty)), _.make("a"))
    U.deepStrictEqual(pipe(M.empty, M.combine(_.make("b"))), _.make("b"))
  })
})
