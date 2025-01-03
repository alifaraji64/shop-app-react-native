import { StyleSheet, Text, View, Image, Pressable } from 'react-native'

import { Link } from 'expo-router';
import { Tables } from '../types/supabase.types';

const ProductListItem: React.FC<{ product: Tables<'product'> }> = ({ product }) => {

    return (
        <Link asChild href={`/product/${product.slug}`} >
            <Pressable style={styles.item}>
                <View style={styles.itemImageContainer}>
                    <Image source={{ uri: product.heroImage}} style={styles.itemImage} />
                </View>
                <View style={styles.itemTextContainer}>
                    <Text style={styles.itemTitle}>{product.title}</Text>
                    <Text style={styles.itemPrice}>${product.price}</Text>
                </View>
            </Pressable>
        </Link>
    )
}

export default ProductListItem;

const styles = StyleSheet.create({
    item: {
        width: '48%',
        backgroundColor: 'white',
        marginVertical: 8,
        borderRadius: 10,
        overflow: 'hidden'
    },
    itemImageContainer: {
        borderRadius: 10,
        width: "100%",
        height: 150
    },
    itemImage: {
        width: '100%',
       height: '100%',
        resizeMode: 'cover',
    },
    itemTextContainer: {
        padding: 8,
        alignItems: 'flex-start',
        gap: 10
    },
    itemTitle: {
        fontSize: 16,
        color: '#888',
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
    },
})