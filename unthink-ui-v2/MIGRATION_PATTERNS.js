/**
 * Common Gatsby → Next.js Migration Code Patterns
 */

// ============================================
// 1. IMPORTS
// ============================================

// Gatsby
// import { Link, useStaticQuery, graphql } from "gatsby"
// import { GatsbyImage, getImage } from "gatsby-plugin-image"

// Next.js
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

// ============================================
// 2. LINKS & NAVIGATION
// ============================================

// Gatsby
// <Link to="/about">About</Link>

// Next.js
// <Link href="/about">About</Link>

// ============================================
// 3. IMAGES
// ============================================

// Gatsby (using gatsby-plugin-image)
// import { GatsbyImage, getImage } from "gatsby-plugin-image"
// <GatsbyImage image={getImage(data.file)} alt="test" />

// Next.js (using next/image)
// Option 1: Static image with dimensions
// <Image src="/path/to/image.jpg" alt="test" width={200} height={200} />

// Option 2: Dynamic image without dimensions (uses fill)
// <div style={{ position: 'relative', width: '200px', height: '200px' }}>
//   <Image src="/path/to/image.jpg" alt="test" fill />
// </div>

// ============================================
// 4. ENVIRONMENT VARIABLES
// ============================================

// Gatsby
// const apiUrl = process.env.API_URL; // Works in both server and browser
// const secret = process.env.SECRET; // Works in both

// Next.js
// For browser access:
// const apiUrl = process.env.NEXT_PUBLIC_API_URL; // Must have NEXT_PUBLIC_ prefix
// For server-only (in getStaticProps/getServerSideProps):
// const secret = process.env.SECRET; // No prefix needed

// ============================================
// 5. DATA FETCHING
// ============================================

// Gatsby (using useStaticQuery)
// const data = useStaticQuery(graphql`
//   query {
//     site {
//       siteMetadata {
//         title
//       }
//     }
//   }
// `)

// Next.js (using getStaticProps - server-side)
// export async function getStaticProps() {
//   const data = await fetch('https://api.example.com/data').then(r => r.json());
//   return { props: { data }, revalidate: 3600 };
// }
//
// function MyPage({ data }) {
//   return <div>{data.title}</div>;
// }

// ============================================
// 6. LAYOUT WRAPPER
// ============================================

// Gatsby (in gatsby-browser.js)
// export const wrapRootElement = ({ element }) => (
//   <Layout>{element}</Layout>
// )

// Next.js (in pages/_app.js)
// function MyApp({ Component, pageProps }) {
//   return (
//     <Layout>
//       <Component {...pageProps} />
//     </Layout>
//   );
// }
// export default MyApp;

// ============================================
// 7. STYLING (SCSS/SASS)
// ============================================

// Gatsby (in component)
// import styles from './component.module.scss';
// <div className={styles.container}>

// Next.js (same as Gatsby!)
// import styles from './component.module.scss';
// <div className={styles.container}>

// Global styles in Gatsby (gatsby-browser.js):
// import './styles/global.scss';

// Global styles in Next.js (pages/_app.js):
// import '../styles/global.scss';

// ============================================
// 8. CONDITIONAL RENDERING DURING BUILD
// ============================================

// Gatsby
// if (typeof window === 'undefined') {
//   // Server-side code
// } else {
//   // Browser code
// }

// Next.js (same pattern)
// if (typeof window === 'undefined') {
//   // Server-side code
// } else {
//   // Browser code
// }

// ============================================
// 9. HEAD MANAGEMENT
// ============================================

// Gatsby
// import { Helmet } from 'react-helmet';
// <Helmet>
//   <title>My Page</title>
//   <meta name="description" content="..." />
// </Helmet>

// Next.js
// import Head from 'next/head';
// <Head>
//   <title>My Page</title>
//   <meta name="description" content="..." />
// </Head>

// ============================================
// 10. DYNAMIC ROUTES
// ============================================

// Gatsby (using onCreatePage)
// Both Gatsby and Next.js use the same file-based syntax:
// - src/pages/blog/[slug].js → pages/blog/[slug].js
// - src/pages/[...slug].js → pages/[...slug].js (catch-all)

// In Gatsby: context.slug passed to props
// In Next.js: useRouter().query.slug

// ============================================
// 11. QUERY PARAMETERS
// ============================================

// Gatsby
// const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
// const id = params.get('id');

// Next.js (cleaner)
// import { useRouter } from 'next/router';
// const router = useRouter();
// const { id } = router.query;

// ============================================
// 12. CLIENT-SIDE HOOKS
// ============================================

// useEffect works the same in both
// useContext, useState, useReducer, etc. are identical
// Custom hooks are identical

// Gatsby-specific hooks removed:
// - useStaticQuery → use getStaticProps instead
// - useFragment → not needed in Next.js

// ============================================
// 13. API ROUTES
// ============================================

// Gatsby (not commonly used)
// src/api/hello.js → Limited support

// Next.js (first-class support)
// pages/api/hello.js
// export default function handler(req, res) {
//   res.status(200).json({ message: 'Hello' });
// }

export default function MigrationReference() {
  return (
    <div>
      <h1>Gatsby → Next.js Migration Reference</h1>
      <p>See code comments for patterns</p>
    </div>
  );
}
