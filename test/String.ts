import { pipe } from "@effect/data/Function"
import * as S from "@effect/data/String"
import { deepStrictEqual } from "@effect/data/test/util"
import * as Order from "@effect/data/typeclass/Order"
import { describe, expect, it } from "vitest"

describe.concurrent("String", () => {
  it("isString", () => {
    expect(S.isString("a")).toEqual(true)
    expect(S.isString(1)).toEqual(false)
    expect(S.isString(true)).toEqual(false)
  })

  it("empty", () => {
    expect(S.empty).toEqual("")
  })

  it("Semigroup", () => {
    expect(S.Semigroup.combine("a", "b")).toEqual("ab")
    expect(S.Semigroup.combineMany("a", ["b", "c"])).toEqual("abc")
    expect(S.Semigroup.combineMany("a", [])).toEqual("a")
  })

  it("Monoid", () => {
    expect(S.Monoid.combineAll([])).toEqual("")
  })

  it("Equivalence", () => {
    expect(S.Equivalence("a", "a")).toBe(true)
    expect(S.Equivalence("a", "b")).toBe(false)
  })

  it("Order", () => {
    const lessThan = Order.lessThan(S.Order)
    const lessThanOrEqualTo = Order.lessThanOrEqualTo(S.Order)
    expect(pipe("a", lessThan("b"))).toEqual(true)
    expect(pipe("a", lessThan("a"))).toEqual(false)
    expect(pipe("a", lessThanOrEqualTo("a"))).toEqual(true)
    expect(pipe("b", lessThan("a"))).toEqual(false)
    expect(pipe("b", lessThanOrEqualTo("a"))).toEqual(false)
  })

  it("concat", () => {
    expect(pipe("a", S.concat("b"))).toBe("ab")
  })

  it("isEmpty", () => {
    expect(S.isEmpty("")).toBe(true)
    expect(S.isEmpty("a")).toBe(false)
  })

  it("isNonEmpty", () => {
    expect(S.isNonEmpty("")).toBe(false)
    expect(S.isNonEmpty("a")).toBe(true)
  })

  it("length", () => {
    expect(S.length("")).toBe(0)
    expect(S.length("a")).toBe(1)
    expect(S.length("aaa")).toBe(3)
  })

  it("toUpperCase", () => {
    expect(S.toUpperCase("a")).toBe("A")
  })

  it("toLowerCase", () => {
    expect(S.toLowerCase("A")).toBe("a")
  })

  it("replace", () => {
    expect(pipe("abc", S.replace("b", "d"))).toBe("adc")
  })

  it("split", () => {
    deepStrictEqual(pipe("abc", S.split("")), ["a", "b", "c"])
    deepStrictEqual(pipe("", S.split("")), [""])
  })

  it("trim", () => {
    expect(pipe(" a ", S.trim)).toBe("a")
  })

  it("trimStart", () => {
    expect(pipe(" a ", S.trimStart)).toBe("a ")
  })

  it("trimEnd", () => {
    expect(pipe(" a ", S.trimEnd)).toBe(" a")
  })

  it("includes", () => {
    expect(S.includes("abc", "b")).toBe(true)
    expect(S.includes("abc", "d")).toBe(false)
  })

  it("includesWithPosition", () => {
    expect(S.includesWithPosition("abc", "b", 1)).toBe(true)
    expect(S.includesWithPosition("abc", "a", 1)).toBe(false)
  })

  it("startsWith", () => {
    expect(S.startsWith("abc", "a")).toBe(true)
    expect(S.startsWith("bc", "a")).toBe(false)
  })

  it("startsWithPosition", () => {
    expect(S.startsWithPosition("abc", "b", 1)).toBe(true)
    expect(S.startsWithPosition("bc", "a", 1)).toBe(false)
  })

  it("endsWith", () => {
    expect(S.endsWith("abc", "c")).toBe(true)
    expect(S.endsWith("ab", "c")).toBe(false)
  })

  it("endsWithPosition", () => {
    expect(S.endsWithPosition("abc", "b", 2)).toBe(true)
    expect(S.endsWithPosition("abc", "c", 2)).toBe(false)
  })

  it("slice", () => {
    deepStrictEqual(pipe("abcd", S.slice(1, 3)), "bc")
  })

  it("charCodeAt", () => {
    expect(S.charCodeAt("abc", 1)).toBe(98)
  })

  it("substring", () => {
    expect(S.substring("abcd", 1)).toBe("bcd")
  })

  it("at", () => {
    expect(S.at("abc", 1)).toBe("b")
    expect(S.at("abc", 4)).toBe(undefined)
  })

  it("charAt", () => {
    expect(S.charAt("abc", 1)).toBe("b")
  })

  it("codePointAt", () => {
    expect(S.codePointAt("abc", 1)).toBe(98)
    expect(S.codePointAt("abc", 4)).toBe(undefined)
  })

  it("indexOf", () => {
    expect(S.indexOf("abbbc", "b")).toBe(1)
    expect(S.indexOf("abbbc", "d")).toBe(-1)
  })

  it("lastIndexOf", () => {
    expect(S.lastIndexOf("abbbc", "b")).toBe(3)
    expect(S.lastIndexOf("abbbc", "d")).toBe(-1)
  })

  it("localeCompare", () => {
    expect(S.localeCompare("a", "b")).toBeLessThanOrEqual(-1)
    expect(S.localeCompare("b", "a")).toBeGreaterThanOrEqual(1)
    expect(S.localeCompare("a", "a")).toBe(0)
  })

  it("match", () => {
    expect(S.match("a", /a/)).toHaveProperty("0", "a")
    expect(S.match("a", /b/)).toBe(null)
  })

  it("matchAll", () => {
    expect([...S.matchAll("apple, banana", /a[pn]/g)]).toHaveLength(3)
    expect([...S.matchAll("apple, banana", /c/g)]).toHaveLength(0)
  })

  it("normalize", () => {
    expect(S.normalize("a\u0300", "NFD")).toBe("a\u0300")
    expect(S.normalize("a\u0300", "NFC")).toBe("à")
    expect(S.normalize("a\u0300", "NFKC")).toBe("à")
    expect(S.normalize("a\u0300", "NFKD")).toBe("a\u0300")
  })

  it("padEnd", () => {
    expect(S.padEnd("a", 5)).toBe("a    ")
    expect(S.padEnd("a", 5, "b")).toBe("abbbb")
  })

  it("padStart", () => {
    expect(S.padStart("a", 5)).toBe("    a")
    expect(S.padStart("a", 5, "b")).toBe("bbbba")
  })

  it("repeat", () => {
    expect(S.repeat("a", 3)).toBe("aaa")
  })

  it("replaceAll", () => {
    expect(S.replaceAll("cake bake lake take", "ake", "ap")).toBe("cap bap lap tap")
    expect(S.replaceAll("cake basket lapid taken", /a\w+/g, "ap")).toBe("cap bap lap tap")
  })

  it("search", () => {
    expect(S.search("abc", "ab")).toBe(0)
    expect(S.search("abc", /b/)).toBe(1)
    expect(S.search("abc", /d/)).toBe(-1)
    expect(S.search("abc", "d")).toBe(-1)
  })

  it("toLocaleLowerCase", () => {
    const locales = ["tr", "TR", "tr-TR", "tr-u-co-search", "tr-x-turkish"]
    expect(S.toLocaleLowerCase("\u0130")).not.toBe("i")
    expect(S.toLocaleLowerCase("\u0130", locales)).toBe("i")
  })

  it("toLocaleUpperCase", () => {
    const locales = ["lt", "LT", "lt-LT", "lt-u-co-phonebk", "lt-x-lietuva"]
    expect(S.toLocaleUpperCase("i\u0307", locales)).toBe("I")
  })

  describe.concurrent("takeLeft", () => {
    it("should take the specified number of characters from the left side of a string", () => {
      expect(S.takeLeft("Hello, World!", 7)).toBe("Hello, ")
    })

    it("should return the string for `n` larger than the string length", () => {
      const string = "Hello, World!"
      expect(S.takeLeft(string, 100)).toBe(string)
    })

    it("should return the empty string for a negative `n`", () => {
      expect(S.takeLeft("Hello, World!", -1)).toBe("")
    })

    it("should round down if `n` is a float", () => {
      expect(S.takeLeft("Hello, World!", 5.5)).toBe("Hello")
    })
  })

  describe.concurrent("takeRight", () => {
    it("should take the specified number of characters from the right side of a string", () => {
      expect(S.takeRight("Hello, World!", 7)).toBe(" World!")
    })

    it("should return the string for `n` larger than the string length", () => {
      const string = "Hello, World!"
      expect(S.takeRight(string, 100)).toBe(string)
    })

    it("should return the empty string for a negative `n`", () => {
      expect(S.takeRight("Hello, World!", -1)).toBe("")
    })

    it("should round down if `n` is a float", () => {
      expect(S.takeRight("Hello, World!", 6.5)).toBe("World!")
    })
  })

  describe.concurrent("stripMargin", () => {
    it("should strip a leading prefix from each line", () => {
      const string = `|
    |Hello,
    |World!
    |`
      const result = S.stripMargin(string)
      expect(result).toBe("\nHello,\nWorld!\n")
    })

    it("should strip a leading prefix from each line using a margin character", () => {
      const string = "\n$\n    $Hello,\r\n    $World!\n $"
      const result = S.stripMarginWith(string, "$")
      expect(result).toBe("\n\nHello,\r\nWorld!\n")
    })
  })

  describe.concurrent("linesWithSeparators", () => {
    it("should split a string into lines with separators", () => {
      const string = "\n$\n    $Hello,\r\n    $World!\n $"
      const result = S.linesWithSeparators(string)
      deepStrictEqual(Array.from(result), ["\n", "$\n", "    $Hello,\r\n", "    $World!\n", " $"])
    })
  })
})
