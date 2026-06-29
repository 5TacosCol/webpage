'use client'

import { useState } from 'react'
import { Product, Protein, ComboTaco, SalsaSelection } from '@/types'
import { useCart } from '@/components/Cart/CartProvider'
import { formatCOP } from '@/lib/format'
import ProteinSelector from './ProteinSelector'
import CostraToggle from './CostraToggle'
import ComboBuilder, { getComboConfig } from './ComboBuilder'

interface Props {
  product: Product
  proteins: Protein[]
}

export default function ProductCard({ product, proteins }: Props) {
  const { addItem } = useCart()
  const [showProteinModal, setShowProteinModal] = useState(false)
  const [showComboBuilder, setShowComboBuilder] = useState(false)
  const [costra, setCostra] = useState(false)
  const [cebolla, setCebolla] = useState(true)
  const [cilantro, setCilantro] = useState(true)

  // Detectar combos: tacombos Y quesadilla-combos (Combo 2Q, QT, QN, 2QT)
  const isQuesadillaCombo = product.category === 'quesadillas' && product.name.startsWith('Combo')
  const isCombo = product.category === 'tacombos' || isQuesadillaCombo
  const comboConfig = isCombo ? getComboConfig(product.name) : null
  const isTaco = product.category === 'tacos'

  function handleAdd() {
    if (isCombo && comboConfig) { setShowComboBuilder(true); return }
    if (product.has_protein_choice) { setShowProteinModal(true); return }
    // Quesabirrias, Totopos combos, bebidas, adiciones — precio fijo directo
    if (isCombo && !comboConfig) {
      addItem({ product, quantity: 1, unit_price: product.price })
      return
    }
    // Tacos individuales
    const extra = product.has_costra_option && costra ? 1600 : 0
    addItem({
      product, quantity: 1,
      costra: product.has_costra_option ? costra : undefined,
      cebolla, cilantro,
      unit_price: product.price + extra,
    })
  }

  function handleProteinConfirm(selectedProteins: string[], salsas: SalsaSelection[], picoDeGallo: boolean) {
    addItem({
      product, quantity: 1,
      proteins: selectedProteins,
      pico_de_gallo: picoDeGallo,
      salsas: salsas.length > 0 ? salsas : undefined,
      unit_price: product.price,
    })
    setShowProteinModal(false)
  }

  function handleComboConfirm(
    combo_tacos: ComboTaco[],
    nachos_proteins: string[] | undefined,
    quesadilla_proteins: string[][] | undefined,
    salsas: SalsaSelection[],
    notes: string,
    unit_price: number
  ) {
    addItem({
      product, quantity: 1,
      combo_tacos: combo_tacos.length > 0 ? combo_tacos : undefined,
      nachos_proteins,
      quesadilla_proteins,
      salsas: salsas.length > 0 ? salsas : undefined,
      notes: notes.trim() || undefined,
      unit_price,
    })
    setShowComboBuilder(false)
  }

  const displayPrice = product.price + (product.has_costra_option && costra ? 1600 : 0)

  return (
    <>
      <div className="bg-verde-oscuro border border-dorado/20 rounded-xl p-4 flex flex-col h-full hover:border-dorado/50 transition-colors">
        <div className="flex-1">
          <div className="flex flex-wrap gap-1.5 mb-2">
            {product.has_protein_choice && (
              <span className="text-xs bg-dorado/20 text-dorado border border-dorado/40 px-2 py-0.5 rounded-full">Elige proteínas</span>
            )}
            {product.has_costra_option && (
              <span className="text-xs bg-verde-fondo text-white/70 border border-white/20 px-2 py-0.5 rounded-full">Costra opcional</span>
            )}
            {isCombo && comboConfig && comboConfig.tacoCount > 0 && (
              <span className="text-xs bg-fucsia/20 text-fucsia border border-fucsia/40 px-2 py-0.5 rounded-full">
                {comboConfig.tacoCount} tacos
              </span>
            )}
          </div>

          <h3 className="font-display text-white text-xl leading-tight mb-1">{product.name}</h3>

          {product.description && (
            <p className="text-white/60 text-sm font-body leading-relaxed mb-3">{product.description}</p>
          )}

          {product.has_costra_option && (
            <CostraToggle value={costra} onChange={setCostra} />
          )}

          {isTaco && (
            <div className="mt-3 flex gap-2">
              {[
                { label: '🧅 Cebolla', value: cebolla, set: setCebolla },
                { label: '🌿 Cilantro', value: cilantro, set: setCilantro },
              ].map(({ label, value, set }) => (
                <button
                  key={label}
                  onClick={() => set((v) => !v)}
                  className={`flex-1 py-1.5 rounded-full text-xs font-body border transition-all ${
                    value
                      ? 'bg-red-600 border-red-600 text-white'
                      : 'bg-transparent border-white/20 text-white/30 line-through'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-dorado font-bold text-lg">{formatCOP(displayPrice)}</span>
          <button onClick={handleAdd} aria-label={`Agregar ${product.name} al pedido`}
            className="bg-fucsia text-white font-display text-base px-4 py-2 rounded-lg hover:brightness-110 transition-all flex-shrink-0">
            + AGREGAR
          </button>
        </div>
      </div>

      {showProteinModal && (
        <ProteinSelector
          product={product}
          proteins={proteins}
          salsaCount={2}
          onConfirm={handleProteinConfirm}
          onClose={() => setShowProteinModal(false)}
        />
      )}

      {showComboBuilder && comboConfig && (
        <ComboBuilder
          product={product}
          config={comboConfig}
          onConfirm={handleComboConfirm}
          onClose={() => setShowComboBuilder(false)}
        />
      )}
    </>
  )
}
