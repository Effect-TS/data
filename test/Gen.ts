// import * as E from "@fp-ts/core/Either"
// import * as O from "@fp-ts/core/Option"
// import * as T from "@fp-ts/core/These"

// describe("Gen", () => {
//   it("Option", () => {
//     expect(O.gen(function*($) {
//       const a = yield* $(O.some(1))
//       const b = yield* $(O.some(2))
//       return a + b
//     })).toEqual(O.some(3))
//   })
//   it("Either", () => {
//     expect(E.gen(function*($) {
//       const a = yield* $(E.right(1))
//       const b = yield* $(E.right(2))
//       return a + b
//     })).toEqual(E.right(3))
//   })
//   it("These", () => {
//     expect(T.gen(function*($) {
//       const a = yield* $(T.right(1))
//       const b = yield* $(T.right(2))
//       return a + b
//     })).toEqual(T.right(3))
//   })
// })
