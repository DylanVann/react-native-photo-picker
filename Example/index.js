/* @flow */

import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native'
import ImagePickerModal from './src/ImagePickerModal'

export default class Example extends Component {
  render() {
    return (
      <View style={styles.container}>
        <ImagePickerModal visible onCancelled={Function.prototype} onCompleted={Function.prototype} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
})

AppRegistry.registerComponent('Example', () => Example)
