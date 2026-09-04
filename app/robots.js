export default function robots() {
  const baseUrl = 'http://localhost:3000'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/login'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
