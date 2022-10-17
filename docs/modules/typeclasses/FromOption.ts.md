---
title: typeclasses/FromOption.ts
nav_order: 40
parent: Modules
---

## FromOption overview

The `FromOption` type class represents those data types which support embedding of `Option<A>`.

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [conversions](#conversions)
  - [fromNullable](#fromnullable)
- [lifting](#lifting)
  - [liftNullable](#liftnullable)
  - [liftOption](#liftoption)
  - [liftPredicate](#liftpredicate)
- [models](#models)
  - [FromOption (interface)](#fromoption-interface)
- [sequencing](#sequencing)
  - [flatMapNullable](#flatmapnullable)

---

# conversions

## fromNullable

**Signature**

```ts
export declare const fromNullable: <F extends TypeLambda>(
  F: FromOption<F>
) => <A, S>(a: A) => Kind<F, S, unknown, never, never, NonNullable<A>>
```

Added in v1.0.0

# lifting

## liftNullable

**Signature**

```ts
export declare const liftNullable: <F extends TypeLambda>(
  F: FromOption<F>
) => <A extends readonly unknown[], B>(
  f: (...a: A) => B | null | undefined
) => <S, R, O, E>(...a: A) => Kind<F, S, R, O, E, NonNullable<B>>
```

Added in v1.0.0

## liftOption

**Signature**

```ts
export declare const liftOption: <F extends TypeLambda>(
  F: FromOption<F>
) => <A extends readonly unknown[], B>(
  f: (...a: A) => O.Option<B>
) => <S>(...a: A) => Kind<F, S, unknown, never, never, B>
```

Added in v1.0.0

## liftPredicate

**Signature**

```ts
export declare const liftPredicate: <F extends TypeLambda>(
  F: FromOption<F>
) => {
  <C extends A, B extends A, A = C>(refinement: Refinement<A, B>): <S>(c: C) => Kind<F, S, unknown, never, never, B>
  <B extends A, A = B>(predicate: Predicate<A>): <S>(b: B) => Kind<F, S, unknown, never, never, B>
}
```

Added in v1.0.0

# models

## FromOption (interface)

**Signature**

```ts
export interface FromOption<F extends TypeLambda> extends TypeClass<F> {
  readonly fromOption: <A, S>(fa: O.Option<A>) => Kind<F, S, unknown, never, never, A>
}
```

Added in v1.0.0

# sequencing

## flatMapNullable

**Signature**

```ts
export declare const flatMapNullable: <F extends TypeLambda>(
  F: FromOption<F>,
  C: FlatMap<F>
) => <A, B>(
  f: (a: A) => B | null | undefined
) => <S, R, O, E>(self: Kind<F, S, R, O, E, A>) => Kind<F, S, R, O, E, NonNullable<B>>
```

Added in v1.0.0
