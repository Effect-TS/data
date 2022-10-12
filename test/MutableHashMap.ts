import { pipe } from "@fp-ts/core/Function"
import * as O from "@fp-ts/core/Option"
import { DeepEqual, deepEqual } from "@fp-ts/data/DeepEqual"
import { DeepHash, deepHash } from "@fp-ts/data/DeepHash"
import * as HM from "@fp-ts/data/MutableHashMap"

class Key implements DeepEqual {
  constructor(readonly a: number, readonly b: number) {}

  [DeepHash.symbol]() {
    return deepHash(`${this.a}-${this.b}`)
  }

  [DeepEqual.symbol](that: unknown): boolean {
    return that instanceof Key && this.a === that.a && this.b === that.b
  }
}

class Value implements DeepEqual {
  constructor(readonly c: number, readonly d: number) {}

  [DeepHash.symbol]() {
    return deepHash(`${this.c}-${this.d}`)
  }

  [DeepEqual.symbol](that: unknown): boolean {
    return that instanceof Value && this.c === that.c && this.d === that.d
  }
}

function key(a: number, b: number): Key {
  return new Key(a, b)
}

function value(c: number, d: number): Value {
  return new Value(c, d)
}

describe.concurrent("MutableHashMap", () => {
  it("from", () => {
    const map = HM.make(
      [key(0, 0), value(0, 0)],
      [key(1, 1), value(1, 1)]
    )

    assert.strictEqual(HM.size(map), 2)
    assert.isTrue(pipe(map, HM.has(key(0, 0))))
    assert.isTrue(pipe(map, HM.has(key(1, 1))))
  })

  it("get", () => {
    const map = pipe(
      HM.empty<Key, Value>(),
      HM.set(key(0, 0), value(0, 0)),
      HM.set(key(0, 0), value(1, 1))
    )

    const result = pipe(
      map,
      HM.get(key(0, 0))
    )

    pipe(
      result,
      deepEqual(O.some(value(1, 1))),
      assert.isTrue
    )
  })

  it("has", () => {
    const map = HM.MutableHashMap(
      [key(0, 0), value(0, 0)],
      [key(0, 0), value(1, 1)],
      [key(1, 1), value(2, 2)],
      [key(1, 1), value(3, 3)],
      [key(0, 0), value(4, 4)]
    )

    pipe(
      map,
      HM.has(key(0, 0)),
      assert.isTrue
    )

    pipe(
      map,
      HM.has(key(1, 1)),
      assert.isTrue
    )

    pipe(
      map,
      HM.has(key(4, 4)),
      assert.isFalse
    )
  })

  it("modify", () => {
    const map = pipe(
      HM.empty<Key, Value>(),
      HM.set(key(0, 0), value(0, 0)),
      HM.set(key(1, 1), value(1, 1))
    )

    pipe(
      map,
      HM.modify(
        key(0, 0),
        () => O.some(value(0, 1))
      )
    )

    assert.strictEqual(HM.size(map), 2)

    pipe(
      map,
      HM.get(key(0, 0)),
      deepEqual(O.some(value(0, 1))),
      assert.isTrue
    )

    pipe(
      map,
      HM.modify(
        key(2, 2),
        O.match(() => O.some(value(2, 2)), O.some)
      )
    )

    assert.strictEqual(HM.size(map), 3)

    pipe(
      map,
      HM.get(key(2, 2)),
      deepEqual(O.some(value(2, 2))),
      assert.isTrue
    )
  })

  it("remove", () => {
    const map = pipe(
      HM.empty<Key, Value>(),
      HM.set(key(0, 0), value(0, 0)),
      HM.set(key(1, 1), value(1, 1))
    )

    assert.strictEqual(HM.size(map), 2)

    pipe(
      map,
      HM.has(key(1, 1)),
      assert.isTrue
    )

    pipe(
      map,
      HM.remove(key(1, 1))
    )

    assert.strictEqual(HM.size(map), 1)

    pipe(
      map,
      HM.has(key(1, 1)),
      assert.isFalse
    )
  })

  it("set", () => {
    const map = pipe(
      HM.empty<Key, Value>(),
      HM.set(key(0, 0), value(0, 0)),
      HM.set(key(0, 0), value(1, 1)),
      HM.set(key(1, 1), value(2, 2)),
      HM.set(key(1, 1), value(3, 3)),
      HM.set(key(0, 0), value(4, 4))
    )

    assert.isTrue(
      deepEqual(Array.from(map), [
        [key(0, 0), value(4, 4)],
        [key(1, 1), value(3, 3)]
      ])
    )
  })

  it("size", () => {
    const map = pipe(
      HM.empty<Key, Value>(),
      HM.set(key(0, 0), value(0, 0)),
      HM.set(key(0, 0), value(1, 1)),
      HM.set(key(1, 1), value(2, 2)),
      HM.set(key(1, 1), value(3, 3)),
      HM.set(key(0, 0), value(4, 4))
    )

    assert.strictEqual(HM.size(map), 2)
  })

  it("update", () => {
    const map = pipe(
      HM.empty<Key, Value>(),
      HM.set(key(0, 0), value(0, 0)),
      HM.set(key(1, 1), value(1, 1))
    )

    pipe(
      map,
      HM.update(key(0, 0), (v) => value(v.c + 1, v.d + 1))
    )

    pipe(
      map,
      HM.get(key(0, 0)),
      deepEqual(O.some(value(1, 1))),
      assert.isTrue
    )
  })
})
