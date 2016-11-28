import React, { PropTypes } from 'react'
import Bar from './NavBar'

const NavBar = ({ onCancelled, strings, tintColor }) => {
  const leftButton = {
    title: strings.cancel(),
    handler: onCancelled,
    tintColor,
  }
  return (
    <Bar
      title={{ title: strings.enablePhotosTitle() }}
      leftButton={leftButton}
    />
  )
}

NavBar.propTypes = {
  onCancelled: PropTypes.func.isRequired,
  tintColor: PropTypes.string,
  strings: PropTypes.object,
}

export default NavBar
