'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, Copy, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react'
import { useCart } from '../../../src/context/CartContext'
import { createStoreOrder, confirmOrderPayment } from '../../../src/services/api'

const formatBRL = (v) => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()

  const [step, setStep] = useState(1) // 1=form, 2=pix, 3=confirmed
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)
  const [copied, setCopied] = useState(false)
  const [timer, setTimer] = useState(1800)
  const [form, setForm] = useState({
    name: '', email: '', phone: '', cpf: '',
    cep: '', street: '', city: '', state: '',
  })

  const shippingCost = totalPrice >= 299 ? 0 : 29.90
  const grandTotal = totalPrice + shippingCost

  // Timer countdown
  useEffect(() => {
    if (step !== 2) return
    const interval = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(interval)
  }, [step])

  // Auto confirm PIX after 6s (demo)
  useEffect(() => {
    if (step !== 2 || !order) return
    const timeout = setTimeout(async () => {
      try {
        await confirmOrderPayment(order.id, order.payment?.pixTxid || 'demo-txid')
      } catch (e) { /* ignore */ }
      setStep(3)
      clearCart()
    }, 6000)
    return () => clearTimeout(timeout)
  }, [step, order, clearCart])

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()
    if (!form.name || !form.phone || !form.cep) return
    setLoading(true)
    try {
      const orderData = {
        customer: {
          name: form.name,
          email: form.email || undefined,
          phone: form.phone,
          cpf: form.cpf || undefined,
          addressCep: form.cep,
          addressStreet: form.street || undefined,
          addressCity: form.city || undefined,
          addressState: form.state || undefined,
        },
        items: items.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
        paymentMethod: 'pix',
        sourceChannel: 'website',
      }
      const result = await createStoreOrder(orderData)
      setOrder(result)
      setStep(2)
    } catch (err) {
      console.error(err)
      alert('Erro ao criar pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [form, items])

  const formatTimer = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const pixCode = order?.payment?.pixCode || 'SPARK-PIX-DEMO-' + Date.now()

  if (items.length === 0 && step < 3) {
    return (
      <div className="store-container">
        <div className="store-empty" style={{ padding: '120px 0' }}>
          <h3>Carrinho vazio</h3>
          <p>Adicione produtos antes de finalizar a compra.</p>
          <Link href="/loja" className="store-btn store-btn-primary" style={{ marginTop: 16 }}>
            Ir para a Loja
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="store-container">
      <div className="store-checkout">
        {step < 3 && (
          <div style={{ marginBottom: 24 }}>
            <Link href="/carrinho" style={{ fontSize: '0.85rem', color: 'var(--s-text-muted)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <ArrowLeft size={14} /> Voltar ao carrinho
            </Link>
          </div>
        )}

        <h1>{step === 3 ? 'Pedido Confirmado!' : 'Checkout'}</h1>

        <div className="store-checkout-layout">
          {/* Left Column */}
          <div>
            {step === 1 && (
              <form onSubmit={handleSubmit}>
                {/* Customer Info */}
                <div className="store-checkout-section">
                  <div className="store-checkout-section-title">
                    <span className="store-step-number">1</span>
                    Dados Pessoais
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="store-form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="store-form-label">Nome Completo *</label>
                      <input className="store-form-input" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="store-form-group">
                      <label className="store-form-label">E-mail</label>
                      <input className="store-form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="store-form-group">
                      <label className="store-form-label">WhatsApp *</label>
                      <input className="store-form-input" required placeholder="+55 11 99999-0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="store-form-group">
                      <label className="store-form-label">CPF</label>
                      <input className="store-form-input" value={form.cpf} onChange={e => setForm({ ...form, cpf: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="store-checkout-section">
                  <div className="store-checkout-section-title">
                    <span className="store-step-number">2</span>
                    Endereço de Entrega
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div className="store-form-group">
                      <label className="store-form-label">CEP *</label>
                      <input className="store-form-input" required placeholder="00000-000" value={form.cep} onChange={e => setForm({ ...form, cep: e.target.value })} />
                    </div>
                    <div className="store-form-group" style={{ gridColumn: '1 / -1' }}>
                      <label className="store-form-label">Rua / Endereço</label>
                      <input className="store-form-input" value={form.street} onChange={e => setForm({ ...form, street: e.target.value })} />
                    </div>
                    <div className="store-form-group">
                      <label className="store-form-label">Cidade</label>
                      <input className="store-form-input" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                    </div>
                    <div className="store-form-group">
                      <label className="store-form-label">Estado</label>
                      <input className="store-form-input" value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} />
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="store-checkout-section">
                  <div className="store-checkout-section-title">
                    <span className="store-step-number">3</span>
                    Pagamento
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '16px', background: 'var(--s-bg-alt)', borderRadius: 'var(--s-radius)', border: '2px solid var(--s-accent)' }}>
                    <div style={{ width: 40, height: 40, background: 'var(--s-accent)', color: 'var(--s-accent-text)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                      PIX
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>Pix — Aprovação Instantânea</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--s-text-muted)' }}>Pagamento confirmado na hora</div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="store-btn store-btn-primary store-btn-lg"
                  style={{ width: '100%', marginTop: 8 }}
                  disabled={loading}
                >
                  {loading ? <><Loader2 size={18} className="animate-spin" /> Processando...</> : <>Gerar Pix — {formatBRL(grandTotal)}</>}
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="store-checkout-section">
                <div className="store-pix-container">
                  <div className="store-pix-qr">
                    <div style={{ fontSize: '4rem' }}>📱</div>
                  </div>

                  <div style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 8 }}>
                    Código Pix Copia e Cola
                  </div>
                  <div className="store-pix-code">{pixCode}</div>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      type="button"
                      className="store-btn store-btn-secondary store-btn-sm"
                      onClick={() => { navigator.clipboard.writeText(pixCode); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
                    >
                      {copied ? <><Check size={14} /> Copiado!</> : <><Copy size={14} /> Copiar Código Pix</>}
                    </button>

                    {order?.whatsappUrl && (
                      <a
                        href={order.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="store-btn store-btn-sm"
                        style={{
                          background: '#25D366',
                          color: '#fff',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 6,
                          fontWeight: 600,
                        }}
                      >
                        📲 Enviar Comprovante / Pedido no WhatsApp
                      </a>
                    )}
                  </div>

                  <div style={{ margin: '24px 0 8px', fontSize: '0.8rem', color: 'var(--s-text-muted)' }}>
                    Tempo restante para pagamento
                  </div>
                  <div className="store-pix-timer">{formatTimer(timer)}</div>

                  <div className="store-pix-waiting">
                    <Loader2 size={16} className="animate-spin" />
                    Aguardando confirmação do pagamento...
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="store-checkout-section">
                <div className="store-pix-confirmed">
                  <motion.div
                    className="store-pix-confirmed-icon"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  >
                    <Check size={32} />
                  </motion.div>
                  <h3>Pagamento Confirmado!</h3>
                  <p style={{ color: 'var(--s-text-secondary)', marginBottom: 8 }}>
                    Pedido #{order?.orderNumber || 'N/A'}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--s-text-muted)', marginBottom: 20 }}>
                    Seus dados e itens já foram registrados e enviados para o WhatsApp do nosso atendimento.
                  </p>

                  {order?.whatsappUrl && (
                    <div style={{ marginBottom: 24 }}>
                      <a
                        href={order.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="store-btn store-btn-lg"
                        style={{
                          background: '#25D366',
                          color: '#fff',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 8,
                          fontWeight: 700,
                          width: '100%',
                          maxWidth: 360,
                          margin: '0 auto',
                        }}
                      >
                        💬 Falar com Atendente no WhatsApp
                      </a>
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                    <Link href="/loja" className="store-btn store-btn-primary">
                      Continuar Comprando
                    </Link>
                    <Link href="/dashboard/pedidos" className="store-btn store-btn-secondary">
                      Ver Pedidos
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="store-cart-summary">
            <h3>Seu Pedido</h3>

            {items.map((item) => (
              <div key={item.key} className="store-cart-summary-row" style={{ gap: 8 }}>
                <span style={{ color: 'var(--s-text-secondary)', flex: 1, fontSize: '0.85rem' }}>
                  {item.name} × {item.quantity}
                </span>
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{formatBRL(item.price * item.quantity)}</span>
              </div>
            ))}

            <div style={{ borderTop: '1px solid var(--s-border)', margin: '12px 0' }} />

            <div className="store-cart-summary-row">
              <span style={{ color: 'var(--s-text-secondary)' }}>Subtotal</span>
              <span>{formatBRL(totalPrice)}</span>
            </div>

            <div className="store-cart-summary-row">
              <span style={{ color: 'var(--s-text-secondary)' }}>Frete</span>
              <span style={{ color: shippingCost === 0 ? 'var(--s-success)' : 'inherit', fontWeight: 500 }}>
                {shippingCost === 0 ? 'Grátis' : formatBRL(shippingCost)}
              </span>
            </div>

            <div className="store-cart-summary-row store-cart-summary-total">
              <span>Total</span>
              <span>{formatBRL(grandTotal)}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 16, padding: '10px 12px', background: 'var(--s-bg)', borderRadius: 'var(--s-radius)', fontSize: '0.75rem', color: 'var(--s-text-muted)' }}>
              <ShieldCheck size={14} />
              Compra 100% segura com criptografia de dados
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
