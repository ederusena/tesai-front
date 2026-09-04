'use client'

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronRight,
  Eye,
  MousePointerClick,
  UserPlus,
  Bot,
  ShieldCheck,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Megaphone,
  BarChart3,
  Palette,
  AlertTriangle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { campaigns, attributionFlow } from '../../../src/data/mockData';
import { formatCurrency, formatNumber, formatCompact } from '../../../src/utils/formatters';

// ───── Attribution Flow ─────
const flowSteps = [
  { key: 'impressoes', label: 'Impressões', icon: Eye, color: 'teal' },
  { key: 'cliques', label: 'Cliques', icon: MousePointerClick, color: 'teal' },
  { key: 'leads', label: 'Leads', icon: UserPlus, color: 'lime' },
  { key: 'conversasBot', label: 'Conversas Bot', icon: Bot, color: 'lime' },
  { key: 'qualificados', label: 'Qualificados', icon: ShieldCheck, color: 'lime' },
  { key: 'vendas', label: 'Vendas', icon: ShoppingCart, color: 'lime' },
];

const flowValues = [
  attributionFlow.impressoes,
  attributionFlow.cliques,
  attributionFlow.leads,
  attributionFlow.conversasBot,
  attributionFlow.qualificados,
  attributionFlow.vendas,
];

function getConversionRate(from, to) {
  if (!from || from === 0) return '—';
  return ((to / from) * 100).toFixed(1) + '%';
}

// ───── Custom Tooltip for Charts ─────
function ChartTooltip({ active, payload, label, valuePrefix = '', valueSuffix = '' }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#101417',
        border: '1px solid #1E2328',
        borderRadius: 10,
        padding: '10px 14px',
        fontSize: '0.8rem',
      }}
    >
      <p style={{ color: '#8A8F98', marginBottom: 4 }}>{label}</p>
      <p style={{ color: '#F0EEE9', fontWeight: 700 }}>
        {valuePrefix}
        {typeof payload[0].value === 'number' ? payload[0].value.toFixed(1) : payload[0].value}
        {valueSuffix}
      </p>
    </div>
  );
}

