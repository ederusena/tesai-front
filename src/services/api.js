// ============================================
// SPARK VENDAS — API SERVICE LAYER
// Centraliza todas as chamadas ao backend
// ============================================

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '')}/api` : 'http://localhost:3001/api')

// --- Helper genérico para fetch com propagação de JWT ---
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`

  // Anexa o token de autenticação automaticamente se disponível no cliente
  let authToken = null
  if (typeof window !== 'undefined') {
    authToken = localStorage.getItem('tesai_auth_token')
  }

  const authHeader = authToken ? { Authorization: `Bearer ${authToken}` } : {}

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...authHeader,
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      throw new Error(errorBody.error || `HTTP ${response.status}`)
    }

    return await response.json()
  } catch (err) {
    console.error(`[API] Erro em ${endpoint}:`, err.message)
    throw err
  }
}

// =============================================
// E-COMMERCE (Público) — Store
// =============================================

/**
 * Busca o catálogo de produtos com filtros opcionais
 * @param {{ search?: string, category?: string, sort?: string, page?: number, limit?: number, featured?: boolean }} filters
 * @returns {Promise<{ products: Array, total: number, page: number, pages: number }>}
 */
export async function getStoreProducts(filters = {}) {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.category) params.set('category', filters.category)
  if (filters.brand) params.set('brand', filters.brand)
  if (filters.sort) params.set('sort', filters.sort)
  if (filters.page) params.set('page', String(filters.page))
  if (filters.limit) params.set('limit', String(filters.limit))
  if (filters.featured) params.set('featured', 'true')

  const query = params.toString()
  return apiFetch(`/store/products${query ? `?${query}` : ''}`)
}

/**
 * Busca um produto por slug com variantes, mídia e relacionados
 * @param {string} slug
 * @returns {Promise<Object>}
 */
export async function getStoreProductBySlug(slug) {
  return apiFetch(`/store/products/${slug}`)
}

/**
 * Lista categorias ativas com contagem de produtos
 * @returns {Promise<Array>}
 */
export async function getStoreCategories() {
  return apiFetch('/store/products/categories')
}

/**
 * Lista marcas / laboratórios ativos com contagem de produtos
 * @returns {Promise<Array>}
 */
export async function getStoreBrands() {
  return apiFetch('/store/products/brands')
}

// --- Carrinho ---

/**
 * Busca os itens do carrinho de um cliente
 * @param {string} customerId
 * @returns {Promise<Object>}
 */
export async function getCart(customerId) {
  return apiFetch(`/store/cart/${customerId}`)
}

/**
 * Adiciona item ao carrinho
 * @param {{ customerId: string, variantId: string, quantity?: number }} data
 * @returns {Promise<Object>}
 */
