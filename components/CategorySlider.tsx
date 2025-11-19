'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Category } from '@/types'

interface CategorySliderProps {
  categories: Category[]
}

export default function CategorySlider({ categories }: CategorySliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [itemsPerView, setItemsPerView] = useState(6)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Determine how many items to show based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(2) // Mobile
      } else if (window.innerWidth < 768) {
        setItemsPerView(3) // Tablet
      } else if (window.innerWidth < 1024) {
        setItemsPerView(4) // Desktop small
      } else {
        setItemsPerView(6) // Desktop large
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goToNext()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentIndex, itemsPerView, categories.length])

  const maxIndex = Math.max(0, categories.length - itemsPerView)

  const goToPrevious = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? maxIndex : prevIndex - 1))
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const goToNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prevIndex) => (prevIndex >= maxIndex ? 0 : prevIndex + 1))
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const visibleCategories = categories.slice(currentIndex, currentIndex + itemsPerView)

  // If we're at the end and don't have enough items, wrap around
  if (visibleCategories.length < itemsPerView && categories.length >= itemsPerView) {
    const remaining = itemsPerView - visibleCategories.length
    visibleCategories.push(...categories.slice(0, remaining))
  }

  return (
    <div className="relative group">
      {/* Navigation Arrows */}
      {categories.length > itemsPerView && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-3 bg-accent-500 hover:bg-accent-600 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
            aria-label="Previous categories"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-3 bg-accent-500 hover:bg-accent-600 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
            aria-label="Next categories"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 transition-all duration-500 ease-in-out">
        {visibleCategories.map((category, index) => (
          <Link
            key={`${category.id}-${index}`}
            href={`/category/${category.slug}`}
            className={`group/card h-full flex transition-all duration-500 ease-in-out ${
              isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
            }`}
          >
            <div className="rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 flex flex-col w-full h-full bg-primary-800">
              <div className="overflow-hidden relative flex-shrink-0">
                {category.image ? (
                  <div className="relative aspect-square bg-white">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-square bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
                    <span className="text-4xl font-bold text-primary-400">
                      {category.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4 text-center bg-primary-800 relative overflow-hidden flex-1 flex items-center justify-center">
                <h3 className="font-bold text-white relative z-10">
                  {category.name}
                </h3>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Dot Indicators */}
      {categories.length > itemsPerView && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-accent-500 w-8'
                  : 'bg-gray-400 hover:bg-gray-500'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
