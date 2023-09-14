import * as S from '@effect/data/String'

type FooCapitalCase = "Foo"
type BarCapitalCase = "Bar"
type FooLowerCase = "foo"

// $ExpectType "FooBar"
export type FooBarCapitalCase = S.Concat<FooCapitalCase, BarCapitalCase> 

// $ExpectType "FOO"
export type FooToUpperCase = Uppercase<FooLowerCase>

// $ExpectType "bar"
export type BarToLowerCase = Lowercase<BarCapitalCase>

// $ExpectType "Foo"
export type FooCapitalized = Capitalize<FooLowerCase>

// $ExpectType "Foo"
export type BarUncapitalized = Uncapitalize<BarCapitalCase>

type LeadingSpaces = "   foo"
type TrailingSpaces = "bar   "
type LeadingAndTrailingSpaces = "   baz   "

type NewLines = `
      foo
`

type NewLinesAndTabs = `
    \t\t  foo
`

type CarriageReturns = `
  \r\n foo
`

// $ExpectType "foo"
export type TrimLeadingSpaces = S.TrimStart<LeadingSpaces>

// $ExpectType "bar"
export type TrimTrailingSpaces = S.TrimEnd<TrailingSpaces>

// $ExpectType "baz"
export type TrimLeadingAndTrailingSpaces = S.Trim<LeadingAndTrailingSpaces>

// $ExpectType "foo"
export type TrimNewLines = S.Trim<NewLines>

// $ExpectType "foo"
export type TrimNewLinesAndTabs = S.Trim<NewLinesAndTabs>

// $ExpectType "foo"
export type TrimCarriageReturns = S.Trim<CarriageReturns>
