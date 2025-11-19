'use client'

import { useState, useEffect, use } from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Star, Check, Truck, Shield, ArrowLeft, MessageCircle } from 'lucide-react'
import { getProductBySlug, getProductsByCategory } from '@/lib/strapi/api'
import type { Product } from '@/types'
import { useCartStore } from '@/lib/store/cartStore'
import { useToastStore } from '@/lib/store/toastStore'
import ProductCard from '@/components/ProductCard'
import { formatPriceSimple } from '@/lib/utils/currency'
import { orderProductViaWhatsApp } from '@/lib/utils/whatsapp'

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore((state) => state.addItem)
  const addToast = useToastStore((state) => state.addToast)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const productData = await getProductBySlug(slug)

        if (!productData) {
          notFound()
        }

        setProduct(productData)

        if (productData.category) {
          const categoryProducts = await getProductsByCategory(productData.category.slug)
          setRelatedProducts(
            categoryProducts
              .filter((p) => p.id !== productData.id)
              .slice(0, 4)
          )
        }
      } catch (error) {
        console.error('Error fetching product:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  if (loading || !product) {
    return (
      <div className="min-h-screen faded-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading product...</p>
        </div>
      </div>
    )
  }

  const displayPrice = product.salePrice || product.price
  const hasDiscount = product.salePrice && product.salePrice < product.price

  const handleAddToCart = () => {
    addItem(product, quantity)
    addToast({
      message: `${quantity} item${quantity > 1 ? 's' : ''} added to your cart`,
      type: 'success',
      productName: product.name,
      productImage: product.images?.[0]?.url,
    })
  }

  const handleWhatsAppOrder = () => {
    orderProductViaWhatsApp(product, quantity)
  }

  return (
    <div className="min-h-screen faded-gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
          <Link href="/" className="hover:text-accent-500 transition">
            Home
          </Link>
          <span>/</span>
          <Link href="/products" className="hover:text-accent-500 transition">
            Products
          </Link>
          <span>/</span>
          <Link
            href={`/category/${product.category.slug}`}
            className="hover:text-accent-500 transition"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>

        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-accent-500 hover:text-accent-400 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Products
        </Link>

        {/* Product Details */}
        <div className="bg-primary-800 rounded-lg shadow-lg overflow-hidden mb-12">
          <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Images */}
            <div>
              <div className="relative aspect-square mb-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] rounded-xl overflow-hidden">
                <Image
                  src={product.images[selectedImage].url}
                  alt={product.images[selectedImage].alt}
                  fill
                  className="object-contain"
                  priority
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  {product.isNew && (
                    <span className="px-3 py-1 bg-primary-900 text-white text-sm font-bold rounded">
                      NEW
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="px-3 py-1 bg-accent-600 text-white text-sm font-bold rounded">
                      SALE
                    </span>
                  )}
                  {product.isBestSeller && (
                    <span className="px-3 py-1 bg-accent-600 text-white text-sm font-bold rounded">
                      BEST SELLER
                    </span>
                  )}
                </div>

                {/* Image Counter */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded text-sm">
                    {selectedImage + 1} / {product.images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={image.id}
                      onClick={() => setSelectedImage(index)}
                      className={`relative flex-shrink-0 w-20 h-20 transition-all border-0 bg-transparent rounded-lg overflow-hidden ${
                        selectedImage === index
                          ? 'ring-2 ring-accent-500'
                          : 'opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={image.url}
                        alt={image.alt}
                        fill
                        className="object-contain"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <div className="mb-4">
                <Link
                  href={`/category/${product.category.slug}`}
                  className="text-sm text-accent-500 hover:text-accent-400 font-medium transition"
                >
                  {product.category.name}
                </Link>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                {product.name}
              </h1>

              {/* Brand */}
              <p className="text-lg text-gray-300 mb-4">
                Brand: <span className="font-semibold text-white">{product.brand}</span>
              </p>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(product.rating!)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-400">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
              )}

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl font-bold text-white">
                    {formatPriceSimple(displayPrice)}
                  </span>
                  {hasDiscount && (
                    <span className="text-2xl text-gray-500 line-through">
                      {formatPriceSimple(product.price)}
                    </span>
                  )}
                </div>
                {hasDiscount && (
                  <span className="text-lg text-accent-500 font-semibold">
                    Save {formatPriceSimple(product.price - product.salePrice!)} (
                    {Math.round(
                      ((product.price - product.salePrice!) / product.price) * 100
                    )}
                    % off)
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-300 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Stock Status */}
              <div className="mb-6">
                {product.inStock ? (
                  <div className="flex items-center gap-2 text-green-500">
                    <Check className="w-5 h-5" />
                    <span className="font-semibold">In Stock</span>
                    {product.stockQuantity && (
                      <span className="text-gray-400">
                        ({product.stockQuantity} available)
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-500">
                    <span className="font-semibold">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* SKU */}
              <p className="text-sm text-gray-400 mb-6">SKU: {product.sku}</p>

              {/* WhatsApp Order Button */}
              <button
                onClick={handleWhatsAppOrder}
                disabled={!product.inStock}
                className="w-full px-8 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition flex items-center justify-center gap-2 mb-4"
              >
                <MessageCircle className="w-5 h-5" />
                Order via WhatsApp
              </button>

              {/* Quantity & Add to Cart */}
              <div className="flex gap-4 mb-8">
                <div className="flex items-center border border-primary-700 rounded-lg bg-primary-800">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-white hover:bg-primary-700 transition"
                  >
                    -
                  </button>
                  <span className="px-6 py-3 font-semibold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-3 text-white hover:bg-primary-700 transition"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                  className="flex-1 px-8 py-3 bg-accent-600 hover:bg-accent-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-primary-800 rounded-lg">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-accent-500" />
                  <span className="text-sm text-gray-300">Island-wide delivery</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-accent-500" />
                  <span className="text-sm text-gray-300">Genuine parts</span>
                </div>
              </div>

              {/* Specifications */}
              {product.specifications && product.specifications.length > 0 && (
                <div>
                  <h3 className="font-bold text-white mb-4">Specifications</h3>
                  <div className="space-y-2">
                    {product.specifications.map((spec, index) => (
                      <div
                        key={index}
                        className="flex justify-between py-2 border-b border-primary-800"
                      >
                        <span className="text-gray-400">{spec.name}</span>
                        <span className="font-semibold text-white">
                          {spec.value} {spec.unit || ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
              Related Products
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
