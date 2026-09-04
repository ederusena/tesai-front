'use client'

import { useState } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5545999999999'

export default function SuportePage() {
  const [tab, setTab] = useState('email') // 'email' | 'rastrear'
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' })
  const [trackCode, setTrackCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null) // { type: 'success'|'error', message: string }

  // ── Formulário de email ──────────────────────────────────────────────────────

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmitEmail(e) {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch(`${API_URL}/api/store/support/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Erro ao enviar mensagem')

      setResult({ type: 'success', message: `✅ ${data.message}` })
      setForm({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch (err) {
      setResult({ type: 'error', message: `❌ ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  // ── Rastreamento de pedido ───────────────────────────────────────────────────

  async function handleTrack(e) {
    e.preventDefault()
    if (!trackCode.trim()) return

    const code = trackCode.trim().toUpperCase()
    setLoading(true)
    setResult(null)

    try {
      const res = await fetch(`${API_URL}/api/store/orders/${code}/status`)
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Pedido não encontrado')

      const statusMap = {
        pending: 'Aguardando',
        payment_waiting: 'Aguardando pagamento',
        paid: 'Pago — em processamento',
        processing: 'Em processamento',
        shipped: 'Despachado',
        delivered: 'Entregue',
        cancelled: 'Cancelado',
      }

      const tracking = data.shipment?.trackingCode
      setResult({
        type: 'success',
        message: [
          `📦 Pedido: #${data.orderNumber}`,
          `Status: ${statusMap[data.status] || data.status}`,
          tracking ? `Rastreio Correios: ${tracking}` : null,
        ].filter(Boolean).join('\n'),
      })
    } catch (err) {
      setResult({ type: 'error', message: `❌ ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  // ── WhatsApp link ────────────────────────────────────────────────────────────

  const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá! Preciso de ajuda com meu pedido.')}`

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div className="store-container" style={{ padding: '48px 16px', maxWidth: 720 }}>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>Central de Suporte</h1>
        <p style={{ color: 'var(--s-text-secondary)', fontSize: 15 }}>
          Rastreie seu pedido, envie uma mensagem ou fale conosco pelo WhatsApp.
        </p>
      </div>

      {/* WhatsApp CTA */}
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          background: '#25D366',
          color: '#fff',
          borderRadius: 'var(--s-radius)',
          padding: '16px 20px',
          marginBottom: 32,
          textDecoration: 'none',
          fontWeight: 600,
          fontSize: 15,
          boxShadow: 'var(--s-shadow)',
          transition: 'opacity var(--s-transition)',
        }}
        onMouseOver={e => e.currentTarget.style.opacity = '0.9'}
        onMouseOut={e => e.currentTarget.style.opacity = '1'}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        Falar agora pelo WhatsApp
        <span style={{ marginLeft: 'auto', fontSize: 13, opacity: 0.85 }}>Resposta rápida ⚡</span>
      </a>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: 'var(--s-bg-alt)', borderRadius: 'var(--s-radius)', padding: 4, marginBottom: 28 }}>
        {[
          { key: 'email', label: '✉️ Enviar mensagem' },
          { key: 'rastrear', label: '📦 Rastrear pedido' },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setResult(null) }}
            style={{
              flex: 1,
              padding: '10px 16px',
              border: 'none',
              borderRadius: 'var(--s-radius-sm)',
              cursor: 'pointer',
              fontWeight: tab === t.key ? 600 : 400,
              fontSize: 14,
              background: tab === t.key ? 'var(--s-bg-white)' : 'transparent',
              color: tab === t.key ? 'var(--s-text)' : 'var(--s-text-secondary)',
              boxShadow: tab === t.key ? 'var(--s-shadow-sm)' : 'none',
              transition: 'all var(--s-transition)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {result && (
        <div style={{
          padding: '14px 18px',
          borderRadius: 'var(--s-radius)',
          marginBottom: 24,
          background: result.type === 'success' ? '#F0FDF4' : '#FEF2F2',
          border: `1px solid ${result.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
          color: result.type === 'success' ? '#166534' : '#991B1B',
          fontSize: 14,
          whiteSpace: 'pre-line',
          lineHeight: 1.6,
        }}>
          {result.message}
        </div>
      )}

      {/* Tab: Email */}
      {tab === 'email' && (
        <form onSubmit={handleSubmitEmail} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Nome *" name="name" value={form.name} onChange={handleChange} placeholder="Seu nome completo" required />
            <Field label="Email *" name="email" type="email" value={form.email} onChange={handleChange} placeholder="seu@email.com" required />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="WhatsApp" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="(45) 99999-9999" />
            <Field label="Assunto *" name="subject" value={form.subject} onChange={handleChange} placeholder="Ex: Dúvida sobre pedido" required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--s-text)' }}>Mensagem *</label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Descreva sua dúvida ou problema em detalhes..."
              style={{
                padding: '12px 14px',
                border: '1px solid var(--s-border)',
                borderRadius: 'var(--s-radius)',
                fontSize: 14,
                fontFamily: 'inherit',
                color: 'var(--s-text)',
                background: 'var(--s-bg-white)',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color var(--s-transition)',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--s-accent)'}
              onBlur={e => e.target.style.borderColor = 'var(--s-border)'}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px 24px',
              background: 'var(--s-accent)',
              color: 'var(--s-accent-text)',
              border: 'none',
              borderRadius: 'var(--s-radius)',
              fontSize: 15,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity var(--s-transition)',
              alignSelf: 'flex-start',
            }}
          >
            {loading ? 'Enviando...' : 'Enviar mensagem →'}
          </button>
          <p style={{ fontSize: 13, color: 'var(--s-text-muted)' }}>
            Respondemos em até 24 horas por email. Para resposta imediata, use o WhatsApp acima.
          </p>
        </form>
      )}

      {/* Tab: Rastrear */}
      {tab === 'rastrear' && (
        <form onSubmit={handleTrack} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 13, fontWeight: 500 }}>Número do pedido</label>
            <div style={{ display: 'flex', gap: 10 }}>
              <input
                value={trackCode}
                onChange={e => setTrackCode(e.target.value)}
                placeholder="Ex: SPK-2026-12345"
                style={{
                  flex: 1,
                  padding: '12px 14px',
                  border: '1px solid var(--s-border)',
                  borderRadius: 'var(--s-radius)',
                  fontSize: 14,
                  fontFamily: 'inherit',
                  outline: 'none',
                  background: 'var(--s-bg-white)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--s-accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--s-border)'}
              />
              <button
                type="submit"
                disabled={loading || !trackCode.trim()}
                style={{
                  padding: '12px 20px',
                  background: 'var(--s-accent)',
                  color: 'var(--s-accent-text)',
                  border: 'none',
                  borderRadius: 'var(--s-radius)',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading || !trackCode.trim() ? 0.6 : 1,
                  whiteSpace: 'nowrap',
                }}
              >
                {loading ? 'Buscando...' : 'Rastrear →'}
              </button>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--s-text-muted)' }}>
            O número do pedido foi enviado para o seu WhatsApp após a compra (ex: SPK-2026-12345).
          </p>
        </form>
      )}
    </div>
  )
}

// ── Componente de campo reutilizável ──────────────────────────────────────────

function Field({ label, name, type = 'text', value, onChange, placeholder, required }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--s-text)' }}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        style={{
          padding: '12px 14px',
          border: '1px solid var(--s-border)',
          borderRadius: 'var(--s-radius)',
          fontSize: 14,
          fontFamily: 'inherit',
          color: 'var(--s-text)',
          background: 'var(--s-bg-white)',
          outline: 'none',
          transition: 'border-color 0.2s',
          width: '100%',
          boxSizing: 'border-box',
        }}
        onFocus={e => e.target.style.borderColor = 'var(--s-accent)'}
        onBlur={e => e.target.style.borderColor = 'var(--s-border)'}
      />
    </div>
  )
}
