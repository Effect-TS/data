---
title: Chunk.ts
nav_order: 1
parent: Modules
---

## Chunk overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [Chunk](#chunk)
  - [empty](#empty)
  - [isChunk](#ischunk)
  - [make](#make)
  - [makeBy](#makeby)
  - [range](#range)
  - [single](#single)
- [conversions](#conversions)
  - [fromIterable](#fromiterable)
  - [toArray](#toarray)
- [elements](#elements)
  - [correspondsTo](#correspondsto)
  - [dedupe](#dedupe)
  - [elem](#elem)
  - [every](#every)
  - [findFirst](#findfirst)
  - [findFirstIndex](#findfirstindex)
  - [findLast](#findlast)
  - [findLastIndex](#findlastindex)
  - [forEach](#foreach)
  - [get](#get)
  - [grouped](#grouped)
  - [head](#head)
  - [intersection](#intersection)
  - [isEmpty](#isempty)
  - [isNonEmpty](#isnonempty)
  - [last](#last)
  - [reverse](#reverse)
  - [size](#size)
  - [some](#some)
  - [sort](#sort)
  - [split](#split)
  - [splitAt](#splitat)
  - [splitWhere](#splitwhere)
  - [tail](#tail)
  - [takeRight](#takeright)
  - [takeWhile](#takewhile)
  - [unfold](#unfold)
  - [union](#union)
  - [unzip](#unzip)
  - [zip](#zip)
  - [zipAll](#zipall)
  - [zipAllWith](#zipallwith)
  - [zipWith](#zipwith)
- [filtering](#filtering)
  - [compact](#compact)
  - [dedupeAdjacent](#dedupeadjacent)
  - [filter](#filter)
  - [filterMap](#filtermap)
  - [filterMapWhile](#filtermapwhile)
  - [filterMapWithIndex](#filtermapwithindex)
  - [partition](#partition)
  - [partitionMap](#partitionmap)
  - [partitionWithIndex](#partitionwithindex)
  - [separate](#separate)
- [folding](#folding)
  - [join](#join)
  - [mapAccum](#mapaccum)
  - [reduce](#reduce)
  - [reduceRight](#reduceright)
  - [reduceRightWithIndex](#reducerightwithindex)
  - [reduceWithIndex](#reducewithindex)
- [mapping](#mapping)
  - [map](#map)
  - [mapWithIndex](#mapwithindex)
- [model](#model)
  - [Chunk (interface)](#chunk-interface)
- [mutations](#mutations)
  - [append](#append)
  - [concat](#concat)
  - [drop](#drop)
  - [dropRight](#dropright)
  - [dropWhile](#dropwhile)
  - [prepend](#prepend)
  - [take](#take)
- [sequencing](#sequencing)
  - [flatMap](#flatmap)
  - [flatten](#flatten)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)
- [unsafe](#unsafe)
  - [unsafeFromArray](#unsafefromarray)
  - [unsafeGet](#unsafeget)
  - [unsafeHead](#unsafehead)
  - [unsafeLast](#unsafelast)

---

# constructors

## Chunk

Build a chunk from a sequence of elements.

**Signature**

```ts
export declare const Chunk: <Elem extends readonly any[]>(...elements: Elem) => Chunk<Elem[number]>
```

Added in v1.0.0

## empty

**Signature**

```ts
export declare const empty: Chunk<never>
```

Added in v1.0.0

## isChunk

Checks if `u` is a `Chunk<unknown>`

**Signature**

```ts
export declare const isChunk: (u: unknown) => u is Chunk<unknown>
```

Added in v1.0.0

## make

Build a chunk from a sequence of elements.

**Signature**

```ts
export declare const make: <Elem extends readonly any[]>(...elements: Elem) => Chunk<Elem[number]>
```

Added in v1.0.0

## makeBy

Return a Chunk of length n with element i initialized with f(i).

Note. n is normalized to a non negative integer.

**Signature**

```ts
export declare const makeBy: <A>(f: (i: number) => A) => (n: number) => Chunk<A>
```

Added in v1.0.0

## range

Build a chunk with an integer range with both min/max included.

**Signature**

```ts
export declare const range: (min: number, max: number) => Chunk<number>
```

Added in v1.0.0

## single

Creates a Chunk of a single element

**Signature**

```ts
export declare const single: <A>(a: A) => Chunk<A>
```

Added in v1.0.0

# conversions

## fromIterable

Converts from an `Iterable<A>`

**Signature**

```ts
export declare const fromIterable: <A>(self: Iterable<A>) => Chunk<A>
```

Added in v1.0.0

## toArray

Converts to a `ReadonlyArray<A>`

**Signature**

```ts
export declare const toArray: <A>(self: Chunk<A>) => readonly A[]
```

Added in v1.0.0

# elements

## correspondsTo

Compares the two chunks of equal length using the specified function

**Signature**

```ts
export declare const correspondsTo: <A, B>(that: Chunk<B>, f: (a: A, b: B) => boolean) => (self: Chunk<A>) => boolean
```

Added in v1.0.0

## dedupe

Remove duplicates from an array, keeping the first occurrence of an element.

**Signature**

```ts
export declare const dedupe: <A>(self: Chunk<A>) => Chunk<A>
```

Added in v1.0.0

## elem

Tests whether a value is a member of a `Chunk<A>`.

**Signature**

```ts
export declare const elem: <A>(a: A) => (self: Chunk<A>) => boolean
```

Added in v1.0.0

## every

Check if a predicate holds true for every `Chunk` member.

**Signature**

```ts
export declare const every: <A>(f: (a: A) => boolean) => (self: Chunk<A>) => boolean
```

Added in v1.0.0

## findFirst

Find the first element which satisfies a predicate (or a refinement) function.

**Signature**

```ts
export declare function findFirst<A, B extends A>(f: Refinement<A, B>): (self: Chunk<A>) => Option<B>
export declare function findFirst<A>(f: Predicate<A>): (self: Chunk<A>) => Option<A>
```

Added in v1.0.0

## findFirstIndex

Find the first index for which a predicate holds

**Signature**

```ts
export declare const findFirstIndex: <A>(f: Predicate<A>) => (self: Chunk<A>) => Option<number>
```

Added in v1.0.0

## findLast

Find the last element which satisfies a predicate function

**Signature**

```ts
export declare function findLast<A, B extends A>(f: Refinement<A, B>): (self: Chunk<A>) => Option<B>
export declare function findLast<A>(f: Predicate<A>): (self: Chunk<A>) => Option<A>
```

Added in v1.0.0

## findLastIndex

Find the first index for which a predicate holds

**Signature**

```ts
export declare const findLastIndex: <A>(f: Predicate<A>) => (self: Chunk<A>) => Option<number>
```

Added in v1.0.0

## forEach

Iterate over the chunk applying `f`.

**Signature**

```ts
export declare const forEach: <A>(f: (a: A) => void) => (self: Chunk<A>) => void
```

Added in v1.0.0

## get

Gets the `n`-th element in the chunk if it exists

**Signature**

```ts
export declare const get: (n: number) => <A>(self: Chunk<A>) => O.Option<A>
```

Added in v1.0.0

## grouped

Groups elements in chunks of up to `n` elements.

**Signature**

```ts
export declare const grouped: (n: number) => <A>(self: Chunk<A>) => Chunk<Chunk<A>>
```

Added in v1.0.0

## head

Returns the first element of this chunk if it exists.

**Signature**

```ts
export declare const head: <A>(self: Chunk<A>) => O.Option<A>
```

Added in v1.0.0

## intersection

Creates a Chunk of unique values that are included in all given Chunks.

The order and references of result values are determined by the Chunk.

**Signature**

```ts
export declare const intersection: <A>(that: Chunk<A>) => (self: Chunk<A>) => Chunk<A>
```

Added in v1.0.0

## isEmpty

Determines if the chunk is empty.

**Signature**

```ts
export declare const isEmpty: <A>(self: Chunk<A>) => boolean
```

Added in v1.0.0

## isNonEmpty

Determines if the chunk is not empty.

**Signature**

```ts
export declare const isNonEmpty: <A>(self: Chunk<A>) => boolean
```

Added in v1.0.0

## last

Returns the last element of this chunk if it exists.

**Signature**

```ts
export declare const last: <A>(self: Chunk<A>) => O.Option<A>
```

Added in v1.0.0

## reverse

Reverse a Chunk, creating a new Chunk.

**Signature**

```ts
export declare const reverse: <A>(self: Chunk<A>) => Chunk<A>
```

Added in v1.0.0

## size

Retireves the size of the chunk

**Signature**

```ts
export declare const size: <A>(self: Chunk<A>) => number
```

Added in v1.0.0

## some

Check if a predicate holds true for any `Chunk` member.

**Signature**

```ts
export declare const some: <A>(f: (a: A) => boolean) => (self: Chunk<A>) => boolean
```

Added in v1.0.0

## sort

Sort the elements of a Chunk in increasing order, creating a new Chunk.

**Signature**

```ts
export declare const sort: <B>(O: Ord<B>) => <A extends B>(as: Chunk<A>) => Chunk<A>
```

Added in v1.0.0

## split

Splits this chunk into `n` equally sized chunks.

**Signature**

```ts
export declare const split: (n: number) => <A>(self: Chunk<A>) => Chunk<Chunk<A>>
```

Added in v1.0.0

## splitAt

Returns two splits of this chunk at the specified index.

**Signature**

```ts
export declare const splitAt: (n: number) => <A>(self: Chunk<A>) => readonly [Chunk<A>, Chunk<A>]
```

Added in v1.0.0

## splitWhere

Splits this chunk on the first element that matches this predicate.

**Signature**

```ts
export declare const splitWhere: <A>(f: Predicate<A>) => (self: Chunk<A>) => readonly [Chunk<A>, Chunk<A>]
```

Added in v1.0.0

## tail

Returns every elements after the first.

**Signature**

```ts
export declare const tail: <A>(self: Chunk<A>) => O.Option<Chunk<A>>
```

Added in v1.0.0

## takeRight

Takes the last `n` elements.

**Signature**

```ts
export declare const takeRight: (n: number) => <A>(self: Chunk<A>) => Chunk<A>
```

Added in v1.0.0

## takeWhile

Takes all elements so long as the predicate returns true.

**Signature**

```ts
export declare const takeWhile: <A>(f: Predicate<A>) => (self: Chunk<A>) => Chunk<A>
```

Added in v1.0.0

## unfold

Constructs a `Chunk` by repeatedly applying the function `f` as long as it \* returns `Some`.

**Signature**

```ts
export declare const unfold: <A, S>(s: S, f: (s: S) => O.Option<readonly [A, S]>) => Chunk<A>
```

Added in v1.0.0

## union

Creates a Chunks of unique values, in order, from all given Chunks.

**Signature**

```ts
export declare function union<A>(that: Chunk<A>)
```

Added in v1.0.0

## unzip

Takes an array of pairs and return two corresponding arrays.

Note: The function is reverse of `zip`.

**Signature**

```ts
export declare const unzip: <A, B>(as: Chunk<readonly [A, B]>) => readonly [Chunk<A>, Chunk<B>]
```

Added in v1.0.0

## zip

Zips this chunk with the specified chunk using the specified combiner.

**Signature**

```ts
export declare const zip: <B>(that: Chunk<B>) => <A>(self: Chunk<A>) => Chunk<readonly [A, B]>
```

Added in v1.0.0

## zipAll

Zips this chunk with the specified chunk to produce a new chunk with
pairs of elements from each chunk, filling in missing values from the
shorter chunk with `None`. The returned chunk will have the length of the
longer chunk.

**Signature**

```ts
export declare const zipAll: <B>(that: Chunk<B>) => <A>(self: Chunk<A>) => Chunk<readonly [O.Option<A>, O.Option<B>]>
```

Added in v1.0.0

## zipAllWith

Zips with chunk with the specified chunk to produce a new chunk with
pairs of elements from each chunk combined using the specified function
`both`. If one chunk is shorter than the other uses the specified
function `left` or `right` to map the element that does exist to the
result type.

**Signature**

```ts
export declare const zipAllWith: <A, B, C, D, E>(
  that: Chunk<B>,
  f: (a: A, b: B) => C,
  left: (a: A) => D,
  right: (b: B) => E
) => (self: Chunk<A>) => Chunk<C | D | E>
```

Added in v1.0.0

## zipWith

Zips this chunk with the specified chunk using the specified combiner.

**Signature**

```ts
export declare const zipWith: <A, B, C>(that: Chunk<B>, f: (a: A, b: B) => C) => (self: Chunk<A>) => Chunk<C>
```

Added in v1.0.0

# filtering

## compact

Filter out optional values

**Signature**

```ts
export declare const compact: <A>(self: Iterable<O.Option<A>>) => Chunk<A>
```

Added in v1.0.0

## dedupeAdjacent

Deduplicates adjacent elements that are identical.

**Signature**

```ts
export declare const dedupeAdjacent: <A>(self: Chunk<A>) => Chunk<A>
```

Added in v1.0.0

## filter

Returns a filtered and mapped subset of the elements.

**Signature**

```ts
export declare const filter: <A>(f: (a: A) => boolean) => (self: Iterable<A>) => Chunk<A>
```

Added in v1.0.0

## filterMap

Returns a filtered and mapped subset of the elements.

**Signature**

```ts
export declare const filterMap: <A, B>(f: (a: A) => O.Option<B>) => (self: Iterable<A>) => Chunk<B>
```

Added in v1.0.0

## filterMapWhile

Transforms all elements of the chunk for as long as the specified function returns some value

**Signature**

```ts
export declare const filterMapWhile: <A, B>(f: (a: A) => O.Option<B>) => (self: Iterable<A>) => Chunk<B>
```

Added in v1.0.0

## filterMapWithIndex

Returns a filtered and mapped subset of the elements.

**Signature**

```ts
export declare const filterMapWithIndex: <A, B>(f: (i: number, a: A) => O.Option<B>) => (self: Iterable<A>) => Chunk<B>
```

Added in v1.0.0

## partition

Separate elements based on a predicate.

**Signature**

```ts
export declare const partition: {
  <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (fc: Chunk<C>) => readonly [Chunk<C>, Chunk<B>]
  <B extends A, A = B>(predicate: Predicate<A>): (fb: Chunk<B>) => readonly [Chunk<B>, Chunk<B>]
}
```

Added in v1.0.0

## partitionMap

Partitions the elements of this chunk into two chunks using f.

**Signature**

```ts
export declare const partitionMap: <A, B, C>(
  f: (a: A) => Result<B, C>
) => (fa: Chunk<A>) => readonly [Chunk<B>, Chunk<C>]
```

Added in v1.0.0

## partitionWithIndex

Separate elements based on a predicate that also exposes the index of the element.

**Signature**

```ts
export declare const partitionWithIndex: {
  <C extends A, B extends A, A = C>(refinement: (i: number, a: A) => a is B): (
    fb: Chunk<C>
  ) => readonly [Chunk<C>, Chunk<B>]
  <B extends A, A = B>(predicate: (i: number, a: A) => boolean): (fb: Chunk<B>) => readonly [Chunk<B>, Chunk<B>]
}
```

Added in v1.0.0

## separate

Partitions the elements of this chunk into two chunks.

**Signature**

```ts
export declare const separate: <A, B>(fa: Chunk<Result<A, B>>) => readonly [Chunk<A>, Chunk<B>]
```

Added in v1.0.0

# folding

## join

Joins the elements together with "sep" in the middle.

**Signature**

```ts
export declare const join: (sep: string) => (self: Chunk<string>) => string
```

Added in v1.0.0

## mapAccum

Statefully maps over the chunk, producing new elements of type `B`.

**Signature**

```ts
export declare function mapAccum<A, B, S>(s: S, f: (s: S, a: A) => readonly [S, B])
```

Added in v1.0.0

## reduce

Folds over the elements in this chunk from the left.

**Signature**

```ts
export declare const reduce: <A, S>(s: S, f: (s: S, a: A) => S) => (self: Chunk<A>) => S
```

Added in v1.0.0

## reduceRight

Folds over the elements in this chunk from the right.

**Signature**

```ts
export declare const reduceRight: <A, S>(s: S, f: (a: A, s: S) => S) => (self: Chunk<A>) => S
```

Added in v1.0.0

## reduceRightWithIndex

Folds over the elements in this chunk from the right.

**Signature**

```ts
export declare const reduceRightWithIndex: <A, S>(s: S, f: (i: number, a: A, s: S) => S) => (self: Chunk<A>) => S
```

Added in v1.0.0

## reduceWithIndex

Folds over the elements in this chunk from the left.

**Signature**

```ts
export declare const reduceWithIndex: <A, S>(s: S, f: (i: number, s: S, a: A) => S) => (self: Chunk<A>) => S
```

Added in v1.0.0

# mapping

## map

Returns an effect whose success is mapped by the specified f function.

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (self: Chunk<A>) => Chunk<B>
```

Added in v1.0.0

## mapWithIndex

Returns an effect whose success is mapped by the specified f function.

**Signature**

```ts
export declare const mapWithIndex: <A, B>(f: (i: number, a: A) => B) => (self: Chunk<A>) => Chunk<B>
```

Added in v1.0.0

# model

## Chunk (interface)

**Signature**

```ts
export interface Chunk<A> extends Iterable<A>, DeepEqual {
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
```

Added in v1.0.0

# mutations

## append

Appends the value to the chunk

**Signature**

```ts
export declare const append: <A1>(a: A1) => <A>(self: Chunk<A>) => Chunk<A1 | A>
```

Added in v1.0.0

## concat

Concatenates the two chunks

**Signature**

```ts
export declare const concat: <B>(that: Chunk<B>) => <A>(self: Chunk<A>) => Chunk<B | A>
```

Added in v1.0.0

## drop

Drops the first up to `n` elements from the chunk

**Signature**

```ts
export declare const drop: (n: number) => <A>(self: Chunk<A>) => Chunk<A>
```

Added in v1.0.0

## dropRight

Drops the last `n` elements.

**Signature**

```ts
export declare const dropRight: (n: number) => <A>(self: Chunk<A>) => Chunk<A>
```

Added in v1.0.0

## dropWhile

Drops all elements so long as the predicate returns true.

**Signature**

```ts
export declare const dropWhile: <A>(f: (a: A) => boolean) => (self: Chunk<A>) => Chunk<A>
```

Added in v1.0.0

## prepend

Prepends the value to the chunk

**Signature**

```ts
export declare const prepend: <A1>(a: A1) => <A>(self: Chunk<A>) => Chunk<A1 | A>
```

Added in v1.0.0

## take

Takes the first up to `n` elements from the chunk

**Signature**

```ts
export declare const take: (n: number) => <A>(self: Chunk<A>) => Chunk<A>
```

Added in v1.0.0

# sequencing

## flatMap

Returns a chunk with the elements mapped by the specified function.

**Signature**

```ts
export declare const flatMap: <A, B>(f: (a: A) => Chunk<B>) => (self: Chunk<A>) => Chunk<B>
```

Added in v1.0.0

## flatten

Flattens a chunk of chunks into a single chunk by concatenating all chunks.

**Signature**

```ts
export declare const flatten: <A>(self: Chunk<Chunk<A>>) => Chunk<A>
```

Added in v1.0.0

# symbol

## TypeId (type alias)

**Signature**

```ts
export type TypeId = typeof TypeId
```

Added in v1.0.0

# unsafe

## unsafeFromArray

Wraps an array into a chunk without copying, unsafe on mutable arrays

**Signature**

```ts
export declare const unsafeFromArray: <A>(self: readonly A[]) => Chunk<A>
```

Added in v1.0.0

## unsafeGet

Gets an element unsafely, will throw on out of bounds

**Signature**

```ts
export declare const unsafeGet: (index: number) => <A>(self: Chunk<A>) => A
```

Added in v1.0.0

## unsafeHead

Returns the first element of this chunk.

**Signature**

```ts
export declare const unsafeHead: <A>(self: Chunk<A>) => A
```

Added in v1.0.0

## unsafeLast

Returns the last element of this chunk.

**Signature**

```ts
export declare const unsafeLast: <A>(self: Chunk<A>) => A
```

Added in v1.0.0
