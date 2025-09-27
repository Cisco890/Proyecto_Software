import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import { getTutorPendingSessions } from "../../api/api";

const MOCK_PENDING = [
  {
    id_sesion: 101,
    estudiante: { nombre: "Ana López", id_usuario: 7 },
    tutor: { id_usuario: 3 },
    materia: { id_materia: 2, nombre_materia: "Cálculo I" },
    fecha_hora: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
    estado: "pendiente",
    duracion_min: 60,
  },
];

export default function ReviewRequestsScreen() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    if (!user) return;
    try {
      const res = await getTutorPendingSessions(user.id_usuario);
      const list = Array.isArray(res.data) ? res.data : [];
      setItems(list);
    } catch (e) {
      // fallback a MOCK si API no responde
      setItems(MOCK_PENDING);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => {
    const fecha = new Date(item.fecha_hora);
    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate("AppointmentDetail", { session: item })}
      >
        <Text style={styles.title}>{item.materia?.nombre_materia || "-"}</Text>
        <Text style={styles.row}>Estudiante: {item.estudiante?.nombre || "-"}</Text>
        <Text style={styles.row}>
          Fecha: {fecha.toLocaleDateString()}{" "}
          {fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
        <Text style={styles.badge}>Pendiente</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Solicitudes Pendientes" />
      <View style={styles.content}>
        <FlatList
          data={items}
          keyExtractor={(it) => String(it.id_sesion)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 40 }}>No hay solicitudes pendientes</Text>}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, backgroundColor: "#fff" },
  card: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 6 },
  row: { color: "#333" },
  badge: {
    alignSelf: "flex-start",
    marginTop: 10,
    backgroundColor: "#EAB308",
    color: "#111",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: "600",
    overflow: "hidden",
  },
});