import React, { PropTypes } from 'react'
import NavBar from './NavBar'

const AlbumPickerNavBar = ({ onCancelled, strings, tintColor }) => {
  const leftButton = {
    title: strings.cancel(),
    handler: onCancelled,
    tintColor,
  }
  return (
    <NavBar
      title={{ title: strings.selectAlbumPrompt() }}
      leftButton={leftButton}
    />
  )
}

AlbumPickerNavBar.propTypes = {
  onCancelled: PropTypes.func.isRequired,
  tintColor: PropTypes.string,
  strings: PropTypes.object,
}

export default AlbumPickerNavBar
