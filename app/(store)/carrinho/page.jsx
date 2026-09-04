'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCart } from '../../../src/context/CartContext'

const formatBRL = (v) => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Carrinho() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems } = useCart()
  const router = useRouter()

  if (items.length === 0) {
    return (
      <div className="store-container">
        <div className="store-empty" style={{ padding: '120px 0' }}>
          <ShoppingBag size={48} />
          <h3>Seu carrinho está vazio</h3>
          <p>Adicione produtos para começar suas compras.</p>
          <Link href="/loja" className="store-btn store-btn-primary" style={{ marginTop: 16 }}>
            <ArrowLeft size={16} /> Continuar Comprando
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="store-container">
      <div className="store-cart-page">
        <h1>Carrinho ({totalItems} {totalItems === 1 ? 'item' : 'itens'})</h1>

        <div className="store-cart-layout">
          {/* Items */}
          <div className="store-cart-items">
            {items.map((item, i) => (
              <motion.div
                key={item.key}
                className="store-cart-item"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="store-cart-item-img">
                  {item.image
                    ? <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 'var(--s-radius)' }} />
                    : '📦'
                  }
                </div>

                <div>
                  <div className="store-cart-item-name">{item.name}</div>
                  {item.variant && <div className="store-cart-item-variant">{item.variant}</div>}
                </div>

                <div className="store-qty" style={{ transform: 'scale(0.85)' }}>
                  <button onClick={() => updateQuantity(item.key, item.quantity - 1)}>
                    <Minus size={14} />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.key, item.quantity + 1)}>
                    <Plus size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className="store-cart-item-price">{formatBRL(item.price * item.quantity)}</span>
                  <button
                    className="store-header-btn"
                    onClick={() => removeItem(item.key)}
                    style={{ color: 'var(--s-text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="store-cart-summary">
            <h3>Resumo do Pedido</h3>

            <div className="store-cart-summary-row">
              <span style={{ color: 'var(--s-text-secondary)' }}>Subtotal</span>
              <span>{formatBRL(totalPrice)}</span>
            </div>

            <div className="store-cart-summary-row">
              <span style={{ color: 'var(--s-text-secondary)' }}>Frete</span>
              <span style={{ color: 'var(--s-success)', fontWeight: 500 }}>
                {totalPrice >= 299 ? 'Grátis' : formatBRL(29.90)}
              </span>
            </div>

            <div className="store-cart-summary-row store-cart-summary-total">
              <span>Total</span>
              <span>{formatBRL(totalPrice + (totalPrice >= 299 ? 0 : 29.90))}</span>
            </div>

            <button
              className="store-btn store-btn-primary store-btn-lg"
              style={{ width: '100%', marginTop: 20 }}
              onClick={() => router.push('/checkout')}
            >
              Finalizar Compra <ArrowRight size={16} />
            </button>

            <Link
              href="/loja"
              style={{
                display: 'block',
                textAlign: 'center',
                marginTop: 12,
                fontSize: '0.85rem',
                color: 'var(--s-text-muted)',
                textDecoration: 'none',
              }}
            >
              ← Continuar comprando
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
