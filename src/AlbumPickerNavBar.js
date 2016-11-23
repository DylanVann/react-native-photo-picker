import React, { PropTypes } from 'react'
import NavBar from './NavBar'

const AlbumPickerNavBar = ({ onCancelled, title, cancelText }) => {
  const leftButton = {
    title: cancelText,
    handler: onCancelled,
    tintColor: 'red',
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
}

export default AlbumPickerNavBar
