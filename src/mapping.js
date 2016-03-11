import { multiply } from './auxiliary'
import { buyOneGetOneFree, ninetyFivePercentDiscount, dict } from './data'

export const getFormulae = discounts => formulae[discounts] || multiply

export const calcNinetyFivePercentDiscount = (price, quantity) =>
  price * quantity * 0.95

export const calcBuyOneGetOneFree = (price, quantity) =>
  price * (quantity - parseInt(quantity / 3))

export const calcBothDiscounts = (price, quantity) => do {
  if (quantity > 2)
    price * (quantity - parseInt(quantity / 3))
  else
    price * quantity * 0.95
}

export const formulae = {
  [[buyOneGetOneFree, ninetyFivePercentDiscount]]: calcBothDiscounts,
  [[buyOneGetOneFree]]: calcBuyOneGetOneFree,
  [[ninetyFivePercentDiscount]]: calcNinetyFivePercentDiscount
}
