import React, { PropTypes, Component } from 'react'
import { Modal, Platform } from 'react-native'
import Permissions from 'react-native-permissions'

import ImagePicker from './ImagePicker'
import ImagePickerAuthorizationPrompt from './AuthorizationPrompt'

class ImagePickerModal extends Component {
  constructor(props) {
    super(props)

    this.state = {
      hasAccess: false,
    }
  }

  componentDidMount() {
    Permissions.getPermissionStatus('photo')
    .then((response) => {
      const hasAccess = ['authorized', 'restricted'].includes(response)
      this.setState({ hasAccess })
    })
  }

  onRequestAuthorization = () => {
    Permissions.requestPermission('photo')
    .then((response) => {
      const hasAccess = ['authorized', 'restricted'].includes(response)
      this.setState({ hasAccess })
      // If we haven't got access direct the user to the settings page.
      if (!hasAccess) {
        Permissions.canOpenSettings().then((canOpenSettings) => {
          if (canOpenSettings) {
            Permissions.openSettings();
          }
        })
      }
    })
  }

  render() {
    const { hasAccess } = this.state
    const {
      onCancelled,
      ...otherProps
    } = this.props
    return (hasAccess ?
      (
        <ImagePicker
          onCancelled={onCancelled}
          {...otherProps}
        />
      ) : (
        <ImagePickerAuthorizationPrompt
          onCancelled={onCancelled}
          onRequestAuthorization={this.onRequestAuthorization}
          {...otherProps}
        />
      )
    )
  }
}

ImagePickerModal.propTypes = {
  onCancelled: PropTypes.func.isRequired,
  tintColor: PropTypes.string,
  strings: PropTypes.object,
}

ImagePickerModal.defaultProps = {
  strings: {
    enablePhotosTitle: () => 'Enable Photos Access',
    enablePhotosPrompt: () => 'To upload photos we need access to your photos.',
    enablePhotosButtonText: () => 'Enable Photos Access',
    complete: () => 'Upload',
    cancel: () => 'Cancel',
    defaultAlbum: () => Platform.select({ ios: 'Camera Roll', android: 'All Photos' }),
    allPhotos: () => 'All Photos',
    selected: count => `${count} Selected`,
    startSelectAlbumPrompt: () => 'Tap to Change',
    selectAlbumPrompt: () => 'Select an Album',
    countPhotos: count => `${count} Photos`,
    countVideos: count => `${count} Videos`,
    count: (photos, videos) => `${photos} Photos, ${videos} Videos`,
    loading: () => 'Loading...',
    noPhotos: () => 'No Photos.',
    selectAll: () => 'Select All',
    deselect: () => 'Deselect',
  },
  tintColor: 'blue',
}

export default ImagePickerModal
