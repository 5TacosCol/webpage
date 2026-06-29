import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { order_id, order_number, amount } = await req.json()

    if (!order_id || !amount) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    const apiKey = process.env.BOLD_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Bold API key no configurada' }, { status: 500 })
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://5tacos.co'

    const res = await fetch('https://api.bold.co/online/link/v1/payment-links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `x-api-key ${apiKey}`,
      },
      body: JSON.stringify({
        amount_type: 'CLOSE',
        amount: {
          total: amount,
          currency: 'COP',
        },
        description: `Pedido #${String(order_number).padStart(3, '0')} - 5 Tacos Pereira`,
        order_id,
        redirect_url: `${siteUrl}/success?order_id=${order_id}`,
        payment_methods: ['CARD', 'NEQUI', 'PSE', 'DAVIPLATA'],
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      console.error('[Bold create-payment]', data)
      return NextResponse.json({ error: 'Error al crear el pago en Bold', detail: data }, { status: 502 })
    }

    const url = data?.payload?.url || data?.url
    if (!url) {
      console.error('[Bold create-payment] URL no encontrada', data)
      return NextResponse.json({ error: 'No se recibió URL de pago de Bold', detail: data }, { status: 502 })
    }

    return NextResponse.json({ url })
  } catch (e: unknown) {
    console.error('[Bold create-payment]', e)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}