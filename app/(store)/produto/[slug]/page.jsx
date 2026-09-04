import ProductDetailClient from './ProductDetailClient'
import { getStoreProductBySlug } from '../../../../src/services/api'
import { products as fallbackProducts } from '../../../../src/data/ecommerceData'
import Link from 'next/link'

export async function generateMetadata({ params }) {
  const { slug } = params
  try {
    const product = await getStoreProductBySlug(slug).catch(() => null)
    const fallback = fallbackProducts.find(p => p.slug === slug)
    const name = product?.name || fallback?.nome || 'Medicamento Especializado'
    const desc = product?.descriptionShort || fallback?.descricaoCurta || `Compre na Tesãi Farmácias. Importados com procedência e entrega segura em todo o Brasil.`

    return {
      title: `${name} | Tesãi Farmácias`,
      description: desc,
      openGraph: {
        title: `${name} | Tesãi Farmácias`,
        description: desc,
        images: [{ url: product?.media?.[0]?.url || fallback?.imagem || '/products/tirzec-15mg-md-multidose.webp' }],
      }
    }
  } catch (error) {
    return { title: 'Detalhes do Medicamento | Tesãi Farmácias' }
  }
}

export default async function ProdutoPage({ params }) {
  const { slug } = params
  
  let product = null
  try {
    product = await getStoreProductBySlug(slug)
  } catch (error) {
    console.warn('API store unreachable on SSR, loading instant fallback:', error.message)
  }

  // Fallback instantâneo caso a API backend esteja em cold start no Render
  if (!product) {
    const fallback = fallbackProducts.find(p => p.slug === slug)
    if (fallback) {
      product = {
        id: fallback.id,
        name: fallback.nome,
        slug: fallback.slug,
        brand: fallback.brand || (fallback.categoria?.includes('tirzec') ? 'Tirzec' : (fallback.nome.includes('TG') ? 'TG' : 'Linha Especial')),
        descriptionShort: fallback.descricaoCurta,
        descriptionFull: fallback.descricaoDetalhada,
        rating: fallback.avaliacao || 4.9,
        reviewCount: fallback.avaliacoes || 68,
        soldCount: fallback.vendidos || 140,
        media: [{ url: fallback.imagem, isCover: true }],
        cover: { url: fallback.imagem },
        variants: [{
          id: `var-${fallback.id}`,
          label: fallback.variantes?.[0] || 'Unidade Padrão',
          priceBrl: fallback.precoBRL,
          priceBrlOriginal: fallback.precoOriginalBRL,
          isDefault: true,
        }],
        category: {
          name: fallback.categoria === 'tirzepatida-tirzec' ? 'Linha Tirzepatida • Tirzec' : 'Linha Especializada',
          slug: fallback.categoria,
        }
      }
    }
  }

  if (!product) {
    return (
      <div className="store-container" style={{ padding: '100px 20px', textAlign: 'center' }}>
        <div style={{ background: '#FFF', padding: '60px', borderRadius: 16, border: '1px solid var(--di-border)', maxWidth: 500, margin: '0 auto' }}>
          <h3>Produto não encontrado</h3>
          <p style={{ color: '#6B7280', margin: '12px 0 24px' }}>O medicamento que você procura não está disponível no momento.</p>
          <Link href="/loja" style={{ background: '#4A1D96', color: '#FFF', padding: '12px 28px', borderRadius: 999, textDecoration: 'none', fontWeight: 700 }}>
            Voltar ao Catálogo
          </Link>
        </div>
      </div>
    )
  }

  return (
    <ProductDetailClient product={product} />
  )
}
