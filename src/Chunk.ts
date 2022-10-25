/**
 * @since 1.0.0
 */

import type { Order } from "@fp-ts/core/typeclass/Order"
import type { Either } from "@fp-ts/data/Either"
import * as Equal from "@fp-ts/data/Equal"
import { identity, pipe } from "@fp-ts/data/Function"
import * as MRef from "@fp-ts/data/mutable/MutableRef"
import type { Option } from "@fp-ts/data/Option"
import * as O from "@fp-ts/data/Option"
import type { Predicate } from "@fp-ts/data/Predicate"
import * as RA from "@fp-ts/data/ReadonlyArray"
import type { Refinement } from "@fp-ts/data/Refinement"

const TypeId: unique symbol = Symbol.for("@fp-ts/data/Chunk") as TypeId

/**
 * @since 1.0.0
 * @category symbol
 */
export type TypeId = typeof TypeId

/**
 * @since 1.0.0
 * @category models
 */
export interface Chunk<A> extends Iterable<A>, Equal.Equal {
  readonly _id: TypeId
  readonly _A: (_: never) => A

  readonly length: number

  /** @internal */
  right: Chunk<A>
  /** @internal */
  left: Chunk<A>
  /** @internal */
  backing: Backing<A>
  /** @internal */
  depth: number
}

/** @internal */
type Backing<A> =
  | IArray<A>
  | IConcat<A>
  | IAppend<A>
  | ISlice<A>
  | IPrepend<A>
  | ISingleton<A>
  | IEmpty

/** @internal */
interface IArray<A> {
  readonly _tag: "IArray"
  readonly array: ReadonlyArray<A>
}

/** @internal */
interface IConcat<A> {
  readonly _tag: "IConcat"
  readonly left: Chunk<A>
  readonly right: Chunk<A>
}

/** @internal */
interface ISingleton<A> {
  readonly _tag: "ISingleton"
  readonly a: A
}

/** @internal */
interface IAppend<A> {
  readonly _tag: "IAppend"
  readonly start: Chunk<A>
  readonly buffer: Array<unknown>
  readonly bufferUsed: number
  readonly chain: MRef.MutableRef<number>
}

/** @internal */
interface IPrepend<A> {
  readonly _tag: "IPrepend"
  readonly end: Chunk<A>
  readonly buffer: Array<unknown>
  readonly bufferUsed: number
  readonly chain: MRef.MutableRef<number>
}

/** @internal */
interface ISlice<A> {
  readonly _tag: "ISlice"
  readonly chunk: Chunk<A>
  readonly offset: number
  readonly length: number
}

/** @internal */
interface IEmpty {
  readonly _tag: "IEmpty"
}

/** @internal */
const emptyArray: ReadonlyArray<never> = []

/** @internal */
function copy<A>(
  src: ReadonlyArray<A>,
  srcPos: number,
  dest: Array<A>,
  destPos: number,
  len: number
) {
  for (let i = srcPos; i < Math.min(src.length, srcPos + len); i++) {
    dest[destPos + i - srcPos] = src[i]!
  }
  return dest
}

/** @internal */
const BufferSize = 64

/** @internal */
class ChunkImpl<A> implements Chunk<A> {
  readonly _id: typeof TypeId = TypeId
  readonly _A: (_: never) => A = (_) => _

  readonly length: number
  readonly depth: number
  readonly left: Chunk<A>
  readonly right: Chunk<A>

  constructor(readonly backing: Backing<A>) {
    switch (backing._tag) {
      case "IEmpty": {
        this.length = 0
        this.depth = 0
        this.left = this
        this.right = this
        break
      }
      case "IConcat": {
        this.length = backing.left.length + backing.right.length
        this.depth = 1 + Math.max(backing.left.depth, backing.right.depth)
        this.left = backing.left
        this.right = backing.right
        break
      }
      case "IArray": {
        this.length = backing.array.length
        this.depth = 0
        this.left = empty
        this.right = empty
        break
      }
      case "IAppend": {
        this.length = this.length = backing.start.length + backing.bufferUsed
        this.depth = 0
        this.left = empty
        this.right = empty
        break
      }
      case "IPrepend": {
        this.length = this.length = backing.end.length + backing.bufferUsed
        this.depth = 0
        this.left = empty
        this.right = empty
        break
      }
      case "ISingleton": {
        this.length = 1
        this.depth = 0
        this.left = empty
        this.right = empty
        break
      }
      case "ISlice": {
        this.length = backing.length
        this.depth = 0
        this.left = empty
        this.right = empty
        break
      }
    }
  }

  [Equal.symbolEqual](that: unknown): boolean {
    return isChunk(that) && Equal.equals(toArray(this), toArray(that))
  }

  [Equal.symbolHash](): number {
    return Equal.hash(toArray(this))
  }

  [Symbol.iterator](): Iterator<A> {
    switch (this.backing._tag) {
      case "IArray": {
        return this.backing.array[Symbol.iterator]()
      }
      case "IEmpty": {
        return emptyArray[Symbol.iterator]()
      }
      default: {
        return toArray(this)[Symbol.iterator]()
      }
    }
  }
}

