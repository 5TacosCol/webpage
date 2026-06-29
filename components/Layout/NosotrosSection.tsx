export default function NosotrosSection() {
  const pills = [
    { icon: '🌮', text: 'Recetas tradicionales mexicanas' },
    { icon: '🍺', text: 'Cervezas frías y micheladas' },
    { icon: '🐕', text: 'Pet-friendly' },
    { icon: '💚', text: 'Espacio inclusivo' },
  ]

  return (
    <section id="nosotros" className="py-20 bg-verde-fondo">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="font-display text-dorado text-4xl md:text-5xl mb-8">
          SABOR AUTÉNTICO, PRECIO JUSTO
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {pills.map((p) => (
            <div
              key={p.text}
              className="bg-verde-oscuro border border-dorado/20 rounded-xl p-4 flex flex-col items-center gap-2"
            >
              <span className="text-3xl">{p.icon}</span>
              <span className="text-white/80 text-sm font-body text-center leading-tight">{p.text}</span>
            </div>
          ))}
        </div>

        <p className="text-white/80 font-body text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
          Abrimos en octubre de 2025 en la Circunvalar de Pereira con una misión simple:
          tacos buenos de verdad, a precios que no asustan. Birria, cochinita pibil y más,
          preparados con recetas tradicionales mexicanas.
        </p>

        <a
          href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/5tacos.pei/'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-dorado text-dorado font-display text-lg px-6 py-3 rounded-lg hover:bg-dorado/10 transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          SEGUINOS EN INSTAGRAM @5tacos.pei
        </a>
      </div>
    </section>
  )
}
