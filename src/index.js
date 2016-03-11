import Rx from 'rxjs'
import { parseString, first } from './auxiliary'
import { contains, head, last, add, subtract, multiply, prop, __ } from 'ramda'
import { calcBuyOneGetOneFree, calcNinetyFivePercentDiscount, getFormulae } from './mapping'
import { data, dict, buyOneGetOneFree, ninetyFivePercentDiscount } from './data'

const { Observable } = Rx
const { of, from, zip } = Observable

const main = (input, dict) => {
  const items$$ = from(data).map(parseString).groupBy(head)

  const category$ = items$$.flatMap(item$ => item$.map(head).last())
  const quantity$ = items$$.flatMap(item$ => item$.map(last).reduce(add))

  const info$ = category$.map(prop(__, dict))
  const unit$ = info$.map(prop('unit'))
  const price$ = info$.map(prop('price'))
  const discounts$ = info$.map(prop('discounts'))

  const formulae$ = discounts$.map(getFormulae)

  const subtotalWithoutDiscount$ = zip(quantity$, price$, multiply)
  const subtotal$ = zip(price$, quantity$, formulae$,
    (price, quantity, formulae) => formulae(price, quantity))

  const saved$ = zip(subtotalWithoutDiscount$, subtotal$, subtract)

  const listView$ = zip(category$, price$, unit$, quantity$, subtotal$, saved$,
    (category, price, unit, quantity, subtotal, saved) =>
      ({ category, price, unit, quantity, subtotal, saved }))

  return of({ listView$ })
}

const render = result$ => {
  const renderListItem = ({ category, price, unit, quantity, subtotal, saved }) => {
    const savedString =  saved ? `, saved: ${ saved }` : ''
    return `category: ${ category }, price: ${ price }, unit: ${ unit }, quantity: ${ quantity }${ savedString }\n`
  }

  result$
    .flatMap(({ listView$ }) => listView$.map(renderListItem).reduce(add))
    .subscribe(console::console.log)
}


render(main(data, dict))


  // .flatMap(item$ => {
  //   const category$ = item$.map(head).last()
  //   const quantity$ = item$.map(last).reduce(add)
  //
  //   const unit$ = category$.map(getUnit)
  //   const price$ = category$.map(getPrice)
  //   const discount$ = category$.map(getFormulae)
  //
  //   const unitQuantity$ = zip(quantity$, unit$, add)
  //
  //   const subtotalWithOutDiscount$ = zip(quantity$, price$, multiply)
  //   const subtotal$ = zip(price$, quantity$, discount$,
  //     (price, quantity, discount) => discount(price, quantity))
  //
  //   const saved$ = zip(subtotalWithOutDiscount$, subtotal$, subtract)
  //
  //   return zip(category$, unitQuantity$, price$, discount$, subtotal$, saved$,
  //     (category, unitQuantity, price, discount, subtotal, saved) =>
  //       ({ category, unitQuantity, price, discount, subtotal, saved }))
  // }).subscribe(console::console.log)