export default function Traffic() {
  const [activeTab, setActiveTab] = useState('campanhas');

  // Sort campaigns by receita desc
  const sortedCampaigns = useMemo(
    () => [...campaigns].sort((a, b) => b.receita - a.receita),
    []
  );

  // Chart data
  const roasChartData = useMemo(
    () =>
      sortedCampaigns.map((c) => ({
        name: c.nome.length > 22 ? c.nome.slice(0, 20) + '…' : c.nome,
        roas: c.roas,
        fill: c.roas >= 15 ? '#B6FF3B' : c.roas >= 5 ? '#FF6A3D' : '#FF3BD4',
      })),
    [sortedCampaigns]
  );

  const cpaChartData = useMemo(
    () =>
      sortedCampaigns.map((c) => ({
        name: c.nome.length > 22 ? c.nome.slice(0, 20) + '…' : c.nome,
        cpa: c.cpa,
        fill: c.cpa <= 100 ? '#00F5D4' : c.cpa <= 200 ? '#FF6A3D' : '#FF3BD4',
      })),
    [sortedCampaigns]
  );

  // Criativos: best 3 by ROAS, worst 3 by ROAS
  const bestCreatives = useMemo(
    () => [...campaigns].sort((a, b) => b.roas - a.roas).slice(0, 3),
    []
  );
  const worstCreatives = useMemo(
    () => [...campaigns].sort((a, b) => a.roas - b.roas).slice(0, 3),
    []
  );

  const tabs = [
    { id: 'campanhas', label: 'Campanhas', icon: Megaphone },
    { id: 'performance', label: 'Performance', icon: BarChart3 },
    { id: 'criativos', label: 'Criativos', icon: Palette },
  ];

  function getStatusBadgeClass(status) {
    if (status === 'ativo') return 'badge badge-lime';
    if (status === 'pausado') return 'badge badge-neutral';
    if (status === 'problemático') return 'badge badge-pink';
    return 'badge badge-neutral';
  }

  function getStatusLabel(status) {
    if (status === 'ativo') return 'Ativo';
    if (status === 'pausado') return 'Pausado';
    if (status === 'problemático') return 'Problema';
    return status;
  }

  function getPlatformBadge(plataforma) {
    if (plataforma === 'meta') return 'badge badge-neutral';
    if (plataforma === 'tiktok') return 'badge badge-tiktok';
    return 'badge badge-neutral';
  }

  function getPlatformLabel(plataforma) {
    if (plataforma === 'meta') return 'Meta Ads';
    if (plataforma === 'tiktok') return 'TikTok Ads';
    return plataforma;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ────── 1. Attribution Flow ────── */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="card-header">
          <h2 className="card-title">Funil de Atribuição — De Ponta a Ponta</h2>
        </div>

        <div className="flow-container">
          {flowSteps.map((step, i) => {
            const Icon = step.icon;
            const value = flowValues[i];

            return (
              <div key={step.key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                {/* Node */}
                <motion.div
                  className="flow-node"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.12, duration: 0.4 }}
                >
                  <div
                    className={`flow-node-icon ${step.color}`}
                    style={{
                      background:
                        step.color === 'lime'
                          ? 'var(--neon-lime-dim)'
                          : 'var(--neon-teal-dim)',
                      color:
                        step.color === 'lime'
                          ? 'var(--neon-lime)'
                          : 'var(--neon-teal)',
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <div className="flow-node-label">{step.label}</div>
                  <div className="flow-node-value" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: 4 }}>
                    {formatCompact(value)}
                  </div>
                </motion.div>

                {/* Arrow + conversion rate */}
                {i < flowSteps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.12 + 0.08, duration: 0.3 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
                  >
                    <div className="flow-arrow">
                      <ChevronRight size={22} />
                    </div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>
                      {getConversionRate(flowValues[i], flowValues[i + 1])}
                    </span>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ────── 2. Tabs ────── */}
      <div className="tabs">
        {tabs.map((t) => {
          const TabIcon = t.icon;
          return (
            <button
              key={t.id}
              className={`tab${activeTab === t.id ? ' active' : ''}`}
              onClick={() => setActiveTab(t.id)}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <TabIcon size={16} />
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ────── 3. Campanhas Tab ────── */}
      {activeTab === 'campanhas' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Campanhas Ativas</h3>
              <span className="card-action">{sortedCampaigns.length} campanhas</span>
            </div>
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Plataforma</th>
                    <th>Status</th>
                    <th>Gasto (R$)</th>
                    <th>Leads</th>
                    <th>Vendas</th>
                    <th>ROAS</th>
                    <th>CPA</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCampaigns.map((c) => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{c.nome}</td>
                      <td>
                        <span className={getPlatformBadge(c.plataforma)}>
                          {getPlatformLabel(c.plataforma)}
                        </span>
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(c.status)}>
                          {getStatusLabel(c.status)}
                        </span>
                      </td>
                      <td>{formatCurrency(c.gasto)}</td>
                      <td>{formatNumber(c.leads)}</td>
                      <td>{formatNumber(c.vendas)}</td>
                      <td>
                        <span
                          style={{
                            fontWeight: 700,
                            color:
                              c.roas > 15
                                ? 'var(--neon-lime)'
                                : c.roas < 5
                                ? 'var(--pink)'
                                : 'var(--text-primary)',
                          }}
                        >
                          {c.roas.toFixed(1)}x
                        </span>
                      </td>
                      <td>
                        <span
                          style={{
                            fontWeight: 600,
                            color:
                              c.cpa > 200
                                ? 'var(--coral)'
                                : 'var(--text-primary)',
                          }}
                        >
                          {formatCurrency(c.cpa)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {/* ────── 4. Performance Tab ────── */}
      {activeTab === 'performance' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid-2">
            {/* ROAS Chart */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">ROAS por Campanha</h3>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={roasChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2328" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#8A8F98', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={150}
                      tick={{ fill: '#8A8F98', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<ChartTooltip valueSuffix="x" />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="roas" radius={[0, 6, 6, 0]} barSize={18}>
                      {roasChartData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* CPA Chart */}
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">CPA por Campanha</h3>
              </div>
              <div className="chart-container">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={cpaChartData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2328" horizontal={false} />
                    <XAxis type="number" tick={{ fill: '#8A8F98', fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      width={150}
                      tick={{ fill: '#8A8F98', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<ChartTooltip valuePrefix="R$ " />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                    <Bar dataKey="cpa" radius={[0, 6, 6, 0]} barSize={18}>
                      {cpaChartData.map((entry, idx) => (
                        <Cell key={idx} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ────── 5. Criativos Tab ────── */}
      {activeTab === 'criativos' && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Best Performers */}
          <div className="section-header">
            <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={20} style={{ color: 'var(--neon-lime)' }} />
              Melhores Criativos
            </h3>
          </div>
          <div className="grid-3" style={{ marginBottom: 'var(--space-2xl)' }}>
            {bestCreatives.map((c, i) => (
              <motion.div
                key={c.id}
                className="card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.35 }}
                style={{ borderColor: 'rgba(182, 255, 59, 0.3)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-md)' }}>
                  <span
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--neon-lime-dim)',
                      color: 'var(--neon-lime)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '0.8rem',
                    }}
                  >
                    #{i + 1}
                  </span>
                  <span className={getPlatformBadge(c.plataforma)} style={{ marginLeft: 'auto' }}>
                    {getPlatformLabel(c.plataforma)}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {c.nome}
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-md)' }}>
                  {c.criativo}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>ROAS</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--neon-lime)' }}>{c.roas.toFixed(1)}x</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>Receita</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{formatCurrency(c.receita)}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Worst Performers */}
          <div className="section-header">
            <h3 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingDown size={20} style={{ color: 'var(--pink)' }} />
              Piores Criativos
            </h3>
          </div>
          <div className="grid-3">
            {worstCreatives.map((c, i) => {
              const wastedSpend = c.roas < 5 ? c.gasto - c.receita / 5 : 0;
              return (
                <motion.div
                  key={c.id}
                  className="card"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.35 }}
                  style={{ borderColor: 'rgba(255, 59, 212, 0.3)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-md)' }}>
                    <span
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--pink-dim)',
                        color: 'var(--pink)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                      }}
                    >
                      <AlertTriangle size={14} />
                    </span>
                    <span className={getPlatformBadge(c.plataforma)} style={{ marginLeft: 'auto' }}>
                      {getPlatformLabel(c.plataforma)}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                    {c.nome}
                  </h4>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: 'var(--space-md)' }}>
                    {c.criativo}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>ROAS</div>
                      <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--pink)' }}>{c.roas.toFixed(1)}x</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {wastedSpend > 0 ? 'Gasto Desperdiçado' : 'Gasto Total'}
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--coral)' }}>
                        {formatCurrency(wastedSpend > 0 ? wastedSpend : c.gasto)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
