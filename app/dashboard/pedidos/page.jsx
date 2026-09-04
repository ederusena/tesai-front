'use client'

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Package, DollarSign, Clock, TrendingUp, Send, Eye, Loader2 } from 'lucide-react';
import { getAdminOrders, addOrderTracking, notifyCustomer } from '../../../src/services/api';
import { formatCurrency, getStatusBadge, getChannelBadgeClass } from '../../../src/utils/formatters.js';

// Status filter map — maps UI labels to API status values
const statusFilterMap = {
  Todos: null,
  Pagos: 'delivered',
  Pendentes: 'payment_waiting',
  Enviados: 'in_transit',
  Entregues: 'delivered',
};

export default function Pedidos() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Load orders from API
  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);
      const filters = {};
      const status = statusFilterMap[activeFilter];
      if (status) filters.status = status;

      const data = await getAdminOrders(filters);
      setOrders(data);
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
    } finally {
      setLoading(false);
    }
  }, [activeFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(loadOrders, 30000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  // Compute stats
  const totalVendas = orders.length;
  const receitaHoje = orders.reduce((sum, o) => sum + (o.totalBrl || 0), 0);
  const pedidosPendentes = orders.filter((o) => o.status === 'payment_waiting' || o.status === 'pending').length;
  const ticketMedio = totalVendas > 0 ? receitaHoje / totalVendas : 0;

  const getPaymentBadge = (order) => {
    const payStatus = order.payment?.status;
    if (payStatus === 'confirmed') {
      return <span className="badge badge-lime">Pix ✓</span>;
    }
    return <span className="badge badge-coral">Pendente</span>;
  };

  const handleSendTracking = async (orderId) => {
    const trackingCode = prompt('Insira o código de rastreio:');
    if (!trackingCode) return;

    try {
      await addOrderTracking(orderId, { trackingCode, carrier: 'Correios' });
      loadOrders();
    } catch (err) {
      alert('Erro ao adicionar rastreio: ' + err.message);
    }
  };

  const handleNotifyCustomer = async (orderId) => {
    try {
      await notifyCustomer(orderId, {
        message: 'Seu pedido está sendo processado! Acompanhe pelo nosso sistema.',
        channel: 'whatsapp',
      });
      alert('Notificação enviada com sucesso!');
    } catch (err) {
      alert('Erro ao notificar: ' + err.message);
    }
  };

  const filters = ['Todos', 'Pagos', 'Pendentes', 'Enviados', 'Entregues'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ============ 1. LIVE SALES FEED ============ */}
      <div className="card" style={{ marginBottom: 'var(--space-xl)' }}>
        <div className="card-header">
          <h3 className="card-title">📱 Feed de Vendas — Pedidos Recentes</h3>
          <span className="badge badge-lime" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span
              className="status-dot online"
              style={{ width: 8, height: 8 }}
            />
            AO VIVO
          </span>
        </div>

        <div className="live-feed">
          {loading ? (
            <div className="empty-state" style={{ padding: 'var(--space-lg)' }}>
              <Loader2 className="animate-spin" />
              <p>Carregando pedidos...</p>
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {orders.slice(0, 8).map((order, index) => (
                <motion.div
                  key={order.id}
                  className={`live-feed-item${index === 0 ? ' new' : ''}`}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  layout
                >
                  <div
                    className="live-feed-emoji"
                    style={{ background: 'var(--neon-lime-dim)' }}
                  >
                    📦
                  </div>
                  <div className="live-feed-info">
                    <div className="live-feed-title">💰 {order.orderNumber}</div>
                    <div className="live-feed-sub">
                      {order.customer?.name} — {order.items?.[0]?.productName || 'Pedido'}
                    </div>
                  </div>
                  <div className="live-feed-amount">
                    {formatCurrency(order.totalBrl)}
                  </div>
                  <span className={`badge ${getChannelBadgeClass(order.sourceChannel)}`} style={{ fontSize: '0.6rem', padding: '2px 8px' }}>
                    {order.sourceChannel}
                  </span>
                  <div className="live-feed-time">
                    {new Date(order.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* ============ 2. STATS ROW ============ */}
      <div className="kpi-grid">
        <motion.div className="stat-card" whileHover={{ y: -2 }}>
          <div className="stat-card-icon lime"><DollarSign size={22} /></div>
          <div className="stat-card-label">Total Pedidos</div>
          <div className="stat-card-value">{totalVendas}</div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -2 }}>
          <div className="stat-card-icon lime"><TrendingUp size={22} /></div>
          <div className="stat-card-label">Receita Total</div>
          <div className="stat-card-value">{formatCurrency(receitaHoje)}</div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -2 }}>
          <div className="stat-card-icon coral"><Clock size={22} /></div>
          <div className="stat-card-label">Pedidos Pendentes</div>
          <div className="stat-card-value">{pedidosPendentes}</div>
        </motion.div>

        <motion.div className="stat-card" whileHover={{ y: -2 }}>
          <div className="stat-card-icon teal"><Package size={22} /></div>
          <div className="stat-card-label">Ticket Médio</div>
          <div className="stat-card-value">{formatCurrency(ticketMedio)}</div>
        </motion.div>
      </div>

      {/* ============ 3. FILTERS ============ */}
      <div className="pedidos-filters">
        <div className="category-pills">
          {filters.map((f) => (
            <button
              key={f}
              className={`category-pill${activeFilter === f ? ' active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ============ 4. ORDERS TABLE + DETAIL ============ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--space-lg)' }}>
        {/* Left — Orders Table */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Pedido</th>
                  <th>Cliente</th>
                  <th>Produto</th>
                  <th>Valor</th>
                  <th>Canal</th>
                  <th>Pag.</th>
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
                        background: isSelected ? 'var(--neon-lime-dim)' : undefined,
                      }}
                    >
                      <td style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--neon-teal)' }}>
                        {order.orderNumber}
                      </td>
                      <td>
                        <div style={{ fontWeight: 500 }}>{order.customer?.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                          {order.customer?.addressCity}, {order.customer?.addressState}
                        </div>
                      </td>
                      <td style={{ fontSize: '0.8rem' }}>{order.items?.[0]?.productName || '-'}</td>
                      <td style={{ fontWeight: 600, color: 'var(--neon-lime)' }}>
                        {formatCurrency(order.totalBrl)}
                      </td>
                      <td>
                        <span className={`badge ${getChannelBadgeClass(order.sourceChannel)}`}>
                          {order.sourceChannel}
                        </span>
                      </td>
                      <td>{getPaymentBadge(order)}</td>
                      <td>
                        <span className={`badge ${statusInfo.class}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-tertiary)', padding: 'var(--space-xl)' }}>
                      Nenhum pedido encontrado
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right — Order Detail Panel */}
        <div className="card">
          {selectedOrder ? (
            <motion.div
              key={selectedOrder.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Order Header */}
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                  <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1rem', fontWeight: 700 }}>
                    {selectedOrder.orderNumber}
                  </h3>
                  <span className={`badge ${getStatusBadge(selectedOrder.status).class}`}>
                    {getStatusBadge(selectedOrder.status).label}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Cliente:</strong> {selectedOrder.customer?.name}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Cidade:</strong> {selectedOrder.customer?.addressCity}, {selectedOrder.customer?.addressState}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>Produto:</strong> {selectedOrder.items?.[0]?.productName || '-'}
                  </div>
                </div>
              </div>

              {/* Valores */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 'var(--space-md)',
                padding: 'var(--space-md)',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                marginBottom: 'var(--space-lg)',
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                    Valor USD
                  </div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--neon-teal)' }}>
                    {formatCurrency(selectedOrder.totalUsd || 0, 'USD')}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
                    Valor BRL
                  </div>
                  <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem', color: 'var(--neon-lime)' }}>
                    {formatCurrency(selectedOrder.totalBrl)}
                  </div>
                </div>
              </div>

              {/* Rastreio */}
              <div style={{ marginBottom: 'var(--space-lg)' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--space-sm)' }}>
                  Código de Rastreio
                </div>
                <div style={{
                  padding: 'var(--space-sm) var(--space-md)',
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'monospace',
                  fontSize: '0.85rem',
                  color: selectedOrder.shipment?.trackingCode ? 'var(--neon-teal)' : 'var(--text-tertiary)',
                  border: '1px solid var(--border-subtle)',
                }}>
                  {selectedOrder.shipment?.trackingCode || 'Aguardando envio...'}
                </div>
              </div>

              {/* Shipment Events Timeline */}
              {selectedOrder.shipment?.events && selectedOrder.shipment.events.length > 0 && (
                <div style={{ marginBottom: 'var(--space-lg)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 'var(--space-md)' }}>
                    Etapas do Pedido
                  </div>
                  <div className="timeline">
                    {selectedOrder.shipment.events.map((event, i) => {
                      const isFirst = i === 0;
                      return (
                        <div key={i} className="timeline-item">
                          <div className={`timeline-dot ${isFirst ? 'active' : 'completed'}`} />
                          <div className="timeline-content">
                            <div className="timeline-title">{event.description}</div>
                            <div className="timeline-desc">
                              {event.location} — {new Date(event.occurredAt).toLocaleDateString('pt-BR')}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => handleSendTracking(selectedOrder.id)}
                >
                  <Send size={14} />
                  Enviar Rastreio
                </button>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ flex: 1 }}
                  onClick={() => handleNotifyCustomer(selectedOrder.id)}
                >
                  <Bell size={14} />
                  Notificar Cliente
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="empty-state">
              <Eye size={48} />
              <p style={{ marginTop: 'var(--space-md)', fontSize: '0.85rem' }}>
                Selecione um pedido na tabela para ver os detalhes
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
