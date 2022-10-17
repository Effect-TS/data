import { pipe } from "@fp-ts/data/Function"
import * as Option from "@fp-ts/data/Option"
import * as ReadonlyArray from "@fp-ts/data/ReadonlyArray"
import * as Result from "@fp-ts/data/Result"
import { deepStrictEqual } from "@fp-ts/data/test/util"
import * as Filterable from "@fp-ts/data/typeclasses/Filterable"

describe.concurrent("Filterable", () => {
  it("getFilterableComposition", () => {
    const filter = Filterable.filter(ReadonlyArray.Filterable)

    deepStrictEqual(pipe([1, 2, 3, 4], filter((a) => a > 1)), [2, 3, 4])

    const filterMap = Filterable.filterMapComposition(
      ReadonlyArray.Functor,
      ReadonlyArray.Filterable
    )

    deepStrictEqual(
      pipe(
        [["a", "bb"], ["ccc", "dddd"]],
        filterMap(
          (a) => (a.length > 1 ? Option.some(a.length) : Option.none)
        )
      ),
      [[2], [3, 4]]
    )

    const partition = Filterable.partition(ReadonlyArray.Filterable)

    deepStrictEqual(
      pipe(
        ["a", "bb", "ccc", "dddd"],
        partition((a) => a.length % 2 === 0)
      ),
      [["a", "ccc"], ["bb", "dddd"]]
    )

    const partitionMap = Filterable.partitionMap(ReadonlyArray.Filterable)

    deepStrictEqual(
      pipe(
        ["a", "bb", "ccc", "dddd"],
        partitionMap(
          (a) => (a.length % 2 === 0 ? Result.succeed(a.length) : Result.fail(a))
        )
      ),
      [["a", "ccc"], [2, 4]]
    )
  })
})
