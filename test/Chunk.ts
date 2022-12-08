import * as C from "@fp-ts/data/Chunk"
import { equals } from "@fp-ts/data/Equal"
import { pipe } from "@fp-ts/data/Function"
import * as O from "@fp-ts/data/Option"
import * as fc from "fast-check"

describe.concurrent("Chunk", () => {
  it("modifyOption", () => {
    expect(pipe(C.empty(), C.modifyOption(0, (n: number) => n * 2))).toEqual(O.none)
    expect(pipe(C.make(1, 2, 3), C.modifyOption(0, (n: number) => n * 2))).toEqual(
      O.some(C.make(2, 2, 3))
    )
  })

  it("modify", () => {
    expect(pipe(C.empty(), C.modify(0, (n: number) => n * 2))).toEqual(C.empty())
    expect(pipe(C.make(1, 2, 3), C.modify(0, (n: number) => n * 2))).toEqual(C.make(2, 2, 3))
  })

  it("replaceOption", () => {
    expect(pipe(C.empty(), C.replaceOption(0, 2))).toEqual(O.none)
    expect(pipe(C.make(1, 2, 3), C.replaceOption(0, 2))).toEqual(O.some(C.make(2, 2, 3)))
  })

  it("replace", () => {
    expect(pipe(C.empty(), C.replace(0, 2))).toEqual(C.empty())
    expect(pipe(C.make(1, 2, 3), C.replace(0, 2))).toEqual(C.make(2, 2, 3))
  })

  it("remove", () => {
    expect(pipe(C.empty(), C.remove(0))).toEqual(C.empty())
    expect(pipe(C.make(1, 2, 3), C.remove(0))).toEqual(C.make(2, 3))
  })

  it("chunksOf", () => {
    expect(pipe(C.empty(), C.chunksOf(2))).toEqual(C.empty())
    expect(pipe(C.make(1, 2, 3, 4, 5), C.chunksOf(2))).toEqual(
      C.make(C.make(1, 2), C.make(3, 4), C.make(5))
    )
    expect(pipe(C.make(1, 2, 3, 4, 5, 6), C.chunksOf(2))).toEqual(
      C.make(C.make(1, 2), C.make(3, 4), C.make(5, 6))
    )
    expect(pipe(C.make(1, 2, 3, 4, 5), C.chunksOf(1))).toEqual(
      C.make(C.make(1), C.make(2), C.make(3), C.make(4), C.make(5))
    )
    expect(pipe(C.make(1, 2, 3, 4, 5), C.chunksOf(5))).toEqual(
      C.make(C.make(1, 2, 3, 4, 5))
    )
    // out of bounds
    expect(pipe(C.make(1, 2, 3, 4, 5), C.chunksOf(0))).toEqual(
      C.make(C.make(1), C.make(2), C.make(3), C.make(4), C.make(5))
    )
    expect(pipe(C.make(1, 2, 3, 4, 5), C.chunksOf(-1))).toEqual(
      C.make(C.make(1), C.make(2), C.make(3), C.make(4), C.make(5))
    )
    expect(pipe(C.make(1, 2, 3, 4, 5), C.chunksOf(10))).toEqual(
      C.make(C.make(1, 2, 3, 4, 5))
    )
  })

  describe("toReadonlyArray", () => {
    describe("Given an empty Chunk", () => {
      const chunk = C.empty()
      it("should give back an empty readonly array", () => {
        expect(C.toReadonlyArray(chunk)).toEqual([])
      })
    })
  })

  describe("is", () => {
    describe("Given a chunk", () => {
      const chunk = C.make(0, 1)
      it("should be true", () => {
        expect(C.isChunk(chunk)).toBe(true)
      })
    })
    describe("Given an object", () => {
      const object = {}
      it("should be false", () => {
        expect(C.isChunk(object)).toBe(false)
      })
    })
  })

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
      const chunk = C.empty()
      const index = 4

      it("should throw", () => {
        expect(() => pipe(chunk, C.unsafeGet(index))).toThrow()
      })
    })

    describe("Given an appended Chunk and an index out of bounds", () => {
      const chunk = pipe(C.empty(), C.append(1))
      const index = 4

      it("should throw", () => {
        expect(() => pipe(chunk, C.unsafeGet(index))).toThrow()
      })
    })

    describe("Given an appended Chunk and an index in bounds", () => {
      it("should return the value", () => {
        const chunk = pipe(C.make(0, 1, 2), C.append(3))
        expect(C.unsafeGet(1)(chunk)).toEqual(1)
      })
    })

    describe("Given a prepended Chunk and an index out of bounds", () => {
      it("should throw", () => {
        fc.assert(fc.property(fc.array(fc.anything()), (array) => {
          let chunk: C.Chunk<unknown> = C.empty()
          array.forEach((e) => {
            chunk = pipe(chunk, C.prepend(e))
          })
          expect(() => pipe(chunk, C.unsafeGet(array.length))).toThrow()
        }))
      })
    })

    describe("Given a prepended Chunk and an index in bounds", () => {
      it("should return the value", () => {
        const chunk = pipe(C.make(0, 1, 2), C.prepend(3))
        expect(C.unsafeGet(1)(chunk)).toEqual(0)
      })
    })

    describe("Given a singleton Chunk and an index out of bounds", () => {
      const chunk = pipe(C.make(1))
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
      it("should throw", () => {
        fc.assert(fc.property(fc.array(fc.anything()), fc.array(fc.anything()), (arr1, arr2) => {
          const chunk: C.Chunk<unknown> = C.concat(C.fromIterable(arr2))(C.unsafeFromArray(arr1))
          expect(() => pipe(chunk, C.unsafeGet(arr1.length + arr2.length))).toThrow()
        }))
      })
    })

    describe("Given an appended Chunk and an index in bounds", () => {
      const chunk = pipe(C.empty(), C.append(1), C.append(2))
      const index = 1

      it("should return the value", () => {
        expect(pipe(chunk, C.unsafeGet(index))).toEqual(2)
      })
    })

    describe("Given a prepended Chunk and an index in bounds", () => {
      const chunk = pipe(C.empty(), C.prepend(2), C.prepend(1))
      const index = 1

      it("should return the value", () => {
        expect(pipe(chunk, C.unsafeGet(index))).toEqual(2)
      })
    })

    describe("Given a singleton Chunk and an index in bounds", () => {
      const chunk = pipe(C.make(1))
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
      it("should return the value", () => {
        fc.assert(fc.property(fc.array(fc.anything()), fc.array(fc.anything()), (a, b) => {
          const c = [...a, ...b]
          const d = C.concat(C.unsafeFromArray(b))(C.unsafeFromArray(a))
          for (let i = 0; i < c.length; i++) {
            expect(C.unsafeGet(i)(d)).toEqual(c[i])
          }
        }))
      })
    })
  })

  it("append", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        fc.array(fc.integer(), { minLength: 0, maxLength: 120, size: "xlarge" }),
        (a, b) => {
          let chunk = C.unsafeFromArray(a)
          b.forEach((e) => {
            chunk = C.append(e)(chunk)
          })
          expect(C.toReadonlyArray(chunk)).toEqual([...a, ...b])
        }
      )
    )
  })

  it("prepend", () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer()),
        fc.array(fc.integer(), { minLength: 0, maxLength: 120, size: "xlarge" }),
        (a, b) => {
          let chunk = C.unsafeFromArray(a)
          for (let i = b.length - 1; i >= 0; i--) {
            chunk = C.prepend(b[i])(chunk)
          }
          expect(C.toReadonlyArray(chunk)).toEqual([...b, ...a])
        }
      )
    )
  })

  describe("take", () => {
    describe("Given a Chunk with more elements than the amount taken", () => {
      it("should return the subset", () => {
        expect(pipe(C.unsafeFromArray([1, 2, 3]), C.take(2)))
          .toEqual(C.unsafeFromArray([1, 2]))
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
      const chunk = C.make(1)
      const amount = 2

      it("should return the available subset", () => {
        expect(pipe(chunk, C.take(amount))).toEqual(C.unsafeFromArray([
          1
        ]))
      })
    })
  })

  describe("make", () => {
    it("should return a NonEmptyChunk", () => {
      expect(C.make(0, 1).length).toStrictEqual(2)
    })
  })

  describe("singleton", () => {
    it("should return a NonEmptyChunk", () => {
      expect(C.singleton(1).length).toStrictEqual(1)
    })
    it("should return a ISingleton", () => {
      expect(C.singleton(1).backing._tag).toEqual("ISingleton")
    })
  })

  describe("drop", () => {
    it("should return self on 0", () => {
      const self = C.make(0, 1)
      expect(C.drop(0)(self)).toStrictEqual(self)
    })
    it("should drop twice", () => {
      const self = C.make(0, 1, 2, 3)
      expect(C.toReadonlyArray(C.drop(1)(C.drop(1)(self)))).toEqual([2, 3])
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
        C.empty(),
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
        C.empty(),
        C.prepend(2)
      )

      it("should concatenate them following order", () => {
        expect(pipe(chunk1, C.concat(chunk2))).toEqual(C.unsafeFromArray([1, 2]))
      })
    })

    describe("Given 2 chunks where the first one is empty", () => {
      const chunk1 = C.empty()
      const chunk2 = C.unsafeFromArray([1, 2])

      it("should concatenate them following order", () => {
        expect(pipe(chunk1, C.concat(chunk2))).toEqual(C.unsafeFromArray([1, 2]))
      })
    })

    describe("Given 2 chunks where the second one is empty", () => {
      const chunk1 = C.unsafeFromArray([1, 2])
      const chunk2 = C.empty()

      it("should concatenate them following order", () => {
        expect(pipe(chunk1, C.concat(chunk2))).toEqual(C.unsafeFromArray([1, 2]))
      })
    })

    describe("Given several chunks concatenated with each", () => {
      const chunk1 = C.empty()
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

  it("unfold", () => {
    pipe(
      C.unfold(5, (n) => (n > 0 ? O.some([n, n - 1]) : O.none)),
      equals(C.unsafeFromArray([5, 4, 3, 2, 1])),
      assert.isTrue
    )
  })

  it("zip", () => {
    pipe(
      C.empty(),
      C.zip(C.empty()),
      equals(C.unsafeFromArray([])),
      assert.isTrue
    )
    pipe(
      C.empty(),
      C.zip(C.singleton(1)),
      equals(C.unsafeFromArray([])),
      assert.isTrue
    )
    pipe(
      C.singleton(1),
      C.zip(C.empty()),
      equals(C.unsafeFromArray([])),
      assert.isTrue
    )
    pipe(
      C.singleton(1),
      C.zip(C.singleton(2)),
      equals(C.unsafeFromArray([[1, 2]])),
      assert.isTrue
    )
  })

  it("zipWithIndex", () => {
    pipe(
      C.empty(),
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
      C.empty(),
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
