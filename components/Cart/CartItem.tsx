'use client'

import { CartItem as CartItemType } from '@/types'
import { useCart } from './CartProvider'
import { formatCOP } from '@/lib/format'

interface Props {
  item: CartItemType
}

export default function CartItem({ item }: Props) {
  const { increment, decrement, getKey } = useCart()
  const key = getKey(item)

  const mods: string[] = []

  if (item.combo_tacos) {
    // Detalle de combo se muestra línea por línea abajo
  } else if (item.proteins?.length) {
    mods.push(item.proteins.join(' + '))
    if (item.proteins_cebolla === false) mods.push('sin cebolla')
    if (item.proteins_cilantro === false) mods.push('sin cilantro')
  } else {
    if (item.costra) mods.push('con costra de queso')
    if (item.cebolla === false) mods.push('sin cebolla')
    if (item.cilantro === false) mods.push('sin cilantro')
  }

  // Format salsas summary
  const salsasSummary = item.salsas && item.salsas.length > 0
    ? '🫙 ' + item.salsas.map((s) => `${s.name} ×${s.quantity}`).join(', ')
    : null

  return (
    <div className="flex items-start justify-between gap-3 py-3 border-b border-white/10">
      <div className="flex-1 min-w-0">
        <p className="font-display text-white text-lg leading-tight">
          {item.product.name}
        </p>

        {mods.length > 0 && (
          <p className="text-xs text-white/60 mt-0.5">{mods.join(', ')}</p>
        )}

        {item.combo_tacos && (
          <ul className="mt-1 space-y-0.5">
            {item.combo_tacos.map((taco, i) => (
              <li key={i} className="text-xs text-white/55 leading-snug">
                • Taco {i + 1}: {taco.protein}
                {taco.costra && ' 🧀'}
                {!taco.cebolla && ', sin cebolla'}
                {!taco.cilantro && ', sin cilantro'}
              </li>
            ))}
          </ul>
        )}

        {salsasSummary && (
          <p className="text-xs text-white/50 mt-1">{salsasSummary}</p>
        )}

        {item.notes && (
          <p className="text-xs text-white/40 mt-0.5 italic">📝 {item.notes}</p>
        )}

        <p className="text-dorado font-semibold mt-1">
          {formatCOP(item.unit_price)}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => decrement(key)}
          aria-label="Reducir cantidad"
          className="w-7 h-7 rounded-full border border-dorado text-dorado flex items-center justify-center hover:bg-dorado hover:text-verde-oscuro transition-colors"
        >
          −
        </button>
        <span className="text-white w-5 text-center font-semibold">
          {item.quantity}
        </span>
        <button
          onClick={() => increment(key)}
          aria-label="Aumentar cantidad"
          className="w-7 h-7 rounded-full border border-dorado text-dorado flex items-center justify-center hover:bg-dorado hover:text-verde-oscuro transition-colors"
        >
          +
        </button>
      </div>
      <p className="text-white font-semibold shrink-0">
        {formatCOP(item.unit_price * item.quantity)}
      </p>
    </div>
  )
}
