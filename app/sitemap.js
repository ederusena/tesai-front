import { getStoreProducts } from '../src/services/api'

export default async function sitemap() {
  const baseUrl = 'http://localhost:3000'

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${baseUrl}/loja`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${baseUrl}/carrinho`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/checkout`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]

  try {
    const data = await getStoreProducts({ limit: 100 })
    const products = data?.products || []
    
    const productPages = products.map((product) => ({
      url: `${baseUrl}/produto/${product.slug}`,
      lastModified: new Date(product.updatedAt || product.updated_at || new Date()),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))

    return [...staticPages, ...productPages]
  } catch (error) {
    console.error('Erro ao gerar sitemap:', error)
    return staticPages
  }
}
