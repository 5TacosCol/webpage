'use client'

import { useState } from 'react'
import { Product, Protein, Category } from '@/types'
import ProductCard from './ProductCard'

const CATEGORIES: { key: Category; label: string }[] = [
  { key: 'para_compartir', label: 'Para Compartir' },
  { key: 'tacos', label: 'Tacos' },
  { key: 'tacombos', label: 'Tacombos' },
  { key: 'quesadillas', label: 'Quesadillas' },
  { key: 'bebidas', label: 'Bebidas' },
  { key: 'adiciones', label: 'Adiciones' },
]

interface Props {
  products: Product[]
  proteins: Protein[]
}

export default function MenuSection({ products, proteins }: Props) {
  const [active, setActive] = useState<Category>('tacos')
  const filtered = products.filter((p) => p.category === active && p.available)

  return (
    <section id="menu" className="py-16 bg-verde-fondo">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="font-display text-dorado text-5xl text-center mb-10">
          EL MENÚ
        </h2>

        {/* Tabs scrollables */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-8 scrollbar-hide">
          {CATEGORIES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActive(key)}
              aria-pressed={active === key}
              className={`whitespace-nowrap px-5 py-2 rounded-full font-display text-lg border transition-colors flex-shrink-0 ${
                active === key
                  ? 'bg-dorado text-verde-oscuro border-dorado'
                  : 'border-dorado text-white hover:bg-dorado/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} proteins={proteins} />
          ))}
        </div>
      </div>
    </section>
  )
}
