import type { Option } from "@fp-ts/core/data/Option"
import type { Kind, TypeClass, TypeLambda } from "@fp-ts/core/HKT"
import type { Covariant } from "@fp-ts/core/typeclass/Covariant"
import type { FlatMap } from "@fp-ts/core/typeclass/FlatMap"
import type { Foldable } from "@fp-ts/core/typeclass/Foldable"
import type { Order } from "@fp-ts/core/typeclass/Order"
import * as C from "@fp-ts/data/Chunk"
import { hole, identity, pipe } from "@fp-ts/data/Function"
import * as L from "@fp-ts/data/List"
import * as O from "@fp-ts/data/Option"
import type { Predicate } from "@fp-ts/data/Predicate"
import * as RA from "@fp-ts/data/ReadonlyArray"
import * as S from "@fp-ts/data/String"

export interface ReadonlyArrayLike<F extends TypeLambda> extends TypeClass<F> {
  readonly fromIterable: <A>(self: Iterable<A>) => Kind<F, unknown, never, never, A>
  readonly toIterable: <R, O, E, A>(self: Kind<F, R, O, E, A>) => Iterable<A>
  readonly take: (n: number) => <R, O, E, A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A>
  readonly reverse: <R, O, E, A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A>
  readonly drop: (n: number) => <R, O, E, A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A>
  readonly prepend: <B>(
    b: B
  ) => <R, O, E, A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A | B>
  readonly prependAll: <R, O, E, B>(
    prefix: Kind<F, R, O, E, B>
  ) => <A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A | B>
  readonly concat: <R, O, E, B>(
    prefix: Kind<F, R, O, E, B>
  ) => <A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A | B>
  readonly splitAt: (
    n: number
  ) => <R, O, E, A>(
    self: Kind<F, R, O, E, A>
  ) => readonly [Kind<F, R, O, E, A>, Kind<F, R, O, E, A>]
  readonly head: <R, O, E, A>(self: Kind<F, R, O, E, A>) => Option<A>
  readonly tail: <R, O, E, A>(self: Kind<F, R, O, E, A>) => Option<Kind<F, R, O, E, A>>
  readonly some: <A>(predicate: Predicate<A>) => <R, O, E>(self: Kind<F, R, O, E, A>) => boolean
  readonly every: <A>(predicate: Predicate<A>) => <R, O, E>(self: Kind<F, R, O, E, A>) => boolean
  readonly findFirst: <A>(
    predicate: Predicate<A>
  ) => <R, O, E>(self: Kind<F, R, O, E, A>) => Option<A>
  readonly map: Covariant<F>["map"]
  readonly flatMap: FlatMap<F>["flatMap"]
  readonly reduce: Foldable<F>["reduce"]
  readonly sort: <A>(O: Order<A>) => <R, O, E>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A>
}

export const ReadonlyArray: ReadonlyArrayLike<RA.ReadonlyArrayTypeLambda> = {
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
  map: RA.map,
  flatMap: RA.flatMap,
  reduce: RA.reduce,
  sort: RA.sort
}

export const List: ReadonlyArrayLike<L.ListTypeLambda> = {
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
  map: L.map,
  flatMap: L.flatMap,
  reduce: L.reduce,
  sort: L.sort
}

export const Chunk: ReadonlyArrayLike<C.ChunkTypeLambda> = {
  fromIterable: C.fromIterable,
  toIterable: C.toReadonlyArray,
  take: C.take,
  reverse: C.reverse,
  drop: C.drop,
  prepend: C.prepend,
  prependAll: hole, // TODO
  concat: C.concat,
  splitAt: C.splitAt,
  head: C.head,
  tail: C.tail,
  some: C.some,
  every: C.every,
  findFirst: C.findFirst,
  map: C.map,
  flatMap: C.flatMap,
  reduce: C.reduce,
  sort: C.sort
}

