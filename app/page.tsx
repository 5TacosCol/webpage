import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Layout/Navbar'
import Hero from '@/components/Layout/Hero'
import MenuSection from '@/components/Menu/MenuSection'
import NosotrosSection from '@/components/Layout/NosotrosSection'
import HorariosSection from '@/components/Layout/HorariosSection'
import Footer from '@/components/Layout/Footer'

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  name: '5 Tacos Taquería',
  url: 'https://5tacos.co',
  image: 'https://5tacos.co/og-image.jpg',
  description:
    'Taquería mexicana en la Circunvalar de Pereira. Tacos de birria, cochinita pibil, tinga de pollo, chorizo mexicano y chicharrón.',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Calle 13 #12b-47',
    addressLocality: 'Pereira',
    addressRegion: 'Risaralda',
    addressCountry: 'CO',
    postalCode: '660001',
  },
  geo: { '@type': 'GeoCoordinates', latitude: 4.8133, longitude: -75.696 },
  telephone: '+57XXXXXXXXXX',
  servesCuisine: ['Mexicana', 'Tacos', 'Comida latinoamericana'],
  priceRange: '$$',
  currenciesAccepted: 'COP',
  paymentAccepted: 'Efectivo, Tarjeta de crédito, Tarjeta de débito, Nequi, Daviplata',
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Tuesday', 'Wednesday', 'Thursday', 'Sunday'], opens: '17:00', closes: '22:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday', 'Saturday'], opens: '17:00', closes: '23:00' },
  ],
  menu: 'https://5tacos.co/#menu',
  acceptsReservations: false,
  sameAs: [
    'https://www.instagram.com/5tacos.pei/',
    'https://www.tiktok.com/@5tacos.pei',
    'https://www.rappi.com.co/pereira/restaurantes/delivery/346002-5-tacos',
  ],
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Pet-friendly', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Wheelchair accessible', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Family-friendly', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'LGBTQ+ friendly', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Free parking', value: true },
  ],
  hasMap: 'https://maps.google.com/?q=Calle+13+12b-47+Pereira+Risaralda+Colombia',
}

export default async function HomePage() {
  const supabase = createClient()
  const [{ data: products }, { data: proteins }] = await Promise.all([
    supabase.from('products').select('*').eq('available', true).order('sort_order'),
    supabase.from('proteins').select('*'),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <main>
        <Hero />
        <MenuSection products={products || []} proteins={proteins || []} />
        <NosotrosSection />
        <HorariosSection />
      </main>
      <Footer />
    </>
  )
}
