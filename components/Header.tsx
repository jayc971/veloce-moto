'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Menu, X, ChevronDown, Search } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { useCartStore } from '@/lib/store/cartStore'
import { getAllCategories } from '@/lib/strapi/api'
import type { Category } from '@/types'
import logo from '@/app/assets/logo.png'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false)
  const [tabletMoreDropdownOpen, setTabletMoreDropdownOpen] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const itemCount = useCartStore((state) => state.getItemCount())

  const MAX_VISIBLE_CATEGORIES = 4

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories()
        setCategories(categoriesData)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 bg-primary-900 shadow-lg border-b border-primary-800 transition-all duration-300 ${
      isScrolled ? 'shadow-xl' : ''
    }`}>
      {/* Main Header - Single Line */}
      <div className={`container mx-auto px-4 transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}>
        <div className="flex items-center gap-8">
          {/* Logo - Animated */}
          <Link href="/" className={`flex items-center gap-2 flex-shrink-0 relative z-10 transition-all duration-300 ${
            isScrolled ? '-my-4' : '-my-8'
          }`}>
            <div className="logo-speed-animation">
              <Image
                src={logo}
                alt="Veloce Moto Logo"
                width={isScrolled ? 180 : 240}
                height={isScrolled ? 80 : 107}
                className={`w-auto transition-all duration-300 logo-glow-animation ${
                  isScrolled ? 'h-16' : 'h-24'
                }`}
                priority
              />
            </div>
          </Link>

          {/* Navigation - Desktop (Centered) */}
          <nav className="hidden lg:flex items-center justify-center gap-6 flex-1">
            <Link
              href="/products"
              className="text-gray-300 hover:text-accent-500 font-medium transition whitespace-nowrap"
            >
              All Products
            </Link>
            {categories.slice(0, MAX_VISIBLE_CATEGORIES).map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className="text-gray-300 hover:text-accent-500 font-medium transition whitespace-nowrap"
              >
                {category.name}
              </Link>
            ))}
            {categories.length > MAX_VISIBLE_CATEGORIES && (
              <div
                className="relative"
                onMouseEnter={() => setMoreDropdownOpen(true)}
                onMouseLeave={() => setMoreDropdownOpen(false)}
              >
                <button
                  className="flex items-center gap-1 text-gray-300 hover:text-accent-500 font-medium transition whitespace-nowrap"
                >
                  More
                  <ChevronDown className={`w-4 h-4 transition-transform ${moreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {moreDropdownOpen && (
                  <div className="absolute top-full right-0 pt-2 z-50">
                    <div className="w-56 bg-primary-800 rounded-lg shadow-xl border border-primary-700 py-2">
                      {categories.slice(MAX_VISIBLE_CATEGORIES).map((category) => (
                        <Link
                          key={category.id}
                          href={`/category/${category.slug}`}
                          className="block px-4 py-2 text-gray-300 hover:bg-black hover:text-accent-500 transition"
                          onClick={() => setMoreDropdownOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* All Products & More - Tablet Only */}
          <div className="hidden md:flex lg:hidden items-center gap-6">
            <Link
              href="/products"
              className="text-gray-300 hover:text-accent-500 font-medium transition whitespace-nowrap"
            >
              All Products
            </Link>
            {categories.length > 0 && (
              <div
                className="relative"
                onMouseEnter={() => setTabletMoreDropdownOpen(true)}
                onMouseLeave={() => setTabletMoreDropdownOpen(false)}
              >
                <button
                  className="flex items-center gap-1 text-gray-300 hover:text-accent-500 font-medium transition whitespace-nowrap"
                >
                  More
                  <ChevronDown className={`w-4 h-4 transition-transform ${tabletMoreDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {tabletMoreDropdownOpen && (
                  <div className="absolute top-full right-0 pt-2 z-50">
                    <div className="w-56 bg-primary-800 rounded-lg shadow-xl border border-primary-700 py-2">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/category/${category.slug}`}
                          className="block px-4 py-2 text-gray-300 hover:bg-black hover:text-accent-500 transition"
                          onClick={() => setTabletMoreDropdownOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Search, Cart, WhatsApp & Mobile Menu */}
          <div className="flex items-center gap-4 flex-shrink-0 ml-auto">
            {/* WhatsApp Button - Tablet & Mobile Only */}
            <a
              href="https://wa.me/94741813772"
              target="_blank"
              rel="noopener noreferrer"
              className="lg:hidden p-2 hover:bg-primary-800 rounded-lg transition text-green-500"
            >
              <FaWhatsapp className="w-6 h-6" />
            </a>
            <Link
              href="/products"
              className="p-2 hover:bg-primary-800 rounded-lg transition text-gray-300"
            >
              <Search className="w-6 h-6" />
            </Link>
            <Link
              href="/cart"
              className="relative p-2 hover:bg-primary-800 rounded-lg transition text-gray-300"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 hover:bg-primary-800 rounded-lg transition text-gray-300"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="lg:hidden bg-primary-900 border-t border-primary-800">
          <ul className="py-4 container mx-auto">
            <li>
              <Link
                href="/products"
                className="block px-4 py-3 text-gray-300 hover:bg-primary-800 hover:text-accent-500 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Products
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/category/${category.slug}`}
                  className="block px-4 py-3 text-gray-300 hover:bg-primary-800 hover:text-accent-500 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
