import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { obtenerSesionesDelTutor } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function TutorSessionsScreen() {
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await obtenerSesionesDelTutor(user.id_usuario);
        console.log("📥 Sesiones del tutor:", res.data); // <-- Aquí
        setSessions(res.data);
      } catch (err) {
        console.error("Error al obtener sesiones:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.materia}>{item.materia}</Text>
      <Text style={styles.info}>Estudiante: {item.estudiante}</Text>
      <Text style={styles.info}>Modalidad: {item.modalidad}</Text>
      <Text style={styles.info}>Horario: {item.horario}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Mis Sesiones" />
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : sessions.length === 0 ? (
          <Text style={styles.emptyText}>
            No tienes sesiones registradas aún.
          </Text>
        ) : (
          <FlatList
            data={sessions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
  },
  materia: {
    fontSize: 18,
    fontWeight: "bold",
  },
  info: {
    marginTop: 5,
    fontSize: 14,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#777",
  },
});
