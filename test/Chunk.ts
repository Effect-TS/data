import * as C from "@fp-ts/data/Chunk"
import { equals } from "@fp-ts/data/Equal"
import { pipe } from "@fp-ts/data/Function"
import * as O from "@fp-ts/data/Option"

describe.concurrent("Chunk", () => {
  describe("fromIterable", () => {
    describe("Given an iterable", () => {
      const myIterable = {
        [Symbol.iterator]() {
          let i = 0

          return {
            next() {
              i++
              return { value: i, done: i > 5 }
            }
          }
        }
      }

      it("should process it", () => {
        expect(C.fromIterable(myIterable)).toEqual(C.unsafeFromArray([1, 2, 3, 4, 5]))
      })
    })
  })

  describe("get", () => {
    describe("Given a Chunk and an index within the bounds", () => {
      const chunk = C.unsafeFromArray([1, 2, 3])
      const index = 0

      it("should a Some with the value", () => {
        expect(pipe(
          chunk,
          C.get(index)
        )).toEqual(O.some(1))
      })
    })

    describe("Given a Chunk and an index out of bounds", () => {
      const chunk = C.unsafeFromArray([1, 2, 3])

      it("should return a None", () => {
        expect(pipe(chunk, C.get(4))).toEqual(O.none)
      })
    })
  })

  describe("unsafeGet", () => {
    describe("Given an empty Chunk and an index", () => {
      const chunk = C.empty
      const index = 4

      it("should throw", () => {
        expect(() => pipe(chunk, C.unsafeGet(index))).toThrow()
      })
    })

    describe("Given an appended Chunk and an index out of bounds", () => {
      const chunk = pipe(C.empty, C.append(1))
      const index = 4

      it("should throw", () => {
        expect(() => pipe(chunk, C.unsafeGet(index))).toThrow()
      })
    })

    describe("Given a prepended Chunk and an index out of bounds", () => {
      const chunk = pipe(C.empty, C.prepend(1))
      const index = 4

      it("should throw", () => {
        expect(() => pipe(chunk, C.unsafeGet(index))).toThrow()
      })
    })

    describe("Given a singleton Chunk and an index out of bounds", () => {
      const chunk = pipe(C.single(1))
      const index = 4

      it("should throw", () => {
        expect(() => pipe(chunk, C.unsafeGet(index))).toThrow()
      })
    })

    describe("Given an array Chunk and an index out of bounds", () => {
      const chunk = pipe(C.unsafeFromArray([1, 2]))
      const index = 4

      it("should throw", () => {
        expect(() => pipe(chunk, C.unsafeGet(index))).toThrow()
      })
    })

    describe("Given a concat Chunk and an index out of bounds", () => {
      const chunk = pipe(C.unsafeFromArray([1]), C.concat(C.unsafeFromArray([2, 3])))
      const index = 4

      it("should throw", () => {
        expect(() => pipe(chunk, C.unsafeGet(index))).toThrow()
      })
    })

    describe("Given an appended Chunk and an index in bounds", () => {
      const chunk = pipe(C.empty, C.append(1), C.append(2))
      const index = 1

      it("should return the value", () => {
        expect(pipe(chunk, C.unsafeGet(index))).toEqual(2)
      })
    })

    describe("Given a prepended Chunk and an index in bounds", () => {
      const chunk = pipe(C.empty, C.prepend(2), C.prepend(1))
      const index = 1

      it("should return the value", () => {
        expect(pipe(chunk, C.unsafeGet(index))).toEqual(2)
      })
    })

    describe("Given a singleton Chunk and an index in bounds", () => {
      const chunk = pipe(C.single(1))
      const index = 0

      it("should return the value", () => {
        expect(pipe(chunk, C.unsafeGet(index))).toEqual(1)
      })
    })

    describe("Given an array Chunk and an index in bounds", () => {
      const chunk = pipe(C.unsafeFromArray([1, 2, 3]))
      const index = 1

      it("should return the value", () => {
        expect(pipe(chunk, C.unsafeGet(index))).toEqual(2)
      })
    })

    describe("Given a concat Chunk and an index in bounds", () => {
      const chunk = pipe(C.unsafeFromArray([1]), C.concat(C.unsafeFromArray([2, 3])))
      const index = 1

      it("should return the value", () => {
        expect(pipe(chunk, C.unsafeGet(index))).toEqual(2)
      })
    })
  })

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

  describe("take", () => {
    describe("Given a Chunk with more elements than the amount taken", () => {
      const chunk = C.unsafeFromArray([1, 2, 3])
      const amount = 2

      it("should return the subset", () => {
        expect(pipe(chunk, C.take(amount))).toEqual(C.unsafeFromArray([
          1,
          2
        ]))
      })
    })

    describe("Given a Chunk with fewer elements than the amount taken", () => {
      const chunk = C.unsafeFromArray([1, 2, 3])
      const amount = 5

      it("should return the available subset", () => {
        expect(pipe(chunk, C.take(amount))).toEqual(C.unsafeFromArray([
          1,
          2,
          3
        ]))
      })
    })

    describe("Given a slice Chunk with and an amount", () => {
      const chunk = pipe(C.unsafeFromArray([1, 2, 3, 4, 5]), C.take(4))
      const amount = 3

      it("should return the available subset", () => {
        expect(pipe(chunk, C.take(amount))).toEqual(C.unsafeFromArray([
          1,
          2,
          3
        ]))
      })
    })

    describe("Given a singleton Chunk with and an amount > 1", () => {
      const chunk = C.single(1)
      const amount = 2

      it("should return the available subset", () => {
        expect(pipe(chunk, C.take(amount))).toEqual(C.unsafeFromArray([
          1
        ]))
      })
    })
  })

  describe("dropRight", () => {
    describe("Given a Chunk and an amount to drop below the length", () => {
      const chunk = C.unsafeFromArray([1, 2, 3])
      const toDrop = 1

      it("should remove the given amount of items", () => {
        expect(pipe(chunk, C.dropRight(toDrop))).toEqual(C.unsafeFromArray([1, 2]))
      })
    })

    describe("Given a Chunk and an amount to drop above the length", () => {
      const chunk = C.unsafeFromArray([1, 2])
      const toDrop = 3

      it("should return an empty chunk", () => {
        expect(pipe(chunk, C.dropRight(toDrop))).toEqual(C.unsafeFromArray([]))
      })
    })
  })

  describe("dropWhile", () => {
    describe("Given a Chunk and a criteria that applies to part of the chunk", () => {
      const chunk = C.unsafeFromArray([1, 2, 3])
      const criteria = (n: number) => n < 3

      it("should return the subset that doesn't pass the criteria", () => {
        expect(pipe(chunk, C.dropWhile(criteria))).toEqual(C.unsafeFromArray([3]))
      })
    })

    describe("Given a Chunk and a criteria that applies to the whole chunk", () => {
      const chunk = C.unsafeFromArray([1, 2, 3])
      const criteria = (n: number) => n < 4

      it("should return an empty chunk", () => {
        expect(pipe(chunk, C.dropWhile(criteria))).toEqual(C.unsafeFromArray([]))
      })
    })
  })

  describe("concat", () => {
    describe("Given 2 chunks of the same length", () => {
      const chunk1 = C.unsafeFromArray([0, 1])
      const chunk2 = C.unsafeFromArray([2, 3])

      it("should concatenate them following order", () => {
        expect(pipe(chunk1, C.concat(chunk2))).toEqual(C.unsafeFromArray([0, 1, 2, 3]))
      })
    })

    describe("Given 2 chunks where the first one has more elements than the second one", () => {
      const chunk1 = C.unsafeFromArray([1, 2])
      const chunk2 = C.unsafeFromArray([3])

      it("should concatenate them following order", () => {
        expect(pipe(chunk1, C.concat(chunk2))).toEqual(C.unsafeFromArray([1, 2, 3]))
      })
    })

    describe("Given 2 chunks where the first one has fewer elements than the second one", () => {
      const chunk1 = C.unsafeFromArray([1])
      const chunk2 = C.unsafeFromArray([2, 3, 4])

      it("should concatenate them following order", () => {
        expect(pipe(chunk1, C.concat(chunk2))).toEqual(C.unsafeFromArray([1, 2, 3, 4]))
      })
    })

    describe("Given 2 chunks where the first one is appended", () => {
      const chunk1 = pipe(
        C.empty,
        C.append(1)
      )
      const chunk2 = C.unsafeFromArray([2, 3, 4])

      it("should concatenate them following order", () => {
        expect(pipe(chunk1, C.concat(chunk2))).toEqual(C.unsafeFromArray([1, 2, 3, 4]))
      })
    })

    describe("Given 2 chunks where the second one is appended", () => {
      const chunk1 = C.unsafeFromArray([1])
      const chunk2 = pipe(
        C.empty,
        C.prepend(2)
      )

      it("should concatenate them following order", () => {
        expect(pipe(chunk1, C.concat(chunk2))).toEqual(C.unsafeFromArray([1, 2]))
      })
    })

    describe("Given 2 chunks where the first one is empty", () => {
      const chunk1 = C.empty
      const chunk2 = C.unsafeFromArray([1, 2])

      it("should concatenate them following order", () => {
        expect(pipe(chunk1, C.concat(chunk2))).toEqual(C.unsafeFromArray([1, 2]))
      })
    })

    describe("Given 2 chunks where the second one is empty", () => {
      const chunk1 = C.unsafeFromArray([1, 2])
      const chunk2 = C.empty

      it("should concatenate them following order", () => {
        expect(pipe(chunk1, C.concat(chunk2))).toEqual(C.unsafeFromArray([1, 2]))
      })
    })

    describe("Given several chunks concatenated with each", () => {
      const chunk1 = C.empty
      const chunk2 = C.unsafeFromArray([1])
      const chunk3 = C.unsafeFromArray([2])
      const chunk4 = C.unsafeFromArray([3, 4])
      const chunk5 = C.unsafeFromArray([5, 6])

      it("should concatenate them following order", () => {
        expect(pipe(chunk1, C.concat(chunk2), C.concat(chunk3), C.concat(chunk4), C.concat(chunk5)))
          .toEqual(C.unsafeFromArray([1, 2, 3, 4, 5, 6]))
      })
    })
    // TODO add tests for 100% coverage: left & right diff depths & depth > 0
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