/** @internal */
const copyToArray = <A>(self: Chunk<A>, array: Array<any>, n: number) => {
  switch (self.backing._tag) {
    case "IEmpty": {
      break
    }
    case "IArray": {
      copy(self.backing.array, 0, array, n, self.length)
      break
    }
    case "IConcat": {
      copyToArray(self.left, array, n)
      copyToArray(self.right, array, n + self.left.length)
      break
    }
    case "IAppend": {
      copyToArray(self.backing.start, array, n)
      copy(
        self.backing.buffer as Array<A>,
        0,
        array,
        self.backing.start.length + n,
        self.backing.bufferUsed
      )
      break
    }
    case "IPrepend": {
      const length = Math.min(self.backing.bufferUsed, Math.max(array.length - n, 0))
      copy(self.backing.buffer, BufferSize - self.backing.bufferUsed, array, n, length)
      copyToArray(self.backing.end, array, n + length)
      break
    }
    case "ISingleton": {
      array[n] = self.backing.a
      break
    }
    case "ISlice": {
      let i = 0
      let j = n
      while (i < self.length) {
        array[j] = unsafeGet(i)(self)
        i += 1
        j += 1
      }
      break
    }
  }
}

/**
 * Checks if `u` is a `Chunk<unknown>`
 *
 * @since 1.0.0
 * @category constructors
 */
export const isChunk = (u: unknown): u is Chunk<unknown> =>
  typeof u === "object" && u != null && "_id" in u && u["_id"] === TypeId

/**
 * @since 1.0.0
 * @category constructors
 */
export const empty: Chunk<never> = new ChunkImpl({ _tag: "IEmpty" })

/**
 * Converts from an `Iterable<A>`
 *
 * @since 1.0.0
 * @category conversions
 */
export const fromIterable = <A>(self: Iterable<A>): Chunk<A> =>
  new ChunkImpl({
    _tag: "IArray",
    array: Array.from(self)
  })

/**
 * Converts to a `ReadonlyArray<A>`
 *
 * @since 1.0.0
 * @category conversions
 */
export const toArray = <A>(self: Chunk<A>): ReadonlyArray<A> => {
  switch (self.backing._tag) {
    case "IEmpty": {
      return emptyArray
    }
    case "IArray": {
      return self.backing.array
    }
    default: {
      const arr = new Array<A>(self.length)
      copyToArray(self, arr, 0)
      self.backing = {
        _tag: "IArray",
        array: arr
      }
      self.left = empty
      self.right = empty
      self.depth = 0
      return arr
    }
  }
}

/**
 * Gets the `n`-th element in the chunk if it exists
 *
 * @since 1.0.0
 * @category elements
 */
export const get = (n: number) =>
  <A>(self: Chunk<A>): Option<A> => n >= self.length ? O.none : O.some(unsafeGet(n)(self))

/**
 * Wraps an array into a chunk without copying, unsafe on mutable arrays
 *
 * @since 1.0.0
 * @category unsafe
 */
export const unsafeFromArray = <A>(self: ReadonlyArray<A>): Chunk<A> =>
  new ChunkImpl({
    _tag: "IArray",
    array: self
  })

/**
 * Gets an element unsafely, will throw on out of bounds
 *
 * @since 1.0.0
 * @category unsafe
 */
export const unsafeGet = (index: number) =>
  <A>(self: Chunk<A>): A => {
    switch (self.backing._tag) {
      case "IEmpty": {
        throw new Error(`Index out of bounds`)
      }
      case "ISlice": {
        return unsafeGet(index + self.backing.offset)(self.backing.chunk)
      }
      case "IAppend": {
        if (index < self.backing.start.length) {
          return unsafeGet(index)(self.backing.start)
        }
        const k = index - self.backing.start.length
        if (k >= self.backing.buffer.length || k < 0) {
          throw new Error(`Index out of bounds`)
        }
        return (self.backing.buffer as Array<A>)[k]!
      }
      case "IPrepend": {
        if (index < self.backing.bufferUsed) {
          const k = BufferSize - self.backing.bufferUsed + index
          if (k >= self.backing.buffer.length || k < 0) {
            throw new Error(`Index out of bounds`)
          }
          return (self.backing.buffer as Array<A>)[k]!
        }
        return unsafeGet(index - self.backing.bufferUsed)(self.backing.end)
      }
      case "ISingleton": {
        if (index !== 0) {
          throw new Error(`Index out of bounds`)
        }
        return self.backing.a
      }
      case "IArray": {
        if (index >= self.length || index < 0) {
          throw new Error(`Index out of bounds`)
        }
        return self.backing.array[index]!
      }
      case "IConcat": {
        return index < self.left.length
          ? unsafeGet(index)(self.left)
          : unsafeGet(index - self.left.length)(self.right)
      }
    }
  }

/**
 * Appends the value to the chunk
 *
 * @since 1.0.0
 * @category mutations
 */
