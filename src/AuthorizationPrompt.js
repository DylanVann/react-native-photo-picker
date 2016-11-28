import React, { PropTypes } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import NavBar from './AuthorizationPromptNavBar'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  promptStyle: {
    marginBottom: 44,
  },
})

const AuthorizationPrompt = ({ onCancelled, strings, tintColor, onRequestAuthorization }) =>
  <View style={styles.container}>
    <NavBar onCancelled={onCancelled} strings={strings} tintColor={tintColor} />
    <View style={styles.contentContainer}>
      <Text style={styles.promptStyle}>
        {strings.enablePhotosPrompt()}
      </Text>
      <TouchableOpacity onPress={onRequestAuthorization}>
        <Text style={{ color: tintColor }}>
          {strings.enablePhotosButtonText()}
        </Text>
      </TouchableOpacity>
    </View>
  </View>

AuthorizationPrompt.propTypes = {
  onCancelled: PropTypes.func,
  strings: PropTypes.object,
  tintColor: PropTypes.string,
  onRequestAuthorization: PropTypes.func.isRequired,
}

export default AuthorizationPrompt
