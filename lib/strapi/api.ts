import qs from 'qs'
import type { Product, Category } from '@/types'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const API_URL = process.env.NEXT_PUBLIC_STRAPI_API_URL || 'http://localhost:1337/api'

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
async function fetchAPI(path: string, params = {}, options = {}) {
  const queryString = qs.stringify(params, {
    encodeValuesOnly: true,
  })

  const url = `${API_URL}${path}${queryString ? `?${queryString}` : ''}`

  const response = await fetch(url, {
    ...options,
    next: { revalidate: 60 }, // Revalidate every 60 seconds
  })

  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.status}`)
  }

  return response.json()
}

// Transform Strapi product to our Product type
function transformProduct(strapiProduct: any): Product {
  const data = strapiProduct.attributes
  const category = data.category?.data

  return {
    id: strapiProduct.id.toString(),
    slug: data.slug,
    name: data.name,
    description: data.description || '',
    shortDescription: data.shortDescription || '',
    price: parseFloat(data.price),
    salePrice: data.salePrice ? parseFloat(data.salePrice) : undefined,
    currency: 'USD',
    images: data.images?.data?.map((img: any, index: number) => ({
      id: img.id.toString(),
      url: getStrapiMedia(img.attributes.url) || '',
      alt: img.attributes.alternativeText || data.name,
      isPrimary: index === 0,
      order: index,
    })) || [],
    category: category ? {
      id: category.id.toString(),
      slug: category.attributes.slug,
      name: category.attributes.name,
      description: category.attributes.description,
      image: category.attributes.image?.data
        ? getStrapiMedia(category.attributes.image.data.attributes.url)
        : undefined,
    } : {
      id: '0',
      slug: 'uncategorized',
      name: 'Uncategorized',
    },
    brand: data.brand || '',
    sku: data.sku || '',
    inStock: data.inStock ?? true,
    stockQuantity: data.stockQuantity,
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
function transformCategory(strapiCategory: any): Category {
  const data = strapiCategory.attributes

  return {
    id: strapiCategory.id.toString(),
    slug: data.slug,
    name: data.name,
    description: data.description,
    image: data.image?.data
      ? getStrapiMedia(data.image.data.attributes.url)
      : undefined,
    order: data.order,
  }
}

// API Functions

export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await fetchAPI('/products', {
      populate: ['images', 'category', 'category.image'],
      sort: ['featured:desc', 'createdAt:desc'],
    })

    return response.data.map(transformProduct)
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

    return response.data.map(transformProduct)
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

    return response.data.map(transformProduct)
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

    return response.data.map(transformCategory)
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

    return response.data.map(transformProduct)
  } catch (error) {
    console.error('Error searching products:', error)
    return []
  }
}