export const append = <A1>(a: A1) =>
  <A>(self: Chunk<A>): Chunk<A | A1> => {
    switch (self.backing._tag) {
      case "IAppend": {
        if (
          self.backing.bufferUsed < self.backing.buffer.length &&
          MRef.compareAndSet(self.backing.bufferUsed, self.backing.bufferUsed + 1)(
            self.backing.chain
          )
        ) {
          self.backing.buffer[self.backing.bufferUsed] = a
          return new ChunkImpl({
            _tag: "IAppend",
            start: self.backing.start,
            buffer: self.backing.buffer,
            bufferUsed: self.backing.bufferUsed + 1,
            chain: self.backing.chain
          })
        } else {
          const buffer = new Array(BufferSize)
          buffer[0] = a
          const chunk = take(self.backing.bufferUsed)(
            unsafeFromArray(self.backing.buffer as Array<A1>)
          )
          return new ChunkImpl({
            _tag: "IAppend",
            start: concat(chunk)(self.backing.start),
            buffer: self.backing.buffer,
            bufferUsed: 1,
            chain: MRef.make(1)
          })
        }
      }
      default: {
        const buffer = new Array(BufferSize)
        buffer[0] = a
        return new ChunkImpl({
          _tag: "IAppend",
          buffer,
          start: self,
          bufferUsed: 1,
          chain: MRef.make(1)
        })
      }
    }
  }

/**
 * Prepends the value to the chunk
 *
 * @since 1.0.0
 * @category mutations
 */
export const prepend = <A1>(a: A1) =>
  <A>(self: Chunk<A>): Chunk<A | A1> => {
    switch (self.backing._tag) {
      case "IPrepend": {
        if (
          self.backing.bufferUsed < self.backing.buffer.length &&
          MRef.compareAndSet(self.backing.bufferUsed, self.backing.bufferUsed + 1)(
            self.backing.chain
          )
        ) {
          self.backing.buffer[BufferSize - self.backing.bufferUsed - 1] = a
          return new ChunkImpl({
            _tag: "IPrepend",
            end: self.backing.end,
            buffer: self.backing.buffer,
            bufferUsed: self.backing.bufferUsed + 1,
            chain: self.backing.chain
          })
        } else {
          const buffer = new Array(BufferSize)
          buffer[0] = a
          const chunk = take(self.backing.bufferUsed)(
            unsafeFromArray(self.backing.buffer as Array<A1>)
          )
          return new ChunkImpl({
            _tag: "IPrepend",
            end: concat(chunk)(self.backing.end),
            buffer: self.backing.buffer,
            bufferUsed: 1,
            chain: MRef.make(1)
          })
        }
      }
      default: {
        const buffer = new Array(BufferSize)
        buffer[BufferSize - 1] = a
        return new ChunkImpl({
          _tag: "IPrepend",
          buffer,
          end: self,
          bufferUsed: 1,
          chain: MRef.make(1)
        })
      }
    }
  }

/**
 * Takes the first up to `n` elements from the chunk
 *
 * @since 1.0.0
 * @category mutations
 */
export const take = (n: number) =>
  <A>(self: Chunk<A>): Chunk<A> => {
    if (n <= 0) {
      return empty
    } else if (n >= self.length) {
      return self
    } else {
      switch (self.backing._tag) {
        case "IEmpty": {
          return empty
        }
        case "ISlice": {
          return new ChunkImpl({
            _tag: "ISlice",
            chunk: self,
            length: n,
            offset: self.backing.offset
          })
        }
        case "ISingleton": {
          return self
        }
        default: {
          return new ChunkImpl({
            _tag: "ISlice",
            chunk: self,
            offset: 0,
            length: n
          })
        }
      }
    }
  }

/**
 * Drops the first up to `n` elements from the chunk
 *
 * @since 1.0.0
 * @category mutations
 */
export const drop = (n: number) =>
  <A>(self: Chunk<A>): Chunk<A> => {
    if (n <= 0) {
      return self
    } else if (n >= self.length) {
      return empty
    } else {
      const len = self.length
      switch (self.backing._tag) {
        case "IEmpty": {
          return empty
        }
        case "ISlice": {
          return new ChunkImpl({
            _tag: "ISlice",
            chunk: self.backing.chunk,
            length: self.backing.length - n,
            offset: self.backing.offset + n
          })
        }
        case "ISingleton": {
          if (n > 0) {
            return empty
          }
          return self
        }
        default: {
          return new ChunkImpl({
            _tag: "ISlice",
            chunk: self,
            offset: n,
            length: len - n
          })
        }
      }
    }
  }

/**
 * Drops the last `n` elements.
 *
 * @since 1.0.0
 * @category mutations
 */
export const dropRight = (n: number) =>
  <A>(self: Chunk<A>): Chunk<A> => pipe(self, take(Math.max(0, self.length - n)))

/**
 * Drops all elements so long as the predicate returns true.
 *
 * @since 1.0.0
 * @category mutations
 */
export const dropWhile = <A>(f: (a: A) => boolean) => {
  return (self: Chunk<A>): Chunk<A> => {
    const arr = toArray(self)
    const len = arr.length
    let i = 0
    while (i < len && f(arr[i]!)) {
      i++
    }
    return pipe(self, drop(i))
  }
}

/**
 * Concatenates the two chunks
 *
 * @since 1.0.0
 * @category mutations
 */
