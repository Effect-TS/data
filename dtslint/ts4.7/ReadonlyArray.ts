import { identity, pipe } from "@fp-ts/data/Function";
import * as RA from "@fp-ts/data/ReadonlyArray";
import * as E from "@fp-ts/data/Either";
import * as Number from "@fp-ts/data/Number";

declare const ns: ReadonlyArray<number>
declare const ss: ReadonlyArray<string>
declare const eithers: ReadonlyArray<E.Either<string, number>>
declare const setns: Set<number>
declare const setss: Set<string>
declare const seteithers: Set<E.Either<string, number>>
declare const snpairs: ReadonlyArray<[string, number]>
declare const setsnpairs: Set<[string, number]>

// $ExpectType [number, ...number[]]
RA.make(1)

// $ExpectType [number, ...number[]]
RA.makeBy(n => n)(1)

// $ExpectType [number, ...number[]]
RA.range(0, 10)

// $ExpectType [string, ...string[]]
RA.replicate('a')(10)

// $ExpectType [string | number, ...(string | number)[]]
pipe(setns, RA.prepend('a'))

// $ExpectType (string | number)[]
pipe(setns, RA.prependAll(['a', 'b']))
// $ExpectType (string | number)[]
pipe(ns, RA.prependAll(new Set(['a', 'b'])))
// $ExpectType (string | number)[]
pipe(setns, RA.prependAll(new Set(['a', 'b'])))

// $ExpectType [string | number, ...(string | number)[]]
pipe(ns, RA.prependAllNonEmpty(['a', 'b']))
// $ExpectType [string | number, ...(string | number)[]]
pipe(setns, RA.prependAllNonEmpty(['a', 'b']))
// $ExpectType [string | number, ...(string | number)[]]
pipe(RA.make(3, 4), RA.prependAllNonEmpty(new Set(['a', 'b'])))

// $ExpectType [string | number, ...(string | number)[]]
pipe(ns, RA.append('a'))
// $ExpectType [string | number, ...(string | number)[]]
pipe(setns, RA.append('a'))

// $ExpectType (string | number)[]
pipe(ns, RA.appendAll(['a', 'b']))
// $ExpectType (string | number)[]
pipe(setns, RA.appendAll(['a', 'b']))
// $ExpectType (string | number)[]
pipe(ns, RA.appendAll(new Set(['a', 'b'])))

// $ExpectType [string | number, ...(string | number)[]]
pipe(ns, RA.appendAllNonEmpty(['a', 'b']))
// $ExpectType [string | number, ...(string | number)[]]
pipe(setns, RA.appendAllNonEmpty(['a', 'b']))
// $ExpectType [string | number, ...(string | number)[]]
pipe(RA.make(3, 4), RA.appendAllNonEmpty(new Set(['a', 'b'])))

// $ExpectType [number, ...number[]]
pipe(ns, RA.scan(10, (b: number, a: number) => b - a))
// $ExpectType [number, ...number[]]
pipe(setns, RA.scan(10, (b: number, a: number) => b - a))

// $ExpectType [number, ...number[]]
pipe(ns, RA.scanRight(10, (b: number, a: number) => b - a))
// $ExpectType [number, ...number[]]
pipe(setns, RA.scanRight(10, (b: number, a: number) => b - a))

// $ExpectType Option<number[]>
pipe(ns, RA.tail)
// $ExpectType Option<number[]>
pipe(setns, RA.tail)

// $ExpectType Option<number[]>
pipe(ns, RA.init)
// $ExpectType Option<number[]>
pipe(setns, RA.init)

// $ExpectType number[]
pipe(ns, RA.take(2))
// $ExpectType number[]
pipe(setns, RA.take(2))

// $ExpectType number[]
pipe(ns, RA.takeRight(2))
// $ExpectType number[]
pipe(setns, RA.takeRight(2))

// $ExpectType number[]
pipe(ns, RA.takeWhile((n) => n % 2 === 0))
// $ExpectType number[]
pipe(setns, RA.takeWhile((n) => n % 2 === 0))

// $ExpectType [init: number[], rest: number[]]
pipe(ns, RA.span((n) => n % 2 === 0))
// $ExpectType [init: number[], rest: number[]]
pipe(setns, RA.span((n) => n % 2 === 0))

