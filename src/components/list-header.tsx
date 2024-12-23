import { StyleSheet, Text, View, Image, Pressable, TouchableOpacity, FlatList } from 'react-native'
import { FontAwesome } from '@expo/vector-icons'
import { Link, Redirect } from 'expo-router'
import { CATEGORIES } from '../../assets/categories'
import { useCartStore } from '../store/cart-store'
import { supabase } from '../lib/supabase'
export default function ListHeader() {
    const {getItemCount} = useCartStore()
    const handleSignOut = async()=>{

        const {error} = await supabase.auth.signOut()
        if(!error) <Redirect href={'/auth'} />
    }
    return (

        <View>
            <View style={styles.headerTop}>
                <View style={styles.headerLeft}>
                    <View
                        style={styles.avatarImage}
                    />
                    <Text>Hello codewithali</Text>
                </View>
                <View style={styles.headerRight}>
                    <Link href='/cart' asChild>
                        <Pressable>
                            {({ pressed }) =>
                                <View style={styles.headerRight}>
                                    <FontAwesome
                                        name='shopping-cart'
                                        size={25}
                                        color='gray'
                                        style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                                    />
                                    <View style={styles.badgeContainer}>
                                        <Text style={styles.badgeText}>{getItemCount()}</Text>
                                    </View>
                                </View>}
                        </Pressable>
                    </Link>
                    <TouchableOpacity onPress={handleSignOut}>
                        <FontAwesome name='sign-out' size={25} color='red' />
                    </TouchableOpacity>
                </View>

            </View>
            <View style={styles.heroContainer}>
                <Image style={styles.heroImage} source={require('../../assets/images/hero.png')} />
            </View>
            <View style={styles.categoriesContainer}>
                <Text style={styles.categoryText}>Categories</Text>
                <FlatList
                    data={CATEGORIES}
                    renderItem={({ item }) => (
                        <Link asChild
                            href={`/categories/${item.slug}`}>
                            <Pressable style={styles.category}>
                                <Image style={{ width: 60, height: 60, borderRadius: 100 }}
                                    source={{ uri: item.imageUrl }} />
                                <Text>{item.slug}</Text>
                            </Pressable>
                        </Link>
                    )}
                    keyExtractor={item => item.name}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.flatListContent}></FlatList>
            </View>
        </View>

    )
}

const styles = StyleSheet.create({
    categoryText: {
        fontSize: 25,
        fontWeight: 700,
        paddingBottom: 5
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    categoriesContainer: {
        paddingVertical: 5
    },
    heroContainer: {
        width: '100%',
        height: 200,
        marginVertical: 10
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        backgroundColor: 'gray'
    },
    heroImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10
    },
    flatListContent: {
        flex: 1,
        justifyContent: 'space-between',
        overflow: 'scroll'
    },
    category: {
        width: 100
    },
    badgeContainer: {
        position: 'absolute',
        top: -5,
        right: 10,
        backgroundColor: '#1BC464',
        borderRadius: 10,
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    }

})