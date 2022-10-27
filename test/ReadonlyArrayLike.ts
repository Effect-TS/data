import type { Kind, TypeClass, TypeLambda } from "@fp-ts/core/HKT"
import * as C from "@fp-ts/data/Chunk"
import { identity, pipe } from "@fp-ts/data/Function"
import * as L from "@fp-ts/data/List"
import * as RA from "@fp-ts/data/ReadonlyArray"

export interface ReadonlyArrayLike<F extends TypeLambda> extends TypeClass<F> {
  readonly fromIterable: <A>(self: Iterable<A>) => Kind<F, unknown, never, never, A>
  readonly toIterable: <R, O, E, A>(self: Kind<F, R, O, E, A>) => Iterable<A>
  readonly take: (n: number) => <R, O, E, A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A>
  readonly reverse: <R, O, E, A>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, A>
}

export const ReadonlyArray: ReadonlyArrayLike<RA.ReadonlyArrayTypeLambda> = {
  fromIterable: RA.fromIterable,
  toIterable: identity,
  take: RA.take,
  reverse: RA.reverse
}

export const List: ReadonlyArrayLike<L.ListTypeLambda> = {
  fromIterable: L.fromIterable,
  toIterable: L.toReadonlyArray,
  take: L.take,
  reverse: L.reverse
}

export const Chunk: ReadonlyArrayLike<C.ChunkTypeLambda> = {
  fromIterable: C.fromIterable,
  toIterable: C.toReadonlyArray,
  take: C.take,
  reverse: C.reverse
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
  })

  it("reverse", () => {
    const assert = <F extends TypeLambda>(F: ReadonlyArrayLike<F>, message: string) => {
      const as = [1, 2, 3, 4]
      expect(pipe(F.fromIterable(as), F.reverse, F.toIterable), message).toEqual([4, 3, 2, 1])
    }
    assert(ReadonlyArray, "ReadonlyArray")
    assert(List, "List")
  })
})
