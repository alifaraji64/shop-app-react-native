export type Product = {
  created_at: string
  id: number
  title: string
  slug: string
  imagesUrl: string[]
  price: number
  heroImage: string
  category: number
  maxQuantity: number
}

export type Category = {
  created_at: string
  id: string
  name: string
  imageUrl: string
  slug: string
  products: Product[]
}
