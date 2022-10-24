import * as C from "@fp-ts/data/Chunk"
import { equals } from "@fp-ts/data/Equal"
import { pipe } from "@fp-ts/data/Function"

describe.concurrent("Chunk", () => {
  it("append", () => {
    pipe(
      C.empty,
      C.append(0),
      C.append(1),
      C.append(2),
      equals(C.unsafeFromArray([0, 1, 2])),
      assert.isTrue
    )
  })

  it("prepend", () => {
    pipe(
      C.empty,
      C.prepend(0),
      C.prepend(1),
      C.prepend(2),
      equals(C.unsafeFromArray([2, 1, 0])),
      assert.isTrue
    )
  })

  it("concat", () => {
    pipe(
      C.unsafeFromArray([0, 1]),
      C.concat(C.unsafeFromArray([2, 3])),
      equals(C.unsafeFromArray([0, 1, 2, 3])),
      assert.isTrue
    )
  })

  it("zipWithIndex", () => {
    pipe(
      C.empty,
      C.zipWithIndex,
      equals(C.unsafeFromArray([])),
      assert.isTrue
    )
    pipe(
      C.unsafeFromArray([1, 2, 3, 4]),
      C.zipWithIndex,
      equals(C.unsafeFromArray([[1, 0], [2, 1], [3, 2], [4, 3]])),
      assert.isTrue
    )
  })

  it("zipWithIndexOffset", () => {
    pipe(
      C.empty,
      C.zipWithIndexOffset(5),
      equals(C.unsafeFromArray([]))
    )
    pipe(
      C.unsafeFromArray([1, 2, 3, 4]),
      C.zipWithIndexOffset(5),
      equals(C.unsafeFromArray([[1, 5], [2, 6], [3, 7], [4, 8]])),
      assert.isTrue
    )
  })
})
