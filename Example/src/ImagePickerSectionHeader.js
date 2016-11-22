import React, { PropTypes } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

const styles = StyleSheet.create({
  container: {
    height: 44,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  date: {
    flex: 1,
  },
  selectAllButton: {
    justifyContent: 'center',
    height: 44,
  },
  selectAll: {
    textAlign: 'right',
    color: 'red',
  },
})

const getText = selectedAll => {
  if (selectedAll) return 'Deselect All'
  return 'Select All'
}

const SectionHeader = ({ title, style, width, selectedAll, onSelectAll }) =>
  <View style={[styles.container, {width},style]}>
    <Text style={styles.date}>
      { title }
    </Text>
    <TouchableOpacity style={styles.selectAllButton} onPress={onSelectAll}>
      <Text style={styles.selectAll}>
        { getText(selectedAll) }
      </Text>
    </TouchableOpacity>
  </View>

SectionHeader.propTypes = {
  selectedAll: PropTypes.bool,
  onSelectAll: PropTypes.func,
  style: View.propTypes.style,
  title: PropTypes.string,
}

export default SectionHeader
