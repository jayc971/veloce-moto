# Strapi Integration Guide for Veloce Moto

This guide will walk you through connecting your Veloce Moto Next.js frontend with Strapi headless CMS.

## Why Strapi?

- **Open Source**: Self-hosted, full control over your data
- **Flexible**: Customizable content types
- **REST & GraphQL**: Both API types supported
- **Media Library**: Built-in image management
- **User-friendly**: Easy-to-use admin panel
- **Free**: No licensing costs

## Step 1: Set Up Strapi Backend

### Install Strapi

In a separate directory (not in your frontend folder):

```bash
# Navigate to parent directory
cd /home/user

# Create Strapi project
npx create-strapi-app@latest veloce-moto-backend --quickstart

# This will create a new folder and install Strapi
# Choose SQLite for development (or PostgreSQL for production)
```

The Strapi admin panel will automatically open at `http://localhost:1337/admin`

### Create Admin User

When Strapi opens, create your first admin user:
- Email: your@email.com
- Password: (choose a strong password)

## Step 2: Create Content Types in Strapi

### 2.1 Create Product Content Type

1. Go to **Content-Type Builder** (left sidebar)
2. Click **"Create new collection type"**
3. Name it **"Product"**
4. Add the following fields:

**Text Fields:**
- `name` (Short text, required)
- `slug` (UID, attached to name, required, unique)
- `description` (Long text)
- `shortDescription` (Text)
- `brand` (Short text)
- `sku` (Short text, required, unique)

**Number Fields:**
- `price` (Decimal, required)
- `salePrice` (Decimal)
- `stockQuantity` (Integer)
- `rating` (Decimal, min: 0, max: 5)
- `reviewCount` (Integer)

**Boolean Fields:**
- `inStock` (Boolean, default: true)
- `featured` (Boolean)
- `isNew` (Boolean)
- `isBestSeller` (Boolean)

**Relation:**
- `category` (Relation: Many Products to One Category)

**Media:**
- `images` (Media, multiple files allowed)

**JSON Fields:**
- `specifications` (JSON)
- `tags` (JSON)

4. Click **Save** and wait for server restart

### 2.2 Create Category Content Type

1. Click **"Create new collection type"**
2. Name it **"Category"**
3. Add fields:

- `name` (Short text, required)
- `slug` (UID, attached to name, required, unique)
- `description` (Text)
- `image` (Media, single file)
- `order` (Integer)
- `products` (Relation: One Category to Many Products)

4. Click **Save**

## Step 3: Configure Strapi Permissions

1. Go to **Settings** → **Roles** → **Public**
2. Enable the following permissions:

**Product:**
- `find` ✓
- `findOne` ✓

**Category:**
- `find` ✓
- `findOne` ✓

**Upload:**
- `find` ✓
- `findOne` ✓

3. Click **Save**

## Step 4: Add Sample Data

1. Go to **Content Manager** → **Product**
2. Click **"Create new entry"**
3. Fill in product details (use data from `lib/mockData.ts` as reference)
4. Upload product images
5. Select category
6. Click **Save** and **Publish**

Repeat for categories and more products.

## Step 5: Install Strapi Client in Frontend

In your Veloce Moto frontend project:

```bash
cd /home/user/veloce-moto
npm install qs
```

## Step 6: Configure Environment Variables

Update `.env.local`:

```env
# Strapi Configuration
NEXT_PUBLIC_STRAPI_URL=http://localhost:1337
NEXT_PUBLIC_STRAPI_API_URL=http://localhost:1337/api
```

For production:
```env
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-domain.com
NEXT_PUBLIC_STRAPI_API_URL=https://your-strapi-domain.com/api
```

## Step 7: Create Strapi API Utilities

Create `lib/strapi/api.ts`:

```typescript
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
    tags: data.tags ? JSON.parse(data.tags) : [],
    specifications: data.specifications ? JSON.parse(data.specifications) : [],
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
```

## Step 8: Update Frontend Pages to Use Strapi

### Update Homepage (`app/page.tsx`):

```typescript
import { getFeaturedProducts, getAllCategories } from '@/lib/strapi/api'

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getAllCategories(),
  ])

  return (
    // ... rest of your component
    // Use featuredProducts and categories instead of mock data
  )
}
```

### Update Products Page (`app/products/page.tsx`):

```typescript
import { getAllProducts, getAllCategories } from '@/lib/strapi/api'

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ])

  // ... rest of your component
}
```

