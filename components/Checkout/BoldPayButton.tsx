'use client'

import { useState } from 'react'

interface Props {
  orderId: string
  orderNumber: number
  amount: number
}

export default function BoldPayButton({ orderId, orderNumber, amount }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [boldDetail, setBoldDetail] = useState<unknown>(null)

  async function handlePay() {
    setLoading(true)
    setError(null)
    setBoldDetail(null)
    try {
      const res = await fetch('/api/bold/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: orderId, order_number: orderNumber, amount }),
      })
      const data = await res.json()
      if (!res.ok) {
        setBoldDetail(data.detail ?? null)
        throw new Error(data.error || 'Error al iniciar el pago')
      }
      window.location.href = data.url
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
      setLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full bg-dorado text-verde-oscuro font-display text-2xl py-4 rounded-xl hover:brightness-110 transition-all disabled:opacity-60 flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <span className="animate-spin">⏳</span>
            CONECTANDO CON BOLD...
          </>
        ) : (
          'PAGAR AHORA 💳'
        )}
      </button>
      {error && <p className="text-red-400 text-sm text-center font-body">{error}</p>}
      {boldDetail && (
        <pre className="text-xs text-red-300 bg-black/30 rounded p-3 overflow-auto max-h-40 font-mono">
          {JSON.stringify(boldDetail, null, 2)}
        </pre>
      )}
    </div>
  )
}