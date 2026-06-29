'use client'

import { useState } from 'react'
import { Product, ComboTaco, SalsaSelection } from '@/types'
import { formatCOP } from '@/lib/format'
import { SALSAS, heatChiles } from '@/lib/salsas'

const PROTEINS = [
  { name: 'Birria de res', emoji: '🥩' },
  { name: 'Chicharrón', emoji: '🐷' },
  { name: 'Chorizo Mexicano', emoji: '🌶' },
  { name: 'Tinga de Pollo', emoji: '🍗' },
  { name: 'Cochinita Pibil', emoji: '🍊' },
  { name: 'Nopal/Vegetariano', emoji: '🌿' },
]

const SHORT: Record<string, string> = {
  'Birria de res': 'Birria',
  'Chicharrón': 'Chicharrón',
  'Chorizo Mexicano': 'Chorizo',
  'Tinga de Pollo': 'Tinga',
  'Cochinita Pibil': 'Cochinita',
  'Nopal/Vegetariano': 'Nopal',
}

export interface ComboConfig {
  tacoCount: number
  maxFreeBirria: number
  salsaCount: number
  hasNachos?: boolean
  quesadillaCount?: number
}

export function getComboConfig(name: string): ComboConfig | null {
  // Quesadilla combos
  if (name === 'Combo 2Q')  return { tacoCount: 0, maxFreeBirria: 0, salsaCount: 4, quesadillaCount: 2 }
  if (name === 'Combo QT')  return { tacoCount: 3, maxFreeBirria: 0, salsaCount: 4, quesadillaCount: 1 }
  if (name === 'Combo QN')  return { tacoCount: 0, maxFreeBirria: 0, salsaCount: 4, quesadillaCount: 1, hasNachos: true }
  if (name === 'Combo 2QT') return { tacoCount: 6, maxFreeBirria: 0, salsaCount: 6, quesadillaCount: 2 }
  // Taco combos
  if (name.includes('5x4'))                              return { tacoCount: 20, maxFreeBirria: 4, salsaCount: 8 }
  if (name.includes('5x2') && name.includes('Nachos'))  return { tacoCount: 10, maxFreeBirria: 2, salsaCount: 6, hasNachos: true }
  if (name.includes('5x2'))                             return { tacoCount: 10, maxFreeBirria: 2, salsaCount: 4 }
  if (name.includes('Quesabirrias'))                    return null
  if (name.includes('Nachos'))                          return { tacoCount: 5,  maxFreeBirria: 1, salsaCount: 4, hasNachos: true }
  if (name.includes('Combo 5') || name.startsWith('Combo 5')) return { tacoCount: 5, maxFreeBirria: 1, salsaCount: 2 }
  return null
}

interface Props {
  product: Product
  config: ComboConfig
  onConfirm: (
    combo_tacos: ComboTaco[],
    nachos_proteins: string[] | undefined,
    quesadilla_proteins: string[][] | undefined,
    salsas: SalsaSelection[],
    notes: string,
    unit_price: number
  ) => void
  onClose: () => void
}

