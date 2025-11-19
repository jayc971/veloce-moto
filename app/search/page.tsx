'use client'

import { useState, useEffect, useRef } from 'react'
import ProductCard from '@/components/ProductCard'
import { getAllProducts } from '@/lib/strapi/api'
import { Search } from 'lucide-react'
import type { Product } from '@/types'

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const productsData = await getAllProducts()
        setProducts(productsData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Auto-focus search bar on page load
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [])

  // Get random products for initial display
  const getRandomProducts = (allProducts: Product[], count: number) => {
    const shuffled = [...allProducts].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, count)
  }

  // Filter products based on search query
  const filteredProducts = searchQuery
    ? products.filter((product) => {
        const query = searchQuery.toLowerCase()
        return (
          product.name.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query) ||
          product.shortDescription?.toLowerCase().includes(query) ||
          product.category.name.toLowerCase().includes(query)
        )
      })
    : getRandomProducts(products, 6)

  if (loading) {
    return (
      <div className="min-h-screen faded-gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen faded-gradient-bg">
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-primary-800 border border-primary-700 text-white text-lg rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Results Info */}
        {searchQuery && (
          <p className="text-gray-300 mb-6">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} for "{searchQuery}"
          </p>
        )}

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-primary-800 rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-300">No products found for "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
