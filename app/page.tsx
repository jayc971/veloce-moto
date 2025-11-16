'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Truck, Shield, Headphones, CreditCard } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { featuredProducts, categories } from '@/lib/mockData'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-950 via-primary-900 to-black text-white">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Premium Automotive Parts & Accessories
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Upgrade your vehicle with high-quality parts from trusted brands.
                Fast shipping, expert support, and competitive prices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="px-8 py-4 bg-accent-500 hover:bg-accent-600 text-black font-bold rounded-lg transition flex items-center justify-center gap-2"
                >
                  Shop Now <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/deals"
                  className="px-8 py-4 bg-white hover:bg-gray-100 text-black font-bold rounded-lg transition flex items-center justify-center"
                >
                  View Deals
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <Image
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800"
                alt="Premium Car"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-primary-950 border-y border-primary-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent-500/10 rounded-lg">
                <Truck className="w-6 h-6 text-accent-500" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Free Shipping</h3>
                <p className="text-sm text-gray-400">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent-500/10 rounded-lg">
                <Shield className="w-6 h-6 text-accent-500" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Quality Guaranteed</h3>
                <p className="text-sm text-gray-400">Premium parts only</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent-500/10 rounded-lg">
                <Headphones className="w-6 h-6 text-accent-500" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Expert Support</h3>
                <p className="text-sm text-gray-400">24/7 customer service</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-accent-500/10 rounded-lg">
                <CreditCard className="w-6 h-6 text-accent-500" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Secure Payment</h3>
                <p className="text-sm text-gray-400">Safe & encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find the perfect parts for your vehicle from our extensive collection
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="group"
              >
                <div className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square">
                    <Image
                      src={category.image!}
                      alt={category.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600">
                Our top picks for quality and performance
              </p>
            </div>
            <Link
              href="/products"
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-primary-900 hover:bg-black text-white font-semibold rounded-lg transition"
            >
              View All <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-900 hover:bg-black text-white font-semibold rounded-lg transition"
            >
              View All Products <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-950 to-black text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Upgrade Your Ride?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Browse our extensive catalog of premium automotive parts and accessories
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-black font-bold rounded-lg transition"
          >
            Start Shopping <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
