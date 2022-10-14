import { pipe } from "@fp-ts/core/Function"
import * as O from "@fp-ts/core/Option"
import { equals } from "@fp-ts/data/Equal"
import * as Q from "@fp-ts/data/Queue"

describe.concurrent("Queue", () => {
  test("enqueue", () => {
    const queue = Q.empty<number>()

    const result = pipe(queue, Q.enqueue(1), Q.enqueue(2), Q.enqueue(3))

    assert.isTrue(equals(Array.from(result), [1, 2, 3]))
  })

  test("enqueueAll", () => {
    const queue = Q.empty<number>()

    const result = pipe(queue, Q.enqueueAll([1, 2, 3]))

    assert.isTrue(equals(Array.from(result), [1, 2, 3]))
  })

  test("dequeue", () => {
    const queue = Q.make(1, 2)

    const result1 = Q.dequeue(queue)
    assert(O.isSome(result1))
    const result2 = Q.dequeue(result1.value[1])
    assert(O.isSome(result2))
    const result3 = Q.dequeue(result2.value[1])

    assert.isTrue(equals(result1, O.some([1, Q.make(2)])))
    assert.isTrue(equals(result2, O.some([2, Q.empty<number>()])))
    assert.isTrue(equals(result3, O.none))
  })

  test("head", () => {
    const queue = Q.make(1, 2, 3, 4, 5)

    assert.isTrue(equals(Q.head(queue), O.some(1)))
  })

  test("tail", () => {
    const queue = Q.make(1, 2, 3, 4, 5)

    assert.isTrue(equals(Q.tail(queue), O.some(Q.make(2, 3, 4, 5))))
  })

  test("map", () => {
    const queue = Q.make(1, 2, 3, 4, 5)
    const result = pipe(
      queue,
      Q.map((n) => n + 1)
    )

    assert.isTrue(equals(result, Q.make(2, 3, 4, 5, 6)))
  })

  test("some", () => {
    const queue = Q.make(1, 2, 3, 4, 5)
    const result1 = pipe(
      queue,
      Q.some((n) => n === 5)
    )
    const result2 = pipe(
      queue,
      Q.some((n) => n === 6)
    )

    assert.isTrue(result1)
    assert.isFalse(result2)
  })

  test("reduce", () => {
    const queue = Q.make(1, 2, 3, 4, 5)
    const result = pipe(
      queue,
      Q.reduce(0, (b, a) => b + a)
    )

    assert.equal(result, 15)
  })

  test("findFirst", () => {
    const queue = Q.make(1, 2, 3)

    assert.isTrue(
      equals(
        pipe(
          queue,
          Q.findFirst((n) => n % 2 === 0)
        ),
        O.some(2)
      )
    )
    assert.isTrue(
      equals(
        pipe(
          queue,
          Q.findFirst((n) => n % 5 === 0)
        ),
        O.none
      )
    )
  })

  test("filter", () => {
    const queue = Q.make(0, 1, 2, 3, 4, 5)

    assert.isTrue(
      equals(
        pipe(
          queue,
          Q.filter((n) => n % 2 === 0)
        ),
        Q.make(0, 2, 4)
      )
    )
  })

  test("prepend", () => {
    const queue = Q.empty<number>()

    const result = pipe(queue, Q.enqueue(1), Q.prepend(2), Q.enqueue(3))

    assert.isTrue(equals(Array.from(result), [2, 1, 3]))
  })

  test("length", () => {
    const queue1 = Q.empty<number>()

    assert.strictEqual(Q.length(queue1), 0)

    const queue2 = Q.make(1, 2, 3, 4, 5)

    assert.strictEqual(Q.length(queue2), 5)
  })
})
