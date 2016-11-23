import React, { PropTypes } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Triangle from 'react-native-triangle'

import NavBar from './NavBar'

const styles = StyleSheet.create({
  changeAlbumButton: {
    fontSize: 10,
    color: '#bbb',
    textAlign: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 5,
  },
  title: {
    fontSize: 17,
    textAlign: 'center',
  },
  titleTriangle: {
    marginLeft: 2,
  },
})

const Title = ({ title, onPress, strings }) =>
  <TouchableOpacity onPress={onPress}>
    <View style={styles.titleContainer}>
      <Text style={styles.title}>
        {title}
      </Text>
      <View style={styles.titleTriangle}>
        <Triangle width={3} height={3} direction="down" color="black" />
      </View>
    </View>
    <Text style={styles.changeAlbumButton}>
      { strings.startSelectAlbumPrompt() }
    </Text>
  </TouchableOpacity>

Title.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
  strings: PropTypes.object,
}

const ImagePickerNavBar = ({
  selectedCount,
  albumTitle,
  onCancelled,
  onCompleted,
  onAlbumSelectionStarted,
  tintColor,
  strings,
}) => {
  const titleValue = !selectedCount
    ?
    (<Title
      title={albumTitle}
      onPress={onAlbumSelectionStarted}
      strings={strings}
    />)
    : { title: strings.selected(selectedCount) }
  const rightButton = {
    title: strings.complete(),
    handler: selectedCount ? onCompleted : Function.prototype,
    tintColor: selectedCount ? tintColor : '#bbb',
  }
  const leftButton = {
    title: strings.cancel(),
    handler: onCancelled,
    tintColor,
  }
  return (
    <NavBar
      title={titleValue}
      rightButton={rightButton}
      leftButton={leftButton}
    />
  )
}

ImagePickerNavBar.propTypes = {
  formatSelected: PropTypes.func,
  selectedCount: PropTypes.number,
  albumTitle: PropTypes.string,
  onCancelled: PropTypes.func,
  onCompleted: PropTypes.func,
  onAlbumSelectionStarted: PropTypes.func,
  tintColor: PropTypes.string,
  // Strings.
  completeText: PropTypes.string,
  cancelText: PropTypes.string,
  changePromptText: PropTypes.string,
}

ImagePickerNavBar.defaultProps = {
  albumTitle: '',
  selectedCount: 0,
}

export default ImagePickerNavBar
