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
