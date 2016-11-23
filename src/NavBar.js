import React from 'react'
import { StyleSheet, View } from 'react-native'
import NavBar from 'react-native-navbar'

const styles = StyleSheet.create({
  navBar: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#bbb',
  },
})

const StyledNavBar = ({ style, ...otherProps }) =>
  <NavBar style={[styles.navBar, style]} {...otherProps} />

StyledNavBar.propTypes = {
  style: View.propTypes.style,
}

export default StyledNavBar
