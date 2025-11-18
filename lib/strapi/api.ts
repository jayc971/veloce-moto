import qs from 'qs'
import type { Product, Category } from '@/types'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api'
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN || ''

// Helper function to get image URL
export function getStrapiURL(path: string = '') {
  return `${STRAPI_URL}${path}`
}

export function getStrapiMedia(url: string | null | undefined) {
  if (!url) return null
  if (url.startsWith('http')) return url
  return getStrapiURL(url)
}

// Fetch data from Strapi
async function fetchAPI(path: string, params = {}, options: RequestInit = {}) {
  const queryString = qs.stringify(params, {
    encodeValuesOnly: true,
  })

  const url = `${API_URL}${path}${queryString ? `?${queryString}` : ''}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  // Add Authorization header if API token is available
  if (API_TOKEN) {
    headers['Authorization'] = `Bearer ${API_TOKEN}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
    cache: 'no-store', // Disable cache for development
  })

  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.status}`)
  }

  return response.json()
}

// Transform Strapi product to our Product type
function transformProduct(strapiProduct: any): Product | null {
  if (!strapiProduct) {
    return null
  }

  // Strapi v5 returns flat data without attributes wrapper
  const data = strapiProduct

  // Handle images - Strapi v5 can have images as array or media field
  let productImages = []

  if (data.images && Array.isArray(data.images) && data.images.length > 0) {
    // Map all images from the images array
    productImages = data.images.map((img: any, index: number) => ({
      id: img.id?.toString() || img.documentId || `img-${index}`,
      url: getStrapiMedia(img.url) || '',
      alt: img.alternativeText || img.name || data.name,
      isPrimary: index === 0,
      order: index,
    }))
  } else if (data.imageUrl) {
    // Fallback to single imageUrl field if images array is empty
    productImages = [{
      id: '1',
      url: data.imageUrl,
      alt: data.name,
      isPrimary: true,
      order: 0,
    }]
  }

  return {
    id: data.id?.toString() || data.documentId,
    slug: data.slug || '',
    name: data.name || '',
    description: data.description || '',
    shortDescription: data.shortDescription || '',
    price: data.price ? parseFloat(data.price.toString()) : 0,
    salePrice: data.salePrice ? parseFloat(data.salePrice.toString()) : undefined,
    currency: data.currency || 'LKR',
    images: productImages,
    category: data.category ? {
      id: data.category.id?.toString() || data.category.documentId,
      slug: data.category.slug || '',
      name: data.category.name || '',
      description: data.category.description,
      image: data.category.image?.url
        ? getStrapiMedia(data.category.image.url)
        : (data.category.image && Array.isArray(data.category.image) && data.category.image.length > 0
          ? getStrapiMedia(data.category.image[0].url)
          : data.category.imageUrl),
    } : {
      id: '0',
      slug: 'uncategorized',
      name: 'Uncategorized',
    },
    brand: data.brand || '',
    sku: data.sku || '',
    inStock: data.inStock ?? true,
    stockQuantity: data.stockQuantity || 0,
    tags: data.tags || [],
    specifications: data.specifications || [],
    rating: data.rating,
    reviewCount: data.reviewCount || 0,
    featured: data.featured || false,
    isNew: data.isNew || false,
    isBestSeller: data.isBestSeller || false,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

// Transform Strapi category to our Category type
function transformCategory(strapiCategory: any): Category | null {
  if (!strapiCategory) {
    return null
  }

  // Strapi v5 returns flat data without attributes wrapper
  const data = strapiCategory

  // Handle category image - check for image object first, then imageUrl field
  let categoryImage = undefined

  if (data.image?.url) {
    categoryImage = getStrapiMedia(data.image.url)
  } else if (data.image && Array.isArray(data.image) && data.image.length > 0) {
    categoryImage = getStrapiMedia(data.image[0].url)
  } else if (data.imageUrl) {
    categoryImage = data.imageUrl
  }

  return {
    id: data.id?.toString() || data.documentId,
    slug: data.slug || '',
    name: data.name || '',
    description: data.description,
    image: categoryImage,
    order: data.order || 0,
  }
}

// API Functions

export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetchAPI('/products', {
      populate: ['images', 'category', 'category.image'],
      sort: ['featured:desc', 'createdAt:desc'],
    })

    return response.data.map(transformProduct).filter((p: Product | null) => p !== null)
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await fetchAPI('/products', {
      filters: { slug: { $eq: slug } },
      populate: ['images', 'category', 'category.image'],
    })

    if (response.data.length === 0) return null
    return transformProduct(response.data[0])
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  try {
    const response = await fetchAPI('/products', {
      filters: {
        category: {
          slug: { $eq: categorySlug },
        },
      },
      populate: ['images', 'category', 'category.image'],
    })

    return response.data.map(transformProduct).filter((p: Product | null) => p !== null)
  } catch (error) {
    console.error('Error fetching products by category:', error)
    return []
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const response = await fetchAPI('/products', {
      filters: { featured: { $eq: true } },
      populate: ['images', 'category', 'category.image'],
      pagination: { limit: 8 },
    })

    return response.data.map(transformProduct).filter((p: Product | null) => p !== null)
  } catch (error) {
    console.error('Error fetching featured products:', error)
    return []
  }
}

export async function getAllCategories(): Promise<Category[]> {
  try {
    const response = await fetchAPI('/categories', {
      populate: ['image'],
      sort: ['order:asc', 'name:asc'],
    })

    return response.data.map(transformCategory).filter((c: Category | null) => c !== null)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  try {
    const response = await fetchAPI('/categories', {
      filters: { slug: { $eq: slug } },
      populate: ['image'],
    })

    if (response.data.length === 0) return null
    return transformCategory(response.data[0])
  } catch (error) {
    console.error('Error fetching category:', error)
    return null
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const response = await fetchAPI('/products', {
      filters: {
        $or: [
          { name: { $containsi: query } },
          { description: { $containsi: query } },
          { brand: { $containsi: query } },
        ],
      },
      populate: ['images', 'category'],
    })

    return response.data.map(transformProduct).filter((p: Product | null) => p !== null)
  } catch (error) {
    console.error('Error searching products:', error)
    return []
  }
}
