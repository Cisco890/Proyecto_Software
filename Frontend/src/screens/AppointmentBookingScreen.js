import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AppointmentBookingScreen() {
  return (
    <View style={styles.container}>
      <Header title="Agendar Cita" />

      <ScrollView style={styles.content}>
        <Text style={styles.text}>
          Aquí irá el contenido para seleccionar fecha, hora y tema de la cita.
        </Text>
      </ScrollView>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 50,
  },
});
