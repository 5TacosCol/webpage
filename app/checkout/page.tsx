'use client'

import { useState } from 'react'
import { useCart } from '@/components/Cart/CartProvider'
import CustomerForm from '@/components/Checkout/CustomerForm'
import OrderTypeSelector from '@/components/Checkout/OrderTypeSelector'
import dynamic from 'next/dynamic'
const BoldPayButton = dynamic(() => import('@/components/Checkout/BoldPayButton'), { ssr: false })
import { formatCOP } from '@/lib/format'
import { useRouter } from 'next/navigation'

interface FormState {
  customer_name: string
  customer_phone: string
  notes: string
}

export default function CheckoutPage() {
  const { items, total, clear } = useCart()
  const router = useRouter()
  const [orderType, setOrderType] = useState<'pickup' | 'delivery'>('pickup')
  const [address, setAddress] = useState('')
  const [form, setForm] = useState<FormState>({ customer_name: '', customer_phone: '', notes: '' })
  const [orderId, setOrderId] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-verde-fondo flex flex-col items-center justify-center text-center px-4">
        <span className="text-7xl mb-4">🌮</span>
        <h1 className="font-display text-dorado text-3xl mb-3">Tu pedido está vacío</h1>
        <button onClick={() => router.push('/#menu')} className="border border-dorado text-dorado px-6 py-2 rounded-lg font-display text-xl hover:bg-dorado/10 transition-colors">
          VER MENÚ
        </button>
      </div>
    )
  }

  async function handleCreateOrder() {
    if (!form.customer_name || !form.customer_phone) {
      setError('Por favor completá tu nombre y teléfono.')
      return
    }
    if (orderType === 'delivery' && !address) {
      setError('Por favor ingresá tu dirección de entrega.')
      return
    }
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          order_type: orderType,
          delivery_address: orderType === 'delivery' ? address : undefined,
          items,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al crear el pedido')
      setOrderId(data.order_id)
      setOrderNumber(data.order_number)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-verde-fondo pt-8 pb-20">
      <div className="max-w-xl mx-auto px-4 space-y-8">
        <h1 className="font-display text-dorado text-4xl">CHECKOUT</h1>

        <OrderTypeSelector
          value={orderType}
          onChange={setOrderType}
          address={address}
          onAddressChange={setAddress}
        />

        <CustomerForm data={form} onChange={setForm} />

        {/* Resumen */}
        <div>
          <h3 className="font-display text-dorado text-2xl mb-3">TU PEDIDO</h3>
          <div className="bg-verde-oscuro rounded-xl p-4 space-y-2">
            {items.map((item) => {
              const mods = []
              if (item.proteins?.length) mods.push(item.proteins.join(' + '))
              if (item.costra) mods.push('con costra')
              return (
                <div key={`${item.product.id}-${mods.join('')}`} className="flex justify-between text-sm">
                  <span className="text-white/80">{item.quantity}× {item.product.name}{mods.length ? ` (${mods.join(', ')})` : ''}</span>
                  <span className="text-dorado font-semibold">{formatCOP(item.unit_price * item.quantity)}</span>
                </div>
              )
            })}
            <div className="border-t border-white/10 pt-2 flex justify-between font-bold">
              <span className="text-white">Total</span>
              <span className="text-dorado text-xl">{formatCOP(total)}</span>
            </div>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm font-body">{error}</p>}

        {!orderId ? (
          <button
            onClick={handleCreateOrder}
            disabled={loading}
            className="w-full bg-dorado text-verde-oscuro font-display text-2xl py-4 rounded-xl hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? 'PROCESANDO...' : 'CONTINUAR AL PAGO'}
          </button>
        ) : (
          <BoldPayButton orderId={orderId} orderNumber={orderNumber!} amount={total} />
        )}
      </div>
    </div>
  )
}
