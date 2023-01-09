import * as Brand from "@fp-ts/data/Brand"
import * as Either from "@fp-ts/data/Either"
import * as Option from "@fp-ts/data/Option"

type Int = number & Brand.Brand<"Int">
const Int = Brand.refined<Int>(
  (n) => Number.isInteger(n),
  (n) => Brand.error(`Expected ${n} to be an integer`)
)

type Positive = number & Brand.Brand<"Positive">
const Positive = Brand.refined<Positive>(
  (n) => n > 0,
  (n) => Brand.error(`Expected ${n} to be positive`)
)

type PositiveInt = Positive & Int
const PositiveInt = Brand.all(Int, Positive)

describe.concurrent("Brand", () => {
  it("nominal", () => {
    const Int = Brand.nominal<Int>()
    assert.strictEqual(Int(1), 1)
  })

  it("refined", () => {
    assert.strictEqual(Int.of(1), 1)
    assert.throws(() => Int.of(1.1))
    assert.deepStrictEqual(Int.option(1), Option.some(1))
    assert.deepStrictEqual(Int.option(1.1), Option.none)
    assert.deepStrictEqual(Int.either(1), Either.right(1 as Int))
    assert.deepStrictEqual(
      Int.either(1.1),
      Either.left(Brand.error("Expected 1.1 to be an integer"))
    )
    assert.isTrue(Int.refine(1))
    assert.isFalse(Int.refine(1.1))
  })

  it("composition", () => {
    assert.strictEqual(PositiveInt.of(1), 1)
    assert.throws(() => PositiveInt.of(1.1))
    assert.deepStrictEqual(PositiveInt.option(1), Option.some(1))
    assert.deepStrictEqual(PositiveInt.option(1.1), Option.none)
    assert.deepStrictEqual(PositiveInt.either(1), Either.right(1 as PositiveInt))
    assert.deepStrictEqual(
      PositiveInt.either(1.1),
      Either.left(Brand.error("Expected 1.1 to be an integer"))
    )
    assert.deepStrictEqual(
      PositiveInt.either(-1.1),
      Either.left(Brand.errors(
        Brand.error("Expected -1.1 to be an integer"),
        Brand.error("Expected -1.1 to be positive")
      ))
    )
    assert.isTrue(PositiveInt.refine(1))
    assert.isFalse(PositiveInt.refine(1.1))
  })
})
