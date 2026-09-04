import { createContext, useContext, useState, useCallback } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState([])
  const [notification, setNotification] = useState(null)

  const addItem = useCallback((item, qtyInput = 1, variantInput = null) => {
    setItems(prev => {
      // Support both (productObj, qty, variant) and ({ id, name, price, quantity... })
      const id = item.id || item.key;
      const name = item.name || item.nome;
      const price = item.price || item.precoBRL || 0;
      const image = item.image || item.cover?.url;
      const variant = item.variant || variantInput;
      const quantity = item.quantity || qtyInput;
      const variantId = item.variantId;

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
        // Portuguese / legacy fallbacks
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
  }, [])

  const totalItens = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + (i.price * i.quantity), 0)
  const frete = subtotal > 500 ? 0 : 45
  const total = subtotal + frete

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantidade,
      updateQuantity: updateQuantidade, // Mapping English name
      clearCart,
      totalItens,
      totalItems: totalItens, // Mapping English name
      subtotal,
      totalPrice: subtotal, // Mapping English name
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

