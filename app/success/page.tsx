import { createClient } from '@/lib/supabase/server'
import { formatCOP, formatOrderNumber } from '@/lib/format'
import { buildWhatsAppMessage } from '@/lib/whatsapp'
import { Order } from '@/types'

interface Props {
  searchParams: Promise<{ order_id?: string }> | { order_id?: string }
}

export default async function SuccessPage({ searchParams }: Props) {
  const params = await Promise.resolve(searchParams)
  const order_id = params?.order_id

  if (!order_id) {
    return (
      <div className="min-h-screen bg-verde-fondo flex items-center justify-center text-center px-4">
        <div>
          <h1 className="font-display text-dorado text-4xl mb-4">ORDEN NO ENCONTRADA</h1>
          <a href="/" className="text-white/70 hover:text-white font-body">Volver al inicio</a>
        </div>
      </div>
    )
  }

  const supabase = createClient()
  const { data: order, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', order_id)
    .single()

  if (error || !order) {
    return (
      <div className="min-h-screen bg-verde-fondo flex items-center justify-center text-center px-4">
        <div>
          <h1 className="font-display text-dorado text-4xl mb-4">Pedido no encontrado</h1>
          <a href="/" className="text-white/70 hover:text-white font-body">Volver al inicio</a>
        </div>
      </div>
    )
  }

  const o = order as Order
  const items = Array.isArray(o.items) ? o.items : []
  const waUrl = buildWhatsAppMessage(o)

  return (
    <div className="min-h-screen bg-verde-fondo pt-12 pb-20">
      <div className="max-w-lg mx-auto px-4 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="font-display text-dorado text-5xl mb-2">
          ¡PEDIDO {formatOrderNumber(o.order_number)} CONFIRMADO!
        </h1>
        <p className="text-white/60 font-body mb-8">
          {o.status === 'paid' ? '✅ Pago confirmado' : '⏳ Pago pendiente de confirmación'}
        </p>

        <div className="bg-verde-oscuro rounded-2xl p-5 text-left mb-6">
          <h2 className="font-display text-dorado text-xl mb-3">DETALLE DEL PEDIDO</h2>
          {items.map((item, i) => {
            const mods: string[] = []
            if (item.proteins?.length) mods.push(item.proteins.join(' + '))
            if (item.costra) mods.push('con costra')
            return (
              <div key={i} className="flex justify-between text-sm py-1.5 border-b border-white/10">
                <span className="text-white/80">{item.quantity}× {item.product_name}{mods.length ? ` (${mods.join(', ')})` : ''}</span>
                <span className="text-dorado">{formatCOP(item.subtotal)}</span>
              </div>
            )
          })}
          <div className="flex justify-between mt-3 font-bold">
            <span className="text-white">Total</span>
            <span className="text-dorado text-lg">{formatCOP(o.total)}</span>
          </div>
        </div>

        {o.order_type === 'pickup' ? (
          <div className="bg-verde-fondo border border-dorado/20 rounded-xl p-4 mb-6 text-left">
            <p className="text-dorado font-display text-lg mb-1">RECOGER EN TIENDA</p>
            <p className="text-white/70 text-sm font-body">Calle 13 #12b-47, Pereira, Risaralda (Circunvalar)</p>
            <p className="text-white/50 text-xs mt-1 font-body">Mar–Jue y Dom: 5–10 pm | Vie–Sáb: 5–11 pm</p>
          </div>
        ) : (
          <div className="bg-verde-fondo border border-dorado/20 rounded-xl p-4 mb-6 text-left">
            <p className="text-dorado font-display text-lg mb-1">DOMICILIO</p>
            <p className="text-white/70 text-sm font-body">Te contactaremos para coordinar la entrega</p>
            <p className="text-white/50 text-xs mt-1 font-body">{o.delivery_address}</p>
          </div>
        )}

        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-[#25D366] text-white font-display text-2xl py-4 rounded-xl hover:brightness-110 transition-all mb-4"
        >
          CONFIRMAR POR WHATSAPP 💬
        </a>

        <a href="/" className="text-white/40 hover:text-white/70 font-body text-sm transition-colors">
          Volver al inicio
        </a>
      </div>
    </div>
  )
}
