import type { TypeLambda } from "@fp-ts/core/HKT"
import * as C from "@fp-ts/data/Chunk"
import { hole, identity, pipe } from "@fp-ts/data/Function"
import * as L from "@fp-ts/data/List"
import * as O from "@fp-ts/data/Option"
import * as RA from "@fp-ts/data/ReadonlyArray"
import * as S from "@fp-ts/data/String"
import type { Seq } from "@fp-ts/data/typeclass/Seq"

export const ReadonlyArray: Seq<RA.ReadonlyArrayTypeLambda> = {
  fromIterable: RA.fromIterable,
  toIterable: identity,
  take: RA.take,
  reverse: RA.reverse,
  drop: RA.drop,
  prepend: RA.prepend,
  prependAll: RA.prependAll,
  concat: RA.appendAll,
  splitAt: RA.splitAt,
  head: RA.head,
  tail: RA.tail,
  some: RA.some,
  every: RA.every,
  findFirst: RA.findFirst,
  imap: RA.imap,
  map: RA.map,
  flatMap: RA.flatMap,
  reduce: RA.reduce,
  sort: RA.sort,
  get: RA.get,
  // TODO
  unsafeGet: hole,
  size: RA.size,
  empty: RA.empty,
  append: RA.append,
  dropRight: RA.dropRight,
  dropWhile: RA.dropWhile,
  filterMap: RA.filterMap,
  filterMapWithIndex: RA.filterMapWithIndex,
  filter: RA.filter,
  // TODO
  filterMapWhile: hole,
  elem: RA.elem,
  compact: RA.compact,
  findFirstIndex: RA.findFirstIndex,
  findLastIndex: RA.findLastIndex,
  findLast: RA.findLast
}

export const List: Seq<L.ListTypeLambda> = {
  fromIterable: L.fromIterable,
  toIterable: L.toReadonlyArray,
  take: L.take,
  reverse: L.reverse,
  drop: L.drop,
  prepend: L.prepend,
  prependAll: L.prependAll,
  concat: L.concat,
  splitAt: L.splitAt,
  head: L.head,
  tail: L.tail,
  some: L.some,
  every: L.every,
  findFirst: L.findFirst,
  imap: L.imap,
  map: L.map,
  flatMap: L.flatMap,
  reduce: L.reduce,
  sort: L.sort,
  // TODO
  get: hole,
  // TODO
  unsafeGet: hole,
  // TODO
  size: hole,
  // TODO
  empty: L.empty(),
  // TODO
  append: hole,
  // TODO
  dropRight: hole,
  // TODO
  dropWhile: hole,
  // TODO
  filterMap: hole,
  // TODO
  filterMapWithIndex: hole,
  filter: L.filter,
  // TODO
  filterMapWhile: hole,
  // TODO
  elem: hole,
  compact: L.compact,
  // TODO
  findFirstIndex: hole,
  // TODO
  findLastIndex: hole,
  // TODO
  findLast: hole
}

export const Chunk: Seq<C.ChunkTypeLambda> = {
  fromIterable: C.fromIterable,
  toIterable: C.toReadonlyArray,
  take: C.take,
  reverse: C.reverse,
  drop: C.drop,
  prepend: C.prepend,
  // TODO
  prependAll: hole,
  concat: C.concat,
  splitAt: C.splitAt,
  head: C.head,
  tail: C.tail,
  some: C.some,
  every: C.every,
  findFirst: C.findFirst,
  // TODO
  imap: hole,
  map: C.map,
  flatMap: C.flatMap,
  reduce: C.reduce,
  sort: C.sort,
  get: C.get,
  unsafeGet: C.unsafeGet,
  size: C.size,
  empty: C.empty,
  append: C.append,
  dropRight: C.dropRight,
  dropWhile: C.dropWhile,
  filterMap: C.filterMap,
  filter: C.filter,
  filterMapWithIndex: C.filterMapWithIndex,
  filterMapWhile: C.filterMapWhile,
  elem: C.elem,
  compact: C.compact,
  findFirstIndex: C.findFirstIndex,
  findLastIndex: C.findLastIndex,
  findLast: C.findLast
}

