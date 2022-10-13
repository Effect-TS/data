import { pipe } from "@fp-ts/core/Function"
import * as Result from "@fp-ts/core/Result"
import * as Chunk from "@fp-ts/data/Chunk"
import * as Differ from "@fp-ts/data/Differ"
import { equals } from "@fp-ts/data/Equal"
import { it as it_ } from "vitest"

function diffLaws<Value, Patch>(
  differ: Differ.Differ<Value, Patch>,
  gen: () => Value,
  equal: (a: Value, b: Value) => boolean
): void {
  const it = (name: string, f: () => void) =>
    it_(name, () => {
      for (let i = 0; i < 100; i++) {
        f()
      }
    })

  describe.concurrent("differ laws", () => {
    it("combining patches is associative", () => {
      const value1 = gen()
      const value2 = gen()
      const value3 = gen()
      const value4 = gen()
      const patch1 = differ.diff(value1, value2)
      const patch2 = differ.diff(value2, value3)
      const patch3 = differ.diff(value3, value4)
      const left = differ.combine(differ.combine(patch1, patch2), patch3)
      const right = differ.combine(patch1, differ.combine(patch2, patch3))
      assert.isTrue(equal(differ.patch(left, value1), differ.patch(right, value1)))
    })

    it("combining a patch with an empty patch is an identity", () => {
      const oldValue = gen()
      const newValue = gen()
      const patch = differ.diff(oldValue, newValue)
      const left = differ.combine(patch, differ.empty)
      const right = differ.combine(differ.empty, patch)
      assert.isTrue(equal(differ.patch(left, oldValue), newValue))
      assert.isTrue(equal(differ.patch(right, oldValue), newValue))
    })

    it("diffing a value with itself returns an empty patch", () => {
      const value = gen()
      assert.deepStrictEqual(differ.diff(value, value), differ.empty)
    })

    it("diffing and then patching is an identity", () => {
      const oldValue = gen()
      const newValue = gen()
      const patch = differ.diff(oldValue, newValue)
      assert.isTrue(equal(differ.patch(patch, oldValue), newValue))
    })

    it("patching with an empty patch is an identity", () => {
      const value = gen()
      assert.isTrue(equal(differ.patch(differ.empty, value), value))
    })
  })
}

const min = 1
const max = 100

function smallInt(): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function randomChunk(): Chunk.Chunk<number> {
  return Chunk.fromIterable(Array.from({ length: 20 }, smallInt))
}

// function randomHashMap(): HashMap<number, number> {
//   return HashMap.from(Chunk.fill(2, smallInt).zip(Chunk.fill(2, smallInt)))
// }

// function randomHashSet(): HashSet<number> {
//   return HashSet.from(Chunk.fill(20, smallInt))
// }

function randomResult(): Result.Result<number, number> {
  return Math.random() < 0.5 ? Result.fail(smallInt()) : Result.succeed(smallInt())
}

function randomTuple(): readonly [number, number] {
  return [smallInt(), smallInt()]
}

describe.concurrent("Differ", () => {
  describe.concurrent("chunk", () => {
    diffLaws(
      Differ.chunk<number, (n: number) => number>(Differ.update()),
      randomChunk,
      equals
    )
  })

  describe.concurrent("result", () => {
    diffLaws(
      pipe(Differ.update<number>(), Differ.orElseResult(Differ.update<number>())),
      randomResult,
      equals
    )
  })

  // describe.concurrent("hashMap", () => {
  //   diffLaws(
  //     Differ.hashMap<number, number, (n: number) => number>(Differ.update<number>()),
  //     randomHashMap,
  //     equals
  //   )
  // })

  // describe.concurrent("hashSet", () => {
  //   diffLaws(
  //     Differ.hashSet<number>(),
  //     randomHashSet,
  //     equals
  //   )
  // })

  describe.concurrent("tuple", () => {
    diffLaws(
      pipe(Differ.update<number>(), Differ.zip(Differ.update<number>())),
      randomTuple,
      equals
    )
  })
})
