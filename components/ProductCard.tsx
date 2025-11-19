'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Star, MessageCircle, Plus } from 'lucide-react'
import type { Product } from '@/types'
import { useCartStore } from '@/lib/store/cartStore'
import { useToastStore } from '@/lib/store/toastStore'
import { formatPriceSimple } from '@/lib/utils/currency'
import { orderProductViaWhatsApp } from '@/lib/utils/whatsapp'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem)
  const addToast = useToastStore((state) => state.addToast)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    addToast({
      message: 'Product added to your cart',
      type: 'success',
      productName: product.name,
      productImage: product.images?.[0]?.url,
    })
  }

  const handleWhatsAppOrder = (e: React.MouseEvent) => {
    e.preventDefault()
    orderProductViaWhatsApp(product, 1)
  }

  const displayPrice = product.salePrice || product.price
  const hasDiscount = product.salePrice && product.salePrice < product.price
  const primaryImage = product.images?.[0]

  return (
    <Link href={`/product/${product.slug}`} className="group h-full flex">
      <div className="rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2 flex flex-col w-full">
        {/* Image Container */}
        <div className="overflow-hidden relative">
          <div className="relative aspect-square bg-white">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                <span className="text-6xl font-bold text-gray-400">
                  {product.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
            {product.isNew && (
              <span className="px-2 py-1 bg-primary-900 text-white text-xs font-bold rounded text-center">
                NEW
              </span>
            )}
            {product.isBestSeller && (
              <span className="px-2 py-1 bg-accent-600 text-white text-xs font-bold rounded text-center">
                BEST SELLER
              </span>
            )}
          </div>

          {/* Stock Status */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="px-4 py-2 bg-red-600 text-white font-bold rounded">
                OUT OF STOCK
              </span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 bg-primary-800 relative overflow-hidden flex-1 flex flex-col">
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-2 relative z-10">
            <span className="font-medium">{product.brand}</span>
            <span>{product.category.name}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-bold text-white mb-2 line-clamp-2 relative z-10">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1 mb-2 relative z-10">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(product.rating!)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">
                ({product.reviewCount})
              </span>
            </div>
          )}

          {/* Short Description */}
          <p className="text-sm text-gray-300 mb-2 line-clamp-2 relative z-10 flex-1">
            {product.shortDescription}
          </p>

          {/* Price & Add to Cart */}
          <div className="flex items-center justify-between relative z-10 mt-auto">
            <div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">
                  {formatPriceSimple(displayPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-gray-400 line-through">
                    {formatPriceSimple(product.price)}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <span className="text-xs text-accent-500 font-bold block">
                  Save {formatPriceSimple(product.price - product.salePrice!)}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="relative p-2.5 text-gray-300 rounded-lg hover:bg-primary-700 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300"
                title="Add to cart"
              >
                <ShoppingCart className="w-5 h-5" />
                <Plus className="w-3 h-3 absolute -top-0.5 -right-0.5 bg-accent-500 text-white rounded-full" strokeWidth={3} />
              </button>
              <button
                onClick={handleWhatsAppOrder}
                disabled={!product.inStock}
                className="p-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 hover:scale-110 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg"
                title="Order via WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
