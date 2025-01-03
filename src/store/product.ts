import { create } from 'zustand'
import { Tables } from '../types/supabase.types'

interface ProductStore {
  storeProducts: Tables<'product'>[]
  setProducts: (products: Tables<'product'>[]) => void
  getProducts:()=>(Tables<'product'>[])
}

export const useProductStore = create<ProductStore>((set, get) => ({
  storeProducts: [],
  setProducts: (storeProducts: Tables<'product'>[]) => {
    console.log('test');
    
    console.log(storeProducts);
    
    set({ storeProducts })
  },
  getProducts:()=>{
    const {storeProducts} = get()
    return storeProducts;
  }
}))
