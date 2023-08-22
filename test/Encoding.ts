import * as Either from "@effect/data/Either"
import * as Encoding from "@effect/data/Encoding"
import { deepStrictEqual, strictEqual } from "@effect/data/test/util"

describe.concurrent("Base64", () => {
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

  it.each(valid)(`should decode %j => %j`, (raw: string, encoded: string) => {
    const bytes = new TextEncoder().encode(raw)
    const decoded = Encoding.decodeBase64(encoded)
    assert(Either.isRight(decoded))
    deepStrictEqual(decoded.right, bytes)
  })

  it.each(valid)(`should encode %j <= %j`, (raw: string, encoded: string) => {
    const bytes = new TextEncoder().encode(raw)
    strictEqual(Encoding.encodeBase64(bytes), encoded)
  })

  it.each(invalid)(`should refuse to decode %j`, (encoded: string) => {
    const decoded = Encoding.decodeBase64(encoded)
    assert(Either.isLeft(decoded))
    deepStrictEqual(decoded.left, new Encoding.Base64DecodeError())
  })
})

describe.concurrent("Base64Url", () => {
  const valid: Array<[string, string]> = [
    ["", ""],
    ["ß", "w58"],
    ["f", "Zg"],
    ["fo", "Zm8"],
    ["foo", "Zm9v"],
    ["foob", "Zm9vYg"],
    ["fooba", "Zm9vYmE"],
    ["foobar", "Zm9vYmFy"],
    [">?>d?ß", "Pj8-ZD_Dnw"]
  ]

  const invalid: Array<string> = [
    "Pj8/ZD+Dnw",
    "PDw/Pz8+Pg",
    "Pj8/ZD+Dnw==",
    "PDw/Pz8+Pg=="
  ]

  it.each(valid)(`should decode %j => %j`, (raw: string, encoded: string) => {
    const bytes = new TextEncoder().encode(raw)
    const decoded = Encoding.decodeBase64Url(encoded)
    assert(Either.isRight(decoded))
    deepStrictEqual(decoded.right, bytes)
  })

  it.each(valid)(`should encode %j <= %j`, (raw: string, encoded: string) => {
    const bytes = new TextEncoder().encode(raw)
    strictEqual(Encoding.encodeBase64Url(bytes), encoded)
  })

  it.each(invalid)(`should refuse to decode %j`, (encoded: string) => {
    const decoded = Encoding.decodeBase64Url(encoded)
    assert(Either.isLeft(decoded))
    deepStrictEqual(decoded.left, new Encoding.Base64UrlDecodeError())
  })
})
