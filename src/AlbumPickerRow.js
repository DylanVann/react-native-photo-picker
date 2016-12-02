import React, { PropTypes } from 'react'
import {
  TouchableOpacity,
  Image,
  View,
  Text,
  StyleSheet,
} from 'react-native'

const styles = StyleSheet.create({
  thumbnail: {
    width: 80,
    height: 80,
    margin: 10,
    backgroundColor: 'black',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 10,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  rowTitle: {
    fontWeight: 'bold',
  },
})

const Row = ({ uri, title, count, onPress }) =>
  <TouchableOpacity style={styles.row} onPress={onPress}>
    <Image
      source={{
        uri,
        deliveryMode: 'opportunistic',
      }}
      style={styles.thumbnail}
    />
    <View style={styles.textContainer}>
      <Text style={styles.rowTitle} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
      <Text>{count}</Text>
    </View>
  </TouchableOpacity>

Row.propTypes = {
  uri: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  count: PropTypes.number,
  onPress: PropTypes.func.isRequired,
}

export default Row
