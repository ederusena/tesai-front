'use client'

import { CartProvider } from '../src/context/CartContext'

export default function Providers({ children }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  )
}
