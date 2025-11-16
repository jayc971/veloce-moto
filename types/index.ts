// CMS-ready type definitions for Veloce Moto
// These types are designed to work with headless CMS solutions like:
// - ButterCMS
// - Prismic
// - Sanity
// - Contentful

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  shortDescription?: string
  price: number
  salePrice?: number
  currency: string
  images: ProductImage[]
  category: Category
  subCategory?: SubCategory
  brand: string
  sku: string
  inStock: boolean
  stockQuantity?: number
  tags?: string[]
  specifications?: Specification[]
  compatibility?: VehicleCompatibility[]
  rating?: number
  reviewCount?: number
  featured?: boolean
  isNew?: boolean
  isBestSeller?: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id: string
  url: string
  alt: string
  isPrimary: boolean
  order?: number
}

export interface Category {
  id: string
  slug: string
  name: string
  description?: string
  image?: string
  parentId?: string
  order?: number
}

export interface SubCategory {
  id: string
  slug: string
  name: string
  description?: string
  categoryId: string
}

export interface Specification {
  name: string
  value: string
  unit?: string
}

export interface VehicleCompatibility {
  make: string
  model: string
  year: string
  trim?: string
  engine?: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Cart {
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
}

export interface Customer {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  addresses?: Address[]
}

export interface Address {
  id: string
  type: 'billing' | 'shipping'
  firstName: string
  lastName: string
  company?: string
  address1: string
  address2?: string
  city: string
  state: string
  postalCode: string
  country: string
  phone?: string
  isDefault?: boolean
}

export interface Order {
  id: string
  orderNumber: string
  customer: Customer
  items: CartItem[]
  shippingAddress: Address
  billingAddress: Address
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: OrderStatus
  paymentStatus: PaymentStatus
  createdAt: string
  updatedAt: string
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'refunded'

export interface Review {
  id: string
  productId: string
  customerId: string
  customerName: string
  rating: number
  title: string
  comment: string
  verified: boolean
  helpful: number
  createdAt: string
}

export interface CMSPage {
  id: string
  slug: string
  title: string
  content: string
  metaTitle?: string
  metaDescription?: string
  published: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  featuredImage?: string
  author: {
    name: string
    avatar?: string
    bio?: string
  }
  category: string
  tags?: string[]
  published: boolean
  publishedAt?: string
  createdAt: string
  updatedAt: string
}
