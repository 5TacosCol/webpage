import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { CartItem, OrderItem } from '@/types'
import crypto from 'crypto'

function boldIntegrityHash(orderId: string, amount: number, currency: string, secret: string): string {
  const raw = `${orderId}${amount}${currency}${secret}`
  return crypto.createHash('sha256').update(raw).digest('hex')
}

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
      costra: item.costra,
      cebolla: item.cebolla,
      cilantro: item.cilantro,
      proteins: item.proteins,
      pico_de_gallo: item.pico_de_gallo,
      combo_tacos: item.combo_tacos,
      nachos_proteins: item.nachos_proteins,
      quesadilla_proteins: item.quesadilla_proteins,
      salsas: item.salsas,
      notes: item.notes,
    }))

    const subtotal = orderItems.reduce((sum, i) => sum + i.subtotal, 0)
    const total = subtotal

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
        delivery_fee: 0,
        total,
        status: 'pending',
        notes: notes || null,
      })
      .select('id, order_number')
      .single()

    if (error) throw error

    const integritySignature = process.env.BOLD_INTEGRITY_SECRET
      ? boldIntegrityHash(data.id, total, 'COP', process.env.BOLD_INTEGRITY_SECRET)
      : null

    return NextResponse.json({
      order_id: data.id,
      order_number: data.order_number,
      total,
      integrity_signature: integritySignature,
    })
  } catch (e: unknown) {
    console.error('[POST /api/orders]', e)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
