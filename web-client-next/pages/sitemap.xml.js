export default function Sitemap() {
  return null;
}

export async function getServerSideProps({ res, req }) {
  const host = req.headers.host;

  const protocol =
    req.headers['x-forwarded-proto'] || 'https';

  const baseUrl = `${protocol}://${host}`;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
  </url>
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}