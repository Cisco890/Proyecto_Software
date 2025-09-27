import React, { useContext, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getUserSessions } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useFocusEffect } from "@react-navigation/native";

// --- utilidades ---
function addHours(h) {
  const d = new Date();
  d.setHours(d.getHours() + h);
  return d;
}

function colorFor(dateStr) {
  const d = new Date(dateStr);
  const diffDays = Math.ceil((d - new Date()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 1) return "#FEE2E2"; // rojo suave
  if (diffDays <= 3) return "#FEF9C3"; // amarillo suave
  return "#DCFCE7";                    // verde suave
}

// --- MOCK de respaldo para demo ---
function buildMock(isTutor) {
  return isTutor
    ? [
        {
          id_sesion: 201,
          fecha_hora: addHours(12).toISOString(),
          duracion_min: 60,
          estado: "confirmada",
          materia: { nombre_materia: "Cálculo I" },
          contraparte: { label: "Estudiante", nombre: "Ana López" },
        },
        {
          id_sesion: 202,
          fecha_hora: addHours(48).toISOString(),
          duracion_min: 60,
          estado: "confirmada",
          materia: { nombre_materia: "Física" },
          contraparte: { label: "Estudiante", nombre: "Luis Pérez" },
        },
        {
          id_sesion: 203,
          fecha_hora: addHours(120).toISOString(),
          duracion_min: 90,
          estado: "confirmada",
          materia: { nombre_materia: "Química" },
          contraparte: { label: "Estudiante", nombre: "María García" },
        },
      ]
    : [
        {
          id_sesion: 301,
          fecha_hora: addHours(10).toISOString(),
          duracion_min: 60,
          estado: "confirmada",
          materia: { nombre_materia: "POO" },
          contraparte: { label: "Tutor", nombre: "Prof. Herrera" },
        },
        {
          id_sesion: 302,
          fecha_hora: addHours(50).toISOString(),
          duracion_min: 60,
          estado: "confirmada",
          materia: { nombre_materia: "Estructuras" },
          contraparte: { label: "Tutor", nombre: "Ing. Díaz" },
        },
        {
          id_sesion: 303,
          fecha_hora: addHours(170).toISOString(),
          duracion_min: 45,
          estado: "confirmada",
          materia: { nombre_materia: "Bases de Datos" },
          contraparte: { label: "Tutor", nombre: "Lic. Solís" },
        },
      ];
}

export default function UpcomingAppointmentsScreen() {
  const { user } = useContext(AuthContext);
  const [items, setItems] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const isTutor = user?.id_perfil === 2;

  // Carga desde API con fallback a mock
  const fetchData = useCallback(async () => {
    if (!user) return;
    const rol = isTutor ? "tutor" : "estudiante";
    try {
      const res = await getUserSessions({
        userId: user.id_usuario,
        rol,
        estado: "confirmada",
        futuras: true,
      });
      const data = (res.data || []).map((s) => ({
        id_sesion: s.id_sesion,
        fecha_hora: s.fecha_hora,
        duracion_min: s.duracion_min || 60,
        estado: s.estado,
        materia: { nombre_materia: s.materia?.nombre_materia || "-" },
        contraparte:
          rol === "tutor"
            ? { label: "Estudiante", nombre: s.estudiante?.nombre || "-" }
            : { label: "Tutor", nombre: s.tutor?.nombre || "-" },
      }));
      setItems(data);
    } catch (e) {
      // fallback: mock para demo
      setItems(buildMock(isTutor));
    }
  }, [user, isTutor]);

  // Re-cargar al entrar a la pantalla (útil tras aceptar/rechazar)
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const renderItem = ({ item }) => {
    const when = new Date(item.fecha_hora);
    return (
      <View style={[styles.card, { backgroundColor: colorFor(item.fecha_hora) }]}>
        <Text style={styles.title}>{item.materia?.nombre_materia}</Text>
        <Text style={styles.row}>
          {item.contraparte.label}: {item.contraparte.nombre}
        </Text>
        <Text style={styles.row}>
          {when.toLocaleDateString()}{" "}
          {when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
        <Text style={styles.row}>Duración: {item.duracion_min} min</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Próximas Citas" />
      <View style={styles.content}>
        <FlatList
          data={items}
          keyExtractor={(it) => String(it.id_sesion)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 40 }}>
              No hay citas confirmadas
            </Text>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, backgroundColor: "#fff" },
  card: { borderRadius: 12, padding: 16, marginBottom: 12 },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 6 },
  row: { color: "#333", marginBottom: 4 },
});