export const concat = <B>(that: Chunk<B>) =>
  <A>(self: Chunk<A>): Chunk<A | B> => {
    if (self.backing._tag === "IEmpty") {
      return that
    }
    if (that.backing._tag === "IEmpty") {
      return self
    }
    if (self.backing._tag === "IAppend") {
      const chunk = take(self.backing.bufferUsed)(unsafeFromArray(self.backing.buffer as Array<A>))
      return pipe(self.backing.start, concat(chunk), concat(that))
    }
    if (that.backing._tag === "IPrepend") {
      const chunk = unsafeFromArray(
        that.backing.bufferUsed === 0 ?
          [] :
          (that.backing.buffer as Array<B>).slice(-that.backing.bufferUsed)
      )
      return pipe(self, concat(chunk), concat(that.backing.end))
    }
    const diff = that.depth - self.depth
    if (Math.abs(diff) <= 1) {
      return new ChunkImpl<A | B>({ _tag: "IConcat", left: self, right: that })
    } else if (diff < -1) {
      if (self.left.depth >= self.right.depth) {
        const nr = concat(that)(self.right)
        return new ChunkImpl({ _tag: "IConcat", left: self.left, right: nr })
      } else {
        const nrr = concat(that)(self.right.right)
        if (nrr.depth === self.depth - 3) {
          const nr = new ChunkImpl({ _tag: "IConcat", left: self.right.left, right: nrr })
          return new ChunkImpl({ _tag: "IConcat", left: self.left, right: nr })
        } else {
          const nl = new ChunkImpl({ _tag: "IConcat", left: self.left, right: self.right.left })
          return new ChunkImpl({ _tag: "IConcat", left: nl, right: nrr })
        }
      }
    } else {
      if (self.right.depth >= that.left.depth) {
        const nl = concat(that.left)(self)
        return new ChunkImpl({ _tag: "IConcat", left: nl, right: that.right })
      } else {
        const nll = concat(that.left.left)(self)
        if (nll.depth === that.depth - 3) {
          const nl = new ChunkImpl({ _tag: "IConcat", left: nll, right: that.left.right })
          return new ChunkImpl({ _tag: "IConcat", left: nl, right: that.right })
        } else {
          const nr = new ChunkImpl({ _tag: "IConcat", left: that.left.right, right: that.right })
          return new ChunkImpl({ _tag: "IConcat", left: nll, right: nr })
        }
      }
    }
  }

/**
 * Compares the two chunks of equal length using the specified function
 *
 * @since 1.0.0
 * @category elements
 */
export const correspondsTo = <A, B>(that: Chunk<B>, f: (a: A, b: B) => boolean) =>
  (self: Chunk<A>): boolean => {
    if (self.length !== that.length) {
      return false
    }
    const selfArray = toArray(self)
    const thatArray = toArray(that)
    return selfArray.every((v, i) => f(v, thatArray[i]))
  }

/**
 * Returns a filtered and mapped subset of the elements.
 *
 * @since 1.0.0
 * @category filtering
 */
export const filterMap = <A, B>(f: (a: A) => Option<B>) =>
  (self: Iterable<A>): Chunk<B> => unsafeFromArray(RA.filterMap(f)(self))

/**
 * Returns a filtered and mapped subset of the elements.
 *
 * @since 1.0.0
 * @category filtering
 */
export const filter = <A>(f: (a: A) => boolean) =>
  (self: Iterable<A>): Chunk<A> => unsafeFromArray(RA.filterMap(O.liftPredicate(f))(self))

/**
 * Returns a filtered and mapped subset of the elements.
 *
 * @since 1.0.0
 * @category filtering
 */
export const filterMapWithIndex = <A, B>(f: (i: number, a: A) => Option<B>) =>
  (self: Iterable<A>): Chunk<B> => unsafeFromArray(RA.filterMapWithIndex(f)(self))

/**
 * Transforms all elements of the chunk for as long as the specified function returns some value
 *
 * @since 1.0.0
 * @category filtering
 */
export const filterMapWhile = <A, B>(f: (a: A) => Option<B>) =>
  (self: Iterable<A>): Chunk<B> => {
    const res: Array<B> = []
    for (const a of self) {
      const b = f(a)
      if (O.isSome(b)) {
        res.push(b.value)
      } else {
        break
      }
    }
    return unsafeFromArray(res)
  }

/**
 * Tests whether a value is a member of a `Chunk<A>`.
 *
 * @since 1.0.0
 * @category elements
 */
export const elem = <A>(a: A) => (self: Chunk<A>): boolean => pipe(toArray(self), RA.elem(a))

/**
 * Filter out optional values
 *
 * @since 1.0.0
 * @category filtering
 */
export const compact = <A>(self: Iterable<Option<A>>): Chunk<A> => pipe(self, filterMap(identity))

/**
 * Deduplicates adjacent elements that are identical.
 *
 * @since 1.0.0
 * @category filtering
 */
export const dedupeAdjacent = <A>(self: Chunk<A>): Chunk<A> => {
  const builder: Array<A> = []
  let lastA: O.Option<A> = O.none

  for (const a of self) {
    if (O.isNone(lastA) || !Equal.equals(a, lastA.value)) {
      builder.push(a)
      lastA = O.some(a)
    }
  }

  return unsafeFromArray(builder)
}

/**
 * Check if a predicate holds true for any `Chunk` member.
 *
 * @since 1.0.0
 * @category elements
 */
export const some = <A>(f: (a: A) => boolean) =>
  (self: Chunk<A>) => toArray(self).findIndex((v) => f(v)) !== -1

