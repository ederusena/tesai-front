'use client'

import React, { useState, useEffect } from 'react'
import {
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
  getAdminBanners,
  createAdminBanner,
  updateAdminBanner,
  toggleAdminBanner,
  deleteAdminBanner,
  getAdminInventory,
  updateAdminInventory,
} from '../../../src/services/api'
import '../../../src/styles/EcommerceAdmin.css'

const EcommerceAdmin = () => {
  const TABS = ['Produtos', 'Categorias', 'Banners', 'Estoque']
  const [activeTab, setActiveTab] = useState(TABS[0])

  // ---------- Produtos ----------
  const [products, setProducts] = useState([])
  const [productModal, setProductModal] = useState({ open: false, data: null })
  const fetchProducts = async () => {
    try {
      const data = await getAdminProducts()
      setProducts(data)
    } catch (e) {
      console.error('Erro ao buscar produtos', e)
    }
  }

  // ---------- Categorias ----------
  const [categories, setCategories] = useState([])
  const [categoryModal, setCategoryModal] = useState({ open: false, data: null })
  const fetchCategories = async () => {
    try {
      const data = await getAdminCategories()
      setCategories(data)
    } catch (e) {
      console.error('Erro ao buscar categorias', e)
    }
  }

  // ---------- Banners ----------
  const [banners, setBanners] = useState([])
  const [bannerModal, setBannerModal] = useState({ open: false, data: null })
  const fetchBanners = async () => {
    try {
      const data = await getAdminBanners()
      setBanners(data)
    } catch (e) {
      console.error('Erro ao buscar banners', e)
    }
  }

  // ---------- Estoque (variantes) ----------
  const [inventory, setInventory] = useState([])
  const fetchInventory = async () => {
    try {
      const data = await getAdminInventory()
      setInventory(data || [])
    } catch (e) {
      console.error('Erro ao buscar estoque', e)
    }
  }

  // Carrega dados ao mudar de aba
  useEffect(() => {
    switch (activeTab) {
      case 'Produtos':
        fetchProducts()
        break
      case 'Categorias':
        fetchCategories()
        break
      case 'Banners':
        fetchBanners()
        break
      case 'Estoque':
        fetchInventory()
        break
      default:
        break
    }
  }, [activeTab])

  // ---------- Handlers de CRUD ----------
  const handleSaveProduct = async (product) => {
    try {
      if (product.id) {
        await updateAdminProduct(product.id, product)
      } else {
        await createAdminProduct(product)
      }
      await fetchProducts()
    } catch (e) {
      console.error('Erro ao salvar produto', e)
    } finally {
      setProductModal({ open: false, data: null })
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Excluir este produto?')) return
    try {
      await deleteAdminProduct(id)
      await fetchProducts()
    } catch (e) {
      console.error('Erro ao excluir produto', e)
    }
  }

  const handleSaveCategory = async (cat) => {
    try {
      if (cat.id) {
        await updateAdminCategory(cat.id, cat)
      } else {
        await createAdminCategory(cat)
      }
      await fetchCategories()
    } catch (e) {
      console.error('Erro ao salvar categoria', e)
    } finally {
      setCategoryModal({ open: false, data: null })
    }
  }

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Excluir esta categoria?')) return
    try {
      await deleteAdminCategory(id)
      await fetchCategories()
    } catch (e) {
      console.error('Erro ao excluir categoria', e)
    }
  }

  const handleSaveBanner = async (banner) => {
    try {
      if (banner.id) {
        await updateAdminBanner(banner.id, banner)
      } else {
        await createAdminBanner(banner)
      }
      await fetchBanners()
    } catch (e) {
      console.error('Erro ao salvar banner', e)
    } finally {
      setBannerModal({ open: false, data: null })
    }
  }

  const handleToggleBanner = async (id) => {
    try {
      await toggleAdminBanner(id)
      await fetchBanners()
    } catch (e) {
      console.error('Erro ao ativar/desativar banner', e)
    }
  }

  const handleDeleteBanner = async (id) => {
    if (!window.confirm('Excluir este banner?')) return
    try {
      await deleteAdminBanner(id)
      await fetchBanners()
    } catch (e) {
      console.error('Erro ao excluir banner', e)
    }
  }

  // ---------- UI Helpers ----------
  const renderTable = (cols, rows, actions) => (
    <table className="admin-table">
      <thead>
        <tr>
          {cols.map((c) => (
            <th key={c}>{c}</th>
          ))}
          {actions && <th>Ações</th>}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {cols.map((c) => (
              <td key={c}>{row[c] ?? ''}</td>
            ))}
            {actions && (
              <td className="action-cell">
                {actions.map((a) => (
                  <button
                    key={typeof a.label === 'function' ? a.label(row) : a.label}
                    className={`action-btn ${a.type}`}
                    onClick={() => a.handler(row)}
                  >
                    {a.label === 'function' ? a.label(row) : a.label}
                  </button>
                ))}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )

  // ---------- Modal Components ----------
  const Modal = ({ open, title, children, onClose }) => {
    if (!open) return null
    return (
      <div className="modal-backdrop" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>{title}</h2>
          {children}
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
      </div>
    )
  }

  // ---------- Renderers por aba ----------
  const renderProductsTab = () => (
    <div className="tab-section">
      <div className="tab-header" style={{ marginBottom: 16 }}>
        <button className="primary-btn" onClick={() => setProductModal({ open: true, data: null })}>+ Novo Produto</button>
      </div>
      {renderTable(
        ['name', 'slug', 'priceBrl', 'isActive', 'isFeatured', 'categoryId'],
        products,
        [
          { label: 'Editar', type: 'edit', handler: (r) => setProductModal({ open: true, data: r }) },
          { label: 'Excluir', type: 'delete', handler: (r) => handleDeleteProduct(r.id) },
        ]
      )}
      <Modal
        open={productModal.open}
        title={productModal.data ? 'Editar Produto' : 'Novo Produto'}
        onClose={() => setProductModal({ open: false, data: null })}
      >
        <ProductForm data={productModal.data} onSave={handleSaveProduct} onCancel={() => setProductModal({ open: false, data: null })} />
      </Modal>
    </div>
  )

  const renderCategoriesTab = () => (
    <div className="tab-section">
      <div className="tab-header" style={{ marginBottom: 16 }}>
        <button className="primary-btn" onClick={() => setCategoryModal({ open: true, data: null })}>+ Nova Categoria</button>
      </div>
      {renderTable(
        ['name', 'slug', 'iconEmoji', 'sortOrder', 'isActive'],
        categories,
        [
          { label: 'Editar', type: 'edit', handler: (r) => setCategoryModal({ open: true, data: r }) },
          { label: 'Excluir', type: 'delete', handler: (r) => handleDeleteCategory(r.id) },
        ]
      )}
      <Modal
        open={categoryModal.open}
        title={categoryModal.data ? 'Editar Categoria' : 'Nova Categoria'}
        onClose={() => setCategoryModal({ open: false, data: null })}
      >
        <CategoryForm data={categoryModal.data} onSave={handleSaveCategory} onCancel={() => setCategoryModal({ open: false, data: null })} />
      </Modal>
    </div>
  )

  const renderBannersTab = () => (
    <div className="tab-section">
      <div className="tab-header" style={{ marginBottom: 16 }}>
        <button className="primary-btn" onClick={() => setBannerModal({ open: true, data: null })}>+ Novo Banner</button>
      </div>
      {renderTable(
        ['title', 'subtitle', 'position', 'isActive', 'sortOrder'],
        banners,
        [
          { label: 'Editar', type: 'edit', handler: (r) => setBannerModal({ open: true, data: r }) },
          { label: r => r.isActive ? 'Desativar' : 'Ativar', type: 'toggle', handler: (r) => handleToggleBanner(r.id) },
          { label: 'Excluir', type: 'delete', handler: (r) => handleDeleteBanner(r.id) },
        ]
      )}
      <Modal
        open={bannerModal.open}
        title={bannerModal.data ? 'Editar Banner' : 'Novo Banner'}
        onClose={() => setBannerModal({ open: false, data: null })}
      >
        <BannerForm data={bannerModal.data} onSave={handleSaveBanner} onCancel={() => setBannerModal({ open: false, data: null })} />
      </Modal>
    </div>
  )

  const renderInventoryTab = () => (
    <div className="tab-section">
      <h3>Visão geral de Estoque</h3>
      {inventory.length === 0 ? (
        <p style={{ marginTop: 12 }}>Sem dados de estoque ainda. Use a aba Produtos para definir variantes.</p>
      ) : (
        renderTable(
          ['sku', 'priceBrl', 'quantity', 'reserved', 'minStockAlert'],
          inventory,
          [
            {
              label: 'Atualizar',
              type: 'edit',
              handler: (r) => {
                const qty = prompt('Nova quantidade', r.quantity)
                if (qty !== null) updateAdminInventory(r.variantId, { quantity: Number(qty) }).then(fetchInventory)
              },
            },
          ]
        )
      )}
    </div>
  )

  return (
    <div className="ecommerce-admin">
      <h1 className="admin-title">⚙️ Painel Gerencial da Loja</h1>
      <nav className="admin-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`tab-btn ${activeTab === t ? 'active' : ''}`}
            onClick={() => setActiveTab(t)}
          >
            {t}
          </button>
        ))}
      </nav>
      <section className="admin-content">
        {activeTab === 'Produtos' && renderProductsTab()}
        {activeTab === 'Categorias' && renderCategoriesTab()}
        {activeTab === 'Banners' && renderBannersTab()}
        {activeTab === 'Estoque' && renderInventoryTab()}
      </section>
    </div>
  )
}

