'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Target,
  Receipt,
  ShoppingCart,
  Bot,
  CheckCircle2,
  MessageSquare,
  Loader2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

import { getAdminRevenue, getAdminTopProducts, getAdminChannels } from '../../src/services/api';
import { botMetrics } from '../../src/data/mockData';
import { formatCurrency, formatNumber } from '../../src/utils/formatters';

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

// --- Custom Tooltip for Charts ---
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: '#101417',
        border: '1px solid #1E2328',
        borderRadius: '10px',
        padding: '12px 16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      <p style={{ color: '#8A8F98', fontSize: '0.75rem', marginBottom: 6 }}>{label}</p>
      {payload.map((entry, i) => (
        <p key={i} style={{ color: entry.color, fontSize: '0.85rem', fontWeight: 600 }}>
          {entry.name === 'receita' ? 'Receita' : 'Gasto Ads'}:{' '}
          {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
};

// Channel color map
const channelColorMap = {
  whatsapp: '#25D366',
  instagram: '#E1306C',
  tiktok: '#00F2EA',
  telegram: '#0088CC',
  web: '#8A8F98',
};

export default function Dashboard() {
  const [revenue, setRevenue] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [channelData, setChannelData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('7d');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getAdminRevenue(period),
      getAdminTopProducts(6),
      getAdminChannels(),
    ])
      .then(([rev, top, channels]) => {
        setRevenue(rev);
        setTopProducts(top);
        setChannelData(channels);
      })
      .catch((err) => console.error('Erro ao carregar dashboard:', err))
      .finally(() => setLoading(false));
  }, [period]);

  if (loading || !revenue) {
    return (
      <div className="empty-state" style={{ display: 'flex', height: '60vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--brand)', marginBottom: 12 }} />
        <p style={{ color: 'var(--text-secondary)' }}>Carregando dashboard...</p>
      </div>
    );
  }

  // Chart data from API
  const chartData = (revenue.revenueByDay || []).map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    receita: d.revenue,
    gastoAds: 0,
  }));

  // Pie data from channels API
  const pieData = channelData.map((c) => ({
    name: c.channel,
    value: c.revenue,
    color: channelColorMap[c.channel] || '#8A8F98',
    percentage: c.percentage,
  }));

  // Custom Legend for Pie
  const PieLegend = ({ payload }) => {
    if (!payload) return null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {payload.map((entry, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: entry.color,
                flexShrink: 0,
              }}
            />
            <span style={{ color: '#F0EEE9', fontSize: '0.8rem', fontWeight: 500 }}>
              {entry.value}
            </span>
            <span style={{ color: '#8A8F98', fontSize: '0.75rem', marginLeft: 'auto' }}>
              {channelData[i]?.percentage || 0}%
            </span>
          </div>
        ))}
      </div>
    );
  };

  // KPI stat cards from API data
  const statCards = [
    {
      label: 'Total Pedidos',
      value: formatNumber(revenue.totalOrders),
      icon: ShoppingCart,
      iconColor: 'lime',
    },
    {
      label: 'Ticket Médio',
      value: formatCurrency(revenue.avgTicket),
      icon: Receipt,
      iconColor: 'teal',
    },
    {
      label: 'ROAS',
      value: revenue.roas > 0 ? `${revenue.roas}x` : 'N/A',
      icon: TrendingUp,
      iconColor: 'lime',
    },
    {
      label: 'Gasto Ads',
      value: formatCurrency(revenue.totalAds),
      icon: Target,
      iconColor: 'coral',
    },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* ===== PERIOD SELECTOR ===== */}
      <motion.div variants={itemVariants} style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="category-pills">
          {[
            { value: 'today', label: 'Hoje' },
            { value: '7d', label: '7 dias' },
            { value: '30d', label: '30 dias' },
          ].map((p) => (
            <button
              key={p.value}
              className={`category-pill${period === p.value ? ' active' : ''}`}
              onClick={() => setPeriod(p.value)}
            >
              {p.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ===== SPOTLIGHT SECTION ===== */}
      <motion.div className="spotlight-grid" variants={itemVariants}>
        {/* Card 1 — Gasto em Anúncios */}
        <motion.div className="spotlight-card coral" variants={itemVariants} whileHover={{ y: -4 }}>
          <div className="spotlight-label">GASTO EM ANÚNCIOS</div>
          <div className="spotlight-value coral">{formatCurrency(revenue.totalAds)}</div>
          <div className="spotlight-sub">período: {period}</div>
        </motion.div>

        {/* Card 2 — Faturamento */}
        <motion.div className="spotlight-card lime" variants={itemVariants} whileHover={{ y: -4 }}>
          <div className="spotlight-label">FATURAMENTO</div>
          <div className="spotlight-value lime">{formatCurrency(revenue.totalRevenue)}</div>
          <div className="spotlight-sub">{revenue.totalOrders} pedidos</div>
        </motion.div>

        {/* Card 3 — ROAS */}
        <motion.div className="spotlight-card teal" variants={itemVariants} whileHover={{ y: -4 }}>
          <div className="spotlight-label">ROAS</div>
          <div className="spotlight-value teal">{revenue.roas > 0 ? `${revenue.roas}x` : 'N/A'}</div>
          <div className="spotlight-sub">retorno sobre ads</div>
        </motion.div>
      </motion.div>

      {/* ===== KPI GRID ===== */}
      <motion.div className="kpi-grid" variants={itemVariants}>
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              className="stat-card"
              variants={itemVariants}
              whileHover={{ y: -2 }}
            >
              <div className={`stat-card-icon ${card.iconColor}`}>
                <Icon size={22} />
              </div>
              <div className="stat-card-label">{card.label}</div>
              <div className="stat-card-value">{card.value}</div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ===== CHARTS ROW ===== */}
      <motion.div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }} variants={itemVariants}>
        {/* Revenue Chart */}
        <motion.div className="card" variants={itemVariants}>
          <div className="card-header">
            <h3 className="card-title">Receita por Dia ({period})</h3>
          </div>
          <div className="chart-container">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradReceita" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#B6FF3B" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#B6FF3B" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2328" vertical={false} />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: '#5A5F68', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#5A5F68', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="receita"
                    stroke="#B6FF3B"
                    strokeWidth={2}
                    fill="url(#gradReceita)"
                    name="receita"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ height: '100%' }}>
                <p>Sem dados de receita no período</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Channel Revenue — Donut */}
        <motion.div className="card" variants={itemVariants}>
          <div className="card-header">
            <h3 className="card-title">Receita por Canal</h3>
          </div>
          <div className="chart-container">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend
                    content={<PieLegend />}
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                  />
                  <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                      background: '#101417',
                      border: '1px solid #1E2328',
                      borderRadius: '10px',
                      fontSize: '0.85rem',
                    }}
                    itemStyle={{ color: '#F0EEE9' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="empty-state" style={{ height: '100%' }}>
                <p>Sem dados de canal no período</p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* ===== TOP PRODUCTS TABLE ===== */}
      <motion.div className="card" style={{ marginBottom: 'var(--space-xl)' }} variants={itemVariants}>
        <div className="card-header">
          <h3 className="card-title">Produtos Mais Vendidos</h3>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Produto</th>
                <th>Vendas</th>
                <th>Receita</th>
                <th>Preço Médio</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.length > 0 ? (
                topProducts.map((product, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + i * 0.05 }}
                  >
                    <td style={{ fontWeight: 600 }}>{product.productName}</td>
                    <td>{formatNumber(product.totalSold)}</td>
                    <td>{formatCurrency(product.totalRevenue)}</td>
                    <td>{formatCurrency(product.avgPrice)}</td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    Nenhum produto vendido no período
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* ===== BOT PERFORMANCE CARD ===== */}
      <motion.div className="card" variants={itemVariants}>
        <div className="card-header">
          <h3 className="card-title">Desempenho do Bot</h3>
          <div className="badge badge-lime">
            <Bot size={12} />
            Online
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-lg)' }}>
          {/* Total Atendimentos */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
              <MessageSquare size={18} style={{ color: 'var(--neon-teal)' }} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              {formatNumber(botMetrics.totalAtendimentos)}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Atendimentos</div>
          </div>

          {/* Taxa de Resolução */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
              <CheckCircle2 size={18} style={{ color: 'var(--neon-lime)' }} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--neon-lime)' }}>
              {botMetrics.taxaResolucao}%
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 8 }}>Taxa de Resolução</div>
            {/* Resolution bar */}
            <div
              style={{
                height: 6,
                background: 'var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${botMetrics.taxaResolucao}%` }}
                transition={{ duration: 1, delay: 0.8, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--neon-lime), var(--neon-teal))',
                  borderRadius: 'var(--radius-full)',
                }}
              />
            </div>
          </div>

          {/* Vendas Fechadas Bot */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
              <ShoppingCart size={18} style={{ color: 'var(--neon-teal)' }} />
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--text-primary)' }}>
              {formatNumber(botMetrics.vendasFechadasBot)}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Vendas pelo Bot</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
