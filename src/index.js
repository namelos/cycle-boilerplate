import Rx from 'rxjs/Rx'
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

const discount = {
  b1g1f: ['ITEM000001', 'ITEM000005'],
  discount95: ['ITEM000003']
}

const dict = {
  ITEM000001: {
    name: 'ball',
    price: 1,
    unit: ''
  },
  ITEM000003: {
    name: 'apple',
    price: 5.5,
    unit: ''
  },
  ITEM000005: {
    name: 'coke',
    price: 3,
    unit: ''
  }
}

// const cate = 'ITEM000001'
//
// log(Object.keys(discount).map(x => discount[x].indexOf(cate)).map(x => x > -1))

const parseString = item => {
  const pair = item.split('-')
  const category = pair[0]
  const quantity = parseInt(pair[1] || 1)
  return [category, quantity]
}

const getCategory = ([category]) => category // auxilary functions
const getQuantity = ([_, quantity]) => quantity
const getPrice = category => dict[category].price
const sum = (x, y) => x + y
const diffence = (x, y) => x - y
const multiply = (x, y) => x * y

const model$ = from(data)                    // input data stream

const items$$ = model$.map(parseString)      // items metastream
  .groupBy(getCategory)

const quantity$ = items$$                    // quantity stream
  .flatMap(items$ =>
    items$
      .do(x => log('1. 物品MetaStream源: ' + x))
      .map(getQuantity)
      .reduce(sum)
      .do(x => log('2. 物品Reduce后: ' + x))
  )


const category$ = items$$                    // category stream
  .flatMap(items$ =>
    items$.map(getCategory).last())
  .do(x => log(''))

const discount$ = category$
  .map(category =>
    Object.keys(discount)
      .map(x => discount[x]
        .indexOf(category))
      .map(x => x > -1))

const price$ = category$                     // price stream
  .map(getPrice)

const subtotal = multiply
const subtotal95 = (price, quantity) => price * quantity * 0.95
const subtotalb1g1 = (price, quantity) => price * (quantity - parseInt(quantity / (2 + 1)))

const subtotal$ = zip(price$, quantity$, subtotal)     // subtotal stream
const subtotal95$ = zip(price$, quantity$, subtotal95) // 95 discount stream
const subtotalb1g1$ = zip(price$, quantity$, subtotalb1g1) // b1g1 discount stream

const diffenceBetween95$ = zip(subtotal$, subtotal95$, diffence)
const diffenceBetweenb1g1$ = zip(subtotal$, subtotalb1g1$, diffence)

const total$ = subtotal$.reduce(sum)        // total stream

const main$ = zip(category$, quantity$, price$, subtotal$,
  (category, quantity, price, subtotal) => ({ category, quantity, price, subtotal }))
  .subscribe(x => { log('列表对象:'); log(x) })

// const output$ = main$.map(({ category, quantity, price, subtotal }) => `
// name: ${ category }, quantity: ${ quantity }, price: ${ price }, subtotal: ${ subtotal }`)
//   .reduce(sum)
