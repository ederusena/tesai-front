'use client'

import { CartProvider } from '../src/context/CartContext'
import { AuthProvider } from '../src/context/AuthContext'

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </AuthProvider>
  )
}
