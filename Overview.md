# ReadonlyArray

- `RA<A> = ReadonlyArray<A>`
- `NERA<A> = NonEmptyReadonlyArray<A>`

## Constructors

| Name      | Given                      | To          |
| --------- | -------------------------- | ----------- |
| empty     |                            | `RA<never>` |
| of        | `A`                        | `NERA<A>`   |
| make      | `...A`                     | `NERA<A>`   |
| makeBy    | `number => A`, `number`    | `NERA<A>`   |
| range     | `number`, `number`         | `NERA<A>`   |
| replicate | `A`, `number`              | `NERA<A>`   |
| unfold    | `B`, `B => Option<[A, B]>` | `RA<A>`     |

## Conversions

| Name         | Given                | To                   |
| ------------ | -------------------- | -------------------- |
| fromIterable | `Iterable<A>`        | `RA<A>`              |
| fromOption   | `Option<A>`          | `RA<A>`              |
| fromEither   | `Either<unknown, A>` | `RA<A>`              |
| fromNullable | `A`                  | `RA<NonNullable<A>>` |

## Lifting

| Name          | Given                              | To                               |
| ------------- | ---------------------------------- | -------------------------------- |
| lift2         | `(A, B) => C`                      | `(RA<A>, RA<B>) => RA<C>`        |
| lift3         | `(A, B, C) => D`                   | `(RA<A>, RA<B>, RA<C>) => RA<D>` |
| liftSemigroup | `Semigroup<A>`                     | `Semigroup<RA<A>>`               |
| liftMonoid    | `Monoid<A>`                        | `Monoid<RA<A>>`                  |
| liftPredicate | `A => boolean`                     | `A => RA<A>`                     |
| liftNullable  | `(...A) => B \| null \| undefined` | `(...A) => RA<NonNullable<B>>`   |
| liftOption    | `(...A) => Option<B>`              | `(...A) => RA<B>`                |
| liftEither    | `(...A) => Either<E, B>`           | `(...A) => RA<B>`                |
| every         | `A => boolean`                     | `RA<A> => boolean`               |
| liftOrder     | `Order<A>`                         | `Order<RA<A>>`                   |

## Predicates

| Name                | Given                   | To               |
| ------------------- | ----------------------- | ---------------- |
| isEmpty             | `RA<A>`                 | `is readonly []` |
| isNonEmpty          | `RA<A>`                 | `is NERA<A>`     |
| elem                | `RA<A>`, `B`            | `boolean`        |
| some                | `RA<A>`, `A => boolean` | `is NERA<A>`     |
| has (alias of some) | `RA<A>`, `A => boolean` | `is NERA<A>`     |

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

## Mapping

| Name                 | Given                         | To        |
| -------------------- | ----------------------------- | --------- |
| map                  | `RA<A>`, `A => B`             | `RA<B>`   |
| mapNonEmpty          | `NERA<A>`, `A => B`           | `NERA<B>` |
| mapWithIndex         | `RA<A>`, `(A, number) => B`   | `RA<B>`   |
| mapNonEmptyWithIndex | `NERA<A>`, `(A, number) => B` | `NERA<B>` |
| imap                 | `RA<A>`, `A => B`, `B => A`   | `RA<B>`   |
| flap                 | `A`, `RA<A => B>`             | `RA<B>`   |
| as                   | `RA<unknown>`                 | `RA<B>`   |

## Sequencing

| Name                     | Given                                  | To                   |
| ------------------------ | -------------------------------------- | -------------------- |
| flatMap                  | `RA<A>`, `A => RA<B>`                  | `RA<B>`              |
| flatMapWithIndex         | `RA<A>`, `(A, number) => RA<B>`        | `RA<B>`              |
| flatMapNonEmpty          | `NERA<A>`, `A => RA<B>`                | `NERA<B>`            |
| flatMapNonEmptyWithIndex | `NERA<A>`, `(A, number) => NERA<B>`    | `NERA<B>`            |
| flatten                  | `RA<RA<A>>`                            | `RA<A>`              |
| flattenNonEmpty          | `NERA<NERA<A>>`                        | `NERA<A>`            |
| flatMapNullable          | `RA<A>`, `A => B \| null \| undefined` | `RA<NonNullable<B>>` |
| composeKleisliArrow      | `A => RA<B>`, `B => RA<C>`             | `a => RA<C>`         |

## Filtering

