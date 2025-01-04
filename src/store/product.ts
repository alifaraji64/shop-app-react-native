import { create } from 'zustand'
import { Tables } from '../types/supabase.types'

type ProductStore = {
  storeProducts: Tables<'product'>[]
  setProducts: (products: Tables<'product'>[]) => void
  getProducts: () => Tables<'product'>[]
  categories: Tables<'categories'>[]
  setCategories: (products: Tables<'categories'>[]) => void
  getCategories: () => Tables<'categories'>[]
}

export const useProductStore = create<ProductStore>((set, get) => ({
  storeProducts: [],
  setProducts: (storeProducts: Tables<'product'>[]) => {
    set({ storeProducts })
  },
  getProducts: () => {
    const { storeProducts } = get()
    return storeProducts
  },
  categories: [],
  setCategories:(categories:Tables<'categories'>[])=>{
    set({categories})
  },
  getCategories:()=>{
    const {categories} = get();
    return categories;
  }
}))
