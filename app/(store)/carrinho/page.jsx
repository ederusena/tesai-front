'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Minus, Plus, Trash2, ShoppingBag, ArrowRight, 
  ArrowLeft, ShieldCheck, Lock, Truck, ChevronRight 
} from 'lucide-react'
import { useCart } from '../../../src/context/CartContext'

const formatBRL = (v) => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

// Produtos recomendados no padrão Drogaria Iguatemi ("Quem comprou este item também levou")
const crossSellProducts = [
  {
    id: 991,
    nome: 'Agulhas BD Ultra-Fine 4mm (Caixa c/ 100)',
    precoBRL: 89.90,
    precoPix: 85.40,
    imagem: '/products/delgacil-semaglutida-0-5mg.webp',
    tag: 'ESSENCIAL'
  },
  {
    id: 992,
    nome: 'Álcool Swabs Sachês Estéreis 70%',
    precoBRL: 29.90,
    precoPix: 27.50,
    imagem: '/products/tirzec-2-5mg-frasco-ampola.webp',
    tag: 'RECOMENDADO'
  },
  {
    id: 993,
    nome: 'Bolsa Térmica de Gel com Termômetro',
    precoBRL: 59.90,
    precoPix: 54.90,
    imagem: '/products/lipoland-15mg-md-multidose.webp',
    tag: 'TRANSPORTE'
  }
]

