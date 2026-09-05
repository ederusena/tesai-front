'use client'

import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Bell, Command, ShoppingCart } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/dashboard/omnichannel': 'Omnichannel',
  '/dashboard/trafego': 'Tráfego & ROI',
  '/dashboard/logistica': 'Logística Cross-Border',
  '/dashboard/configuracoes': 'Configurações',
  '/dashboard/pedidos': 'Gestão de Pedidos',
  '/dashboard/ecommerce': 'E-commerce CMS',
  '/loja': 'Loja — Importados Premium',
  '/carrinho': 'Carrinho de Compras',
  '/checkout': 'Finalizar Compra',
}

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const { totalItens, notification } = useCart()
  const { user } = useAuth()
  const [period, setPeriod] = useState('7d')

  const pageTitle = pathname.startsWith('/produto')
    ? 'Detalhe do Produto'
    : pageTitles[pathname] || 'Dashboard'

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-page-title">{pageTitle}</h1>

        <div className="header-command-bar">
          <Search className="header-command-icon" />
          <input
            type="text"
            className="header-command-input"
            placeholder="/criar-fluxo Black Friday — Digite um comando..."
          />
          <span className="header-command-kbd">
            <Command size={10} style={{ display: 'inline', verticalAlign: 'middle' }} /> K
          </span>
        </div>
      </div>

      <div className="header-right">
        <div className="header-period-selector">
          {['Hoje', '7d', '30d'].map((p) => (
            <button
              key={p}
              className={`header-period-btn${period === p ? ' active' : ''}`}
              onClick={() => setPeriod(p)}
            >
              {p}
            </button>
          ))}
        </div>

        <button
          className="header-icon-btn"
          title="Carrinho"
          onClick={() => router.push('/carrinho')}
          style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <ShoppingCart size={20} />
          {totalItens > 0 && (
            <span style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              background: 'var(--neon-lime)',
              color: 'var(--bg-deep)',
              fontSize: '0.6rem',
              fontWeight: 700,
              width: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--bg-deep)',
              animation: 'pulseSuccess 0.6s ease',
            }}>
              {totalItens}
            </span>
          )}
        </button>

        <button className="header-icon-btn" title="Notificações" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <Bell size={20} />
          <span className="notification-dot" />
        </button>

        <div 
          className="header-avatar" 
          title={user?.name || 'Usuário'}
          style={{
            background: user?.role === 'operator' ? '#0284c7' : 'var(--brand)',
            color: '#ffffff',
            fontWeight: 700
          }}
        >
          {user?.name 
            ? user.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
            : 'TF'}
        </div>
      </div>

      {notification && (
        <div style={{
          position: 'fixed',
          top: '80px',
          right: '24px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--neon-lime)',
          borderRadius: 'var(--radius-lg)',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          zIndex: 200,
          animation: 'fadeInUp 0.3s ease',
          boxShadow: 'var(--shadow-glow-lime)',
        }}>
          <span style={{ color: 'var(--neon-lime)', fontSize: '1.2rem' }}>✓</span>
          <span style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>
            <strong>{notification.produto}</strong> adicionado ao carrinho
          </span>
        </div>
      )}
    </header>
  )
}

