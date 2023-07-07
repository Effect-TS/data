import * as Duration from '@effect/data/Duration'

// -------------------------------------------------------------------------------------
// decode
// -------------------------------------------------------------------------------------

// $ExpectType Duration
Duration.decode(100)
// $ExpectType Duration
Duration.decode(10n)
// $ExpectType Duration
Duration.decode('10 nanos')
// $ExpectType Duration
Duration.decode('10 micros')
// $ExpectType Duration
Duration.decode('10 millis')
// $ExpectType Duration
Duration.decode('10 seconds')
// $ExpectType Duration
Duration.decode('10 minutes')
// $ExpectType Duration
Duration.decode('10 hours')
// $ExpectType Duration
Duration.decode('10 days')
// $ExpectType Duration
Duration.decode('10 nanos')

// @ts-expect-error
Duration.decode('10 unknown')
