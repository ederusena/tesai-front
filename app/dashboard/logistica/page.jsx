'use client'

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Copy,
  RefreshCw,
  MapPin,
  Loader2,
} from 'lucide-react';
import { getAdminOrders, getCurrencyRates } from '../../../src/services/api';
import { formatCurrency, getChannelBadgeClass, getStatusBadge } from '../../../src/utils/formatters';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function Logistics() {
  const [orders, setOrders] = useState([]);
  const [rates, setRates] = useState({ USD_BRL: 5.61, PYG_BRL: 0.00076, USD_PYG: 7380, lastUpdate: '-' });
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Currency converter state
  const [usdToBrl, setUsdToBrl] = useState(100);
  const [pygToBrl, setPygToBrl] = useState(100000);
  const [usdToPyg, setUsdToPyg] = useState(100);

  // Load orders and rates
  useEffect(() => {
    Promise.all([
      getAdminOrders(),
      getCurrencyRates().catch(() => []),
    ])
      .then(([ordersData, ratesData]) => {
        setOrders(ordersData || []);
        if (ordersData && ordersData.length > 0) {
          setSelectedOrder(ordersData[0]);
        }

        // Parse rates
        const rateMap = {};
        for (const r of ratesData) {
          rateMap[`${r.fromCurrency}_${r.toCurrency}`] = r.rate;
        }
        if (Object.keys(rateMap).length > 0) {
          setRates({
            USD_BRL: rateMap['USD_BRL'] || 5.61,
            PYG_BRL: rateMap['PYG_BRL'] || 0.00076,
            USD_PYG: rateMap['USD_PYG'] || 7380,
            lastUpdate: ratesData[0]?.fetchedAt
              ? new Date(ratesData[0].fetchedAt).toLocaleString('pt-BR')
              : '-',
          });
        }
      })
      .catch((err) => console.error('Erro ao carregar logística:', err))
      .finally(() => setLoading(false));
  }, []);

  // Shipment stats
  const totalPedidos = orders.length;
  const emTransito = orders.filter((o) => o.status === 'in_transit').length;
  const entregues = orders.filter((o) => o.status === 'delivered').length;

  // Route steps
  const routeSteps = [
    { emoji: '🏪', label: 'Ciudad del Este' },
    { emoji: '🚛', label: 'Ponte da Amizade' },
    { emoji: '📦', label: 'Foz do Iguaçu (Redespacho)' },
    { emoji: '📮', label: 'Correios' },
    { emoji: '🏠', label: 'Destino Final' },
  ];

  if (loading) {
    return (
      <div className="empty-state" style={{ display: 'flex', height: '60vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={32} style={{ color: 'var(--brand)', marginBottom: 12 }} />
        <p style={{ color: 'var(--text-secondary)' }}>Carregando logística...</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}
    >
      {/* ========== 1. CURRENCY CONVERTER ========== */}
      <motion.div variants={itemVariants} className="converter-card">
        <div className="card-header">
          <h2 className="card-title">
            <RefreshCw size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Conversor de Moedas Cross-Border
          </h2>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
            Última atualização: {rates.lastUpdate}
          </span>
        </div>

        {/* USD → BRL */}
        <div className="converter-row">
          <span className="converter-currency">USD</span>
          <input
            type="number"
            className="converter-input"
            value={usdToBrl}
            onChange={(e) => setUsdToBrl(Number(e.target.value))}
          />
          <ArrowRight size={20} style={{ color: 'var(--neon-lime)', flexShrink: 0 }} />
          <span className="converter-currency">BRL</span>
          <input
            type="text"
            className="converter-input"
            value={formatCurrency(usdToBrl * rates.USD_BRL)}
            readOnly
          />
        </div>

        {/* PYG → BRL */}
        <div className="converter-row">
          <span className="converter-currency">PYG</span>
          <input
            type="number"
            className="converter-input"
            value={pygToBrl}
            onChange={(e) => setPygToBrl(Number(e.target.value))}
          />
          <ArrowRight size={20} style={{ color: 'var(--neon-teal)', flexShrink: 0 }} />
          <span className="converter-currency">BRL</span>
          <input
            type="text"
            className="converter-input"
            value={formatCurrency(pygToBrl * rates.PYG_BRL)}
            readOnly
          />
        </div>

        {/* USD → PYG */}
        <div className="converter-row" style={{ marginBottom: 0 }}>
          <span className="converter-currency">USD</span>
          <input
            type="number"
            className="converter-input"
            value={usdToPyg}
            onChange={(e) => setUsdToPyg(Number(e.target.value))}
          />
          <ArrowRight size={20} style={{ color: 'var(--coral)', flexShrink: 0 }} />
          <span className="converter-currency">PYG</span>
          <input
            type="text"
            className="converter-input"
            value={new Intl.NumberFormat('pt-BR').format(usdToPyg * rates.USD_PYG)}
            readOnly
          />
        </div>
      </motion.div>

      {/* ========== 2. SHIPMENT STATS ========== */}
      <motion.div variants={itemVariants} className="grid-4">
        <div className="stat-card">
          <div className="stat-card-icon lime"><Package size={22} /></div>
          <div className="stat-card-label">Total Pedidos</div>
          <div className="stat-card-value">{totalPedidos}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon teal"><Truck size={22} /></div>
          <div className="stat-card-label">Em Trânsito</div>
          <div className="stat-card-value">{emTransito}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon coral"><CheckCircle2 size={22} /></div>
          <div className="stat-card-label">Entregues</div>
          <div className="stat-card-value">{entregues}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon pink"><Clock size={22} /></div>
          <div className="stat-card-label">Tempo Médio</div>
          <div className="stat-card-value">4.2 dias</div>
        </div>
      </motion.div>

      {/* ========== 3. ORDERS TABLE + DETAIL ========== */}
      <motion.div
        variants={itemVariants}
        style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 'var(--space-lg)' }}
      >
        {/* --- Orders Table --- */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Pedidos Cross-Border</h3>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Cidade</th>
                  <th>Produto</th>
                  <th>Valor (BRL)</th>
                  <th>Canal</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const statusInfo = getStatusBadge(order.status);
                  const isSelected = selectedOrder?.id === order.id;
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      style={{
                        cursor: 'pointer',
                        background: isSelected
                          ? 'var(--neon-lime-dim)'
                          : undefined,
                      }}
                    >
                      <td style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--neon-teal)' }}>
                        {order.orderNumber}
                      </td>
                      <td>{order.customer?.name}</td>
                      <td style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                        {order.customer?.addressCity}
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>{order.items?.[0]?.productName || '-'}</td>
                      <td style={{ fontWeight: 600 }}>{formatCurrency(order.totalBrl)}</td>
                      <td>
                        <span className={`badge ${getChannelBadgeClass(order.sourceChannel)}`}>
                          {order.sourceChannel}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${statusInfo.class}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-tertiary)' }}>
                      Nenhum pedido encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- Order Detail Panel --- */}
        <div className="card">
          {selectedOrder ? (
            <>
              <div className="card-header">
                <h3 className="card-title">Detalhes do Pedido</h3>
                <span
                  className={`badge ${getStatusBadge(selectedOrder.status).class}`}
                >
                  {getStatusBadge(selectedOrder.status).label}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {/* Order Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Pedido</div>
                  <div style={{ fontWeight: 700, color: 'var(--neon-teal)', fontSize: '1.1rem' }}>
                    {selectedOrder.orderNumber}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Cliente</div>
                  <div style={{ fontWeight: 600 }}>{selectedOrder.customer?.name}</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Produto</div>
                  <div style={{ fontWeight: 500 }}>{selectedOrder.items?.[0]?.productName || '-'}</div>
                </div>

                <div style={{ display: 'flex', gap: 'var(--space-lg)' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Valor USD
                    </div>
                    <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)' }}>
                      {formatCurrency(selectedOrder.totalUsd || 0, 'USD')}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Valor BRL
                    </div>
                    <div style={{ fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--neon-lime)' }}>
                      {formatCurrency(selectedOrder.totalBrl)}
                    </div>
                  </div>
                </div>

                {/* Tracking Code */}
                {selectedOrder.shipment?.trackingCode && (
                  <div style={{
                    background: 'var(--bg-elevated)',
                    padding: 'var(--space-md)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid var(--border-subtle)',
                  }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', marginBottom: 2 }}>
                        Código de Rastreio
                      </div>
                      <div style={{ fontWeight: 600, fontFamily: 'monospace', fontSize: '0.9rem', letterSpacing: '0.5px' }}>
                        {selectedOrder.shipment.trackingCode}
                      </div>
                    </div>
                    <button
                      className="btn btn-ghost btn-icon"
                      onClick={() => {
                        if (typeof navigator !== 'undefined') {
                          navigator.clipboard.writeText(selectedOrder.shipment.trackingCode);
                        }
                      }}
                      title="Copiar código"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                )}

                {/* Timeline */}
                {selectedOrder.shipment?.events && selectedOrder.shipment.events.length > 0 && (
                  <div style={{ marginTop: 'var(--space-sm)' }}>
                    <div style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                      fontWeight: 600,
                      marginBottom: 'var(--space-md)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      Rastreamento
                    </div>
                    <div className="timeline">
                      {selectedOrder.shipment.events.map((event, idx) => {
                        const isFirst = idx === 0;
                        return (
                          <motion.div
                            key={idx}
                            className="timeline-item"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <div className={`timeline-dot ${isFirst ? 'active' : 'completed'}`} />
                            <div className="timeline-content">
                              <div className="timeline-title">{event.description}</div>
                              <div className="timeline-desc">
                                {event.location} — {new Date(event.occurredAt).toLocaleDateString('pt-BR')}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <Package size={48} />
              <p>Selecione um pedido para ver os detalhes</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* ========== 4. CROSS-BORDER ROUTE VISUAL ========== */}
      <motion.div variants={itemVariants} className="card">
        <div className="card-header">
          <h3 className="card-title">
            <MapPin size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
            Rota Cross-Border
          </h3>
        </div>
        <div className="flow-container">
          {routeSteps.map((step, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <motion.div
                className="flow-node"
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <div className="flow-node-icon" style={{ fontSize: '2rem' }}>
                  {step.emoji}
                </div>
                <div className="flow-node-label">{step.label}</div>
              </motion.div>
              {idx < routeSteps.length - 1 && (
                <div className="flow-arrow">
                  <ArrowRight size={24} />
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
