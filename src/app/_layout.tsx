import { View, Text } from 'react-native'
import { Stack } from 'expo-router'
import { ToastProvider } from 'react-native-toast-notifications'
import AuthProvider from './providers/auth-provider'

const RootLayout = () => {
    return (

        <ToastProvider>
            <AuthProvider>
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
            </AuthProvider>
        </ToastProvider>
    )
}

export default RootLayout