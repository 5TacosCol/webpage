'use client'

import { ChangeEvent } from 'react'

interface FormData {
  customer_name: string
  customer_phone: string
  notes: string
}

interface Props {
  data: FormData
  onChange: (data: FormData) => void
}

export default function CustomerForm({ data, onChange }: Props) {
  function handle(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    onChange({ ...data, [e.target.name]: e.target.value })
  }

  return (
    <div className="space-y-4">
      <h3 className="font-display text-dorado text-2xl">TUS DATOS</h3>
      <div>
        <label htmlFor="customer_name" className="block text-white/70 text-sm mb-1 font-body">
          Nombre *
        </label>
        <input
          id="customer_name"
          name="customer_name"
          type="text"
          required
          value={data.customer_name}
          onChange={handle}
          className="w-full bg-verde-oscuro border border-white/20 rounded-lg px-4 py-3 text-white font-body focus:border-dorado focus:outline-none transition-colors"
          placeholder="Tu nombre"
        />
      </div>
      <div>
        <label htmlFor="customer_phone" className="block text-white/70 text-sm mb-1 font-body">
          Teléfono *
        </label>
        <input
          id="customer_phone"
          name="customer_phone"
          type="tel"
          required
          value={data.customer_phone}
          onChange={handle}
          className="w-full bg-verde-oscuro border border-white/20 rounded-lg px-4 py-3 text-white font-body focus:border-dorado focus:outline-none transition-colors"
          placeholder="Ej: 311 234 5678"
        />
      </div>
      <div>
        <label htmlFor="notes" className="block text-white/70 text-sm mb-1 font-body">
          Nota especial (opcional)
        </label>
        <textarea
          id="notes"
          name="notes"
          value={data.notes}
          onChange={handle}
          rows={3}
          className="w-full bg-verde-oscuro border border-white/20 rounded-lg px-4 py-3 text-white font-body focus:border-dorado focus:outline-none transition-colors resize-none"
          placeholder="Ej: sin cilantro, birria bien cargada"
        />
      </div>
    </div>
  )
}
