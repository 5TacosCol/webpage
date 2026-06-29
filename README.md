# 5 Tacos — Sitio Web y Sistema de Pedidos Online

Sitio web completo para **5 Tacos Taquería** (Pereira, Colombia), construido con Next.js 14, Tailwind CSS, Supabase y Bold para pagos.

---

## Stack

- **Framework:** Next.js 14 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS v3
- **Base de datos / Auth:** Supabase (PostgreSQL + RLS)
- **Pagos:** Bold (pasarela de pagos Colombia)
- **Tipografías:** Bebas Neue (títulos) + Inter (cuerpo) via Google Fonts

---

## Requisitos previos

- Node.js 18+ (recomendado 20 LTS)
- npm o pnpm
- Cuenta en [Supabase](https://supabase.com)
- Cuenta en [Bold](https://bold.co) para el módulo de pagos

---

## Setup local

### 1. Clonar el repositorio / copiar el proyecto

```bash
cd C:\Users\Bitel\5tacos
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Editar `.env.local` con los valores reales:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...  # anon/public key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...       # service_role key (solo server-side)

# Bold (pagos Colombia)
NEXT_PUBLIC_BOLD_API_KEY=tu_api_key_bold
BOLD_INTEGRITY_SECRET=tu_secret_bold

# Negocio
NEXT_PUBLIC_SITE_URL=https://5tacos.co
NEXT_PUBLIC_WHATSAPP_NUMBER=573XXXXXXXXX
NEXT_PUBLIC_RAPPI_URL=https://www.rappi.com.co/pereira/restaurantes/delivery/346002-5-tacos
NEXT_PUBLIC_INSTAGRAM_URL=https://www.instagram.com/5tacos.pei/
NEXT_PUBLIC_TIKTOK_URL=https://www.tiktok.com/@5tacos.pei
```

### 4. Configurar Supabase

#### 4a. Correr la migración inicial

En el SQL Editor de Supabase, ejecutar el contenido de:

```
supabase/migrations/001_initial.sql
```

Esto crea las tablas `products`, `proteins` y `orders`, y configura RLS.

#### 4b. Poblar el menú

Ejecutar el seed:

```
supabase/seed.sql
```

Esto inserta todos los productos del menú (tacos, combos, bebidas, adiciones, etc.) y las proteínas disponibles.

#### 4c. Verificar RLS

Las políticas de Row Level Security están incluidas en la migración:
- **anon** puede insertar y leer órdenes
- **service_role** (usado en server-side) tiene acceso completo

### 5. Correr en desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## Estructura del proyecto

```
C:\Users\Bitel\5tacos\
├── app/
│   ├── layout.tsx           # Root layout, fuentes, CartProvider
│   ├── page.tsx             # Home: Hero + Menú + Nosotros + Horarios
│   ├── globals.css          # Estilos globales Tailwind
│   ├── checkout/
│   │   └── page.tsx         # Formulario de checkout + Bold Pay
│   ├── success/
│   │   └── page.tsx         # Confirmación de pedido + link WhatsApp
│   └── api/
│       ├── orders/
│       │   └── route.ts     # POST /api/orders — crea orden en Supabase
│       └── bold/
│           └── webhook/
│               └── route.ts # POST webhook Bold — actualiza status a 'paid'
├── components/
│   ├── Cart/
│   │   ├── CartProvider.tsx  # Context + reducer del carrito (sessionStorage)
│   │   ├── CartItem.tsx      # Item individual con controles +/−
│   │   ├── CartSummary.tsx   # Subtotal + botón "Ir al pago"
│   │   └── CartDrawer.tsx    # Drawer lateral del carrito
│   ├── Menu/
│   │   ├── MenuSection.tsx   # Tabs de categorías + grid de productos
│   │   ├── ProductCard.tsx   # Card individual del producto
│   │   ├── ProteinSelector.tsx # Modal para elegir proteínas
│   │   └── CostraToggle.tsx  # Toggle costra de queso (+$1.600)
│   ├── Checkout/
│   │   ├── CustomerForm.tsx     # Formulario nombre/teléfono/nota
│   │   ├── OrderTypeSelector.tsx # Pickup vs. Domicilio
│   │   └── BoldPayButton.tsx    # Inyecta script Bold checkout
│   └── Layout/
│       ├── Navbar.tsx        # Barra de navegación + botón carrito
│       ├── Hero.tsx          # Sección hero con CTA
│       ├── NosotrosSection.tsx
│       ├── HorariosSection.tsx # Horarios + mapa embed
│       └── Footer.tsx        # Footer con redes sociales
├── lib/
│   ├── format.ts             # formatCOP(), formatOrderNumber()
│   ├── bold.ts               # verifyBoldWebhook() con HMAC-SHA256
│   ├── whatsapp.ts           # buildWhatsAppMessage() — arma el link wa.me
│   └── supabase/
│       ├── client.ts         # createBrowserClient (client components)
│       └── server.ts         # createServerClient (server components / API routes)
├── types/
│   └── index.ts              # Types: Product, Protein, CartItem, Order, etc.
├── supabase/
│   ├── migrations/
│   │   └── 001_initial.sql   # Schema completo: products, proteins, orders + RLS
│   └── seed.sql              # Datos del menú completo
└── public/
    ├── sitemap.xml
    └── robots.txt
```

---

## Flujo de pedido

1. **Home** → usuario navega el menú por categorías
2. **ProductCard** → agrega items al carrito (con proteínas y/o costra opcional)
3. **CartDrawer** → revisa el pedido, presiona "Ir al pago"
4. **Checkout** → completa datos, elige pickup o domicilio, presiona "Continuar al pago"
5. **POST /api/orders** → crea la orden en Supabase con status `pending`
6. **BoldPayButton** → inyecta el botón de Bold para procesar el pago
7. **Bold redirect** → redirige a `/success?order_id=...` tras pago exitoso
8. **Webhook Bold** → `POST /api/bold/webhook` actualiza status a `paid` en Supabase
9. **Success page** → muestra resumen + botón para confirmar por WhatsApp

---

## Deploy (Vercel recomendado)

1. Conectar el repo a Vercel
2. Agregar todas las variables de entorno en el panel de Vercel
3. Configurar el webhook de Bold apuntando a:
   ```
   https://5tacos.co/api/bold/webhook
   ```
4. `npm run build` no debería tener errores de TypeScript

---

## Notas de producción

- El delivery fee está en $0 actualmente — ajustar en `app/api/orders/route.ts` si se cobra domicilio
- La costra de queso tiene un costo fijo de $1.600 hardcodeado — actualizar en `components/Menu/ProductCard.tsx` y `components/Menu/CostraToggle.tsx` si cambia el precio
- Para el mapa de HorariosSection, las coordenadas `4.8133,-75.6960` son aproximadas — reemplazar con las coordenadas exactas del local
- El número de teléfono en `app/page.tsx` (jsonLd) debe actualizarse con el número real

---

## Paleta de colores

| Variable Tailwind | Hex | Uso |
|---|---|---|
| `verde-oscuro` | `#1B4332` | Fondo de cards, navbar |
| `verde-fondo` | `#0D1F16` | Fondo general |
| `dorado` | `#F5A623` | Acentos, títulos, precios |
| `fucsia` | `#8B1A6B` | Botones de acción principal |

---

© 2025 5 Tacos Taquería · Pereira, Risaralda, Colombia
