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

const model$ = from(data)                    // input data stream

const items$$ = model$.map(parseString)      // items metastream
  .groupBy(getCategory)

const quantity$ = items$$                    // quantity stream
  .flatMap(items$ =>
    items$.map(getQuantity).reduce(sum))

const category$ = items$$                    // category stream
  .flatMap(items$ =>
    items$.map(getCategory).last())

const price$ = category$                     // price stream
  .map(getPrice)

const subtotal$ = zip(price$, quantity$,     // subtotal stream
  (price, quantity) => price * quantity)

const total$ = subtotal$.reduce(sum)        // total stream

const main$ = zip(category$, quantity$, price$, subtotal$,
  (category, quantity, price, subtotal) => ({ category, quantity, price, subtotal }))

const output$ = main$.map(({ category, quantity, price, subtotal }) => `
name: ${ category }, quantity: ${ quantity }, price: ${ price }, subtotal: ${ subtotal }`)
  .reduce(sum)
  .subscribe(log)
