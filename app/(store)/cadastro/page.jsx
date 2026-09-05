'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Loader2, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Truck, 
  MessageCircle 
} from 'lucide-react'
import { useAuth } from '../../../src/context/AuthContext'

function maskPhone(value) {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d{5})(\d{4})$/, '$1-$2')
}

function CadastroForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams?.get('from')
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (password !== confirmPassword) {
      setErrorMsg('As senhas digitadas não coincidem.')
      return
    }

    if (password.length < 6) {
      setErrorMsg('A senha deve ter no mínimo 6 caracteres.')
      return
    }

    setLoading(true)

    try {
      const result = await register({
        name,
        email,
        phone,
        password
      })

      if (!result.success) {
        setErrorMsg(result.error || 'Falha ao criar cadastro. Verifique os dados.')
        setLoading(false)
        return
      }

      // Redireciona para onde o cliente estava indo ou para a página inicial
      if (from) {
        router.push(from)
      } else {
        router.push('/')
      }
    } catch (err) {
      console.error('Erro ao cadastrar:', err)
      setErrorMsg('Erro inesperado de conexão com o servidor.')
      setLoading(false)
    }
  }

  return (
    <div className="store-login-card" style={{ maxWidth: '480px' }}>
      {/* Header do Card */}
      <div className="store-login-header">
        <div className="store-login-badge">
          <ShieldCheck size={20} />
          <span>Cadastro Oficial • Tesãi Farmácias</span>
        </div>
        <h1 className="store-login-title">Crie sua Conta</h1>
        <p className="store-login-subtitle">
          Cadastre-se rapidamente para acompanhar seus pedidos e ter suporte direto com nosso farmacêutico.
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
        {/* Nome Completo */}
        <div className="store-input-group">
          <label htmlFor="cad-name">Nome Completo</label>
          <div className="store-input-box">
            <User size={18} className="store-input-icon" />
            <input
              id="cad-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex: Carlos Alberto Silva"
              required
              autoFocus
            />
          </div>
        </div>

        {/* E-mail */}
        <div className="store-input-group">
          <label htmlFor="cad-email">E-mail</label>
          <div className="store-input-box">
            <Mail size={18} className="store-input-icon" />
            <input
              id="cad-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              required
            />
          </div>
        </div>

        {/* WhatsApp / Celular (Sem necessidade de CPF) */}
        <div className="store-input-group">
          <label htmlFor="cad-phone">WhatsApp / Celular</label>
          <div className="store-input-box">
            <Phone size={18} className="store-input-icon" />
            <input
              id="cad-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(maskPhone(e.target.value))}
              placeholder="(00) 00000-0000"
              required
            />
          </div>
        </div>

        {/* Linha dupla: Senha e Confirmação */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div className="store-input-group">
            <label htmlFor="cad-pass">Senha</label>
            <div className="store-input-box">
              <Lock size={18} className="store-input-icon" />
              <input
                id="cad-pass"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 dígitos"
                required
              />
            </div>
          </div>

          <div className="store-input-group">
            <label htmlFor="cad-confirm">Confirmar Senha</label>
            <div className="store-input-box">
              <Lock size={18} className="store-input-icon" />
              <input
                id="cad-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                required
              />
            </div>
          </div>
        </div>

        {/* Benefícios em pílulas */}
        <div style={{ 
          background: '#FAF8F5', 
          border: '1px solid #E8E4DF', 
          borderRadius: '12px', 
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginTop: '4px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#374151' }}>
            <CheckCircle2 size={16} color="#00875A" />
            <span>Procedência garantida com lacre e temperatura controlada</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#374151' }}>
            <Truck size={16} color="#4A1D96" />
            <span>Envios diários com rastreio imediato nos Correios</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="store-login-submit-btn"
          style={{ marginTop: '8px' }}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Criando sua conta...</span>
            </>
          ) : (
            <>
              <span>Finalizar Cadastro e Entrar</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </form>

      {/* Link para Login */}
      <div className="store-login-footer">
        <p style={{ fontSize: '0.86rem', color: '#4B5563', margin: '0 0 12px 0' }}>
          Já possui cadastro?{' '}
          <Link href={`/login${from ? `?from=${encodeURIComponent(from)}` : ''}`} style={{ color: '#4A1D96', fontWeight: 700, textDecoration: 'underline' }}>
            Fazer Login
          </Link>
        </p>

        <div className="store-login-back">
          <Link href="/">← Voltar para a Loja</Link>
        </div>
      </div>
    </div>
  )
}

export default function CadastroPage() {
  return (
    <div className="store-login-wrapper">
      <div className="store-container" style={{ display: 'flex', justifyContent: 'center', padding: '40px 16px 80px' }}>
        <Suspense fallback={
          <div style={{ textAlign: 'center', padding: '40px', color: '#6B7280' }}>
            Carregando formulário de cadastro...
          </div>
        }>
          <CadastroForm />
        </Suspense>
      </div>
    </div>
  )
}
