'use server'
import { createClient } from '@/utils/supabase/server'
import { Category } from '@/utils/types/types'

export const getCategories = async (): Promise<Category[]> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .returns<Category[]>()
  if (error) throw new Error('error fetching categories:' + error)
  return data || []
}
