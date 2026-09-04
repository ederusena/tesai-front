import ProductDetailClient from './ProductDetailClient'
import { getStoreProductBySlug } from '../../../../src/services/api'
import Link from 'next/link'

export async function generateMetadata({ params }) {
  const { slug } = params
  try {
    const product = await getStoreProductBySlug(slug)
    if (!product) return { title: 'Produto não encontrado' }

    const cover = product.media?.find(m => m.isCover) || product.media?.[0]

    return {
      title: `${product.name} | Spark Vendas`,
      description: product.descriptionShort || `Compre ${product.name} na Spark Vendas. Importados do Paraguai com entrega garantida para todo o Brasil.`,
      openGraph: {
        title: `${product.name} | Spark Vendas`,
        description: product.descriptionShort,
        images: cover ? [{ url: cover.url }] : [],
      },
      alternates: {
        canonical: `http://localhost:3000/produto/${slug}`,
      }
    }
  } catch (error) {
    return { title: 'Detalhes do Produto' }
  }
}

export default async function ProdutoPage({ params }) {
  const { slug } = params
  
  let product = null
  try {
    product = await getStoreProductBySlug(slug)
  } catch (error) {
    console.error('Error loading product:', error)
  }

  if (!product) {
    return (
      <div className="store-container">
        <div className="store-empty" style={{ padding: '120px 0' }}>
          <h3>Produto não encontrado</h3>
          <p>O produto que você procura não existe ou foi removido.</p>
          <Link href="/loja" className="store-btn store-btn-primary" style={{ marginTop: 16 }}>
            Voltar à Loja
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="store-container">
      <ProductDetailClient product={product} />
    </div>
  )
}
