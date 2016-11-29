import React from 'react'
import {
  StyleSheet,
  View,
} from 'react-native'
import ImagePickerModal from 'react-native-photo-picker'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
})

export default () =>
  <View style={styles.container}>
    <ImagePickerModal visible onCancelled={Function.prototype} onCompleted={Function.prototype} />
  </View>
