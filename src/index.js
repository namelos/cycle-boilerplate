import Rx from 'rxjs'
const { Observable } = Rx
const { of, from, zip, merge, combineLatest, sample, forkJoin, range } = Observable
const log = console.log.bind(console)

const data = [
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000001',
  'ITEM000003-2',
  'ITEM000005',
  'ITEM000005',
  'ITEM000005'
]

const discounts = {
  b1g1f: ['ITEM000001', 'ITEM000005'],
  discount95: ['ITEM000003', 'ITEM000001']
}

const buyOneGetOneFree = '买一赠一'
const ninetyFivePercentDiscount = '九五折'

const calcNinetyFivePercentDiscount = (price, quantity) =>
  price * quantity * 0.95
const calcBuyOneGetOneFree = (price, quantity) =>
  price * (quantity - parseInt(quantity / 3))

const dict = {
  ITEM000001: {
    name: 'ball',
    price: 1,
    unit: '',
    discounts: [buyOneGetOneFree, ninetyFivePercentDiscount]
  },
  ITEM000003: {
    name: 'apple',
    price: 5.5,
    unit: '',
    discounts: [ninetyFivePercentDiscount]
  },
  ITEM000005: {
    name: 'coke',
    price: 3,
    unit: '',
    discounts: [buyOneGetOneFree]
  }
}

// const cate = 'ITEM000001'
// log(Object.keys(discount).map(x => discount[x].indexOf(cate)).map(x => x > -1))

const { keys } = Object
const print = input => param => log(input + param)

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

const contains = element => array => array.indexOf(element) > -1
const doesntContain = element => array => array.indexOf(element) === -1

const getPrice = category => dict[category].price
const getDiscounts = category => dict[category].discounts

const model$ = from(data)                    // input data stream

const items$$ = model$
  .map(parseString)
  .groupBy(first)

items$$
  .flatMap(item$ => {
    const catetory$ = item$.map(first).last()
      // .do(print('1.1 取流尾部名称: '))

    const quantity$ = item$.map(second).reduce(sum)
      // .do(print('1.2 物品Reduce后数量: '))

    const price$ = catetory$.map(getPrice)
      // .do(print('1.3 物品价格: '))

    const discounts$ = catetory$.map(getDiscounts)
      // .do(print('1.5 折扣: '))

    const buyOneGetOneFree$ = discounts$
      .filter(contains(buyOneGetOneFree))
      .filter(doesntContain(ninetyFivePercentDiscount))
      .map(() => calcBuyOneGetOneFree)
      // .do(print('1.6 买一赠一: '))

    const ninetyFivePercentDiscount$ = discounts$
      .filter(contains(ninetyFivePercentDiscount))
      .filter(doesntContain(buyOneGetOneFree))
      .map(() => calcNinetyFivePercentDiscount)
      // .do(print('1.6 九五折'))

    const bothDiscount$ = discounts$
      .filter(contains(ninetyFivePercentDiscount))
      .filter(contains(buyOneGetOneFree))
      .map(() => calcBuyOneGetOneFree)
      // .do(print('1.6 买一赠一 + 九五折'))

    const noDiscount$ = discounts$
      .filter(doesntContain(buyOneGetOneFree))
      .filter(doesntContain(ninetyFivePercentDiscount))
      .map(() => multiply)
      // .do(print('1.6 无优惠'))

    const discount$ = merge(
      buyOneGetOneFree$, ninetyFivePercentDiscount$, bothDiscount$, noDiscount$)
      // .do(print('优惠!'))

    const subtotal$ = zip(quantity$, price$, multiply)
    // .do(print('1.4 原价小计: '))

    const disCountedSubtotal$ = discount$.map(f => zip(quantity$, price$, f))

    return disCountedSubtotal$
    // const result$ = zip(catetory$, quantity$, price$, subtotal$, discount$,
    //   (category, quantity, price, subtotal, discount) =>
    //     ({ category, quantity, price, subtotal, discount }))
    //
    // return result$
  }).subscribe(log)

// const category$ = items$$                    // category stream
//   .flatMap(items$ =>
//     items$.map(getCategory).last())
//   .do(x => log(''))
//
// const discount$ = category$
//   .map(category =>
//     Object.keys(discount)
//       .map(x => discount[x]
//         .indexOf(category))
//       .map(x => x > -1))
//
// const price$ = category$                     // price stream
//   .map(getPrice)
//
// const subtotal = multiply
// const subtotal95 = (price, quantity) => price * quantity * 0.95
// const subtotalb1g1 = (price, quantity) => price * (quantity - parseInt(quantity / (2 + 1)))
//
// const subtotal$ = zip(price$, quantity$, subtotal)     // subtotal stream
// const subtotal95$ = zip(price$, quantity$, subtotal95) // 95 discount stream
// const subtotalb1g1$ = zip(price$, quantity$, subtotalb1g1) // b1g1 discount stream
//
// const diffenceBetween95$ = zip(subtotal$, subtotal95$, diffence)
// const diffenceBetweenb1g1$ = zip(subtotal$, subtotalb1g1$, diffence)
//
// const total$ = subtotal$.reduce(sum)        // total stream
//
// const main$ = zip(category$, quantity$, price$, subtotal$,
//   (category, quantity, price, subtotal) => ({ category, quantity, price, subtotal }))
//   .subscribe(x => { log('列表对象:'); log(x) })

// const output$ = main$.map(({ category, quantity, price, subtotal }) => `
// name: ${ category }, quantity: ${ quantity }, price: ${ price }, subtotal: ${ subtotal }`)
//   .reduce(sum)
