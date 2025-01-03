import { create } from 'zustand'
import { Tables } from '../types/supabase.types'

interface ProductStore {
  storeProducts: Tables<'product'>[]
  setProducts: (products: Tables<'product'>[]) => void
}

export const useProductStore = create<ProductStore>((set, get) => ({
  storeProducts: [],
  setProducts: (storeProducts: Tables<'product'>[]) => set({ storeProducts })
}))
