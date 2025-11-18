'use client'

import { useState, useEffect } from 'react'
import ProductCard from '@/components/ProductCard'
import { getAllProducts, getAllCategories } from '@/lib/strapi/api'
import { Filter } from 'lucide-react'
import type { Product, Category } from '@/types'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getAllCategories(),
        ])
        setProducts(productsData)
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredProducts = products.filter((product) => {
    if (!selectedCategory) return true
    return product.category.id === selectedCategory
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
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

  if (loading) {
    return (
      <div className="min-h-screen faded-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen faded-gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-2">
            All Products
          </h1>
          <p className="text-gray-300">
            Browse our complete catalog of racing motorcycle parts and accessories
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full mb-4 px-4 py-2 bg-primary-900 border border-primary-800 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-800 transition text-white"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>

            {/* Filters */}
            <div
              className={`bg-primary-900 rounded-lg shadow-lg p-6 ${
                showFilters ? 'block' : 'hidden lg:block'
              }`}
            >
              <h3 className="font-bold text-white mb-4">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded transition ${
                    selectedCategory === null
                      ? 'bg-accent-500 text-white font-medium'
                      : 'text-gray-300 hover:bg-primary-800'
                  }`}
                >
                  All Products
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded transition ${
                      selectedCategory === category.id
                        ? 'bg-accent-500 text-white font-medium'
                        : 'text-gray-300 hover:bg-primary-800'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort & Results */}
            <div className="bg-primary-900 rounded-lg shadow-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <p className="text-gray-300">
                  Showing {sortedProducts.length} products
                </p>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm text-gray-300">
                    Sort by:
                  </label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 bg-primary-800 border border-primary-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
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

            {/* Products */}
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="bg-primary-900 rounded-lg shadow-lg p-12 text-center">
                <p className="text-gray-300">No products found in this category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
