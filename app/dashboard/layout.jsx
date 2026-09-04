'use client'

import Sidebar from '../../src/components/layout/Sidebar'
import Header from '../../src/components/layout/Header'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    // Supabase logout placeholder or actual action will go here
    router.push('/login')
  }

  if (!mounted) {
    return (
      <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-deep)' }}>
        <span style={{ color: 'var(--brand)', fontFamily: 'var(--font-heading)', fontWeight: 600 }}>Carregando Painel...</span>
      </div>
    )
  }

  return (
    <div className="app-layout">
      <Sidebar onLogout={handleLogout} />
      <div className="app-main">
        <Header />
        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  )
}
