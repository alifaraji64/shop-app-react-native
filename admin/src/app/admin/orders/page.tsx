import { getOrdersWithProducts } from '@/actions/order'
import React from 'react'
import { Tables } from '@/utils/supabase/database.types'
import { log } from 'node:console'
import OrdersPageComponent from './page-component'

export default async function Order() {
  const ordersWithProducts = await getOrdersWithProducts()

  if (!ordersWithProducts || !ordersWithProducts.length) {
    return <div className='text-center font-bold text-2xl'>No Orders Created Yet</div>
  }

  return (
    <div><OrdersPageComponent ordersWithProducts={ordersWithProducts} /></div>
  )
}
