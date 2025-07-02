import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function TutorDetailScreen({ route }) {
  const { tutor } = route.params;
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Header title="Perfil del Tutor" />

      <ScrollView style={styles.content}>
        <Image
          source={require("../../assets/bolamarilla.png")}
          style={styles.image}
        />
        <Text style={styles.name}>{tutor.nombre}</Text>

        <Text style={styles.label}>Materias:</Text>
        {tutor.materias.map((materia, index) => (
          <Text key={index} style={styles.value}>
            {materia}
          </Text>
        ))}

        <Text style={styles.label}>Experiencia:</Text>
        <Text style={styles.value}>{tutor.experiencia} años</Text>

        <Text style={styles.label}>Modalidad:</Text>
        <Text style={styles.value}>{tutor.modalidad}</Text>

        <Text style={styles.label}>Tarifa por hora:</Text>
        <Text style={styles.value}>${tutor.tarifa}</Text>

        <Text style={styles.label}>Descripción:</Text>
        <Text style={styles.value}>{tutor.descripcion}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("AppointmentBooking")}
        >
          <Text style={styles.buttonText}>Solicitar sesión</Text>
        </TouchableOpacity>
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
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 15,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    marginTop: 15,
  },
  value: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
