import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Mail, MapPin } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="animated-gradient-bg text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div>
            <div className="mb-4">
              <div className="flex items-end gap-1">
                <span className="veloce-text text-accent-500 text-2xl">VELOCE</span>
                <span className="moto-text text-white text-2xl translate-y-2">MOTO</span>
              </div>
            </div>
            <p className="text-sm mb-4">
              Your trusted source for premium motorcycle parts and accessories.
              Quality products, expert support, and fast shipping.
            </p>
            <div className="flex gap-4">
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

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/products" className="hover:text-accent-500 transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/deals" className="hover:text-accent-500 transition">
                  Special Deals
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-accent-500 transition">
                  Brands
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent-500 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-accent-500 transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="hover:text-accent-500 transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-accent-500 transition">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-accent-500 transition">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/warranty" className="hover:text-accent-500 transition">
                  Warranty
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-accent-500 transition">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>Veloce Moto<br />Galle Road, Aluthgama</span>
              </li>
              <li className="flex items-center gap-2">
                <FaWhatsapp className="w-5 h-5 flex-shrink-0" />
                <a href="https://wa.me/94741813772" target="_blank" rel="noopener noreferrer" className="hover:text-accent-500 transition">
                  (+94) 74 181 3772
                </a>
              </li>
              <li className="flex items-center gap-2">
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
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-accent-500 transition">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-accent-500 transition">
                Terms of Service
              </Link>
              <Link href="/sitemap" className="hover:text-accent-500 transition">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
