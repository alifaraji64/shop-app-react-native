import { Redirect, Stack, useLocalSearchParams } from 'expo-router'
import { FlatList, StyleSheet, Text, View, Image, ViewStyle, TextStyle, ImageStyle } from 'react-native'
import { getOneOrder, getProductsForOrder } from '../../../actions/order';
export default function orderDetail() {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const { data: order, isLoading, error } = getOneOrder({ slug })
    console.log('wooo');
    console.log(order);

    //const order = ORDERS.find(order => order.slug === slug)
    if (!order) return <Redirect href={'/404'} />
    const { data } = getProductsForOrder({ order_id: order.id.toString() })
    const products = data?.map(i=>i.product)
    console.log('bunnn');
    
    console.log(products);
    
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: order.slug! }} />
            {/* <Text style={styles.item}>{order.item}</Text> */}
            <Text style={styles.details}>{order.description}</Text>
            <View style={[styles.statusBadge, styles[`statusBadge_${order.status}`]]}>
                <Text style={styles.statusText}>{order.status}</Text>
            </View>
            <Text style={styles.date}>{order.created_at}</Text>
            <Text style={styles.itemsTitle}>Items Ordered:</Text>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.orderItem}>
                        <Image style={styles.heroImage} source={{uri:item.heroImage}} />
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
        backgroundColor: '#fff',
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
        alignSelf: 'flex-start',
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
        marginTop: 16,
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