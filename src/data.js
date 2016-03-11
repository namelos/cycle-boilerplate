export const data = [
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

export const buyOneGetOneFree = '买一赠一'
export const ninetyFivePercentDiscount = '九五折'

export const dict = {
  ITEM000001: { name: '羽毛球', price: 1, unit: '个', discounts: [buyOneGetOneFree, ninetyFivePercentDiscount] },
  ITEM000003: { name: '苹果', price: 5.5, unit: '斤', discounts: [ninetyFivePercentDiscount] },
  ITEM000005: { name: '可口可乐', price: 3, unit: '瓶', discounts: [buyOneGetOneFree] }
}
