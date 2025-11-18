import type { Product } from '@/types'
import type { CartItem } from '@/lib/store/cartStore'
import { formatPriceSimple } from './currency'

const SHOP_WHATSAPP_NUMBER = '94741813772' // Without the + sign for WhatsApp API

/**
 * Generate WhatsApp message for a single product order
 */
export function generateProductWhatsAppMessage(product: Product, quantity: number = 1): string {
  const price = product.salePrice || product.price
  const total = price * quantity

  return encodeURIComponent(
    `Hi! I'm interested in ordering:\n\n` +
    `*Product:* ${product.name}\n` +
    `*Quantity:* ${quantity}\n` +
    `*Unit Price:* ${formatPriceSimple(price)}\n` +
    `*Total:* ${formatPriceSimple(total)}\n\n` +
    `Please confirm availability and delivery details.`
  )
}

/**
 * Generate WhatsApp message for cart checkout
 */
export function generateCartWhatsAppMessage(items: CartItem[]): string {
  let message = `Hi! I'd like to order the following items:\n\n`

  items.forEach((item, index) => {
    const price = item.product.salePrice || item.product.price
    const itemTotal = price * item.quantity

    message += `*${index + 1}. ${item.product.name}*\n`
    message += `   Quantity: ${item.quantity}\n`
    message += `   Unit Price: ${formatPriceSimple(price)}\n`
    message += `   Subtotal: ${formatPriceSimple(itemTotal)}\n\n`
  })

  const total = items.reduce(
    (sum, item) => sum + (item.product.salePrice || item.product.price) * item.quantity,
    0
  )

  message += `*Grand Total: ${formatPriceSimple(total)}*\n\n`
  message += `Please confirm availability and provide delivery details.`

  return encodeURIComponent(message)
}

/**
 * Open WhatsApp chat with shop owner for single product order
 */
export function orderProductViaWhatsApp(product: Product, quantity: number = 1): void {
  const message = generateProductWhatsAppMessage(product, quantity)
  const whatsappUrl = `https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${message}`
  window.open(whatsappUrl, '_blank')
}

/**
 * Open WhatsApp chat with shop owner for cart checkout
 */
export function checkoutCartViaWhatsApp(items: CartItem[]): void {
  const message = generateCartWhatsAppMessage(items)
  const whatsappUrl = `https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${message}`
  window.open(whatsappUrl, '_blank')
}
