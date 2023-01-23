import * as Hash from "@fp-ts/data/Hash"

describe("circular failure", () => {
  it("should work", () => {
    const a = {
      next: undefined as any,
      previous: undefined as any,
      value: "something",
      [Hash.symbol](): number {
        return Hash.combine(
          Hash.combine(
            Hash.hash(this.next)
          )(Hash.hash(this.previous))
        )(Hash.hash(this.value))
      }
    }
    const b = {
      next: undefined as any,
      previous: a as any,
      value: "something",
      [Hash.symbol](): number {
        return Hash.combine(
          Hash.combine(
            Hash.hash(this.next)
          )(Hash.hash(this.previous))
        )(Hash.hash(this.value))
      }
    }
    a.next = b

    expect(Hash.hash(a)).not
      .toThrow()
  })
})
