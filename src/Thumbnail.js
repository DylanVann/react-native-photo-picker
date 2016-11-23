import React, { PropTypes } from 'react'
import {
  Image,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
} from 'react-native'

const styles = StyleSheet.create({
  thumbnail: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: 50,
    height: 50,
  },
  check: {
    position: 'absolute',
    top: 10,
    right: 10,
    left: undefined,
    bottom: undefined,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.4,
  },
  selected: {
    backgroundColor: 'red',
  },
})

const VideoOverlay = () =>
  <View style={styles.overlay}>
    <Image
      style={styles.video}
      source={require('./assets/video.png')}
    />
  </View>

const SelectedOverlay = () =>
  <View style={styles.overlay}>
    <View style={[styles.imageOverlay, styles.selected]} />
    <Image
      style={styles.check}
      source={require('./assets/check.png')}
    />
  </View>

const Thumbnail = ({
  uri,
  style,
  isVideo,
  selected,
  onPress,
  width,
  height,
}) =>
  <View style={[style, { width, height }]}>
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.thumbnail}>
        <Image
          source={{ uri, deliveryMode: 'opportunistic' }}
          resizeMode={Image.resizeMode.cover}
          style={[{ width, height }]}
        />
        { isVideo && <VideoOverlay /> }
        { selected && <SelectedOverlay /> }
      </View>
    </TouchableWithoutFeedback>
  </View>

Thumbnail.propTypes = {
  uri: PropTypes.string,
  style: View.propTypes.style,
  width: PropTypes.number,
  selected: PropTypes.bool,
  height: PropTypes.number,
  isVideo: PropTypes.bool,
  onPress: PropTypes.func,
}

export default Thumbnail