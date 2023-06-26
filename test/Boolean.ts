import * as Boolean from "@effect/data/Boolean"
import { pipe } from "@effect/data/Function"
import { deepStrictEqual } from "@effect/data/test/util"

describe.concurrent("Boolean", () => {
  it("isBoolean", () => {
    expect(Boolean.isBoolean(true)).toEqual(true)
    expect(Boolean.isBoolean(false)).toEqual(true)
    expect(Boolean.isBoolean("a")).toEqual(false)
    expect(Boolean.isBoolean(1)).toEqual(false)
  })

  it("and", () => {
    deepStrictEqual(pipe(true, Boolean.and(true)), true)
    deepStrictEqual(pipe(true, Boolean.and(false)), false)
    deepStrictEqual(pipe(false, Boolean.and(true)), false)
    deepStrictEqual(pipe(false, Boolean.and(false)), false)
  })

  it("nand", () => {
    deepStrictEqual(pipe(true, Boolean.nand(true)), false)
    deepStrictEqual(pipe(true, Boolean.nand(false)), true)
    deepStrictEqual(pipe(false, Boolean.nand(true)), true)
    deepStrictEqual(pipe(false, Boolean.nand(false)), true)
  })

  it("or", () => {
    deepStrictEqual(pipe(true, Boolean.or(true)), true)
    deepStrictEqual(pipe(true, Boolean.or(false)), true)
    deepStrictEqual(pipe(false, Boolean.or(true)), true)
    deepStrictEqual(pipe(false, Boolean.or(false)), false)
  })

  it("nor", () => {
    deepStrictEqual(pipe(true, Boolean.nor(true)), false)
    deepStrictEqual(pipe(true, Boolean.nor(false)), false)
    deepStrictEqual(pipe(false, Boolean.nor(true)), false)
    deepStrictEqual(pipe(false, Boolean.nor(false)), true)
  })

  it("xor", () => {
    deepStrictEqual(pipe(true, Boolean.xor(true)), false)
    deepStrictEqual(pipe(true, Boolean.xor(false)), true)
    deepStrictEqual(pipe(false, Boolean.xor(true)), true)
    deepStrictEqual(pipe(false, Boolean.xor(false)), false)
  })

  it("eqv", () => {
    deepStrictEqual(pipe(true, Boolean.eqv(true)), true)
    deepStrictEqual(pipe(true, Boolean.eqv(false)), false)
    deepStrictEqual(pipe(false, Boolean.eqv(true)), false)
    deepStrictEqual(pipe(false, Boolean.eqv(false)), true)
  })

  it("implies", () => {
    deepStrictEqual(pipe(true, Boolean.implies(true)), true)
    deepStrictEqual(pipe(true, Boolean.implies(false)), false)
    deepStrictEqual(pipe(false, Boolean.implies(true)), true)
    deepStrictEqual(pipe(false, Boolean.implies(false)), true)
  })

  it("not", () => {
    deepStrictEqual(pipe(true, Boolean.not), false)
    deepStrictEqual(pipe(false, Boolean.not), true)
  })

  it("match", () => {
    const match = Boolean.match(() => "false", () => "true")
    deepStrictEqual(match(true), "true")
    deepStrictEqual(match(false), "false")
  })

  it("Equivalence", () => {
    expect(Boolean.Equivalence(true, true)).toBe(true)
    expect(Boolean.Equivalence(false, false)).toBe(true)
    expect(Boolean.Equivalence(true, false)).toBe(false)
    expect(Boolean.Equivalence(false, true)).toBe(false)
  })

  it("Order", () => {
    deepStrictEqual(Boolean.Order.compare(false, true), -1)
    deepStrictEqual(Boolean.Order.compare(true, false), 1)
    deepStrictEqual(Boolean.Order.compare(true, true), 0)
  })
})
