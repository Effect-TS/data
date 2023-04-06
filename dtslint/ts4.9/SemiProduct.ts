import { OptionTypeLambda } from "@effect/data/Option"
import * as _ from "@effect/data/typeclass/SemiProduct"

export declare const SemiProduct: _.SemiProduct<OptionTypeLambda>

// $ExpectError
_.nonEmptyTuple(SemiProduct)() // should not allow empty tuples

// $ExpectError
_.nonEmptyStruct(SemiProduct)({}) // should not allow empty structs
