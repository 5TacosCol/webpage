const horarios = [
  { dia: 'Lunes', hora: 'CERRADO', cerrado: true },
  { dia: 'Martes – Jueves', hora: '5:00 pm – 10:00 pm', cerrado: false },
  { dia: 'Viernes – Sábado', hora: '5:00 pm – 11:00 pm', cerrado: false },
  { dia: 'Domingo', hora: '5:00 pm – 10:00 pm', cerrado: false },
]

export default function HorariosSection() {
  return (
    <section id="horarios" className="py-20 bg-verde-oscuro">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="font-display text-dorado text-4xl md:text-5xl text-center mb-12">
          ¿CUÁNDO VISITARNOS?
        </h2>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            <div className="space-y-3">
              {horarios.map(({ dia, hora, cerrado }) => (
                <div
                  key={dia}
                  className="flex justify-between items-center py-3 border-b border-white/10"
                >
                  <span className="text-white font-body">{dia}</span>
                  <span className={`font-body font-semibold ${cerrado ? 'text-white/30' : 'text-dorado'}`}>
                    {hora}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-verde-fondo/50 rounded-xl border border-dorado/20">
              <p className="text-white/80 font-body text-sm flex items-start gap-2">
                <span className="text-dorado">📍</span>
                Calle 13 #12b-47, Pereira, Risaralda (Circunvalar)
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=Calle+13+12b-47+Pereira+Risaralda"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 border border-dorado text-dorado font-display text-lg px-5 py-2.5 rounded-lg hover:bg-dorado/10 transition-colors"
            >
              CÓMO LLEGAR →
            </a>
          </div>

          <div className="rounded-xl overflow-hidden border border-dorado/20 h-64 md:h-80 bg-verde-fondo/50">
            <iframe
              title="Ubicación 5 Tacos en Google Maps"
              src="https://maps.google.com/maps?q=4.8133,-75.6960&z=16&output=embed"
              width="100%"
              height="100%"
              className="border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
