'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Mail, MapPin } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'
import { getAllCategories } from '@/lib/strapi/api'
import type { Category } from '@/types'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories()
        setCategories(categoriesData.slice(0, 3))
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }

    fetchCategories()
  }, [])

  return (
    <footer className="animated-gradient-bg text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* About Section */}
          <div className="text-center md:text-left">
            <div className="mb-4">
              <div className="flex items-end gap-1 md:justify-start justify-center">
                <span className="veloce-text text-accent-500 text-2xl">VELOCE</span>
                <span className="moto-text text-white text-2xl translate-y-2">MOTO</span>
              </div>
            </div>
            <p className="text-sm mb-4">
              Your trusted source for premium motorcycle parts and accessories.
              Quality products, expert support, and fast shipping.
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <a
                href="https://www.facebook.com/Velocemoto2001"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-500 transition"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold mb-4">Categories</h3>
            <ul className="space-y-2 text-sm">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={`/category/${category.slug}`} className="hover:text-accent-500 transition">
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/products" className="hover:text-accent-500 transition font-medium">
                  Explore More
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-accent-500 transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-accent-500 transition">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://wa.me/94741813772"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-500 transition"
                >
                  Contact via WhatsApp
                </a>
              </li>
              <li>
                <a
                  href="mailto:yamahamotohubsl@gmail.com"
                  className="hover:text-accent-500 transition"
                >
                  Email Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="text-white font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2 justify-center md:justify-start">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Veloce Moto<br />Galle Road, Aluthgama</span>
              </li>
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <FaWhatsapp className="w-5 h-5 flex-shrink-0" />
                <a href="https://wa.me/94741813772" target="_blank" rel="noopener noreferrer" className="hover:text-accent-500 transition">
                  (+94) 74 181 3772
                </a>
              </li>
              <li className="flex items-center gap-2 justify-center md:justify-start">
                <Mail className="w-5 h-5 flex-shrink-0" />
                <a href="mailto:yamahamotohubsl@gmail.com" className="hover:text-accent-500 transition">
                  yamahamotohubsl@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p>&copy; {currentYear} Veloce Moto. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
