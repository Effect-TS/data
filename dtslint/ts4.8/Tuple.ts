import * as T from '@effect/data/Tuple'
import { pipe } from '@effect/data/Function'

//
// tuple
//

// $ExpectType [string, number, boolean]
T.tuple('a', 1, true)

//
// appendElement
//

// $ExpectType [string, number, boolean]
pipe(T.tuple('a', 1), T.appendElement(true))
