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
    default: 'Tesãi Farmácias — Medicamentos & Injetáveis Especializados',
    template: '%s | Tesãi Farmácias'
  },
  description: 'Tesãi Farmácias — Linha especializada em Tirzepatida (Tirzec, TG, Lipoless), Semaglutida e injetáveis com procedência de Ciudad del Este e entrega segura em todo o Brasil.',
  metadataBase: new URL('http://localhost:3000'),
  icons: {
    icon: '/favicon.svg',
  },
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
