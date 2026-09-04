export const formatCurrency = (value, currency = 'BRL') => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'BRL' ? 2 : 0,
  }).format(value);
};

export const formatNumber = (value) => {
  return new Intl.NumberFormat('pt-BR').format(value);
};

export const formatPercent = (value) => {
  return `${value.toFixed(1)}%`;
};

export const formatCompact = (value) => {
  if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
  return value.toString();
};

export const getChangePercent = (current, previous) => {
  if (!previous) return 0;
  return ((current - previous) / previous * 100).toFixed(1);
};

export const getChannelBadgeClass = (canal) => {
  const map = {
    whatsapp: 'badge-whatsapp',
    instagram: 'badge-instagram',
    tiktok: 'badge-tiktok',
    telegram: 'badge-telegram',
    meta: 'badge-neutral',
  };
  return map[canal] || 'badge-neutral';
};

export const getStatusBadge = (status) => {
  const map = {
    entregue: { class: 'badge-lime', label: 'Entregue' },
    em_transito: { class: 'badge-teal', label: 'Em Trânsito' },
    redespacho: { class: 'badge-coral', label: 'Redespacho' },
    separacao: { class: 'badge-neutral', label: 'Separação' },
    ativo: { class: 'badge-lime', label: 'Ativo' },
    pausado: { class: 'badge-neutral', label: 'Pausado' },
    problemático: { class: 'badge-pink', label: 'Problema' },
    fechando: { class: 'badge-teal', label: 'Fechando' },
    resolvido: { class: 'badge-lime', label: 'Resolvido' },
  };
  return map[status] || { class: 'badge-neutral', label: status };
};
