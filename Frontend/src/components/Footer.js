import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Footer() {
  return (
    <View style={styles.container}>
      <TouchableOpacity>
        <Ionicons name="calendar-outline" size={32} color="black" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="time-outline" size={32} color="black" />
      </TouchableOpacity>
      <TouchableOpacity>
        <Ionicons name="checkmark-done-outline" size={32} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e0e0e0',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    paddingBottom: 30,
  },
});
