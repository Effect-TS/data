import { pipe } from "@fp-ts/data/Function"
import * as Option from "@fp-ts/data/Option"
import * as ReadonlyArray from "@fp-ts/data/ReadonlyArray"
import * as Result from "@fp-ts/data/Result"
import { deepStrictEqual } from "@fp-ts/data/test/util"
import * as TraversableFilterable from "@fp-ts/data/typeclasses/TraversableFilterable"

describe.concurrent("TraversableFilterable", () => {
  it("traversePartition", () => {
    const traversePartition = TraversableFilterable.traversePartition(
      ReadonlyArray.TraversableFilterable
    )(Option.Monoidal)

    deepStrictEqual(
      pipe(
        [1, 2, 3, 4],
        traversePartition((_) => Option.none)
      ),
      Option.none
    )
    deepStrictEqual(
      pipe(
        [1, 2, 3, 4],
        traversePartition((n) => Option.some(n >= 3))
      ),
      Option.some([[1, 2], [3, 4]] as const)
    )
  })

  it("traversePartitionMap", () => {
    const traversePartitionMap = TraversableFilterable.traversePartitionMap(
      ReadonlyArray.Traversable,
      ReadonlyArray.Functor,
      ReadonlyArray.Compactable
    )(Option.Monoidal)

    deepStrictEqual(
      pipe(
        ["a", "bb", "ccc", "dddd"],
        traversePartitionMap((n) =>
          n.length < 3 ? Option.some(Result.fail(n)) : Option.some(Result.succeed(n.length))
        )
      ),
      Option.some([["a", "bb"], [3, 4]] as const)
    )
    deepStrictEqual(
      pipe(
        ["a", "bb", "ccc", "dddd"],
        traversePartitionMap((_) => Option.none)
      ),
      Option.none
    )
  })

  it("traverseFilter", () => {
    const traverseFilter = TraversableFilterable.traverseFilter(
      ReadonlyArray.TraversableFilterable
    )(Option.Monoidal)

    deepStrictEqual(
      pipe(
        [1, 2, 3, 4],
        traverseFilter((_) => Option.none)
      ),
      Option.none
    )
    deepStrictEqual(
      pipe(
        [1, 2, 3, 4],
        traverseFilter((n) => Option.some(n < 3))
      ),
      Option.some([1, 2])
    )
  })

  it("traverseFilterMap", () => {
    const traverseFilterMap = TraversableFilterable.traverseFilterMap(
      ReadonlyArray.Traversable,
      ReadonlyArray.Compactable
    )(Result.Monoidal)

    deepStrictEqual(
      pipe(
        [1, 2, 3, 4],
        traverseFilterMap((_) => Result.succeed(Option.none))
      ),
      Result.succeed([])
    )
    deepStrictEqual(
      pipe(
        [1, 2, 3, 4],
        traverseFilterMap((n) => Result.succeed(Option.some(n)))
      ),
      Result.succeed([1, 2, 3, 4])
    )
    deepStrictEqual(
      pipe(
        [1, 2, 3, 4],
        traverseFilterMap((n) => Result.fail(n))
      ),
      Result.fail(1)
    )
  })
})