/**
 * Check if a predicate holds true for every `Chunk` member.
 *
 * @since 1.0.0
 * @category elements
 */
export const every = <A>(f: (a: A) => boolean) =>
  (self: Chunk<A>) => toArray(self).every((v) => f(v))

/**
 * Find the first element which satisfies a predicate (or a refinement) function.
 *
 * @since 1.0.0
 * @category elements
 */
export function findFirst<A, B extends A>(f: Refinement<A, B>): (self: Chunk<A>) => Option<B>
export function findFirst<A>(f: Predicate<A>): (self: Chunk<A>) => Option<A>
export function findFirst<A>(f: Predicate<A>) {
  return (self: Chunk<A>): Option<A> => RA.findFirst(f)(toArray(self))
}

/**
 * Find the first index for which a predicate holds
 *
 * @since 1.0.0
 * @category elements
 */
export const findFirstIndex = <A>(f: Predicate<A>) =>
  (self: Chunk<A>): Option<number> => RA.findIndex(f)(toArray(self))

/**
 * Find the first index for which a predicate holds
 *
 * @since 1.0.0
 * @category elements
 */
export const findLastIndex = <A>(f: Predicate<A>) =>
  (self: Chunk<A>): Option<number> => RA.findLastIndex(f)(toArray(self))

/**
 * Find the last element which satisfies a predicate function
 *
 * @since 1.0.0
 * @category elements
 */
export function findLast<A, B extends A>(f: Refinement<A, B>): (self: Chunk<A>) => Option<B>
export function findLast<A>(f: Predicate<A>): (self: Chunk<A>) => Option<A>
export function findLast<A>(f: Predicate<A>) {
  return (self: Chunk<A>): Option<A> => RA.findLast(f)(toArray(self))
}

/**
 * Returns a chunk with the elements mapped by the specified function.
 *
 * @since 1.0.0
 * @category sequencing
 */
export const flatMap = <A, B>(f: (a: A) => Chunk<B>) =>
  (self: Chunk<A>): Chunk<B> => {
    if (self.backing._tag === "ISingleton") {
      return f(self.backing.a)
    }
    let r: Chunk<B> = empty
    for (const k of self) {
      r = concat(f(k))(r)
    }
    return r
  }

/**
 * Flattens a chunk of chunks into a single chunk by concatenating all chunks.
 *
 * @since 1.0.0
 * @category sequencing
 */
export const flatten = <A>(self: Chunk<Chunk<A>>): Chunk<A> => pipe(self, flatMap(identity))

/**
 * Iterate over the chunk applying `f`.
 *
 * @since 1.0.0
 * @category elements
 */
export const forEach = <A>(f: (a: A) => void) => (self: Chunk<A>): void => toArray(self).forEach(f)

/**
 * Groups elements in chunks of up to `n` elements.
 *
 * @since 1.0.0
 * @category elements
 */
export const grouped = (n: number) =>
  <A>(self: Chunk<A>): Chunk<Chunk<A>> => {
    const gr: Array<Chunk<A>> = []
    let current: Array<A> = []

    toArray(self).forEach((a) => {
      current.push(a)
      if (current.length >= n) {
        gr.push(unsafeFromArray(current))
        current = []
      }
    })

    if (current.length > 0) {
      gr.push(unsafeFromArray(current))
    }

    return unsafeFromArray(gr)
  }

/**
 * Returns the first element of this chunk if it exists.
 *
 * @since 1.0.0
 * @category elements
 */
export const head = <A>(self: Chunk<A>): Option<A> => get(0)(self)

/**
 * Creates a Chunk of unique values that are included in all given Chunks.
 *
 * The order and references of result values are determined by the Chunk.
 *
 * @since 1.0.0
 * @category elements
 */
export const intersection = <A>(that: Chunk<A>) =>
  <B>(self: Chunk<B>): Chunk<A & B> =>
    pipe(
      toArray(self),
      RA.intersection(toArray(that)),
      unsafeFromArray
    )

/**
 * Determines if the chunk is empty.
 *
 * @since 1.0.0
 * @category elements
 */
export const isEmpty = <A>(self: Chunk<A>): boolean => self.length === 0

/**
 * Determines if the chunk is not empty.
 *
 * @since 1.0.0
 * @category elements
 */
export const isNonEmpty = <A>(self: Chunk<A>): boolean => self.length > 0

/**
 * Folds over the elements in this chunk from the left.
 *
 * @since 1.0.0
 * @category folding
 */
export const reduce = <A, S>(s: S, f: (s: S, a: A) => S) =>
  (self: Chunk<A>): S => pipe(toArray(self), RA.reduce(s, f))

/**
 * Folds over the elements in this chunk from the left.
 *
 * @since 1.0.0
 * @category folding
 */
export const reduceWithIndex = <A, S>(s: S, f: (i: number, s: S, a: A) => S) =>
  (self: Chunk<A>): S => pipe(toArray(self), RA.reduceWithIndex(s, f))

/**
 * Folds over the elements in this chunk from the right.
 *
 * @since 1.0.0
 * @category folding
 */
export const reduceRight = <A, S>(s: S, f: (a: A, s: S) => S) =>
  (self: Chunk<A>): S => pipe(toArray(self), RA.reduceRight(s, (s, a) => f(a, s)))

