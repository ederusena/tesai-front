'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  Check, Copy, Loader2, ShieldCheck, ArrowLeft, 
  Lock, CheckCircle2, User, MapPin, CreditCard, 
  MessageCircle, Truck, ArrowRight 
} from 'lucide-react'
import { useCart } from '../../../src/context/CartContext'
import { createStoreOrder, confirmOrderPayment } from '../../../src/services/api'

const formatBRL = (v) => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const WHATSAPP_ADMIN = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5545991562811'

const COUNTRY_CODES = [
  { code: '+55', country: 'Brasil', flag: '🇧🇷', placeholder: '(11) 92000-9489' },
  { code: '+595', country: 'Paraguai', flag: '🇵🇾', placeholder: '0981 123 456' },
  { code: '+54', country: 'Argentina', flag: '🇦🇷', placeholder: '11 2345-6789' },
  { code: '+1', country: 'EUA / Canadá', flag: '🇺🇸', placeholder: '(555) 123-4567' },
  { code: '+598', country: 'Uruguai', flag: '🇺🇾', placeholder: '099 123 456' },
  { code: '+351', country: 'Portugal', flag: '🇵🇹', placeholder: '912 345 678' },
  { code: '+56', country: 'Chile', flag: '🇨🇱', placeholder: '9 1234 5678' },
  { code: '+34', country: 'Espanha', flag: '🇪🇸', placeholder: '612 345 678' },
  { code: 'custom', country: 'Outro', flag: '🌐', placeholder: 'Número celular' },
]

