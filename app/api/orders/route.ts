import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CartItem, OrderItem } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { customer_name, customer_phone, order_type, delivery_address, items, notes } = body

    if (!customer_name || !customer_phone || !order_type || !items?.length) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    const orderItems: OrderItem[] = (items as CartItem[]).map((item) => ({
      product_id: item.product.id,
      product_name: item.product.name,
      quantity: item.quantity,
      unit_price: item.unit_price,
      subtotal: item.unit_price * item.quantity,
      // tacos individuales
      costra: item.costra,
      cebolla: item.cebolla,
      cilantro: item.cilantro,
      // nachos / quesadillas
      proteins: item.proteins,
      proteins_cebolla: item.proteins_cebolla,
      proteins_cilantro: item.proteins_cilantro,
      // combos
      combo_tacos: item.combo_tacos,
    }))

    const subtotal = orderItems.reduce((sum, i) => sum + i.subtotal, 0)
    const delivery_fee = order_type === 'delivery' ? 0 : 0
    const total = subtotal + delivery_fee

    const supabase = createClient()
    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name,
        customer_phone,
        order_type,
        delivery_address: delivery_address || null,
        items: orderItems,
        subtotal,
        delivery_fee,
        total,
        status: 'pending',
        notes: notes || null,
      })
      .select('id, order_number')
      .single()

    if (error) throw error

    return NextResponse.json({ order_id: data.id, order_number: data.order_number, total })
  } catch (e: unknown) {
    console.error('[POST /api/orders]', e)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
