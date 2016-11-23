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

const getText = ({
  photosCount,
  videosCount,
  loading,
  error,
  strings
}) => {
  if (error) return error
  if (loading) return strings.loading()
  if (!photosCount && !videosCount) return strings.noPhotos()
  if (!photosCount) return strings.countVideos(videosCount)
  if (!videosCount) return strings.countPhotos(photosCount)
  return strings.count(photosCount, videosCount)
}

const Footer = ({
  style,
  photosCount,
  videosCount,
  loading,
  error,
  strings,
}) =>
  <Text style={[styles.container, style]} multiline>
    {getText({
      photosCount,
      loading,
      error,
      strings,
    })}
  </Text>

Footer.propTypes = {
  style: View.propTypes.style,
  loading: PropTypes.bool,
  error: PropTypes.string,
  photosCount: PropTypes.number,
  strings: PropTypes.object,
}

export default Footer
