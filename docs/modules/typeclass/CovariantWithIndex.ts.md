---
title: typeclass/CovariantWithIndex.ts
nav_order: 38
parent: Modules
---

## CovariantWithIndex overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [type class](#type-class)
  - [CovariantWithIndex (interface)](#covariantwithindex-interface)
- [utils](#utils)
  - [map](#map)
  - [mapWithIndexComposition](#mapwithindexcomposition)

---

# type class

## CovariantWithIndex (interface)

**Signature**

```ts
export interface CovariantWithIndex<F extends TypeLambda, I> extends TypeClass<F> {
  readonly mapWithIndex: <A, B>(f: (a: A, i: I) => B) => <R, O, E>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, B>
}
```

Added in v1.0.0

# utils

## map

Returns a default `map` implementation.

**Signature**

```ts
export declare const map: <F extends TypeLambda, I>(
  F: CovariantWithIndex<F, I>
) => <A, B>(f: (a: A) => B) => <R, O, E>(self: Kind<F, R, O, E, A>) => Kind<F, R, O, E, B>
```

Added in v1.0.0

## mapWithIndexComposition

Returns a default `mapWithIndex` composition.

**Signature**

```ts
export declare const mapWithIndexComposition: <F extends TypeLambda, I, G extends TypeLambda, J>(
  F: CovariantWithIndex<F, I>,
  G: CovariantWithIndex<G, J>
) => <A, B>(
  f: (a: A, ij: readonly [I, J]) => B
) => <FR, FO, FE, GR, GO, GE>(
  self: Kind<F, FR, FO, FE, Kind<G, GR, GO, GE, A>>
) => Kind<F, FR, FO, FE, Kind<G, GR, GO, GE, B>>
```

Added in v1.0.0
