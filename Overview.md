# RA

- `RA<A> = ReadonlyArray<A>`
- `NERA<A> = NonEmptyReadonlyArray<A>`

## Constructors

| Name      | Given                   | To          |
| --------- | ----------------------- | ----------- |
| empty     |                         | `RA<never>` |
| of        | `A`                     | `NERA<A>`   |
| make      | `...A`                  | `NERA<A>`   |
| makeBy    | `number => A`, `number` | `NERA<A>`   |
| range     | `number`, `number`      | `NERA<A>`   |
| replicate | `A`, `number`           | `NERA<A>`   |

## Conversions

| Name         | Given                | To      |
| ------------ | -------------------- | ------- |
| fromIterable | `Iterable<A>`        | `RA<A>` |
| fromOption   | `Option<A>`          | `RA<A>` |
| fromEither   | `Either<unknown, A>` | `RA<A>` |

## Predicates

| Name       | Given        | To               |
| ---------- | ------------ | ---------------- |
| isEmpty    | `RA<A>`      | `is readonly []` |
| isNonEmpty | `RA<A>`      | `is NERA<A>`     |
| elem       | `RA<A>`, `B` | `boolean`        |

## Getters

| Name             | Given                    | To                 |
| ---------------- | ------------------------ | ------------------ |
| size             | `RA<A>`                  | `number`           |
| get              | `RA<A>`, `number`        | `Option<A>`        |
| unprepend        | `NERA<A>`                | `[A, RA<A>]`       |
| unappend         | `NERA<A>`                | `[RA<A>, A]`       |
| head             | `RA<A>`                  | `Option<A>`        |
| headNonEmpty     | `NERA<A>`                | `A`                |
| last             | `RA<A>`                  | `Option<A>`        |
| lastNonEmpty     | `NERA<A>`                | `A`                |
| tail             | `RA<A>`                  | `Option<RA<A>>`    |
| tailNonEmpty     | `NERA<A>`                | `RA<A>`            |
| init             | `RA<A>`                  | `Option<RA<A>>`    |
| initNonEmpty     | `NERA<A>`                | `RA<A>`            |
| take             | `RA<A>`, `number`        | `RA<A>`            |
| takeRight        | `RA<A>`, `number`        | `RA<A>`            |
| takeWhile        | `RA<A>`, `A => boolean`  | `RA<A>`            |
| drop             | `RA<A>`, `number`        | `RA<A>`            |
| dropRight        | `RA<A>`, `number`        | `RA<A>`            |
| dropWhile        | `RA<A>`, `A => boolean`  | `RA<A>`            |
| findIndex        | `RA<A>`, `A => boolean`  | `Option<number>`   |
| findLastIndex    | `RA<A>`, `A => boolean`  | `Option<number>`   |
| findFirst        | `RA<A>`, `A => boolean`  | `Option<A>`        |
| findLast         | `RA<A>`, `A => boolean`  | `Option<A>`        |
| rights           | `RA<Either<unknown, A>>` | `RA<A>`            |
| lefts            | `RA<Either<E, unknown>>` | `RA<E>`            |
| splitAt          | `RA<A>`, `number`        | `[RA<A>, RA<A>]`   |
| splitAtNonEmpty  | `NERA<A>`, `number`      | `[NERA<A>, RA<A>]` |
| chunksOf         | `RA<A>`, `number`        | `RA<NERA<A>>`      |
| chunksOfNonEmpty | `NERA<A>`, `number`      | `NERA<NERA<A>>`    |

## Grouping

| Name    | Given                  | To                                  |
| ------- | ---------------------- | ----------------------------------- |
| group   | `NERA<A>`              | `NERA<NERA<A>>`                     |
| groupBy | `RA<A>`, `A => string` | `Readonly<Record<string, NERA<A>>>` |

## Sorting

| Name           | Given                     | To        |
| -------------- | ------------------------- | --------- |
| sort           | `RA<A>`, `Order<A>`       | `RA<A>`   |
| sortNonEmpty   | `NERA<A>`, `Order<A>`     | `NERA<A>` |
| sortBy         | `RA<A>`, `RA<Order<B>>`   | `RA<A>`   |
| sortByNonEmpty | `NERA<A>`, `RA<Order<B>>` | `NERA<A>` |

## Pattern matching

