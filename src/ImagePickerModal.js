import React, { PropTypes, Component } from 'react'
import { Modal, Platform, Linking } from 'react-native'
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
        const appSettingsURL = 'app-settings:'
        Linking.canOpenURL(appSettingsURL).then((supported) => {
          if (supported) {
            Linking.openURL(appSettingsURL)
          }
        })
      }
    })
  }

  render() {
    const { hasAccess } = this.state
    const {
      onCancelled,
      visible,
      ...otherProps
    } = this.props
    return (
      <Modal
        animationType={'slide'}
        transparent={false}
        visible={visible}
        onRequestClose={onCancelled}
      >
        { hasAccess ? (
          <ImagePicker
            onCancelled={onCancelled}
            {...otherProps}
          />
        ) : (
          <ImagePickerAuthorizationPrompt
            onRequestAuthorization={() => this.onRequestAuthorization()}
            onCancelled={onCancelled}
            {...otherProps}
          />
        )}
      </Modal>
    )
  }
}

ImagePickerModal.propTypes = {
  visible: PropTypes.bool,
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
