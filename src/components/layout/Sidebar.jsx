'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  MessageSquare,
  BarChart3,
  Truck,
  Settings,
  Zap,
  LogOut,
  ClipboardList,
  ExternalLink,
} from 'lucide-react'

const navSections = [
  {
    label: 'Principal',
    items: [
      { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/dashboard/omnichannel', icon: MessageSquare, label: 'Omnichannel', badge: 23 },
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
      { to: '/dashboard/ecommerce', icon: Zap, label: 'E-commerce' },
    ],
  },
]

const channelStatus = [
  { name: 'WhatsApp Bot', online: true },
  { name: 'Instagram DM', online: true },
  { name: 'TikTok Direct', online: true },
  { name: 'Telegram Bot', online: true },
]

export default function Sidebar({ onLogout }) {
  const pathname = usePathname()

  const checkActive = (to) => {
    if (to === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(to)
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-brand-icon">
          <Zap />
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">Spark Vendas</span>
          <span className="sidebar-brand-sub">Cross-Border</span>
        </div>
      </div>

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
          Canais
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
            className="sidebar-link"
            style={{ color: 'var(--brand)', fontWeight: 500 }}
          >
            <ExternalLink size={18} />
            <span>Ver Loja</span>
          </Link>
        </div>
      </nav>

      <div className="sidebar-status">
        <button
          className="sidebar-link"
          onClick={onLogout}
          style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'none' }}
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  )
}

