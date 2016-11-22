import React from 'react'
import { StyleSheet } from 'react-native'
import NavBar from 'react-native-navbar'

const styles = StyleSheet.create({
  navBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#bbb',
  },
})

export default props => <NavBar style={[styles.navBar, props.style]} {...props} />