const ProductForm = ({ data, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: data?.name || '',
    slug: data?.slug || '',
    priceBrl: data?.priceBrl || 0,
    isActive: data?.isActive ?? true,
    isFeatured: data?.isFeatured ?? false,
    categoryId: data?.categoryId || '',
    descriptionShort: data?.descriptionShort || '',
    descriptionFull: data?.descriptionFull || '',
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = { ...form }
    if (data?.id) payload.id = data.id
    onSave(payload)
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <label>
        Nome
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        Slug
        <input name="slug" value={form.slug} onChange={handleChange} required />
      </label>
      <label>
        Preço (BRL)
        <input type="number" name="priceBrl" value={form.priceBrl} onChange={handleChange} step="0.01" required />
      </label>
      <label className="checkbox-label">
        <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
        Ativo
      </label>
      <label className="checkbox-label">
        <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} />
        Destaque
      </label>
      <label>
        Categoria ID
        <input name="categoryId" value={form.categoryId} onChange={handleChange} required />
      </label>
      <label>
        Descrição curta
        <textarea name="descriptionShort" value={form.descriptionShort} onChange={handleChange} rows={2} />
      </label>
      <label>
        Descrição completa
        <textarea name="descriptionFull" value={form.descriptionFull} onChange={handleChange} rows={4} />
      </label>
      <div className="form-actions">
        <button type="submit" className="primary-btn">Salvar</button>
        <button type="button" className="secondary-btn" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  )
}