| Name                  | Given                                             | To                  |
| --------------------- | ------------------------------------------------- | ------------------- |
| span                  | `RA<A>`, `A => boolean`                           | `[RA<A>, RA<A>]`    |
| compact               | `RA<Option<A>>`                                   | `RA<A>`             |
| separate              | `RA<Either<A, B>>`                                | `[RA<A>, RA<B>]`    |
| filterMap             | `Iterable<A>`, `A => Option<B>`                   | `RA<B>`             |
| filterMapWithIndex    | `Iterable<A>`, `(A, number) => Option<B>`         | `RA<B>`             |
| filter                | `RA<A>`, `A => boolean`                           | `RA<A>`             |
| filterWithIndex       | `RA<A>`, `(A. number) => boolean`                 | `RA<A>`             |
| partition             | `RA<A>`, `A => boolean`                           | `[RA<A>, RA<A>]`    |
| partitionWithIndex    | `RA<A>`, `(A, number) => boolean`                 | `[RA<A>, RA<A>]`    |
| partitionMap          | `RA<A>`, `A => Either<A, C>`                      | `[RA<B>, RA<C>]`    |
| partitionMapWithIndex | `RA<A>`, `(A, number) => Either<A, C>`            | `[RA<B>, RA<C>]`    |
| traverseFilterMap     | `Applicative<F>`, `RA<A>`, `A => F<Option<B>>`    | `F<RA<B>>`          |
| traversePartitionMap  | `Applicative<F>`, `RA<A>`, `A => F<Either<B, C>>` | `F<[RA<B>, RA<C>]>` |
| traverseFilter        | `Applicative<F>`, `RA<A>`, `A => F<boolean>`      | `F<RA<A>>`          |
| traversePartition     | `Applicative<F>`, `RA<A>`, `A => F<boolean>`      | `F<[RA<A>, RA<A>]>` |

## Folding

| Name                     | Given                                        | To     |
| ------------------------ | -------------------------------------------- | ------ |
| reduce                   | `RA<A>`, `B` `(B, A) => B`                   | `B`    |
| reduceWithIndex          | `RA<A>`, `B` `(B, A, number) => B`           | `B`    |
| reduceRight              | `RA<A>`, `B` `(B, A) => B`                   | `B`    |
| reduceRightWithIndex     | `RA<A>`, `B` `(B, A, number) => B`           | `B`    |
| foldMap                  | `RA<A>`, `Monoid<M>` `A => M`                | `M`    |
| foldMapWithIndex         | `RA<A>`, `Monoid<M>` `(A, number) => M`      | `M`    |
| foldMapNonEmpty          | `NERA<A>`, `Semigroup<S>` `A => S`           | `S`    |
| foldMapNonEmptyWithIndex | `NERA<A>`, `Semigroup<S>` `(A, number) => S` | `S`    |
| reduceKind               | `Monad<F>`, `RA<A>`, `B` `(B, A) => F<B>`    | `F<B>` |
| reduceRightKind          | `Monad<F>`, `RA<A>`, `B` `(B, A) => F<B>`    | `F<B>` |
| foldMapKind              | `Coproduct<F>`, `RA<A>`, `A => F<B>`         | `F<B>` |

## Traversing

| Name                      | Given                            | To           |
| ------------------------- | -------------------------------- | ------------ |
| traverse                  | `RA<A>`, `A => F<B>`             | `F<RA<B>>`   |
| traverseWithIndex         | `RA<A>`, `(A, number) => F<B>`   | `F<RA<B>>`   |
| traverseNonEmpty          | `NERA<A>`, `A => F<B>`           | `F<NERA<B>>` |
| traverseNonEmptyWithIndex | `NERA<A>`, `(A, number) => F<B>` | `F<NERA<B>>` |
| traverseTap               | `RA<A>`, `A => F<B>`             | `F<RA<A>>`   |
| sequence                  | `RA<F<A>>`                       | `F<RA<A>>`   |
| sequenceNonEmpty          | `NERA<F<A>>`                     | `F<NERA<A>>` |

## Do notation

| Name              | Given                                 | To                      |
| ----------------- | ------------------------------------- | ----------------------- |
| Do                |                                       | `RA<{}>`                |
| let               | `RA<A>`, `name: string`, `A => B`     | `RA<A & { [name]: B }>` |
| bind              | `RA<A>`, `name: string`, `A => RA<B>` | `RA<A & { [name]: B }>` |
| bindReadonlyArray | `RA<A>`, `name: string`, `RA<B>`      | `RA<A & { [name]: B }>` |

## Utils

| Name                     | Given                          | To                 |
| ------------------------ | ------------------------------ | ------------------ |
| extend                   | `RA<A>`, `RA<A> => B`          | `RA<B>`            |
| product                  | `RA<A>`, `RA<B>`               | `RA<[A, B]>`       |
| productMany              | `RA<A>`, `Iterable<RA<A>>`     | `RA<NERA<A>>`      |
| productAll               | `Iterable<RA<A>>`              | `RA<RA<A>>`        |
| ap                       | `RA<A => B>`, `RA<A>`          | `RA<B>`            |
| intercalate              | `Monoid<A>`, `RA<A>`, `A`      | `A`                |
| intercalateNonEmpty      | `Semigroup<A>`, `NERA<A>`, `A` | `A`                |
| productFlatten           | `RA<A>`, `RA<B>`               | `RA<[...A, B]>`    |
| min                      | `Order<A>`, `NERA<A>`          | `A`                |
| max                      | `Order<A>`, `NERA<A>`          | `A`                |
| getSemigroup             |                                | `Semigroup<RA<A>>` |
| getMonoid                |                                | `Monoid<RA<A>>`    |
| getUnionSemigroup        |                                | `Semigroup<RA<A>>` |
| getUnionMonoid           |                                | `Monoid<RA<A>>`    |
| getIntersectionSemigroup |                                | `Semigroup<RA<A>>` |
