import React, { PropTypes } from 'react'
import NavBar from './NavBar'

const AlbumPickerNavBar = ({ onCancelled, title, cancelText, tintColor }) => {
  const leftButton = {
    title: cancelText,
    handler: onCancelled,
    tintColor,
  }
  return (
    <NavBar
      title={{ title }}
      leftButton={leftButton}
    />
  )
}

AlbumPickerNavBar.propTypes = {
  onCancelled: PropTypes.func.isRequired,
  title: PropTypes.string,
  cancelText: PropTypes.string,
  tintColor: PropTypes.string,
}

export default AlbumPickerNavBar
