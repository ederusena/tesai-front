'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Truck,
  Settings,
  ShieldCheck,
  LogOut,
  ClipboardList,
  ExternalLink,
  User,
  ShoppingBag
} from 'lucide-react'

// Menus completos para Administrador
const adminSections = [
  {
    label: 'Principal',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/dashboard/omnichannel', icon: MessageSquare, label: 'WhatsApp & Mensagens', badge: 23 },
    ],
  },
  {
    label: 'Vendas',
    items: [
      { to: '/dashboard/pedidos', icon: ClipboardList, label: 'Pedidos', badge: 12 },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { to: '/dashboard/trafego', icon: BarChart3, label: 'Tráfego & ROI' },
    ],
  },
  {
    label: 'Operações',
    items: [
      { to: '/dashboard/logistica', icon: Truck, label: 'Logística' },
      { to: '/dashboard/configuracoes', icon: Settings, label: 'Configurações' },
    ],
  },
  {
    label: 'Gerencial',
    items: [
      { to: '/dashboard/ecommerce', icon: ShoppingBag, label: 'E-commerce & Catálogo' },
    ],
  },
]

// Menus simplificados exclusivos para Operador (Pedidos + Atendimento)
const operatorSections = [
  {
    label: 'Operações Permitidas',
    items: [
      { to: '/dashboard/pedidos', icon: ClipboardList, label: 'Gerenciar Pedidos', badge: 12 },
      { to: '/dashboard/omnichannel', icon: MessageSquare, label: 'WhatsApp & Mensagens', badge: 23 },
    ],
  },
]

const channelStatus = [
  { name: 'WhatsApp Bot', online: true },
  { name: 'Instagram DM', online: true },
  { name: 'Telegram Bot', online: true },
]

export default function Sidebar({ onLogout, user }) {
  const pathname = usePathname()
  const isOperator = user?.role === 'operator'
  const navSections = isOperator ? operatorSections : adminSections

  const checkActive = (to) => {
    if (to === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(to)
  }

  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div 
          className="sidebar-brand-icon"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 201, 167, 0.2) 0%, rgba(20, 184, 166, 0.05) 100%)',
            color: '#00c9a7',
            border: '1px solid rgba(0, 201, 167, 0.3)'
          }}
        >
          <ShieldCheck size={20} />
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name" style={{ color: '#f8fafc', fontWeight: 700 }}>
            Tesãi Farmácias
          </span>
          <span className="sidebar-brand-sub" style={{ color: '#00c9a7', fontWeight: 600 }}>
            {isOperator ? 'Portal Operador' : 'Central Executiva'}
          </span>
        </div>
      </div>

      {/* Identificação do Usuário Logado */}
      <div 
        style={{
          margin: '0 12px 14px 12px',
          padding: '10px 12px',
          borderRadius: '10px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <div 
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: isOperator ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0, 201, 167, 0.15)',
            border: `1px solid ${isOperator ? '#38bdf8' : '#00c9a7'}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isOperator ? '#38bdf8' : '#00c9a7',
            flexShrink: 0
          }}
        >
          <User size={18} />
        </div>
        <div style={{ overflow: 'hidden' }}>
          <div 
            style={{ 
              fontSize: '0.825rem', 
              fontWeight: 600, 
              color: '#f1f5f9',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden'
            }}
          >
            {user?.name || (isOperator ? 'Operador' : 'Administrador')}
          </div>
          <span 
            style={{
              display: 'inline-block',
              fontSize: '0.65rem',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px',
              marginTop: '2px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              background: isOperator ? 'rgba(56, 189, 248, 0.15)' : 'rgba(0, 201, 167, 0.15)',
              color: isOperator ? '#38bdf8' : '#00c9a7',
              border: `1px solid ${isOperator ? 'rgba(56, 189, 248, 0.3)' : 'rgba(0, 201, 167, 0.3)'}`
            }}
          >
            {isOperator ? 'Operador' : 'Admin Master'}
          </span>
        </div>
      </div>

      {/* Navegação */}
      <nav className="sidebar-nav">
        {navSections.map((section) => (
          <div key={section.label}>
            <span className="sidebar-section-label">{section.label}</span>
            {section.items.map((item) => {
              const isActive = checkActive(item.to)
              return (
                <Link
                  key={item.to}
                  href={item.to}
                  className={`sidebar-link${isActive ? ' active' : ''}`}
                >
                  <item.icon />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="sidebar-link-badge">{item.badge}</span>
                  )}
                </Link>
              )
            })}
          </div>
        ))}

        <span className="sidebar-section-label" style={{ marginTop: '8px' }}>
          Canais Integrados
        </span>
        {channelStatus.map((ch) => (
          <div key={ch.name} className="sidebar-status-item" style={{ padding: '6px 16px' }}>
            <span className={`status-dot ${ch.online ? 'online' : 'offline'}`} />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {ch.name}
            </span>
          </div>
        ))}

        <div style={{ borderTop: '1px solid var(--border)', margin: '8px 12px', paddingTop: '8px' }}>
          <Link
            href="/"
            target="_blank"
            className="sidebar-link"
            style={{ color: '#00c9a7', fontWeight: 500 }}
          >
            <ExternalLink size={18} />
            <span>Ver Loja Online</span>
          </Link>
        </div>
      </nav>

      {/* Logout */}
      <div className="sidebar-status">
        <button
          className="sidebar-link"
          onClick={onLogout}
          style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'none' }}
        >
          <LogOut size={20} />
          <span>Sair da Sessão</span>
        </button>
      </div>
    </aside>
  )
}
