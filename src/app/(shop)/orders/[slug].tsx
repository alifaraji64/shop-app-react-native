import { Redirect, Stack, useLocalSearchParams } from 'expo-router'
import { FlatList, StyleSheet, Text, View, Image, ViewStyle, TextStyle, ImageStyle, ActivityIndicator } from 'react-native'
import { getOrderAndProducts } from '../../../actions/order';
import { format } from 'date-fns'
export default function orderDetail() {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const { data: order, error, isLoading } = getOrderAndProducts({ slug })
    if (isLoading) return <ActivityIndicator />




    if (!order || error) return <Text>error: {error?.message}</Text>
    const products = order.order_items.map(i => i.products)

    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: order.slug! }} />
            <Text style={styles.item}>{order.slug}</Text>
            <Text style={styles.details}>{order.description}</Text>
            <View style={[styles.statusBadge, styles[`statusBadge_${order.status}`]]}>
                <Text style={styles.statusText}>{order.status}</Text>
            </View>
            <Text style={styles.date}>
                {format(new Date(order.created_at), 'MMM dd, yyyy')}
            </Text>

            <Text style={styles.itemsTitle}>Items Ordered:</Text>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.orderItem}>
                        <Image style={styles.heroImage} source={{ uri: item.heroImage }} />
                        <View>
                            <Text style={styles.itemsTitle}>{item.title}</Text>
                            <Text style={styles.itemPrice}>Price: {item.price}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    )
}

const styles: { [key: string]: any } = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff'
    },
    item: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    details: {
        fontSize: 16,
        marginBottom: 16,
    },
    statusBadge: {
        padding: 8,
        borderRadius: 4,
        alignSelf:'flex-start'

    },
    statusBadge_Pending: {
        backgroundColor: 'orange',
    },
    statusBadge_Completed: {
        backgroundColor: 'green',
    },
    statusBadge_Shipped: {
        backgroundColor: 'blue',
    },
    statusBadge_InTransit: {
        backgroundColor: 'purple',
    },
    statusText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    date: {
        fontSize: 14,
        color: '#555',
        marginTop: 16
    },
    itemsTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 16,
        marginBottom: 8,
    },
    orderItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        padding: 16,
        backgroundColor: '#f8f8f8',
        borderRadius: 8,
    },
    heroImage: {
        width: '50%',
        height: 100,
        borderRadius: 10,
    },
    itemName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemPrice: {
        fontSize: 14,
        marginTop: 4,
    },
})