import { pipe } from "@fp-ts/data/Function"
import * as String from "@fp-ts/data/String"
import { deepStrictEqual } from "@fp-ts/data/test/util"

describe.concurrent("String", () => {
  it("concatAll", () => {
    deepStrictEqual(String.concatAll(["a", "b", "c"]), "abc")
  })

  it("empty", () => {
    deepStrictEqual(String.empty, "")
  })

  it("isEmpty", () => {
    deepStrictEqual(String.isEmpty(String.empty), true)
    deepStrictEqual(String.isEmpty(""), true)
    deepStrictEqual(String.isEmpty("a"), false)
  })

  it("size", () => {
    deepStrictEqual(String.size(String.empty), 0)
    deepStrictEqual(String.size(""), 0)
    deepStrictEqual(String.size("a"), 1)
  })

  it("toUpperCase", () => {
    deepStrictEqual(String.toUpperCase("a"), "A")
  })

  it("toLowerCase", () => {
    deepStrictEqual(String.toLowerCase("A"), "a")
  })

  it("replace", () => {
    deepStrictEqual(pipe("abc", String.replace("b", "d")), "adc")
  })

  it("split", () => {
    deepStrictEqual(pipe("abc", String.split("")), ["a", "b", "c"])
    deepStrictEqual(pipe("", String.split("")), [""])
  })

  it("trim", () => {
    deepStrictEqual(pipe(" a ", String.trim), "a")
  })

  it("trimLeft", () => {
    deepStrictEqual(pipe(" a ", String.trimLeft), "a ")
  })

  it("trimRight", () => {
    deepStrictEqual(pipe(" a ", String.trimRight), " a")
  })

  it("includes", () => {
    deepStrictEqual(pipe("abc", String.includes("b")), true)
    deepStrictEqual(pipe("abc", String.includes("b", 2)), false)
  })

  it("startsWith", () => {
    deepStrictEqual(pipe("abc", String.startsWith("a")), true)
  })

  it("endsWith", () => {
    deepStrictEqual(pipe("abc", String.endsWith("c")), true)
  })

  it("slice", () => {
    deepStrictEqual(pipe("abcd", String.slice(1, 3)), "bc")
  })

  describe.concurrent("takeLeft", () => {
    it("should take the specified number of characters from the left side of a string", () => {
      const string = "Hello, World!"

      const result = pipe(string, String.takeLeft(7))

      assert.strictEqual(result, "Hello, ")
    })

    it("should return the string for `n` larger than the string length", () => {
      const string = "Hello, World!"

      const result = pipe(string, String.takeLeft(100))

      assert.strictEqual(result, string)
    })

    it("should return the empty string for a negative `n`", () => {
      const string = "Hello, World!"

      const result = pipe(string, String.takeLeft(-1))

      assert.strictEqual(result, "")
    })

    it("should round down if `n` is a float", () => {
      const string = "Hello, World!"

      const result = pipe(string, String.takeLeft(5.5))

      assert.strictEqual(result, "Hello")
    })
  })

  describe.concurrent("takeRight", () => {
    it("should take the specified number of characters from the right side of a string", () => {
      const string = "Hello, World!"

      const result = pipe(string, String.takeRight(7))

      assert.strictEqual(result, " World!")
    })

    it("should return the string for `n` larger than the string length", () => {
      const string = "Hello, World!"

      const result = pipe(string, String.takeRight(100))

      assert.strictEqual(result, string)
    })

    it("should return the empty string for a negative `n`", () => {
      const string = "Hello, World!"

      const result = pipe(string, String.takeRight(-1))

      assert.strictEqual(result, "")
    })

    it("should round down if `n` is a float", () => {
      const string = "Hello, World!"

      const result = pipe(string, String.takeRight(6.5))

      assert.strictEqual(result, "World!")
    })
  })

  describe.concurrent("stripMargin", () => {
    it("should strip a leading prefix from each line", () => {
      const string = `|
    |Hello,
    |World!
    |`

      const result = pipe(string, String.stripMargin)

      assert.strictEqual(result, "\nHello,\nWorld!\n")
    })

    it("should strip a leading prefix from each line using a margin character", () => {
      const string = `$
    $Hello,
    $World!
    $`

      const result = pipe(string, String.stripMarginWith("$"))

      assert.strictEqual(result, "\nHello,\nWorld!\n")
    })
  })
})
