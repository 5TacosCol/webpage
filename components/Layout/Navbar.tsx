'use client'

import { useState } from 'react'
import CartDrawer from '@/components/Cart/CartDrawer'
import { useCart } from '@/components/Cart/CartProvider'

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false)
  const { count, total } = useCart()

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-30 bg-verde-fondo/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <img src="/logo.jpg" alt="5 Tacos logo" width={40} height={40} className="rounded-lg" />
            <span className="font-display text-dorado text-2xl tracking-wide">5 TACOS</span>
          </a>

          {/* Nav links — solo desktop */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#menu" className="text-white/80 hover:text-dorado transition-colors font-body">Menú</a>
            <a href="#nosotros" className="text-white/80 hover:text-dorado transition-colors font-body">Nosotros</a>
            <a href="#horarios" className="text-white/80 hover:text-dorado transition-colors font-body">Horarios</a>
          </div>

          {/* Carrito */}
          <button
            onClick={() => setCartOpen(true)}
            aria-label={`Abrir carrito, ${count} items`}
            className="flex items-center gap-2 bg-verde-oscuro border border-dorado/40 rounded-full px-4 py-2 hover:border-dorado transition-colors"
          >
            <span className="text-xl">🌮</span>
            {count > 0 && (
              <span className="bg-fucsia text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {count}
              </span>
            )}
            <span className="text-dorado font-display text-lg hidden sm:inline">PEDIR</span>
          </button>
        </div>
      </nav>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
