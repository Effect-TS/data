---
title: Chunk.ts
nav_order: 2
parent: Modules
---

## Chunk overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [empty](#empty)
  - [isChunk](#ischunk)
  - [make](#make)
  - [makeBy](#makeby)
  - [range](#range)
  - [singleton](#singleton)
- [conversions](#conversions)
  - [fromIterable](#fromiterable)
  - [toReadonlyArray](#toreadonlyarray)
- [elements](#elements)
  - [chunksOf](#chunksof)
  - [correspondsTo](#correspondsto)
  - [cross](#cross)
  - [crossWith](#crosswith)
  - [dedupe](#dedupe)
  - [elem](#elem)
  - [every](#every)
  - [findFirst](#findfirst)
  - [findFirstIndex](#findfirstindex)
  - [findLast](#findlast)
  - [findLastIndex](#findlastindex)
  - [forEach](#foreach)
  - [get](#get)
  - [head](#head)
  - [headNonEmpty](#headnonempty)
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
  - [tailNonEmpty](#tailnonempty)
  - [takeRight](#takeright)
  - [takeWhile](#takewhile)
  - [unfold](#unfold)
  - [union](#union)
  - [unzip](#unzip)
  - [zip](#zip)
  - [zipAll](#zipall)
  - [zipAllWith](#zipallwith)
  - [zipWith](#zipwith)
  - [zipWithIndex](#zipwithindex)
  - [zipWithIndexOffset](#zipwithindexoffset)
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
  - [NonEmptyChunk (interface)](#nonemptychunk-interface)
- [models](#models)
  - [Chunk (interface)](#chunk-interface)
- [mutations](#mutations)
  - [append](#append)
  - [concat](#concat)
  - [drop](#drop)
  - [dropRight](#dropright)
  - [dropWhile](#dropwhile)
  - [modify](#modify)
  - [modifyOption](#modifyoption)
  - [prepend](#prepend)
  - [prependAllNonEmpty](#prependallnonempty)
  - [remove](#remove)
  - [replace](#replace)
  - [replaceOption](#replaceoption)
  - [take](#take)
- [sequencing](#sequencing)
  - [flatMap](#flatmap)
  - [flatten](#flatten)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)
- [type lambdas](#type-lambdas)
  - [ChunkTypeLambda (interface)](#chunktypelambda-interface)
- [unsafe](#unsafe)
  - [unsafeFromArray](#unsafefromarray)
  - [unsafeGet](#unsafeget)
  - [unsafeHead](#unsafehead)
  - [unsafeLast](#unsafelast)

---

# constructors

## empty

**Signature**

```ts
export declare const empty: <A = never>() => Chunk<A>
```

Added in v1.0.0

## isChunk

Checks if `u` is a `Chunk<unknown>`

**Signature**

```ts
export declare const isChunk: { <A>(u: Iterable<A>): u is Chunk<A>; (u: unknown): u is Chunk<unknown> }
```

Added in v1.0.0

## make

Builds a `NonEmptyChunk` from an non-empty collection of elements.

**Signature**

```ts
export declare const make: <As extends readonly [any, ...any[]]>(...as: As) => NonEmptyChunk<As[number]>
```

Added in v1.0.0

## makeBy

Return a Chunk of length n with element i initialized with f(i).

**Note**. `n` is normalized to an integer >= 1.

**Signature**

```ts
export declare const makeBy: <A>(f: (i: number) => A) => (n: number) => NonEmptyChunk<A>
```

Added in v1.0.0

## range

Create a non empty `Chunk` containing a range of integers, including both endpoints.

**Signature**

```ts
export declare const range: (start: number, end: number) => NonEmptyChunk<number>
```

Added in v1.0.0

## singleton

Builds a `NonEmptyChunk` from a single element.

**Signature**

```ts
export declare const singleton: <A>(a: A) => NonEmptyChunk<A>
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

## toReadonlyArray

Converts to a `ReadonlyArray<A>`

**Signature**

```ts
export declare const toReadonlyArray: <A>(self: Chunk<A>) => readonly A[]
```

Added in v1.0.0

# elements

## chunksOf

Groups elements in chunks of up to `n` elements.

**Signature**

```ts
export declare const chunksOf: (n: number) => <A>(self: Chunk<A>) => Chunk<Chunk<A>>
```

Added in v1.0.0

## correspondsTo

Compares the two chunks of equal length using the specified function

**Signature**

```ts
export declare const correspondsTo: <A, B>(that: Chunk<B>, f: (a: A, b: B) => boolean) => (self: Chunk<A>) => boolean
```

Added in v1.0.0

## cross

Zips this chunk crosswise with the specified chunk.

**Signature**

```ts
export declare const cross: <B>(that: Chunk<B>) => <A>(self: Chunk<A>) => Chunk<readonly [A, B]>
```

Added in v1.0.0

## crossWith

Zips this chunk crosswise with the specified chunk using the specified combiner.

**Signature**

```ts
export declare const crossWith: <A, B, C>(that: Chunk<B>, f: (a: A, b: B) => C) => (self: Chunk<A>) => Chunk<C>
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
export declare const elem: <B>(b: B) => <A>(self: Chunk<A>) => boolean
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
export declare function findFirst<A, B extends A>(refinement: Refinement<A, B>): (self: Chunk<A>) => Option<B>
export declare function findFirst<A>(predicate: Predicate<A>): (self: Chunk<A>) => Option<A>
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

This function provides a safe way to read a value at a particular index from a `Chunk`.

**Signature**

```ts
export declare const get: (i: number) => <A>(self: Chunk<A>) => Option<A>
```

Added in v1.0.0

## head

Returns the first element of this chunk if it exists.

**Signature**

```ts
export declare const head: <A>(self: Chunk<A>) => Option<A>
```

Added in v1.0.0

## headNonEmpty

Returns the first element of this non empty chunk.

**Signature**

```ts
export declare const headNonEmpty: <A>(self: NonEmptyChunk<A>) => A
```

Added in v1.0.0

## intersection

Creates a Chunk of unique values that are included in all given Chunks.

The order and references of result values are determined by the Chunk.

**Signature**

```ts
export declare const intersection: <A>(that: Chunk<A>) => <B>(self: Chunk<B>) => Chunk<A & B>
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
export declare const isNonEmpty: <A>(self: Chunk<A>) => self is NonEmptyChunk<A>
```

Added in v1.0.0

## last

Returns the last element of this chunk if it exists.

**Signature**

```ts
export declare const last: <A>(self: Chunk<A>) => Option<A>
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
export declare const sort: <B>(O: Order<B>) => <A extends B>(as: Chunk<A>) => Chunk<A>
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
export declare const tail: <A>(self: Chunk<A>) => Option<Chunk<A>>
```

Added in v1.0.0

## tailNonEmpty

Returns every elements after the first.

**Signature**

```ts
export declare const tailNonEmpty: <A>(self: NonEmptyChunk<A>) => Chunk<A>
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
export declare const unfold: <A, S>(s: S, f: (s: S) => Option<readonly [A, S]>) => Chunk<A>
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

Zips this chunk pointwise with the specified chunk.

**Signature**

```ts
export declare const zip: <B>(that: Chunk<B>) => <A>(self: Chunk<A>) => Chunk<readonly [A, B]>
```

Added in v1.0.0

## zipAll

Zips this chunk pointwise with the specified chunk to produce a new chunk with
pairs of elements from each chunk, filling in missing values from the
shorter chunk with `None`. The returned chunk will have the length of the
longer chunk.

**Signature**

```ts
export declare const zipAll: <B>(that: Chunk<B>) => <A>(self: Chunk<A>) => Chunk<readonly [Option<A>, Option<B>]>
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

Zips this chunk pointwise with the specified chunk using the specified combiner.

**Signature**

```ts
export declare const zipWith: <A, B, C>(that: Chunk<B>, f: (a: A, b: B) => C) => (self: Chunk<A>) => Chunk<C>
```

Added in v1.0.0

## zipWithIndex

Zips this chunk with the index of every element, starting from the initial
index value.

**Signature**

```ts
export declare const zipWithIndex: <A>(self: Chunk<A>) => Chunk<readonly [A, number]>
```

Added in v1.0.0

## zipWithIndexOffset

Zips this chunk with the index of every element, starting from the initial
index value.

**Signature**

```ts
export declare const zipWithIndexOffset: (offset: number) => <A>(self: Chunk<A>) => Chunk<[A, number]>
```

Added in v1.0.0

# filtering

## compact

Filter out optional values

**Signature**

```ts
export declare const compact: <A>(self: Iterable<Option<A>>) => Chunk<A>
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
export declare const filter: {
  <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): (self: Chunk<C>) => Chunk<B>
  <B extends A, A = B>(predicate: Predicate<A>): (self: Chunk<B>) => Chunk<B>
}
```

Added in v1.0.0

## filterMap

Returns a filtered and mapped subset of the elements.

**Signature**

```ts
export declare const filterMap: <A, B>(f: (a: A) => Option<B>) => (self: Iterable<A>) => Chunk<B>
```

Added in v1.0.0

## filterMapWhile

Transforms all elements of the chunk for as long as the specified function returns some value

**Signature**

```ts
export declare const filterMapWhile: <A, B>(f: (a: A) => Option<B>) => (self: Iterable<A>) => Chunk<B>
```

Added in v1.0.0

## filterMapWithIndex

Returns a filtered and mapped subset of the elements.

**Signature**

```ts
export declare const filterMapWithIndex: <A, B>(f: (a: A, i: number) => Option<B>) => (self: Iterable<A>) => Chunk<B>
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
  f: (a: A) => Either<B, C>
) => (fa: Chunk<A>) => readonly [Chunk<B>, Chunk<C>]
```

Added in v1.0.0

## partitionWithIndex

Separate elements based on a predicate that also exposes the index of the element.

**Signature**

```ts
export declare const partitionWithIndex: {
  <C extends A, B extends A, A = C>(refinement: (a: A, i: number) => a is B): (
    fb: Chunk<C>
  ) => readonly [Chunk<C>, Chunk<B>]
  <B extends A, A = B>(predicate: (a: A, i: number) => boolean): (fb: Chunk<B>) => readonly [Chunk<B>, Chunk<B>]
}
```

Added in v1.0.0

## separate

Partitions the elements of this chunk into two chunks.

**Signature**

```ts
export declare const separate: <A, B>(self: Chunk<Either<A, B>>) => readonly [Chunk<A>, Chunk<B>]
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
export declare function mapAccum<S, A, B>(s: S, f: (s: S, a: A) => readonly [S, B])
```

Added in v1.0.0

## reduce

Folds over the elements in this chunk from the left.

**Signature**

```ts
export declare const reduce: <A, B>(b: B, f: (s: B, a: A) => B) => (self: Chunk<A>) => B
```

Added in v1.0.0

## reduceRight

Folds over the elements in this chunk from the right.

**Signature**

```ts
export declare const reduceRight: <A, S>(s: S, f: (s: S, a: A) => S) => (self: Chunk<A>) => S
```

Added in v1.0.0

## reduceRightWithIndex

Folds over the elements in this chunk from the right.

**Signature**

```ts
export declare const reduceRightWithIndex: <B, A>(b: B, f: (b: B, a: A, i: number) => B) => (self: Chunk<A>) => B
```

Added in v1.0.0

## reduceWithIndex

Folds over the elements in this chunk from the left.

**Signature**

```ts
export declare const reduceWithIndex: <B, A>(b: B, f: (b: B, a: A, i: number) => B) => (self: Chunk<A>) => B
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
export declare const mapWithIndex: <A, B>(f: (a: A, i: number) => B) => (self: Chunk<A>) => Chunk<B>
```

Added in v1.0.0

# model

## NonEmptyChunk (interface)

**Signature**

```ts
export interface NonEmptyChunk<A> extends Chunk<A>, NonEmptyIterable<A> {}
```

Added in v1.0.0

# models

## Chunk (interface)

**Signature**

```ts
export interface Chunk<A> extends Iterable<A>, Equal.Equal {
  readonly _id: TypeId

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

## modify

Apply a function to the element at the specified index, creating a new `Chunk`,
or returning the input if the index is out of bounds.

**Signature**

```ts
export declare const modify: <A, B>(i: number, f: (a: A) => B) => (self: Chunk<A>) => Chunk<A | B>
```

Added in v1.0.0

## modifyOption

**Signature**

```ts
export declare const modifyOption: <A, B>(i: number, f: (a: A) => B) => (self: Chunk<A>) => Option<Chunk<A | B>>
```

Added in v1.0.0

## prepend

Prepends the value to the chunk

**Signature**

```ts
export declare const prepend: <B>(elem: B) => <A>(self: Chunk<A>) => Chunk<B | A>
```

Added in v1.0.0

## prependAllNonEmpty

**Signature**

```ts
export declare function prependAllNonEmpty<B>(that: NonEmptyChunk<B>): <A>(self: Chunk<A>) => NonEmptyChunk<A | B>
export declare function prependAllNonEmpty<B>(that: Chunk<B>): <A>(self: NonEmptyChunk<A>) => NonEmptyChunk<A | B>
```

Added in v1.0.0

## remove

Delete the element at the specified index, creating a new `Chunk`,
or returning the input if the index is out of bounds.

**Signature**

```ts
export declare const remove: (i: number) => <A>(self: Chunk<A>) => Chunk<A>
```

Added in v1.0.0

## replace

Change the element at the specified index, creating a new `Chunk`,
or returning the input if the index is out of bounds.

**Signature**

```ts
export declare const replace: <B>(i: number, b: B) => <A>(self: Chunk<A>) => Chunk<B | A>
```

Added in v1.0.0

## replaceOption

**Signature**

```ts
export declare const replaceOption: <B>(i: number, b: B) => <A>(self: Chunk<A>) => Option<Chunk<B | A>>
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

# type lambdas

## ChunkTypeLambda (interface)

**Signature**

```ts
export interface ChunkTypeLambda extends TypeLambda {
  readonly type: Chunk<this['Target']>
}
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
