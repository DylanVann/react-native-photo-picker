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

const Title = ({ title, onPress }) =>
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
      Tap to change
    </Text>
  </TouchableOpacity>

Title.propTypes = {
  title: PropTypes.string,
  onPress: PropTypes.func,
}

const ImagePickerNavBar = ({
  selectedCount,
  albumTitle,
  onCancelled,
  onCompleted,
  formatSelected,
  onAlbumSelectionStarted,
  completeText,
  cancelText,
}) => {
  const titleValue = !selectedCount
    ? <Title title={albumTitle} onPress={onAlbumSelectionStarted} />
    : { title: formatSelected(selectedCount) }
  const rightButton = {
    title: completeText,
    handler: selectedCount ? onCompleted : Function.prototype,
    tintColor: selectedCount ? 'red' : '#bbb',
  }
  const leftButton = {
    title: cancelText,
    handler: onCancelled,
    tintColor: 'red',
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
  cancelText: PropTypes.string,
  completeText: PropTypes.string,
}

ImagePickerNavBar.defaultProps = {
  albumTitle: '',
  selectedCount: 0,
}

export default ImagePickerNavBar
