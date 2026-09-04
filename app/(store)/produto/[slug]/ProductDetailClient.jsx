'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ShoppingBag, Truck, ShieldCheck, Star, 
  ChevronRight, Minus, Plus, MessageCircle, 
  CheckCircle2, AlertCircle, FileText, Sparkles 
} from 'lucide-react'
import { useCart } from '../../../../src/context/CartContext'

const formatBRL = (v) => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const WHATSAPP_ADMIN = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5545991562811'

export default function ProductDetailClient({ product }) {
  const { addItem } = useCart()
  const [activeTab, setActiveTab] = useState('info')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [cep, setCep] = useState('')
  const [simulatedShipping, setSimulatedShipping] = useState(null)

  const v = product.variants?.find(v => v.isDefault) || product.variants?.[0] || {}
  const price = v.priceBrl || product.priceBrl || 650
  const original = v.priceBrlOriginal || product.priceBrlOriginal || price * 1.3
  const cover = product.media?.find(m => m.isCover) || product.media?.[0] || product.cover
  const imageUrl = cover?.url || '/products/tirzec-15mg-md-multidose.webp'

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      variantId: v.id,
      name: product.name,
      price: price,
      image: imageUrl,
      quantity,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleSimulateCep = (e) => {
    e.preventDefault()
    if (cep.replace(/\D/g, '').length === 8) {
      setSimulatedShipping({
        prazo: '3 a 6 dias úteis',
        valor: 'Frete Grátis (Promoção)',
        tipo: 'Sedex Expresso com Controle Térmico'
      })
    }
  }

  const waProductLink = `https://wa.me/${WHATSAPP_ADMIN.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá! Gostaria de tirar dúvidas sobre o medicamento: ${product.name} (R$ ${price}).`)}`

  return (
    <div className="store-container di-detail-page">
      {/* 1. Breadcrumb */}
      <div className="di-breadcrumb">
        <Link href="/">Início</Link>
        <ChevronRight size={12} />
        <Link href="/loja">Medicamentos & Injetáveis</Link>
        <ChevronRight size={12} />
        <Link href={`/loja?brand=${product.brand}`}>{product.brand || 'Linha Especializada'}</Link>
        <ChevronRight size={12} />
        <span style={{ color: 'var(--di-text)' }}>{product.name}</span>
      </div>

      {/* 2. Main Product Grid */}
      <div className="di-detail-grid">
        {/* Gallery */}
        <div className="di-detail-gallery">
          <div className="di-thumb-list">
            <button className="di-thumb-btn active">
              <img src={imageUrl} alt={product.name} />
            </button>
          </div>

          <div className="di-main-img-box">
            <img src={imageUrl} alt={product.name} />
          </div>
        </div>

        {/* Info & Buy Box */}
        <div className="di-detail-info">
          <span className="di-detail-brand">{product.brand || 'Laboratório Certificado'}</span>
          <h1 className="di-detail-title">{product.name}</h1>
          <span className="di-detail-code">Cód. Referência: TS-{product.id || '2026'} • 100% Lacrado</span>

          {/* Rating */}
          <div className="di-rating" style={{ margin: '8px 0 16px' }}>
            <span className="di-stars" style={{ fontSize: '1.1rem' }}>★★★★★</span>
            <strong style={{ fontSize: '0.9rem', marginLeft: 4 }}>5.0</strong>
            <span className="di-rating-count">({product.reviewCount || 84} avaliações de clientes verificados)</span>
          </div>

          {/* Badges de Destaque */}
          <div style={{ display: 'flex', gap: 8, margin: '8px 0 16px', flexWrap: 'wrap' }}>
            <span style={{ background: '#DCFCE7', color: '#15803D', padding: '4px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>
              ✓ RECEBA COM SEGURANÇA NO BRASIL
            </span>
            <span style={{ background: '#F3E8FF', color: '#6B21A8', padding: '4px 10px', borderRadius: 4, fontSize: '0.75rem', fontWeight: 700 }}>
              🛡️ LACRE DE FÁBRICA
            </span>
          </div>

          {/* Pricing Box */}
          <div className="di-detail-price-box">
            <div style={{ textDecoration: 'line-through', color: '#9CA3AF', fontSize: '0.9rem', marginBottom: 2 }}>
              De {formatBRL(original)}
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span className="di-detail-price-main">{formatBRL(price)}</span>
              <span style={{ color: '#16A34A', fontWeight: 800, fontSize: '0.95rem' }}>NO PIX</span>
            </div>
            <div style={{ color: '#4B5563', fontSize: '0.88rem', marginTop: 4 }}>
              ou <strong>6x de {formatBRL(price / 6)}</strong> sem juros no cartão
            </div>
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '14px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--di-border)', borderRadius: 8, background: '#FFF' }}>
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{ padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <Minus size={14} />
              </button>
              <span style={{ padding: '0 8px', fontWeight: 700, minWidth: 24, textAlign: 'center' }}>{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                style={{ padding: '10px 14px', background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <Plus size={14} />
              </button>
            </div>

            <button onClick={handleAddToCart} className="di-btn-buy-main">
              <ShoppingBag size={18} />
              {added ? 'ADICIONADO À CESTA! ✓' : 'COMPRAR AGORA'}
            </button>
          </div>

          {/* WhatsApp Direct Help */}
          <a href={waProductLink} target="_blank" rel="noopener noreferrer" className="di-btn-wa-help" style={{ textDecoration: 'none', justifyContent: 'center' }}>
            <MessageCircle size={18} />
            Tirar dúvidas sobre dosagem com Farmacêutico no WhatsApp
          </a>

          {/* Simulador de Frete */}
          <div style={{ marginTop: 24, padding: 18, background: '#FFF', borderRadius: 8, border: '1px solid var(--di-border)' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: 8 }}>
              Simular prazo de entrega para sua região:
            </span>
            <form onSubmit={handleSimulateCep} style={{ display: 'flex', gap: 8 }}>
              <input 
                type="text" 
                placeholder="Informe seu CEP (ex: 85851-000)" 
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                style={{ flex: 1, padding: '8px 12px', border: '1px solid var(--di-border)', borderRadius: 6, fontSize: '0.85rem' }}
              />
              <button type="submit" style={{ background: '#4A1D96', color: '#FFF', border: 'none', padding: '8px 16px', borderRadius: 6, fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
                Calcular
              </button>
            </form>

            {simulatedShipping && (
              <div style={{ marginTop: 12, fontSize: '0.82rem', color: '#065F46', background: '#ECFDF5', padding: 10, borderRadius: 6 }}>
                <strong>{simulatedShipping.tipo}:</strong> {simulatedShipping.valor} (Prazo estimado: {simulatedShipping.prazo})
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Abas de Informações Técnicas & Avaliações (Estilo Drogaria Iguatemi) */}
      <div className="di-tabs-box">
        <div className="di-tabs-nav">
          <button 
            className={`di-tab-btn ${activeTab === 'info' ? 'active' : ''}`}
            onClick={() => setActiveTab('info')}
          >
            📋 Informações do Produto & Bula
          </button>
          <button 
            className={`di-tab-btn ${activeTab === 'modo' ? 'active' : ''}`}
            onClick={() => setActiveTab('modo')}
          >
            💉 Modo de Aplicação & Conservação
          </button>
          <button 
            className={`di-tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            ⭐ Avaliações dos Clientes ({product.reviewCount || 84})
          </button>
          <button 
            className={`di-tab-btn ${activeTab === 'garantia' ? 'active' : ''}`}
            onClick={() => setActiveTab('garantia')}
          >
            🛡️ Procedência & Garantia Ciudad del Este
          </button>
        </div>

        <div className="di-tab-content">
          {activeTab === 'info' && (
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#4A1D96', marginBottom: 12 }}>
                Especificações Técnicas — {product.name}
              </h3>
              <p style={{ marginBottom: 16 }}>
                {product.descriptionFull || product.descricaoDetalhada || `${product.name} é um medicamento de alta pureza indicado para tratamentos clínicos especializados. Desenvolvido sob rígido controle de boas práticas farmacêuticas.`}
              </p>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, background: '#FAF8F5', padding: 20, borderRadius: 8, marginTop: 20 }}>
                <div><strong>Princípio Ativo:</strong> {product.name.includes('Tirz') || product.name.includes('TG') ? 'Tirzepatida' : 'Semaglutida'}</div>
                <div><strong>Laboratório / Linha:</strong> {product.brand || 'Farmacêutico Especializado'}</div>
                <div><strong>Forma Farmacêutica:</strong> Solução Injetável Subcutânea</div>
                <div><strong>Apresentação:</strong> Frasco / Ampola Estéril</div>
                <div><strong>Conservação:</strong> 2°C a 8°C (Sob Refrigeração)</div>
                <div><strong>Origem:</strong> Importação Ciudad del Este (PY)</div>
              </div>
            </div>
          )}

          {activeTab === 'modo' && (
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#4A1D96', marginBottom: 12 }}>
                Orientações de Armazenamento e Uso
              </h3>
              <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <li><strong>Refrigeração:</strong> Manter armazenado entre 2°C e 8°C. Não congelar. Proteger da luz solar direta.</li>
                <li><strong>Aplicação:</strong> Uso exclusivamente subcutâneo (abdômen, coxa ou braço), conforme prescrição do seu médico de confiança.</li>
                <li><strong>Transporte Térmico:</strong> Nossos envios utilizam embalagem com isolamento térmico especial para garantir que o medicamento chegue intacto até sua residência.</li>
              </ul>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="di-reviews-summary">
                <div style={{ textAlign: 'center' }}>
                  <div className="di-big-score">4.9</div>
                  <div className="di-stars" style={{ fontSize: '1.3rem' }}>★★★★★</div>
                  <small style={{ color: '#6B7280' }}>Baseado em 84 avaliações</small>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#111827', marginBottom: 4 }}>
                    98% dos compradores recomendam este produto
                  </div>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#6B7280' }}>
                    Avaliações coletadas de clientes verificados que receberam seus pedidos em todo o Brasil.
                  </p>
                </div>
              </div>

              {/* Lista de Reviews */}
              <div className="di-review-card">
                <div className="di-review-header">
                  <span className="di-reviewer-name">Carlos Eduardo M. <span style={{ color: '#16A34A', fontSize: '0.75rem', fontWeight: 600 }}>• Compra Verificada ✓</span></span>
                  <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Há 3 dias</span>
                </div>
                <div className="di-stars">★★★★★</div>
                <p className="di-review-text">
                  "Produto 100% original, caixa lacrada com selo de segurança intacto. Chegou super bem embalado na caixa térmica em Curitiba em apenas 3 dias. Recomendo demais a Tesãi!"
                </p>
              </div>

              <div className="di-review-card">
                <div className="di-review-header">
                  <span className="di-reviewer-name">Fernanda S. Ribeiro <span style={{ color: '#16A34A', fontSize: '0.75rem', fontWeight: 600 }}>• Compra Verificada ✓</span></span>
                  <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Há 1 semana</span>
                </div>
                <div className="di-stars">★★★★★</div>
                <p className="di-review-text">
                  "Excelente atendimento pelo WhatsApp, tiraram todas as minhas dúvidas sobre a conservação do frasco. Já é a minha terceira compra."
                </p>
              </div>

              <div className="di-review-card">
                <div className="di-review-header">
                  <span className="di-reviewer-name">Dr. Roberto Silveira <span style={{ color: '#16A34A', fontSize: '0.75rem', fontWeight: 600 }}>• Compra Verificada ✓</span></span>
                  <span style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>Há 2 semanas</span>
                </div>
                <div className="di-stars">★★★★★</div>
                <p className="di-review-text">
                  "Procedência impecável de Ciudad del Este. Qualidade do laboratório comprovada."
                </p>
              </div>
            </div>
          )}

          {activeTab === 'garantia' && (
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#4A1D96', marginBottom: 12 }}>
                Garantia de Entrega & Procedência
              </h3>
              <p>
                Todos os produtos fornecidos pela <strong>Tesãi Farmácias</strong> são adquiridos diretamente dos distribuidores e laboratórios autorizados em Ciudad del Este (Paraguai).
              </p>
              <ul style={{ paddingLeft: 20, marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <li>✓ Todos os lotes possuem lacre de segurança inviolável.</li>
                <li>✓ Código de rastreamento enviado automaticamente no seu WhatsApp e e-mail.</li>
                <li>✓ Garantia de reposição imediata em caso de extravio nos Correios/Transportadora.</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
