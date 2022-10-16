import * as Equal from "@fp-ts/data/Equal"
import { pipe } from "@fp-ts/data/Function"
import * as Hash from "@fp-ts/data/Hash"
import * as HashMap from "@fp-ts/data/HashMap"
import * as Option from "@fp-ts/data/Option"
import { deepStrictEqual } from "@fp-ts/data/test/util"

class Key implements Equal.Equal {
  constructor(readonly n: number) {}

  [Hash.symbol](): number {
    return Hash.evaluate(this.n)
  }

  [Equal.symbol](u: unknown): boolean {
    return u instanceof Key && this.n === u.n
  }
}

class Value implements Equal.Equal {
  constructor(readonly s: string) {}

  [Hash.symbol](): number {
    return Hash.evaluate(this.s)
  }

  [Equal.symbol](u: unknown): boolean {
    return u instanceof Value && this.s === u.s
  }
}

describe.concurrent("HashMap", () => {
  function key(n: number): Key {
    return new Key(n)
  }

  function value(s: string): Value {
    return new Value(s)
  }

  it("has", () => {
    const map = HashMap.make([key(0), value("a")])

    assert.isTrue(HashMap.has(key(0))(map))
    assert.isFalse(HashMap.has(key(1))(map))
  })

  it("hasHash", () => {
    const map = HashMap.make([key(0), value("a")])

    assert.isTrue(HashMap.hasHash(key(0), Hash.evaluate(key(0)))(map))
    assert.isFalse(HashMap.hasHash(key(1), Hash.evaluate(key(0)))(map))
  })

  it("get", () => {
    const map = HashMap.make([key(0), value("a")])

    deepStrictEqual(HashMap.get(key(0))(map), Option.some(value("a")))
    deepStrictEqual(HashMap.get(key(1))(map), Option.none)
  })

  it("getHash", () => {
    const map = HashMap.make([key(0), value("a")])

    deepStrictEqual(HashMap.getHash(key(0), Hash.evaluate(0))(map), Option.some(value("a")))
    deepStrictEqual(HashMap.getHash(key(1), Hash.evaluate(0))(map), Option.none)
  })

  it("set", () => {
    const map = pipe(HashMap.empty<Key, Value>(), HashMap.set(key(0), value("a")))

    deepStrictEqual(HashMap.get(key(0))(map), Option.some(value("a")))
  })

  it("mutation", () => {
    let map = HashMap.empty()
    assert.propertyVal(map, "_editable", false)
    map = HashMap.beginMutation(map)
    assert.propertyVal(map, "_editable", true)
    map = HashMap.endMutation(map)
    assert.propertyVal(map, "_editable", false)
  })

  it("mutate", () => {
    const map = HashMap.empty<number, string>()
    const result = pipe(
      map,
      HashMap.mutate((map) => {
        pipe(map, HashMap.set(0, "a"))
      })
    )

    deepStrictEqual(HashMap.get(0)(result), Option.some("a"))
    deepStrictEqual(HashMap.get(1)(result), Option.none)
  })

  it("flatMap", () => {
    const map = HashMap.make([key(0), value("a")], [key(1), value("bb")])
    const result = pipe(
      map,
      HashMap.flatMap(({ s }) => {
        const newKey = key(s.length)
        const newValue = value(s)
        return pipe(HashMap.empty<Key, Value>(), HashMap.set(newKey, newValue))
      })
    )

    deepStrictEqual(HashMap.get(key(1))(result), Option.some(value("a")))
    deepStrictEqual(HashMap.get(key(2))(result), Option.some(value("bb")))
    deepStrictEqual(HashMap.get(key(3))(result), Option.none)
  })

  it("flatMapWithIndex", () => {
    const map = HashMap.make([key(1), value("a")], [key(2), value("bb")])
    const result = pipe(
      map,
      HashMap.flatMapWithIndex(({ n }, { s }) => {
        const newKey = key(s.length + n)
        const newValue = value(s)
        return pipe(HashMap.empty<Key, Value>(), HashMap.set(newKey, newValue))
      })
    )

    deepStrictEqual(HashMap.get(key(2))(result), Option.some(value("a")))
    deepStrictEqual(HashMap.get(key(4))(result), Option.some(value("bb")))
    deepStrictEqual(HashMap.get(key(6))(result), Option.none)
  })

  it("filterMap", () => {
    const map = HashMap.make([key(0), value("a")], [key(1), value("bb")])
    const result = pipe(
      map,
      HashMap.filterMap(({ s }) => s.length > 1 ? Option.some(value(s)) : Option.none)
    )

    deepStrictEqual(HashMap.get(key(0))(result), Option.none)
    deepStrictEqual(HashMap.get(key(1))(result), Option.some(value("bb")))
  })

  it("collectWithIndex", () => {
    const map = HashMap.make([key(0), value("a")], [key(1), value("bb")])
    const result = pipe(
      map,
      HashMap.filterMapWithIndex(({ n }, v) => n > 0 ? Option.some(v) : Option.none)
    )

    deepStrictEqual(HashMap.get(key(0))(result), Option.none)
    deepStrictEqual(HashMap.get(key(1))(result), Option.some(value("bb")))
  })

  it("compact", () => {
    const map = HashMap.make([0, Option.some("a")], [1, Option.none])
    const result = HashMap.compact(map)

    assert.strictEqual(HashMap.unsafeGet(0)(result), "a")
    assert.throws(() => HashMap.unsafeGet(1)(result))
  })

  it("filter", () => {
    const map = HashMap.make([key(0), value("a")], [key(1), value("bb")])
    const result = pipe(map, HashMap.filter(({ s }) => s.length > 1))

    deepStrictEqual(HashMap.get(key(0))(result), Option.none)
    deepStrictEqual(HashMap.get(key(1))(result), Option.some(value("bb")))
  })

  it("filterWithIndex", () => {
    const map = HashMap.make([key(0), value("a")], [key(1), value("bb")])
    const result = pipe(map, HashMap.filterWithIndex(({ n }, { s }) => n > 0 && s.length > 0))

    deepStrictEqual(HashMap.get(key(0))(result), Option.none)
    deepStrictEqual(HashMap.get(key(1))(result), Option.some(value("bb")))
  })

  it("forEach", () => {
    const map = HashMap.make([key(0), value("a")], [key(1), value("b")])
    const result: Array<string> = []
    pipe(
      map,
      HashMap.forEach((v) => {
        result.push(v.s)
      })
    )

    deepStrictEqual(result, ["a", "b"])
  })

  it("forEachWithIndex", () => {
    const map = HashMap.make([key(0), value("a")], [key(1), value("b")])
    const result: Array<readonly [number, string]> = []
    pipe(
      map,
      HashMap.forEachWithIndex(({ n }, { s }) => {
        result.push([n, s])
      })
    )

    deepStrictEqual(result, [[0, "a"], [1, "b"]])
  })

  it("isEmpty", () => {
    assert.isTrue(HashMap.isEmpty(HashMap.make()))
    assert.isFalse(HashMap.isEmpty(HashMap.make([key(0), value("a")])))
  })

  it("keys", () => {
    const map = HashMap.make([0, "a"], [1, "b"])
    const result = Array.from(HashMap.keys(map))

    deepStrictEqual(result, [0, 1])
  })

  // TODO:
  // it("keySet", () => {
  //   const hashMap = HashMap.make(
  //     [key(0), value("a")],
  //     [key(1), value("b")],
  //     [key(1), value("c")]
  //   )

  //   const result = hashMap.keySet

  //   assert.deepEqual([...result], [key(0), key(1)])
  // })

  it("map", () => {
    const map = HashMap.make([key(0), value("a")], [key(1), value("bb")])
    const result = pipe(map, HashMap.map(({ s }) => s.length))

    deepStrictEqual(HashMap.get(key(0))(result), Option.some(1))
    deepStrictEqual(HashMap.get(key(1))(result), Option.some(2))
    deepStrictEqual(HashMap.get(key(2))(result), Option.none)
  })

  it("mapWithIndex", () => {
    const map = HashMap.make([key(0), value("a")], [key(1), value("bb")])
    const result = pipe(map, HashMap.mapWithIndex(({ n }, { s }) => n + s.length))

    deepStrictEqual(HashMap.get(key(0))(result), Option.some(1))
    deepStrictEqual(HashMap.get(key(1))(result), Option.some(3))
    deepStrictEqual(HashMap.get(key(2))(result), Option.none)
  })

  it("modify", () => {
    const map = HashMap.make([key(0), value("a")], [key(1), value("b")])
    const result = pipe(
      map,
      HashMap.modify(key(0), (maybe) =>
        Option.isSome(maybe) ?
          Option.some(value("test")) :
          Option.none)
    )

    deepStrictEqual(HashMap.get(key(0))(result), Option.some(value("test")))
    deepStrictEqual(HashMap.get(key(1))(result), Option.some(value("b")))
    deepStrictEqual(HashMap.get(key(2))(result), Option.none)
  })

  it("modifyHash", () => {
    const map = HashMap.make([key(0), value("a")], [key(1), value("b")])
    const result = pipe(
      map,
      HashMap.modifyHash(key(0), Hash.evaluate(key(0)), (maybe) =>
        Option.isSome(maybe) ?
          Option.some(value("test")) :
          Option.none)
    )

    deepStrictEqual(HashMap.get(key(0))(result), Option.some(value("test")))
    deepStrictEqual(HashMap.get(key(1))(result), Option.some(value("b")))
    deepStrictEqual(HashMap.get(key(2))(result), Option.none)
  })

  it("reduce", () => {
    const map = HashMap.make([key(0), value("a")], [key(1), value("b")])
    const result = pipe(map, HashMap.reduce("", (acc, { s }) => acc.length > 0 ? `${acc},${s}` : s))

    assert.strictEqual(result, "a,b")
  })

  it("reduceWithIndex", () => {
    const map = HashMap.make([key(0), value("a")], [key(1), value("b")])
    const result = pipe(
      map,
      HashMap.reduceWithIndex(
        "",
        (acc, { n }, { s }) => acc.length > 0 ? `${acc},${n}:${s}` : `${n}:${s}`
      )
    )

    assert.strictEqual(result, "0:a,1:b")
  })

  it("remove", () => {
    const map = HashMap.make([key(0), value("a")], [key(1), value("b")])
    const result = pipe(map, HashMap.remove(key(0)))

    deepStrictEqual(HashMap.get(key(0))(result), Option.none)
    deepStrictEqual(HashMap.get(key(1))(result), Option.some(value("b")))
  })

  it("remove non existing key doesn't change the array", () => {
    const map = HashMap.make([13, 95], [90, 4])
    const result = pipe(map, HashMap.remove(75))

    deepStrictEqual(Array.from(HashMap.keySet(map)), Array.from(HashMap.keySet(result)))
  })

  it("removeMany", () => {
    const map = HashMap.make([key(0), value("a")], [key(1), value("b")])
    const result = pipe(map, HashMap.removeMany([key(0), key(1)]))

    assert.isFalse(HashMap.isEmpty(map))
    assert.isTrue(HashMap.isEmpty(result))
  })

  it("size", () => {
    const map = HashMap.make([key(0), value("a")], [key(1), value("b")])
    const result = HashMap.size(map)

    assert.strictEqual(result, 2)
  })

  it("union", () => {
    const map1 = HashMap.make([0, "a"], [1, "b"])
    const map2 = HashMap.make(["foo", true], ["bar", false])
    const result = HashMap.union(map2)(map1)

    deepStrictEqual(
      pipe(result, HashMap.get<number | string, string | boolean>(0)),
      Option.some("a")
    )
    deepStrictEqual(
      pipe(result, HashMap.get<number | string, string | boolean>(1)),
      Option.some("b")
    )
    deepStrictEqual(
      pipe(result, HashMap.get<number | string, string | boolean>("foo")),
      Option.some(true)
    )
    deepStrictEqual(
      pipe(result, HashMap.get<number | string, string | boolean>("bar")),
      Option.some(false)
    )
  })

  it("update", () => {
    const map = HashMap.make([key(0), value("a")], [key(1), value("b")])
    const result = pipe(map, HashMap.update(key(0), ({ s }) => value(`${s}-${s}`)))

    deepStrictEqual(HashMap.get(key(0))(result), Option.some(value("a-a")))
    deepStrictEqual(HashMap.get(key(1))(result), Option.some(value("b")))
    deepStrictEqual(HashMap.get(key(2))(result), Option.none)
  })

  it("values", () => {
    const map = HashMap.make([key(0), value("a")], [key(1), value("b")])
    const result = Array.from(HashMap.values(map))

    deepStrictEqual(result, [value("a"), value("b")])
  })
})
