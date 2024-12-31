'use server'

import { Product, ProductUpdate } from '@/utils/types/types'
import { createClient } from '@/utils/supabase/server'
import slugify from 'slugify'
import { CreateProductSchemaServer } from '@/app/admin/products/schema'

export const getProductsWithCategories = async (): Promise<Product[]> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('product')
    .select('*,category:category(*)')
    .returns<Product[]>()
  if (error) throw new Error('error fetching product' + error)

  return data
}

export const createProduct = async ({
  category,
  heroImage,
  images,
  maxQuantity,
  price,
  title
}: CreateProductSchemaServer) => {
  const supabase = await createClient()
  const slug = slugify(title)
  const { data, error } = await supabase.from('product').insert({
    category,
    heroImage,
    imagesUrl: images,
    maxQty: maxQuantity,
    price,
    title,
    slug
  })
  if (error) throw new Error('error creating product' + error)

  return data
}

export const updateProduct = async ({
  heroImage,
  category,
  imagesUrl,
  price,
  title,
  slug,
  maxQuantity
}: ProductUpdate) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('product')
    .update({
      category,
      heroImage,
      imagesUrl,
      maxQty: maxQuantity,
      price,
      title,
      slug
    })
    .match({ slug })
  if (error) throw new Error('error updating product' + error)
  return data
}

export const deleteProduct = async (id: number) => {
  const supabase = await createClient()
  const { data, error } = await supabase.from('product').delete().match({ id })
  if (error) throw new Error('error deleting product' + error)
  return data
}
