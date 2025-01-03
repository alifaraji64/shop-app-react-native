import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import { PRODUCTS } from '../../../assets/products'
import ProductListItem from '../../components/product-list-item'
import ListHeader from '../../components/list-header'
import { useAuth } from '../providers/auth-provider'
import { Redirect } from 'expo-router'
import { getProductsAndCategories } from '../../actions/category'
import { useProductStore } from '../../store/product'
import { useEffect } from 'react'

const index = () => {
  const { data, error, isLoading } = getProductsAndCategories()

  const { session, mounting, user } = useAuth();
  const { setProducts, products } = useProductStore((state) => ({
    setProducts: state.setProducts,
    products: state.storeProducts,
  }));

  // UseEffect for Zustand Store Update
  useEffect(() => {
    if (data?.products) {
      // Only update the Zustand store if the data is different
      const isDataDifferent = !products || products.length === 0 || !products.every((product, index) => product.id === data.products[index]?.id);

      if (isDataDifferent) {
        setProducts(data.products);
      }
    }
  }, [data?.products, setProducts, products]);

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