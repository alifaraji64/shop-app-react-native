import { View, Text, StyleSheet } from 'react-native'
import { Tabs } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { FontAwesome } from '@expo/vector-icons'

const TabBarIcon = (props: {
    name: React.ComponentProps<typeof FontAwesome>['name'];
    color: string
}) => { return <FontAwesome size={24} {...props} style={{ color: '#1BC464' }} /> }

const TabsLayout = () => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <Tabs screenOptions={{
                tabBarActiveTintColor: '#1BC464',
                tabBarInactiveTintColor: 'gray',
                tabBarLabelStyle: { fontSize: 16 },
                tabBarStyle: {
                    height: 60,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20
                },
                headerShown: false
            }}>

                <Tabs.Screen
                    name='index'
                    options={{
                        title: 'shop', tabBarIcon: (props) => {
                            return <TabBarIcon {...props} name='shopping-cart' />
                        }
                    }} />
                <Tabs.Screen
                    name='orders'
                    options={{
                        headerShown: false, tabBarIcon: (props) => {
                            return <TabBarIcon {...props} name='book' />
                        }
                    }} />
            </Tabs>
        </SafeAreaView>
    )
}

export default TabsLayout

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    }
})