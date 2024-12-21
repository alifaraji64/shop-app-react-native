import { View, Text } from 'react-native'
import { Stack } from 'expo-router'

const RootLayout = () => {
    return (
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
                options={{ headerShown: true, title: 'product' }}
            />
            <Stack.Screen
                name='cart'
                options={{ presentation: 'modal', title: 'shopping cart' }}
            />
            <Stack.Screen
                name='auth'
                options={{ headerShown: true }}
            />
        </Stack>
    )
}

export default RootLayout