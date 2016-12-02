import React, { PropTypes } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import Triangle from 'react-native-triangle'

import NavBar from './NavBar'

const styles = StyleSheet.create({
  titleButton: {
    width: 165,
    alignItems: 'center',
  },
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
  <TouchableOpacity onPress={onPress} style={styles.titleButton}>
    <View style={styles.titleContainer}>
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
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
  selectedCount: PropTypes.number,
  albumTitle: PropTypes.string,
  onCancelled: PropTypes.func,
  onCompleted: PropTypes.func,
  onAlbumSelectionStarted: PropTypes.func,
  tintColor: PropTypes.string,
  strings: PropTypes.object,
}

export default ImagePickerNavBar
