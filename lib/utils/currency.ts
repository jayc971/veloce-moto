// Currency formatting utilities for LKR (Sri Lankan Rupees)

export function formatPrice(price: number, currency: string = 'LKR'): string {
  if (currency === 'LKR') {
    return `Rs. ${price.toLocaleString('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`
  }

  // Fallback for other currencies
  return `${currency} ${price.toFixed(2)}`
}

export function formatPriceSimple(price: number): string {
  return `Rs. ${price.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}
