# Veloce Moto - Automotive Parts E-commerce Platform

A modern, high-performance e-commerce frontend built with Next.js 14, TypeScript, Tailwind CSS, and Zustand. Designed specifically for automotive parts businesses with CMS integration capabilities and Vercel deployment ready.

![Veloce Moto](https://i.ibb.co/Ps3HFYh4/veloce-moto-logo.png)

## Features

- **Modern Tech Stack**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **State Management**: Zustand for lightweight, persistent shopping cart
- **Responsive Design**: Mobile-first, fully responsive UI
- **CMS-Ready**: Type definitions and structure ready for headless CMS integration
- **E-commerce Features**:
  - Product catalog with categories
  - Advanced product filtering and sorting
  - Shopping cart with persistent storage
  - Product detail pages with specifications
  - Related products recommendations
  - Featured products and best sellers
- **Performance Optimized**:
  - Next.js Image optimization
  - Server-side rendering
  - Static generation where possible
- **SEO Optimized**:
  - Meta tags and Open Graph
  - Structured data ready
  - Semantic HTML
- **Developer Experience**:
  - TypeScript for type safety
  - ESLint for code quality
  - Clean component architecture

## Tech Stack

| Category | Tool/Service | Purpose |
|----------|-------------|---------|
| Frontend | Next.js 14 + TypeScript | React framework with App Router |
| Styling | Tailwind CSS | Utility-first CSS framework |
| State Management | Zustand | Lightweight state management |
| Icons | Lucide React | Modern icon library |
| **CMS** | **Strapi (Recommended)** | **Headless CMS - Full integration guide included** |
| CMS (Alternatives) | ButterCMS/Prismic/Sanity | Other headless CMS options |
| E-commerce (Ready) | Snipcart/Commerce.js | Cart & checkout integration |
| Payments (Ready) | Stripe/PayPal | Payment processing |
| Hosting | Vercel | Deployment platform |

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd veloce-moto
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration (CMS keys, payment keys, etc.)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎯 Connect to Strapi CMS (Recommended)

Strapi is an open-source headless CMS that's perfect for e-commerce. We've included a complete integration guide!

### Quick Start with Strapi

**Option 1: Automated Setup (Recommended)**

```bash
# Run the setup script
./scripts/setup-strapi.sh
```

**Option 2: Manual Setup**

```bash
# In a separate terminal/directory
cd ..
npx create-strapi-app@latest veloce-moto-backend --quickstart

# Start Strapi
cd veloce-moto-backend
npm run develop
```

### Complete Integration Guide

Follow the comprehensive **[STRAPI_INTEGRATION_GUIDE.md](./STRAPI_INTEGRATION_GUIDE.md)** which covers:

1. ✅ Setting up Strapi backend
2. ✅ Creating Product and Category content types
3. ✅ Configuring permissions
4. ✅ Connecting frontend to Strapi
5. ✅ Adding sample data
6. ✅ Deployment guide

**Key Benefits:**
- Free and open-source
- Self-hosted (full control)
- Easy-to-use admin panel
- Built-in media library
- REST & GraphQL APIs
- No vendor lock-in

The frontend is **already configured** with Strapi utilities in `lib/strapi/api.ts`!

## Project Structure

```
veloce-moto/
├── app/                        # Next.js App Router
│   ├── layout.tsx             # Root layout with header/footer
│   ├── page.tsx               # Homepage
│   ├── products/              # All products page
│   ├── product/[slug]/        # Individual product pages
│   ├── category/[slug]/       # Category pages
│   ├── cart/                  # Shopping cart page
│   └── globals.css            # Global styles
├── components/                 # React components
│   ├── Header.tsx             # Header with navigation
│   ├── Footer.tsx             # Footer component
│   └── ProductCard.tsx        # Product card component
├── lib/                       # Utilities and stores
│   ├── store/
│   │   └── cartStore.ts      # Zustand cart store
│   └── mockData.ts           # Mock product data
├── types/                     # TypeScript type definitions
│   └── index.ts              # CMS-ready type definitions
├── public/                    # Static assets
├── tailwind.config.ts         # Tailwind configuration
├── tsconfig.json             # TypeScript configuration
├── next.config.js            # Next.js configuration
└── vercel.json               # Vercel deployment config
```

## CMS Integration

The project is structured to easily integrate with headless CMS solutions. All types are defined in `types/index.ts` and are compatible with:

### ButterCMS Integration

1. Install the ButterCMS SDK:
```bash
npm install buttercms
```

2. Configure in `.env.local`:
```env
NEXT_PUBLIC_BUTTER_CMS_API_KEY=your_api_key
```

3. Create a data fetching utility in `lib/cms/buttercms.ts`:
```typescript
import Butter from 'buttercms'

const butter = Butter(process.env.NEXT_PUBLIC_BUTTER_CMS_API_KEY!)

export async function getProducts() {
  const response = await butter.content.retrieve(['products'])
  return response.data.data.products
}
```

### Prismic Integration

1. Install Prismic SDK:
```bash
npm install @prismicio/client @prismicio/next
```

2. Configure in `.env.local`:
```env
PRISMIC_REPOSITORY_NAME=your_repository
PRISMIC_ACCESS_TOKEN=your_token
```

### Sanity Integration

1. Install Sanity client:
```bash
npm install @sanity/client next-sanity
```

2. Configure in `.env.local`:
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
```

## E-commerce Integration

### Snipcart Integration

1. Install Snipcart:
```bash
npm install @snipcart/nextjs-snipcart
```

2. Add your API key to `.env.local`:
```env
NEXT_PUBLIC_SNIPCART_API_KEY=your_api_key
```

### Stripe Integration

1. Install Stripe:
```bash
npm install @stripe/stripe-js stripe
```

2. Configure in `.env.local`:
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_publishable_key
STRIPE_SECRET_KEY=your_secret_key
```

## Deployment

### Deploy to Vercel

The project is optimized for Vercel deployment:

1. Install Vercel CLI (optional):
```bash
npm install -g vercel
```

2. Deploy:
```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

### Environment Variables on Vercel

Add these environment variables in your Vercel project settings:
- `NEXT_PUBLIC_SITE_URL`: Your production URL
- CMS API keys
- Payment gateway keys
- Analytics IDs

### Build Command
```bash
npm run build
```

### Output Directory
```
.next
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Customization

### Branding

Update the following:
- Logo URL in `app/layout.tsx` and components
- Colors in `tailwind.config.ts`
- Site metadata in `app/layout.tsx`

### Adding Products

Currently using mock data in `lib/mockData.ts`. Replace with CMS integration:

1. Create CMS data fetching utilities
2. Update pages to fetch from CMS
3. Replace mock data imports with CMS calls

### Styling

Customize Tailwind theme in `tailwind.config.ts`:
- Brand colors
- Fonts
- Spacing
- Breakpoints

## Performance Optimization

- **Image Optimization**: Using Next.js Image component
- **Code Splitting**: Automatic with Next.js App Router
- **Lazy Loading**: Components and images load on demand
- **Caching**: Configured for Vercel Edge Network

## SEO Best Practices

- Meta tags configured in layouts
- Open Graph tags for social sharing
- Semantic HTML structure
- Sitemap generation ready
- Structured data ready for implementation

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email support@velocemoto.com or open an issue in the repository.

## Roadmap

- [ ] User authentication
- [ ] Order management
- [ ] Customer reviews
- [ ] Wishlist functionality
- [ ] Advanced search with filters
- [ ] Blog integration
- [ ] Multi-language support
- [ ] Dark mode

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)
- [Lucide Icons](https://lucide.dev/)
