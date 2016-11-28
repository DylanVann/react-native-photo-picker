import React, { PropTypes } from 'react'
import { Modal } from 'react-native'
import Permissions from 'react-native-permissions'

import AlbumPicker from './AlbumPicker'

const AlbumPickerModal = ({ visible, onCancelled, ...otherProps }) =>
  <Modal
    animationType={'slide'}
    transparent={false}
    visible={visible}
    onRequestClose={onCancelled}
    style={{ flexDirection: 'flex-row' }}
  >
    <AlbumPicker onCancelled={onCancelled} {...otherProps} />
  </Modal>

AlbumPickerModal.propTypes = {
  visible: PropTypes.bool,
  onCancelled: PropTypes.func,
}

export default AlbumPickerModal
