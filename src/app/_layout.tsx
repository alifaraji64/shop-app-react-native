import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import { ToastProvider } from 'react-native-toast-notifications'
import AuthProvider from './providers/auth-provider'
import QueryProvider from './providers/query-provider'

const RootLayout = () => {
    return (

        <ToastProvider>
            <AuthProvider>
                <QueryProvider>
                    <Stack>
                        <Stack.Screen
                            name='(shop)'
                            options={{ headerShown: false, title: 'shop' }}
                        />
                        <Stack.Screen
                            name='categories'
                            options={{ headerShown: true, title: 'categories' }}
                        />
                        <Stack.Screen
                            name='product'
                            options={{ headerShown: false, title: 'product' }}
                        />
                        <Stack.Screen
                            name='cart'
                            options={{ presentation: 'modal', title: 'shopping cart' }}
                        />
                        <Stack.Screen
                            name='auth'
                            options={{ headerShown: false }}
                        />
                        <Stack.Screen
                            name='404'
                            options={{ headerShown: true }}
                        />
                    </Stack>
                </QueryProvider>
            </AuthProvider>
        </ToastProvider>
    )
}

export default RootLayout