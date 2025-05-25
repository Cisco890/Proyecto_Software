import { View, Text, StyleSheet } from 'react-native';

export default function TutorReviewsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tutor Reviews</Text>
      <Text style={styles.subtitle}>Aquí se mostrarán las reseñas recibidas por el tutor.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
