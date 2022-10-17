import * as Eq from "@fp-ts/data/Equal"
import { pipe } from "@fp-ts/data/Function"
import * as N from "@fp-ts/data/Number"
import * as O from "@fp-ts/data/Option"
import * as SM from "@fp-ts/data/SortedMap"

class Key implements Eq.Equal {
  constructor(readonly id: number) {}

  [Eq.symbolHash](): number {
    return Eq.hash(this.id)
  }

  [Eq.symbolEqual](u: unknown): boolean {
    return u instanceof Key && this.id === u.id
  }
}

class Value implements Eq.Equal {
  constructor(readonly id: number) {}

  [Eq.symbolHash](): number {
    return Eq.hash(this.id)
  }

  [Eq.symbolEqual](u: unknown): boolean {
    return u instanceof Value && this.id === u.id
  }
}

function key(n: number): Key {
  return new Key(n)
}

function value(n: number): Value {
  return new Value(n)
}

function makeSortedMap(...numbers: Array<readonly [number, number]>): SM.SortedMap<Key, Value> {
  const entries = numbers.map(([k, v]) => [key(k), value(v)] as const)
  return SM.from({
    compare: (that: Key) => (self: Key) => self.id > that.id ? 1 : self.id < that.id ? -1 : 0
  })(entries)
}

describe.concurrent("SortedMap", () => {
  test("entries", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    const result = Array.from(map)

    assert.isTrue(
      Eq.equals(result, [
        [key(0), value(10)],
        [key(1), value(20)],
        [key(2), value(30)]
      ])
    )
  })

  it("get", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    assert.deepEqual(pipe(map, SM.get(key(0))), O.some(value(10)))
    assert.deepEqual(pipe(map, SM.get(key(4))), O.none)
  })

  it("has", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    assert.isTrue(pipe(map, SM.has(key(0))))
    assert.isFalse(pipe(map, SM.has(key(4))))
  })

  it("headOption", () => {
    const map1 = makeSortedMap([0, 10], [1, 20], [2, 30])
    const map2 = SM.empty<number, number>(N.Sortable)

    assert.deepEqual(SM.headOption(map1), O.some([key(0), value(10)] as const))
    assert.deepEqual(SM.headOption(map2), O.none)
  })

  it("isEmpty", () => {
    const map1 = makeSortedMap([0, 10], [1, 20], [2, 30])
    const map2 = SM.empty<number, number>(N.Sortable)

    assert.isFalse(SM.isEmpty(map1))
    assert.isTrue(SM.isEmpty(map2))
  })

  it("isNonEmpty", () => {
    const map1 = makeSortedMap([0, 10], [1, 20], [2, 30])
    const map2 = SM.empty<number, number>(N.Sortable)

    assert.isTrue(SM.isNonEmpty(map1))
    assert.isFalse(SM.isNonEmpty(map2))
  })

  it("keys", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    const result = Array.from(SM.keys(map))

    assert.deepEqual(result, [key(0), key(1), key(2)])
  })

  it("map", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    const result = Array.from(pipe(map, SM.map((value) => value.id)))

    assert.deepEqual(
      result,
      [
        [key(0), 10],
        [key(1), 20],
        [key(2), 30]
      ]
    )
  })

  it("mapWithIndex", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    const result = Array.from(pipe(map, SM.mapWithIndex((key, value) => key.id + value.id)))

    assert.deepEqual(
      result,
      [
        [key(0), 10],
        [key(1), 21],
        [key(2), 32]
      ]
    )
  })

  it("reduce", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    const result = pipe(map, SM.reduce("", (acc, value) => acc + value.id))

    assert.strictEqual(result, "102030")
  })

  it("reduceWithIndex", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    const result = pipe(map, SM.reduceWithIndex("", (acc, key, value) => acc + key.id + value.id))

    assert.strictEqual(result, "010120230")
  })

  it("remove", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    assert.isTrue(pipe(map, SM.has(key(0))))

    const result1 = pipe(map, SM.remove(key(0)))

    assert.isFalse(pipe(result1, SM.has(key(0))))
  })

  it("set", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    assert.isFalse(pipe(map, SM.has(key(4))))

    const result1 = pipe(map, SM.set(key(4), value(40)))

    assert.isTrue(pipe(result1, SM.has(key(4))))
  })

  it("size", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    assert.strictEqual(SM.size(map), 3)
  })

  it("values", () => {
    const map = makeSortedMap([0, 10], [1, 20], [2, 30])

    const result = Array.from(SM.values(map))

    assert.deepEqual(result, [value(10), value(20), value(30)])
  })
})