describe.concurrent("ReadonlyArrayLike", () => {
  it("fromIterable / toIterable", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
      const as = [1, 2, 3, 4]
      // roundtrip
      expect(F.toIterable(F.fromIterable(as)), message).toEqual(as)
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  it("take", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
      const as = [1, 2, 3, 4]
      expect(pipe(F.fromIterable(as), F.take(2), F.toIterable), message).toEqual([1, 2])
      // take(0)
      expect(pipe(F.fromIterable(as), F.take(0), F.toIterable), message).toEqual([])
      // out of bounds
      expect(pipe(F.fromIterable(as), F.take(-10), F.toIterable), message).toEqual([])
      expect(pipe(F.fromIterable(as), F.take(10), F.toIterable), message).toEqual(as)
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  it("reverse", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
      const as = [1, 2, 3, 4]
      expect(pipe(F.fromIterable(as), F.reverse, F.toIterable), message).toEqual([4, 3, 2, 1])
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  it("drop", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
      const as = [1, 2, 3, 4]
      expect(pipe(F.fromIterable(as), F.drop(2), F.toIterable), message).toEqual([3, 4])
      // drop(0)
      expect(pipe(F.fromIterable(as), F.drop(0), F.toIterable), message).toEqual(as)
      // out of bounds
      expect(pipe(F.fromIterable(as), F.drop(-10), F.toIterable), message).toEqual(as)
      expect(pipe(F.fromIterable(as), F.drop(10), F.toIterable), message).toEqual([])
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  it("prepend", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
      expect(pipe(F.fromIterable([1, 2, 3, 4]), F.prepend("a"), F.toIterable), message)
        .toEqual(["a", 1, 2, 3, 4])
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  it("prependAll", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
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
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    // TODO
    // assert(Chunk, "Chunk")
  })

  it("concat", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
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
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  it("splitAt", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
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
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  it("head", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
      expect(pipe(F.fromIterable([]), F.head), message).toEqual(O.none)
      expect(pipe(F.fromIterable([1, 2, 3, 4]), F.head), message).toEqual(O.some(1))
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  it("tail", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
      expect(pipe(F.fromIterable([]), F.tail), message).toEqual(O.none)
      expect(pipe(F.fromIterable([1, 2, 3, 4]), F.tail, O.map(F.toIterable)), message).toEqual(
        O.some([2, 3, 4])
      )
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  it("some", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
      const p = (n: number): boolean => n > 0
      expect(pipe(F.fromIterable<number>([]), F.some(p)), message).toEqual(false)
      expect(pipe(F.fromIterable<number>([-1, 1]), F.some(p)), message).toEqual(true)
      expect(pipe(F.fromIterable<number>([-1, -2]), F.some(p)), message).toEqual(false)
      expect(pipe(F.fromIterable<number>([-1, -2, 3]), F.some(p)), message).toEqual(true)
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  it("every", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
      const p = (n: number): boolean => n > 0
      expect(pipe(F.fromIterable<number>([]), F.every(p)), message).toEqual(true)
      expect(pipe(F.fromIterable<number>([-1, 1]), F.every(p)), message).toEqual(false)
      expect(pipe(F.fromIterable<number>([1, 2]), F.every(p)), message).toEqual(true)
      expect(pipe(F.fromIterable<number>([-1, -2, 3]), F.every(p)), message).toEqual(false)
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  it("findFirst", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
      const p = (n: number): boolean => n > 0
      expect(pipe(F.fromIterable<number>([]), F.findFirst(p)), message).toEqual(O.none)
      expect(pipe(F.fromIterable<number>([-1, 1]), F.findFirst(p)), message).toEqual(O.some(1))
      expect(pipe(F.fromIterable<number>([1, 2]), F.findFirst(p)), message).toEqual(O.some(1))
      expect(pipe(F.fromIterable<number>([-1, -2, 3]), F.findFirst(p)), message).toEqual(O.some(3))
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  it("map", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
      expect(pipe(F.fromIterable<number>([]), F.map((n) => n * 2), F.toIterable), message)
        .toEqual([])
      expect(pipe(F.fromIterable<number>([1, 2, 3, 4]), F.map((n) => n * 2), F.toIterable), message)
        .toEqual([2, 4, 6, 8])
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  it("flatMap", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
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
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  it("reduce", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
      expect(
        pipe(F.fromIterable<string>([]), F.reduce("-", (b, a) => b + a)),
        message
      ).toEqual("-")
      expect(
        pipe(F.fromIterable<string>(["a", "b", "c"]), F.reduce("-", (b, a) => b + a)),
        message
      ).toEqual("-abc")
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })

  it("sort", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
      expect(
        pipe(F.fromIterable<string>([]), F.sort(S.Order), F.toIterable),
        message
      ).toEqual([])
      expect(
        pipe(F.fromIterable<string>(["a", "b", "c", "d"]), F.sort(S.Order), F.toIterable),
        message
      ).toEqual(["a", "b", "c", "d"])
      expect(
        pipe(F.fromIterable<string>(["a", "c", "d", "b"]), F.sort(S.Order), F.toIterable),
        message
      ).toEqual(["a", "b", "c", "d"])
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
    assert(Chunk, "Chunk")
  })
})
