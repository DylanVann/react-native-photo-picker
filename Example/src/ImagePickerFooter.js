import React, { PropTypes } from 'react'
import { View, Text, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    paddingBottom: 30,
    paddingLeft: 5,
    paddingRight: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})

const getText = (photosCount, videosCount, loading, error) => {
  if (error) return error
  if (loading) return 'Loading photos...'
  if (!photosCount && !videosCount) return 'No photos.'
  if (!photosCount) return `${videosCount} Videos`
  if (!videosCount) return `${photosCount} Photos`
  return `${photosCount} Photos, ${videosCount} Videos`
}

const Footer = ({ style, photosCount, videosCount, loading, error }) =>
  <Text style={[styles.container, style]} multiline>
    {getText(photosCount, videosCount, loading, error)}
  </Text>

Footer.propTypes = {
  style: View.propTypes.style,
  loading: PropTypes.bool,
  error: PropTypes.string,
  photosCount: PropTypes.number,
  videosCount: PropTypes.number,
}

export default Footer
