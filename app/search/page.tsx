'use client'

import { useState, useEffect, useRef } from 'react'
import ProductCard from '@/components/ProductCard'
import { getAllProducts } from '@/lib/strapi/api'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Product } from '@/types'

const ITEMS_PER_PAGE = 6

export default function SearchPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
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

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

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
    : products

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  const goToPage = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

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
            {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'} for &quot;{searchQuery}&quot;
          </p>
        )}

        {/* Products Grid */}
        {paginatedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 bg-primary-800 border border-primary-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      currentPage === page
                        ? 'bg-accent-500 text-white'
                        : 'bg-primary-800 border border-primary-700 text-gray-300 hover:bg-primary-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 bg-primary-800 border border-primary-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-700 transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-primary-800 rounded-lg shadow-lg p-12 text-center">
            <p className="text-gray-300">No products found for &quot;{searchQuery}&quot;</p>
          </div>
        )}
      </div>
    </div>
  )
}
