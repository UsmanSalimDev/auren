export const pairOfferPrice = 499

export function getOrderPricing(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0)
  let discountedTotal = 0

  for (let index = 0; index < items.length; index += 2) {
    const firstItem = items[index]
    const secondItem = items[index + 1]
    const pairSubtotal = firstItem.price + (secondItem?.price ?? 0)
    discountedTotal += secondItem
      ? Math.min(pairSubtotal, pairOfferPrice)
      : firstItem.price
  }

  return {
    subtotal,
    discount: subtotal - discountedTotal,
    total: discountedTotal,
    qualifyingPairs: Math.floor(items.length / 2),
  }
}
