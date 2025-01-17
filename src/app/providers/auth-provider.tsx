import { Session } from "@supabase/supabase-js";
import { createContext, PropsWithChildren, useContext, useEffect, useState } from "react";
import { supabase } from '../../lib/supabase'
import { Tables } from "../../types/supabase.types";

type AuthData = {
    session: Session | null;
    mounting: boolean;
    user: any;
};
const AuthContext = createContext<AuthData>({
    session: null,
    mounting: true,
    user: null
})

export default function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<Session | null>(null)
    const [mounting, setMounting] = useState(true);
    const [user, setUser] = useState<Tables<'users'> | null>(null);


    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session }, error } = await supabase.auth.getSession();
            if (session) {
                const { data: user, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('id', session.user.id)
                    .single()

                if (error) {
                    console.log(error);
                    return;
                }
                console.log('user');
                console.log(user);
                setUser(user)
            }
            setMounting(false)
        }
        fetchSession();
        supabase.auth.onAuthStateChange((event, session) => {

            setSession(session)
        })
    }, [])

    return (
        <AuthContext.Provider value={{ session, mounting, user }}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => useContext(AuthContext)