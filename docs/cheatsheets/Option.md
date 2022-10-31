---
title: Option Cheatsheet
nav_order: 2
parent: Cheatsheets
---

# Option

## Constructors

| Name               | Given | To              |
| ------------------ | ----- | --------------- |
| none               |       | `Option<never>` |
| some               | `A`   | `Option<A>`     |
| of (alias of some) | `A`   | `Option<A>`     |

## Guards

| Name     | Given       | To                   |
| -------- | ----------- | -------------------- |
| isOption | `unknown`   | `is Option<unknown>` |
| isNone   | `Option<A>` | `is None`            |
| isSome   | `Option<A>` | `is Some<A>`         |

## Conversions

| Name         | Given            | To                       |
| ------------ | ---------------- | ------------------------ |
| fromIterable | `Iterable<A>`    | `Option<A>`              |
| fromNullable | `A`              | `Option<NonNullable<A>>` |
| fromEither   | `Either<E, A>`   | `Option<A>`              |
| toEither     | `Option<A>`, `E` | `Either<E, A>`           |

## Interop

| Name          | Given                  | To                    |
| ------------- | ---------------------- | --------------------- |
| fromThrowable | `() => A`              | `Option<A>`           |
| liftThrowable | `(...A) => B`          | `(...A) => Option<B>` |
| getOrThrow    | `Option<A>`, `unknown` | `A`                   |

## Lifting

| Name          | Given                              | To                                               |
| ------------- | ---------------------------------- | ------------------------------------------------ |
| lift2         | `(A, B) => C`                      | `(Option<A>, Option<B>) => Option<C>`            |
| lift3         | `(A, B, C) => D`                   | `(Option<A>, Option<B>, Option<C>) => Option<D>` |
| liftPredicate | `A => boolean`                     | `A => Option<A>`                                 |
| liftNullable  | `(...A) => B \| null \| undefined` | `(...A) => Option<NonNullable<B>>`               |
| liftEither    | `(...A) => Either<E, B>`           | `(...A) => Option<B>`                            |

## Error handling

| Name           | Given                              | To                     |
| -------------- | ---------------------------------- | ---------------------- |
| firstSuccessOf | `Option<A>`, `Iterable<Option<A>>` | `Option<A>`            |
| catchAll       | `Option<A>`, `=> Option<B>`        | `Option<A \| B>`       |
| orElse         | `Option<A>`, `Option<B>`           | `Option<A \| B>`       |
| orElseEither   | `Option<A>`, `Option<B>`           | `Option<Either<A, B>>` |
| orElseSucceed  | `Option<A>`, `B`                   | `Option<A \| B>`       |

## Debugging

| Name     | Given                    | To          |
| -------- | ------------------------ | ----------- |
| tap      | `Option<A>`, `A => void` | `Option<A>` |
| tapError | `Option<A>`, `=> void`   | `Option<A>` |

## Getters

| Name           | Given            | To               |
| -------------- | ---------------- | ---------------- |
| getOrElse      | `Option<A>`, `B` | `A \| B`         |
| getOrNull      | `Option<A>`      | `A \| null`      |
| getOrUndefined | `Option<A>`      | `A \| undefined` |

## Pattern matching

| Name  | Given                      | To       |
| ----- | -------------------------- | -------- |
| match | `Option<A>`, `B`, `A => C` | `B \| C` |

## Mapping

| Name   | Given                           | To             |
| ------ | ------------------------------- | -------------- |
| imap   | `Option<A>`, `A => B`, `B => A` | `Option<B>`    |
| tupled | `Option<A>`                     | `Option<[A]>`  |
| map    | `Option<A>`, `A => B`           | `Option<B>`    |
| flap   | `Option<A => B>`, `A`           | `Option<B>`    |
| as     | `Option<_>`, `B`                | `Option<B>`    |
| asUnit | `Option<_>`                     | `Option<void>` |

## Sequencing

