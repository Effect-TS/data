import * as Either from '@effect/data/Either'

// -------------------------------------------------------------------------------------
// try
// -------------------------------------------------------------------------------------

// $ExpectType Either<unknown, number>
Either.try(() => 1)

// $ExpectType Either<Error, number>
Either.try({ try: () => 1, catch: () => new Error() })
