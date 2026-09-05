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
  ChevronRight,
  Lock,
  MessagesSquare,
  Home,
  LayoutGrid,
  Sparkles,
  ArrowRight,
  X
} from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { products, productCategories } from '../../data/ecommerceData'
import { useState, useRef, useEffect } from 'react'

const WHATSAPP_ADMIN = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5545991562811'

export default function StoreHeader() {
  const { totalItems, subtotal } = useCart()
  const { user, isAuthenticated, isAdmin, isOperator, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false)
  
  const dropdownRef = useRef(null)
  const searchWrapperRef = useRef(null)

  // Fecha menus ao clicar fora
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false)
      }
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(event.target)) {
        setSearchFocused(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fecha menus e drawer ao mudar de rota ou pressionar ESC
  useEffect(() => {
    setUserDropdownOpen(false)
    setSearchFocused(false)
    setCategoryDrawerOpen(false)
  }, [pathname])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') {
        setCategoryDrawerOpen(false)
        setUserDropdownOpen(false)
        setSearchFocused(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Trava scroll da tela quando o drawer estiver aberto
  useEffect(() => {
    if (categoryDrawerOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [categoryDrawerOpen])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setSearchFocused(false)
      router.push(`/loja?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  // Filtragem ao vivo para Busca Preditiva (Live Search)
  const matchingProducts = searchQuery.trim().length >= 2 
    ? products.filter(p => 
        p.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tags?.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.descricaoCurta?.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 4)
    : []

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
            <button
              type="button"
              onClick={() => setCategoryDrawerOpen(true)}
              className="di-menu-btn"
              aria-label="Abrir menu de departamentos"
            >
              <Menu size={18} />
              <span>menu</span>
            </button>

            {/* Search Bar com Busca Preditiva (Live Search Autocomplete) */}
            <div className="di-search-wrapper" ref={searchWrapperRef}>
              <form onSubmit={handleSearch} className="di-search-form">
                <input
                  type="text"
                  placeholder="O que você procura hoje? (ex: Tirzec, TG, Lipoless, Semaglutida...)"
                  className="di-search-input"
                  value={searchQuery}
                  onFocus={() => setSearchFocused(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setSearchFocused(true)
                  }}
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={() => setSearchQuery('')}
                    style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer', padding: '4px' }}
                    aria-label="Limpar busca"
                  >
                    <X size={15} />
                  </button>
                )}
                <button type="submit" className="di-search-btn" aria-label="Buscar">
                  <Search size={16} />
                </button>
              </form>

              {/* Dropdown de Busca Preditiva ao Vivo */}
              {searchFocused && searchQuery.trim().length >= 2 && (
                <div className="live-search-dropdown">
                  <div className="live-search-header">
                    <span>Medicamentos encontrados</span>
                    <small>{matchingProducts.length} resultado(s)</small>
                  </div>

                  {matchingProducts.length > 0 ? (
                    <div className="live-search-list">
                      {matchingProducts.map((p) => (
                        <Link
                          key={p.id}
                          href={`/produto/${p.slug}`}
                          onClick={() => setSearchFocused(false)}
                          className="live-search-item"
                        >
                          <div className="live-search-item-img">
                            {p.imagem ? (
                              <img src={p.imagem} alt={p.nome} />
                            ) : (
                              <span>{p.emoji || '💊'}</span>
                            )}
                          </div>
                          <div className="live-search-item-info">
                            <strong className="live-search-item-title">{p.nome}</strong>
                            <span className="live-search-item-sub">{p.descricaoCurta}</span>
                          </div>
                          <div className="live-search-item-price">
                            <span className="live-search-price">{formatBRL(p.precoBRL)}</span>
                            {p.precoOriginalBRL && (
                              <span className="live-search-old-price">{formatBRL(p.precoOriginalBRL)}</span>
                            )}
                          </div>
                        </Link>
                      ))}

                      <div className="live-search-footer">
                        <button type="button" onClick={handleSearch} className="live-search-see-all">
                          <span>Ver todos os resultados para "<strong>{searchQuery}</strong>"</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="live-search-empty">
                      <p>Nenhum resultado direto para "<strong>{searchQuery}</strong>".</p>
                      <button type="button" onClick={handleSearch} className="live-search-btn-fallback">
                        Buscar no catálogo completo →
                      </button>
                    </div>
                  )}

                  {/* Sugestões Rápidas de Categorias Populares */}
                  <div className="live-search-chips">
                    <span>Populares:</span>
                    {['Tirzec 15mg', 'Lipoless', 'Semaglutida', 'Frasco/Ampola'].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          setSearchQuery(tag)
                          router.push(`/loja?search=${encodeURIComponent(tag)}`)
                          setSearchFocused(false)
                        }}
                        className="live-search-chip"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
                            Cliente novo? <Link href="/cadastro">Comece aqui</Link>
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

      {/* 3. Mobile Bottom Navigation Bar (Padrão Farmácias / Iguatemi) */}
      <nav className="di-mobile-bottom-bar" aria-label="Navegação mobile">
        <Link href="/" className={`di-mobile-nav-item ${pathname === '/' && !categoryDrawerOpen ? 'active' : ''}`}>
          <Home size={20} />
          <span>Início</span>
        </Link>
        <button
          type="button"
          onClick={() => setCategoryDrawerOpen(prev => !prev)}
          className={`di-mobile-nav-item ${categoryDrawerOpen ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          aria-label="Abrir departamentos"
        >
          <LayoutGrid size={20} />
          <span>Departamentos</span>
        </button>
        <a href={waLink} target="_blank" rel="noopener noreferrer" className="di-mobile-nav-item wa-highlight">
          <div className="di-mobile-wa-icon">
            <MessageCircle size={20} />
          </div>
          <span>Farmácia</span>
        </a>
        <Link href="/carrinho" className={`di-mobile-nav-item ${pathname === '/carrinho' ? 'active' : ''}`}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingBag size={20} />
            {totalItems > 0 && <span className="di-mobile-cart-badge">{totalItems}</span>}
          </div>
          <span>Cesta</span>
        </Link>
        <button
          type="button"
          onClick={() => {
            if (!isAuthenticated) {
              router.push('/login')
            } else {
              setUserDropdownOpen(true)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }
          }}
          className={`di-mobile-nav-item ${pathname === '/login' || pathname === '/cadastro' ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <User size={20} />
          <span>{isAuthenticated ? 'Conta' : 'Entrar'}</span>
        </button>
      </nav>

      {/* 4. Sliding Category Drawer (Amazon/Mercado Livre/Iguatemi Pattern) */}
      <div 
        className={`di-drawer-backdrop ${categoryDrawerOpen ? 'open' : ''}`} 
        onClick={() => setCategoryDrawerOpen(false)}
        aria-hidden={!categoryDrawerOpen}
      >
        <div 
          className={`di-drawer-panel ${categoryDrawerOpen ? 'open' : ''}`} 
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header do Drawer com Boas-vindas */}
          <div className="di-drawer-header">
            <div className="di-drawer-user-info">
              <div className="di-drawer-avatar">
                {isAuthenticated ? userInitial : <User size={22} />}
              </div>
              <div>
                <p className="di-drawer-greeting">
                  Olá, {isAuthenticated ? firstName : 'Visitante'}
                </p>
                {isAuthenticated ? (
                  <span className="di-drawer-email">{user?.email}</span>
                ) : (
                  <Link href="/login" onClick={() => setCategoryDrawerOpen(false)} className="di-drawer-login-link">
                    Entre ou cadastre-se grátis →
                  </Link>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setCategoryDrawerOpen(false)}
              className="di-drawer-close-btn"
              aria-label="Fechar menu"
            >
              <X size={20} />
            </button>
          </div>

          {/* Conteúdo rolável */}
          <div className="di-drawer-content">
            {/* Seção Departamentos & Linhas */}
            <div className="di-drawer-section">
              <div className="di-drawer-section-title">
                <LayoutGrid size={16} />
                <span>Departamentos & Linhas</span>
              </div>
              <nav className="di-drawer-nav">
                <Link
                  href="/loja"
                  onClick={() => setCategoryDrawerOpen(false)}
                  className="di-drawer-link highlight"
                >
                  <span className="di-drawer-link-icon">🏥</span>
                  <div className="di-drawer-link-text">
                    <strong>Ver Todo o Catálogo</strong>
                    <small>Todas as 23 apresentações disponíveis</small>
                  </div>
                  <ChevronRight size={16} className="di-drawer-chevron" />
                </Link>

                {productCategories.filter(c => c.id !== 'todos').map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/loja?categoria=${cat.id}`}
                    onClick={() => setCategoryDrawerOpen(false)}
                    className="di-drawer-link"
                  >
                    <span className="di-drawer-link-icon">{cat.icon}</span>
                    <div className="di-drawer-link-text">
                      <span>{cat.nome}</span>
                      <small>{cat.count} produtos disponíveis</small>
                    </div>
                    <ChevronRight size={16} className="di-drawer-chevron" />
                  </Link>
                ))}
              </nav>
            </div>

            {/* Seção Atendimento & Serviços */}
            <div className="di-drawer-section">
              <div className="di-drawer-section-title">
                <Sparkles size={16} />
                <span>Atendimento & Confiança</span>
              </div>
              <nav className="di-drawer-nav">
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setCategoryDrawerOpen(false)}
                  className="di-drawer-link wa-link"
                >
                  <span className="di-drawer-link-icon">💬</span>
                  <div className="di-drawer-link-text">
                    <strong>Farmacêutico no WhatsApp</strong>
                    <small>Tire dúvidas sobre dosagens e conservação</small>
                  </div>
                  <ChevronRight size={16} className="di-drawer-chevron" />
                </a>

                <Link
                  href="/suporte"
                  onClick={() => setCategoryDrawerOpen(false)}
                  className="di-drawer-link"
                >
                  <span className="di-drawer-link-icon">🚚</span>
                  <div className="di-drawer-link-text">
                    <span>Rastrear Pedido & Prazos</span>
                    <small>Envio térmico e embalagem discreta</small>
                  </div>
                  <ChevronRight size={16} className="di-drawer-chevron" />
                </Link>

                <div className="di-drawer-badge-box">
                  <ShieldCheck size={20} color="#00875A" />
                  <div>
                    <strong>Garantia de Autenticidade</strong>
                    <p>Produtos 100% lacrados de fábrica direto do laboratório para o seu endereço.</p>
                  </div>
                </div>
              </nav>
            </div>

            {/* Seção Minha Conta */}
            <div className="di-drawer-section">
              <div className="di-drawer-section-title">
                <User size={16} />
                <span>Minha Conta</span>
              </div>
              <nav className="di-drawer-nav">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      onClick={() => setCategoryDrawerOpen(false)}
                      className="di-drawer-link"
                    >
                      <Package size={18} />
                      <span>Meus Pedidos & Compras</span>
                      <ChevronRight size={16} className="di-drawer-chevron" />
                    </Link>

                    {(isAdmin || isOperator) && (
                      <Link
                        href="/dashboard"
                        onClick={() => setCategoryDrawerOpen(false)}
                        className="di-drawer-link admin-highlight"
                      >
                        <LayoutDashboard size={18} />
                        <span>Painel Administrativo</span>
                        <ChevronRight size={16} className="di-drawer-chevron" />
                      </Link>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        logout()
                        setCategoryDrawerOpen(false)
                        router.push('/')
                      }}
                      className="di-drawer-link logout-btn"
                    >
                      <LogOut size={18} />
                      <span>Encerrar Sessão</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={() => setCategoryDrawerOpen(false)}
                      className="di-drawer-link"
                    >
                      <Lock size={18} />
                      <span>Fazer Login</span>
                      <ChevronRight size={16} className="di-drawer-chevron" />
                    </Link>
                    <Link
                      href="/cadastro"
                      onClick={() => setCategoryDrawerOpen(false)}
                      className="di-drawer-link"
                    >
                      <User size={18} />
                      <span>Criar Conta Grátis</span>
                      <ChevronRight size={16} className="di-drawer-chevron" />
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </div>

          {/* Footer do Drawer */}
          <div className="di-drawer-footer">
            <span>Tesãi Drogaria • Foz do Iguaçu / CDE</span>
            <small>Cuidado com a sua saúde e discrição absoluta</small>
          </div>
        </div>
      </div>
    </>
  )
}
