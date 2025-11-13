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
          <StarRating rating={tutor.rating} size={16} showNumber={true} />
        </View>
      </View>

      <View style={styles.subjects}>
        {tutor.materias.map((materia, index) => (
          <Text key={materia.id_materia || index} style={styles.subject}>
            {materia.nombre_materia}
          </Text>
        ))}
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

      {/* <View style={styles.footer}>
        <Text style={styles.date}>{tutor.fecha}</Text>
        <Text style={styles.hours}>{tutor.horas} h</Text>
      </View> */}
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
  subjects: {
    marginTop: 10,
    marginBottom: 10,
  },
  subject: {
    fontSize: 14,
    color: "#555",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  date: {
    fontSize: 12,
    color: "#777",
  },
  hours: {
    fontSize: 12,
    color: "#777",
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
});