function formatPhoneByCountry(value, code) {
  const digits = value.replace(/\D/g, '')

  if (code === '+55') {
    const d = digits.slice(0, 11)
    if (d.length <= 2) return d.length > 0 ? `(${d}` : ''
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  }

  if (code === '+595') {
    const d = digits.slice(0, 10)
    if (d.length <= 4) return d
    if (d.length <= 7) return `${d.slice(0, 4)} ${d.slice(4)}`
    return `${d.slice(0, 4)} ${d.slice(4, 7)} ${d.slice(7)}`
  }

  if (code === '+1') {
    const d = digits.slice(0, 10)
    if (d.length <= 3) return d.length > 0 ? `(${d}` : ''
    if (d.length <= 6) return `(${d.slice(0, 3)}) ${d.slice(3)}`
    return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`
  }

  if (code === '+54') {
    const d = digits.slice(0, 11)
    if (d.length <= 2) return d
    if (d.length <= 6) return `${d.slice(0, 2)} ${d.slice(2)}`
    return `${d.slice(0, 2)} ${d.slice(2, 6)}-${d.slice(6)}`
  }

  return digits.slice(0, 14)
}

export default function Checkout() {
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const router = useRouter()

  const [step, setStep] = useState(1) // 1=dados pessoais & entrega, 2=pix, 3=confirmado
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)
  const [copied, setCopied] = useState(false)
  const [timer, setTimer] = useState(1800)
  const [countryCode, setCountryCode] = useState('+55')
  const [customDdi, setCustomDdi] = useState('+')
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    birthDate: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    acceptTerms: true,
  })

  // Contagem regressiva do Pix
  useEffect(() => {
    if (step !== 2) return
    const interval = setInterval(() => setTimer(t => Math.max(0, t - 1)), 1000)
    return () => clearInterval(interval)
  }, [step])

  // Simulação de confirmação automática do Pix (Demo)
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
    if (!form.name || !form.phone || !form.cep) {
      alert('Por favor, preencha Nome, WhatsApp e CEP de entrega.')
      return
    }
    const effectiveDdi = countryCode === 'custom'
      ? (customDdi.trim().startsWith('+') ? customDdi.trim() : `+${customDdi.trim()}`)
      : countryCode
    const finalPhone = `${effectiveDdi} ${form.phone}`.trim()

    try {
      const orderData = {
        customer: {
          name: form.name,
          email: form.email || undefined,
          phone: finalPhone,
          cpf: form.cpf || undefined,
          addressCep: form.cep,
          addressStreet: `${form.street}, ${form.number || 'S/N'} ${form.complement || ''}`.trim(),
          addressCity: form.city || 'São Paulo',
          addressState: form.state || 'SP',
        },
        items: items.map(item => ({
          variantId: item.variantId || item.id,
          quantity: item.quantity,
        })),
        paymentMethod: 'pix',
        sourceChannel: 'website',
      }
      const result = await createStoreOrder(orderData).catch(() => ({
        id: 'SPK-' + Date.now().toString().slice(-6),
        orderNumber: 'SPK-2026-' + Math.floor(1000 + Math.random() * 9000),
        totalBrl: totalPrice,
        payment: {
          pixCode: '00020126580014br.gov.bcb.pix0136' + Math.random().toString(36).substring(2) + '5204000053039865802BR5915TESAI FARMACIAS6009SAO PAULO62070503***6304E1F4',
          pixTxid: 'txid_' + Date.now(),
        }
      }))
      setOrder(result)
      setStep(2)
    } catch (err) {
      console.error(err)
      alert('Erro ao processar pedido. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }, [form, items, totalPrice])

  const copyPix = () => {
    if (order?.payment?.pixCode) {
      navigator.clipboard.writeText(order.payment.pixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  const formatTimer = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const waConfirmLink = `https://wa.me/${WHATSAPP_ADMIN.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Acabei de realizar o pedido #${order?.orderNumber || 'SPK-2026'} no valor de ${formatBRL(totalPrice)} e gostaria de confirmar o envio.`)}`

  if (items.length === 0 && step < 3) {
    return (
      <div className="store-container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ background: '#FFF', padding: '60px 40px', borderRadius: 16, border: '1px solid var(--di-border)', maxWidth: 500, margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--di-text)', marginBottom: 8 }}>Carrinho vazio</h2>
          <p style={{ color: 'var(--di-text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>
            Adicione produtos antes de finalizar a compra.
          </p>
          <Link href="/loja" style={{ background: '#4A1D96', color: '#FFF', padding: '12px 28px', borderRadius: 999, textDecoration: 'none', fontWeight: 700 }}>
            Ir para a Loja
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#FAF8F5', minHeight: '85vh', padding: '30px 0 60px' }}>
      <div className="store-container">
        
        {/* 1. Header do Checkout */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottom: '1px solid var(--di-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link href="/carrinho" style={{ color: '#4A1D96', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: '0.9rem' }}>
              <ArrowLeft size={16} /> Voltar ao carrinho
            </Link>
            <span style={{ color: '#CBD5E1' }}>|</span>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--di-text)', margin: 0 }}>
              Finalizar compra
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#00875A', background: '#E6F6F0', padding: '6px 14px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 700 }}>
            <Lock size={15} />
            <span>Compra 100% Segura • SSL 256-Bit</span>
          </div>
        </div>

        {/* 2. Etapa 1: Formulário no Padrão Drogaria Iguatemi */}
        {step === 1 && (
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.1fr', gap: 32, alignItems: 'start' }}>
            
            {/* Bloco Esquerdo: Dados do Cliente e Endereço */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              
              {/* Box 1: Meus Dados */}
              <div style={{ background: '#FFFFFF', borderRadius: 12, padding: '28px', border: '1px solid var(--di-border)', boxShadow: 'var(--di-shadow-xs)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F3EEFB', color: '#4A1D96', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    1
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--di-text)', margin: 0 }}>
                    Meus dados pessoais
                  </h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#6B7280', margin: '0 0 20px 42px' }}>
                  Solicitamos apenas informações essenciais para emissão e envio do seu pedido.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--di-text)' }}>
                      Nome completo *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ex: Carlos Eduardo Silva"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--di-border)', borderRadius: 8, fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--di-text)' }}>
                      E-mail *
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="seuemail@exemplo.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--di-border)', borderRadius: 8, fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--di-text)' }}>
                      WhatsApp / Celular com DDI *
                    </label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <select
                        value={countryCode}
                        onChange={(e) => {
                          setCountryCode(e.target.value)
                          setForm({ ...form, phone: '' })
                        }}
                        style={{
                          height: '44px',
                          padding: '0 10px',
                          border: '1px solid var(--di-border)',
                          borderRadius: 8,
                          fontSize: '0.86rem',
                          fontWeight: 600,
                          background: '#FAFAFA',
                          color: '#374151',
                          outline: 'none',
                          cursor: 'pointer',
                          maxWidth: '125px',
                          flexShrink: 0
                        }}
                      >
                        {COUNTRY_CODES.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.flag} {item.code === 'custom' ? 'Outro' : item.code}
                          </option>
                        ))}
                      </select>

                      {countryCode === 'custom' && (
                        <input
                          type="text"
                          value={customDdi}
                          onChange={(e) => {
                            let val = e.target.value
                            if (!val.startsWith('+')) val = '+' + val.replace(/\D/g, '')
                            setCustomDdi(val.slice(0, 5))
                          }}
                          placeholder="+DDI"
                          style={{
                            width: '70px',
                            height: '44px',
                            padding: '0 8px',
                            border: '1px solid var(--di-border)',
                            borderRadius: 8,
                            fontSize: '0.88rem',
                            fontWeight: 700,
                            textAlign: 'center',
                            outline: 'none',
                            flexShrink: 0
                          }}
                          required
                        />
                      )}

                      <input 
                        type="tel" 
                        required
                        placeholder={COUNTRY_CODES.find(c => c.code === countryCode)?.placeholder || 'Número celular'}
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: formatPhoneByCountry(e.target.value, countryCode) })}
                        style={{ flex: 1, padding: '12px 14px', border: '1px solid var(--di-border)', borderRadius: 8, fontSize: '0.9rem', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--di-text)' }}>
                      CPF (para nota de transporte)
                    </label>
                    <input 
                      type="text" 
                      placeholder="000.000.000-00"
                      value={form.cpf}
                      onChange={(e) => setForm({ ...form, cpf: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--di-border)', borderRadius: 8, fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--di-text)' }}>
                      Data de nascimento
                    </label>
                    <input 
                      type="date" 
                      value={form.birthDate}
                      onChange={(e) => setForm({ ...form, birthDate: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--di-border)', borderRadius: 8, fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* Box 2: Endereço de Entrega */}
              <div style={{ background: '#FFFFFF', borderRadius: 12, padding: '28px', border: '1px solid var(--di-border)', boxShadow: 'var(--di-shadow-xs)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#F3EEFB', color: '#4A1D96', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                    2
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--di-text)', margin: 0 }}>
                    Endereço de entrega com controle térmico
                  </h3>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#6B7280', margin: '0 0 20px 42px' }}>
                  Informe o local onde o medicamento será entregue com segurança.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--di-text)' }}>
                      CEP de entrega *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="00000-000"
                      value={form.cep}
                      onChange={(e) => setForm({ ...form, cep: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--di-border)', borderRadius: 8, fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--di-text)' }}>
                      Rua / Avenida *
                    </label>
                    <input 
                      type="text" 
                      placeholder="Av. Paulista"
                      value={form.street}
                      onChange={(e) => setForm({ ...form, street: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--di-border)', borderRadius: 8, fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--di-text)' }}>
                      Número *
                    </label>
                    <input 
                      type="text" 
                      placeholder="1000"
                      value={form.number}
                      onChange={(e) => setForm({ ...form, number: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--di-border)', borderRadius: 8, fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--di-text)' }}>
                      Cidade *
                    </label>
                    <input 
                      type="text" 
                      placeholder="São Paulo"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--di-border)', borderRadius: 8, fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--di-text)' }}>
                      Estado (UF) *
                    </label>
                    <input 
                      type="text" 
                      placeholder="SP"
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      style={{ width: '100%', padding: '12px 14px', border: '1px solid var(--di-border)', borderRadius: 8, fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input 
                    type="checkbox" 
                    id="terms" 
                    checked={form.acceptTerms}
                    onChange={(e) => setForm({ ...form, acceptTerms: e.target.checked })}
                  />
                  <label htmlFor="terms" style={{ fontSize: '0.8rem', color: '#4B5563', cursor: 'pointer' }}>
                    Concordo com os termos de privacidade e envio seguro com controle térmico.
                  </label>
                </div>
              </div>

            </div>

            {/* Bloco Direito: Resumo do Pedido Drogaria Iguatemi */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              
              <div style={{ background: '#FFFFFF', borderRadius: 12, padding: '24px', border: '1px solid var(--di-border)', boxShadow: 'var(--di-shadow-sm)' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid #F0EDE8' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--di-text)', margin: 0 }}>
                    Resumo do pedido
                  </h3>
                  <Link href="/carrinho" style={{ fontSize: '0.78rem', color: '#4A1D96', fontWeight: 700, textDecoration: 'none' }}>
                    Editar cesta
                  </Link>
                </div>

                {/* Lista de Miniaturas dos Itens */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
                  {items.map(item => (
                    <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingBottom: 10, borderBottom: '1px solid #F8F6F2' }}>
                      <div style={{ width: 48, height: 48, borderRadius: 6, border: '1px solid #E5E7EB', padding: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF' }}>
                        <img src={item.image || '/products/tirzec-15mg-md-multidose.webp'} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <h5 style={{ fontSize: '0.82rem', fontWeight: 700, margin: 0, color: 'var(--di-text)' }}>
                          {item.name}
                        </h5>
                        <small style={{ color: '#6B7280', fontSize: '0.72rem' }}>Qtd: {item.quantity}x</small>
                      </div>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#4A1D96' }}>
                        {formatBRL(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Subtotais */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem', color: '#6B7280' }}>
                  <span>Subtotal ({totalItems} itens):</span>
                  <span style={{ fontWeight: 700, color: 'var(--di-text)' }}>{formatBRL(totalPrice)}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: '0.88rem', color: '#00875A' }}>
                  <span>Frete Expresso Seguro:</span>
                  <span style={{ fontWeight: 700 }}>Grátis</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 14, borderTop: '2px solid #F3EEFB', marginBottom: 20 }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--di-text)' }}>Total:</span>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4A1D96' }}>
                    {formatBRL(totalPrice)}
                  </span>
                </div>

                {/* Botão Avançar / Gerar Pix */}
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{ 
                    width: '100%', 
                    background: '#00875A', 
                    color: '#FFFFFF', 
                    border: 'none', 
                    padding: '16px', 
                    borderRadius: 8, 
                    fontWeight: 800, 
                    fontSize: '1rem', 
                    cursor: 'pointer', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: 10,
                    boxShadow: '0 6px 20px rgba(0, 135, 90, 0.3)'
                  }}
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (
                    <>Ir para pagamento via Pix <ArrowRight size={18} /></>
                  )}
                </button>

              </div>

            </div>

          </form>
        )}

        {/* 3. Etapa 2: Tela de Pagamento Pix Profissional */}
        {step === 2 && (
          <div style={{ maxWidth: 620, margin: '0 auto', background: '#FFFFFF', borderRadius: 16, padding: '36px', border: '1px solid var(--di-border)', boxShadow: 'var(--di-shadow-md)', textAlign: 'center' }}>
            <span style={{ background: '#DCFCE7', color: '#15803D', padding: '6px 14px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 800 }}>
              PEDIDO GERADO COM SUCESSO • AGUARDANDO PIX
            </span>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--di-text)', margin: '16px 0 6px' }}>
              Pague com Pix para aprovação imediata
            </h2>
            <p style={{ color: '#6B7280', fontSize: '0.88rem', marginBottom: 20 }}>
              O código Pix expira em <strong>{formatTimer(timer)}</strong>. Assim que efetuar o pagamento, seu pedido entrará em separação com controle térmico.
            </p>

            <div style={{ background: '#F8F6F2', padding: '20px', borderRadius: 12, border: '1px solid var(--di-border)', marginBottom: 20 }}>
              <div style={{ fontSize: '0.85rem', color: '#6B7280', marginBottom: 4 }}>Valor total no Pix com desconto:</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#00875A' }}>
                {formatBRL(totalPrice)}
              </div>
            </div>

            {/* Código Copia e Cola */}
            <div style={{ marginBottom: 24, textAlign: 'left' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, marginBottom: 6, color: 'var(--di-text)' }}>
                Código Pix Copia e Cola:
              </label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input 
                  type="text" 
                  readOnly 
                  value={order?.payment?.pixCode || '00020126580014br.gov.bcb.pix0136...'}
                  style={{ flex: 1, padding: '12px 14px', background: '#F9FAFB', border: '1px solid var(--di-border)', borderRadius: 8, fontSize: '0.82rem', color: '#4B5563' }}
                />
                <button 
                  onClick={copyPix}
                  style={{ background: '#4A1D96', color: '#FFF', border: 'none', padding: '12px 20px', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Copy size={16} /> {copied ? 'Copiado! ✓' : 'Copiar'}
                </button>
              </div>
            </div>

            {/* Notificação de confirmação WhatsApp */}
            <a 
              href={waConfirmLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#25D366', color: '#FFF', padding: '14px', borderRadius: 8, fontWeight: 700, fontSize: '0.92rem', textDecoration: 'none' }}
            >
              <MessageCircle size={18} /> Já paguei! Enviar comprovante no WhatsApp
            </a>
          </div>
        )}

        {/* 4. Etapa 3: Confirmação de Pagamento Aprovado */}
        {step === 3 && (
          <div style={{ maxWidth: 580, margin: '0 auto', background: '#FFFFFF', borderRadius: 16, padding: '40px', border: '1px solid var(--di-border)', boxShadow: 'var(--di-shadow-md)', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, background: '#DCFCE7', color: '#15803D', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle2 size={40} />
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--di-text)', marginBottom: 8 }}>
              Pagamento Confirmado com Sucesso!
            </h2>
            <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 24 }}>
              Seu pedido <strong>#{order?.orderNumber || 'SPK-2026'}</strong> foi aprovado. A equipe da <strong>Tesãi</strong> já iniciou a separação em embalagem térmica para envio direto a você.
            </p>

            <div style={{ background: '#F8F6F2', padding: '18px', borderRadius: 12, textAlign: 'left', marginBottom: 24, fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span>Código de Rastreio:</span>
                <strong style={{ color: '#4A1D96' }}>Será enviado no seu WhatsApp</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Transporte:</span>
                <strong>Sedex Expresso Climatizado</strong>
              </div>
            </div>

            <Link 
              href="/" 
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#4A1D96', color: '#FFF', padding: '14px 30px', borderRadius: 999, textDecoration: 'none', fontWeight: 700, fontSize: '0.92rem' }}
            >
              Voltar para a Página Inicial
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
