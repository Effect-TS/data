import * as ReadonlyArray from "@fp-ts/data/ReadonlyArray"
import * as Result from "@fp-ts/data/Result"
import { deepStrictEqual } from "@fp-ts/data/test/util"
import * as Compactable from "@fp-ts/data/typeclasses/Compactable"

describe.concurrent("Compactable", () => {
  it("separate", () => {
    const separate = Compactable.separate(ReadonlyArray.Functor, ReadonlyArray.Compactable)
    deepStrictEqual(separate([]), [[], []])
    deepStrictEqual(separate([Result.fail(123), Result.succeed("123")]), [[123], ["123"]])
  })
})
