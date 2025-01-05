import { useQuery } from '@tanstack/react-query'
import { useAuth } from '../app/providers/auth-provider'
import { supabase } from '../lib/supabase'

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
      return data;
    }
  })
}
