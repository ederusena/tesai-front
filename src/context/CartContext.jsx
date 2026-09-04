'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext()
const CART_STORAGE_KEY = 'tesai_cart_items_v1'

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [notification, setNotification] = useState(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // 1. Carregar carrinho persistido no localStorage na inicialização
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(CART_STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) {
            setItems(parsed)
          }
        }
      }
    } catch (err) {
      console.warn('⚠️ Erro ao recuperar carrinho do localStorage:', err)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // 2. Salvar automaticamente qualquer alteração do carrinho no localStorage
  useEffect(() => {
    if (!isHydrated) return
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
      }
    } catch (err) {
      console.warn('⚠️ Erro ao persistir carrinho no localStorage:', err)
    }
  }, [items, isHydrated])

  const addItem = useCallback((item, qtyInput = 1, variantInput = null) => {
    setItems(prev => {
      const id = item.id || item.key
      const name = item.name || item.nome
      const price = item.price || item.precoBRL || 0
      const image = item.image || item.cover?.url || item.imagem
      const variant = item.variant || variantInput
      const quantity = item.quantity || qtyInput || 1
      const variantId = item.variantId

      const key = `${id}-${variantId || variant || 'default'}`
      const existing = prev.find(i => i.key === key)
      if (existing) {
        return prev.map(i =>
          i.key === key ? { 
            ...i, 
            quantity: i.quantity + quantity, 
            quantidade: i.quantidade + quantity 
          } : i
        )
      }
      return [...prev, {
        key,
        id,
        variantId,
        name,
        variant,
        price,
        image,
        quantity,
        quantidade: quantity,
        produto: item,
      }]
    })
    setNotification({ produto: item.name || item.nome, tipo: 'add' })
    setTimeout(() => setNotification(null), 2500)
  }, [])

  const removeItem = useCallback((keyOrId) => {
    setItems(prev => prev.filter(i => i.key !== keyOrId && i.id !== keyOrId))
  }, [])

  const updateQuantidade = useCallback((keyOrId, quantity) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.key !== keyOrId && i.id !== keyOrId))
      return
    }
    setItems(prev =>
      prev.map(i => (i.key === keyOrId || i.id === keyOrId) ? { 
        ...i, 
        quantity, 
        quantidade: quantity 
      } : i)
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    if (typeof window !== 'undefined') {
      localStorage.removeItem(CART_STORAGE_KEY)
    }
  }, [])

  const totalItens = items.reduce((sum, i) => sum + (i.quantity || 1), 0)
  const subtotal = items.reduce((sum, i) => sum + ((i.price || 0) * (i.quantity || 1)), 0)
  const frete = subtotal > 500 ? 0 : 0
  const total = subtotal + frete

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantidade,
      updateQuantity: updateQuantidade,
      clearCart,
      totalItens,
      totalItems: totalItens,
      subtotal,
      totalPrice: subtotal,
      frete,
      total,
      notification,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
