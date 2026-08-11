export default function Robots() {
  return null;
}

export async function getServerSideProps({ res, req }) {
  const host = req.headers.host;

  const protocol =
    req.headers['x-forwarded-proto'] || 'https';

  const baseUrl = `${protocol}://${host}`;

  const robots = `User-agent: *
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`;

  res.setHeader('Content-Type', 'text/plain');
  res.write(robots);
  res.end();

  return {
    props: {},
  };
}