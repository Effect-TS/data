import { pipe } from "@fp-ts/core/Function"
import * as Option from "@fp-ts/core/Option"
import * as Equal from "@fp-ts/data/Equal"
import * as Hash from "@fp-ts/data/Hash"
import * as HM from "@fp-ts/data/HashMap"
import { deepStrictEqual } from "@fp-ts/data/test/util"
import { inspect } from "node:util"

class Key implements Equal.Equal {
  constructor(readonly n: number) {}

  [Hash.symbol](): number {
    return Hash.hash(this.n)
  }

  [Equal.symbol](u: unknown): boolean {
    return u instanceof Key && this.n === u.n
  }
}

class Value implements Equal.Equal {
  constructor(readonly s: string) {}

  [Hash.symbol](): number {
    return Hash.hash(this.s)
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

  it("option", () => {
    const map = HM.make([Option.some(1), 0], [Option.none(), 1])
    expect(pipe(map, HM.has(Option.none()))).toBe(true)
    expect(pipe(map, HM.has(Option.some(1)))).toBe(true)
    expect(pipe(map, HM.has(Option.some(2)))).toBe(false)
  })

  it("toString", () => {
    const map = HM.make([0, "a"])
    expect(String(map)).toEqual("HashMap([0, a])")
  })

  it("toJSON", () => {
    const map = HM.make([0, "a"])
    expect(JSON.stringify(map)).toEqual(JSON.stringify({ _tag: "HashMap", values: [[0, "a"]] }))
  })

  it("inspect", () => {
    const map = HM.make([0, "a"])
    expect(inspect(map)).toEqual(inspect({ _tag: "HashMap", values: [[0, "a"]] }))
  })

  it("has", () => {
    const map = HM.make([key(0), value("a")])

    assert.isTrue(HM.has(key(0))(map))
    assert.isFalse(HM.has(key(1))(map))
  })

  it("hasHash", () => {
    const map = HM.make([key(0), value("a")])

    assert.isTrue(HM.hasHash(key(0), Hash.hash(key(0)))(map))
    assert.isFalse(HM.hasHash(key(1), Hash.hash(key(0)))(map))
  })

  it("get", () => {
    const map = HM.make([key(0), value("a")])

    deepStrictEqual(HM.get(key(0))(map), Option.some(value("a")))
    deepStrictEqual(HM.get(key(1))(map), Option.none())
  })

  it("getHash", () => {
    const map = HM.make([key(0), value("a")])

    deepStrictEqual(HM.getHash(key(0), Hash.hash(0))(map), Option.some(value("a")))
    deepStrictEqual(HM.getHash(key(1), Hash.hash(0))(map), Option.none())
  })

  it("set", () => {
    const map = pipe(HM.empty<Key, Value>(), HM.set(key(0), value("a")))

    deepStrictEqual(HM.get(key(0))(map), Option.some(value("a")))
  })

  it("mutation", () => {
    let map = HM.empty()
    assert.propertyVal(map, "_editable", false)
    map = HM.beginMutation(map)
    assert.propertyVal(map, "_editable", true)
    map = HM.endMutation(map)
    assert.propertyVal(map, "_editable", false)
  })

  it("mutate", () => {
    const map = HM.empty<number, string>()
    const result = pipe(
      map,
      HM.mutate((map) => {
        pipe(map, HM.set(0, "a"))
      })
    )

    deepStrictEqual(HM.get(0)(result), Option.some("a"))
    deepStrictEqual(HM.get(1)(result), Option.none())
  })

  it("flatMap", () => {
    const map = HM.make([key(0), value("a")], [key(1), value("bb")])
    const result = pipe(
      map,
      HM.flatMap(({ s }) => {
        const newKey = key(s.length)
        const newValue = value(s)
        return pipe(HM.empty<Key, Value>(), HM.set(newKey, newValue))
      })
    )

    deepStrictEqual(HM.get(key(1))(result), Option.some(value("a")))
    deepStrictEqual(HM.get(key(2))(result), Option.some(value("bb")))
    deepStrictEqual(HM.get(key(3))(result), Option.none())
  })

  it("flatMapWithIndex", () => {
    const map = HM.make([key(1), value("a")], [key(2), value("bb")])
    const result = pipe(
      map,
      HM.flatMapWithIndex(({ s }, { n }) => {
        const newKey = key(s.length + n)
        const newValue = value(s)
        return pipe(HM.empty<Key, Value>(), HM.set(newKey, newValue))
      })
    )

    deepStrictEqual(HM.get(key(2))(result), Option.some(value("a")))
    deepStrictEqual(HM.get(key(4))(result), Option.some(value("bb")))
    deepStrictEqual(HM.get(key(6))(result), Option.none())
  })

  it("filterMap", () => {
    const map = HM.make([key(0), value("a")], [key(1), value("bb")])
    const result = pipe(
      map,
      HM.filterMap(({ s }) => s.length > 1 ? Option.some(value(s)) : Option.none())
    )

    deepStrictEqual(HM.get(key(0))(result), Option.none())
    deepStrictEqual(HM.get(key(1))(result), Option.some(value("bb")))
  })

  it("collectWithIndex", () => {
    const map = HM.make([key(0), value("a")], [key(1), value("bb")])
    const result = pipe(
      map,
      HM.filterMapWithIndex((v, { n }) => n > 0 ? Option.some(v) : Option.none())
    )

    deepStrictEqual(HM.get(key(0))(result), Option.none())
    deepStrictEqual(HM.get(key(1))(result), Option.some(value("bb")))
  })

  it("compact", () => {
    const map = HM.make([0, Option.some("a")], [1, Option.none()])
    const result = HM.compact(map)

    assert.strictEqual(HM.unsafeGet(0)(result), "a")
    assert.throws(() => HM.unsafeGet(1)(result))
  })

  it("filter", () => {
    const map = HM.make([key(0), value("a")], [key(1), value("bb")])
    const result = pipe(map, HM.filter(({ s }) => s.length > 1))

    deepStrictEqual(HM.get(key(0))(result), Option.none())
    deepStrictEqual(HM.get(key(1))(result), Option.some(value("bb")))
  })

  it("filterWithIndex", () => {
    const map = HM.make([key(0), value("a")], [key(1), value("bb")])
    const result = pipe(map, HM.filterWithIndex(({ s }, { n }) => n > 0 && s.length > 0))

    deepStrictEqual(HM.get(key(0))(result), Option.none())
    deepStrictEqual(HM.get(key(1))(result), Option.some(value("bb")))
  })

  it("forEach", () => {
    const map = HM.make([key(0), value("a")], [key(1), value("b")])
    const result: Array<string> = []
    pipe(
      map,
      HM.forEach((v) => {
        result.push(v.s)
      })
    )

    deepStrictEqual(result, ["a", "b"])
  })

  it("forEachWithIndex", () => {
    const map = HM.make([key(0), value("a")], [key(1), value("b")])
    const result: Array<readonly [number, string]> = []
    pipe(
      map,
      HM.forEachWithIndex(({ s }, { n }) => {
        result.push([n, s])
      })
    )

    deepStrictEqual(result, [[0, "a"], [1, "b"]])
  })

  it("isEmpty", () => {
    assert.isTrue(HM.isEmpty(HM.make()))
    assert.isFalse(HM.isEmpty(HM.make([key(0), value("a")])))
  })

  it("keys", () => {
    const map = HM.make([0, "a"], [1, "b"])
    const result = Array.from(HM.keys(map))

    deepStrictEqual(result, [0, 1])
  })

  it("keySet", () => {
    const hashMap = HM.make(
      [key(0), value("a")],
      [key(1), value("b")],
      [key(1), value("c")]
    )

    const result = HM.keySet(hashMap)

    assert.deepEqual([...result], [key(0), key(1)])
  })

  it("map", () => {
    const map = HM.make([key(0), value("a")], [key(1), value("bb")])
    const result = pipe(map, HM.map(({ s }) => s.length))

    deepStrictEqual(HM.get(key(0))(result), Option.some(1))
    deepStrictEqual(HM.get(key(1))(result), Option.some(2))
    deepStrictEqual(HM.get(key(2))(result), Option.none())
  })

  it("mapWithIndex", () => {
    const map = HM.make([key(0), value("a")], [key(1), value("bb")])
    const result = pipe(map, HM.mapWithIndex(({ s }, { n }) => n + s.length))

    deepStrictEqual(HM.get(key(0))(result), Option.some(1))
    deepStrictEqual(HM.get(key(1))(result), Option.some(3))
    deepStrictEqual(HM.get(key(2))(result), Option.none())
  })

  it("modifyAt", () => {
    const map = HM.make([key(0), value("a")], [key(1), value("b")])
    const result = pipe(
      map,
      HM.modifyAt(key(0), (maybe) =>
        Option.isSome(maybe) ?
          Option.some(value("test")) :
          Option.none())
    )

    deepStrictEqual(HM.get(key(0))(result), Option.some(value("test")))
    deepStrictEqual(HM.get(key(1))(result), Option.some(value("b")))
    deepStrictEqual(HM.get(key(2))(result), Option.none())

    deepStrictEqual(
      HM.get(key(0))(pipe(
        map,
        HM.modifyAt(key(0), (): Option.Option<Value> => Option.none())
      )),
      Option.none()
    )
  })

  it("modifyHash", () => {
    const map = HM.make([key(0), value("a")], [key(1), value("b")])
    const result = pipe(
      map,
      HM.modifyHash(key(0), Hash.hash(key(0)), (maybe) =>
        Option.isSome(maybe) ?
          Option.some(value("test")) :
          Option.none())
    )

    deepStrictEqual(HM.get(key(0))(result), Option.some(value("test")))
    deepStrictEqual(HM.get(key(1))(result), Option.some(value("b")))
    deepStrictEqual(HM.get(key(2))(result), Option.none())
  })

  it("reduce", () => {
    const map = HM.make([key(0), value("a")], [key(1), value("b")])
    const result = pipe(map, HM.reduce("", (acc, { s }) => acc.length > 0 ? `${acc},${s}` : s))

    assert.strictEqual(result, "a,b")
  })

  it("reduceWithIndex", () => {
    const map = HM.make([key(0), value("a")], [key(1), value("b")])
    const result = pipe(
      map,
      HM.reduceWithIndex(
        "",
        (acc, { s }, { n }) => acc.length > 0 ? `${acc},${n}:${s}` : `${n}:${s}`
      )
    )

    assert.strictEqual(result, "0:a,1:b")
  })

  it("remove", () => {
    const map = HM.make([key(0), value("a")], [key(1), value("b")])
    const result = pipe(map, HM.remove(key(0)))

    deepStrictEqual(HM.get(key(0))(result), Option.none())
    deepStrictEqual(HM.get(key(1))(result), Option.some(value("b")))
  })

  it("remove non existing key doesn't change the array", () => {
    const map = HM.make([13, 95], [90, 4])
    const result = pipe(map, HM.remove(75))

    deepStrictEqual(Array.from(HM.keySet(map)), Array.from(HM.keySet(result)))
  })

  it("removeMany", () => {
    const map = HM.make([key(0), value("a")], [key(1), value("b")])
    const result = pipe(map, HM.removeMany([key(0), key(1)]))

    assert.isFalse(HM.isEmpty(map))
    assert.isTrue(HM.isEmpty(result))
  })

  it("size", () => {
    const map = HM.make([key(0), value("a")], [key(1), value("b")])
    const result = HM.size(map)

    assert.strictEqual(result, 2)
  })

  it("union", () => {
    const map1 = HM.make([0, "a"], [1, "b"])
    const map2 = HM.make(["foo", true], ["bar", false])
    const result = HM.union(map2)(map1)

    deepStrictEqual(
      pipe(result, HM.get(0)),
      Option.some("a")
    )
    deepStrictEqual(
      pipe(result, HM.get(1)),
      Option.some("b")
    )
    deepStrictEqual(
      pipe(result, HM.get("foo")),
      Option.some(true)
    )
    deepStrictEqual(
      pipe(result, HM.get("bar")),
      Option.some(false)
    )
  })

  it("modify", () => {
    const map = HM.make([key(0), value("a")], [key(1), value("b")])
    const result = pipe(map, HM.modify(key(0), ({ s }) => value(`${s}-${s}`)))

    deepStrictEqual(HM.get(key(0))(result), Option.some(value("a-a")))
    deepStrictEqual(HM.get(key(1))(result), Option.some(value("b")))
    deepStrictEqual(HM.get(key(2))(result), Option.none())

    deepStrictEqual(
      HM.get(key(2))(pipe(map, HM.modify(key(2), ({ s }) => value(`${s}-${s}`)))),
      Option.none()
    )
  })

  it("values", () => {
    const map = HM.make([key(0), value("a")], [key(1), value("b")])
    const result = Array.from(HM.values(map))

    deepStrictEqual(result, [value("a"), value("b")])
  })
})
