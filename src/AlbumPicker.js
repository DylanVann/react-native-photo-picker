import React, { PropTypes } from 'react'
import {
  View,
  StyleSheet,
} from 'react-native'
import MutableListView from './MutableListView'
import Row from './AlbumPickerRow'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
})

const AlbumPicker = ({ albums, onSelected, renderAlbumNavBar, allPhotosTitle, ...otherProps }) =>
  <View style={styles.container}>
    { renderAlbumNavBar({ ...otherProps }) }
    <MutableListView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      data={albums}
      enableEmptySections
      renderRow={album =>
        <Row
          uri={album.previewAssets[0].uri}
          onPress={() => onSelected(album)}
          count={album.assetCount}
          title={album.title || allPhotosTitle}
        />
      }
    />
  </View>

AlbumPicker.propTypes = {
  albums: PropTypes.array,
  onSelected: PropTypes.func,
  renderAlbumNavBar: PropTypes.func,
  allPhotosTitle: PropTypes.string,
}

export default AlbumPicker
