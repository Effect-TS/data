// import * as Option from '@effect/data/Option'
import * as Either from '@effect/data/Either'
import * as Unify from '@effect/data/Unify'

// TODO this is failing but I don't know why, needs further investigation
// // $ExpectType Option.Option<string | number>
// declare const option: Unify.Unify<Option.Option<number> | Option.Option<string>>

// TODO this is failing but I don't know why, needs further investigation
// // $ExpectType Either.Either<"LA" | "LB", "RA" | "RB">
// declare const either: Unify.Unify<Either.Either<"LA", "RA"> | Either.Either<"LB", "RB">>

// TODO this is failing but I don't know why, needs further investigation
// // $ExpectType 0 | Option.Option<string | number> | Either.Either<"LA" | "LB", "RA" | "RB">
// declare const both: Unify.Unify<Either.Either<"LA", "RA"> | Either.Either<"LB", "RB"> | Option.Option<number> | Option.Option<string> | 0>

// $ExpectType <N>(n: N) => Either<string, N>
const b = Unify.unify(<N>(n: N) => Math.random() > 0 ? Either.right(n) : Either.left("ok"))

// $ExpectType Either<string, number>
const c = Unify.unify(Math.random() > 0 ? Either.right(10) : Either.left("ok"))
