'use client'

import Sidebar from '../../src/components/layout/Sidebar'
import Header from '../../src/components/layout/Header'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAuth } from '../../src/context/AuthContext'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, loading, isAuthenticated, isOperator, logout } = useAuth()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Proteção de rota e redirecionamento por perfil
  useEffect(() => {
    if (loading || !mounted) return

    // Se não estiver logado, redireciona para o login
    if (!isAuthenticated) {
      router.replace('/login')
      return
    }

    // Se for operador, só tem acesso a Pedidos e WhatsApp (Omnichannel)
    if (isOperator) {
      const isAllowedRoute = 
        pathname.startsWith('/dashboard/pedidos') || 
        pathname.startsWith('/dashboard/omnichannel')

      if (!isAllowedRoute) {
        // Redireciona operador para a tela padrão permitida dele
        router.replace('/dashboard/pedidos')
      }
    }
  }, [loading, mounted, isAuthenticated, isOperator, pathname, router])

  // Enquanto valida autenticação, exibe tela de carregamento segura
  if (!mounted || loading || !isAuthenticated) {
    return (
      <div 
        style={{ 
          display: 'flex', 
          flexDirection: 'column',
          height: '100vh', 
          alignItems: 'center', 
          justifyContent: 'center', 
          background: '#090d16',
          color: '#00c9a7',
          gap: '12px'
        }}
      >
        <div 
          style={{ 
            width: '32px', 
            height: '32px', 
            border: '3px solid rgba(0, 201, 167, 0.2)', 
            borderTopColor: '#00c9a7', 
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} 
        />
        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#94a3b8' }}>
          Verificando permissões de acesso...
        </span>
        <style jsx>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <Sidebar onLogout={logout} user={user} />
      <div className="app-main">
        <Header />
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  )
}
