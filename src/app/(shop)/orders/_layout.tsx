import { Stack } from 'expo-router'
import { View, Text } from 'react-native'
import { useOrderSubscription } from '../../../lib/subscription'

export default function OrderLayout() {
    useOrderSubscription()
    return (
        <Stack>
            <Stack.Screen
                name='index'
                options={{ headerShown: false, title: 'orders' }}
            />
        </Stack>
    )
}