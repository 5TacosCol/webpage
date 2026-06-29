'use client'

import { useEffect, useRef } from 'react'

interface Props {
  orderId: string
  orderNumber: number
  amount: number
}

declare global {
  interface Window {
    bold?: {
      checkout: {
        render: (config: object) => void
      }
    }
  }
}

export default function BoldPayButton({ orderId, orderNumber, amount }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.bold.co/library/boldPaymentButton.js'
    script.async = true
    script.onload = () => {
      if (window.bold && containerRef.current) {
        window.bold.checkout.render({
          containerId: 'bold-checkout-container',
          apiKey: process.env.NEXT_PUBLIC_BOLD_API_KEY,
          orderId,
          amount: amount * 100,
          currency: 'COP',
          description: `Pedido #${String(orderNumber).padStart(3, '0')} - 5 Tacos Pereira`,
          redirectionUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/success?order_id=${orderId}`,
        })
      }
    }
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [orderId, orderNumber, amount])

  return <div id="bold-checkout-container" ref={containerRef} className="mt-4" />
}
