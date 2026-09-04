import { Inter, Outfit } from 'next/font/google'
import '../src/index.css'
import Providers from './providers'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'Spark Vendas — Central de Comando Cross-Border',
    template: '%s | Spark Vendas'
  },
  description: 'Spark Vendas Cross-Border — Plataforma omnichannel para vendas do Paraguai ao Brasil. Centralize anúncios, automatize WhatsApp e escale seu faturamento.',
  metadataBase: new URL('http://localhost:3000'),
  robots: {
    index: true,
    follow: true,
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable}`} suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
