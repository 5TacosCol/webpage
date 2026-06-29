import { NextRequest, NextResponse } from 'next/server'
import { verifyBoldWebhook } from '@/lib/bold'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    const signature = req.headers.get('x-bold-signature') || ''
    const secret = process.env.BOLD_INTEGRITY_SECRET || ''

    if (secret && !verifyBoldWebhook(rawBody, signature, secret)) {
      console.warn('[Bold webhook] Firma inválida')
      return NextResponse.json({ ok: false }, { status: 200 })
    }

    const payload = JSON.parse(rawBody)
    const { order_id, status, payment_id } = payload

    if (status === 'approved' && order_id) {
      const supabase = createClient()
      await supabase
        .from('orders')
        .update({
          status: 'paid',
          bold_payment_id: payment_id || null,
          bold_status: status,
        })
        .eq('id', order_id)
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (e) {
    console.error('[Bold webhook error]', e)
    return NextResponse.json({ ok: false }, { status: 200 })
  }
}
