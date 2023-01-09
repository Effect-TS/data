import * as Brand from "@fp-ts/data/Brand"
import * as Either from "@fp-ts/data/Either"

type Nominal = string & Brand.Brand<"Nominal">
type Int = number & Brand.Brand<"Int">
type Positive = number & Brand.Brand<"Positive">

declare const Int: Brand.Brand.RefinedConstructors<Int>
declare const Positive: Brand.Brand.RefinedConstructors<Positive>

// $ExpectType NominalConstructor<Nominal>
Brand.nominal<Nominal>()

// $ExpectType Nominal
Brand.nominal<Nominal>()("")

// $ExpectType RefinedConstructors<Int>
Brand.refined<Int>(
  (n) => Number.isInteger(n),
  (n) => Brand.error(`Expected ${n} to be an integer`)
)

// $ExpectType Int
Int.of(0)

// $ExpectType Option<Int>
Int.option(0)

// $ExpectType Either<BrandErrors, Int>
Int.either(0)

// $ExpectType boolean
Int.refine(0)

type S = { foo: "string" } & Brand.Brand<"S">
declare const S: Brand.Brand.Constructor<S>
type Q = { bar: "string" } & Brand.Brand<"Q">
declare const Q: Brand.Brand.Constructor<Q>

// TODO
// // $ExpectError Type 'NominalConstructor<Q>' is not assignable to type '"ERROR: All brands should have the same base type"'
// Brand.all(S, Q)

// $ExpectType RefinedConstructors<number & Brand<"Int"> & Brand<"Positive">>
Brand.all(Int, Positive)
