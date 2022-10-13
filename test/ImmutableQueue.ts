import { pipe } from "@fp-ts/core/Function"
import * as O from "@fp-ts/core/Option"
import { deepEqual } from "@fp-ts/data/DeepEqual"
import * as IQ from "@fp-ts/data/ImmutableQueue"

describe.concurrent("ImmutableQueue", () => {
  test("enqueue", () => {
    const queue = IQ.empty<number>()

    const result = pipe(queue, IQ.enqueue(1), IQ.enqueue(2), IQ.enqueue(3))

    assert.isTrue(deepEqual(Array.from(result), [1, 2, 3]))
  })

  test("enqueueAll", () => {
    const queue = IQ.empty<number>()

    const result = pipe(queue, IQ.enqueueAll([1, 2, 3]))

    assert.isTrue(deepEqual(Array.from(result), [1, 2, 3]))
  })

  test("dequeue", () => {
    const queue = IQ.make(1, 2)

    const result1 = IQ.dequeue(queue)
    assert(O.isSome(result1))
    const result2 = IQ.dequeue(result1.value[1])
    assert(O.isSome(result2))
    const result3 = IQ.dequeue(result2.value[1])

    assert.isTrue(deepEqual(result1, O.some([1, IQ.make(2)])))
    assert.isTrue(deepEqual(result2, O.some([2, IQ.empty<number>()])))
    assert.isTrue(deepEqual(result3, O.none))
  })

  test("head", () => {
    const queue = IQ.make(1, 2, 3, 4, 5)

    assert.isTrue(deepEqual(IQ.head(queue), O.some(1)))
  })

  test("tail", () => {
    const queue = IQ.make(1, 2, 3, 4, 5)

    assert.isTrue(deepEqual(IQ.tail(queue), O.some(IQ.make(2, 3, 4, 5))))
  })

  test("map", () => {
    const queue = IQ.make(1, 2, 3, 4, 5)
    const result = pipe(
      queue,
      IQ.map((n) => n + 1)
    )

    assert.isTrue(deepEqual(result, IQ.make(2, 3, 4, 5, 6)))
  })

  test("some", () => {
    const queue = IQ.make(1, 2, 3, 4, 5)
    const result1 = pipe(
      queue,
      IQ.some((n) => n === 5)
    )
    const result2 = pipe(
      queue,
      IQ.some((n) => n === 6)
    )

    assert.isTrue(result1)
    assert.isFalse(result2)
  })

  test("reduce", () => {
    const queue = IQ.make(1, 2, 3, 4, 5)
    const result = pipe(
      queue,
      IQ.reduce(0, (b, a) => b + a)
    )

    assert.equal(result, 15)
  })

  test("findFirst", () => {
    const queue = IQ.make(1, 2, 3)

    assert.isTrue(
      deepEqual(
        pipe(
          queue,
          IQ.findFirst((n) => n % 2 === 0)
        ),
        O.some(2)
      )
    )
    assert.isTrue(
      deepEqual(
        pipe(
          queue,
          IQ.findFirst((n) => n % 5 === 0)
        ),
        O.none
      )
    )
  })

  test("filter", () => {
    const queue = IQ.make(0, 1, 2, 3, 4, 5)

    assert.isTrue(
      deepEqual(
        pipe(
          queue,
          IQ.filter((n) => n % 2 === 0)
        ),
        IQ.make(0, 2, 4)
      )
    )
  })

  test("prepend", () => {
    const queue = IQ.empty<number>()

    const result = pipe(queue, IQ.enqueue(1), IQ.prepend(2), IQ.enqueue(3))

    assert.isTrue(deepEqual(Array.from(result), [2, 1, 3]))
  })

  test("length", () => {
    const queue1 = IQ.empty<number>()

    assert.strictEqual(IQ.length(queue1), 0)

    const queue2 = IQ.make(1, 2, 3, 4, 5)

    assert.strictEqual(IQ.length(queue2), 5)
  })
})
