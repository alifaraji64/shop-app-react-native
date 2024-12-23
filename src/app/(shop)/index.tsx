import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native'
import { PRODUCTS } from '../../../assets/products'
import ProductListItem from '../../components/product-list-item'
import ListHeader from '../../components/list-header'
import { useAuth } from '../providers/auth-provider'
import { Redirect } from 'expo-router'

const index = () => {
  const { session, mounting, user } = useAuth();
  console.log(mounting);

  if (mounting) return <ActivityIndicator />
  if (session == null) return <Redirect href={'/auth'} />
  if(session){
    console.log(session.user.id);

  }
  return (
    <View>
      <FlatList
        data={PRODUCTS}
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