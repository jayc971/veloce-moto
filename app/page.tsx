import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Truck, Shield, Headphones, CreditCard } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import HeroSlider from '@/components/HeroSlider'
import CategorySlider from '@/components/CategorySlider'
import { getFeaturedProducts, getAllCategories } from '@/lib/strapi/api'

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()
  const categories = await getAllCategories()
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative animated-gradient-bg text-white">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-4 flex items-end gap-1">
                <span className="veloce-text text-accent-500 text-4xl lg:text-6xl">VELOCE</span>
                <span className="moto-text text-white text-5xl lg:text-7xl translate-y-2 lg:translate-y-3">MOTO</span>
              </div>
              <h1 className="text-3xl lg:text-5xl font-bold mb-6 leading-tight">
                Premium Motorcycle Parts & Accessories
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Upgrade your ride with genuine motorcycle parts from trusted brands.
                Island-wide delivery, expert support and competitive prices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/products"
                  className="px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
                >
                  Explore More <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <HeroSlider />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-primary-900 border-y border-primary-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
              <div className="p-3 bg-accent-500/10 rounded-lg">
                <Truck className="w-6 h-6 text-accent-500" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Island-wide Delivery</h3>
                <p className="text-sm text-gray-400">Fast shipping across Sri Lanka</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
              <div className="p-3 bg-accent-500/10 rounded-lg">
                <Shield className="w-6 h-6 text-accent-500" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Genuine Parts</h3>
                <p className="text-sm text-gray-400">100% authentic motorcycle parts</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
              <div className="p-3 bg-accent-500/10 rounded-lg">
                <Headphones className="w-6 h-6 text-accent-500" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Expert Support</h3>
                <p className="text-sm text-gray-400">24/7 customer service</p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
              <div className="p-3 bg-accent-500/10 rounded-lg">
                <svg className="w-6 h-6 text-accent-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">Easy WhatsApp Ordering</h3>
                <p className="text-sm text-gray-400">Order directly via WhatsApp</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 faded-gradient-bg">
        <div className="container mx-auto px-4">
          <CategorySlider categories={categories} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 animated-gradient-bg text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Upgrade Your Motorcycle?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Browse our extensive catalog of genuine motorcycle parts and accessories
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-lg transition"
          >
            Explore More <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 faded-gradient-bg">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-center justify-between mb-12">
            <div className="text-center md:text-left">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                Featured Products
              </h2>
              <p className="text-gray-300">
                Our top picks for quality and performance
              </p>
            </div>
            <Link
              href="/products"
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg transition"
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
              className="inline-flex items-center gap-2 px-6 py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-lg transition"
            >
              View All Products <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
