import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import { PRODUCTS } from '../../../assets/products'
import ProductListItem from '../../components/product-list-item'
import ListHeader from '../../components/list-header'
import { useAuth } from '../providers/auth-provider'
import { Redirect } from 'expo-router'
import { getProductsAndCategories } from '../../actions/category'
import { useProductStore } from '../../store/product'
import { useEffect } from 'react'
import { useShallow } from 'zustand/shallow';

const index = () => {
  const { data, error, isLoading } = getProductsAndCategories()

  const { session, mounting, user } = useAuth();
  const { setProducts, setCategories } = useProductStore(useShallow(
    (state) => ({
      setProducts: state.setProducts,
      setCategories: state.setCategories
    })) // Use shallow comparison here
  );
  // UseEffect for Zustand Store Update
  useEffect(() => {
    if (data?.products && data?.categories) {
      setProducts(data.products)
      setCategories(data.categories)
    }
  }, [data?.products, data?.categories]);

  if (mounting || isLoading) return <ActivityIndicator />
  if (error || !data) return <Text>error:{error?.message}</Text>
  if (session == null) return <Redirect href={'/auth'} />


  return (
    <View>
      <FlatList
        data={data?.products || []}
        renderItem={({ item }) => <ProductListItem product={item} ></ProductListItem>}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.flatListContent}
        columnWrapperStyle={styles.flatListColumn}
        style={{ paddingHorizontal: 10, paddingVertical: 5 }}
      />
    </View>
  )
}

export default index

const styles = StyleSheet.create({
  flatListContent: {
  },
  flatListColumn: {
    justifyContent: 'space-between'
  }
})