const CategoryForm = ({ data, onSave, onCancel }) => {
  const [form, setForm] = useState({
    name: data?.name || '',
    slug: data?.slug || '',
    iconEmoji: data?.iconEmoji || '',
    sortOrder: data?.sortOrder ?? 0,
    isActive: data?.isActive ?? true,
    parentId: data?.parentId || '',
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = { ...form }
    if (data?.id) payload.id = data.id
    onSave(payload)
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <label>
        Nome
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        Slug
        <input name="slug" value={form.slug} onChange={handleChange} required />
      </label>
      <label>
        Ícone (emoji)
        <input name="iconEmoji" value={form.iconEmoji} onChange={handleChange} />
      </label>
      <label>
        Ordem
        <input type="number" name="sortOrder" value={form.sortOrder} onChange={handleChange} />
      </label>
      <label className="checkbox-label">
        <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
        Ativa
      </label>
      <label>
        Pai (ID)
        <input name="parentId" value={form.parentId} onChange={handleChange} />
      </label>
      <div className="form-actions">
        <button type="submit" className="primary-btn">Salvar</button>
        <button type="button" className="secondary-btn" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  )
}

const BannerForm = ({ data, onSave, onCancel }) => {
  const [form, setForm] = useState({
    title: data?.title || '',
    subtitle: data?.subtitle || '',
    imageUrl: data?.imageUrl || '',
    linkUrl: data?.linkUrl || '',
    linkText: data?.linkText || '',
    position: data?.position || 'hero',
    sortOrder: data?.sortOrder ?? 0,
    isActive: data?.isActive ?? true,
    bgColor: data?.bgColor || '',
    textColor: data?.textColor || '',
    startDate: data?.startDate?.slice(0, 10) || '',
    endDate: data?.endDate?.slice(0, 10) || '',
  })

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = { ...form }
    if (data?.id) payload.id = data.id
    onSave(payload)
  }

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <label>
        Título
        <input name="title" value={form.title} onChange={handleChange} required />
      </label>
      <label>
        Subtítulo
        <input name="subtitle" value={form.subtitle} onChange={handleChange} />
      </label>
      <label>
        URL da Imagem
        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
      </label>
      <label>
        Link URL
        <input name="linkUrl" value={form.linkUrl} onChange={handleChange} />
      </label>
      <label>
        Texto do Link
        <input name="linkText" value={form.linkText} onChange={handleChange} />
      </label>
      <label>
        Posição
        <select name="position" value={form.position} onChange={handleChange}>
          <option value="hero">Hero</option>
          <option value="promo">Promo</option>
          <option value="category">Categoria</option>
        </select>
      </label>
      <label>
        Ordem
        <input type="number" name="sortOrder" value={form.sortOrder} onChange={handleChange} />
      </label>
      <label className="checkbox-label">
        <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
        Ativo
      </label>
      <label>
        Cor de Fundo
        <input type="color" name="bgColor" value={form.bgColor} onChange={handleChange} />
      </label>
      <label>
        Cor do Texto
        <input type="color" name="textColor" value={form.textColor} onChange={handleChange} />
      </label>
      <label>
        Data início
        <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
      </label>
      <label>
        Data fim
        <input type="date" name="endDate" value={form.endDate} onChange={handleChange} />
      </label>
      <div className="form-actions">
        <button type="submit" className="primary-btn">Salvar</button>
        <button type="button" className="secondary-btn" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  )
}

export default EcommerceAdmin
