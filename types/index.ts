export type Category =
  | 'para_compartir'
  | 'tacos'
  | 'tacombos'
  | 'quesadillas'
  | 'bebidas'
  | 'adiciones'

export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: Category
  available: boolean
  has_protein_choice: boolean
  max_proteins: number
  has_costra_option: boolean
  sort_order: number
}

export interface Protein {
  id: string
  name: string
  extra_cost: number
}

export interface SalsaSelection {
  name: string
  quantity: number
}

export interface ComboTaco {
  protein: string
  costra: boolean
}

export interface CartItem {
  product: Product
  quantity: number
  // Tacos individuales
  costra?: boolean
  cebolla?: boolean
  cilantro?: boolean
  // Nachos / quesadillas standalone
  proteins?: string[]
  pico_de_gallo?: boolean
  // Combos
  combo_tacos?: ComboTaco[]
  nachos_proteins?: string[]       // proteínas para nachos dentro de un combo
  quesadilla_proteins?: string[][] // [quesadilla1:[p1,p2], quesadilla2:[p1,p2]]
  salsas?: SalsaSelection[]
  notes?: string
  unit_price: number
}

export interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  subtotal: number
  costra?: boolean
  cebolla?: boolean
  cilantro?: boolean
  proteins?: string[]
  pico_de_gallo?: boolean
  combo_tacos?: ComboTaco[]
  nachos_proteins?: string[]
  quesadilla_proteins?: string[][]
  salsas?: SalsaSelection[]
  notes?: string
}

export interface Order {
  id: string
  order_number: number
  customer_name: string
  customer_phone: string
  order_type: 'pickup' | 'delivery'
  delivery_address?: string
  items: OrderItem[]
  subtotal: number
  delivery_fee: number
  total: number
  status: 'pending' | 'paid' | 'preparing' | 'ready' | 'delivered' | 'cancelled'
  bold_payment_id?: string
  bold_status?: string
  notes?: string
  created_at: string
}
