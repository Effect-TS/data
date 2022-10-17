---
title: typeclasses/Compactable.ts
nav_order: 39
parent: Modules
---

## Compactable overview

`Compactable` represents data structures which can be _compacted_/_separated_.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [models](#models)
  - [Compactable (interface)](#compactable-interface)
- [utils](#utils)
  - [compactComposition](#compactcomposition)
  - [separate](#separate)

---

# models

## Compactable (interface)

**Signature**

```ts
export interface Compactable<F extends TypeLambda> extends TypeClass<F> {
  readonly compact: <S, R, O, E, A>(self: Kind<F, S, R, O, E, Option<A>>) => Kind<F, S, R, O, E, A>
}
```

Added in v1.0.0

# utils

## compactComposition

Returns a default `compact` composition.

**Signature**

```ts
export declare const compactComposition: <F extends TypeLambda, G extends TypeLambda>(
  Functor: Functor<F>,
  Compactable: Compactable<G>
) => <FS, FR, FO, FE, GS, GR, GO, GE, A>(
  self: Kind<F, FS, FR, FO, FE, Kind<G, GS, GR, GO, GE, Option<A>>>
) => Kind<F, FS, FR, FO, FE, Kind<G, GS, GR, GO, GE, A>>
```

Added in v1.0.0

## separate

**Signature**

```ts
export declare const separate: <F extends TypeLambda>(
  Functor: Functor<F>,
  Compactable: Compactable<F>
) => <S, R, O, E, A, B>(
  self: Kind<F, S, R, O, E, Result<A, B>>
) => readonly [Kind<F, S, R, O, E, A>, Kind<F, S, R, O, E, B>]
```

Added in v1.0.0
