import * as _ from "@fp-ts/data/Const"
import { absurd, pipe } from "@fp-ts/data/Function"
import * as number from "@fp-ts/data/Number"
import * as string from "@fp-ts/data/String"
import * as U from "./util"

describe.concurrent("Const", () => {
  it("execute", () => {
    U.deepStrictEqual(pipe(_.make("a"), _.execute), "a")
  })

  it("map", () => {
    U.deepStrictEqual(pipe(_.make("a"), _.map(U.double)), _.make("a"))
    U.deepStrictEqual(pipe(_.make("a"), _.Covariant.map(U.double)), _.make("a"))
  })

  it("flap", () => {
    U.deepStrictEqual(pipe(_.make("a"), _.flap(1)), _.make("a"))
  })

  it("contramap", () => {
    U.deepStrictEqual(pipe(_.make("a"), _.contramap(U.double)), _.make("a"))
    U.deepStrictEqual(pipe(_.make("a"), _.Contravariant.contramap(U.double)), _.make("a"))
  })

  it("mapBoth", () => {
    U.deepStrictEqual(pipe(_.make("a"), _.mapBoth(string.toUpperCase, U.double)), _.make("A"))
    U.deepStrictEqual(
      pipe(_.make("a"), _.Bifunctor.mapBoth(string.toUpperCase, U.double)),
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

  it("getSemigroupal", () => {
    const Semigroupal = _.getSemigroupal(string.Semigroup)
    U.deepStrictEqual(pipe(_.make("a"), Semigroupal.zipWith(_.make("b"), absurd)), _.make("ab"))
    U.deepStrictEqual(pipe(_.make("a"), Semigroupal.zipMany([])), _.make("a"))
    U.deepStrictEqual(
      pipe(_.make("a"), Semigroupal.zipMany([_.make("b"), _.make("c")])),
      _.make("abc")
    )
  })

  it("getMonoidal", () => {
    const Monoidal = _.getMonoidal(string.Monoid)
    U.deepStrictEqual(Monoidal.zipAll([]), _.make(""))
    U.deepStrictEqual(Monoidal.zipAll([_.make("a"), _.make("b")]), _.make("ab"))
  })

  it("liftSortable", () => {
    const Sortable = _.liftSortable(number.Sortable)
    U.deepStrictEqual(Sortable.compare(_.make(1))(_.make(1)), 0)
    U.deepStrictEqual(Sortable.compare(_.make(1))(_.make(2)), 1)
    U.deepStrictEqual(Sortable.compare(_.make(2))(_.make(1)), -1)
  })

  it("liftBounded", () => {
    const Bounded = _.liftBounded(number.Bounded)
    U.deepStrictEqual(Bounded.compare(_.make(1))(_.make(1)), 0)
    U.deepStrictEqual(Bounded.compare(_.make(1))(_.make(2)), 1)
    U.deepStrictEqual(Bounded.compare(_.make(2))(_.make(1)), -1)
    U.deepStrictEqual(Bounded.maximum, _.make(Infinity))
    U.deepStrictEqual(Bounded.minimum, _.make(-Infinity))
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

  it("getSemigroupal", () => {
    const Semigroupal = _.getSemigroupal(string.Semigroup)
    const fa = _.make("a")
    U.deepStrictEqual(pipe(fa, Semigroupal.zipWith(_.make("b"), absurd)), _.make("ab"))
  })
})
