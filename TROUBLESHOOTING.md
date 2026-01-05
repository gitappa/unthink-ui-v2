# Common Migration Issues & Solutions

Quick reference for common problems during Gatsby → Next.js migration.

## 🚨 Critical Issues

### Issue 1: Images Not Displaying

**Error**: Images show as 404 or don't load

**Solution**:
```javascript
// ❌ Don't do this (Gatsby way):
import { GatsbyImage, getImage } from "gatsby-plugin-image"
<GatsbyImage image={getImage(img)} alt="test" />

// ✅ Do this (Next.js way):
import Image from 'next/image'

// Option 1: Known dimensions
<Image src="/path/to/image.jpg" alt="test" width={200} height={200} />

// Option 2: Unknown dimensions (responsive)
<div style={{ position: 'relative', width: '100%', height: '300px' }}>
  <Image src="/path/to/image.jpg" alt="test" fill style={{ objectFit: 'cover' }} />
</div>


**Tip**: All images must be in `public/` folder for static paths

---

### Issue 2: Environment Variables Undefined

**Error**: `process.env.MY_VAR` is undefined in browser

**Solution**:
```bash
# In .env.local, prefix with NEXT_PUBLIC_ for browser access:
NEXT_PUBLIC_GA_TRACKING_ID=your_id  # ✅ Available in browser
SECRET_API_KEY=secret               # ✅ Server-only, safe

# In code:
console.log(process.env.NEXT_PUBLIC_GA_TRACKING_ID) // ✅ Works
console.log(process.env.SECRET_API_KEY)              // ❌ Undefined in browser
```

**Note**: Server-only vars work in `getStaticProps`, `getServerSideProps`, API routes

---

### Issue 3: Link Navigation Not Working

**Error**: Links work but page doesn't load correctly

**Solution**:
```javascript
// ❌ Don't do this (Gatsby way):
import { Link } from 'gatsby'
<Link to="/about">About</Link>

// ✅ Do this (Next.js way):
import Link from 'next/link'
<Link href="/about">About</Link>

// With query string:
<Link href={`/product/${id}`}>Product</Link>
<Link href={{ pathname: '/search', query: { q: 'test' } }}>Search</Link>
```

---

### Issue 4: Styles Not Applying

**Error**: CSS/SCSS not being applied to components

**Solution**:

**Option 1: Global Styles** - Must be in `pages/_app.js`:
```javascript
// pages/_app.js
import '../src/style/global.scss'
import '../src/style/index.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}
```

**Option 2: CSS Modules** - Works in any component:
```javascript
// MyComponent.module.scss exists
import styles from './MyComponent.module.scss'

export default function MyComponent() {
  return <div className={styles.container}>Test</div>
}
```

**Option 3: Tailwind Classes** - Works everywhere:
```javascript
<div className="flex justify-center bg-blue-500">Works</div>
```

**Check**:
- [ ] Global styles imported in `_app.js`
- [ ] `postcss.config.js` exists and has tailwindcss
- [ ] `tailwind.config.js` has correct content paths
- [ ] CSS module filename ends with `.module.css` or `.module.scss`

---

### Issue 5: Dynamic Pages Not Generating

**Error**: `[id].js` pages show 404 or fallback page

**Solution**:

Add `getStaticPaths` to your dynamic page:

```javascript
// pages/product/[id].js

export default function ProductPage({ product }) {
  return <h1>{product.name}</h1>
}

// Required for static generation
export async function getStaticPaths() {
  // Fetch all product IDs
  const products = await fetch('https://api.example.com/products')
    .then(r => r.json())
  
  // Generate paths like: /product/1, /product/2, etc
  const paths = products.map(p => ({
    params: { id: p.id.toString() }
  }))

  return {
    paths,
    fallback: true  // ✅ Enable ISR for new products
  }
}

