import { Platform, StatusBar, StyleSheet, Text, View } from 'react-native'

export default function notFound() {
  return (
    <View>
      <StatusBar />
      <Text>404. page not found</Text>
    </View>
  )
}

const styles = StyleSheet.create({})