'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  orderId: string
  orderNumber: number
  amount: number
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bold?: any
  }
}

export default function BoldPayButton({ orderId, orderNumber, amount }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const existing = document.querySelector('script[data-bold-script]')
    if (existing) {
      renderButton()
      return
    }

    const script = document.createElement('script')
    script.src = 'https://checkout.bold.co/library/boldPaymentButton.js'
    script.async = true
    script.setAttribute('data-bold-script', '1')
    script.onload = () => renderButton()
    script.onerror = () => setError('No se pudo cargar el módulo de pago de Bold.')
    document.body.appendChild(script)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function renderButton() {
    try {
      if (!window.bold?.checkout?.render) {
        setError('Bold no está disponible. Intenta recargar la página.')
        return
      }
      window.bold.checkout.render({
        containerId: 'bold-checkout-container',
        apiKey: process.env.NEXT_PUBLIC_BOLD_API_KEY,
        orderId,
        amount,
        currency: 'COP',
        description: `Pedido #${String(orderNumber).padStart(3, '0')} - 5 Tacos Pereira`,
        redirectionUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://5tacos.co'}/success?order_id=${orderId}`,
      })
      setReady(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error al cargar el botón de pago.')
    }
  }

  return (
    <div className="space-y-3">
      {!ready && !error && (
        <p className="text-white/50 text-sm text-center font-body animate-pulse">Cargando pasarela de pago...</p>
      )}
      <div id="bold-checkout-container" ref={containerRef} className="mt-2" />
      {error && (
        <p className="text-red-400 text-sm text-center font-body">{error}</p>
      )}
    </div>
  )
}