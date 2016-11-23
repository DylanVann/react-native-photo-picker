import React, { Component, PropTypes } from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
} from 'react-native'
import moment from 'moment'
import { List, Map } from 'immutable'
import CameraRoll from 'react-native-camera-roll'

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
  contentContainer: {
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
    this.after = undefined
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
    // PhotosFramework.requestAuthorization().then((statusObj) => {
    //   if(statusObj.isAuthorized) {
    //   }
    // });
  }

  componentWillUnmount() {
    this.mounted = false
  }

  onPhotosFetchedSuccess = (data) => {
    const newImages = data.assets
    this.images = this.images.concat(newImages)

    for (let i = 0; i < newImages.length; i += 1) {
      const image = newImages[i]
      const sectionTitle = this.props.getSectionHeader(moment(image.timeStamp))
      this.sections[sectionTitle] = this.sections[sectionTitle]
        ? this.sections[sectionTitle].concat(image)
        : [image]
    }

    const photosCount = this.images.filter(image => !image.isVideo).size
    const videosCount = this.images.filter(image => image.isVideo).size

    if (!data.hasMore) this.fetchedAll = true

    this.after = data.after

    this.fetching = false
    this.setState({
      fetching: false,
      sections: { ...this.sections },
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
    this.after = undefined
    this.getPhotos()
    this.setState({
      fetching: true,
      albumPickerVisible: false,
      albumTitle: album.title || this.props.formatAllPhotosTitle(),
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
    const imageSize = (width - (margin * 2 * (imagesPerRow - 1))) / imagesPerRow
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
    CameraRoll.getDefaultAlbum()
    .then((album) => {
      this.album = album
      this.fetchingAlbum = false
      this.getPhotos()
      this.setState({
        albumTitle: this.album.title || this.props.formatAllPhotosTitle(),
      })
    })
  }

  getAlbums = () => {
    CameraRoll.getAlbums({ prepareForSizeDisplay: this.getImageDimensions() })
    .then((albums) => {
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
    const photosPerFetch = this.props.imagesPerRow * this.props.rowsPerFetch
    const fetchOptions = {
      after: this.after,
      first: photosPerFetch,
      // iOS only.
      prepareForSizeDisplay: this.getImageDimensions(),
    }
    CameraRoll.getPhotos(this.album, fetchOptions)
    .then((data) => {
      this.onPhotosFetchedSuccess(data)
    })
    .catch(this.onPhotosFetchError)
  }

  selectedSection = (section, selectedAll, sectionId) => {
    const selected = !selectedAll
    this.sections = {
      ...this.sections,
      [sectionId]: this.sections[sectionId].map(image =>
        ({ ...image, selected })),
    }
    this.selectedImages = this.selectedImages.withMutations((map) => {
      section.forEach(image => selected
        ? map.set(image.id, image)
        : map.delete(image.id, image),
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
      [sectionId]: this.sections[sectionId].map((img, idx) =>
        idx === parseInt(rowId, 10)
          ? { ...image, selected: !image.selected }
          : image),
    }
    this.selectedImages = selected
      ? this.selectedImages.set(image.id, image)
      : this.selectedImages.delete(image.id)
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
      // NavBar.
      formatAllPhotosTitle,
      formatSelected,
      formatComplete,
      formatCancel,
      // Footer.
      formatPhotosCount,
      formatVideosCount,
      formatCount,
      formatLoading,
      formatNoPhotos,
      // Album.
      formatAlbumSelectionCancel,
      formatAlbumSelectionTitle,
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
      selectedImages,
    } = this.state
    const imageSize = this.getImageDimensions()
    const { width } = Dimensions.get('window')
    const isLeft = i => i % this.props.imagesPerRow === 0
    const isRight = i => (i + 1) % this.props.imagesPerRow === 0
    const getImageStyle = i =>
      isLeft(i) ? styles.imageLeft :
        isRight(i) ? styles.imageRight :
          styles.image
    let scrollView
    return (
      <View style={styles.container}>
        <AlbumPickerModal
          title={formatAlbumSelectionTitle()}
          cancelText={formatAlbumSelectionCancel()}
          visible={albumPickerVisible}
          albums={albums}
          onSelected={(album) => {
            this.onAlbumSelected(album)
            scrollView.scrollTo({ y: 0, animated: false })
          }}
          onCancelled={this.onAlbumSelectionCancelled}
          renderAlbumNavBar={renderAlbumNavBar}
          allPhotosTitle={formatAllPhotosTitle()}
        />
        { renderNavBar({
          selectedCount,
          albumTitle,
          onCancelled,
          formatSelected,
          cancelText: formatCancel(),
          completeText: formatComplete(),
          onCompleted: () => onCompleted(selectedImages),
          onAlbumSelectionStarted: () => this.onAlbumSelectionStarted(),
        }) }
        <MutableListView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
          ref={e => (scrollView = e)}
          data={sections}
          rowsAndSections
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
              style={getImageStyle(parseInt(rowId, 10))}
              isVideo={image.isVideo}
            />
          }
          renderFooter={() =>
            <Footer
              {...{
                photosCount,
                videosCount,
                error,
                formatPhotosCount,
                formatVideosCount,
                formatCount,
                formatLoading,
                formatNoPhotos,
              }}
              loading={fetching}
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
  // NavBar strings.
  formatAllPhotosTitle: PropTypes.func,
  formatSelected: PropTypes.func,
  formatCancel: PropTypes.func,
  formatComplete: PropTypes.func,
  // Album selection strings.
  formatAlbumSelectionCancel: PropTypes.func,
  formatAlbumSelectionTitle: PropTypes.func,
  // Footer strings.
  formatPhotosCount: PropTypes.func,
  formatVideosCount: PropTypes.func,
  formatCount: PropTypes.func,
  formatLoading: PropTypes.func,
  formatNoPhotos: PropTypes.func,
  // Sort the images by timeStamp.
  getSectionHeader: PropTypes.func,
  renderNavBar: PropTypes.func,
  renderAlbumNavBar: PropTypes.func,
}

ImagePicker.defaultProps = {
  rowsPerFetch: Platform.select({
    ios: 50,
    android: 10,
  }),
  // NavBar strings.
  formatAllPhotosTitle: () => 'All Photos',
  formatSelected: count => `${count} Selected`,
  formatCancel: () => 'Cancel',
  formatComplete: () => 'Upload',
  // Album selection strings.
  formatAlbumSelectionCancel: () => 'Cancel',
  formatAlbumSelectionTitle: () => 'Select an Album',
  // Footer strings.
  formatPhotosCount: count => `${count} Photos`,
  formatVideosCount: count => `${count} Videos`,
  formatCount: (photos, videos) => `${photos} Photos, ${videos} Videos`,
  formatLoading: () => 'Loading...',
  formatNoPhotos: () => 'No Photos.',
  // List props.
  imagesPerRow: 4,
  initialListSize: 6,
  renderNavBar: ImagePickerNavBar,
  renderAlbumNavBar: AlbumPickerNavBar,
  renderFooter: Footer,
  tintColor: 'red',
  getSectionHeader,
}

export default ImagePicker
