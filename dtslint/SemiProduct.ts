import { OptionTypeLambda } from "@effect/data/Option"
import * as _ from "@effect/data/typeclass/SemiProduct"

export declare const SemiProduct: _.SemiProduct<OptionTypeLambda>

// @ts-expect-error
_.nonEmptyTuple(SemiProduct)() // should not allow empty tuples

// @ts-expect-error
_.nonEmptyStruct(SemiProduct)({}) // should not allow empty structs
