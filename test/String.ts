import { pipe } from "@fp-ts/data/Function"
import * as _ from "@fp-ts/data/String"
import { deepStrictEqual } from "@fp-ts/data/test/util"

describe("string", () => {
  it("concatAll", () => {
    deepStrictEqual(_.concatAll(["a", "b", "c"]), "abc")
  })

  // TODO
  // it("Show", () => {
  //   deepStrictEqual(_.Show.show("a"), "\"a\"")
  // })

  it("empty", () => {
    deepStrictEqual(_.empty, "")
  })

  it("isEmpty", () => {
    deepStrictEqual(_.isEmpty(_.empty), true)
    deepStrictEqual(_.isEmpty(""), true)
    deepStrictEqual(_.isEmpty("a"), false)
  })

  it("size", () => {
    deepStrictEqual(_.size(_.empty), 0)
    deepStrictEqual(_.size(""), 0)
    deepStrictEqual(_.size("a"), 1)
  })

  it("toUpperCase", () => {
    deepStrictEqual(_.toUpperCase("a"), "A")
  })

  it("toLowerCase", () => {
    deepStrictEqual(_.toLowerCase("A"), "a")
  })

  it("replace", () => {
    deepStrictEqual(pipe("abc", _.replace("b", "d")), "adc")
  })

  it("split", () => {
    deepStrictEqual(pipe("abc", _.split("")), ["a", "b", "c"])
    deepStrictEqual(pipe("", _.split("")), [""])
  })

  it("trim", () => {
    deepStrictEqual(pipe(" a ", _.trim), "a")
  })

  it("trimLeft", () => {
    deepStrictEqual(pipe(" a ", _.trimLeft), "a ")
  })

  it("trimRight", () => {
    deepStrictEqual(pipe(" a ", _.trimRight), " a")
  })

  it("includes", () => {
    deepStrictEqual(pipe("abc", _.includes("b")), true)
    deepStrictEqual(pipe("abc", _.includes("b", 2)), false)
  })

  it("startsWith", () => {
    deepStrictEqual(pipe("abc", _.startsWith("a")), true)
  })

  it("endsWith", () => {
    deepStrictEqual(pipe("abc", _.endsWith("c")), true)
  })

  it("slice", () => {
    deepStrictEqual(pipe("abcd", _.slice(1, 3)), "bc")
  })
})
