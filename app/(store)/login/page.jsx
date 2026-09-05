'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, Loader2, ShieldCheck, ArrowRight, MessageCircle } from 'lucide-react'
import { useAuth } from '../../../src/context/AuthContext'

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5545991562811'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams?.get('from')
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')
    setLoading(true)

    try {
      const result = await login(email, password)

      if (!result.success) {
        setErrorMsg(result.error || 'Credenciais inválidas. Verifique seu e-mail e senha.')
        setLoading(false)
        return
      }

      // Redirecionamento automático baseado no papel retornado pela API
      if (from) {
        router.push(from)
      } else if (result.user.role === 'admin') {
        router.push('/dashboard')
      } else if (result.user.role === 'operator') {
        router.push('/dashboard/pedidos')
      } else {
        router.push('/')
      }
    } catch (err) {
      console.error('Erro no login:', err)
      setErrorMsg('Falha na comunicação com o servidor. Tente novamente.')
      setLoading(false)
    }
  }

  const waHelpLink = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent('Olá! Preciso de ajuda com meu acesso na Tesãi Farmácias.')}`

  return (
    <div className="store-login-card">
      {/* Header do Card */}
      <div className="store-login-header">
        <div className="store-login-badge">
          <ShieldCheck size={20} />
          <span>Ambiente Seguro & Criptografado</span>
        </div>
        <h1 className="store-login-title">Acesse sua Conta</h1>
        <p className="store-login-subtitle">
          Entre com seu e-mail e senha para gerenciar pedidos, atendimentos ou acessar o painel.
        </p>
      </div>

      {/* Mensagem de Erro */}
      {errorMsg && (
        <div className="store-login-error">
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="store-login-form">
        <div className="store-input-group">
          <label htmlFor="login-email">E-mail</label>
          <div className="store-input-box">
            <Mail size={18} className="store-input-icon" />
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ex: seuemail@exemplo.com"
              required
              autoFocus
            />
          </div>
        </div>

        <div className="store-input-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <label htmlFor="login-password">Senha</label>
            <a href={waHelpLink} target="_blank" rel="noopener noreferrer" className="store-forgot-link">
              Esqueceu a senha?
            </a>
          </div>
          <div className="store-input-box">
            <Lock size={18} className="store-input-icon" />
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="store-login-submit-btn"
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Acessando...</span>
            </>
          ) : (
            <>
              <span>Entrar na Conta</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Rodapé e Ajuda */}
      <div className="store-login-footer">
        <div className="store-login-divider">
          <span>ou</span>
        </div>

        <a
          href={waHelpLink}
          target="_blank"
          rel="noopener noreferrer"
          className="store-login-wa-help"
        >
          <MessageCircle size={18} color="#00875A" />
          <span>Dúvidas ou primeiro acesso? <strong>Fale no WhatsApp</strong></span>
        </a>

        {/* Criar Conta */}
        <div style={{ marginTop: '16px', padding: '14px', background: '#FAF8F5', borderRadius: '12px', border: '1px solid #E8E4DF', textAlign: 'center' }}>
          <p style={{ margin: '0 0 6px 0', fontSize: '0.84rem', color: '#4B5563' }}>
            Ainda não tem uma conta na Tesãi?
          </p>
          <Link 
            href={`/cadastro${from ? `?from=${encodeURIComponent(from)}` : ''}`}
            style={{ color: '#4A1D96', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'underline' }}
          >
            Cadastre-se grátis em 1 minuto →
          </Link>
        </div>

        <div className="store-login-back">
          <Link href="/">← Voltar para a Loja</Link>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="store-login-wrapper">
      <div className="store-container" style={{ display: 'flex', justifyContent: 'center', padding: '48px 16px 80px' }}>
        <Suspense fallback={
          <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
            Carregando formulário de acesso...
          </div>
        }>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
