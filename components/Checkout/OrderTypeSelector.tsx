'use client'

interface Props {
  value: 'pickup' | 'delivery'
  onChange: (v: 'pickup' | 'delivery') => void
  address: string
  onAddressChange: (v: string) => void
}

export default function OrderTypeSelector({ value, onChange, address, onAddressChange }: Props) {
  return (
    <div className="space-y-4">
      <h3 className="font-display text-dorado text-2xl">¿CÓMO RECIBÍS TU PEDIDO?</h3>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onChange('pickup')}
          className={`flex-1 border rounded-xl py-4 font-display text-lg transition-colors ${
            value === 'pickup'
              ? 'border-dorado bg-dorado/10 text-dorado'
              : 'border-white/20 text-white/70 hover:border-dorado/40'
          }`}
        >
          🏪 Recoger en tienda
        </button>
        <button
          type="button"
          onClick={() => onChange('delivery')}
          className={`flex-1 border rounded-xl py-4 font-display text-lg transition-colors ${
            value === 'delivery'
              ? 'border-dorado bg-dorado/10 text-dorado'
              : 'border-white/20 text-white/70 hover:border-dorado/40'
          }`}
        >
          🛵 Domicilio
        </button>
      </div>

      {value === 'delivery' && (
        <div>
          <label htmlFor="delivery_address" className="block text-white/70 text-sm mb-1 font-body">
            Dirección de entrega *
          </label>
          <input
            id="delivery_address"
            type="text"
            required
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            className="w-full bg-verde-oscuro border border-white/20 rounded-lg px-4 py-3 text-white font-body focus:border-dorado focus:outline-none transition-colors"
            placeholder="Ej: Cra 25 #14-32, Álamos"
          />
        </div>
      )}

      {value === 'pickup' && (
        <p className="text-white/50 text-sm font-body">
          📍 Calle 13 #12b-47, Pereira, Risaralda (Circunvalar)
        </p>
      )}
    </div>
  )
}