export default function Carrinho() {
  const { items, updateQuantity, removeItem, totalPrice, totalItems, addItem } = useCart()
  const router = useRouter()
  const [cep, setCep] = useState('')
  const [cupom, setCupom] = useState('')
  const [cupomAplicado, setCupomAplicado] = useState(false)
  const [shippingCalculated, setShippingCalculated] = useState(false)

  const descontoCupom = cupomAplicado ? totalPrice * 0.05 : 0
  const totalComDesconto = totalPrice - descontoCupom

  if (items.length === 0) {
    return (
      <div className="store-container" style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ background: '#FFF', padding: '60px 40px', borderRadius: 16, border: '1px solid var(--di-border)', maxWidth: 500, margin: '0 auto', boxShadow: 'var(--di-shadow-sm)' }}>
          <div style={{ width: 70, height: 70, background: '#F3EEFB', color: '#4A1D96', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <ShoppingBag size={32} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--di-text)', marginBottom: 8 }}>Sua cesta está vazia</h2>
          <p style={{ color: 'var(--di-text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>
            Você ainda não adicionou nenhum medicamento ou injetável à sua cesta de compras.
          </p>
          <Link 
            href="/loja" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: 8, 
              background: '#4A1D96', 
              color: '#FFF', 
              padding: '12px 28px', 
              borderRadius: 999, 
              textDecoration: 'none', 
              fontWeight: 700, 
              fontSize: '0.9rem' 
            }}
          >
            <ArrowLeft size={16} /> Explorar Medicamentos
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: '#FAF8F5', minHeight: '80vh', padding: '30px 0 60px' }}>
      <div className="store-container">
        
        {/* 1. Header do Carrinho com Selo de Segurança */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--di-text)', margin: 0 }}>
            Meu carrinho ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#00875A', background: '#E6F6F0', padding: '6px 14px', borderRadius: 20, fontSize: '0.82rem', fontWeight: 700 }}>
            <ShieldCheck size={16} />
            <span>Compra 100% Segura e Criptografada</span>
          </div>
        </div>

        {/* 2. Grid de Conteúdo */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 32, alignItems: 'start' }}>
          
          {/* Lado Esquerdo: Tabela de Itens */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            
            {/* Box da Lista de Produtos */}
            <div style={{ background: '#FFFFFF', borderRadius: 12, border: '1px solid var(--di-border)', overflow: 'hidden', boxShadow: 'var(--di-shadow-xs)' }}>
              
              {/* Header da Tabela */}
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr 1.2fr 40px', padding: '14px 20px', background: '#F8F6F2', borderBottom: '1px solid var(--di-border)', fontSize: '0.82rem', fontWeight: 700, color: 'var(--di-text-secondary)', textTransform: 'uppercase' }}>
                <span>Produto</span>
                <span style={{ textAlign: 'center' }}>Quantidade</span>
                <span style={{ textAlign: 'right' }}>Preço</span>
                <span></span>
              </div>

              {/* Itens */}
              {items.map((item) => (
                <div 
                  key={item.key} 
                  style={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr 1.2fr 40px', padding: '20px', alignItems: 'center', borderBottom: '1px solid #F0EDE8' }}
                >
                  {/* Foto e Nome */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ width: 68, height: 68, borderRadius: 8, border: '1px solid #E5E7EB', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#FFF', flexShrink: 0 }}>
                      <img src={item.image || '/products/tirzec-15mg-md-multidose.webp'} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, margin: '0 0 4px', color: 'var(--di-text)' }}>
                        {item.name}
                      </h4>
                      <div style={{ fontSize: '0.78rem', color: '#00875A', fontWeight: 700 }}>
                        {formatBRL(item.price)} <small style={{ color: '#6B7280' }}>no pix</small>
                      </div>
                    </div>
                  </div>

                  {/* Contador de Quantidade */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--di-border)', borderRadius: 6, background: '#FFF' }}>
                      <button 
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        style={{ padding: '6px 10px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#4B5563' }}
                      >
                        <Minus size={13} />
                      </button>
                      <span style={{ padding: '0 6px', fontWeight: 700, fontSize: '0.88rem', minWidth: 20, textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        style={{ padding: '6px 10px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#4B5563' }}
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Preço Total do Item */}
                  <div style={{ textAlign: 'right', fontSize: '1rem', fontWeight: 800, color: '#4A1D96' }}>
                    {formatBRL(item.price * item.quantity)}
                  </div>

                  {/* Botão Remover */}
                  <div style={{ textAlign: 'right' }}>
                    <button 
                      onClick={() => removeItem(item.key)}
                      style={{ background: 'transparent', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: 4 }}
                      title="Remover produto"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* 3. Seção "Quem comprou este item também levou" (Drogaria Iguatemi Cross-sell) */}
            <div style={{ background: '#FFFFFF', borderRadius: 12, padding: '24px', border: '1px solid var(--di-border)' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--di-text)', marginBottom: 16 }}>
                Quem comprou este item também levou:
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                {crossSellProducts.map((p) => (
                  <div key={p.id} style={{ border: '1px solid var(--di-border)', borderRadius: 8, padding: 14, display: 'flex', flexDirection: 'column', background: '#FFF' }}>
                    <div style={{ height: 90, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                      <img src={p.imagem} alt={p.nome} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                    </div>
                    <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#4A1D96', background: '#F3EEFB', padding: '2px 6px', borderRadius: 4, width: 'fit-content', marginBottom: 4 }}>
                      {p.tag}
                    </span>
                    <h5 style={{ fontSize: '0.8rem', fontWeight: 700, margin: '0 0 6px', color: 'var(--di-text)', height: '2.4em', overflow: 'hidden' }}>
                      {p.nome}
                    </h5>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--di-text)', marginTop: 'auto' }}>
                      {formatBRL(p.precoPix)} <small style={{ fontSize: '0.7rem', color: '#00875A' }}>no pix</small>
                    </div>
                    <button 
                      onClick={() => addItem({ id: p.id, name: p.nome, price: p.precoBRL, image: p.imagem, quantity: 1 })}
                      style={{ marginTop: 8, background: '#00875A', color: '#FFF', border: 'none', padding: '6px', borderRadius: 6, fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
                    >
                      + Adicionar
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Lado Direito: Resumo do Pedido & Cupom (Estilo Drogaria Iguatemi) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Box de Frete & Prazo */}
            <div style={{ background: '#FFFFFF', borderRadius: 12, padding: '20px', border: '1px solid var(--di-border)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: 8, color: 'var(--di-text)' }}>
                Calcule frete e prazo:
              </span>
              <div style={{ display: 'flex', gap: 8 }}>
                <input 
                  type="text" 
                  placeholder="00000-000" 
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  style={{ flex: 1, padding: '10px 14px', border: '1px solid var(--di-border)', borderRadius: 6, fontSize: '0.88rem', outline: 'none' }}
                />
                <button 
                  onClick={() => setShippingCalculated(true)}
                  style={{ background: '#4A1D96', color: '#FFF', border: 'none', padding: '10px 18px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}
                >
                  OK
                </button>
              </div>
              {shippingCalculated && (
                <div style={{ marginTop: 10, fontSize: '0.8rem', color: '#00875A', background: '#E6F6F0', padding: 8, borderRadius: 6, fontWeight: 600 }}>
                  ✓ Envio Sedex Expresso com Controle Térmico: <strong>Frete Grátis</strong>
                </div>
              )}
            </div>

            {/* Box de Resumo Financeiro */}
            <div style={{ background: '#FFFFFF', borderRadius: 12, padding: '24px', border: '1px solid var(--di-border)', boxShadow: 'var(--di-shadow-sm)' }}>
              
              {/* Cupom */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #F0EDE8' }}>
                <input 
                  type="text" 
                  placeholder="Cupom de desconto (ex: TESAI5)" 
                  value={cupom}
                  onChange={(e) => setCupom(e.target.value)}
                  style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--di-border)', borderRadius: 6, fontSize: '0.82rem', textTransform: 'uppercase' }}
                />
                <button 
                  onClick={() => setCupomAplicado(true)}
                  style={{ background: '#37146D', color: '#FFF', border: 'none', padding: '8px 14px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: '0.82rem' }}
                >
                  Adicionar
                </button>
              </div>

              {/* Linhas de Valores */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.9rem', color: 'var(--di-text-secondary)' }}>
                <span>Subtotal ({totalItems} itens):</span>
                <span style={{ fontWeight: 700, color: 'var(--di-text)' }}>{formatBRL(totalPrice)}</span>
              </div>

              {cupomAplicado && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: '0.9rem', color: '#00875A' }}>
                  <span>Desconto Especial (5%):</span>
                  <span style={{ fontWeight: 700 }}>- {formatBRL(descontoCupom)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: '0.9rem', color: 'var(--di-text-secondary)' }}>
                <span>Frete Seguro Brasil:</span>
                <span style={{ color: '#00875A', fontWeight: 700 }}>Grátis</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 16, borderTop: '2px solid #F3EEFB', marginBottom: 20 }}>
                <div>
                  <strong style={{ fontSize: '1.1rem', color: 'var(--di-text)' }}>Total:</strong>
                  <div style={{ fontSize: '0.78rem', color: '#6B7280' }}>ou 6x sem juros de {formatBRL(totalComDesconto / 6)}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#4A1D96' }}>
                    {formatBRL(totalComDesconto)}
                  </span>
                </div>
              </div>

              {/* Botão Finalizar */}
              <Link 
                href="/checkout"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: 10, 
                  background: '#00875A', 
                  color: '#FFFFFF', 
                  padding: '16px', 
                  borderRadius: 8, 
                  fontWeight: 800, 
                  fontSize: '1.05rem', 
                  textDecoration: 'none', 
                  boxShadow: '0 6px 20px rgba(0, 135, 90, 0.3)', 
                  transition: 'all 0.2s ease' 
                }}
              >
                Finalizar pedido <ArrowRight size={18} />
              </Link>

              <div style={{ textAlign: 'center', marginTop: 14 }}>
                <Link href="/loja" style={{ color: '#4A1D96', fontSize: '0.84rem', fontWeight: 700, textDecoration: 'none' }}>
                  ← Comprar mais produtos
                </Link>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}
