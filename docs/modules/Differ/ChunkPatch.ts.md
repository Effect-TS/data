---
title: Differ/ChunkPatch.ts
nav_order: 10
parent: Modules
---

## ChunkPatch overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [diff](#diff)
  - [empty](#empty)
- [destructors](#destructors)
  - [patch](#patch)
- [models](#models)
  - [ChunkPatch (interface)](#chunkpatch-interface)
- [symbol](#symbol)
  - [TypeId (type alias)](#typeid-type-alias)
- [utils](#utils)
  - [combine](#combine)

---

# constructors

## diff

Constructs a chunk patch from a new and old chunk of values and a differ
for the values.

**Signature**

```ts
export declare const diff: <Value, Patch>(options: {
  readonly oldValue: Chunk<Value>
  readonly newValue: Chunk<Value>
  readonly differ: Differ<Value, Patch>
}) => ChunkPatch<Value, Patch>
```

Added in v1.0.0

## empty

Constructs an empty chunk patch.

**Signature**

```ts
export declare const empty: <Value, Patch>() => ChunkPatch<Value, Patch>
```

Added in v1.0.0

# destructors

## patch

Applies a chunk patch to a chunk of values to produce a new chunk of
values which represents the original chunk of values updated with the
changes described by this patch.

**Signature**

```ts
export declare const patch: {
  <Value, Patch>(oldValue: Chunk<Value>, differ: Differ<Value, Patch>): (self: ChunkPatch<Value, Patch>) => Chunk<Value>
  <Value, Patch>(self: ChunkPatch<Value, Patch>, oldValue: Chunk<Value>, differ: Differ<Value, Patch>): Chunk<Value>
}
```

Added in v1.0.0

# models

## ChunkPatch (interface)

A patch which describes updates to a chunk of values.

**Signature**

```ts
export interface ChunkPatch<Value, Patch> extends Equal {
  readonly _id: TypeId
  readonly _Value: (_: Value) => Value
  readonly _Patch: (_: Patch) => Patch
}
```

Added in v1.0.0

# symbol

## TypeId (type alias)

**Signature**

```ts
export type TypeId = typeof TypeId
```

Added in v1.0.0

# utils

## combine

Combines two chunk patches to produce a new chunk patch that describes
applying their changes sequentially.

**Signature**

```ts
export declare const combine: {
  <Value, Patch>(that: ChunkPatch<Value, Patch>): (self: ChunkPatch<Value, Patch>) => ChunkPatch<Value, Patch>
  <Value, Patch>(self: ChunkPatch<Value, Patch>, that: ChunkPatch<Value, Patch>): ChunkPatch<Value, Patch>
}
```

Added in v1.0.0
