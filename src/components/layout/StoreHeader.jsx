'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ShoppingBag,
  Search,
  Menu,
  MessageCircle,
  Truck,
  User,
  LayoutDashboard,
  ShieldCheck,
  Package,
  LogOut,
  ChevronDown,
  Lock,
  MessagesSquare
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useState, useRef, useEffect } from 'react'

const WHATSAPP_ADMIN = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5545991562811'

export default function StoreHeader() {
  const { totalItems, subtotal } = useCart()
  const { user, isAuthenticated, isAdmin, isOperator, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fecha dropdown ao mudar de rota
  useEffect(() => {
    setUserDropdownOpen(false)
  }, [pathname])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/loja?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const formatBRL = (v) => v?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  const waLink = `https://wa.me/${WHATSAPP_ADMIN.replace(/\D/g, '')}?text=${encodeURIComponent('Olá! Gostaria de consultar medicamentos com o farmacêutico da Tesãi.')}`

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U'
  const firstName = user?.name ? user.name.split(' ')[0] : ''

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
              {/* Dropdown de Usuário estilo Amazon */}
              <div className="amazon-user-wrapper" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="di-action-item di-user-trigger"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="di-user-avatar-icon">
                    <User size={19} color="#FDE047" />
                  </div>
                  <div className="di-action-text">
                    <small>{isAuthenticated ? `Olá, ${firstName}` : 'Olá, faça seu'}</small>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <strong>{isAuthenticated ? 'Sua Conta' : 'login'}</strong>
                      <ChevronDown size={13} style={{ opacity: 0.8, transform: userDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                    </div>
                  </div>
                </button>

                {/* Dropdown Menu Estilo Amazon */}
                {userDropdownOpen && (
                  <div className="amazon-dropdown-panel">
                    {/* Header do Dropdown */}
                    <div className="amazon-panel-header">
                      {isAuthenticated ? (
                        <div className="amazon-user-info">
                          <div className="amazon-avatar-badge">
                            {userInitial}
                          </div>
                          <div>
                            <div className="amazon-user-name">{user?.name}</div>
                            <div className="amazon-user-email">{user?.email}</div>
                            <span className={`amazon-role-tag ${isAdmin ? 'admin' : isOperator ? 'operator' : 'customer'}`}>
                              {isAdmin ? '👑 Administrador Master' : isOperator ? '📦 Operador' : 'Cliente'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="amazon-guest-login">
                          <p className="amazon-guest-text">
                            Acesse sua conta para ver pedidos, rastreamento e opções de acesso.
                          </p>
                          <Link href="/login" className="amazon-login-btn">
                            Fazer Login
                          </Link>
                          <div className="amazon-signup-hint">
                            Cliente novo? <Link href="/loja">Comece explorando a loja</Link>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Grid de Cards estilo Amazon ("Your Account") */}
                    <div className="amazon-cards-grid">
                      {/* 1. Card Painel Administrativo / Operador (SE TIVER PERMISSÃO) */}
                      {(isAdmin || isOperator) && (
                        <Link 
                          href={isAdmin ? '/dashboard' : '/dashboard/pedidos'} 
                          className="amazon-grid-card highlighted"
                        >
                          <div className="amazon-card-icon purple">
                            <LayoutDashboard size={22} />
                          </div>
                          <div className="amazon-card-content">
                            <h4 className="amazon-card-title">
                              {isAdmin ? 'Painel Administrativo' : 'Painel do Operador'}
                            </h4>
                            <p className="amazon-card-desc">
                              {isAdmin 
                                ? 'Métricas de vendas, pedidos e faturamento geral' 
                                : 'Conferência de pedidos e envio de rastreios'}
                            </p>
                          </div>
                        </Link>
                      )}

                      {/* 2. Seus Pedidos */}
                      <Link 
                        href={isOperator ? '/dashboard/pedidos' : '/suporte'} 
                        className="amazon-grid-card"
                      >
                        <div className="amazon-card-icon green">
                          <Package size={22} />
                        </div>
                        <div className="amazon-card-content">
                          <h4 className="amazon-card-title">Seus Pedidos</h4>
                          <p className="amazon-card-desc">
                            Rastrear encomendas, status de entrega e notas
                          </p>
                        </div>
                      </Link>

                      {/* 3. Atendimento Farmacêutico WhatsApp */}
                      <a 
                        href={waLink} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="amazon-grid-card"
                      >
                        <div className="amazon-card-icon teal">
                          <MessageCircle size={22} />
                        </div>
                        <div className="amazon-card-content">
                          <h4 className="amazon-card-title">Atendimento WhatsApp</h4>
                          <p className="amazon-card-desc">
                            Fale diretamente com nossa equipe de saúde
                          </p>
                        </div>
                      </a>

                      {/* 4. WhatsApp Omnichannel (Apenas para Admin) */}
                      {isAdmin && (
                        <Link href="/dashboard/omnichannel" className="amazon-grid-card">
                          <div className="amazon-card-icon blue">
                            <MessagesSquare size={22} />
                          </div>
                          <div className="amazon-card-content">
                            <h4 className="amazon-card-title">Central de Mensagens</h4>
                            <p className="amazon-card-desc">
                              Atendimento multicanal e bots de conversão
                            </p>
                          </div>
                        </Link>
                      )}

                      {/* 5. Acesso & Segurança */}
                      <div className="amazon-grid-card disabled">
                        <div className="amazon-card-icon gray">
                          <ShieldCheck size={22} />
                        </div>
                        <div className="amazon-card-content">
                          <h4 className="amazon-card-title">Login & Segurança</h4>
                          <p className="amazon-card-desc">
                            Proteção de credenciais e integridade de dados
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Rodapé do Painel com Logout */}
                    {isAuthenticated && (
                      <div className="amazon-panel-footer">
                        <button 
                          type="button" 
                          onClick={logout} 
                          className="amazon-logout-btn"
                        >
                          <LogOut size={16} />
                          <span>Sair da Conta ({user?.name.split(' ')[0]})</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Acompanhar Pedidos */}
              <Link href="/suporte" className="di-action-item">
                <Truck size={20} color="#FDE047" />
                <div className="di-action-text">
                  <small>Acompanhar</small>
                  <strong>pedidos</strong>
                </div>
              </Link>

              {/* Falar no WhatsApp */}
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
