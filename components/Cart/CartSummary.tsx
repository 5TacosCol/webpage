'use client'

import { useCart } from './CartProvider'
import { formatCOP } from '@/lib/format'
import { useRouter } from 'next/navigation'

export default function CartSummary() {
  const { total, items } = useCart()
  const router = useRouter()

  if (items.length === 0) return null

  return (
    <div className="p-4 border-t border-white/10">
      <div className="flex justify-between mb-4">
        <span className="text-white/70 font-body">Subtotal</span>
        <span className="text-dorado font-bold text-xl">{formatCOP(total)}</span>
      </div>
      <button
        onClick={() => router.push('/checkout')}
        className="w-full bg-dorado text-verde-oscuro font-display text-xl py-3 rounded-lg hover:brightness-110 transition-all"
      >
        IR AL PAGO →
      </button>
    </div>
  )
}
