import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'

export const getProductsAndCategories = () => {
  return useQuery({
    queryKey: ['products', 'categories'],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const [products, categories] = await Promise.all([
        supabase.from('product').select('*').gt('maxQty',0),
        supabase.from('categories').select('*')
      ])
      if (products.error || categories.error) {
        throw new Error('error while fetching categories and products')
      }
      return { products: products.data, categories: categories.data }
    }
  })
}