### Update Product Detail Page (`app/product/[slug]/page.tsx`):

```typescript
import { getProductBySlug, getAllProducts } from '@/lib/strapi/api'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductPage({
  params
}: {
  params: { slug: string }
}) {
  const product = await getProductBySlug(params.slug)

  if (!product) {
    notFound()
  }

  // ... rest of your component
}
```

### Update Category Page (`app/category/[slug]/page.tsx`):

```typescript
import { getCategoryBySlug, getProductsByCategory } from '@/lib/strapi/api'

export default async function CategoryPage({
  params
}: {
  params: { slug: string }
}) {
  const [category, products] = await Promise.all([
    getCategoryBySlug(params.slug),
    getProductsByCategory(params.slug),
  ])

  if (!category) {
    notFound()
  }

  // ... rest of your component
}
```

## Step 9: Update Next.js Config for Strapi Images

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'your-strapi-domain.com',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
```

## Step 10: Test the Integration

1. **Start Strapi backend:**
```bash
cd /home/user/veloce-moto-backend
npm run develop
```

2. **In another terminal, start Next.js frontend:**
```bash
cd /home/user/veloce-moto
npm run dev
```

3. Visit `http://localhost:3000` - you should see data from Strapi!

## Deployment

### Deploy Strapi

**Option 1: Railway**
```bash
# In Strapi project
railway login
railway init
railway up
```

**Option 2: Heroku**
```bash
# Follow Strapi Heroku deployment guide
```

**Option 3: DigitalOcean/AWS**
- Use their one-click Strapi installation

### Deploy Next.js to Vercel

Update environment variables in Vercel:
```
NEXT_PUBLIC_STRAPI_URL=https://your-strapi-production-url.com
NEXT_PUBLIC_STRAPI_API_URL=https://your-strapi-production-url.com/api
```

## Advanced Features

### 1. Add Search Functionality

```typescript
export async function searchProducts(query: string): Promise<Product[]> {
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
}
```

### 2. Add Filtering

```typescript
export async function getProductsFiltered(filters: {
  category?: string
  minPrice?: number
  maxPrice?: number
  inStock?: boolean
}): Promise<Product[]> {
  const strapiFilters: any = {}

  if (filters.category) {
    strapiFilters.category = { slug: { $eq: filters.category } }
  }
  if (filters.minPrice !== undefined) {
    strapiFilters.price = { $gte: filters.minPrice }
  }
  if (filters.maxPrice !== undefined) {
    strapiFilters.price = { ...strapiFilters.price, $lte: filters.maxPrice }
  }
  if (filters.inStock !== undefined) {
    strapiFilters.inStock = { $eq: filters.inStock }
  }

  const response = await fetchAPI('/products', {
    filters: strapiFilters,
    populate: ['images', 'category'],
  })

  return response.data.map(transformProduct)
}
```

### 3. Add Pagination

```typescript
export async function getProducts(page: number = 1, pageSize: number = 12) {
  const response = await fetchAPI('/products', {
    populate: ['images', 'category'],
    pagination: {
      page,
      pageSize,
    },
  })

  return {
    products: response.data.map(transformProduct),
    pagination: response.meta.pagination,
  }
}
```

## Troubleshooting

### CORS Issues
Add to Strapi `config/middlewares.js`:
```javascript
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'media-src': ["'self'", 'data:', 'blob:', 'https:'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
]
```

### Image Not Loading
- Check Strapi permissions (Upload → find, findOne)
- Verify `next.config.js` has correct domain
- Check image URL in browser developer tools

### Data Not Showing
- Verify content is published in Strapi
- Check public permissions are enabled
- Look at browser console for errors
- Check API response in Network tab

## Best Practices

1. **Use ISR (Incremental Static Regeneration)**
```typescript
export const revalidate = 60 // Revalidate every 60 seconds
```

2. **Error Handling**
Always have fallback data or error states

3. **Image Optimization**
Use Next.js Image component with Strapi images

4. **Caching**
Configure proper cache headers in Strapi

5. **Security**
- Use environment variables for API URLs
- Enable only necessary permissions
- Use HTTPS in production
- Keep Strapi updated

## Resources

- [Strapi Documentation](https://docs.strapi.io/)
- [Next.js with Strapi Tutorial](https://strapi.io/blog/nextjs-13)
- [Strapi REST API](https://docs.strapi.io/dev-docs/api/rest)
