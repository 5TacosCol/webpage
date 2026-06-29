'use client'

import { useState } from 'react'
import { Product, Protein, SalsaSelection } from '@/types'
import { SALSAS, heatChiles } from '@/lib/salsas'

interface Props {
  product: Product
  proteins: Protein[]
  salsaCount: number
  onConfirm: (selected: string[], salsas: SalsaSelection[], picoDeGallo: boolean) => void
  onClose: () => void
}

export default function ProteinSelector({ product, proteins, salsaCount, onConfirm, onClose }: Props) {
  const [selected, setSelected] = useState<string[]>([])
  const [picoDeGallo, setPicoDeGallo] = useState(true)
  const [salsas, setSalsas] = useState<{ name: string; quantity: number }[]>(
    SALSAS.map((s) => ({ name: s.name, quantity: 0 }))
  )

  const totalSalsas = salsas.reduce((sum, s) => sum + s.quantity, 0)
  const salsasOk = salsaCount === 0 || totalSalsas === salsaCount

  function toggle(name: string) {
    setSelected((prev) => {
      if (prev.includes(name)) return prev.filter((p) => p !== name)
      if (prev.length >= product.max_proteins) return [...prev.slice(1), name]
      return [...prev, name]
    })
  }

  function adjustSalsa(name: string, delta: number) {
    setSalsas((prev) =>
      prev.map((s) => {
        if (s.name !== name) return s
        const next = s.quantity + delta
        if (next < 0) return s
        if (delta > 0 && totalSalsas >= salsaCount) return s
        return { ...s, quantity: next }
      })
    )
  }

  const canConfirm = selected.length > 0 && salsasOk

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#0D1F16] rounded-2xl max-w-sm w-full p-6 border border-dorado/30 my-4">
        <h3 className="font-display text-dorado text-2xl mb-1">ELIGE TUS PROTEÍNAS</h3>
        <p className="text-white/50 text-sm mb-1 font-body">
          Seleccioná {product.max_proteins === 1 ? 'una proteína' : `hasta ${product.max_proteins} proteínas`} para tu {product.name}
        </p>
        <div className="mb-4">
          <button
            onClick={() => setPicoDeGallo((v) => !v)}
            className={`px-4 py-1.5 rounded-full text-xs font-body border transition-all ${
              picoDeGallo
                ? 'bg-red-600 border-red-600 text-white'
                : 'bg-transparent border-white/20 text-white/30 line-through'
            }`}
          >
            🥗 Pico de gallo
          </button>
        </div>

        <div className="space-y-2 mb-5">
          {proteins.map((p) => (
            <button
              key={p.id}
              onClick={() => toggle(p.name)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-colors font-body ${
                selected.includes(p.name)
                  ? 'border-dorado bg-dorado/20 text-white'
                  : 'border-white/20 text-white/70 hover:border-dorado/50'
              }`}
            >
              {p.name}
              {p.extra_cost > 0 && (
                <span className="text-dorado text-xs ml-2">+${p.extra_cost.toLocaleString('es-CO')}</span>
              )}
            </button>
          ))}
        </div>

        {salsaCount > 0 && (
          <div className="border-t border-white/10 pt-4 mb-5">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display text-white text-sm">SALSAS — elige {salsaCount}</h4>
              <span className={`text-sm font-bold ${salsasOk ? 'text-dorado' : 'text-white/40'}`}>
                {totalSalsas}/{salsaCount}
              </span>
            </div>
            <div className="space-y-2">
              {SALSAS.map((salsa, i) => {
                const qty = salsas[i].quantity
                return (
                  <div key={salsa.name} className="flex items-center justify-between bg-[#1B4332]/50 rounded-xl px-3 py-2">
                    <div className="flex-1 min-w-0 mr-2">
                      <span className="text-white text-xs font-body">{salsa.name}</span>
                      <span className="ml-1 text-xs">{heatChiles(salsa.heat)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => adjustSalsa(salsa.name, -1)} disabled={qty === 0}
                        className="w-6 h-6 rounded-full border border-dorado/50 text-dorado flex items-center justify-center disabled:opacity-30 text-base leading-none">−</button>
                      <span className="text-white w-4 text-center text-xs font-semibold">{qty}</span>
                      <button onClick={() => adjustSalsa(salsa.name, 1)} disabled={totalSalsas >= salsaCount}
                        className="w-6 h-6 rounded-full border border-dorado/50 text-dorado flex items-center justify-center disabled:opacity-30 text-base leading-none">+</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 border border-white/30 text-white/70 py-3 rounded-lg font-body hover:border-white/60 transition-colors">
            Cancelar
          </button>
          <button
            onClick={() => {
              if (!canConfirm) return
              onConfirm(selected, salsas.filter((s) => s.quantity > 0), picoDeGallo)
            }}
            disabled={!canConfirm}
            className="flex-1 bg-fucsia text-white py-3 rounded-lg font-display text-lg disabled:opacity-40 hover:brightness-110 transition-all"
          >
            AGREGAR
          </button>
        </div>
      </div>
    </div>
  )
}
