import { Footer } from '@/components/custom/footer';
import { Header } from '@/components/custom/header';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
export default async function AdminLayout(
    { children }: { children: ReactNode }) {
    const supabase = await createClient();
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', authData.user.id)
            .single()
        if (error || !data) {
            console.log('error fetching user data' + error);
            return;
        }
        if (data.type !== 'ADMIN') return redirect('/auth')
    }

    return <>
        <Header></Header>
        <main className='min-h-[calc(100svh-128px)] py-3'>
            {children}
        </main>
        <Footer></Footer>
    </>

}