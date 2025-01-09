import { useEffect } from "react"
import { supabase } from "./supabase"
import { useQueryClient } from "@tanstack/react-query"

export const useOrderSubscription = () => {
    const queryClient = useQueryClient();
    useEffect(() => {
        const channels = supabase.channel('custom-insert-channel')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'orders' },
                (payload) => {
                    console.log('Change received!', payload.new)
                    queryClient.invalidateQueries({ queryKey: ['orders', 'productsForOrder'] })
                }
            )
            .subscribe()

            return()=>{
                channels.unsubscribe()
            }
    }, [])

}