// ── Sub-componente: selector de proteínas para nachos/quesadilla ──
function ProteinsStep({
  title,
  subtitle,
  max,
  value,
  onChange,
}: {
  title: string
  subtitle: string
  max: number
  value: string[]
  onChange: (v: string[]) => void
}) {
  function toggle(name: string) {
    if (value.includes(name)) { onChange(value.filter((p) => p !== name)); return }
    if (value.length >= max) { onChange([...value.slice(1), name]); return }
    onChange([...value, name])
  }
  return (
    <div>
      <p className="text-white/50 text-sm font-body mb-1">{subtitle}</p>
      <p className="text-dorado/70 text-xs mb-4 font-body">🥗 Incluye pico de gallo</p>
      <div className="grid grid-cols-2 gap-2">
        {PROTEINS.map(({ name, emoji }) => (
          <button
            key={name}
            onClick={() => toggle(name)}
            className={`flex items-center gap-2 px-3 py-3 rounded-xl border transition-all text-left ${
              value.includes(name)
                ? 'border-dorado bg-dorado/20 text-white'
                : 'border-white/20 bg-[#1B4332]/60 text-white/70 hover:border-dorado/50'
            }`}
          >
            <span className="text-xl">{emoji}</span>
            <span className="text-sm font-body">{SHORT[name]}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ComboBuilder({ product, config, onConfirm, onClose }: Props) {
  const { tacoCount, maxFreeBirria, salsaCount, hasNachos = false, quesadillaCount = 0 } = config

  // Build step list dynamically
  type StepId = `quesadilla_${number}` | 'tacos' | 'costra' | 'nachos' | 'salsas'
  const steps: StepId[] = []
  for (let i = 0; i < quesadillaCount; i++) steps.push(`quesadilla_${i}`)
  if (tacoCount > 0) steps.push('tacos', 'costra')
  if (hasNachos) steps.push('nachos')
  steps.push('salsas')

  const [stepIdx, setStepIdx] = useState(0)
  const currentStep = steps[stepIdx]

  // State
  const [proteins, setProteins] = useState<string[]>([])
  const [costraMap, setCostraMap] = useState<boolean[]>([])
  const [quesadillaProteins, setQuesadillaProteins] = useState<string[][]>(
    Array.from({ length: quesadillaCount }, () => [])
  )
  const [nachosProteins, setNachosProteins] = useState<string[]>([])
  const [salsas, setSalsas] = useState(SALSAS.map((s) => ({ name: s.name, quantity: 0 })))
  const [notes, setNotes] = useState('')

  const birriasCount = proteins.filter((p) => p === 'Birria de res').length
  const birriasExtra = Math.max(0, birriasCount - maxFreeBirria)
  const costrasCount = costraMap.filter(Boolean).length
  const totalPrice = product.price + birriasExtra * 1000 + costrasCount * 1600
  const totalSalsas = salsas.reduce((s, x) => s + x.quantity, 0)

  function addProtein(name: string) {
    if (proteins.length >= tacoCount) return
    setProteins((p) => [...p, name])
    setCostraMap((c) => [...c, false])
  }

  function removeLast(name: string) {
    const idx = [...proteins].map((p, i) => ({ p, i })).reverse().find(({ p }) => p === name)?.i
    if (idx === undefined) return
    setProteins((p) => p.filter((_, i) => i !== idx))
    setCostraMap((c) => c.filter((_, i) => i !== idx))
  }

  function toggleCostra(i: number) {
    setCostraMap((c) => c.map((v, idx) => (idx === i ? !v : v)))
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

  // Step validation
  function canProceed(): boolean {
    if (currentStep === 'tacos') return proteins.length === tacoCount
    if (currentStep === 'costra') return true
    if (currentStep === 'nachos') return nachosProteins.length > 0
    if (currentStep?.startsWith('quesadilla_')) {
      const qi = parseInt(currentStep.split('_')[1])
      return quesadillaProteins[qi].length > 0
    }
    if (currentStep === 'salsas') return totalSalsas === salsaCount
    return false
  }

  function next() {
    if (stepIdx < steps.length - 1) { setStepIdx(stepIdx + 1); return }
    // Confirm
    const combo_tacos: ComboTaco[] = tacoCount > 0
      ? proteins.map((protein, i) => ({ protein, costra: costraMap[i] ?? false }))
      : []
    onConfirm(
      combo_tacos,
      hasNachos ? nachosProteins : undefined,
      quesadillaCount > 0 ? quesadillaProteins : undefined,
      salsas.filter((s) => s.quantity > 0),
      notes,
      totalPrice
    )
  }

  // Step labels
  const stepLabel = (() => {
    if (currentStep === 'tacos') return `PASO ${stepIdx + 1} — ELIGE TUS SABORES`
    if (currentStep === 'costra') return `PASO ${stepIdx + 1} — ¿QUESO EN ALGÚN TACO?`
    if (currentStep === 'nachos') return `PASO ${stepIdx + 1} — PROTEÍNAS PARA LOS NACHOS`
    if (currentStep?.startsWith('quesadilla_')) {
      const qi = parseInt(currentStep.split('_')[1])
      return `PASO ${stepIdx + 1} — PROTEÍNAS QUESADILLA ${quesadillaCount > 1 ? qi + 1 : ''}`
    }
    return `PASO ${stepIdx + 1} — SALSAS Y NOTAS`
  })()

  const nextLabel = (() => {
    const isLast = stepIdx === steps.length - 1
    if (isLast) return `AGREGAR AL PEDIDO ${formatCOP(totalPrice)}`
    if (currentStep === 'tacos') return proteins.length === tacoCount ? 'SIGUIENTE — ¿CON QUESO? →' : `Elegí ${tacoCount - proteins.length} taco${tacoCount - proteins.length > 1 ? 's' : ''} más`
    if (currentStep === 'costra') return 'SIGUIENTE — SALSAS →'
    return 'SIGUIENTE →'
  })()

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center overflow-y-auto">
      <div className="bg-[#0D1F16] w-full max-w-xl min-h-screen md:min-h-0 md:my-6 md:rounded-2xl flex flex-col border border-dorado/20">

        {/* Header */}
        <div className="sticky top-0 bg-[#0D1F16] z-10 px-5 py-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-2">
            <button onClick={onClose} className="text-white/50 hover:text-white text-xl leading-none" aria-label="Cerrar">✕</button>
            <span className="font-display text-white text-lg truncate mx-3">{product.name.toUpperCase()}</span>
            <span className="text-dorado font-bold shrink-0">{formatCOP(totalPrice)}</span>
          </div>
          <div className="flex items-center gap-1">
            {steps.map((_, i) => (
              <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= stepIdx ? 'bg-dorado' : 'bg-white/10'}`} />
            ))}
          </div>
          <p className="text-white/40 text-xs mt-2 font-body">{stepLabel}</p>
        </div>

        {/* Body */}
        <div className="flex-1 px-5 py-5 space-y-5">

          {/* ── Quesadilla protein step ── */}
          {currentStep?.startsWith('quesadilla_') && (() => {
            const qi = parseInt(currentStep.split('_')[1])
            return (
              <ProteinsStep
                title={`PROTEÍNAS QUESADILLA ${quesadillaCount > 1 ? qi + 1 : ''}`}
                subtitle={`Elegí hasta 2 proteínas para la quesadilla${quesadillaCount > 1 ? ` ${qi + 1}` : ''}`}
                max={2}
                value={quesadillaProteins[qi]}
                onChange={(v) => setQuesadillaProteins((prev) => prev.map((p, i) => i === qi ? v : p))}
              />
            )
          })()}

          {/* ── Tacos step ── */}
          {currentStep === 'tacos' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                {PROTEINS.map(({ name, emoji }) => {
                  const count = proteins.filter((p) => p === name).length
                  const isBirria = name === 'Birria de res'
                  const wouldCost = isBirria && (birriasCount + (count === 0 ? 1 : 0)) > maxFreeBirria && count === 0
                  const full = proteins.length >= tacoCount
                  return (
                    <button
                      key={name}
                      onClick={() => addProtein(name)}
                      disabled={full}
                      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl border transition-all text-left ${
                        count > 0 ? 'border-dorado bg-dorado/15' : 'border-white/20 bg-[#1B4332]/60 hover:border-dorado/50'
                      } ${full ? 'opacity-40 cursor-not-allowed' : ''}`}
                    >
                      <span className="text-2xl">{emoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold leading-tight">{SHORT[name]}</p>
                        {wouldCost && <p className="text-dorado text-[11px]">+$1.000 extra</p>}
                      </div>
                      {count > 0 && (
                        <span className="absolute top-1.5 right-2 bg-dorado text-[#1B4332] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{count}</span>
                      )}
                    </button>
                  )
                })}
              </div>

              {proteins.length > 0 && (
                <div>
                  <p className="text-white/40 text-xs mb-2 font-body">Tocá un bloque para quitar el último de ese sabor</p>
                  <div className="flex flex-wrap gap-2">
                    {(() => {
                      const counts: Record<string, number> = {}
                      proteins.forEach((p) => { counts[p] = (counts[p] || 0) + 1 })
                      return Object.entries(counts).map(([name, qty]) => (
                        <button key={name} onClick={() => removeLast(name)}
                          className="flex items-center gap-1.5 bg-dorado/20 border border-dorado/40 rounded-full px-3 py-1.5 text-white text-sm font-body hover:bg-red-500/20 hover:border-red-400/50 transition-colors">
                          <span>{SHORT[name]}</span>
                          {qty > 1 && <span className="bg-dorado text-[#1B4332] text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">{qty}</span>}
                          <span className="text-white/40 text-xs">×</span>
                        </button>
                      ))
                    })()}
                  </div>
                  {birriasExtra > 0 && (
                    <p className="text-dorado text-xs mt-2">+{formatCOP(birriasExtra * 1000)} por {birriasExtra} birria{birriasExtra > 1 ? 's' : ''} extra</p>
                  )}
                </div>
              )}
              <p className={`text-sm font-body ${proteins.length === tacoCount ? 'text-dorado font-semibold' : 'text-white/40'}`}>
                {proteins.length}/{tacoCount} tacos elegidos
              </p>
            </>
          )}

          {/* ── Costra step ── */}
          {currentStep === 'costra' && (
            <>
              <p className="text-white/60 text-sm font-body">Tocá los que querés con costra de queso. Cada uno suma <span className="text-dorado font-semibold">+$1.600</span>.</p>
              <div className="flex flex-wrap gap-3">
                {proteins.map((name, i) => {
                  const hasCostra = costraMap[i]
                  return (
                    <button key={i} onClick={() => toggleCostra(i)}
                      className={`flex flex-col items-center justify-center rounded-xl border-2 transition-all px-4 py-3 min-w-[85px] ${
                        hasCostra ? 'bg-dorado border-dorado text-[#1B4332]' : 'bg-[#1B4332]/60 border-white/20 text-white hover:border-dorado/40'
                      }`}>
                      <span className="text-2xl">{hasCostra ? '🧀' : '🌮'}</span>
                      <span className={`text-xs font-semibold mt-1 ${hasCostra ? 'text-[#1B4332]' : 'text-white/80'}`}>{SHORT[name]}</span>
                      {hasCostra && <span className="text-[10px] font-bold text-[#1B4332] mt-0.5">+$1.600</span>}
                    </button>
                  )
                })}
              </div>
              {costrasCount > 0 && (
                <p className="text-dorado text-sm font-body">{costrasCount} con queso → +{formatCOP(costrasCount * 1600)}</p>
              )}
              {costrasCount === 0 && (
                <p className="text-white/30 text-sm font-body">Sin queso — tocá un taco para agregar costra</p>
              )}
            </>
          )}

          {/* ── Nachos step ── */}
          {currentStep === 'nachos' && (
            <ProteinsStep
              title="PROTEÍNAS PARA LOS NACHOS"
              subtitle="Elegí hasta 2 proteínas para los nachos"
              max={2}
              value={nachosProteins}
              onChange={setNachosProteins}
            />
          )}

          {/* ── Salsas + notas step ── */}
          {currentStep === 'salsas' && (
            <>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-display text-white text-base">SALSAS — elige {salsaCount}</h4>
                  <span className={`text-sm font-bold ${totalSalsas === salsaCount ? 'text-dorado' : 'text-white/40'}`}>
                    {totalSalsas}/{salsaCount}
                  </span>
                </div>
                <div className="space-y-2">
                  {SALSAS.map((salsa, i) => {
                    const qty = salsas[i].quantity
                    return (
                      <div key={salsa.name} className="flex items-center justify-between bg-[#1B4332]/50 rounded-xl px-4 py-3">
                        <div className="flex-1 min-w-0 mr-3">
                          <p className="text-white text-sm font-body">{salsa.name}</p>
                          {'description' in salsa && (
                            <p className="text-white/40 text-[11px]">{(salsa as { description?: string }).description}</p>
                          )}
                          <p className="text-sm mt-0.5">{heatChiles(salsa.heat)}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button onClick={() => adjustSalsa(salsa.name, -1)} disabled={qty === 0}
                            className="w-7 h-7 rounded-full border border-dorado/50 text-dorado flex items-center justify-center disabled:opacity-30 hover:bg-dorado/10 transition-colors text-base leading-none">−</button>
                          <span className="text-white w-4 text-center font-semibold text-sm">{qty}</span>
                          <button onClick={() => adjustSalsa(salsa.name, 1)} disabled={totalSalsas >= salsaCount}
                            className="w-7 h-7 rounded-full border border-dorado/50 text-dorado flex items-center justify-center disabled:opacity-30 hover:bg-dorado/10 transition-colors text-base leading-none">+</button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div>
                <h4 className="font-display text-white text-base mb-2">NOTAS</h4>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: sin cebolla en el taco 3, extra cilantro, birria bien cargada"
                  rows={3}
                  className="w-full bg-[#1B4332]/50 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-body placeholder:text-white/30 resize-none focus:outline-none focus:border-dorado/40 transition-colors" />
                <p className="text-white/30 text-xs mt-1">Cebolla y cilantro vienen incluidos por defecto</p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#0D1F16] border-t border-white/10 px-5 py-4">
          <div className="flex gap-3">
            {stepIdx > 0 && (
              <button onClick={() => setStepIdx(stepIdx - 1)}
                className="px-5 py-4 rounded-xl border border-white/20 text-white/60 font-display hover:border-white/40 transition-colors">
                ←
              </button>
            )}
            <button
              onClick={next}
              disabled={!canProceed()}
              className={`flex-1 py-4 rounded-xl font-display text-base transition-all ${
                canProceed()
                  ? 'bg-dorado text-[#1B4332] hover:brightness-110'
                  : 'bg-white/10 text-white/30 cursor-not-allowed'
              }`}
            >
              {nextLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
