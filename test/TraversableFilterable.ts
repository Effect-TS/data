import * as Either from "@fp-ts/data/Either"
import { pipe } from "@fp-ts/data/Function"
import * as Option from "@fp-ts/data/Option"
import * as ReadonlyArray from "@fp-ts/data/ReadonlyArray"
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
      ReadonlyArray.Covariant,
      ReadonlyArray.Compactable
    )(Option.Monoidal)

    deepStrictEqual(
      pipe(
        ["a", "bb", "ccc", "dddd"],
        traversePartitionMap((n) =>
          n.length < 3 ? Option.some(Either.left(n)) : Option.some(Either.right(n.length))
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
    )(Either.Monoidal)

    deepStrictEqual(
      pipe(
        [1, 2, 3, 4],
        traverseFilterMap((_) => Either.right(Option.none))
      ),
      Either.right([])
    )
    deepStrictEqual(
      pipe(
        [1, 2, 3, 4],
        traverseFilterMap((n) => Either.right(Option.some(n)))
      ),
      Either.right([1, 2, 3, 4])
    )
    deepStrictEqual(
      pipe(
        [1, 2, 3, 4],
        traverseFilterMap((n) => Either.left(n))
      ),
      Either.left(1)
    )
  })
})