/**
 * Folds over the elements in this chunk from the right.
 *
 * @since 1.0.0
 * @category folding
 */
export const reduceRightWithIndex = <A, S>(s: S, f: (i: number, a: A, s: S) => S) =>
  (self: Chunk<A>): S => pipe(toArray(self), RA.reduceRightWithIndex(s, f))

/**
 * Joins the elements together with "sep" in the middle.
 *
 * @since 1.0.0
 * @category folding
 */
export const join = (sep: string) =>
  (self: Chunk<string>): string =>
    pipe(self, reduce("", (s, a) => (s.length > 0 ? `${s}${sep}${a}` : a)))

/**
 * Returns the last element of this chunk if it exists.
 *
 * @since 1.0.0
 * @category elements
 */
export const last = <A>(self: Chunk<A>): Option<A> => get(self.length - 1)(self)

/**
 * Build a chunk from a sequence of elements.
 *
 * @since 1.0.0
 * @category constructors
 */
export const make = <Elem extends ReadonlyArray<any>>(...elements: Elem): Chunk<Elem[number]> =>
  unsafeFromArray(elements)

/**
 * Return a Chunk of length n with element i initialized with f(i).
 *
 * Note. n is normalized to a non negative integer.
 *
 * @since 1.0.0
 * @category constructors
 */
export const makeBy = <A>(f: (i: number) => A) =>
  (n: number): Chunk<A> => unsafeFromArray(RA.makeBy(f)(n))

/**
 * Returns an effect whose success is mapped by the specified f function.
 *
 * @since 1.0.0
 * @category mapping
 */
export const map = <A, B>(f: (a: A) => B) =>
  (self: Chunk<A>): Chunk<B> => unsafeFromArray(RA.map(f)(toArray(self)))

/**
 * Returns an effect whose success is mapped by the specified f function.
 *
 * @since 1.0.0
 * @category mapping
 */
export const mapWithIndex = <A, B>(f: (i: number, a: A) => B) =>
  (self: Chunk<A>): Chunk<B> =>
    unsafeFromArray(pipe(toArray(self), RA.mapWithIndex((a, i) => f(i, a))))

/**
 * Statefully maps over the chunk, producing new elements of type `B`.
 *
 * @since 1.0.0
 * @category folding
 */
export function mapAccum<A, B, S>(s: S, f: (s: S, a: A) => readonly [S, B]) {
  return (self: Chunk<A>): readonly [S, Chunk<B>] => {
    let s1 = s
    const res: Array<B> = []
    for (const a of toArray(self)) {
      const r = f(s1, a)
      s1 = r[0]
      res.push(r[1])
    }
    return [s1, unsafeFromArray(res)]
  }
}

/**
 * Separate elements based on a predicate that also exposes the index of the element.
 *
 * @category filtering
 * @since 1.0.0
 */
export const partitionWithIndex: {
  <C extends A, B extends A, A = C>(refinement: (i: number, a: A) => a is B): (
    fb: Chunk<C>
  ) => readonly [Chunk<C>, Chunk<B>]
  <B extends A, A = B>(predicate: (i: number, a: A) => boolean): (
    fb: Chunk<B>
  ) => readonly [Chunk<B>, Chunk<B>]
} = <A>(f: (i: number, a: A) => boolean) => {
  return (self: Chunk<A>): readonly [Chunk<A>, Chunk<A>] =>
    pipe(
      toArray(self),
      RA.partitionWithIndex(f),
      ([l, r]) => [unsafeFromArray(l), unsafeFromArray(r)]
    )
}

/**
 * Separate elements based on a predicate.
 *
 * @category filtering
 * @since 1.0.0
 */
export const partition: {
  <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (
    fc: Chunk<C>
  ) => readonly [Chunk<C>, Chunk<B>]
  <B extends A, A = B>(
    predicate: Predicate<A>
  ): (fb: Chunk<B>) => readonly [Chunk<B>, Chunk<B>]
} = <B extends A, A = B>(predicate: Predicate<A>) =>
  (fb: Chunk<B>): readonly [Chunk<B>, Chunk<B>] =>
    pipe(
      toArray(fb),
      RA.partition(predicate),
      ([l, r]) => [unsafeFromArray(l), unsafeFromArray(r)]
    )

/**
 * Partitions the elements of this chunk into two chunks using f.
 *
 * @category filtering
 * @since 1.0.0
 */
export const partitionMap = <A, B, C>(
  f: (a: A) => Either<B, C>
) =>
  (fa: Chunk<A>): readonly [Chunk<B>, Chunk<C>] =>
    pipe(
      fa,
      toArray,
      RA.partitionMap(f),
      ([l, r]) => [unsafeFromArray(l), unsafeFromArray(r)]
    )

/**
 * Partitions the elements of this chunk into two chunks.
 *
 * @category filtering
 * @since 1.0.0
 */
export const separate = <A, B>(fa: Chunk<Either<A, B>>): readonly [Chunk<A>, Chunk<B>] =>
  pipe(
    fa,
    toArray,
    RA.separate,
    ([l, r]) => [unsafeFromArray(l), unsafeFromArray(r)]
  )

