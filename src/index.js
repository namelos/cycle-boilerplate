import Rx from 'rxjs'
const { Observable } = Rx
const { of, from, zip, merge } = Observable
const log = console.log.bind(console)

const data = ['ITEM000001', 'ITEM000001', 'ITEM000001', 'ITEM000001', 'ITEM000001', 'ITEM000003-2', 'ITEM000005', 'ITEM000005', 'ITEM000005']

const buyOneGetOneFree = '买一赠一'
const ninetyFivePercentDiscount = '九五折'

const dict = {
  ITEM000001: { name: '羽毛球', price: 1, unit: '个', discounts: [buyOneGetOneFree, ninetyFivePercentDiscount] },
  ITEM000003: { name: '苹果', price: 5.5, unit: '斤', discounts: [ninetyFivePercentDiscount] },
  ITEM000005: { name: '可口可乐', price: 3, unit: '瓶', discounts: [buyOneGetOneFree] }
}

const calcNinetyFivePercentDiscount = (price, quantity) =>
price * quantity * 0.95

const calcBuyOneGetOneFree = (price, quantity) =>
price * (quantity - parseInt(quantity / 3))

const formulae = {
  [[buyOneGetOneFree, ninetyFivePercentDiscount]]: calcBuyOneGetOneFree,
  [[buyOneGetOneFree]]: calcBuyOneGetOneFree,
  [[ninetyFivePercentDiscount]]: calcNinetyFivePercentDiscount
}

const parseString = item => {
  const pair = item.split('-')
  const category = pair[0]
  const quantity = parseInt(pair[1] || 1)
  return [category, quantity]
}

const sum = (x, y) => x + y
const difference = (x, y) => x - y
const multiply = (x, y) => x * y

const first = ([category]) => category
const second = ([_, quantity]) => quantity

const getUnit = category => dict[category].unit
const getPrice = category => dict[category].price
const getFormulae = category => formulae[dict[category].discounts] || multiply

const items$ = from(data)
  .map(parseString)
  .groupBy(first)
  .flatMap(item$ => {
    const category$ = item$.map(first).last()

    const quantity$ = item$.map(second).reduce(sum)

    const unit$ = category$.map(getUnit)

    const unitQuantity$ = zip(quantity$, unit$, sum)

    const price$ = category$.map(getPrice)

    const discount$ = category$.map(getFormulae)

    const subtotalWithOutDiscount$ = zip(quantity$, price$, multiply)

    const subtotal$ = zip(price$, quantity$, discount$,
      (price, quantity, discount) => discount(price, quantity))

    const saved$ = zip(subtotalWithOutDiscount$, subtotal$, difference)

    return zip(category$, unitQuantity$, price$, discount$, subtotal$, saved$,
      (category, unitQuantity, price, discount, subtotal, saved) =>
        ({ category, unitQuantity, price, discount, subtotal, saved }))
  }).subscribe(log)
