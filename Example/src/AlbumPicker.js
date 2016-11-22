import React from 'react'
import {
  View,
  ListView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native'
import MutableListView from './MutableListView'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  thumbnail: {
    width: 80,
    height: 80,
    margin: 10,
    backgroundColor: 'black'
  },
  imageGrid: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  rowTitle: { fontWeight: 'bold' },
  rowCount: {},
})

const Row = ({album, onSelected}) =>
  <TouchableOpacity style={styles.row} onPress={() => onSelected(album)}>
    <Image
      source={{
        uri: album.previewAssets[0].uri,
        deliveryMode: 'opportunistic'
      }}
      style={styles.thumbnail}
    />
    <View style={styles.textContainer}>
      <Text style={styles.rowTitle}>{album.title}</Text>
      <Text style={styles.rowCount}>{album.assetCount}</Text>
    </View>
  </TouchableOpacity>

const AlbumPicker = ({ onCancelled, albums, onSelected, renderAlbumNavBar }) =>
  <View style={styles.container}>
    { renderAlbumNavBar({ onCancelled }) }
    <MutableListView
      style={styles.container}
      contentContainerStyle={styles.imageGrid}
      data={albums}
      enableEmptySections
      renderRow={(album) =>
        <Row album={album} onSelected={onSelected} />
      }
    />
  </View>

export default AlbumPicker