/**
 * Build a chunk with an integer range with both min/max included.
 *
 * @category constructors
 * @since 1.0.0
 */
export const range = (min: number, max: number) => {
  const builder: Array<number> = []
  for (let i = min; i <= max; i++) {
    builder.push(i)
  }
  return unsafeFromArray(builder)
}

/**
 * Reverse a Chunk, creating a new Chunk.
 *
 * @since 1.0.0
 * @category elements
 */
export const reverse = <A>(self: Chunk<A>): Chunk<A> => unsafeFromArray(RA.reverse(toArray(self)))

/**
 * Creates a Chunk of a single element
 *
 * @since 1.0.0
 * @category constructors
 */
export const single = <A>(a: A): Chunk<A> => new ChunkImpl({ _tag: "ISingleton", a })

/**
 * Retireves the size of the chunk
 *
 * @since 1.0.0
 * @category elements
 */
export const size = <A>(self: Chunk<A>): number => self.length

/**
 * Sort the elements of a Chunk in increasing order, creating a new Chunk.
 *
 * @since 1.0.0
 * @category elements
 */
export const sort = <B>(O: Order<B>) =>
  <A extends B>(as: Chunk<A>): Chunk<A> =>
    pipe(
      toArray(as),
      RA.sort(O),
      unsafeFromArray
    )

/**
 *  Returns two splits of this chunk at the specified index.
 *
 * @since 1.0.0
 * @category elements
 */
export const splitAt = (n: number) =>
  <A>(self: Chunk<A>): readonly [Chunk<A>, Chunk<A>] => [take(n)(self), drop(n)(self)]

/**
 * Splits this chunk into `n` equally sized chunks.
 *
 * @since 1.0.0
 * @category elements
 */
export const split = (n: number) =>
  <A>(self: Chunk<A>): Chunk<Chunk<A>> => {
    const length = self.length
    const k = Math.floor(n)
    const quotient = Math.floor(length / k)
    const remainder = length % k

    const chunks: Array<Chunk<A>> = []
    let i = 0

    let chunk: Array<A> = []

    toArray(self).forEach((a) => {
      chunk.push(a)
      if (
        (i <= remainder && chunk.length > quotient) ||
        (i > remainder && chunk.length >= quotient)
      ) {
        chunks.push(unsafeFromArray(chunk))
        chunk = []
      }
      i++
    })

    if (chunk.length > 0) {
      chunks.push(unsafeFromArray(chunk))
    }

    return unsafeFromArray(chunks)
  }

/**
 * Splits this chunk on the first element that matches this predicate.
 *
 * @since 1.0.0
 * @category elements
 */
export const splitWhere = <A>(f: Predicate<A>) =>
  (self: Chunk<A>): readonly [Chunk<A>, Chunk<A>] => {
    let i = 0
    for (const a of toArray(self)) {
      if (f(a)) {
        break
      } else {
        i++
      }
    }
    return splitAt(i)(self)
  }

/**
 * Returns every elements after the first.
 *
 * @since 1.0.0
 * @category elements
 */
export const tail = <A>(self: Chunk<A>): Option<Chunk<A>> =>
  self.length > 0 ? O.some(drop(1)(self)) : O.none

/**
 * Takes the last `n` elements.
 *
 * @since 1.0.0
 * @category elements
 */
export const takeRight = (n: number) =>
  <A>(self: Chunk<A>): Chunk<A> => pipe(self, drop(self.length - n))

/**
 * Takes all elements so long as the predicate returns true.
 *
 * @since 1.0.0
 * @category elements
 */
export const takeWhile = <A>(f: Predicate<A>) =>
  (self: Chunk<A>): Chunk<A> => {
    const res: Array<A> = []
    for (const a of toArray(self)) {
      if (f(a)) {
        res.push(a)
      } else {
        break
      }
    }
    return unsafeFromArray(res)
  }

/**
 * Constructs a `Chunk` by repeatedly applying the function `f` as long as it * returns `Some`.
 *
 * @since 1.0.0
 * @category elements
 */
export const unfold = <A, S>(s: S, f: (s: S) => Option<readonly [A, S]>): Chunk<A> => {
  const builder: Array<A> = []
  let cont = true
  let s1 = s
  while (cont) {
    const x = f(s1)
    if (O.isSome(x)) {
      s1 = x[1]
      builder.push(x[0])
    } else {
      cont = false
    }
  }
  return unsafeFromArray(builder)
}

/**
 * Creates a Chunks of unique values, in order, from all given Chunks.
 *
 * @since 1.0.0
 * @category elements
 */
export function union<A>(that: Chunk<A>) {
  return <B>(self: Chunk<B>): Chunk<A | B> =>
    unsafeFromArray(RA.union(toArray(that))(toArray(self)))
}

/**
 * Remove duplicates from an array, keeping the first occurrence of an element.
 *
 * @since 1.0.0
 * @category elements
 */
export const dedupe = <A>(self: Chunk<A>): Chunk<A> => unsafeFromArray(RA.uniq(toArray(self)))

/**
 * Returns the first element of this chunk.
 *
 * @since 1.0.0
 * @category unsafe
 */
export const unsafeHead = <A>(self: Chunk<A>): A => unsafeGet(0)(self)

