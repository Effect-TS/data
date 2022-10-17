---
title: Identity.ts
nav_order: 17
parent: Modules
---

## Identity overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [of](#of)
- [conversions](#conversions)
  - [toReadonlyArray](#toreadonlyarray)
- [do notation](#do-notation)
  - [Do](#do)
  - [bind](#bind)
  - [bindRight](#bindright)
  - [bindTo](#bindto)
  - [let](#let)
- [folding](#folding)
  - [foldMap](#foldmap)
  - [reduce](#reduce)
  - [reduceRight](#reduceright)
- [instances](#instances)
  - [CategoryKind](#categorykind)
  - [Comonad](#comonad)
  - [ComposableKind](#composablekind)
  - [Extendable](#extendable)
  - [FlatMap](#flatmap)
  - [Foldable](#foldable)
  - [Functor](#functor)
  - [Monad](#monad)
  - [Monoidal](#monoidal)
  - [Pointed](#pointed)
  - [SemigroupKind](#semigroupkind)
  - [Semigroupal](#semigroupal)
  - [Traversable](#traversable)
- [lifting](#lifting)
  - [lift2](#lift2)
  - [lift3](#lift3)
- [mapping](#mapping)
  - [as](#as)
  - [flap](#flap)
  - [map](#map)
  - [unit](#unit)
- [models](#models)
  - [Identity (type alias)](#identity-type-alias)
- [sequencing](#sequencing)
  - [flatMap](#flatmap)
  - [zipLeft](#zipleft)
  - [zipRight](#zipright)
- [traversing](#traversing)
  - [sequence](#sequence)
  - [traverse](#traverse)
- [tuple sequencing](#tuple-sequencing)
  - [Zip](#zip)
  - [tupled](#tupled)
  - [zipFlatten](#zipflatten)
- [type lambdas](#type-lambdas)
  - [IdentityTypeLambda (interface)](#identitytypelambda-interface)
- [utils](#utils)
  - [ap](#ap)
  - [combineKind](#combinekind)
  - [combineKindMany](#combinekindmany)
  - [composeKind](#composekind)
  - [duplicate](#duplicate)
  - [extend](#extend)
  - [extract](#extract)
  - [flatten](#flatten)
  - [idKind](#idkind)
  - [zipAll](#zipall)
  - [zipMany](#zipmany)
  - [zipWith](#zipwith)

---

# constructors

## of

**Signature**

```ts
export declare const of: <A>(a: A) => A
```

Added in v1.0.0

# conversions

## toReadonlyArray

**Signature**

```ts
export declare const toReadonlyArray: <A>(self: A) => readonly A[]
```

Added in v1.0.0

# do notation

## Do

**Signature**

```ts
export declare const Do: {}
```

Added in v1.0.0

## bind

**Signature**

```ts
export declare const bind: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (self: A) => { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }
```

Added in v1.0.0

## bindRight

A variant of `bind` that sequentially ignores the scope.

**Signature**

```ts
export declare const bindRight: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  fb: B
) => (self: A) => { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }
```

Added in v1.0.0

## bindTo

**Signature**

```ts
export declare const bindTo: <N extends string>(name: N) => <A>(self: A) => { readonly [K in N]: A }
```

Added in v1.0.0

## let

**Signature**

```ts
export declare const let: <N extends string, A extends object, B>(
  name: Exclude<N, keyof A>,
  f: (a: A) => B
) => (self: A) => { readonly [K in N | keyof A]: K extends keyof A ? A[K] : B }
```

Added in v1.0.0

# folding

## foldMap

**Signature**

```ts
export declare const foldMap: <M>(_: Monoid<M>) => <A>(f: (a: A) => M) => (self: A) => M
```

Added in v1.0.0

## reduce

**Signature**

```ts
export declare const reduce: <B, A>(b: B, f: (b: B, a: A) => B) => (self: A) => B
```

Added in v1.0.0

## reduceRight

**Signature**

```ts
export declare const reduceRight: <B, A>(b: B, f: (b: B, a: A) => B) => (self: A) => B
```

Added in v1.0.0

# instances

## CategoryKind

**Signature**

```ts
export declare const CategoryKind: categoryKind.CategoryKind<IdentityTypeLambda>
```

Added in v1.0.0

## Comonad

**Signature**

```ts
export declare const Comonad: comonad.Comonad<IdentityTypeLambda>
```

Added in v1.0.0

## ComposableKind

**Signature**

```ts
export declare const ComposableKind: composableKind.ComposableKind<IdentityTypeLambda>
```

Added in v1.0.0

## Extendable

**Signature**

```ts
export declare const Extendable: extendable.Extendable<IdentityTypeLambda>
```

Added in v1.0.0

## FlatMap

**Signature**

```ts
export declare const FlatMap: flatMap_.FlatMap<IdentityTypeLambda>
```

Added in v1.0.0

## Foldable

**Signature**

```ts
export declare const Foldable: foldable.Foldable<IdentityTypeLambda>
```

Added in v1.0.0

## Functor

**Signature**

```ts
export declare const Functor: functor.Functor<IdentityTypeLambda>
```

Added in v1.0.0

## Monad

**Signature**

```ts
export declare const Monad: monad.Monad<IdentityTypeLambda>
```

Added in v1.0.0

## Monoidal

**Signature**

```ts
export declare const Monoidal: monoidal.Monoidal<IdentityTypeLambda>
```

Added in v1.0.0

## Pointed

**Signature**

```ts
export declare const Pointed: pointed.Pointed<IdentityTypeLambda>
```

Added in v1.0.0

## SemigroupKind

**Signature**

```ts
export declare const SemigroupKind: semigroupKind.SemigroupKind<IdentityTypeLambda>
```

Added in v1.0.0

## Semigroupal

**Signature**

```ts
export declare const Semigroupal: semigroupal.Semigroupal<IdentityTypeLambda>
```

Added in v1.0.0

## Traversable

**Signature**

```ts
export declare const Traversable: traversable.Traversable<IdentityTypeLambda>
```

Added in v1.0.0

# lifting

## lift2

Lifts a binary function into `Identity`.

**Signature**

```ts
export declare const lift2: <A, B, C>(f: (a: A, b: B) => C) => (fa: A, fb: B) => C
```

Added in v1.0.0

## lift3

Lifts a ternary function into `Identity`.

**Signature**

```ts
export declare const lift3: <A, B, C, D>(f: (a: A, b: B, c: C) => D) => (fa: A, fb: B, fc: C) => D
```

Added in v1.0.0

# mapping

## as

Maps the success value of this effect to the specified constant value.

**Signature**

```ts
export declare const as: <B>(b: B) => <A>(self: A) => B
```

Added in v1.0.0

## flap

**Signature**

```ts
export declare const flap: <A>(a: A) => <B>(self: (a: A) => B) => B
```

Added in v1.0.0

## map

Returns an effect whose success is mapped by the specified `f` function.

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (self: A) => B
```

Added in v1.0.0

## unit

Returns the effect resulting from mapping the success of this effect to unit.

**Signature**

```ts
export declare const unit: <A>(self: A) => Identity<void>
```

Added in v1.0.0

# models

## Identity (type alias)

**Signature**

```ts
export type Identity<A> = A
```

Added in v1.0.0

# sequencing

## flatMap

**Signature**

```ts
export declare const flatMap: <A, B>(f: (a: A) => B) => (self: A) => B
```

Added in v1.0.0

## zipLeft

Sequences the specified effect after this effect, but ignores the value
produced by the effect.

**Signature**

```ts
export declare const zipLeft: (that: Identity<unknown>) => <A>(self: A) => A
```

Added in v1.0.0

## zipRight

A variant of `flatMap` that ignores the value produced by this effect.

**Signature**

```ts
export declare const zipRight: <A>(that: A) => (self: Identity<unknown>) => A
```

Added in v1.0.0

# traversing

## sequence

**Signature**

```ts
export declare const sequence: <F extends TypeLambda>(
  _: monoidal.Monoidal<F>
) => <S, R, O, E, A>(self: Kind<F, S, R, O, E, A>) => Kind<F, S, R, O, E, A>
```

Added in v1.0.0

## traverse

**Signature**

```ts
export declare const traverse: <F extends TypeLambda>(
  Monoidal: monoidal.Monoidal<F>
) => <A, S, R, O, E, B>(f: (a: A) => Kind<F, S, R, O, E, B>) => (self: A) => Kind<F, S, R, O, E, B>
```

Added in v1.0.0

# tuple sequencing

## Zip

**Signature**

```ts
export declare const Zip: readonly []
```

Added in v1.0.0

## tupled

**Signature**

```ts
export declare const tupled: <A>(self: A) => readonly [A]
```

Added in v1.0.0

## zipFlatten

Sequentially zips this effect with the specified effect.

**Signature**

```ts
export declare const zipFlatten: <B>(fb: B) => <A extends readonly unknown[]>(self: A) => readonly [...A, B]
```

Added in v1.0.0

# type lambdas

## IdentityTypeLambda (interface)

**Signature**

```ts
export interface IdentityTypeLambda extends TypeLambda {
  readonly type: Identity<this['Out1']>
}
```

Added in v1.0.0

# utils

## ap

**Signature**

```ts
export declare const ap: <A>(fa: A) => <B>(self: (a: A) => B) => B
```

Added in v1.0.0

## combineKind

**Signature**

```ts
export declare const combineKind: <B>(that: B) => <A>(self: A) => B | A
```

Added in v1.0.0

## combineKindMany

**Signature**

```ts
export declare const combineKindMany: <A>(collection: Iterable<A>) => (self: A) => A
```

Added in v1.0.0

## composeKind

**Signature**

```ts
export declare const composeKind: <B, C>(that: (b: B) => C) => <A>(self: (a: A) => B) => (a: A) => C
```

Added in v1.0.0

## duplicate

**Signature**

```ts
export declare const duplicate: <A>(self: A) => A
```

Added in v1.0.0

## extend

**Signature**

```ts
export declare const extend: <A, B>(f: (that: A) => B) => (self: A) => B
```

Added in v1.0.0

## extract

**Signature**

```ts
export declare const extract: <A>(self: A) => A
```

Added in v1.0.0

## flatten

**Signature**

```ts
export declare const flatten: <A>(self: A) => A
```

Added in v1.0.0

## idKind

**Signature**

```ts
export declare const idKind: <A>() => (a: A) => A
```

Added in v1.0.0

## zipAll

**Signature**

```ts
export declare const zipAll: <A>(collection: Iterable<A>) => readonly A[]
```

Added in v1.0.0

## zipMany

**Signature**

```ts
export declare const zipMany: <A>(collection: Iterable<A>) => (self: A) => readonly [A, ...A[]]
```

Added in v1.0.0

## zipWith

**Signature**

```ts
export declare const zipWith: <B, A, C>(that: B, f: (a: A, b: B) => C) => (self: A) => C
```

Added in v1.0.0
