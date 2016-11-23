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

const getText = (formatCount,
                 photosCount,
                 formatPhotosCount,
                 videosCount,
                 formatVideosCount,
                 loading,
                 formatLoading,
                 formatNoPhotos,
                 error) => {
  if (error) return error
  if (loading) return formatLoading()
  if (!photosCount && !videosCount) return formatNoPhotos()
  if (!photosCount) return formatVideosCount(videosCount)
  if (!videosCount) return formatPhotosCount(photosCount)
  return formatCount(photosCount, videosCount)
}

const Footer = ({
  style,
  photosCount,
  videosCount,
  loading,
  error,
  formatPhotosCount,
  formatVideosCount,
  formatCount,
  formatLoading,
  formatNoPhotos,
}) =>
  <Text style={[styles.container, style]} multiline>
    {getText(
      formatCount,
      photosCount,
      formatPhotosCount,
      videosCount,
      formatVideosCount,
      loading,
      formatLoading,
      formatNoPhotos,
      error,
    )}
  </Text>

Footer.propTypes = {
  style: View.propTypes.style,
  loading: PropTypes.bool,
  error: PropTypes.string,
  photosCount: PropTypes.number,
  videosCount: PropTypes.number,
  formatPhotosCount: PropTypes.func,
  formatVideosCount: PropTypes.func,
  formatCount: PropTypes.func,
  formatLoading: PropTypes.func,
  formatNoPhotos: PropTypes.func,
}

Footer.defaultPropTypes = {
}

export default Footer
