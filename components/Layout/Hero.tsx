export default function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-verde-oscuro overflow-hidden pt-16">
      {/* Patrón logo monocromático */}
      <div className="absolute inset-0 opacity-[0.07]" aria-hidden="true">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="logo-pattern" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
              <g transform="translate(10,10) scale(0.95)" fill="#F5A623">
                {/* Taco shell */}
                <path d="M20 60 Q50 20 80 60 Q50 55 20 60Z"/>
                {/* Filling peaks */}
                <ellipse cx="35" cy="52" rx="5" ry="8" transform="rotate(-10,35,52)"/>
                <ellipse cx="50" cy="48" rx="5" ry="9" transform="rotate(0,50,48)"/>
                <ellipse cx="65" cy="52" rx="5" ry="8" transform="rotate(10,65,52)"/>
                {/* Speed lines */}
                <line x1="2" y1="38" x2="22" y2="38" strokeWidth="4" stroke="#F5A623" strokeLinecap="round"/>
                <line x1="5" y1="50" x2="18" y2="50" strokeWidth="4" stroke="#F5A623" strokeLinecap="round"/>
                <line x1="2" y1="62" x2="22" y2="62" strokeWidth="4" stroke="#F5A623" strokeLinecap="round"/>
                {/* 5 */}
                <text x="42" y="72" fontSize="38" fontWeight="900" fontFamily="sans-serif" fill="#F5A623">5</text>
              </g>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#logo-pattern)"/>
        </svg>
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
        <div className="mb-8 flex justify-center">
          <img src="/logo.jpg" alt="5 Tacos Taquería" width={160} height={160} className="rounded-2xl drop-shadow-2xl" />
        </div>

        <h1 className="font-display text-white text-5xl md:text-7xl leading-tight mb-4">
          LOS TACOS MÁS AUTÉNTICOS DE PEREIRA
        </h1>

        <p className="text-dorado font-body text-xl md:text-2xl mb-8 tracking-wide">
          Birria · Cochinita Pibil · Tinga · Chorizo · Chicharrón
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <a
            href="#menu"
            className="border-2 border-dorado text-white font-display text-xl px-8 py-3 rounded-lg hover:bg-dorado/10 transition-colors"
          >
            VER MENÚ
          </a>
          <a
            href="#menu"
            className="bg-dorado text-verde-oscuro font-display text-xl px-8 py-3 rounded-lg font-bold hover:brightness-110 transition-all"
          >
            PEDIR AHORA
          </a>
        </div>

        <div className="inline-flex items-center gap-2 bg-verde-fondo/60 border border-dorado/30 rounded-full px-5 py-2 text-white/80 font-body text-sm">
          🌮 Pedí online · Recogé en tienda o domicilio
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-dorado/30" aria-hidden="true" />
    </section>
  )
}
