export default function Footer() {
  return (
    <footer className="bg-[#0D0D0D] py-12 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex justify-center items-center gap-3 mb-3">
          <svg width="32" height="32" viewBox="0 0 36 36" fill="none" aria-hidden="true">
            <circle cx="18" cy="18" r="18" fill="#F5A623"/>
            <text x="18" y="23" textAnchor="middle" fill="#1B4332" fontSize="16" fontWeight="bold" fontFamily="sans-serif">5</text>
          </svg>
          <span className="font-display text-dorado text-xl">5 TACOS TAQUERÍA</span>
        </div>

        <p className="text-white/40 font-body text-sm mb-6">
          La taquería mexicana auténtica de Pereira | Calle 13 #12b-47, Circunvalar
        </p>

        <div className="flex justify-center gap-6 mb-6">
          <a
            href={process.env.NEXT_PUBLIC_INSTAGRAM_URL || 'https://www.instagram.com/5tacos.pei/'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de 5 Tacos"
            className="text-dorado hover:text-dorado/70 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
          </a>
          <a
            href={process.env.NEXT_PUBLIC_TIKTOK_URL || 'https://www.tiktok.com/@5tacos.pei'}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok de 5 Tacos"
            className="text-dorado hover:text-dorado/70 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.98a8.17 8.17 0 004.78 1.52V7.07a4.85 4.85 0 01-1.01-.38z"/>
            </svg>
          </a>
        </div>

        <a
          href={process.env.NEXT_PUBLIC_RAPPI_URL || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="text-dorado/60 hover:text-dorado text-sm font-body transition-colors block mb-6"
        >
          Pedir a domicilio en Rappi
        </a>

        <p className="text-white/20 font-body text-xs">
          © 2025 5 Tacos Taquería · Pereira, Risaralda, Colombia
        </p>

        {/* SEO text */}
        <p className="sr-only">
          Restaurante mexicano en Pereira · Tacos a domicilio Pereira · Birria Pereira
        </p>
      </div>
    </footer>
  )
}
