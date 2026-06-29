import { Order, OrderItem } from '@/types'
import { formatCOP, formatOrderNumber } from './format'

function formatOrderItem(item: OrderItem): string {
  const base = `  - ${item.quantity}x ${item.product_name}`

  // Combo con detalle de tacos
  if (item.combo_tacos?.length) {
    const tacoLines = item.combo_tacos.map((taco, i) => {
      const parts: string[] = []
      if (taco.costra) parts.push('con costra')
      if (!taco.cebolla) parts.push('sin cebolla')
      if (!taco.cilantro) parts.push('sin cilantro')
      const suffix = parts.length ? `, ${parts.join(', ')}` : ''
      return `    🌮 Taco ${i + 1}: ${taco.protein}${suffix}`
    })
    const salsaLine = item.salsas?.length
      ? `\n    🫙 Salsas: ${item.salsas.map((s) => `${s.name} ×${s.quantity}`).join(', ')}`
      : ''
    const noteLine = item.notes ? `\n    📝 Nota: ${item.notes}` : ''
    return `${base} — ${formatCOP(item.subtotal)}\n${tacoLines.join('\n')}${salsaLine}${noteLine}`
  }

  // Nachos / quesadillas con proteínas
  if (item.proteins?.length) {
    const proteinStr = item.proteins.join(' + ')
    const mods: string[] = []
    if (item.proteins_cebolla === false) mods.push('sin cebolla')
    if (item.proteins_cilantro === false) mods.push('sin cilantro')
    const modStr = mods.length ? `, ${mods.join(', ')}` : ''
    const salsaLine = item.salsas?.length
      ? `\n    🫙 Salsas: ${item.salsas.map((s) => `${s.name} ×${s.quantity}`).join(', ')}`
      : ''
    return `${base} (${proteinStr}${modStr}) — ${formatCOP(item.subtotal)}${salsaLine}`
  }

  // Tacos individuales
  const mods: string[] = []
  if (item.costra) mods.push('con costra')
  if (item.cebolla === false) mods.push('sin cebolla')
  if (item.cilantro === false) mods.push('sin cilantro')
  const modStr = mods.length ? ` (${mods.join(', ')})` : ''
  return `${base}${modStr} — ${formatCOP(item.subtotal)}`
}

export function buildWhatsAppMessage(order: Order): string {
  const items = order.items.map(formatOrderItem).join('\n')

  const tipoEntrega =
    order.order_type === 'pickup'
      ? 'Recoger en tienda'
      : `Domicilio a: ${order.delivery_address}`

  const mensaje = `Hola 5 Tacos! 👋 Confirmo mi pedido:

📋 Pedido ${formatOrderNumber(order.order_number)}
💰 Total: ${formatCOP(order.total)} COP
✅ Pago: Confirmado por Bold

🛍️ Items:
${items}

👤 Nombre: ${order.customer_name}
📱 Teléfono: ${order.customer_phone}
📦 Tipo: ${tipoEntrega}
📝 Nota: ${order.notes || 'Sin notas'}`

  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '57XXXXXXXXXX'
  return `https://wa.me/${number}?text=${encodeURIComponent(mensaje)}`
}