export async function addToCart(data) {
  return apiFetch('/store/cart', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Atualiza a quantidade de um item do carrinho
 * @param {string} itemId
 * @param {number} quantity
 * @returns {Promise<Object>}
 */
export async function updateCartItem(itemId, quantity) {
  return apiFetch(`/store/cart/${itemId}`, {
    method: 'PUT',
    body: JSON.stringify({ quantity }),
  })
}

/**
 * Remove um item do carrinho
 * @param {string} itemId
 * @returns {Promise<Object>}
 */
export async function removeFromCart(itemId) {
  return apiFetch(`/store/cart/${itemId}`, {
    method: 'DELETE',
  })
}

/**
 * Limpa todo o carrinho do cliente
 * @param {string} customerId
 * @returns {Promise<Object>}
 */
export async function clearCartAPI(customerId) {
  return apiFetch(`/store/cart/clear/${customerId}`, {
    method: 'DELETE',
  })
}

// --- Pedidos (Store) ---

/**
 * Cria um novo pedido com itens e gera Pix
 * @param {{ customerId: string, items: Array<{variantId: string, quantity: number}>, shippingBrl?: number, couponCode?: string, sourceChannel?: string }} data
 * @returns {Promise<{ order: Object, payment: Object }>}
 */
export async function createStoreOrder(data) {
  return apiFetch('/store/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Busca status de um pedido pelo número
 * @param {string} orderNumber
 * @returns {Promise<Object>}
 */
export async function getOrderStatus(orderNumber) {
  return apiFetch(`/store/orders/${orderNumber}/status`)
}

/**
 * Confirma pagamento de um pedido (mock Pix)
 * @param {string} orderNumber
 * @returns {Promise<Object>}
 */
export async function confirmOrderPayment(orderNumber) {
  return apiFetch(`/store/orders/${orderNumber}/confirm-payment`, {
    method: 'POST',
  })
}

/**
 * Lista pedidos de um cliente
 * @param {string} customerId
 * @returns {Promise<Array>}
 */
export async function getCustomerOrders(customerId) {
  return apiFetch(`/store/orders/customer/${customerId}`)
}

// =============================================
// DASHBOARD (Admin) — Analytics
// =============================================

/**
 * Busca resumo de receita por período
 * @param {string} period — '7d' | '30d' | 'today'
 * @returns {Promise<Object>}
 */
export async function getAdminRevenue(period = '7d') {
  return apiFetch(`/admin/analytics/revenue?period=${period}`)
}

/**
 * Busca ROAS por canal
 * @returns {Promise<Array>}
 */
export async function getAdminROAS() {
  return apiFetch('/admin/analytics/roas')
}

/**
 * Busca produtos mais vendidos
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getAdminTopProducts(limit = 10) {
  return apiFetch(`/admin/analytics/top-products?limit=${limit}`)
}

/**
 * Busca desempenho por canal
 * @returns {Promise<Array>}
 */
export async function getAdminChannels() {
  return apiFetch('/admin/analytics/channels')
}

/**
 * Busca métricas reais do Bot WhatsApp
 * @returns {Promise<Object>}
 */
export async function getAdminBotMetrics() {
  return apiFetch('/admin/analytics/bot-metrics')
}

// --- Admin Pedidos ---

/**
 * Lista pedidos com filtros opcionais
 * @param {{ status?: string, channel?: string, from?: string, to?: string }} filters
 * @returns {Promise<Array>}
 */
export async function getAdminOrders(filters = {}) {
  const params = new URLSearchParams()
  if (filters.status) params.set('status', filters.status)
  if (filters.channel) params.set('channel', filters.channel)
  if (filters.from) params.set('from', filters.from)
  if (filters.to) params.set('to', filters.to)

  const query = params.toString()
  return apiFetch(`/admin/orders${query ? `?${query}` : ''}`)
}

/**
 * Busca pedido por ID com todas as relações
 * @param {string} orderId
 * @returns {Promise<Object>}
 */
export async function getAdminOrderById(orderId) {
  return apiFetch(`/admin/orders/${orderId}`)
}

/**
 * Atualiza status de um pedido
 * @param {string} orderId
 * @param {string} status
 * @returns {Promise<Object>}
 */
export async function updateOrderStatus(orderId, status) {
  return apiFetch(`/admin/orders/${orderId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  })
}

/**
 * Adiciona código de rastreio a um pedido
 * @param {string} orderId
 * @param {{ trackingCode: string, carrier?: string }} data
 * @returns {Promise<Object>}
 */
export async function addOrderTracking(orderId, data) {
  return apiFetch(`/admin/orders/${orderId}/tracking`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/**
 * Notifica cliente sobre pedido
 * @param {string} orderId
 * @param {{ message: string, channel: string }} data
 * @returns {Promise<Object>}
 */
export async function notifyCustomer(orderId, data) {
  return apiFetch(`/admin/orders/${orderId}/notify`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// --- Admin Produtos ---

/**
 * Lista todos os produtos (admin)
 * @param {{ search?: string, category?: string, active?: string, featured?: string }} filters
 * @returns {Promise<Array>}
 */
export async function getAdminProducts(filters = {}) {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.category) params.set('category', filters.category)
  if (filters.active) params.set('active', filters.active)
  if (filters.featured) params.set('featured', filters.featured)

  const query = params.toString()
  return apiFetch(`/admin/products${query ? `?${query}` : ''}`)
}

/**
 * Cria um novo produto
 * @param {Object} productData
 * @returns {Promise<Object>}
 */
export async function createAdminProduct(productData) {
  return apiFetch('/admin/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  })
}

/**
 * Atualiza um produto existente
 * @param {string} productId
 * @param {Object} productData
 * @returns {Promise<Object>}
 */
export async function updateAdminProduct(productId, productData) {
  return apiFetch(`/admin/products/${productId}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  })
}

/**
 * Desativa um produto (soft delete)
 * @param {string} productId
 * @returns {Promise<Object>}
 */
export async function deleteAdminProduct(productId) {
  return apiFetch(`/admin/products/${productId}`, {
    method: 'DELETE',
  })
}

/**
 * Busca todos os registros de estoque das variantes dos produtos
 * @returns {Promise<Array>}
 */
export async function getAdminInventory() {
  const products = await getAdminProducts()
  const inventoryList = []
  products.forEach(product => {
    if (product.variants) {
      product.variants.forEach(v => {
        inventoryList.push({
          id: v.id,
          variantId: v.id,
          sku: v.sku,
          priceBrl: v.priceBrl,
          quantity: v.inventory?.quantity ?? 0,
          reserved: v.inventory?.reserved ?? 0,
          minStockAlert: v.inventory?.minStockAlert ?? 0
        })
      })
    }
  })
  return inventoryList
}

/**
 * Atualiza estoque de uma variante
 * @param {string} variantId
 * @param {{ quantity?: number, minStockAlert?: number }} data
 * @returns {Promise<Object>}
 */
export async function updateAdminInventory(variantId, data) {
  return apiFetch(`/admin/products/inventory/${variantId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// --- Câmbio ---

/**
 * Busca taxas de câmbio
 * @returns {Promise<Array>}
 */
export async function getCurrencyRates() {
  return apiFetch('/currency-rates')
}

/**
 * Atualiza uma taxa de câmbio
 * @param {{ fromCurrency: string, toCurrency: string, rate: number }} data
 * @returns {Promise<Object>}
 */
export async function updateCurrencyRates(data) {
  return apiFetch('/admin/currency-rates', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

// =============================================
// ADMIN — Categorias
// =============================================

export async function getAdminCategories() {
  return apiFetch('/admin/categories')
}

export async function createAdminCategory(data) {
  return apiFetch('/admin/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateAdminCategory(id, data) {
  return apiFetch(`/admin/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteAdminCategory(id) {
  return apiFetch(`/admin/categories/${id}`, {
    method: 'DELETE',
  })
}

// =============================================
// ADMIN — Banners (CMS)
// =============================================

export async function getAdminBanners() {
  return apiFetch('/admin/banners')
}

export async function createAdminBanner(data) {
  return apiFetch('/admin/banners', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateAdminBanner(id, data) {
  return apiFetch(`/admin/banners/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function toggleAdminBanner(id) {
  return apiFetch(`/admin/banners/${id}/toggle`, {
    method: 'PUT',
  })
}

export async function deleteAdminBanner(id) {
  return apiFetch(`/admin/banners/${id}`, {
    method: 'DELETE',
  })
}

// =============================================
// STORE — Banners (Público)
// =============================================

export async function getStoreBanners() {
  return apiFetch('/store/banners')
}

// --- Health ---

/**
 * Verifica status da API
 * @returns {Promise<Object>}
 */
export async function checkHealth() {
  return apiFetch('/health')
}

