"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache";

export const getOrdersWithProducts = async () => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('orders')
        .select(`*, 
        order_items:order_items(*,product:product(*))
        , user:user(*)`)
        .order('created_at', { ascending: false })
    if (error) throw new Error('error while fetching the orderswithproduct ' + error.message)
    return data;
}

export const updateOrderStatus = async (orderId: number, status: string) => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from('orders')
        .update({ status,description:'dddd' })
        .eq('id', orderId)
    if (error) throw new Error('error while fetching the orderswithproduct ' + error.message)
    revalidatePath('/admin/orders')


}