export async function getStaticProps({ params }) {
  const product = await fetch(`https://api.example.com/products/${params.id}`)
    .then(r => r.json())
  
  return {
    props: { product },
    revalidate: 3600  // Revalidate every hour
  }
}
```

**Note**: Without `getStaticPaths`, dynamic routes won't work in production

---

### Issue 6: GraphQL Queries Not Supported

**Error**: `useStaticQuery` or `graphql` tag not working

**Solution**:

Next.js doesn't have built-in GraphQL support. Replace with API calls:

```javascript
// ❌ Gatsby way (doesn't work in Next.js):
import { useStaticQuery, graphql } from 'gatsby'
const data = useStaticQuery(graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`)

// ✅ Next.js way - server-side rendering:
export async function getStaticProps() {
  const response = await fetch('https://api.example.com/site-metadata')
  const data = await response.json()
  
  return {
    props: { title: data.title },
    revalidate: 3600
  }
}

export default function Page({ title }) {
  return <h1>{title}</h1>
}

// ✅ Or client-side fetching:
import { useEffect, useState } from 'react'

export default function Page() {
  const [data, setData] = useState(null)
  
  useEffect(() => {
    fetch('https://api.example.com/site-metadata')
      .then(r => r.json())
      .then(setData)
  }, [])
  
  return <h1>{data?.title}</h1>
}
```

---

## ⚠️ Common Issues

### Issue 7: Components Not Re-rendering

**Error**: State updates don't trigger re-renders

**Solution**:
```javascript
// ✅ Make sure you're using React hooks correctly
import { useState, useEffect } from 'react'

export default function Component() {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    // Side effects here
  }, [])
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  )
}
```

**Check**:
- [ ] Using `useState` for state
- [ ] Using `useEffect` for side effects
- [ ] Dependencies array in useEffect if needed
- [ ] No direct state mutations

---

### Issue 8: API Routes Not Working

**Error**: `/api/` routes return 404

**Solution**:

Create files in `pages/api/`:

```javascript
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello' })
}

// Access at: http://localhost:3000/api/hello
```

**Check**:
- [ ] File is in `pages/api/` folder
- [ ] Function exported as default
- [ ] Function receives `(req, res)`
- [ ] Response is sent with `res.json()`, `res.send()`, etc

---

### Issue 9: Build Fails with "Module Not Found"

**Error**: Build shows "Cannot find module 'X'"

**Solution**:
```bash
# Clear build cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules
npm install

# Try build again
npm run build
```

**Check**:
- [ ] All imports use correct relative paths
- [ ] Files actually exist at those paths
- [ ] No circular imports
- [ ] Check capitalization (macOS is case-insensitive but build might not be)

---

### Issue 10: Context/Redux Not Available

**Error**: Context values undefined in components

**Solution**:

Ensure providers are in `pages/_app.js`:

```javascript
// pages/_app.js
import MyContextProvider from '../src/context/myContext'
import MyReduxProvider from '../src/state/reduxWrapper'

function MyApp({ Component, pageProps }) {
  return (
    <MyReduxProvider>
      <MyContextProvider>
        <Component {...pageProps} />
      </MyContextProvider>
    </MyReduxProvider>
  )
}

export default MyApp
```

**Check**:
- [ ] Provider wraps `<Component />`
- [ ] Provider imported correctly
- [ ] No typos in context hook names
- [ ] Consumer components are children of provider

---

## 🐛 Edge Cases

### Issue 11: Trailing Slash Behavior

**Problem**: Routes with/without trailing slash behave differently

**Solution**:

Already configured in `next.config.js`:
```javascript
trailingSlash: true  // All routes end with /
```

No action needed! Routes will automatically redirect.

---

### Issue 12: Hydration Mismatch Errors

**Error**: "Hydration failed because initial UI does not match"

**Cause**: Server and browser render different content

**Solution**:
```javascript
import { useEffect, useState } from 'react'

export default function Component() {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) return null
  
  // Browser-only content
  return <div>{typeof window !== 'undefined' && 'Client content'}</div>
}
```

**Check**:
- [ ] No `Math.random()`, `Date.now()` in render
- [ ] No `typeof window` in server-side code
- [ ] No timezone-dependent content without useEffect
- [ ] Data matches between server and browser

---

### Issue 13: Image Optimization Issues

**Problem**: Images very large, slow loading, or build fails

**Solution**:
```javascript
// Use unoptimized for external images
import Image from 'next/image'

<Image 
  src="https://external-cdn.com/image.jpg"
  alt="test"
  width={200}
  height={200}
  unoptimized  // ✅ For external sources
/>

// Or configure in next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'external-cdn.com',
      },
    ],
  },
}
```

---

### Issue 14: Performance Issues

**Problem**: Build slow or runtime performance bad

**Solutions**:

```javascript
// Use dynamic imports for heavy components
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(
  () => import('../components/Heavy'),
  { loading: () => <p>Loading...</p> }
)

export default function Page() {
  return <HeavyComponent />
}
```

**Optimizations**:
- [ ] Use ISR instead of SSR when possible
- [ ] Use dynamic imports for large components
- [ ] Optimize images with next/image
- [ ] Remove unused dependencies
- [ ] Check bundle size with `npm run build`

---

## 🔧 Debugging Tips

### Enable Debug Output
```bash
DEBUG=* npm run build
```

### Check Build Details
```bash
npm run build -- --debug
```

### Analyze Bundle Size
```bash
npm install --save-dev @next/bundle-analyzer

# Update next.config.js:
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer({})

# Run:
ANALYZE=true npm run build
```

### Test Production Build Locally
```bash
npm run build
npm start
# Test at http://localhost:3000
```

---

## 📞 Quick Reference Commands

```bash
# Development
npm run dev                      # Start dev server

# Production
npm run build                    # Build
npm start                        # Start production server

# Debugging
npm run build -- --debug         # Build with debug output
npm run lint                     # Check for linting errors

# Cleanup
rm -rf .next                     # Clear Next.js build cache
rm -rf node_modules && npm install  # Reinstall dependencies

# Advanced
ANALYZE=true npm run build       # Analyze bundle size
NODE_OPTIONS=--max_old_space_size=4096 npm run build  # Increase memory
```

---

## Still Stuck?

1. Check the [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) for detailed explanations
2. Review [MIGRATION_PATTERNS.js](./MIGRATION_PATTERNS.js) for code examples
3. Check [Next.js Docs](https://nextjs.org/docs)
4. Look at example files in `pages/`-example.js`
5. Check build output for specific error messages
6. Look at browser DevTools (F12) for client-side errors
7. Check server logs for server-side errors

---

**Last Updated**: December 23, 2025
