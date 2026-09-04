'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Loader2, SlidersHorizontal, ShoppingBag, Truck, Star } from 'lucide-react'
import { getStoreProducts, getStoreCategories, getStoreBrands } from '../../../src/services/api'
import { products as fallbackProducts, productCategories as fallbackCategories } from '../../../src/data/ecommerceData'
import { useCart } from '../../../src/context/CartContext'

const formatBRL = (v) => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function LojaContent() {
  const { addItem } = useCart()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const activeCategory = searchParams.get('category') || ''
  const activeBrand = searchParams.get('brand') || ''
  const searchQuery = searchParams.get('search') || ''

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const prodRes = await getStoreProducts({
          page,
          limit: 20,
          category: activeCategory,
          brand: activeBrand,
          search: searchQuery,
        })
        const [catRes, brandRes] = await Promise.all([
          getStoreCategories().catch(() => []),
          getStoreBrands().catch(() => []),
        ])
        setProducts(prodRes.products || [])
        setTotal(prodRes.total || 0)
        setPages(prodRes.pages || 1)
        setCategories(catRes || [])
        setBrands(brandRes || [])
      } catch (err) {
        console.error('API Store Error, using fallback data:', err)
        let filtered = [...fallbackProducts]
        if (activeCategory) {
          filtered = filtered.filter(p => p.categoria === activeCategory)
        }
        if (activeBrand) {
          filtered = filtered.filter(p => p.brand?.toLowerCase() === activeBrand.toLowerCase() || p.tags?.includes(activeBrand.toLowerCase()) || p.nome?.toLowerCase().includes(activeBrand.toLowerCase()))
        }
        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          filtered = filtered.filter(p => p.nome.toLowerCase().includes(q) || p.descricaoCurta?.toLowerCase().includes(q))
        }

        const adapted = filtered.map(p => ({
          id: p.id,
          name: p.nome,
          slug: p.slug,
          brand: p.brand || (p.categoria?.includes('tirzec') ? 'Tirzec' : (p.nome.includes('TG') ? 'TG' : 'Linha Especial')),
          descriptionShort: p.descricaoCurta,
          isNew: p.novo,
          isFeatured: p.destaque,
          rating: p.avaliacao || 4.9,
          reviewCount: p.avaliacoes || 54,
          cover: { url: p.imagem },
          variant: {
            priceBrl: p.precoBRL,
            priceBrlOriginal: p.precoOriginalBRL,
          }
        }))

        setProducts(adapted)
        setTotal(adapted.length)
        setPages(Math.ceil(adapted.length / 12) || 1)
        setCategories(fallbackCategories.filter(c => c.id !== 'todos').map(c => ({ id: c.id, name: c.nome, slug: c.id, productCount: c.count })))
        setBrands([
          { name: 'Tirzec', productCount: 8 },
          { name: 'TG', productCount: 5 },
          { name: 'Lipoless', productCount: 2 },
          { name: 'Lipoland', productCount: 2 },
          { name: 'Delgacil', productCount: 3 },
          { name: 'Semaglix', productCount: 1 },
          { name: 'Gluconex', productCount: 1 },
          { name: 'Tirzedral', productCount: 1 },
        ])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [page, activeCategory, activeBrand, searchQuery])

  const setCategory = (slug) => {
    const params = new URLSearchParams(searchParams)
    if (slug) {
      params.set('category', slug)
    } else {
      params.delete('category')
    }
    params.delete('search')
    router.push(`${pathname}?${params.toString()}`)
    setPage(1)
  }

  const setBrand = (brandName) => {
    const params = new URLSearchParams(searchParams)
    if (brandName) {
      params.set('brand', brandName)
    } else {
      params.delete('brand')
    }
    params.delete('search')
    router.push(`${pathname}?${params.toString()}`)
    setPage(1)
  }

  return (
    <div style={{ background: '#FAF8F5', minHeight: '85vh', padding: '30px 0 60px' }}>
      <div className="store-container">
        
        {/* Breadcrumb */}
        <div style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: 20, display: 'flex', gap: 6 }}>
          <Link href="/" style={{ color: '#4B5563', textDecoration: 'none' }}>Início</Link>
          <span>/</span>
          <span style={{ color: '#4A1D96', fontWeight: 700 }}>Catálogo de Medicamentos</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32, alignItems: 'start' }}>
          
          {/* Sidebar de Filtros (Drogaria Iguatemi) */}
          <aside style={{ background: '#FFFFFF', borderRadius: 12, padding: '24px', border: '1px solid var(--di-border)', boxShadow: 'var(--di-shadow-xs)' }}>
            
            {/* Categorias */}
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#4A1D96', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Departamentos
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <button
                style={{
                  textAlign: 'left',
                  background: !activeCategory && !activeBrand ? '#F3EEFB' : 'transparent',
                  color: !activeCategory && !activeBrand ? '#4A1D96' : '#4B5563',
                  fontWeight: !activeCategory && !activeBrand ? 700 : 500,
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}
                onClick={() => {
                  const params = new URLSearchParams(searchParams)
                  params.delete('category')
                  params.delete('brand')
                  params.delete('search')
                  router.push(`${pathname}?${params.toString()}`)
                }}
              >
                <span>Todos os Produtos</span>
                <span>({total})</span>
              </button>

              {categories.map((cat) => (
                <button
                  key={cat.id}
                  style={{
                    textAlign: 'left',
                    background: activeCategory === cat.slug ? '#F3EEFB' : 'transparent',
                    color: activeCategory === cat.slug ? '#4A1D96' : '#4B5563',
                    fontWeight: activeCategory === cat.slug ? 700 : 500,
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: 6,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                  onClick={() => setCategory(cat.slug)}
                >
                  <span>{cat.name}</span>
                  <span>({cat.productCount || 0})</span>
                </button>
              ))}
            </div>

            {/* Marcas & Laboratórios */}
            <div style={{ borderTop: '1px solid #F0EDE8', marginTop: 24, paddingTop: 20 }}>
              <h4 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#4A1D96', margin: '0 0 14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Laboratórios & Linhas
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {brands.map((b) => (
                  <button
                    key={b.name}
                    style={{
                      textAlign: 'left',
                      background: activeBrand.toLowerCase() === b.name.toLowerCase() ? '#F3EEFB' : 'transparent',
                      color: activeBrand.toLowerCase() === b.name.toLowerCase() ? '#4A1D96' : '#4B5563',
                      fontWeight: activeBrand.toLowerCase() === b.name.toLowerCase() ? 700 : 500,
                      border: 'none',
                      padding: '8px 12px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                    onClick={() => setBrand(activeBrand === b.name ? '' : b.name)}
                  >
                    <span>{b.name}</span>
                    <span>({b.productCount || 0})</span>
                  </button>
                ))}
              </div>
            </div>

          </aside>

          {/* Grid de Produtos (Drogaria Iguatemi) */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--di-text)', margin: 0 }}>
                {activeBrand 
                  ? `Linha ${activeBrand}` 
                  : activeCategory 
                    ? categories.find(c => c.slug === activeCategory)?.name || 'Categoria' 
                    : searchQuery 
                      ? `Resultados para "${searchQuery}"` 
                      : 'Todos os Medicamentos'}
              </h1>
              <span style={{ fontSize: '0.85rem', color: '#6B7280' }}>
                Exibindo <strong>{products.length}</strong> produtos
              </span>
            </div>

            {loading ? (
              <div style={{ padding: '80px 0', textAlign: 'center', color: '#4A1D96' }}>
                <Loader2 className="animate-spin" size={36} style={{ margin: '0 auto 12px' }} />
                <span style={{ fontWeight: 600 }}>Carregando catálogo...</span>
              </div>
            ) : products.length === 0 ? (
              <div style={{ background: '#FFF', padding: '60px', borderRadius: 12, textAlign: 'center', border: '1px solid var(--di-border)' }}>
                <ShoppingBag size={40} color="#9CA3AF" style={{ margin: '0 auto 12px' }} />
                <h3>Nenhum produto encontrado</h3>
                <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Tente selecionar outro laboratório ou limpar a busca.</p>
              </div>
            ) : (
              <div className="di-product-grid">
                {products.map((product) => {
                  const v = product.variant
                  const price = v?.priceBrl || 550
                  const original = v?.priceBrlOriginal || price * 1.3
                  const reviews = product.reviewCount || 64

                  return (
                    <div key={product.id} className="di-card">
                      <div className="di-card-badges">
                        <span className="di-badge-tag purple">{product.brand || 'LINHA'}</span>
                        <span className="di-badge-tag discount">100% LACRADO</span>
                      </div>

                      <Link href={`/produto/${product.slug}`} className="di-card-img-wrap">
                        <img src={product.cover?.url || '/products/tirzec-2-5mg-frasco-ampola.webp'} alt={product.name} />
                      </Link>

                      <div className="di-delivery-tag">
                        <Truck size={13} />
                        <span>RECEBA COM SEGURANÇA NO BRASIL</span>
                      </div>

                      <div className="di-card-body">
                        <span className="di-card-brand">{product.brand}</span>
                        <Link href={`/produto/${product.slug}`} style={{ textDecoration: 'none' }}>
                          <h3 className="di-card-title">{product.name}</h3>
                        </Link>

                        <div className="di-rating">
                          <span className="di-stars">★★★★★</span>
                          <span className="di-rating-count">({reviews})</span>
                        </div>

                        <div className="di-pricing">
                          <div className="di-price-original">{formatBRL(original)}</div>
                          <div className="di-price-pix">
                            <span className="di-price-val">{formatBRL(price)}</span>
                            <span className="di-pix-badge">no pix</span>
                          </div>
                          <div className="di-price-installment">
                            ou 6x de {formatBRL(price / 6)} no cartão
                          </div>
                        </div>

                        <button 
                          className="di-buy-btn"
                          onClick={() => addItem({
                            id: product.id,
                            name: product.name,
                            price: price,
                            image: product.cover?.url,
                            quantity: 1
                          })}
                        >
                          <ShoppingBag size={16} /> Comprar
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  )
}

export default function Loja() {
  return (
    <Suspense fallback={
      <div style={{ padding: '100px 0', textAlign: 'center' }}>
        <Loader2 className="animate-spin" size={36} color="#4A1D96" style={{ margin: '0 auto 12px' }} />
        <span>Carregando catálogo Tesãi...</span>
      </div>
    }>
      <LojaContent />
    </Suspense>
  )
}
