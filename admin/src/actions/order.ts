"use server"

import { createClient } from "@/utils/supabase/server"

export const getOrders = async()=>{
    const supabase = await createClient();
    //const {data,error} = await supabase.from('')
}