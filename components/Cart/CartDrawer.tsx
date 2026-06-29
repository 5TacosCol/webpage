'use client'

import { useCart } from './CartProvider'
import CartItem from './CartItem'
import CartSummary from './CartSummary'

interface Props {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: Props) {
  const { items } = useCart()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-verde-fondo z-50 flex flex-col shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}
        aria-label="Carrito de pedidos"
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="font-display text-dorado text-2xl">TU PEDIDO</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar carrito"
            className="text-white/60 hover:text-white text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-6xl mb-4">🌮</span>
              <p className="text-white/60 font-body">Tu pedido está vacío</p>
            </div>
          ) : (
            items.map((item) => (
              <CartItem key={`${item.product.id}-${(item.proteins || []).join(',')}-${item.costra}`} item={item} />
            ))
          )}
        </div>

        <CartSummary />
      </aside>
    </>
  )
}
