'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Truck, Shield, RotateCcw, Star, ChevronRight, Minus, Plus } from 'lucide-react'
import { useCart } from '../../../../src/context/CartContext'

const formatBRL = (v) => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function ProductDetailClient({ product }) {
  const { addItem } = useCart()
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.find(v => v.isDefault) || product.variants?.[0]
  )
  const [quantity, setQuantity] = useState(1)
  const [addedToCart, setAddedToCart] = useState(false)

  const v = selectedVariant || {}
  const discount = v.priceBrlOriginal ? Math.round((1 - v.priceBrl / v.priceBrlOriginal) * 100) : 0
  const savings = v.priceBrlOriginal ? v.priceBrlOriginal - v.priceBrl : 0
  const cover = product.media?.find(m => m.isCover) || product.media?.[0]

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      variantId: v.id,
      name: product.name,
      variant: v.label,
      price: v.priceBrl,
      image: cover?.url,
      quantity,
    })
    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="store-product-page">
      {/* Breadcrumb */}
      <div className="store-product-breadcrumb" style={{ marginBottom: 24 }}>
        <Link href="/">Início</Link>
        <ChevronRight size={12} style={{ margin: '0 6px', opacity: 0.4 }} />
        <Link href="/loja">Loja</Link>
        {product.category && (
          <>
            <ChevronRight size={12} style={{ margin: '0 6px', opacity: 0.4 }} />
            <Link href={`/loja?category=${product.category.slug}`}>{product.category.name}</Link>
          </>
        )}
        <ChevronRight size={12} style={{ margin: '0 6px', opacity: 0.4 }} />
        <span style={{ color: 'var(--s-text)' }}>{product.name}</span>
      </div>

      <div className="store-product-layout">
        {/* Gallery */}
        <motion.div
          className="store-product-gallery"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          style={{ background: '#FFFFFF', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}
        >
          {cover?.url
            ? <img src={cover.url} alt={product.name} style={{ width: '100%', height: '100%', maxHeight: 420, objectFit: 'contain', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.06))' }} />
            : <span className="store-product-gallery-emoji">📦</span>
          }
        </motion.div>

        {/* Info */}
        <motion.div
          className="store-product-info"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <span className="store-product-brand">{product.brand}</span>
          <h1 className="store-product-title">{product.name}</h1>

          {/* Rating */}
          {product.rating && (
            <div className="store-product-rating">
              <span className="store-product-rating-stars">
                {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
              </span>
              <span>{product.rating}</span>
              <span>({product.reviewCount} avaliações)</span>
              <span>· {product.soldCount} vendidos</span>
            </div>
          )}

          {/* Prices */}
          <div className="store-product-prices">
            <span className="store-product-price-current">{formatBRL(v.priceBrl)}</span>
            {v.priceBrlOriginal && (
              <span className="store-product-price-original">{formatBRL(v.priceBrlOriginal)}</span>
            )}
            {savings > 0 && (
              <span className="store-product-price-save">
                Economia de {formatBRL(savings)}
              </span>
            )}
          </div>

          {/* USD price */}
          {v.priceUsd && (
            <span style={{ fontSize: '0.85rem', color: 'var(--s-text-muted)', display: 'block', marginBottom: 16 }}>
              USD ${v.priceUsd.toFixed(2)} · Preço Paraguay
            </span>
          )}

          {/* Description */}
          <p className="store-product-desc">
            {product.descriptionFull || product.descriptionShort}
          </p>

          {/* Variants */}
          {product.variants?.length > 1 && (
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 8, display: 'block' }}>
                Variante
              </span>
              <div className="store-product-variants">
                {product.variants.map((vr) => (
                  <button
                    key={vr.id}
                    className={`store-variant-btn ${selectedVariant?.id === vr.id ? 'active' : ''}`}
                    onClick={() => setSelectedVariant(vr)}
                  >
                    {vr.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock */}
          <span className={`store-product-stock ${v.stock > 10 ? 'in-stock' : 'low-stock'}`} style={{ display: 'block', marginBottom: 20 }}>
            {v.stock > 10
              ? `✓ Em estoque (${v.stock} unidades)`
              : v.stock > 0
                ? `⚠ Últimas ${v.stock} unidades`
                : '✗ Esgotado'}
          </span>

          {/* Add to Cart */}
          <div className="store-product-add">
            <div className="store-qty">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                <Minus size={16} />
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(q => Math.min(v.stock || 10, q + 1))}>
                <Plus size={16} />
              </button>
            </div>
            <button
              className="store-btn store-btn-primary store-btn-lg"
              style={{ flex: 1, background: '#0a3d62', color: '#fff' }}
              onClick={handleAddToCart}
              disabled={!v.stock}
            >
              <ShoppingBag size={18} />
              {addedToCart ? 'Adicionado ✓' : 'Adicionar ao Carrinho'}
            </button>
          </div>

          {/* Direct WhatsApp Purchase CTA */}
          <div style={{ marginTop: 12 }}>
            <a
              href={`https://wa.me/5545991562811?text=${encodeURIComponent(`Olá! Tenho interesse no produto *${product.name}* (${v.label || 'Padrão'}) no valor de ${formatBRL(v.priceBrl)} anunciado na loja online. Gostaria de saber a disponibilidade e frete para minha cidade.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="store-btn store-btn-lg"
              style={{
                width: '100%',
                background: '#25D366',
                color: '#fff',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                fontWeight: 700,
              }}
            >
              💬 Comprar / Tirar Dúvidas no WhatsApp
            </a>
          </div>

          {/* Features */}
          <div className="store-product-features">
            <div className="store-product-feature">
              <Truck size={16} />
              <span>Envio de Ciudad del Este (PY)</span>
            </div>
            <div className="store-product-feature">
              <Shield size={16} />
              <span>Garantia & Procedência {product.warranty || '100% Original'}</span>
            </div>
            <div className="store-product-feature">
              <RotateCcw size={16} />
              <span>Devolução em até 7 dias</span>
            </div>
            <div className="store-product-feature">
              <Star size={16} />
              <span>Autêntico com Lote & Validade</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Related Products */}
      {product.related?.length > 0 && (
        <div className="store-related">
          <div className="store-section-header">
            <h2 className="store-section-title">Produtos Relacionados</h2>
            <Link href="/loja" className="store-btn store-btn-secondary store-btn-sm">
              Ver mais
            </Link>
          </div>
          <div className="store-product-grid">
            {product.related.map((rel) => (
              <Link key={rel.id} href={`/produto/${rel.slug}`} className="store-card">
                <div className="store-card-img">
                  {rel.cover?.url
                    ? <img src={rel.cover.url} alt={rel.name} />
                    : <span className="store-card-img-placeholder">📦</span>
                  }
                </div>
                <div className="store-card-body">
                  <span className="store-card-name">{rel.name}</span>
                  <div className="store-card-prices">
                    <span className="store-card-price">{formatBRL(rel.priceBrl)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
