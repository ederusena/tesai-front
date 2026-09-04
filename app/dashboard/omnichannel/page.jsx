'use client'

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquare,
  Search,
  Send,
  Bot,
  MapPin,
  MoreVertical,
  Paperclip,
  Smile,
} from 'lucide-react';
import { channels, conversations, chatMessages, botMetrics } from '../../../src/data/mockData';
import { formatNumber, getChannelBadgeClass } from '../../../src/utils/formatters';

const channelIcons = {
  whatsapp: '📱',
  instagram: '📸',
  tiktok: '🎵',
  telegram: '✈️',
};

const channelLabels = {
  whatsapp: 'WhatsApp',
  instagram: 'Instagram',
  tiktok: 'TikTok',
  telegram: 'Telegram',
};

const filterTabs = [
  { id: 'todos', label: 'Todos' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'tiktok', label: 'TikTok' },
  { id: 'telegram', label: 'Telegram' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function Omnichannel() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('todos');

  const filteredChannels = channels.filter(
    (ch) => ch.id !== 'meta'
  );

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch =
      conv.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.ultimaMensagem.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      activeFilter === 'todos' || conv.canal === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}
    >
      {/* ============================================
          1. CHANNEL STATUS CARDS
          ============================================ */}
      <motion.div variants={itemVariants}>
        <div className="section-header">
          <h2 className="section-title">Canais Ativos</h2>
          <span className="badge badge-lime">
            <span className="status-dot online" />
            Todos Online
          </span>
        </div>
        <div className="channel-grid">
          {filteredChannels.map((channel) => (
            <motion.div
              key={channel.id}
              className="channel-card"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <div className="channel-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                  <div
                    className="channel-card-icon"
                    style={{
                      background: `${channel.color}26`,
                      color: channel.color,
                      fontSize: '1.2rem',
                    }}
                  >
                    {channelIcons[channel.id]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{channel.name}</div>
                  </div>
                </div>
                <span className={`badge ${channel.status === 'online' ? 'badge-lime' : 'badge-neutral'}`}>
                  <span className={`status-dot ${channel.status}`} />
                  {channel.status === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
              <div className="channel-card-stats">
                <div className="channel-card-stat">
                  <span className="channel-card-stat-label">Conversas Ativas</span>
                  <span className="channel-card-stat-value">{formatNumber(channel.conversasAtivas)}</span>
                </div>
                <div className="channel-card-stat">
                  <span className="channel-card-stat-label">Leads Hoje</span>
                  <span className="channel-card-stat-value">{formatNumber(channel.leadsHoje)}</span>
                </div>
                <div className="channel-card-stat">
                  <span className="channel-card-stat-label">Vendas Hoje</span>
                  <span className="channel-card-stat-value">{formatNumber(channel.vendasHoje)}</span>
                </div>
                <div className="channel-card-stat">
                  <span className="channel-card-stat-label">Tempo Médio Resposta</span>
                  <span className="channel-card-stat-value" style={{ color: 'var(--neon-teal)' }}>
                    {channel.tempoMedioResposta}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ============================================
          2. BOT PERFORMANCE BAR
          ============================================ */}
      <motion.div variants={itemVariants}>
        <div
          className="stat-card"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2xl)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
            <div className="stat-card-icon teal">
              <Bot size={22} />
            </div>
            <div>
              <div className="stat-card-label">Total Atendimentos</div>
              <div className="stat-card-value" style={{ fontSize: '1.5rem' }}>
                {formatNumber(botMetrics.totalAtendimentos)}
              </div>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: '200px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="stat-card-label">Taxa Resolução IA</span>
              <span style={{ color: 'var(--neon-lime)', fontWeight: 700, fontSize: '0.9rem' }}>
                {botMetrics.taxaResolucao}%
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden',
              }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${botMetrics.taxaResolucao}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--neon-lime), var(--neon-teal))',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--neon-lime-glow)',
                }}
              />
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div className="stat-card-label">Carrinho Recuperado</div>
            <div className="stat-card-value" style={{ fontSize: '1.5rem', color: 'var(--coral)' }}>
              {botMetrics.carrinhoRecuperado}
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div className="stat-card-label">Vendas Bot</div>
            <div className="stat-card-value" style={{ fontSize: '1.5rem', color: 'var(--neon-lime)' }}>
              {botMetrics.vendasFechadasBot}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ============================================
          3. CHAT SECTION
          ============================================ */}
      <motion.div variants={itemVariants}>
        <div className="section-header">
          <h2 className="section-title">
            <MessageSquare size={20} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            Central de Mensagens
          </h2>
        </div>

        <div className="chat-container">
          {/* --- LEFT PANEL: Conversation List --- */}
          <div className="chat-sidebar">
            <div className="chat-sidebar-header">
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: '1rem' }}>
                Conversas
              </h3>
              <span className="badge badge-teal">{conversations.length}</span>
            </div>

            {/* Filter Tabs */}
            <div
              style={{
                display: 'flex',
                gap: '4px',
                padding: 'var(--space-sm) var(--space-md)',
                borderBottom: '1px solid var(--border-subtle)',
                overflowX: 'auto',
              }}
            >
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`btn btn-sm ${activeFilter === tab.id ? 'btn-primary' : 'btn-ghost'}`}
                  style={{
                    padding: '4px 10px',
                    fontSize: '0.65rem',
                    borderRadius: 'var(--radius-full)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="chat-search">
              <div style={{ position: 'relative' }}>
                <Search
                  size={14}
                  style={{
                    position: 'absolute',
                    left: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--text-tertiary)',
                  }}
                />
                <input
                  type="text"
                  placeholder="Buscar conversa..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ paddingLeft: '32px' }}
                />
              </div>
            </div>

            {/* Conversation List */}
            <div className="chat-list">
              <AnimatePresence>
                {filteredConversations.map((conv) => (
                  <motion.div
                    key={conv.id}
                    className={`chat-list-item ${selectedConversation?.id === conv.id ? 'active' : ''}`}
                    onClick={() => setSelectedConversation(conv)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    layout
                  >
                    <div
                      className="chat-avatar"
                      style={{
                        background: conv.avatarColor,
                        color: '#fff',
                      }}
                    >
                      {conv.avatar}
                    </div>
                    <div className="chat-item-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="chat-item-name">{conv.nome}</span>
                        <span
                          className={`badge ${getChannelBadgeClass(conv.canal)}`}
                          style={{ fontSize: '0.55rem', padding: '1px 6px' }}
                        >
                          {channelLabels[conv.canal] || conv.canal}
                        </span>
                      </div>
                      <div className="chat-item-preview">{conv.ultimaMensagem}</div>
                    </div>
                    <div className="chat-item-meta">
                      <span className="chat-item-time">{conv.horario}</span>
                      {conv.naoLidas > 0 && (
                        <span className="chat-item-unread">{conv.naoLidas}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredConversations.length === 0 && (
                <div className="empty-state" style={{ padding: 'var(--space-xl)' }}>
                  <Search size={32} />
                  <p style={{ marginTop: 'var(--space-sm)', fontSize: '0.8rem' }}>
                    Nenhuma conversa encontrada
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* --- RIGHT PANEL: Chat Messages --- */}
          <div className="chat-main">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="chat-main-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
                    <div
                      className="chat-avatar"
                      style={{
                        background: selectedConversation.avatarColor,
                        color: '#fff',
                      }}
                    >
                      {selectedConversation.avatar}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                        {selectedConversation.nome}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-sm)',
                          fontSize: '0.75rem',
                          color: 'var(--text-tertiary)',
                        }}
                      >
                        <span
                          className={`badge ${getChannelBadgeClass(selectedConversation.canal)}`}
                          style={{ fontSize: '0.6rem', padding: '1px 6px' }}
                        >
                          {channelLabels[selectedConversation.canal] || selectedConversation.canal}
                        </span>
                        <MapPin size={12} />
                        <span>{selectedConversation.cidade}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
                    <span className="badge badge-teal" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Bot size={12} />
                      Bot Ativo
                    </span>
                    <button className="btn btn-ghost btn-icon">
                      <MoreVertical size={18} />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="chat-messages">
                  {chatMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      className={`chat-bubble ${msg.tipo}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {msg.tipo === 'bot' && (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginBottom: '6px',
                            fontSize: '0.7rem',
                            color: 'var(--neon-teal)',
                            fontWeight: 600,
                          }}
                        >
                          🤖 Spark Bot
                        </div>
                      )}
                      <div style={{ whiteSpace: 'pre-line' }}>{msg.texto}</div>
                      <div className="chat-bubble-time">{msg.horario}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Input Area */}
                <div className="chat-input-area">
                  <button className="btn btn-ghost btn-icon" disabled>
                    <Paperclip size={18} />
                  </button>
                  <input
                    className="chat-input"
                    type="text"
                    placeholder="O bot está atendendo..."
                    disabled
                  />
                  <button className="btn btn-ghost btn-icon" disabled>
                    <Smile size={18} />
                  </button>
                  <button className="btn btn-primary btn-icon" disabled style={{ opacity: 0.5 }}>
                    <Send size={18} />
                  </button>
                </div>
              </>
            ) : (
              <div className="empty-state" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <MessageSquare size={48} />
                <p style={{ marginTop: 'var(--space-md)', fontSize: '0.9rem' }}>
                  Selecione uma conversa para visualizar
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