/**
 * Returns the last element of this chunk.
 *
 * @since 1.0.0
 * @category unsafe
 */
export const unsafeLast = <A>(self: Chunk<A>): A => unsafeGet(self.length - 1)(self)

/**
 * Takes an array of pairs and return two corresponding arrays.
 *
 * Note: The function is reverse of `zip`.
 *
 * @since 1.0.0
 * @category elements
 */
export const unzip = <A, B>(as: Chunk<readonly [A, B]>): readonly [Chunk<A>, Chunk<B>] => {
  const fa: Array<A> = []
  const fb: Array<B> = []

  toArray(as).forEach(([a, b]) => {
    fa.push(a)
    fb.push(b)
  })

  return [unsafeFromArray(fa), unsafeFromArray(fb)]
}

/**
 * Zips this chunk pointwise with the specified chunk.
 *
 * @since 1.0.0
 * @category elements
 */
export const zip = <B>(that: Chunk<B>) =>
  <A>(self: Chunk<A>): Chunk<readonly [A, B]> => pipe(self, zipWith(that, (a, b) => [a, b]))

/**
 * Zips this chunk pointwise with the specified chunk using the specified combiner.
 *
 * @since 1.0.0
 * @category elements
 */
export const zipWith = <A, B, C>(that: Chunk<B>, f: (a: A, b: B) => C) =>
  (self: Chunk<A>): Chunk<C> => {
    const selfA = toArray(self)
    const thatA = toArray(that)
    const len = Math.min(selfA.length, thatA.length)
    const res: Array<C> = new Array(len)
    for (let i = 0; i < len; i++) {
      res.push(f(selfA[i], thatA[i]))
    }
    return unsafeFromArray(res)
  }

/**
 * Zips this chunk pointwise with the specified chunk to produce a new chunk with
 * pairs of elements from each chunk, filling in missing values from the
 * shorter chunk with `None`. The returned chunk will have the length of the
 * longer chunk.
 *
 * @since 1.0.0
 * @category elements
 */
export const zipAll = <B>(that: Chunk<B>) =>
  <A>(self: Chunk<A>): Chunk<readonly [Option<A>, Option<B>]> =>
    pipe(
      self,
      zipAllWith(
        that,
        (a, b) => [O.some(a), O.some(b)],
        (a) => [O.some(a), O.none],
        (b) => [O.none, O.some(b)]
      )
    )

/**
 * Zips with chunk with the specified chunk to produce a new chunk with
 * pairs of elements from each chunk combined using the specified function
 * `both`. If one chunk is shorter than the other uses the specified
 * function `left` or `right` to map the element that does exist to the
 * result type.
 *
 * @since 1.0.0
 * @category elements
 */
export const zipAllWith = <A, B, C, D, E>(
  that: Chunk<B>,
  f: (a: A, b: B) => C,
  left: (a: A) => D,
  right: (b: B) => E
) =>
  (self: Chunk<A>): Chunk<C | D | E> => {
    const length = Math.max(self.length, that.length)
    if (length === 0) {
      return empty
    }
    const leftarr = toArray(self)
    const rightArr = toArray(that)
    let i = 0
    let j = 0
    let k = 0
    const leftLength = leftarr.length
    const rightLength = rightArr.length
    const builder: Array<C | D | E> = new Array(length)
    while (i < length) {
      if (j < leftLength && k < rightLength) {
        builder.push(f(leftarr![j]!, rightArr![k]!))
        i++
        j++
        k++
      } else if (j < leftLength) {
        builder.push(left(leftarr![j]!))
        i++
        j++
      } else if (k < rightLength) {
        builder.push(right(rightArr![k]!))
        i++
        k++
      }
    }
    return unsafeFromArray(builder)
  }

/**
 * Zips this chunk crosswise with the specified chunk using the specified combiner.
 *
 * @since 1.0.0
 * @category elements
 */
export const crossWith = <A, B, C>(that: Chunk<B>, f: (a: A, b: B) => C) =>
  (self: Chunk<A>): Chunk<C> => pipe(self, flatMap((a) => pipe(that, map((b) => f(a, b)))))

/**
 * Zips this chunk crosswise with the specified chunk.
 *
 * @since 1.0.0
 * @category elements
 */
export const cross = <B>(that: Chunk<B>) =>
  <A>(self: Chunk<A>): Chunk<readonly [A, B]> => pipe(self, crossWith(that, (a, b) => [a, b]))

/**
 * Zips this chunk with the index of every element, starting from the initial
 * index value.
 *
 * @category elements
 * @since 1.0.0
 */
export const zipWithIndex = <A>(self: Chunk<A>): Chunk<readonly [A, number]> =>
  zipWithIndexOffset(0)(self)

/**
 * Zips this chunk with the index of every element, starting from the initial
 * index value.
 *
 * @category elements
 * @since 1.0.0
 */
export const zipWithIndexOffset = (offset: number) =>
  <A>(self: Chunk<A>): Chunk<[A, number]> => {
    const iterator = self[Symbol.iterator]()
    let next: IteratorResult<A>
    let i = offset
    const builder: Array<[A, number]> = []
    while (!(next = iterator.next()).done) {
      builder.push([next.value, i])
      i = i + 1
    }
    return unsafeFromArray(builder)
  }
