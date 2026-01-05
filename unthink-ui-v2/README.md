# Unthink UI - Next.js Migration

This directory contains the **Next.js version** of the Unthink UI web client, migrated from Gatsby.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
# Copy from Gatsby project
cp ../web-client-gatsby/.env .env.local

# Update variables with NEXT_PUBLIC_ prefix where needed
# See .env.local file for instructions
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

### 4. Build for Production
```bash
npm run build
npm start
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |

## Project Structure

```
pages/              # Next.js page routes (file-based routing)
├── _app.js         # App wrapper (replaced gatsby-browser.js wrapRootElement)
├── _document.js    # Global HTML structure
├── index.js        # Home page
├── 404.js          # Custom 404 page
└── api/            # Optional: Backend API routes

src/                # Source code (unchanged from Gatsby)
├── components/     # Reusable React components
├── context/        # React context providers
├── state/          # Redux setup
├── helper/         # Utility functions
├── style/          # CSS/SCSS files
├── images/         # Static images
└── pageComponents/ # Page-specific components

public/             # Static assets
next.config.js      # Next.js configuration
.env.local          # Environment variables (local only)
package.json        # Dependencies
```

## Migration Resources

- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Complete migration guide from Gatsby to Next.js
- **[MIGRATION_PATTERNS.js](./MIGRATION_PATTERNS.js)** - Code examples for common patterns
- **[pages/index-example.js](./pages/index-example.js)** - Example page component
- **[pages/product-example/[id]-example.js](./pages/product-example/[id]-example.js)** - Example dynamic page

## Key Differences from Gatsby

### Routing
- **Same as Gatsby!** File-based routing works identically
- `pages/index.js` → home page
- `pages/about.js` → /about
- `pages/product/[id].js` → /product/123

### Environment Variables
- Variables must use `NEXT_PUBLIC_` prefix to be accessible in the browser
- Server-only variables (in `getStaticProps`/`getServerSideProps`) don't need the prefix

### Data Fetching
- **getStaticProps** - Static generation at build time (like Gatsby)
- **getServerSideProps** - Server-side rendering on each request
- **ISR (Incremental Static Regeneration)** - Revalidate static pages at runtime

### Styling
- Tailwind, SASS, and Ant Design all work the same as Gatsby
- Import global styles in `pages/_app.js`
- CSS/SCSS modules work identically

### Components & Context
- React components, context, hooks all work the same
- No changes needed for Redux, context providers, etc.

## Dependencies Removed from Gatsby

These Gatsby plugins are **not needed** in Next.js:
- `gatsby-plugin-force-trailing-slashes` → Use `trailingSlash: true` in next.config.js
- `gatsby-plugin-manifest` → Manual public/manifest.json
- `gatsby-plugin-offline` → Use next-pwa if PWA support needed
- `gatsby-plugin-google-gtag` → Manual gtag setup in _document.js
- All other `gatsby-plugin-*` packages

## Common Tasks

### Add a New Page
Create a new file in `pages/`:
```javascript
// pages/about.js
export default function About() {
  return <h1>About Us</h1>;
}
```

### Create a Dynamic Page
Create a file with brackets in `pages/`:
```javascript
// pages/post/[id].js
import { useRouter } from 'next/router';

export default function Post() {
  const router = useRouter();
  const { id } = router.query;
  return <h1>Post {id}</h1>;
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { id: '1' } },
      { params: { id: '2' } },
    ],
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  return { props: { id: params.id }, revalidate: 3600 };
}
```

### Add an API Route
Create a file in `pages/api/`:
```javascript
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello' });
}
```

### Import SVG as React Component
SVG to React component import is already configured:
```javascript
import MyIcon from '../public/icons/my-icon.svg';

export default function MyComponent() {
  return <MyIcon className="w-6 h-6" />;
}
```

## Troubleshooting

### Images not loading
- Use `next/image` component with proper `width`/`height` attributes
- Or use `fill` prop for flexible sizing

### Styles not applying
- Make sure global styles are imported in `pages/_app.js`
- Check that SCSS files are in correct location

### Environment variables undefined
- Prefix browser-accessible variables with `NEXT_PUBLIC_` in `.env.local`
- Only server-only variables need regular names

### Build fails
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## Performance Tips

1. **Use `next/image`** for all images - provides automatic optimization
2. **Enable ISR** in `getStaticProps` for frequently changing content
3. **Use dynamic imports** for heavy components:
   ```javascript
   const HeavyComponent = dynamic(() => import('../components/Heavy'));
   ```
4. **Optimize CSS** - Tailwind PurgeCSS is already configured
5. **Monitor bundle size** - Use `npm run analyze` (after configuring)

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import repository
4. Set environment variables in dashboard
5. Deploy

### Docker
Update your existing Dockerfile for Next.js:
```dockerfile
FROM node:16-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

FROM node:16-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

### Other Hosting
See [Next.js deployment documentation](https://nextjs.org/docs/deployment)

## Links & Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js API Reference](https://nextjs.org/docs/api-reference)
- [Vercel Deployment](https://vercel.com)
- [Complete Migration Guide](./MIGRATION_GUIDE.md)

## Support

For issues or questions about the migration:
1. Check [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)
2. Check [MIGRATION_PATTERNS.js](./MIGRATION_PATTERNS.js)
3. Review [Next.js Documentation](https://nextjs.org/docs)
4. Check existing GitHub issues

---

**Version**: 3.0.0 (Next.js)  
**Last Updated**: December 2025
