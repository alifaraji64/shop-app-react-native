import { create } from 'zustand'
import { useProductStore } from './product'

export type CartItemType = {
  id: number
  title: string
  image: any
  price: number
  qty: number
}
type CartState = {
  items: CartItemType[]
  addItem: (item: CartItemType) => void
  removeItem: (id: number) => void
  incrementItem: (id: number) => void
  decrementItem: (id: number) => void
  getTotalPrice: () => string
  getItemCount: () => number
  clearItems: () => void
}

const initialCartItems: CartItemType[] = []
export const useCartStore = create<CartState>((set, get) => ({
  items: initialCartItems,
  addItem: (item: CartItemType) => {
    const existingItem = get().items.find(i => i.id === item.id)
    if (existingItem) {
      set(state => ({
        items: state.items.map(i => {
          return {
            ...i,
            qty: item.qty
          }
        })
      }))
    } else {
      set(state => ({
        items: [...state.items, item]
      }))
    }
  },
  removeItem: (id: number) => {
    set(state => ({
      items: state.items.filter(i => i.id !== id)
    }))
  },
  incrementItem: (id: number) => {
    const products = useProductStore.getState().storeProducts
    set(state => {
      const product = products.find(p => p.id === id)
      if (!product) return state
      return {
        items: state.items.map(i =>
          i.id == id && i.qty < product.maxQty
            ? {
              ...i,
              qty: i.qty + 1
            }
            : i
        )
      }
    })
  },
  decrementItem: (id: number) => {
    set(state => ({
      items: state.items.map(i =>
        i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i
      )
    }))
  },
  getTotalPrice: () => {
    const { items } = get()
    return items
      .reduce((total, item) => total + item.qty * item.price, 0)
      .toFixed()
  },
  getItemCount: () => {
    const { items } = get()
    return items.reduce((count, item) => count + item.qty, 0)
  },
  clearItems: () => {
    set(state => {
      return { items: [] }
    })
  }
}))
