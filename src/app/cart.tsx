import { Image, Alert, FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useCartStore } from '../store/cart-store'
import { StatusBar } from 'expo-status-bar';
import { createOrder, createOrderItem } from '../actions/order';
import { useToast } from 'react-native-toast-notifications';
import { Redirect, useRouter } from 'expo-router';

export default function Cart() {
  const router = useRouter()

  const toast = useToast()
  const { items,
    removeItem,
    incrementItem,
    decrementItem,
    getTotalPrice, clearItems } = useCartStore();

  const { mutateAsync: createSupabaseOrder } = createOrder()
  const { mutateAsync: createSupabaseOrderItem } = createOrderItem()
  const handleCheckout = async () => {
    await createSupabaseOrder
      (
        { totalPrice: parseFloat(getTotalPrice()) },
        {
          onSuccess: async (data) => {
            console.log('newly created order');

            console.log(data);
            await createSupabaseOrderItem(
              items.map(item => ({
                orderId: data!.id,
                productId: item.id,
                quantity: item.qty
              }
              )
              ), {
              onSuccess: (data) => {
                console.log('order item created');
                console.log(data);
                clearItems();
                toast.show('saved card items successfully',
                  { type: 'success', placement: 'top' })
                  router.replace('/')
              }
            }
            )

          }
        }
      )
  }

  type CartItemType = {
    id: number;
    title: string;
    image: any;
    price: number;
    qty: number;
  }
  type CartItemProps = {
    item: CartItemType;
    onRemove: (id: number) => void;
    onIncrement: (id: number) => void;
    onDecrement: (id: number) => void;
  }
  const CartItem = ({ item, onRemove, onIncrement, onDecrement }:
    CartItemProps) => {

    return <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={styles.itemDetails}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        <Text style={styles.itemPrice}>{item.price.toFixed(2)}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            onPress={() => onDecrement(item.id)}
            style={styles.quantityButton}>
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          <Text>{item.qty}</Text>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onIncrement(item.id)}>
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => onRemove(item.id)}
      >
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  }
  return (
    <View style={styles.container}>
      <StatusBar style={Platform.OS === 'android' ? 'dark' : 'auto'} />
      <FlatList
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <CartItem
          item={item}
          onIncrement={incrementItem}
          onDecrement={decrementItem}
          onRemove={removeItem}
        />}
        contentContainerStyle={styles.cartList}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ${getTotalPrice()}</Text>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  cartList: {
    paddingVertical: 16,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 16,
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    color: '#888',
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    padding: 8,
    backgroundColor: '#ff5252',
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  footer: {
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 16,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: '#28a745',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
})