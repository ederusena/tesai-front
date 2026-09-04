'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Search, Loader2, SlidersHorizontal, ShoppingBag } from 'lucide-react'
import { getStoreProducts, getStoreCategories, getStoreBrands } from '../../../src/services/api'
import { products as fallbackProducts, productCategories as fallbackCategories } from '../../../src/data/ecommerceData'

const formatBRL = (v) => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function LojaContent() {
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
          limit: 12,
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
        // Fallback local caso o backend esteja temporariamente indisponível
        let filtered = [...fallbackProducts]
        if (activeCategory) {
          filtered = filtered.filter(p => p.categoria === activeCategory)
        }
        if (activeBrand) {
          filtered = filtered.filter(p => p.brand?.toLowerCase() === activeBrand.toLowerCase() || p.tags?.includes(activeBrand.toLowerCase()))
        }
        if (searchQuery) {
          const q = searchQuery.toLowerCase()
          filtered = filtered.filter(p => p.nome.toLowerCase().includes(q) || p.descricaoCurta?.toLowerCase().includes(q))
        }

        const adapted = filtered.map(p => ({
          id: p.id,
          name: p.nome,
          slug: p.slug,
          brand: p.brand || (p.categoria?.includes('tirzec') ? 'Tirzec' : 'TG'),
          descriptionShort: p.descricaoCurta,
          isNew: p.novo,
          isFeatured: p.destaque,
          cover: { url: p.imagem },
          variant: {
            priceBrl: p.precoBRL,
            priceBrlOriginal: p.precoOriginalBRL,
          }
        }))

        setProducts(adapted)
        setTotal(adapted.length)
        setPages(Math.ceil(adapted.length / 12) || 1)
        setCategories(fallbackCategories.map(c => ({ id: c.id, name: c.nome, slug: c.id, productCount: c.count })))
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

  const handleSearch = (e) => {
    const q = e.target.value
    const params = new URLSearchParams(searchParams)
    if (q) {
      params.set('search', q)
    } else {
      params.delete('search')
    }
    router.push(`${pathname}?${params.toString()}`)
    setPage(1)
  }

  return (
    <div className="store-container">
      <div className="store-catalog-layout">
        {/* Filter Panel */}
        <aside className="store-filter-panel">
          <div className="store-search-bar">
            <Search size={16} style={{ color: 'var(--s-text-muted)', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Buscar produtos..."
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          {/* Categorias */}
          <div className="store-filter-title">
            <SlidersHorizontal size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
            Categorias
          </div>
          <div className="store-filter-list">
            <button
              className={`store-filter-item ${!activeCategory && !activeBrand ? 'active' : ''}`}
              onClick={() => {
                const params = new URLSearchParams(searchParams)
                params.delete('category')
                params.delete('brand')
                params.delete('search')
                router.push(`${pathname}?${params.toString()}`)
              }}
            >
              <span>Todos</span>
              <span className="store-filter-count">{total}</span>
            </button>
            {categories.filter(c => c.productCount > 0).map((cat) => (
              <button
                key={cat.id}
                className={`store-filter-item ${activeCategory === cat.slug ? 'active' : ''}`}
                onClick={() => setCategory(cat.slug)}
              >
                <span>{cat.name}</span>
                <span className="store-filter-count">{cat.productCount}</span>
              </button>
            ))}
          </div>

          {/* Laboratórios & Marcas */}
          {brands.length > 0 && (
            <>
              <div className="store-filter-title" style={{ marginTop: 24 }}>
                <SlidersHorizontal size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
                Laboratórios & Linhas
              </div>
              <div className="store-filter-list">
                {brands.map((b) => (
                  <button
                    key={b.name}
                    className={`store-filter-item ${activeBrand === b.name ? 'active' : ''}`}
                    onClick={() => setBrand(activeBrand === b.name ? '' : b.name)}
                  >
                    <span>{b.name}</span>
                    <span className="store-filter-count">{b.productCount}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </aside>

        {/* Product Grid */}
        <div>
          {/* Results count */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '-0.03em', margin: 0 }}>
              {activeBrand
                ? `Linha ${activeBrand}`
                : activeCategory
                  ? categories.find(c => c.slug === activeCategory)?.name || 'Categoria'
                  : searchQuery
                    ? `Resultados para "${searchQuery}"`
                    : 'Todos os Produtos'}
            </h1>
            <span style={{ fontSize: '0.85rem', color: 'var(--s-text-muted)' }}>
              {total} {total === 1 ? 'produto' : 'produtos'}
            </span>
          </div>

          {loading ? (
            <div className="store-loading">
              <Loader2 className="animate-spin" size={32} />
              <span>Carregando produtos...</span>
            </div>
          ) : products.length === 0 ? (
            <div className="store-empty">
              <ShoppingBag size={48} />
              <h3>Nenhum produto encontrado</h3>
              <p>Tente mudar o filtro ou buscar por outro termo.</p>
            </div>
          ) : (
            <>
              <div className="store-product-grid">
                {products.map((product, i) => {
                  const v = product.variant
                  const discount = v?.priceBrlOriginal
                    ? Math.round((1 - v.priceBrl / v.priceBrlOriginal) * 100)
                    : 0

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.35 }}
                    >
                      <Link href={`/produto/${product.slug}`} className="store-card">
                        <div className="store-card-img">
                          {product.cover?.url
                            ? <img src={product.cover.url} alt={product.name} />
                            : <span className="store-card-img-placeholder">📦</span>
                          }
                          {discount > 0 && (
                            <span className="store-card-badge sale">-{discount}%</span>
                          )}
                          {product.isNew && (
                            <span className="store-card-badge new" style={discount > 0 ? { top: 38 } : {}}>
                              Novo
                            </span>
                          )}
                        </div>
                        <div className="store-card-body">
                          <span className="store-card-brand">{product.brand}</span>
                          <span className="store-card-name">{product.name}</span>
                          <div className="store-card-prices">
                            <span className="store-card-price">{formatBRL(v?.priceBrl)}</span>
                            {v?.priceBrlOriginal && (
                              <span className="store-card-price-old">{formatBRL(v.priceBrlOriginal)}</span>
                            )}
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {/* Pagination */}
              {pages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 40 }}>
                  {Array.from({ length: pages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`store-btn store-btn-sm ${page === i + 1 ? 'store-btn-primary' : 'store-btn-secondary'}`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function Loja() {
  return (
    <Suspense fallback={
      <div className="store-loading">
        <Loader2 className="animate-spin" size={32} />
        <span>Carregando loja...</span>
      </div>
    }>
      <LojaContent />
    </Suspense>
  )
}
