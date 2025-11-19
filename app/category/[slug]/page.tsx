'use client'

import { useState, useEffect, use } from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { getCategoryBySlug, getProductsByCategory } from '@/lib/strapi/api'
import type { Product, Category } from '@/types'
import { ArrowLeft } from 'lucide-react'

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [category, setCategory] = useState<Category | null>(null)
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([])
  const [sortBy, setSortBy] = useState('featured')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [categoryData, productsData] = await Promise.all([
          getCategoryBySlug(slug),
          getProductsByCategory(slug),
        ])

        if (!categoryData) {
          notFound()
        }

        setCategory(categoryData)
        setCategoryProducts(productsData)
      } catch (error) {
        console.error('Error fetching category data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  const sortedProducts = [...categoryProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.salePrice || a.price) - (b.salePrice || b.price)
      case 'price-high':
        return (b.salePrice || b.price) - (a.salePrice || a.price)
      case 'name':
        return a.name.localeCompare(b.name)
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      default:
        return b.featured ? 1 : -1
    }
  })

  if (loading || !category) {
    return (
      <div className="min-h-screen faded-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading category...</p>
        </div>
      </div>
    )
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
          <span className="text-white">{category.name}</span>
        </div>

        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-accent-500 hover:text-accent-400 mb-6 transition"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to All Products
        </Link>

        {/* Category Header - Simple Title Only */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-gray-300 text-lg">{category.description}</p>
          )}
        </div>

        {/* Sort & Results */}
        <div className="bg-primary-800 rounded-lg shadow-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p className="text-gray-300">
              {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
            </p>
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="text-sm text-gray-300">
                Sort by:
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-4 py-2 bg-primary-800 border border-primary-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 custom-select"
              >
                <option value="featured">Featured</option>
                <option value="name">Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-primary-800 rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-300">No products found in this category.</p>
          </div>
        )}
      </div>
    </div>
  )
}
