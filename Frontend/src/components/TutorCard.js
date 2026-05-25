import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import StarRating from "./StarRating";
import Avatar from "./Avatar";

export default function TutorCard({ tutor }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate("TutorDetail", { tutor });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <Avatar
          uri={tutor.foto}
          name={tutor.nombre}
          size={50}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{tutor.nombre}</Text>
<<<<<<< HEAD
          <StarRating rating={tutor.rating} size={16} showNumber={true} />
=======
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
>>>>>>> b7f733474543261fa852f0dbbe89828a582ff2bc
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
  avatar: {
    marginRight: 15,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
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
