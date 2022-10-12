import { pipe } from "@fp-ts/core/Function"
import * as C from "@fp-ts/data/Chunk"
import { deepEqual } from "@fp-ts/data/DeepEqual"

describe("Chunk", () => {
  it("append", () => {
    pipe(
      C.empty,
      C.append(0),
      C.append(1),
      C.append(2),
      deepEqual(C.unsafeFromArray([0, 1, 2])),
      assert.isTrue
    )
  })

  it("prepend", () => {
    pipe(
      C.empty,
      C.prepend(0),
      C.prepend(1),
      C.prepend(2),
      deepEqual(C.unsafeFromArray([2, 1, 0])),
      assert.isTrue
    )
  })

  it("concat", () => {
    pipe(
      C.unsafeFromArray([0, 1]),
      C.concat(C.unsafeFromArray([2, 3])),
      deepEqual(C.unsafeFromArray([0, 1, 2, 3])),
      assert.isTrue
    )
  })
})