| Name       | Given                           | To       |
| ---------- | ------------------------------- | -------- |
| match      | `RA<A>`, `B`, `(A, RA<A>) => C` | `B \| C` |
| matchRight | `RA<A>`, `B`, `(RA<A>, A) => C` | `B \| C` |

## Mutations

| Name                   | Given                                | To                     |
| ---------------------- | ------------------------------------ | ---------------------- |
| append                 | `RA<A>`, `B`                         | `NERA<A \| B>`         |
| appendAll              | `RA<A>`, `RA<B>`                     | `RA<A \| B>`           |
| appendAllNonEmpty      | `NERA<A>`, `RA<B>`                   | `NERA<A \| B>`         |
| prepend                | `RA<A>`, `B`                         | `NERA<A \| B>`         |
| prependAll             | `RA<A>`, `RA<B>`                     | `RA<A \| B>`           |
| prependAllNonEmpty     | `NERA<A>`, `RA<B>`                   | `NERA<A \| B>`         |
| insertAt               | `RA<A>`, `number`, `B`               | `Option<NERA<A \| B>>` |
| updateAt               | `RA<A>`, `number`, `B`               | `Option<RA<A \| B>>`   |
| modifyAt               | `RA<A>`, `number`, `A => B`          | `Option<RA<A \| B>>`   |
| deleteAt               | `RA<A>`, `number`                    | `Option<RA<A>>`        |
| reverse                | `RA<A>`                              | `RA<A>`                |
| reverseNonEmpty        | `NERA<A>`                            | `NERA<A>`              |
| zip                    | `RA<A>`, `RA<B>`                     | `RA<[A, B]>`           |
| zipWith                | `RA<A>`, `RA<B>`, `(A, B) => C`      | `RA<C>`                |
| zipNonEmpty            | `NERA<A>`, `NERA<B>`                 | `NERA<[A, B]>`         |
| zipNonEmptyWith        | `NERA<A>`, `NERA<B>`, `(A, B) => C`  | `NERA<C>`              |
| unzip                  | `RA<[A, B]>`                         | `[RA<A>, RA<B>]`       |
| unzipNonEmpty          | `NERA<[A, B]>`                       | `[NERA<A>, NERA<B>]`   |
| intersperse            | `RA<A>`, `B`                         | `RA<A \| B>`           |
| intersperseNonEmpty    | `NERA<A>`, `B`                       | `NERA<A \| B>`         |
| modifyNonEmptyHead     | `NERA<A>`, `A => B`                  | `NERA<A \| B>`         |
| updateNonEmptyHead     | `NERA<A>`, `B`                       | `NERA<A \| B>`         |
| modifyNonEmptyLast     | `NERA<A>`, `A => B`                  | `NERA<A \| B>`         |
| updateNonEmptyLast     | `NERA<A>`, `B`                       | `NERA<A \| B>`         |
| rotate                 | `RA<A>`, `number`                    | `NERA<A>`              |
| rotateNonEmpty         | `NERA<A>`, `number`                  | `RA<A>`                |
| uniq                   | `RA<A>`                              | `RA<A>`                |
| uniqNonEmpty           | `NERA<A>`                            | `NERA<A>`              |
| chop                   | `RA<A>`, `(NERA<A>) => [B, RA<A>]`   | `RA<B>`                |
| chopNonEmpty           | `NERA<A>`, `(NERA<A>) => [B, RA<A>]` | `NERA<B>`              |
| union                  | `RA<A>`, `RA<B>`                     | `RA<A \| B>`           |
| unionNonEmpty          | `NERA<A>`, `RA<B>`                   | `NERA<A \| B>`         |
| intersection           | `RA<A>`, `RA<B>`                     | `RA<A & B>`            |
| intersectiodifferencen | `RA<A>`, `RA<B>`                     | `RA<A>`                |

## Folding

| Name      | Given                       | To        |
| --------- | --------------------------- | --------- |
| scan      | `RA<A>`, `B`, `(B, A) => B` | `NERA<B>` |
| scanRight | `RA<A>`, `B`, `(B, A) => B` | `NERA<B>` |

## Filtering

| Name | Given                   | To               |
| ---- | ----------------------- | ---------------- |
| span | `RA<A>`, `A => boolean` | `[RA<A>, RA<A>]` |
