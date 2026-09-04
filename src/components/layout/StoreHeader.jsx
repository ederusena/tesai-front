'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingBag, Search, PlusCircle, MessageCircle, X, ShieldCheck } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useState } from 'react'

const WHATSAPP_ADMIN = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5545991562811'

export default function StoreHeader() {
  const { totalItems } = useCart()
  const router = useRouter()
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/loja?search=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setSearchOpen(false)
    }
  }

  const waHeaderLink = `https://wa.me/${WHATSAPP_ADMIN.replace(/\D/g, '')}?text=${encodeURIComponent('Olá! Gostaria de consultar a disponibilidade de medicamentos e produtos de Ciudad del Este.')}`

  return (
    <>
      {/* Announcement Bar */}
      <div className="store-announce" style={{ background: '#0a3d62', color: '#ffffff', fontSize: '0.82rem' }}>
        <span>🏥 <strong>Tesãi</strong> — Linha Especializada & Farmácia em Ciudad del Este (PY) | Envio 100% Seguro para o Brasil</span>
        <span style={{ margin: '0 8px', opacity: 0.5 }}>|</span>
        <a href={waHeaderLink} target="_blank" rel="noopener noreferrer" style={{ color: '#68d8d6', fontWeight: 600 }}>
          Atendimento no WhatsApp ⚡
        </a>
      </div>

      {/* Main Header */}
      <header className="store-header">
        <div className="store-header-inner">
          {/* Logo */}
          <Link href="/" className="store-logo" style={{ textDecoration: 'none' }}>
            <div className="store-logo-icon" style={{ background: '#0077b6', color: '#fff' }}>
              <PlusCircle size={20} />
            </div>
            <div>
              <span className="store-logo-text" style={{ color: '#0a3d62', fontWeight: 800 }}>Tesãi</span>
              <span style={{ color: '#0077b6', fontWeight: 600, fontSize: '0.85rem', marginLeft: 4 }}>Farmácias</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="store-nav">
            <Link href="/" className={`store-nav-link${pathname === '/' ? ' active' : ''}`}>
              Início
            </Link>
            <Link href="/loja?category=tirzepatida-tirzec" className="store-nav-link">
              Linha Tirzec
            </Link>
            <Link href="/loja?category=tirzepatida-outras" className="store-nav-link">
              Tirzepatida
            </Link>
            <Link href="/loja?category=semaglutida" className="store-nav-link">
              Semaglutida
            </Link>
            <Link href="/loja" className="store-nav-link">
              Catálogo Completo
            </Link>
            <Link href="/suporte" className={`store-nav-link${pathname === '/suporte' ? ' active' : ''}`}>
              Rastreamento & Ajuda
            </Link>
          </nav>

          {/* Actions */}
          <div className="store-header-actions">
            {searchOpen ? (
              <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <input
                  autoFocus
                  type="text"
                  placeholder="Buscar medicamentos, suplementos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid var(--s-border)',
                    borderRadius: 'var(--s-radius-full)',
                    fontFamily: 'var(--s-font)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    width: 220,
                  }}
                />
                <button type="button" className="store-header-btn" onClick={() => setSearchOpen(false)}>
                  <X size={18} />
                </button>
              </form>
            ) : (
              <button className="store-header-btn" title="Buscar produtos" onClick={() => setSearchOpen(true)}>
                <Search size={18} />
              </button>
            )}

            <a
              href={waHeaderLink}
              target="_blank"
              rel="noopener noreferrer"
              className="store-header-btn"
              title="Falar no WhatsApp"
              style={{ color: '#25D366' }}
            >
              <MessageCircle size={20} />
            </a>

            <button className="store-header-btn" onClick={() => router.push('/carrinho')} title="Meu Carrinho">
              <ShoppingBag size={18} />
              {totalItems > 0 && <span className="store-cart-badge">{totalItems}</span>}
            </button>

            <Link href="/dashboard" className="store-admin-link" style={{ background: '#0a3d62', color: '#fff' }}>
              Painel
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}

