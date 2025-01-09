import { QueryData } from "@supabase/supabase-js"
import { createClient } from "../supabase/client"

export type Product = {
  created_at: string
  id: number
  title: string
  slug: string
  imagesUrl: string[]
  price: number
  heroImage: string
  category: Category
  maxQty: number
}
export type ProductUpdate = {
  title: string
  slug: string | undefined
  imagesUrl: string[]
  price: number
  heroImage: string
  category: number
  maxQuantity: number
}

export type Category = {
  created_at: string
  id: number
  name: string
  imageUrl: string
  slug: string
  products: Product[] | null
}

export const validImageTypes = ['image/png', 'image/jpeg']

const supabase = createClient();
const ordersWithProductsQuery = supabase
  .from('orders')
  .select(`*, 
order_items:order_items(*,product:product(*))
, user:user(*)`)
  .order('created_at', { ascending: false })

export type OrdersWithProducts = QueryData<typeof ordersWithProductsQuery>