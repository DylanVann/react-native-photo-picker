import React, { PropTypes } from 'react'
import { Modal } from 'react-native'
import ImagePicker from './ImagePicker'

const ImagePickerModal = ({ visible, onCancelled, ...otherProps }) =>
  <Modal
    animationType={'slide'}
    transparent={false}
    visible={visible}
    onRequestClose={onCancelled}
    style={{ flexDirection: 'flex-row' }}
  >
    <ImagePicker onCancelled={onCancelled} {...otherProps} />
  </Modal>

ImagePickerModal.propTypes = {
  visible: PropTypes.bool,
  onCancelled: PropTypes.func.isRequired,
}

export default ImagePickerModal
