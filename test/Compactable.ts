import * as Either from "@fp-ts/data/Either"
import * as ReadonlyArray from "@fp-ts/data/ReadonlyArray"
import { deepStrictEqual } from "@fp-ts/data/test/util"
import * as Compactable from "@fp-ts/data/typeclasses/Compactable"

describe.concurrent("Compactable", () => {
  it("separate", () => {
    const separate = Compactable.separate(ReadonlyArray.Functor, ReadonlyArray.Compactable)
    deepStrictEqual(separate([]), [[], []])
    deepStrictEqual(separate([Either.left(123), Either.right("123")]), [[123], ["123"]])
  })
})
