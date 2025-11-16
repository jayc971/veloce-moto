'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Search, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/lib/store/cartStore'
import { categories } from '@/lib/mockData'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const itemCount = useCartStore((state) => state.getItemCount())

  return (
    <header className="sticky top-0 z-50 bg-white shadow-lg border-b border-gray-200">
      {/* Top Bar */}
      <div className="bg-primary-950 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <p>Free shipping on orders over $100</p>
          <div className="flex gap-4">
            <Link href="/contact" className="hover:text-accent-400 transition">
              Contact
            </Link>
            <Link href="/about" className="hover:text-accent-400 transition">
              About
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="https://i.ibb.co/Ps3HFYh4/veloce-moto-logo.png"
              alt="Veloce Moto Logo"
              width={180}
              height={60}
              className="h-12 w-auto"
              priority
            />
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for parts, brands, or categories..."
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>

          {/* Cart & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <ShoppingCart className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <div className="md:hidden mt-4">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search for parts..."
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Navigation - Desktop */}
      <nav className="hidden md:block bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <ul className="flex items-center justify-center gap-8 py-3">
            <li>
              <Link
                href="/products"
                className="text-gray-700 hover:text-black font-medium transition"
              >
                All Products
              </Link>
            </li>
            {categories.slice(0, 5).map((category) => (
              <li key={category.id}>
                <Link
                  href={`/category/${category.slug}`}
                  className="text-gray-700 hover:text-black font-medium transition"
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/deals"
                className="text-accent-600 hover:text-accent-700 font-bold transition"
              >
                Deals
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden bg-white border-t border-gray-200">
          <ul className="py-4">
            <li>
              <Link
                href="/products"
                className="block px-4 py-3 hover:bg-gray-50 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Products
              </Link>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={`/category/${category.slug}`}
                  className="block px-4 py-3 hover:bg-gray-50 transition"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/deals"
                className="block px-4 py-3 text-accent-600 font-bold hover:bg-gray-50 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Deals
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
