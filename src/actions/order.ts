import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../app/providers/auth-provider'
import { supabase } from '../lib/supabase'
import { ifError } from 'assert'
import { Tables } from '../types/supabase.types'
import { nanoid } from 'nanoid'

const generateOrderSlug = () => {
  const randomString = nanoid(4)
  const timestamp = new Date().getTime()
  return `order-${randomString}-${timestamp}`
}
export const getMyOrders = () => {
  const {
    user: { id }
  } = useAuth()
  return useQuery({
    queryKey: ['orders', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .eq('user', id)
      if (error) {
        throw new Error('error fetching the orders' + error.message)
      }
      return data
    }
  })
}

export const createOrder = () => {
  const queryClient = useQueryClient()
  const {
    user: { id }
  } = useAuth()
  return useMutation({
    mutationFn: async ({
      totalPrice
    }: {
      totalPrice: number
    }): Promise<Tables<'orders'> | null> => {
      const { data, error } = await supabase.from('orders').insert({
        slug: generateOrderSlug(),
        status: 'Pending',
        totalPrice,
        user: id
      } as Tables<'orders'>)
      .select()
      .single()
      if (error) {
        throw new Error('error fetching the orders' + error.message)
      }
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: 'orders' })
    }
  })
}

export const createOrderItem = () => {
  return useMutation({
    mutationFn: async(
      items: {
        orderId: number
        productId: number
        quantity: number
      }[]
    ) =>{
      const { data, error } = await supabase
        .from('order_items')
        .insert(
          items.map(({ orderId, productId, quantity }) => ({
            order_id: orderId,
            product_id: productId,
            quantity
          }))
        )
        .select('*, products:product(*)')
      if (error) {
        throw new Error('error fetching the orders' + error.message)
      }
      return data
    }
  })
}
