'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Truck, ShieldCheck, CreditCard, Headphones, 
  ChevronRight, ArrowRight, Star, ShoppingBag, Sparkles 
} from 'lucide-react'
import { useCart } from '../../src/context/CartContext'
import { getStoreProducts, getStoreCategories } from '../../src/services/api'
import { products as fallbackProducts, productCategories as fallbackCategories } from '../../src/data/ecommerceData'

const formatBRL = (v) => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const WHATSAPP_ADMIN = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5545991562811'

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const { addItem } = useCart()
  const router = useRouter()

  const waHeroLink = `https://wa.me/${WHATSAPP_ADMIN.replace(/\D/g, '')}?text=${encodeURIComponent('Olá! Gostaria de consultar a disponibilidade dos injetáveis com a equipe da Tesãi.')}`

  useEffect(() => {
    const load = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          getStoreProducts({ limit: 20 }),
          getStoreCategories(),
        ])
        setProducts(prodRes.products || [])
        setCategories(catRes || [])
      } catch (err) {
        console.error('Failed to load home data, using fallback:', err)
        const adapted = fallbackProducts.map(p => ({
          id: p.id,
          name: p.nome,
          slug: p.slug,
          brand: p.brand || (p.categoria?.includes('tirzec') ? 'Tirzec' : (p.nome.includes('TG') ? 'TG' : 'Linha Especial')),
          descriptionShort: p.descricaoCurta,
          isNew: p.novo,
          isFeatured: p.destaque,
          rating: p.avaliacao || 4.9,
          reviewCount: p.avaliacoes || 54,
          soldCount: p.vendidos || 120,
          cover: { url: p.imagem },
          variant: {
            priceBrl: p.precoBRL,
            priceBrlOriginal: p.precoOriginalBRL,
          }
        }))
        setProducts(adapted)
        setCategories(fallbackCategories.filter(c => c.id !== 'todos').map(c => ({ id: c.id, name: c.nome, slug: c.id, productCount: c.count })))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const tirzecList = products.filter(p => p.brand === 'Tirzec' || p.name?.includes('Tirzec')).slice(0, 4)
  const otherTirzepatida = products.filter(p => p.name?.includes('TG') || p.name?.includes('Lipoless') || p.name?.includes('Lipoland') || p.name?.includes('Tirzedral')).slice(0, 4)
  const semaglutidaList = products.filter(p => p.name?.includes('Delgacil') || p.name?.includes('Semaglix') || p.slug?.includes('semaglutida')).slice(0, 4)
  const bestSellers = products.slice(0, 8)

  return (
    <>
      {/* 1. Categorias Circulares em Pílula (Estilo Drogaria Iguatemi) */}
      <section className="di-cat-bar">
        <div className="store-container">
          <div className="di-cat-scroll">
            <Link href="/loja?category=tirzepatida-tirzec" className="di-cat-circle-item">
              <div className="di-cat-circle-img" style={{ background: '#EDE9FE', borderColor: '#C4B5FD' }}>
                <span>💉</span>
              </div>
              <span className="di-cat-circle-label">Linha Tirzec</span>
            </Link>

            <Link href="/loja?brand=TG" className="di-cat-circle-item">
              <div className="di-cat-circle-img" style={{ background: '#E0F2FE', borderColor: '#BAE6FD' }}>
                <span>🧪</span>
              </div>
              <span className="di-cat-circle-label">Linha TG</span>
            </Link>

            <Link href="/loja?brand=Lipoless" className="di-cat-circle-item">
              <div className="di-cat-circle-img" style={{ background: '#DCFCE7', borderColor: '#BBF7D0' }}>
                <span>🧬</span>
              </div>
              <span className="di-cat-circle-label">Lipoless</span>
            </Link>

            <Link href="/loja?brand=Lipoland" className="di-cat-circle-item">
              <div className="di-cat-circle-img" style={{ background: '#FEF3C7', borderColor: '#FDE68A' }}>
                <span>⚡</span>
              </div>
              <span className="di-cat-circle-label">Lipoland</span>
            </Link>

            <Link href="/loja?category=semaglutida" className="di-cat-circle-item">
              <div className="di-cat-circle-img" style={{ background: '#FCE7F3', borderColor: '#FBCFE8' }}>
                <span>💎</span>
              </div>
              <span className="di-cat-circle-label">Semaglutida</span>
            </Link>

            <Link href="/loja?brand=Delgacil" className="di-cat-circle-item">
              <div className="di-cat-circle-img" style={{ background: '#FFEDD5', borderColor: '#FED7AA' }}>
                <span>💊</span>
              </div>
              <span className="di-cat-circle-label">Delgacil</span>
            </Link>

            <Link href="/loja?brand=Gluconex" className="di-cat-circle-item">
              <div className="di-cat-circle-img" style={{ background: '#F3E8FF', borderColor: '#E9D5FF' }}>
                <span>🩺</span>
              </div>
              <span className="di-cat-circle-label">Gluconex</span>
            </Link>

            <Link href="/loja" className="di-cat-circle-item">
              <div className="di-cat-circle-img" style={{ background: '#F1F5F9', borderColor: '#E2E8F0' }}>
                <span>🏪</span>
              </div>
              <span className="di-cat-circle-label">Ver Todas</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="store-container">
        {/* 2. Banner Editorial Principal (Drogaria Iguatemi Conceito) */}
        <div className="di-hero-banner" style={{ marginTop: 28 }}>
          <div className="di-hero-content">
            <span className="di-hero-tag">
              <Sparkles size={14} /> Tesãi Linha Especializada
            </span>
            <h1 className="di-hero-title">
              Sua saúde e vitalidade em um espaço premium
            </h1>
            <p className="di-hero-desc">
              Tirzepatida (Tirzec, TG, Lipoless) e Semaglutida importadas com procedência de Ciudad del Este. Armazenamento sob refrigeração e entrega garantida para todo o Brasil.
            </p>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link href="/loja" className="di-hero-btn">
                Explorar Catálogo Completo <ArrowRight size={16} />
              </Link>
              <a 
                href={waHeroLink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="di-hero-btn" 
                style={{ background: '#25D366', color: '#FFFFFF' }}
              >
                Falar com Farmacêutico 💬
              </a>
            </div>
          </div>

          <div className="di-hero-card-preview hide-mobile">
            <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#16A34A', background: '#DCFCE7', padding: '4px 10px', borderRadius: 20 }}>
              DESTAQUE DA SEMANA
            </span>
            <img 
              src="/products/tirzec-15mg-md-multidose.webp" 
              alt="Tirzec 15mg Multidose" 
              style={{ width: '100%', height: 180, objectFit: 'contain', margin: '14px 0' }}
            />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 6px' }}>Tirzec 15 mg Multidose</h4>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4A1D96' }}>R$ 780,00 <small style={{ fontSize: '0.75rem', color: '#16A34A' }}>no Pix</small></div>
            <Link href="/produto/tirzec-15mg-md-multidose" style={{ display: 'block', marginTop: 12, background: '#4A1D96', color: '#FFF', padding: '8px', borderRadius: 6, textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}>
              Ver Detalhes do Produto
            </Link>
          </div>
        </div>

        {/* 3. Barra de Benefícios e Confiança */}
        <div className="di-benefits-bar">
          <div className="di-benefit-item">
            <div className="di-benefit-icon"><Truck size={22} /></div>
            <div className="di-benefit-info">
              <h4>Envio com Rastreio</h4>
              <p>Postagem rápida CDE ➔ Brasil</p>
            </div>
          </div>
          <div className="di-benefit-item">
            <div className="di-benefit-icon"><ShieldCheck size={22} /></div>
            <div className="di-benefit-info">
              <h4>100% Lacrado de Fábrica</h4>
              <p>Procedência e pureza garantida</p>
            </div>
          </div>
          <div className="di-benefit-item">
            <div className="di-benefit-icon"><CreditCard size={22} /></div>
            <div className="di-benefit-info">
              <h4>Pix com Desconto</h4>
              <p>Ou parcele no cartão de crédito</p>
            </div>
          </div>
          <div className="di-benefit-item">
            <div className="di-benefit-icon"><Headphones size={22} /></div>
            <div className="di-benefit-info">
              <h4>Suporte no WhatsApp</h4>
              <p>Atendimento humanizado</p>
            </div>
          </div>
        </div>

        {/* 4. Vitrine: Lançamentos da Semana (Linha Tirzec) */}
        <section style={{ margin: '48px 0 24px' }}>
          <div className="di-section-header">
            <h2 className="di-section-title">
              <span>💉</span> Linha Tirzepatida • Tirzec
            </h2>
            <Link href="/loja?category=tirzepatida-tirzec" className="di-section-link">
              Ver todos <ChevronRight size={16} />
            </Link>
          </div>

          <div className="di-product-grid">
            {tirzecList.map(p => {
              const price = p.variant?.priceBrl || 550
              const original = p.variant?.priceBrlOriginal || price * 1.3
              const installment = (price / 6).toFixed(2)
              const rating = p.rating || 4.9
              const reviews = p.reviewCount || 48

              return (
                <div key={p.id} className="di-card">
                  <div className="di-card-badges">
                    <span className="di-badge-tag purple">TIRZEC</span>
                    <span className="di-badge-tag discount">100% LACRADO</span>
                  </div>

                  <Link href={`/produto/${p.slug}`} className="di-card-img-wrap">
                    <img src={p.cover?.url || '/products/tirzec-2-5mg-frasco-ampola.webp'} alt={p.name} />
                  </Link>

                  <div className="di-delivery-tag">
                    <Truck size={13} />
                    <span>RECEBA COM SEGURANÇA NO BRASIL</span>
                  </div>

                  <div className="di-card-body">
                    <span className="di-card-brand">{p.brand || 'Tirzec'}</span>
                    <Link href={`/produto/${p.slug}`} style={{ textDecoration: 'none' }}>
                      <h3 className="di-card-title">{p.name}</h3>
                    </Link>

                    {/* Rating */}
                    <div className="di-rating">
                      <span className="di-stars">★★★★★</span>
                      <span className="di-rating-count">({reviews})</span>
                    </div>

                    {/* Pricing */}
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
                        id: p.id,
                        name: p.name,
                        price: price,
                        image: p.cover?.url,
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
        </section>

        {/* 5. Mosaico de Banners de Categoria (Estilo Iguatemi) */}
        <div className="di-mosaic-grid">
          <Link href="/loja?category=tirzepatida-tirzec" className="di-mosaic-card" style={{ background: 'linear-gradient(135deg, #4A1D96 0%, #311068 100%)' }}>
            <div>
              <h3>Tirzec Completo</h3>
              <p>Frascos de 2,5mg a 15mg e Canetas</p>
            </div>
            <span className="di-mosaic-btn">Conhecer Linha <ArrowRight size={14} /></span>
          </Link>

          <Link href="/loja?brand=TG" className="di-mosaic-card" style={{ background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)' }}>
            <div>
              <h3>Linha TG Especial</h3>
              <p>Soluções Injetáveis de Alta Concentração</p>
            </div>
            <span className="di-mosaic-btn">Explorar TG <ArrowRight size={14} /></span>
          </Link>

          <Link href="/loja?brand=Lipoless" className="di-mosaic-card" style={{ background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' }}>
            <div>
              <h3>Lipoless & Lipoland</h3>
              <p>Multidose e Caixas Ampolas Lacradas</p>
            </div>
            <span className="di-mosaic-btn">Ver Opções <ArrowRight size={14} /></span>
          </Link>

          <Link href="/loja?category=semaglutida" className="di-mosaic-card" style={{ background: 'linear-gradient(135deg, #DB2777 0%, #BE185D 100%)' }}>
            <div>
              <h3>Semaglutida</h3>
              <p>Delgacil e Semaglix com Desconto</p>
            </div>
            <span className="di-mosaic-btn">Comprar Semaglutida <ArrowRight size={14} /></span>
          </Link>
        </div>

        {/* 6. Vitrine: Os Campeões de Vendas */}
        <section style={{ margin: '48px 0' }}>
          <div className="di-section-header">
            <h2 className="di-section-title">
              <span>🏆</span> Os Campeões de Vendas
            </h2>
            <Link href="/loja" className="di-section-link">
              Ver catálogo completo <ChevronRight size={16} />
            </Link>
          </div>

          <div className="di-product-grid">
            {bestSellers.map(p => {
              const price = p.variant?.priceBrl || 650
              const original = p.variant?.priceBrlOriginal || price * 1.25
              const reviews = p.reviewCount || 62

              return (
                <div key={p.id} className="di-card">
                  <div className="di-card-badges">
                    <span className="di-badge-tag green">MAIS VENDIDO</span>
                  </div>

                  <Link href={`/produto/${p.slug}`} className="di-card-img-wrap">
                    <img src={p.cover?.url} alt={p.name} />
                  </Link>

                  <div className="di-delivery-tag">
                    <Truck size={13} />
                    <span>POSTAGEM RÁPIDA • ENVIO SEGURO</span>
                  </div>

                  <div className="di-card-body">
                    <span className="di-card-brand">{p.brand}</span>
                    <Link href={`/produto/${p.slug}`} style={{ textDecoration: 'none' }}>
                      <h3 className="di-card-title">{p.name}</h3>
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
                        id: p.id,
                        name: p.name,
                        price: price,
                        image: p.cover?.url,
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
        </section>
      </div>
    </>
  )
}
