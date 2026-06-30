'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  orderId: string
  orderNumber: number
  amount: number
}

export default function BoldPayButton({ orderId, orderNumber, amount }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!containerRef.current) return

    const apiKey = process.env.NEXT_PUBLIC_BOLD_API_KEY
    if (!apiKey) {
      setError('Llave de Bold no configurada.')
      return
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://5tacos.co'
    const description = `Pedido #${String(orderNumber).padStart(3, '0')} - 5 Tacos Pereira`
    const redirectionUrl = `${siteUrl}/success?order_id=${orderId}`

    const script = document.createElement('script')
    script.src = 'https://checkout.bold.co/library/boldPaymentButton.js'
    script.setAttribute('data-bold-button', '')
    script.setAttribute('data-api-key', apiKey)
    script.setAttribute('data-amount', String(Math.round(amount)))
    script.setAttribute('data-currency', 'COP')
    script.setAttribute('data-description', description)
    script.setAttribute('data-redirection-url', redirectionUrl)
    script.setAttribute('data-order-id', orderId)
    script.setAttribute('data-color', 'dark')

    script.onload = () => setLoaded(true)
    script.onerror = () => setError('No se pudo cargar el botón de pago de Bold.')

    containerRef.current.appendChild(script)

    return () => {
      if (containerRef.current?.contains(script)) {
        containerRef.current.removeChild(script)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-3">
      {!loaded && !error && (
        <p className="text-white/50 text-sm text-center font-body animate-pulse">
          Cargando pasarela de pago...
        </p>
      )}
      <div ref={containerRef} className="mt-2 flex justify-center" />
      {error && (
        <p className="text-red-400 text-sm text-center font-body">{error}</p>
      )}
    </div>
  )
}