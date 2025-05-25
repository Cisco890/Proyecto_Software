import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function TutorSessionsScreen() {
  return (
    <View style={styles.container}>
      <Text>Tutor Sessions Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
});
