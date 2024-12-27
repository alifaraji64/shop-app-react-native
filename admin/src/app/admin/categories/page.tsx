import { getCategories } from '@/actions/getCategories'
import { Database } from '@/utils/supabase/database.types'
import { createClient } from '@/utils/supabase/server'
import React from 'react'

export default async function Categories() {
    const categories = await getCategories()
    console.log('categories');
    console.log(categories);


    return (
        <>Categories</>
    )
}
