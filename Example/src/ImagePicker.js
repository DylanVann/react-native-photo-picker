import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  ListView,
  Dimensions,
  Platform,
} from 'react-native'
import PhotosFramework from 'react-native-photos-framework'
import moment from 'moment'
import { List, Map } from 'immutable'

import Thumbnail from './Thumbnail'
import Header from './ImagePickerSectionHeader'
import Footer from './ImagePickerFooter'
import AlbumPickerModal from './AlbumPickerModal'
import getSectionHeader from './getSectionHeader'
import MutableListView from './MutableListView'
import ImagePickerNavBar from './ImagePickerNavBar'
import AlbumPickerNavBar from './AlbumPickerNavBar'

const margin = 2

const imageStyle = {
  margin,
  backgroundColor: '#eee',
  overflow: 'hidden',
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  image: {
    ...imageStyle,
  },
  imageRight: {
    ...imageStyle,
    marginRight: 0,
  },
  imageLeft: {
    ...imageStyle,
    marginLeft: 0,
  },
})

class ImagePicker extends Component {
  constructor(props) {
    super(props)
    this.endCursor = 0
    this.fetchedAll = false
    this.images = new List()
    this.sections = {}
    this.selectedImages = new Map()
    this.imagesPerRow = props.imagesPerRow
    this.getPhotos()
    this.getAlbums()
    this.state = {
      fetching: true,
      albumPickerVisible: false,
      albums: undefined,
      albumTitle: '',
      sections: {},
      selectedCount: 0,
      photosCount: 0,
      videosCount: 0,
    }
  }

