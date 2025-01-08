import { Redirect, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native'
import { useToast } from 'react-native-toast-notifications';
import { PRODUCTS } from '../../../assets/products';
import { useCartStore } from '../../store/cart-store';
import { useState } from 'react';
import { useProductStore } from '../../store/product';

export default function ProductDetails() {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const toast = useToast();
    const { getProducts } = useProductStore()
    const products = getProducts();




    const product = products.find(p => p.slug === slug);

    if (!product) return <Redirect href={'/404'} />

    const { items, addItem, incrementItem, decrementItem } = useCartStore()
    //if that item is already in the cart we will show the qty of it from the store
    //but if it is not in the cart then the qty will be 1
    const cartItem = items.find(item => item.id === product.id)
    const [qty, setQty] = useState(cartItem ? cartItem.qty : 1);
    const totalPrice = (product.price * qty).toFixed(2)
    const increaseQty = () => {
        if (qty < product.maxQty) setQty(qty + 1)
        else
            toast.show('we are out of stock for this amount',
                { type: 'warning', placement: 'top' }
            )

    }

    const decreaseQty = () => {
        if (qty >= 1) setQty(qty - 1)
        else
            toast.show('minimum number is 1',
                { type: 'warning', placement: 'top' }
            )
    }

    const addToCart = () => {
        console.log('iiii');

        console.log(product.heroImage);

        addItem({
            id: product.id,
            image: product.heroImage,
            price: product.price,
            qty: qty,
            title: product.title
        })
        toast.show(`${qty} ${qty == 1 ? 'item' : 'items'} added successfully to your cart`,
            { type: 'success', placement: 'top' }
        )
        console.log(items);

    }
    return (
        <View style={styles.container}>
            <Stack.Screen options={{ title: slug, headerTitleAlign: 'center' }} />
            <Image style={styles.heroImage} source={{ uri: product.heroImage }} />
            <View style={{ flex: 1, padding: 12 }}>
                <Text>Title: {product.title}</Text>
                <Text>Slug: {slug}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                    <Text style={styles.price}>Unit Price: ${product.price}</Text>
                    <Text style={styles.price}>Total Price: ${totalPrice}</Text>
                </View>
                <FlatList
                    data={product.imagesUrl}
                    renderItem={({ item }) => <Image
                        source={{ uri: item }}
                        style={styles.image}
                    />
                    }
                    horizontal
                    contentContainerStyle={styles.imagesContainer}
                />
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[
                            styles.quantityButton,
                            { opacity: qty <= 1 ? 0.5 : 1 }
                        ]}
                        disabled={qty <= 1}
                        onPress={decreaseQty}
                    >
                        <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>

                    <Text>{qty}</Text>

                    <TouchableOpacity
                        style={[
                            styles.quantityButton,
                            { opacity: qty >= product.maxQty ? 0.5 : 1 }
                        ]}
                        disabled={qty >= product.maxQty}
                        onPress={increaseQty}
                    >
                        <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={addToCart}
                        style={[
                            styles.addToCartButton,
                            { opacity: qty === 0 ? 0.5 : 1 }
                        ]}
                        disabled={product.maxQty == 0}
                    >

                        <Text style={styles.addToCartText}>Add to Cart</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    heroImage: {
        width: '100%',
        height: 250,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 8,
    },
    slug: {
        fontSize: 18,
        color: '#555',
        marginBottom: 16,
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    price: {
        fontWeight: 'bold',
        color: '#000',
    },

    imagesContainer: {
        marginBottom: 16,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 8,
        borderRadius: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 16,
    },
    quantityButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#007bff',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    quantityButtonText: {
        fontSize: 24,
        color: '#fff',
    },
    quantity: {
        fontSize: 18,
        fontWeight: 'bold',
        marginHorizontal: 16,
    },
    addToCartButton: {
        flex: 1,
        backgroundColor: '#28a745',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 8,
    },
    addToCartText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    errorMessage: {
        fontSize: 18,
        color: '#f00',
        textAlign: 'center',
        marginTop: 20,
    },
})