'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Truck, Shield, CreditCard, Headphones, Loader2 } from 'lucide-react'
import { useCart } from '../../src/context/CartContext'
import { getStoreProducts, getStoreCategories } from '../../src/services/api'
import { products as fallbackProducts, productCategories as fallbackCategories } from '../../src/data/ecommerceData'

const categoryIcons = {
  'tirzepatida-tirzec': '💉',
  'tirzepatida-outras': '🧪',
  'semaglutida': '🧬',
  'medicamentos': '💊',
  'suplementos': '⚡',
  'dermocosmeticos': '✨',
  'perfumes': '🧴',
  'eletronicos': '📱',
  'saude': '🩺',
}

const formatBRL = (v) => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const WHATSAPP_ADMIN = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5545991562811'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const router = useRouter()

  const waHeroLink = `https://wa.me/${WHATSAPP_ADMIN.replace(/\D/g, '')}?text=${encodeURIComponent('Olá! Gostaria de consultar um medicamento / injetável importado com a equipe da Tesãi.')}`

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          getStoreProducts({ limit: 8, featured: true }),
          getStoreCategories(),
        ])
        setFeatured(prodRes.products || [])
        setCategories(catRes || [])
      } catch (err) {
        console.error('Failed to load home data, using fallback:', err)
        const adapted = fallbackProducts.filter(p => p.destaque || p.id <= 8).map(p => ({
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
        setFeatured(adapted)
        setCategories(fallbackCategories.filter(c => c.id !== 'todos').map(c => ({ id: c.id, name: c.nome, slug: c.id, productCount: c.count })))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="store-loading">
        <Loader2 className="animate-spin" size={32} />
        <span>Carregando Tesãi...</span>
      </div>
    )
  }

  const heroProduct = featured.find(p => p.isFeatured) || featured[0]

  return (
    <>
      {/* Hero Section */}
      <section className="store-hero" style={{ background: 'linear-gradient(135deg, #0a3d62 0%, #0077b6 100%)', color: '#fff', padding: '60px 0' }}>
        <div className="store-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="store-hero-badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }}>
              🏥 Linha Especializada & Farmácia em Ciudad del Este (PY)
            </div>
            <h1 style={{ color: '#fff', fontSize: '2.5rem', lineHeight: 1.2, margin: '16px 0' }}>
              Soluções Injetáveis, Tirzepatida e Semaglutida<br />com Entrega Segura em Todo o Brasil
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', maxWidth: 650, marginBottom: 28 }}>
              Tesãi — Saúde e procedência direto de Ciudad del Este. Produtos 100% lacrados de fábrica, envio com controle de proteção e atendimento dedicado via WhatsApp.
            </p>
            <div className="store-hero-actions" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/loja" className="store-btn store-btn-primary store-btn-lg" style={{ background: '#25D366', color: '#fff', border: 'none', fontWeight: 700 }}>
                Ver Catálogo Completo <ArrowRight size={18} />
              </Link>
              <a
                href={waHeroLink}
                target="_blank"
                rel="noopener noreferrer"
                className="store-btn store-btn-secondary store-btn-lg"
                style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 600 }}
              >
                💬 Falar com Farmacêutico
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="store-container" style={{ marginTop: -20, position: 'relative', zIndex: 10 }}>
        <div className="store-trust" style={{ background: '#fff', borderRadius: 'var(--s-radius)', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
          <div className="store-trust-item">
            <div className="store-trust-icon" style={{ color: '#0077b6' }}><Shield size={20} /></div>
            <div className="store-trust-text">
              <h4>100% Autênticos</h4>
              <p>Procedência garantida CDE</p>
            </div>
          </div>
          <div className="store-trust-item">
            <div className="store-trust-icon" style={{ color: '#0077b6' }}><Truck size={20} /></div>
            <div className="store-trust-text">
              <h4>Envio Especializado</h4>
              <p>Embalagem térmica & discreta</p>
            </div>
          </div>
          <div className="store-trust-item">
            <div className="store-trust-icon" style={{ color: '#0077b6' }}><CreditCard size={20} /></div>
            <div className="store-trust-text">
              <h4>Pix Instantâneo</h4>
              <p>Aprovação e reserva imediata</p>
            </div>
          </div>
          <div className="store-trust-item">
            <div className="store-trust-icon" style={{ color: '#25D366' }}><Headphones size={20} /></div>
            <div className="store-trust-text">
              <h4>Suporte WhatsApp</h4>
              <p>Atendimento direto ao cliente</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="store-section">
          <div className="store-container">
            <div className="store-section-header">
              <div>
                <h2 className="store-section-title">Categorias</h2>
                <p className="store-section-subtitle">Navegue por departamento</p>
              </div>
            </div>
            <div className="store-categories">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/loja?category=${cat.slug}`}
                  className="store-category-card"
                >
                  <div className="store-category-icon">
                    {categoryIcons[cat.slug] || '📦'}
                  </div>
                  <div className="store-category-name">{cat.name}</div>
                  <div className="store-category-count">{cat.productCount} produtos</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Banner */}
      {heroProduct && (
        <section className="store-section">
          <div className="store-container">
            <div className="store-featured-banner" style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.3)', borderRadius: 20, padding: '40px 48px' }}>
              <div>
                <span style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(37,211,102,0.15)', color: '#25D366', borderRadius: 999, fontSize: '0.8rem', fontWeight: 600, marginBottom: 16 }}>
                  ⭐ Destaque da Semana
                </span>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', margin: '0 0 12px' }}>
                  {heroProduct.name}
                </h2>
                <p style={{ fontSize: '1.05rem', color: '#94A3B8', lineHeight: 1.6, margin: '0 0 24px', maxWidth: 500 }}>
                  {heroProduct.descriptionShort}
                </p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 28 }}>
                  <span style={{ fontSize: '2rem', fontWeight: 800, color: '#F8FAFC' }}>
                    {formatBRL(heroProduct.variant?.priceBrl)}
                  </span>
                  {heroProduct.variant?.priceBrlOriginal && (
                    <span style={{ fontSize: '1.1rem', textDecoration: 'line-through', color: '#64748B' }}>
                      {formatBRL(heroProduct.variant.priceBrlOriginal)}
                    </span>
                  )}
                </div>
                <Link
                  href={`/produto/${heroProduct.slug}`}
                  className="store-btn store-btn-primary store-btn-lg"
                  style={{ background: '#25D366', color: '#fff', border: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8 }}
                >
                  Ver Produto <ArrowRight size={18} />
                </Link>
              </div>
              <div className="store-featured-img" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ background: '#fff', padding: '24px', borderRadius: 16, boxShadow: '0 12px 30px rgba(0,0,0,0.25)', width: '100%', maxWidth: 360, height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {heroProduct.cover?.url ? (
                    <img
                      src={heroProduct.cover.url}
                      alt={heroProduct.name}
                      style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.08))' }}
                    />
                  ) : (
                    <span style={{ fontSize: '4rem' }}>💊</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Product Grid */}
      <section className="store-section">
        <div className="store-container">
          <div className="store-section-header">
            <div>
              <h2 className="store-section-title">Destaques</h2>
              <p className="store-section-subtitle">Os mais vendidos da semana</p>
            </div>
            <Link href="/loja" className="store-btn store-btn-secondary store-btn-sm">
              Ver todos <ArrowRight size={14} />
            </Link>
          </div>
          <div className="store-product-grid">
            {featured.map((product, i) => {
              const v = product.variant
              const discount = v?.priceBrlOriginal
                ? Math.round((1 - v.priceBrl / v.priceBrlOriginal) * 100)
                : 0

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
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
        </div>
      </section>
    </>
  )
}
