'use server'
import {
  CreateCategorySchema,
  CreateCategorySchemaServer,
  UpdateCategorySchema
} from '@/app/admin/categories/schema'
import { createClient } from '@/utils/supabase/server'
import { Category } from '@/utils/types/types'
import slugify from 'slugify'

export const getCategories = async (): Promise<Category[]> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select(
      `
      *,
      products:product(*)
    `
    )
    .returns<Category[]>()
  if (error) throw new Error('error fetching categories:' + error)
  return data || []
}

export const imageUploadHandler = async (
  formData: FormData
): Promise<string> => {
  const supabase = await createClient()
  const fileEntry = formData.get('file')
  if (!(fileEntry instanceof File)) throw new Error('expected a file')
  const fileName = fileEntry.name
  console.log(fileName)
  try {
    const { data, error } = await supabase.storage
      .from('app-images')
      .upload(fileName, fileEntry, { upsert: false })
    if (error) {
      console.log('error uploading image: ' + error)
      throw new Error('Error uploading image')
    }
    const {
      data: { publicUrl }
    } = await supabase.storage.from('app-images').getPublicUrl(fileName)
    return publicUrl
  } catch (error) {
    console.log('error uploading image: ' + error)
    throw new Error('Error uploading image')
  }
}

export const createCategory = async ({
  imageUrl,
  name
}: CreateCategorySchemaServer) => {
  const supabase = await createClient()
  const slug = slugify(name)
  const { data, error } = await supabase
    .from('categories')
    .insert({ imageUrl, name, slug })
  if (error) {
    console.log(error)

    throw new Error('error creating category:' + error)
  }
  return data
}

export const updateCategory = async ({
  imageUrl,
  name,
  slug
}: UpdateCategorySchema) => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .update({ name, imageUrl })
    .match({ slug })
  if (error) throw new Error('error updating category: ' + error)
  return data
}

export const deleteCategory = async ({ id }: { id: number }) => {
  const supabase = await createClient()
  const { error } = await supabase.from('categories').delete().match({ id })
  if (error) throw new Error('error deleting category: ' + error)
}
