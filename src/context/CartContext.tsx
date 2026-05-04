'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react'

// ── Types ──────────────────────────────────────────────────────────────────────

export type CartItemType = 'transcript' | 'earnings'

export type CartItem = {
  id: string           // unique per item (slug works)
  slug: string
  type: CartItemType
  title: string
  ticker?: string      // for earnings items
  quarter?: string     // for earnings items
  tier?: string        // for transcript items (standard | premium | elite)
  priceUsd: number
  originalPriceUsd?: number
}

type CartState = {
  items: CartItem[]
  isOpen: boolean
}

type CartAction =
  | { type: 'ADD_ITEM'; item: CartItem }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }

// ── Reducer ────────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      // Prevent duplicates
      if (state.items.some((i) => i.id === action.item.id)) return state
      return { ...state, items: [...state.items, action.item] }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) }
    case 'CLEAR':
      return { ...state, items: [] }
    case 'OPEN':
      return { ...state, isOpen: true }
    case 'CLOSE':
      return { ...state, isOpen: false }
    default:
      return state
  }
}

const STORAGE_KEY = 'tiq-cart'

function loadFromStorage(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as CartItem[]) : []
  } catch {
    return []
  }
}

// ── Context ────────────────────────────────────────────────────────────────────

type CartContextValue = {
  items: CartItem[]
  isOpen: boolean
  itemCount: number
  subtotal: number
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  hasItem: (id: string) => boolean
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  })

  // Hydrate from localStorage once on mount
  const [hydrated, setHydrated] = useState(false)
  useEffect(() => {
    const stored = loadFromStorage()
    if (stored.length > 0) {
      stored.forEach((item) => dispatch({ type: 'ADD_ITEM', item }))
    }
    setHydrated(true)
  }, [])

  // Persist to localStorage whenever items change (after hydration)
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items))
    } catch {
      // quota exceeded or private mode — silently ignore
    }
  }, [state.items, hydrated])

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (typeof document === 'undefined') return
    document.body.style.overflow = state.isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [state.isOpen])

  const addItem    = useCallback((item: CartItem) => dispatch({ type: 'ADD_ITEM', item }), [])
  const removeItem = useCallback((id: string)    => dispatch({ type: 'REMOVE_ITEM', id }), [])
  const clearCart  = useCallback(()              => dispatch({ type: 'CLEAR' }), [])
  const openCart   = useCallback(()              => dispatch({ type: 'OPEN' }), [])
  const closeCart  = useCallback(()              => dispatch({ type: 'CLOSE' }), [])
  const hasItem    = useCallback((id: string)    => state.items.some((i) => i.id === id), [state.items])

  const itemCount = state.items.length
  const subtotal  = useMemo(
    () => state.items.reduce((sum, i) => sum + i.priceUsd, 0),
    [state.items],
  )

  const value: CartContextValue = {
    items: state.items,
    isOpen: state.isOpen,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    clearCart,
    openCart,
    closeCart,
    hasItem,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