describe.concurrent("Seq", () => {
  describe("fromIterable / toIterable", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        const as = [1, 2, 3, 4]
        expect(F.toIterable(F.fromIterable(as)), "roundtrip").toEqual(as)
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("take", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        const as = [1, 2, 3, 4]
        expect(pipe(F.fromIterable(as), F.take(2), F.toIterable)).toEqual([1, 2])
        // take(0)
        expect(pipe(F.fromIterable(as), F.take(0), F.toIterable)).toEqual([])
        // out of bounds
        expect(pipe(F.fromIterable(as), F.take(-10), F.toIterable)).toEqual([])
        expect(pipe(F.fromIterable(as), F.take(10), F.toIterable)).toEqual(as)
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("reverse", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        const as = [1, 2, 3, 4]
        expect(pipe(F.fromIterable(as), F.reverse, F.toIterable)).toEqual([4, 3, 2, 1])
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("drop", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        const as = [1, 2, 3, 4]
        expect(pipe(F.fromIterable(as), F.drop(2), F.toIterable)).toEqual([3, 4])
        // drop(0)
        expect(pipe(F.fromIterable(as), F.drop(0), F.toIterable)).toEqual(as)
        // out of bounds
        expect(pipe(F.fromIterable(as), F.drop(-10), F.toIterable)).toEqual(as)
        expect(pipe(F.fromIterable(as), F.drop(10), F.toIterable)).toEqual([])
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("prepend", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        expect(pipe(F.fromIterable([]), F.prepend("a"), F.toIterable))
          .toEqual(["a"])
        expect(pipe(F.fromIterable([1, 2, 3, 4]), F.prepend("a"), F.toIterable))
          .toEqual(["a", 1, 2, 3, 4])
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("prependAll", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        expect(
          pipe(F.fromIterable([1, 2]), F.prependAll(F.fromIterable(["a", "b"])), F.toIterable),
          message
        ).toEqual(["a", "b", 1, 2])
        expect(
          pipe(F.fromIterable([1, 2]), F.prependAll(F.fromIterable([])), F.toIterable),
          message
        ).toEqual([1, 2])
        expect(
          pipe(F.fromIterable([]), F.prependAll(F.fromIterable(["a", "b"])), F.toIterable),
          message
        ).toEqual(["a", "b"])
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    // TODO
    // assert(Chunk, "Chunk")
  })

  describe("concat", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        expect(
          pipe(F.fromIterable([1, 2]), F.concat(F.fromIterable(["a", "b"])), F.toIterable),
          message
        ).toEqual([1, 2, "a", "b"])
        expect(
          pipe(F.fromIterable([1, 2]), F.concat(F.fromIterable([])), F.toIterable),
          message
        ).toEqual([1, 2])
        expect(
          pipe(F.fromIterable([]), F.concat(F.fromIterable(["a", "b"])), F.toIterable),
          message
        ).toEqual(["a", "b"])
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("splitAt", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        expect(
          pipe(
            F.fromIterable([1, 2, 3, 4]),
            F.splitAt(2),
            ([left, right]) => [F.toIterable(left), F.toIterable(right)]
          ),
          message
        ).toEqual([[1, 2], [3, 4]])
        expect(
          pipe(
            F.fromIterable([1, 2, 3, 4]),
            F.splitAt(0),
            ([left, right]) => [F.toIterable(left), F.toIterable(right)]
          ),
          message
        ).toEqual([[], [1, 2, 3, 4]])
        expect(
          pipe(
            F.fromIterable([1, 2, 3, 4]),
            F.splitAt(-10),
            ([left, right]) => [F.toIterable(left), F.toIterable(right)]
          ),
          message
        ).toEqual([[], [1, 2, 3, 4]])
        expect(
          pipe(
            F.fromIterable([1, 2, 3, 4]),
            F.splitAt(4),
            ([left, right]) => [F.toIterable(left), F.toIterable(right)]
          ),
          message
        ).toEqual([[1, 2, 3, 4], []])
        expect(
          pipe(
            F.fromIterable([1, 2, 3, 4]),
            F.splitAt(10),
            ([left, right]) => [F.toIterable(left), F.toIterable(right)]
          ),
          message
        ).toEqual([[1, 2, 3, 4], []])
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("head", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        expect(pipe(F.fromIterable([]), F.head)).toEqual(O.none)
        expect(pipe(F.fromIterable([1, 2, 3, 4]), F.head)).toEqual(O.some(1))
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("tail", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        expect(pipe(F.fromIterable([]), F.tail)).toEqual(O.none)
        expect(pipe(F.fromIterable([1, 2, 3, 4]), F.tail, O.map(F.toIterable))).toEqual(
          O.some([2, 3, 4])
        )
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("some", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        const p = (n: number): boolean => n > 0
        expect(pipe(F.fromIterable<number>([]), F.some(p))).toEqual(false)
        expect(pipe(F.fromIterable<number>([-1, 1]), F.some(p))).toEqual(true)
        expect(pipe(F.fromIterable<number>([-1, -2]), F.some(p))).toEqual(false)
        expect(pipe(F.fromIterable<number>([-1, -2, 3]), F.some(p))).toEqual(true)
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("every", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        const p = (n: number): boolean => n > 0
        expect(pipe(F.fromIterable<number>([]), F.every(p))).toEqual(true)
        expect(pipe(F.fromIterable<number>([-1, 1]), F.every(p))).toEqual(false)
        expect(pipe(F.fromIterable<number>([1, 2]), F.every(p))).toEqual(true)
        expect(pipe(F.fromIterable<number>([-1, -2, 3]), F.every(p))).toEqual(false)
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("findFirst", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        const p = (n: number): boolean => n > 0
        expect(pipe(F.fromIterable<number>([]), F.findFirst(p))).toEqual(O.none)
        expect(pipe(F.fromIterable<number>([-1, 1]), F.findFirst(p))).toEqual(O.some(1))
        expect(pipe(F.fromIterable<number>([1, 2]), F.findFirst(p))).toEqual(O.some(1))
        expect(pipe(F.fromIterable<number>([-1, -2, 3]), F.findFirst(p))).toEqual(O.some(3))
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("map", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        expect(pipe(F.fromIterable<number>([]), F.map((n) => n * 2), F.toIterable))
          .toEqual([])
        expect(pipe(F.fromIterable<number>([1, 2, 3, 4]), F.map((n) => n * 2), F.toIterable))
          .toEqual([2, 4, 6, 8])
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("flatMap", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        expect(
          pipe(
            F.fromIterable<number>([]),
            F.flatMap((n) => F.fromIterable([n - 1, n + 1])),
            F.toIterable
          ),
          message
        )
          .toEqual([])
        expect(
          pipe(
            F.fromIterable([1, 2, 3, 4]),
            F.flatMap((n) => F.fromIterable([n - 1, n + 1])),
            F.toIterable
          ),
          message
        )
          .toEqual([0, 2, 1, 3, 2, 4, 3, 5])
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("reduce", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        expect(pipe(F.fromIterable<string>([]), F.reduce("-", (b, a) => b + a))).toEqual("-")
        expect(pipe(F.fromIterable<string>(["a", "b", "c"]), F.reduce("-", (b, a) => b + a)))
          .toEqual("-abc")
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("sort", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        expect(pipe(F.fromIterable<string>([]), F.sort(S.Order), F.toIterable)).toEqual([])
        expect(
          pipe(F.fromIterable<string>(["a", "b", "c", "d"]), F.sort(S.Order), F.toIterable),
          message
        ).toEqual(["a", "b", "c", "d"])
        expect(
          pipe(F.fromIterable<string>(["a", "c", "d", "b"]), F.sort(S.Order), F.toIterable),
          message
        ).toEqual(["a", "b", "c", "d"])
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("get", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        expect(pipe(F.fromIterable([]), F.get(0))).toEqual(O.none)
        expect(pipe(F.fromIterable([1, 2, 3]), F.get(-1))).toEqual(O.none)
        expect(pipe(F.fromIterable([1, 2, 3]), F.get(3))).toEqual(O.none)
        expect(pipe(F.fromIterable([1]), F.get(0))).toEqual(O.some(1))
        expect(pipe(F.fromIterable([1, 2, 3]), F.get(1))).toEqual(O.some(2))
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    // TODO
    // assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("unsafeGet", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        expect(() => pipe(F.fromIterable([]), F.unsafeGet(0))).toThrow()
        expect(() => pipe(F.fromIterable([1, 2, 3]), F.unsafeGet(-1))).toThrow()
        expect(() => pipe(F.fromIterable([1, 2, 3]), F.unsafeGet(3))).toThrow()
        expect(pipe(F.fromIterable([1]), F.unsafeGet(0))).toEqual(1)
        expect(pipe(F.fromIterable([1, 2, 3]), F.unsafeGet(1))).toEqual(2)
      })
    }
    // TODO
    // assert(ReadonlyArray, "ReadonlyArray")
    // TODO
    // assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("size", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        expect(pipe(F.fromIterable([]), F.size)).toEqual(0)
        expect(pipe(F.fromIterable([1, 2, 3]), F.size)).toEqual(3)
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    // TODO
    // assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("empty", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        expect(pipe(F.toIterable(F.empty))).toEqual([])
        expect(pipe(F.empty, F.size)).toEqual(0)
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    // TODO
    // assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("append", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        expect(pipe(F.fromIterable([]), F.append("a"), F.toIterable))
          .toEqual(["a"])
        expect(pipe(F.fromIterable([1, 2, 3, 4]), F.append("a"), F.toIterable))
          .toEqual([1, 2, 3, 4, "a"])
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    // TODO
    // assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("dropRight", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        const as = [1, 2, 3, 4]
        expect(pipe(F.fromIterable(as), F.dropRight(2), F.toIterable)).toEqual([1, 2])
        // dropRight(0)
        expect(pipe(F.fromIterable(as), F.dropRight(0), F.toIterable)).toEqual(as)
        // out of bounds
        expect(pipe(F.fromIterable(as), F.dropRight(-10), F.toIterable)).toEqual(as)
        expect(pipe(F.fromIterable(as), F.dropRight(10), F.toIterable)).toEqual([])
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    // TODO
    // assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("dropWhile", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        const as = [1, 2, 3, 4]
        expect(pipe(F.fromIterable(as), F.dropWhile((n) => n < 3), F.toIterable)).toEqual([3, 4])
        expect(pipe(F.fromIterable(as), F.dropWhile((n) => n > 0), F.toIterable)).toEqual([])
        expect(pipe(F.fromIterable(as), F.dropWhile((n) => n < 0), F.toIterable)).toEqual(as)
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    // TODO
    // assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("filterMap", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        expect(
          pipe(
            F.fromIterable([2, 4, 3, 6]),
            F.filterMap((n) => n % 2 === 0 ? O.some("a" + n) : O.none),
            F.toIterable
          )
        ).toEqual(["a2", "a4", "a6"])
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    // TODO
    // assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("filterMapWithIndex", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        expect(
          pipe(
            F.fromIterable([2, 4, 3, 6]),
            F.filterMapWithIndex((n, i) => n % 2 === 0 ? O.some("a" + n + i) : O.none),
            F.toIterable
          )
        ).toEqual(["a20", "a41", "a63"])
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    // TODO
    // assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("filter", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        expect(
          pipe(
            F.fromIterable([1, 2, 3, 4]),
            F.filter((n) => n % 2 === 0),
            F.toIterable
          )
        ).toEqual([2, 4])
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("filterMapWhile", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        expect(
          pipe(
            [2, 4, 3, 6],
            F.filterMapWhile((n) => n % 2 === 0 ? O.some("a" + n) : O.none),
            F.toIterable
          )
        ).toEqual(["a2", "a4"])
      })
    }
    // TODO
    // assert(ReadonlyArray, "ReadonlyArray")
    // TODO
    // assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("elem", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        const as = [1, 2, 3, 4]
        expect(pipe(F.fromIterable(as), F.elem("a"))).toEqual(false)
        expect(pipe(F.fromIterable(as), F.elem(3))).toEqual(true)
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    // TODO
    // assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("compact", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        expect(
          pipe(F.fromIterable([O.some(1), O.none, O.some(3), O.none]), F.compact, F.toIterable)
        ).toEqual(
          [1, 3]
        )
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("findFirstIndex", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        const p = (n: number): boolean => n > 0
        expect(pipe(F.fromIterable<number>([]), F.findFirstIndex(p))).toEqual(O.none)
        expect(pipe(F.fromIterable<number>([-1, 1]), F.findFirstIndex(p))).toEqual(O.some(1))
        expect(pipe(F.fromIterable<number>([1, 2]), F.findFirstIndex(p))).toEqual(O.some(0))
        expect(pipe(F.fromIterable<number>([-1, -2, 3]), F.findFirstIndex(p))).toEqual(O.some(2))
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    // TODO
    // assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("findLastIndex", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        const p = (n: number): boolean => n > 0
        expect(pipe(F.fromIterable<number>([]), F.findLastIndex(p))).toEqual(O.none)
        expect(pipe(F.fromIterable<number>([-1, 1]), F.findLastIndex(p))).toEqual(O.some(1))
        expect(pipe(F.fromIterable<number>([1, 2]), F.findLastIndex(p))).toEqual(O.some(1))
        expect(pipe(F.fromIterable<number>([-1, -2, 3]), F.findLastIndex(p))).toEqual(O.some(2))
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    // TODO
    // assert(List, "List")
    assert(Chunk, "Chunk")
  })

  describe("findLast", () => {
    const assert = <F extends TypeLambda>(F: Seq<F>, message: string) => {
      it(message, () => {
        const p = (n: number): boolean => n > 0
        expect(pipe(F.fromIterable<number>([]), F.findLast(p))).toEqual(O.none)
        expect(pipe(F.fromIterable<number>([-1, 1]), F.findLast(p))).toEqual(O.some(1))
        expect(pipe(F.fromIterable<number>([1, 2]), F.findLast(p))).toEqual(O.some(2))
        expect(pipe(F.fromIterable<number>([-1, -2, 3]), F.findLast(p))).toEqual(O.some(3))
      })
    }
    assert(ReadonlyArray, "ReadonlyArray")
    // TODO
    // assert(List, "List")
    assert(Chunk, "Chunk")
  })
})
