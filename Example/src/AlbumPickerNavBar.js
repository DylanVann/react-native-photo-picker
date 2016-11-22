import React, { PropTypes } from 'react'
import NavBar from './NavBar'

const AlbumPickerNavBar = ({onCancelled}) => {
  const leftButton = {
    title: 'Cancel',
    handler: onCancelled,
    tintColor: 'red',
  }
  return (
    <NavBar
      title={{ title: "Select an Album" }}
      leftButton={leftButton}
    />
  )
}

export default AlbumPickerNavBar
