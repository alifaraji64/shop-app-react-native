import { Stack } from 'expo-router'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

export default function ProductLayout() {
    return (
        <Stack>
            <Stack.Screen
                name='[slug]'
                options={({ navigation }) => ({
                    headerShown: false, headerLeft: () => (
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Ionicons></Ionicons>
                        </TouchableOpacity>
                    )

                })} />
        </Stack>
    )
}

const styles = StyleSheet.create({})