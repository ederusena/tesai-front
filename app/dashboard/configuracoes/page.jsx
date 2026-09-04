'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Globe,
  Monitor,
  MessageCircle,
  Send,
  Camera,
  Package,
  Bell,
  RefreshCw,
  DollarSign,
  Save,
  Link2,
  Loader2,
} from 'lucide-react';
import { settingsData } from '../../../src/data/mockData';
import { getCurrencyRates } from '../../../src/services/api';

const iconMap = {
  meta: { Icon: Globe, color: '#1877F2' },
  tiktok: { Icon: Monitor, color: '#00F2EA' },
  whatsapp: { Icon: MessageCircle, color: '#25D366' },
  telegram: { Icon: Send, color: '#0088CC' },
  instagram: { Icon: Camera, color: '#E1306C' },
  package: { Icon: Package, color: '#FFB800' },
};

const notificationLabels = [
  { key: 'novoLead', label: 'Novo Lead' },
  { key: 'vendaFechada', label: 'Venda Fechada' },
  { key: 'carrinhoAbandonado', label: 'Carrinho Abandonado' },
  { key: 'pedidoEntregue', label: 'Pedido Entregue' },
  { key: 'alertaCPA', label: 'Alerta de CPA Alto' },
  { key: 'relatoriosDiarios', label: 'Relatórios Diários' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function Settings() {
  const { usuario, integracoes, notificacoes } = settingsData;

  const [integrationToggles, setIntegrationToggles] = useState(
    () => Object.fromEntries(integracoes.map((i) => [i.id, true]))
  );

  const [notificationToggles, setNotificationToggles] = useState(
    () => ({ ...notificacoes })
  );

  // Currency rates from API
  const [rates, setRates] = useState({ USD_BRL: 0, PYG_BRL: 0, USD_PYG: 0, lastUpdate: '-' });
  const [ratesLoading, setRatesLoading] = useState(true);

  const loadRates = async () => {
    setRatesLoading(true);
    try {
      const data = await getCurrencyRates();
      // Transform from API format to display format
      const rateMap = {};
      for (const r of data) {
        rateMap[`${r.fromCurrency}_${r.toCurrency}`] = r.rate;
      }
      setRates({
        USD_BRL: rateMap['USD_BRL'] || 0,
        PYG_BRL: rateMap['PYG_BRL'] || 0,
        USD_PYG: rateMap['USD_PYG'] || 0,
        lastUpdate: data[0]?.fetchedAt
          ? new Date(data[0].fetchedAt).toLocaleString('pt-BR')
          : '-',
      });
    } catch (err) {
      console.error('Erro ao carregar taxas:', err);
    } finally {
      setRatesLoading(false);
    }
  };

  useEffect(() => {
    loadRates();
  }, []);

  const handleIntegrationToggle = (id) => {
    setIntegrationToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNotificationToggle = (key) => {
    setNotificationToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* ===================== PROFILE ===================== */}
      <motion.div className="settings-section" variants={itemVariants}>
        <div className="section-header">
          <h2 className="section-title">
            <User size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Perfil
          </h2>
        </div>

        <div className="card">
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Nome</label>
              <input className="form-input" value={usuario.nome} readOnly />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="form-input" value={usuario.email} readOnly />
            </div>
            <div className="form-group">
              <label className="form-label">Telefone</label>
              <input className="form-input" value={usuario.telefone} readOnly />
            </div>
            <div className="form-group">
              <label className="form-label">Empresa</label>
              <input className="form-input" value={usuario.empresa} readOnly />
            </div>
            <div className="form-group">
              <label className="form-label">Localização</label>
              <input className="form-input" value={usuario.localizacao} readOnly />
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <button className="btn btn-primary">
              <Save size={16} />
              Salvar Alterações
            </button>
          </div>
        </div>
      </motion.div>

      {/* ===================== INTEGRATIONS ===================== */}
      <motion.div className="settings-section" variants={itemVariants}>
        <div className="section-header">
          <h2 className="section-title">
            <Link2 size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Integrações
          </h2>
        </div>

        <div className="settings-grid">
          {integracoes.map((integ) => {
            const mapping = iconMap[integ.icon] || iconMap.package;
            const IntegIcon = mapping.Icon;
            const iconColor = mapping.color;
            const isActive = integrationToggles[integ.id];

            return (
              <motion.div
                key={integ.id}
                className="integration-card"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div
                  className="integration-icon"
                  style={{
                    backgroundColor: `${iconColor}20`,
                    color: iconColor,
                  }}
                >
                  <IntegIcon size={22} />
                </div>
                <div className="integration-info">
                  <div className="integration-name">{integ.nome}</div>
                  <div className="integration-status">
                    {isActive ? '● Conectado' : '○ Desconectado'}
                  </div>
                </div>
                <div
                  className={`toggle ${isActive ? 'active' : ''}`}
                  onClick={() => handleIntegrationToggle(integ.id)}
                />
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ===================== NOTIFICATIONS ===================== */}
      <motion.div className="settings-section" variants={itemVariants}>
        <div className="section-header">
          <h2 className="section-title">
            <Bell size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Notificações
          </h2>
        </div>

        <div className="card">
          {notificationLabels.map(({ key, label }, index) => (
            <div
              key={key}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '14px 0',
                borderBottom:
                  index < notificationLabels.length - 1
                    ? '1px solid var(--border-subtle)'
                    : 'none',
              }}
            >
              <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{label}</span>
              <div
                className={`toggle ${notificationToggles[key] ? 'active' : ''}`}
                onClick={() => handleNotificationToggle(key)}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* ===================== CURRENCY RATES ===================== */}
      <motion.div className="settings-section" variants={itemVariants}>
        <div className="section-header">
          <h2 className="section-title">
            <DollarSign size={20} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Taxas de Câmbio
          </h2>
        </div>

        <div className="card">
          {ratesLoading ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
              <Loader2 size={24} className="animate-spin" style={{ color: 'var(--neon-teal)' }} />
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 8 }}>Carregando taxas...</p>
            </div>
          ) : (
            <>
              <div className="grid-3" style={{ marginBottom: 24 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                    USD → BRL
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.8rem',
                      fontWeight: 700,
                      color: 'var(--neon-lime)',
                    }}
                  >
                    {rates.USD_BRL.toFixed(2)}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                    PYG → BRL
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.8rem',
                      fontWeight: 700,
                      color: 'var(--neon-teal)',
                    }}
                  >
                    {rates.PYG_BRL.toFixed(5)}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
                    USD → PYG
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: '1.8rem',
                      fontWeight: 700,
                      color: 'var(--text-primary)',
                    }}
                  >
                    {rates.USD_PYG.toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: 16,
                }}
              >
                <span style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                  Última atualização: {rates.lastUpdate}
                </span>
                <button className="btn btn-secondary" onClick={loadRates}>
                  <RefreshCw size={16} />
                  Atualizar Taxas
                </button>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
