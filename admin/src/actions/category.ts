'use server'
import { createClient } from '@/utils/supabase/server'
import { Category } from '@/utils/types/types'
const supabase = await createClient()
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .returns<Category[]>()
  if (error) throw new Error('error fetching categories:' + error)
  return data || []
}

export const imageUploadHandler = async (formData: FormData) => {
  if (!formData) return
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
