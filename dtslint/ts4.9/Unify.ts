import { Option } from '@effect/data/Option'
import { Either } from '@effect/data/Either'
import * as U from '@effect/data/Unify'

// $ExpectType Option<string | number>
declare const option: U.Unify<Option<number> | Option<string>>

// $ExpectType Either<"LA" | "LB", "RA" | "RB">
declare const either: U.Unify<Either<"LA", "RA"> | Either<"LB", "RB">>

// $ExpectType 0 | Option<string | number> | Either<"LA" | "LB", "RA" | "RB">
declare const both: U.Unify<Either<"LA", "RA"> | Either<"LB", "RB"> | Option<number> | Option<string> | 0>