// $ExpectType number[]
pipe(ns, RA.drop(2))
// $ExpectType number[]
pipe(setns, RA.drop(2))

// $ExpectType number[]
pipe(ns, RA.dropRight(2))
// $ExpectType number[]
pipe(setns, RA.dropRight(2))

// $ExpectType number[]
pipe(ns, RA.dropWhile((n) => n % 2 === 0))
// $ExpectType number[]
pipe(setns, RA.dropWhile((n) => n % 2 === 0))

// $ExpectType Option<number>
pipe(ss, RA.findFirstIndex((s) => s.length > 0))
// $ExpectType Option<number>
pipe(setss, RA.findFirstIndex((s) => s.length > 0))

// $ExpectType Option<number>
pipe(ss, RA.findLastIndex((s) => s.length > 0))
// $ExpectType Option<number>
pipe(setss, RA.findLastIndex((s) => s.length > 0))

// $ExpectType Option<string>
pipe(ss, RA.findFirst((s) => s.length > 0))
// $ExpectType Option<string>
pipe(setss, RA.findFirst((s) => s.length > 0))

// $ExpectType Option<string>
pipe(ss, RA.findLast((s) => s.length > 0))
// $ExpectType Option<string>
pipe(setss, RA.findLast((s) => s.length > 0))

// $ExpectType Option<[number, ...number[]]>
pipe(ns, RA.insertAt(1, 1))
// $ExpectType Option<[number, ...number[]]>
pipe(setns, RA.insertAt(1, 1))

// $ExpectType number[]
pipe(ns, RA.replace(1, 1))
// $ExpectType number[]
pipe(setns, RA.replace(1, 1))

// $ExpectType Option<number[]>
pipe(ns, RA.replaceOption(1, 1))
// $ExpectType Option<number[]>
pipe(setns, RA.replaceOption(1, 1))

// $ExpectType number[]
pipe(ns, RA.modify(1, identity))
// $ExpectType number[]
pipe(setns, RA.modify(1, identity))

// $ExpectType Option<number[]>
pipe(ns, RA.modifyOption(1, identity))
// $ExpectType Option<number[]>
pipe(setns, RA.modifyOption(1, identity))

// $ExpectType number[]
pipe(ns, RA.remove(1))
// $ExpectType number[]
pipe(setns, RA.remove(1))

// $ExpectType number[]
pipe(ns, RA.reverse)
// $ExpectType number[]
pipe(setns, RA.reverse)

// $ExpectType number[]
pipe(eithers, RA.rights)
// $ExpectType number[]
pipe(seteithers, RA.rights)

// $ExpectType string[]
pipe(eithers, RA.lefts)
// $ExpectType string[]
pipe(seteithers, RA.lefts)

// $ExpectType number[]
pipe(ns, RA.sort(Number.Order))
// $ExpectType number[]
pipe(setns, RA.sort(Number.Order))

// $ExpectType number[]
pipe(ns, RA.sortBy(Number.Order))
// $ExpectType number[]
pipe(setns, RA.sortBy(Number.Order))

// $ExpectType [number, string][]
pipe(ns, RA.zip(ss))
// $ExpectType [number, string][]
pipe(setns, RA.zip(setss))

// $ExpectType (readonly [number, string])[]
pipe(ns, RA.zipWith(ss, (a, b) => [a, b] as const))
// $ExpectType (readonly [number, string])[]
pipe(setns, RA.zipWith(setss, (a, b) => [a, b] as const))

// $ExpectType [string[], number[]]
pipe(snpairs, RA.unzip)
// $ExpectType [string[], number[]]
pipe(setsnpairs, RA.unzip)

// $ExpectType number[]
pipe(ns, RA.intersperse(0))
// $ExpectType number[]
pipe(setns, RA.intersperse(0))

// $ExpectType number[]
pipe(ns, RA.rotate(2))
// $ExpectType number[]
pipe(setns, RA.rotate(2))

// $ExpectType boolean
pipe(ns, RA.elem(2))
// $ExpectType boolean
pipe(setns, RA.elem(2))

// $ExpectType number[]
pipe(ns, RA.uniq)
// $ExpectType number[]
pipe(setns, RA.uniq)

// $ExpectType [number[], number[]]
pipe(ns, RA.splitAt(2))
// $ExpectType [number[], number[]]
pipe(setns, RA.splitAt(2))
