import type { Metadata } from 'next'
import { Bebas_Neue, Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/components/Cart/CartProvider'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://5tacos.co'),
  title: {
    default: '5 Tacos | Taquería Mexicana en Pereira – Pide Online',
    template: '%s | 5 Tacos Pereira',
  },
  description:
    'Tacos de birria, cochinita pibil, tinga de pollo, quesadillas y más. Pide a domicilio o para recoger en la Circunvalar de Pereira. Cervezas, micheladas y cantaritos. Martes a domingo desde las 5pm.',
  keywords: [
    'tacos Pereira',
    'birria Pereira',
    'taquería Pereira',
    'restaurante mexicano Pereira',
    'cochinita pibil Pereira',
    'tacos a domicilio Pereira',
    'quesadillas Pereira',
    'taquería Circunvalar Pereira',
  ],
  openGraph: {
    title: '5 Tacos | Taquería Mexicana en Pereira',
    description: 'Pide tus tacos online. Birria, cochinita pibil, tinga y más. Cero fricción.',
    url: 'https://5tacos.co',
    siteName: '5 Tacos Taquería',
    locale: 'es_CO',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '5 Tacos | Taquería Mexicana en Pereira',
    description: 'Tacos de birria, cochinita pibil, tinga y más. Pedí online en 5tacos.co',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://5tacos.co' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
