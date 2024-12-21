import { Stack } from 'expo-router'
import { View, Text } from 'react-native'

export default function OrderLayout() {
    return (
        <Stack>
            <Stack.Screen
                name='index'
                options={{ headerShown: false, title: 'orders' }}
            />
        </Stack>
    )
}