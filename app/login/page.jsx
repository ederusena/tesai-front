'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock, Loader2, UserCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../src/context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('admin@tesaifarmacias.com');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const result = await login(email, password);

      if (!result.success) {
        setErrorMsg(result.error || 'Falha ao autenticar.');
        setLoading(false);
        return;
      }

      // Redirecionamento baseado no papel
      if (result.user.role === 'admin') {
        router.push('/dashboard');
      } else {
        // Operador tem acesso direto aos pedidos
        router.push('/dashboard/pedidos');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Erro inesperado de conexão com o servidor.');
      setLoading(false);
    }
  };

  const handleQuickFill = (type) => {
    if (type === 'admin') {
      setEmail('admin@tesaifarmacias.com');
      setPassword('admin123');
    } else {
      setEmail('operador@tesaifarmacias.com');
      setPassword('operador123');
    }
    setErrorMsg('');
  };

  return (
    <div className="login-page" style={{ background: '#090d16', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div className="login-container" style={{ width: '100%', maxWidth: '440px' }}>
        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 32, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            background: 'rgba(17, 24, 39, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '2.25rem',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
          }}
        >
          {/* Brand */}
          <motion.div
            className="login-brand"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            style={{ textAlign: 'center', marginBottom: '1.75rem' }}
          >
            <div 
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(0, 201, 167, 0.2) 0%, rgba(20, 184, 166, 0.05) 100%)',
                border: '1px solid rgba(0, 201, 167, 0.4)',
                color: '#00c9a7',
                marginBottom: '1rem'
              }}
            >
              <ShieldCheck size={28} />
            </div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0, letterSpacing: '-0.02em' }}>
              Tesãi Farmácias
            </h1>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.35rem', marginBottom: 0 }}>
              Portal de Gestão & Operações
            </p>
          </motion.div>

          {/* Atalhos Rápidos de Acesso */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              style={{
                background: email === 'admin@tesaifarmacias.com' ? 'rgba(0, 201, 167, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${email === 'admin@tesaifarmacias.com' ? '#00c9a7' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '8px',
                padding: '8px 10px',
                color: email === 'admin@tesaifarmacias.com' ? '#00c9a7' : '#94a3b8',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s'
              }}
            >
              👑 Acesso Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('operator')}
              style={{
                background: email === 'operador@tesaifarmacias.com' ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.04)',
                border: `1px solid ${email === 'operador@tesaifarmacias.com' ? '#38bdf8' : 'rgba(255, 255, 255, 0.08)'}`,
                borderRadius: '8px',
                padding: '8px 10px',
                color: email === 'operador@tesaifarmacias.com' ? '#38bdf8' : '#94a3b8',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s'
              }}
            >
              📦 Acesso Operador
            </button>
          </div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            {errorMsg && (
              <div 
                style={{ 
                  background: 'rgba(239, 68, 68, 0.12)', 
                  border: '1px solid rgba(239, 68, 68, 0.3)', 
                  color: '#f87171', 
                  fontSize: '0.8rem', 
                  padding: '8px 12px',
                  borderRadius: '8px',
                  marginBottom: '1rem', 
                  textAlign: 'center' 
                }}
              >
                {errorMsg}
              </div>
            )}

            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.4rem' }} htmlFor="login-email">
                E-mail
              </label>
              <div style={{ position: 'relative' }}>
                <Mail
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ex: admin@tesaifarmacias.com"
                  style={{
                    paddingLeft: '38px',
                    width: '100%',
                    height: '42px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.4rem' }} htmlFor="login-senha">
                Senha
              </label>
              <div style={{ position: 'relative' }}>
                <Lock
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#64748b',
                    pointerEvents: 'none',
                  }}
                />
                <input
                  id="login-senha"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Sua senha"
                  style={{
                    paddingLeft: '38px',
                    width: '100%',
                    height: '42px',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: '#f8fafc',
                    fontSize: '0.875rem',
                    outline: 'none',
                  }}
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              style={{
                width: '100%',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                background: 'linear-gradient(135deg, #00c9a7 0%, #0d9488 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 14px 0 rgba(0, 201, 167, 0.35)',
                transition: 'box-shadow 0.2s'
              }}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? 'Validando acesso...' : 'Entrar no Sistema'}
            </motion.button>
          </motion.form>

          {/* Footer Informativo */}
          <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0 }}>
              🛡️ Ambiente restrito e auditado • Tesãi Farmácias
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