| Name                | Given                                      | To                       |
| ------------------- | ------------------------------------------ | ------------------------ |
| flatMap             | `Option<A>`, `A => Option<B>`              | `Option<B>`              |
| flatten             | `Option<Option<A>>`                        | `Option<A>`              |
| andThen             | `Option<_>`, `Option<B>`                   | `Option<B>`              |
| andThenDiscard      | `Option<A>`, `Option<_>`                   | `Option<A>`              |
| tap                 | `Option<A>`, `A => Option<_>`              | `Option<E1 \| E2, A>`    |
| composeKleisliArrow | `A => Option<B>`, `B => Option<C>`         | `A => Option<C>`         |
| flatMapNullable     | `Option<A>`, `A => B \| null \| undefined` | `Option<NonNullable<B>>` |
| flatMapEither       | `Option<A>`, `A => Either<E, B>`           | `Option<B>`              |

## Combining

| Name                     | Given          | To                     |
| ------------------------ | -------------- | ---------------------- |
| getFirstErrorSemigroup   | `Semigroup<A>` | `Semigroup<Option<A>>` |
| getFirstErrorMonoid      | `Monoid<A>`    | `Monoid<Option<A>>`    |
| getFirstSuccessSemigroup |                | `Semigroup<Option<A>>` |

## Filtering

| Name                       | Given                         | To                       |
| -------------------------- | ----------------------------- | ------------------------ |
| compact (alias of flatten) | `Option<Option<A>>`           | `Option<A>`              |
| separate                   | `Option<Either<A, B>>`        | `[Option<A>, Option<B>]` |
| filter                     | `Option<A>`, `A => boolean`   | `Option<A>`              |
| filterMap                  | `Option<A>`, `A => Option<B>` | `Option<B>`              |

## Traversing

| Name        | Given                    | To             |
| ----------- | ------------------------ | -------------- |
| traverse    | `Option<A>`, `A => F<B>` | `F<Option<B>>` |
| sequence    | `Option<F<A>>`           | `F<Option<A>>` |
| traverseTap | `Option<A>`, `A => F<B>` | `F<Option<A>>` |

## Do notation

| Name       | Given                                         | To                          |
| ---------- | --------------------------------------------- | --------------------------- |
| Do         |                                               | `Option<{}>`                |
| bindTo     | `Option<A>`, `name: string`                   | `Option<{ [name]: A }>`     |
| let        | `Option<A>`, `name: string`, `A => B`         | `Option<A & { [name]: B }>` |
| bind       | `Option<A>`, `name: string`, `A => Option<B>` | `Option<A & { [name]: B }>` |
| bindOption | `Option<E1, A>`, `name: string`, `Option<B>`  | `Option<A & { [name]: B }>` |

## Predicates

| Name   | Given                       | To        |
| ------ | --------------------------- | --------- |
| elem   | `Option<A>`, `B`            | `boolean` |
| exists | `Option<A>`, `A => boolean` | `boolean` |

## Sorting

| Name      | Given      | To                 |
| --------- | ---------- | ------------------ |
| liftOrder | `Order<A>` | `Order<Option<A>>` |

## Utils

| Name           | Given                                | To                           |
| -------------- | ------------------------------------ | ---------------------------- |
| unit           |                                      | `Option<void>`               |
| product        | `Option<A>`, `Option<B>`             | `Option<[A, B]>`             |
| productMany    | `Option<A>`, `Iterable<Option<A>>`   | `Option<[A, ...Array<A>]>`   |
| productAll     | `Iterable<Option<A>>`                | `Option<ReadonlyArray<A>>`   |
| productFlatten | `Option<A>`, `Option<B>`             | `Option<[...A, B]>`          |
| tuple          | `[Option<A>, Option<B>, ...]`        | `Option<[A, B, ...]>`        |
| struct         | `{ a: Option<A>, b: Option<B>, ...}` | `Option<{ a: A, b: B, ...}>` |
| ap             | `Option<A => B>`, `Option<A>`        | `Option<B>`                  |
