const priceArray = (min: number, max: number, count: number) => {
  const arr = []
  const step = (max - min) / (count - 1)
  for (let i = min; i <= max; i += step) {
    arr.push(i)
  }
  return arr
}

export const star2TradePrice = priceArray(28800, 63000, 20)
export const craftTradePrice = priceArray(1200, 2100, 13)
export const buriTradePrice = priceArray(6000, 10500, 13)
export const mossTradePrice = priceArray(60000, 105000, 13)
