export const sum = (x, y) => x + y
export const difference = (x, y) => x - y
export const multiply = (x, y) => x * y

export const first = ([x, y]) => x
export const second = ([x, y]) => y

export const parseString = item => {
  const pair = item.split('-')
  const category = pair[0]
  const quantity = parseInt(pair[1] || 1)
  return [category, quantity]
}


