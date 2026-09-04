'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingBag, Search, Menu, MessageCircle, Truck, UserCheck, Heart, ShieldCheck } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useState } from 'react'

const WHATSAPP_ADMIN = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5545991562811'

export default function StoreHeader() {
  const { totalItems, subtotal } = useCart()
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/loja?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const formatBRL = (v) => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  const waLink = `https://wa.me/${WHATSAPP_ADMIN.replace(/\D/g, '')}?text=${encodeURIComponent('Olá! Gostaria de consultar medicamentos com o farmacêutico da Tesãi.')}`

  return (
    <>
      {/* 1. Top Announcement Bar */}
      <div className="di-topbar">
        <div className="store-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>RECEBA COM SEGURANÇA EM TODO O BRASIL • 100% LACRADO DE FÁBRICA</span>
          <div style={{ display: 'flex', gap: 16 }}>
            <a href="/suporte">Rastrear Pedido</a>
            <span>•</span>
            <a href={waLink} target="_blank" rel="noopener noreferrer">Atendimento Farmacêutico WhatsApp 💬</a>
          </div>
        </div>
      </div>

      {/* 2. Main Drogaria Iguatemi Header */}
      <header className="di-header">
        <div className="store-container">
          <div className="di-header-main">
            {/* Logo */}
            <Link href="/" className="di-logo-link">
              <div className="di-logo-symbol">T</div>
              <div className="di-logo-text">
                <span className="di-logo-title">Tesãi</span>
                <span className="di-logo-subtitle">Drogaria & CDE Import</span>
              </div>
            </Link>

            {/* Menu Button */}
            <Link href="/loja" className="di-menu-btn" style={{ textDecoration: 'none' }}>
              <Menu size={18} />
              <span>menu</span>
            </Link>

            {/* Search Bar */}
            <div className="di-search-wrapper">
              <form onSubmit={handleSearch} className="di-search-form">
                <input
                  type="text"
                  placeholder="O que você procura hoje? (ex: Tirzec, TG, Lipoless, Semaglutida...)"
                  className="di-search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="di-search-btn" aria-label="Buscar">
                  <Search size={16} />
                </button>
              </form>
            </div>

            {/* Right Action Links */}
            <div className="di-header-actions">
              <Link href="/suporte" className="di-action-item">
                <Truck size={20} color="#FDE047" />
                <div className="di-action-text">
                  <small>Acompanhar</small>
                  <strong>pedidos</strong>
                </div>
              </Link>

              <a href={waLink} target="_blank" rel="noopener noreferrer" className="di-action-item">
                <MessageCircle size={20} color="#4ADE80" />
                <div className="di-action-text">
                  <small>Falar no</small>
                  <strong>WhatsApp</strong>
                </div>
              </a>

              {/* Cart Button */}
              <Link href="/carrinho" className="di-cart-btn">
                <ShoppingBag size={20} />
                <div className="di-action-text">
                  <small>Sua Cesta</small>
                  <strong>{formatBRL(subtotal || 0)}</strong>
                </div>
                {totalItems > 0 && (
                  <span className="di-cart-badge">{totalItems}</span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
