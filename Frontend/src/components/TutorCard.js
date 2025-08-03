import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";

export default function TutorCard({ tutor }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("TutorDetail", { tutor });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/bolamarilla.png")}
          style={styles.profileImage}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{tutor.nombre}</Text>
          <View style={styles.rating}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Ionicons
                key={index}
                name={index < tutor.rating ? "star" : "star-outline"}
                size={16}
                color="#FFD700"
              />
            ))}
          </View>
          <Text style={styles.experience}>
            {tutor.experiencia
              ? `Experiencia: ${tutor.experiencia} años`
              : "Experiencia no especificada"}
          </Text>
        </View>
      </View>

      <View style={styles.subjectsContainer}>
        <Text style={styles.subjectsTitle}>Materias:</Text>
        <View style={styles.subjectsList}>
          {tutor.materias.map((materia, index) => (
            <View key={materia.id_materia || index} style={styles.subjectBadge}>
              <Text style={styles.subjectText}>{materia.nombre_materia}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.extraInfo}>
        <Text style={styles.textSmall}>
          Modalidad: {tutor.modalidad || "No definida"}
        </Text>
        <Text style={styles.textSmall}>
          Horario:{" "}
          {typeof tutor.horario === "string"
            ? tutor.horario
            : ["mañana", "tarde", "noche"][tutor.horario ?? 0]}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: "#ccc",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  rating: {
    flexDirection: "row",
    marginTop: 5,
  },
  subjectsContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  subjectsTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  subjectsList: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  subjectBadge: {
    backgroundColor: "#FFF9C4",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  subjectText: {
    fontSize: 13,
    color: "#555",
  },
  extraInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  textSmall: {
    fontSize: 13,
    color: "#555",
  },
  experience: {
    fontSize: 13,
    color: "#00796B",
    marginTop: 4,
  },
});
