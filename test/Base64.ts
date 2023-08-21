import * as Base64 from "@effect/data/Base64"
import * as Either from "@effect/data/Either"
import { deepStrictEqual, strictEqual } from "@effect/data/test/util"

const valid: Array<[string, string]> = [
  ["", ""],
  ["ß", "w58="],
  ["f", "Zg=="],
  ["fo", "Zm8="],
  ["foo", "Zm9v"],
  ["foob", "Zm9vYg=="],
  ["fooba", "Zm9vYmE="],
  ["foobar", "Zm9vYmFy"]
]

const invalid: Array<string> = [
  "ab\fcd",
  "ab\t\n\f\r cd",
  " \t\n\f\r ab\t\n\f\r cd\t\n\f\r ",
  "a=b",
  "abc=d",
  "a",
  "ab\t\n\f\r =\t\n\f\r =\t\n\f\r ",
  "abcde",
  "ab=c",
  "=a",
  "ab\u00a0cd",
  "A",
  "////A",
  "/",
  "AAAA/",
  "\0nonsense",
  "abcd\0nonsense"
]

describe.concurrent("Base64", () => {
  it.each(valid)(`should decode %j => %j`, (raw: string, encoded: string) => {
    const bytes = new TextEncoder().encode(raw)
    const decoded = Base64.decode(encoded)
    assert(Either.isRight(decoded))
    deepStrictEqual(decoded.right, bytes)
  })

  it.each(valid)(`should encode %j <= %j`, (raw: string, encoded: string) => {
    const bytes = new TextEncoder().encode(raw)
    strictEqual(Base64.encode(bytes), encoded)
  })

  it.each(invalid)(`should refuse to decode %j`, (encoded: string) => {
    const decoded = Base64.decode(encoded)
    assert(Either.isLeft(decoded))
    deepStrictEqual(decoded.left, new Error("Invalid base64 string"))
  })
})
