import React, { PropTypes } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'

const styles = StyleSheet.create({
  container: {
    height: 18,
    paddingLeft: 5,
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
    height: 18,
    paddingRight: 5,
  },
  selectAll: {
    textAlign: 'right',
  },
})

const hitSlop = { bottom: 13, left: 13, right: 13, top: 13 }

const SectionHeader = ({ title, style, width, selectedAll, onSelectAll, tintColor, strings }) =>
  <View style={[styles.container, { width }, style]}>
    <Text style={styles.date}>
      { title }
    </Text>
    <TouchableOpacity style={styles.selectAllButton} onPress={onSelectAll} hitSlop={hitSlop}>
      <Text style={[styles.selectAll, { color: tintColor }]}>
        { selectedAll ? strings.deselect() : strings.selectAll() }
      </Text>
    </TouchableOpacity>
  </View>

SectionHeader.propTypes = {
  width: PropTypes.number,
  selectedAll: PropTypes.bool,
  onSelectAll: PropTypes.func,
  style: View.propTypes.style,
  title: PropTypes.string,
  tintColor: PropTypes.string,
  strings: PropTypes.object,
}

export default SectionHeader
