---
title: typeclass/FilterableWithIndex.ts
nav_order: 43
parent: Modules
---

## FilterableWithIndex overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [models](#models)
  - [FilterableWithIndex (interface)](#filterablewithindex-interface)
- [utils](#utils)
  - [filterMap](#filtermap)
  - [filterMapWithIndexComposition](#filtermapwithindexcomposition)
  - [filterWithIndex](#filterwithindex)
  - [partitionMapWithIndex](#partitionmapwithindex)
  - [partitionWithIndex](#partitionwithindex)

---

# models

## FilterableWithIndex (interface)

**Signature**

```ts
export interface FilterableWithIndex<F extends TypeLambda, I> extends TypeClass<F> {
  readonly filterMapWithIndex: <A, B>(
    f: (a: A, i: I) => Option<B>
  ) => <R, O, E>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, B>
}
```

Added in v1.0.0

# utils

## filterMap

Returns a default `filterMap` implementation.

**Signature**

```ts
export declare const filterMap: <F extends TypeLambda, I>(
  F: FilterableWithIndex<F, I>
) => <A, B>(f: (a: A) => O.Option<B>) => <R, O, E>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, B>
```

Added in v1.0.0

## filterMapWithIndexComposition

Returns a default `filterMapWithIndex` composition.

**Signature**

```ts
export declare const filterMapWithIndexComposition: <F extends TypeLambda, G extends TypeLambda, I>(
  F: Covariant<F>,
  G: FilterableWithIndex<G, I>
) => <A, B>(
  f: (a: A, i: I) => O.Option<B>
) => <FR, FO, FE, GR, GO, GE>(
  self: Kind<F, FR, FO, FE, Kind<G, GR, GO, GE, A>>
) => Kind<F, FR, FO, FE, Kind<G, GR, GO, GE, B>>
```

Added in v1.0.0

## filterWithIndex

**Signature**

```ts
export declare const filterWithIndex: <F extends TypeLambda, I>(
  F: FilterableWithIndex<F, I>
) => {
  <C extends A, B extends A, A = C>(refinement: (a: A, i: I) => a is B): <R, O, E>(
    self: Kind<F, R, O, E, C>
  ) => Kind<F, R, O, E, B>
  <B extends A, A = B>(predicate: (a: A, i: I) => boolean): <R, O, E>(self: Kind<F, R, O, E, B>) => Kind<F, R, O, E, B>
}
```

Added in v1.0.0

## partitionMapWithIndex

**Signature**

```ts
export declare const partitionMapWithIndex: <F extends TypeLambda, I>(
  F: FilterableWithIndex<F, I>
) => <A, B, C>(
  f: (a: A, i: I) => Either<B, C>
) => <R, O, E>(self: Kind<F, R, O, E, A>) => readonly [Kind<F, R, O, E, B>, Kind<F, R, O, E, C>]
```

Added in v1.0.0

## partitionWithIndex

**Signature**

```ts
export declare const partitionWithIndex: <F extends TypeLambda, I>(
  F: FilterableWithIndex<F, I>
) => {
  <C extends A, B extends A, A = C>(refinement: (a: A, i: I) => a is B): <R, O, E>(
    self: Kind<F, R, O, E, C>
  ) => readonly [Kind<F, R, O, E, C>, Kind<F, R, O, E, B>]
  <B extends A, A = B>(predicate: (a: A, i: I) => boolean): <R, O, E>(
    self: Kind<F, R, O, E, B>
  ) => readonly [Kind<F, R, O, E, B>, Kind<F, R, O, E, B>]
}
```

Added in v1.0.0
