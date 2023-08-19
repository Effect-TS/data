import * as Option from "@effect/data/Option"
import {  HasName, Repr, typeSignature } from "@effect/data/internal/Derive"
import { pipe } from "@effect/data/Function"
import * as Order from "@effect/data/Order"
import * as RA from "@effect/data/ReadonlyArray"
import { makeRegistryBuilder } from "@effect/data/internal/Derive"

export const orderRegistryBuilder = makeRegistryBuilder<Order.OrderTypeLambda>()

export const orderRegistry = pipe(
    orderRegistryBuilder.empty(),
    orderRegistryBuilder.register(Order.string, 'string'),
    orderRegistryBuilder.register(Order.number, 'number'),
    orderRegistryBuilder.registerTC(RA.getOrder, 'Array'),
)

// ---- UserLand

interface Person extends HasName<"Person", "Person"> {
    name: string
}
declare module '@effect/data/Option' {
    // interface None<A> extends HasName<'Option', `Option<${Repr<A>}>`>{}
    interface Some<A> extends HasName<'Option', `Option<${Repr<A>}>`>{} // one is enough
}

const registry = pipe(
    orderRegistry, 
    orderRegistryBuilder.register(Order.mapInput(Order.string, (a: Person) => a.name), 'Person'),
    orderRegistryBuilder.registerTC(Option.getOrder, 'Option')
)

// 2 steps
const signature = typeSignature<Option.Option<Array<Person>>>()('Option<Array<Person>>')
const optionArrayPersonOrder = registry.instanceOf(signature)

// 1 step
registry.instanceOf(typeSignature<Option.Option<Array<Person>>>()('Option<Array<Person>>'))

registry.instance<Person>()('Person')
registry.instance<string>()('string')
registry.instance<Option.Option<Array<Person>>>()('Option<Array<Person>>')

// Errors

const registry2 = pipe(
    orderRegistryBuilder.empty(),
    orderRegistryBuilder.register(Order.string, 'string'),    
)

registry2.instance<Person>()('Person') // Error
registry2.instance<string>()('string')
registry2.instance<Array<Person>>()('Array<Person>') // Error
