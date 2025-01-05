import { ActivityIndicator, FlatList, ImageStyle, Pressable, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native'
import { Link, Redirect } from 'expo-router'
import { getMyOrders } from '../../../actions/order'
import { Tables } from '../../../types/supabase.types'
import { format } from 'date-fns'

const Orders = () => {
  const { data: orders, isLoading, error } = getMyOrders()
  if (error) return <Text>error:{error.message}</Text>
  if (isLoading) return <ActivityIndicator />
  if (!orders?.length) {
    return <Text style={{
      fontSize: 20,
       textAlign: 'center',
       marginTop:10,
       }}>No Orders Created Yet</Text>
  }
  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }: { item: Tables<'orders'> }) =>
          <Link href={`/orders/${item.slug}`} asChild>
            <Pressable style={styles.orderContainer}>
              <View style={styles.orderContent}>
                <View style={styles.orderDetailsContainer}>
                  <Text style={styles.orderItem}>{item.slug}</Text>
                  <Text style={styles.orderDetails}>{item.description}</Text>
                  <Text style={styles.orderDate}>
                    {format(new Date(item.created_at), 'MMM dd, yyyy')}
                  </Text>
                </View>
                <View style={[styles.statusBadge,
                styles[`statusBadge_${item.status}`]
                ]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
            </Pressable>
          </Link>
        }
      />
    </View>
  )
}

export default Orders

const styles: { [key: string]: ViewStyle | TextStyle | ImageStyle } = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  orderContainer: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  orderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDetailsContainer: {
    flex: 1,
  },
  orderItem: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderDetails: {
    fontSize: 14,
    color: '#555',
  },
  orderDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
  },
  statusBadge_Pending: {
    backgroundColor: '#ffcc00',
  },
  statusBadge_Completed: {
    backgroundColor: '#4caf50',
  },
  statusBadge_Shipped: {
    backgroundColor: '#2196f3',
  },
  statusBadge_InTransit: {
    backgroundColor: '#ff9800',
  },
})