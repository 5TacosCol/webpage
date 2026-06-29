'use client'

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react'
import { CartItem, Product } from '@/types'

interface CartState {
  items: CartItem[]
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'INCREMENT'; payload: string }
  | { type: 'DECREMENT'; payload: string }
  | { type: 'CLEAR' }

function cartKey(item: CartItem): string {
  const proteins = (item.proteins || []).sort().join(',')
  const costra = item.costra ? '1' : '0'
  const combo = (item.combo_tacos || []).map(t => `${t.protein}:${t.costra}`).join(';')
  const salsas = (item.salsas || []).map(s => `${s.name}x${s.quantity}`).join(',')
  return `${item.product.id}|${proteins}|${costra}|${combo}|${salsas}|${Date.now()}`
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const key = cartKey(action.payload)
      const existing = state.items.find((i) => cartKey(i) === key)
      if (existing) {
        return {
          items: state.items.map((i) =>
            cartKey(i) === key ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return { items: [...state.items, { ...action.payload, quantity: 1 }] }
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter((i) => cartKey(i) !== action.payload) }
    case 'INCREMENT':
      return {
        items: state.items.map((i) =>
          cartKey(i) === action.payload ? { ...i, quantity: i.quantity + 1 } : i
        ),
      }
    case 'DECREMENT':
      return {
        items: state.items
          .map((i) =>
            cartKey(i) === action.payload
              ? { ...i, quantity: i.quantity - 1 }
              : i
          )
          .filter((i) => i.quantity > 0),
      }
    case 'CLEAR':
      return { items: [] }
    default:
      return state
  }
}

interface CartContextValue {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (key: string) => void
  increment: (key: string) => void
  decrement: (key: string) => void
  clear: () => void
  total: number
  count: number
  getKey: (item: CartItem) => string
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] }, (initial) => {
    if (typeof window === 'undefined') return initial
    try {
      const saved = sessionStorage.getItem('5tacos_cart')
      return saved ? JSON.parse(saved) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    sessionStorage.setItem('5tacos_cart', JSON.stringify(state))
  }, [state])

  const total = state.items.reduce(
    (sum, i) => sum + i.unit_price * i.quantity,
    0
  )
  const count = state.items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem: (item) => dispatch({ type: 'ADD_ITEM', payload: item }),
        removeItem: (key) => dispatch({ type: 'REMOVE_ITEM', payload: key }),
        increment: (key) => dispatch({ type: 'INCREMENT', payload: key }),
        decrement: (key) => dispatch({ type: 'DECREMENT', payload: key }),
        clear: () => dispatch({ type: 'CLEAR' }),
        total,
        count,
        getKey: cartKey,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
