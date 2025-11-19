'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, MessageCircle } from 'lucide-react'
import { useCartStore } from '@/lib/store/cartStore'
import { formatPriceSimple } from '@/lib/utils/currency'
import { checkoutCartViaWhatsApp } from '@/lib/utils/whatsapp'

export default function CartPage() {
  const items = useCartStore((state) => state.items)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const clearCart = useCartStore((state) => state.clearCart)
  const subtotal = useCartStore((state) => state.getSubtotal())

  const handleWhatsAppCheckout = () => {
    checkoutCartViaWhatsApp(items)
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen faded-gradient-bg">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto bg-primary-900 rounded-lg shadow-md p-12 text-center">
            <ShoppingBag className="w-24 h-24 mx-auto text-gray-500 mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-300 mb-8">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-accent-600 hover:bg-accent-700 text-white font-bold rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
              Explore More
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen faded-gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-300">{items.length} items in your cart</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const displayPrice = item.product.salePrice || item.product.price

              return (
                <div
                  key={item.product.id}
                  className="bg-primary-900 rounded-lg shadow-md overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row gap-4 p-4">
                    {/* Product Image */}
                    <div className="relative w-full sm:w-32 aspect-square bg-primary-800 rounded-lg overflow-hidden flex-shrink-0">
                      {item.product.images?.[0] ? (
                        <Image
                          src={item.product.images[0].url}
                          alt={item.product.images[0].alt}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-700 to-primary-800 flex items-center justify-center">
                          <span className="text-4xl font-bold text-gray-500">
                            {item.product.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link
                            href={`/product/${item.product.slug}`}
                            className="font-semibold text-white hover:text-accent-500 transition"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-gray-400 mt-1">
                            Brand: {item.product.brand}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            SKU: {item.product.sku}
                          </p>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition"
                          title="Remove from cart"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                        {/* Quantity */}
                        <div className="flex items-center border border-primary-700 rounded-lg w-fit bg-primary-800">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="p-2 hover:bg-primary-700 transition text-white"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 font-semibold min-w-[3rem] text-center text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="p-2 hover:bg-primary-700 transition text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="font-bold text-lg text-white">
                            {formatPriceSimple(displayPrice * item.quantity)}
                          </div>
                          <div className="text-sm text-gray-400">
                            {formatPriceSimple(displayPrice)} each
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Clear Cart */}
            <button
              onClick={clearCart}
              className="w-full px-4 py-3 border-2 border-red-500 text-red-500 hover:bg-red-500/10 font-semibold rounded-lg transition"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-primary-900 rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-6">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-white">
                  <span>Total</span>
                  <span>{formatPriceSimple(subtotal)}</span>
                </div>
                <div className="text-xs text-gray-300 bg-primary-800 p-3 rounded">
                  Final price will be confirmed via WhatsApp including delivery charges
                </div>
              </div>

              <button
                onClick={handleWhatsAppCheckout}
                className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition mb-4 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-5 h-5" />
                Order via WhatsApp
              </button>

              <Link
                href="/products"
                className="block text-center text-accent-500 hover:text-accent-400 font-semibold"
              >
                Explore More
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-primary-800">
                <div className="space-y-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Genuine motorcycle parts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Fast delivery across Sri Lanka</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Warranty on all products</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
