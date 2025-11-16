# CMS Integration Guide for Veloce Moto

This guide provides detailed instructions for integrating various headless CMS solutions with Veloce Moto.

## Overview

Veloce Moto is built with CMS-agnostic type definitions in `types/index.ts`. This allows you to connect to any headless CMS while maintaining type safety.

## Supported CMS Options

### 1. ButterCMS (Recommended for Simplicity)

**Pros:**
- Simple setup
- Great documentation
- Built-in e-commerce features
- No infrastructure management

**Setup Steps:**

1. **Create a ButterCMS account** at [buttercms.com](https://buttercms.com)

2. **Install the SDK:**
```bash
npm install buttercms
```

3. **Create `lib/cms/buttercms.ts`:**
```typescript
import Butter from 'buttercms'
import type { Product, Category } from '@/types'

const butter = Butter(process.env.NEXT_PUBLIC_BUTTER_CMS_API_KEY!)

export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await butter.content.retrieve(['products'])
    return response.data.data.products
  } catch (error) {
    console.error('Error fetching products:', error)
    return []
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const response = await butter.content.retrieve(['products'], {
      'fields.slug': slug
    })
    return response.data.data.products[0] || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

export async function getCategories(): Promise<Category[]> {
  try {
    const response = await butter.content.retrieve(['categories'])
    return response.data.data.categories
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}
```

4. **Update your pages to use ButterCMS:**
```typescript
// In app/products/page.tsx
import { getAllProducts } from '@/lib/cms/buttercms'

export default async function ProductsPage() {
  const products = await getAllProducts()
  // ... rest of component
}
```

### 2. Prismic

**Pros:**
- Powerful slice machine
- Great for content modeling
- Excellent preview features

**Setup Steps:**

1. **Create a Prismic repository** at [prismic.io](https://prismic.io)

2. **Install dependencies:**
```bash
npm install @prismicio/client @prismicio/next
```

3. **Create `prismicio.ts` in root:**
```typescript
import * as prismic from '@prismicio/client'

export const repositoryName = process.env.PRISMIC_REPOSITORY_NAME!

export const client = prismic.createClient(repositoryName, {
  accessToken: process.env.PRISMIC_ACCESS_TOKEN,
})
```

4. **Create content types in Prismic:**
   - Product
   - Category
   - Match fields with `types/index.ts`

5. **Create data fetching utilities:**
```typescript
// lib/cms/prismic.ts
import { client } from '@/prismicio'
import type { Product } from '@/types'

export async function getAllProducts(): Promise<Product[]> {
  const products = await client.getAllByType('product')
  return products.map(transformPrismicProduct)
}

function transformPrismicProduct(doc: any): Product {
  return {
    id: doc.id,
    slug: doc.uid,
    name: doc.data.name,
    description: doc.data.description,
    price: doc.data.price,
    // ... map other fields
  }
}
```

### 3. Sanity

**Pros:**
- Highly customizable
- Real-time collaboration
- Powerful GROQ query language
- Self-hosted option

**Setup Steps:**

1. **Create a Sanity project:**
```bash
npm create sanity@latest
```

2. **Install client:**
```bash
npm install @sanity/client next-sanity
```

3. **Create `lib/sanity/client.ts`:**
```typescript
import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: true,
})
```

4. **Define schemas in Sanity Studio:**
```typescript
// sanity/schemas/product.ts
export default {
  name: 'product',
  type: 'document',
  fields: [
    { name: 'name', type: 'string', title: 'Name' },
    { name: 'slug', type: 'slug', options: { source: 'name' } },
    { name: 'description', type: 'text' },
    { name: 'price', type: 'number' },
    { name: 'salePrice', type: 'number' },
    { name: 'images', type: 'array', of: [{ type: 'image' }] },
    // ... other fields
  ]
}
```

5. **Create GROQ queries:**
```typescript
// lib/cms/sanity.ts
import { client } from '@/lib/sanity/client'
import type { Product } from '@/types'

const productQuery = `*[_type == "product"] {
  _id,
  slug,
  name,
  description,
  price,
  salePrice,
  "images": images[]{
    "url": asset->url,
    alt
  },
  category->{
    _id,
    name,
    slug
  },
  brand,
  sku,
  inStock,
  stockQuantity,
  specifications,
  rating,
  reviewCount,
  featured,
  isNew,
  isBestSeller
}`

export async function getAllProducts(): Promise<Product[]> {
  return await client.fetch(productQuery)
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const query = `*[_type == "product" && slug.current == $slug][0]`
  return await client.fetch(query, { slug })
}
```

### 4. Contentful

**Pros:**
- Enterprise-grade
- Extensive API
- Great documentation

**Setup Steps:**

1. **Create Contentful space** at [contentful.com](https://contentful.com)

2. **Install SDK:**
```bash
npm install contentful
```

3. **Create `lib/cms/contentful.ts`:**
```typescript
import { createClient } from 'contentful'
import type { Product } from '@/types'

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

export async function getAllProducts(): Promise<Product[]> {
  const entries = await client.getEntries({ content_type: 'product' })
  return entries.items.map(transformContentfulProduct)
}

function transformContentfulProduct(entry: any): Product {
  const fields = entry.fields
  return {
    id: entry.sys.id,
    slug: fields.slug,
    name: fields.name,
    description: fields.description,
    price: fields.price,
    // ... map other fields
  }
}
```

## Migration from Mock Data

To migrate from mock data to CMS:

1. **Keep mock data as fallback:**
```typescript
// lib/data.ts
import { getAllProducts as getCMSProducts } from '@/lib/cms/your-cms'
import { products as mockProducts } from '@/lib/mockData'

export async function getAllProducts() {
  try {
    const products = await getCMSProducts()
    return products.length > 0 ? products : mockProducts
  } catch (error) {
    console.error('CMS Error:', error)
    return mockProducts
  }
}
```

2. **Update all page imports** to use the new data fetching utilities

3. **Test thoroughly** before removing mock data

## Content Modeling Best Practices

### Product Content Type

Required fields:
- Name (text)
- Slug (slug/text)
- Description (rich text/markdown)
- Price (number)
- Images (media/array)
- Category (reference)
- Brand (text)
- SKU (text)
- Stock status (boolean)

Optional fields:
- Sale price (number)
- Short description (text)
- Specifications (structured data)
- Vehicle compatibility (structured data)
- Tags (array)
- Featured (boolean)
- New (boolean)
- Best seller (boolean)

### Category Content Type

Required fields:
- Name (text)
- Slug (slug/text)

Optional fields:
- Description (text)
- Image (media)
- Parent category (reference)
- Order (number)

## Image Optimization with CMS

When using images from CMS, use Next.js Image component:

```typescript
import Image from 'next/image'

// For external CMS images, add domain to next.config.js
<Image
  src={product.images[0].url}
  alt={product.images[0].alt}
  width={800}
  height={800}
  className="object-cover"
/>
```

Update `next.config.js`:
```javascript
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.buttercms.com', // or your CMS CDN
      },
    ],
  },
}
```

## Caching Strategies

### Static Generation (Recommended)

```typescript
// app/products/page.tsx
export const revalidate = 3600 // Revalidate every hour

export default async function ProductsPage() {
  const products = await getAllProducts()
  return <ProductsView products={products} />
}
```

### Incremental Static Regeneration

```typescript
export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map((product) => ({
    slug: product.slug,
  }))
}

export const dynamicParams = true
export const revalidate = 3600
```

## Webhooks for Real-time Updates

Set up webhooks in your CMS to trigger Vercel rebuilds:

1. **In Vercel**, create a Deploy Hook
2. **In your CMS**, add the webhook URL
3. Configure to trigger on content publish/update

## Testing CMS Integration

Create a test script:

```typescript
// scripts/test-cms.ts
import { getAllProducts, getCategories } from '@/lib/cms/your-cms'

async function test() {
  console.log('Testing CMS connection...')

  const products = await getAllProducts()
  console.log(`✓ Fetched ${products.length} products`)

  const categories = await getCategories()
  console.log(`✓ Fetched ${categories.length} categories`)

  console.log('CMS integration working!')
}

test()
```

Run with:
```bash
npx tsx scripts/test-cms.ts
```

## Support

For CMS-specific issues:
- ButterCMS: [docs.buttercms.com](https://buttercms.com/docs/)
- Prismic: [prismic.io/docs](https://prismic.io/docs)
- Sanity: [sanity.io/docs](https://sanity.io/docs)
- Contentful: [contentful.com/developers](https://contentful.com/developers)
