'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext(null)

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Carrega sessão salva no localStorage
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('tesai_auth_token')
      const savedUser = localStorage.getItem('tesai_auth_user')

      if (savedToken && savedUser) {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      }
    } catch (err) {
      console.error('Erro ao recuperar sessão:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Realiza login no backend
   */
  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Credenciais inválidas.')
      }

      setToken(data.token)
      setUser(data.user)

      localStorage.setItem('tesai_auth_token', data.token)
      localStorage.setItem('tesai_auth_user', JSON.stringify(data.user))

      // Salva cookies para controle de rota via Next.js Middleware
      document.cookie = `tesai_auth_token=${data.token}; path=/; max-age=604800; SameSite=Lax`
      document.cookie = `tesai_role=${data.user.role}; path=/; max-age=604800; SameSite=Lax`

      return { success: true, user: data.user }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  /**
   * Realiza cadastro de novo cliente
   */
  const register = async ({ name, email, phone, cpf, password }) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, cpf, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Falha ao realizar cadastro.')
      }

      setToken(data.token)
      setUser(data.user)

      localStorage.setItem('tesai_auth_token', data.token)
      localStorage.setItem('tesai_auth_user', JSON.stringify(data.user))

      document.cookie = `tesai_auth_token=${data.token}; path=/; max-age=604800; SameSite=Lax`
      document.cookie = `tesai_role=${data.user.role}; path=/; max-age=604800; SameSite=Lax`

      return { success: true, user: data.user }
    } catch (err) {
      return { success: false, error: err.message }
    }
  }

  /**
   * Encerra a sessão
   */
  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('tesai_auth_token')
    localStorage.removeItem('tesai_auth_user')
    document.cookie = 'tesai_auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'tesai_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    router.push('/login')
  }, [router])

  const isAuthenticated = !!user
  const isAdmin = user?.role === 'admin'
  const isOperator = user?.role === 'operator'

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        isOperator,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