  componentDidMount() {
    this.mounted = true
    PhotosFramework.requestAuthorization().then((statusObj) => {
      if(statusObj.isAuthorized) {
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false
  }

  onPhotosFetchedSuccess = (data) => {
    const start = Date.now()
    const newImages = data.assets.map((asset) => {
      const type = asset.mediaType
      // const image = node.image
      const uri = asset.uri
      // Asset types from iOS.
      // const isIOSAsset = [photoType, videoType].includes(type)
      // const mimeType = isIOSAsset ? getIOSMime(uri) : type
      // const fileName = image.filename
      const isVideo = type === 'video'
      const timeStamp = asset.creationDate * 1000
      // Android includes source for videos.
      const source = asset.source
      return {
        ...asset,
        uri,
        timeStamp,
        isVideo,
      }
    })
    this.images = this.images.concat(newImages)

    for (let i = 0; i < newImages.length; i++) {
      const image = newImages[i]
      const sectionTitle = getSectionHeader(moment(image.timeStamp))
      this.sections[sectionTitle] = this.sections[sectionTitle]
        ? this.sections[sectionTitle].concat(image)
        : [image]
    }

    const photosCount = this.images.filter(image => !image.isVideo).size
    const videosCount = this.images.filter(image => image.isVideo).size

    const imagesPerFetch = this.props.imagesPerRow * this.props.rowsPerFetch;
    if (data.assets.length < imagesPerFetch) this.fetchedAll = true
    else this.endCursor += data.assets.length

    this.fetching = false
    this.setState({
      fetching: false,
      sections: {...this.sections},
      photosCount,
      videosCount,
    })
  }

  onPhotosFetchError = (error) => {
    this.setState({
      error: error.toString(),
    })
  }

  onAlbumSelected = (album) => {
    this.images = this.images.clear()
    this.sections = {}
    this.album = album
    this.fetchedAll = false
    this.fetching = false
    this.endCursor = 0
    this.getPhotos()
    this.setState({
      fetching: true,
      albumPickerVisible: false,
      albumTitle: album.title,
      sections: {},
      selectedCount: 0,
      photosCount: 0,
      videosCount: 0,
    })
  }

  onAlbumSelectionStarted = () => {
    this.setState({
      albumPickerVisible: true,
    })
  }

  onAlbumSelectionCancelled = () => {
    this.setState({
      albumPickerVisible: false,
    })
  }

  getImageDimensions = () => {
    const { width } = Dimensions.get('window')
    const { imagesPerRow } = this.props
    const imageSize = (width - (margin*2*(imagesPerRow-1))) / imagesPerRow
    return {
      width: imageSize,
      height: imageSize,
    }
  }

  getAlbum = () => {
    this.fetchingAlbum = true
    this.mounted && this.setState({
      fetching: true,
    })
    PhotosFramework.getAlbums([{
      type: 'smartAlbum',
      subType: 'smartAlbumUserLibrary',
      previewAssets: 1,
      prepareForSizeDisplay: this.getImageDimensions(),
      preCacheAssets: true,
      fetchOptions: {
        includeHiddenAssets: true,
        includeAllBurstAssets: false,
      },
    }])
    .then((res) => {
      this.album = res.albums[0]
      this.fetchingAlbum = false
      this.getPhotos()
      this.setState({
        albumTitle: this.album.title,
      })
    })
  }

  getAlbums = () => {
    PhotosFramework.getAlbumsMany([
      {
        type: 'smartAlbum',
        subType: 'any',
        assetCount: 'exact',
        previewAssets: 1,
        prepareForSizeDisplay: this.getImageDimensions(),
        preCacheAssets: true,
        fetchOptions: {
          includeHiddenAssets: true,
          includeAllBurstAssets: false,
        },
      },
      {
        type: 'album',
        subType: 'any',
        assetCount: 'exact',
        previewAssets: 1,
        prepareForSizeDisplay: this.getImageDimensions(),
        preCacheAssets: true,
        fetchOptions: {
          includeHiddenAssets: true,
          includeAllBurstAssets: false,
        },
      },
    ])
    .then((res) => {
      const joinedResults = res.reduce((prev, next) => {
        return prev.concat(next.albums)
      }, [])
      const albums = joinedResults.filter(album => album.previewAssets.length)
      this.setState({
        albums,
      })
    })
  }

  getPhotos = () => {
    if (!this.album && !this.fetchingAlbum) this.getAlbum()
    if (!this.album || this.fetchedAll || this.fetching) return
    this.fetching = true
    this.mounted && this.setState({
      fetching: true,
    })
    const start = Date.now()
    const photosPerFetch = this.props.imagesPerRow * this.props.rowsPerFetch
    const fetchOptions = {
      startIndex: this.endCursor,
      endIndex: this.endCursor + photosPerFetch,
      prepareForSizeDisplay: this.getImageDimensions(),
      includeMetaData: true,
      includeHiddenAssets: true,
      fetchOptions: {
        includeHiddenAssets: true,
        includeAllBurstAssets: false,
      },
    }
    this.album.getAssets(fetchOptions)
    .then(data => {
      this.onPhotosFetchedSuccess(data)
      const end = Date.now()
    })
    .catch(this.onPhotosFetchError)
  }

  selectedSection = (section, selectedAll, sectionId) => {
    const selected = !selectedAll
    this.sections = {
      ...this.sections,
      [sectionId]: this.sections[sectionId].map(image =>
        ({ ...image, selected }))
    }
    this.selectedImages = this.selectedImages.withMutations(map => {
      section.forEach(image => selected
        ? map.set(image.localIdentifier, image)
        : map.delete(image.localIdentifier, image)
      )
    })
    this.setState({
      sections: this.sections,
      selectedCount: this.selectedImages.size,
    })
  }

  selectedPhoto = (image, sectionId, rowId) => {
    const selected = !this.sections[sectionId][rowId].selected
    this.sections = {
      ...this.sections,
      [sectionId]: this.sections[sectionId].map((image, idx) =>
        idx === parseInt(rowId)
          ? { ...image, selected: !image.selected }
          : image)
    }
    this.selectedImages = selected
      ? this.selectedImages.set(image.localIdentifier, image)
      : this.selectedImages.delete(image.localIdentifier)
    this.setState({
      sections: this.sections,
      selectedCount: this.selectedImages.size,
    })
  }

  render() {
    const {
      imagesPerRow,
      initialListSize,
      onCancelled,
      onCompleted,
      renderNavBar,
      renderAlbumNavBar,
    } = this.props
    const {
      albumPickerVisible,
      albums,
      albumTitle,
      fetching,
      error,
      sections,
      selectedCount,
      videosCount,
      photosCount,
    } = this.state
    const imageSize = this.getImageDimensions()
    const { width } = Dimensions.get('window')
    const isLeft = i => i % this.props.imagesPerRow === 0
    const isRight = i => (i + 1) % this.props.imagesPerRow === 0
    const getImageStyle = i =>
      isLeft(i) ? styles.imageLeft :
        isRight(i) ? styles.imageRight :
          styles.image
    return (
      <View style={styles.container}>
        <AlbumPickerModal
          visible={albumPickerVisible}
          albums={albums}
          onSelected={this.onAlbumSelected}
          onCancelled={this.onAlbumSelectionCancelled}
          renderAlbumNavBar={renderAlbumNavBar}
        />
        { renderNavBar({
          selectedCount,
          albumTitle,
          onCancelled,
          onCompleted: () => onCompleted(images.filter(image => image.selected)),
          onAlbumSelectionStarted: () => this.onAlbumSelectionStarted(),
        }) }
        <MutableListView
          style={styles.container}
          contentContainerStyle={styles.imageGrid}
          data={sections}
          rowsAndSections={true}
          onEndReached={this.getPhotos}
          enableEmptySections
          onEndReachedThreshold={10000}
          pageSize={imagesPerRow * 10}
          initialListSize={initialListSize}
          renderSectionHeader={(data, title) => {
            const selectedAll = data.filter(image => image.selected).length === data.length
            return (
              <Header
                title={title}
                onSelectAll={() => this.selectedSection(data, selectedAll, title)}
                width={width}
                selectedAll={selectedAll}
              />
            )
          }}
          renderRow={(image, sectionId, rowId) =>
            <Thumbnail
              uri={image.uri}
              onPress={() => this.selectedPhoto(image, sectionId, rowId)}
              selected={image.selected}
              width={imageSize.width}
              height={imageSize.height}
              style={getImageStyle(parseInt(rowId))}
            />
          }
          renderFooter={() =>
            <Footer
              photosCount={photosCount}
              videosCount={videosCount}
              loading={fetching}
              error={error}
              style={{ width }}
            />
          }
        />
      </View>
    )
  }
}

ImagePicker.propTypes = {
  imagesPerRow: PropTypes.number,
  initialListSize: PropTypes.number,
  onCancelled: PropTypes.func.isRequired,
  onCompleted: PropTypes.func.isRequired,
  tintColor: PropTypes.string,
}

ImagePicker.defaultProps = {
  rowsPerFetch: Platform.select({
    ios: 50,
    android: 10,
  }),
  imagesPerRow: 4,
  initialListSize: 6,
  renderNavBar: ImagePickerNavBar,
  renderAlbumNavBar: AlbumPickerNavBar,
  tintColor: 'red',
}

export default ImagePicker
