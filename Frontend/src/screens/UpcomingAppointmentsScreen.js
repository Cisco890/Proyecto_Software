import React, { useContext, useState, useCallback } from "react";
import { View, Text, StyleSheet, FlatList, RefreshControl, Platform, Dimensions, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getUserSessions, updateSessionStatus } from "../api/api";
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

function getBadgeStyle(estado) {
  switch (estado) {
    case "pendiente":
      return { backgroundColor: "#FEF3C7", color: "#92400E" }; // amarillo
    case "confirmada":
      return { backgroundColor: "#D1FAE5", color: "#065F46" }; // verde
    case "cancelada":
      return { backgroundColor: "#FEE2E2", color: "#991B1B" }; // rojo
    case "completada":
      return { backgroundColor: "#E0E7FF", color: "#3730A3" }; // azul
    default:
      return { backgroundColor: "#F3F4F6", color: "#374151" }; // gris
  }
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
  const [loading, setLoading] = useState(true);

  const isTutor = user?.id_perfil === 2;

  // Carga desde API con fallback a mock
  const fetchData = useCallback(async (isRefreshing = false) => {
    if (!user) return;
    if (!isRefreshing) setLoading(true);
    const rol = isTutor ? "tutor" : "estudiante";
    try {
      const res = await getUserSessions({
        userId: user.id_usuario,
        rol,
        futuras: true,
      });
      const data = (res.data || [])
        .filter((s) => s.estado !== "cancelada" && s.estado !== "completada")
        .map((s) => ({
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
    } finally {
      setLoading(false);
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
    await fetchData(true);
    setRefreshing(false);
  };

  const handleCancel = async (sessionId) => {
    if (Platform.OS === "web") {
      const confirmed = window.confirm("¿Estás seguro de cancelar esta cita?");
      if (!confirmed) return;
    } else {
      Alert.alert(
        "Cancelar Cita",
        "¿Estás seguro de cancelar esta cita?",
        [
          { text: "No", style: "cancel" },
          {
            text: "Sí",
            onPress: async () => {
              await executeCancellation(sessionId);
            },
          },
        ]
      );
      return;
    }
    await executeCancellation(sessionId);
  };

  const executeCancellation = async (sessionId) => {
    try {
      await updateSessionStatus(sessionId, "cancelada");
      Alert.alert("Listo", "La cita fue cancelada.");
      await fetchData();
    } catch (e) {
      console.log("Error al cancelar:", e?.message || e);
      Alert.alert("Error", "No se pudo cancelar la cita. Intenta más tarde.");
    }
  };

  const renderItem = ({ item }) => {
    const when = new Date(item.fecha_hora);
    const badgeStyle = getBadgeStyle(item.estado);
    const canCancel = !isTutor && item.estado !== "cancelada" && item.estado !== "completada";
    return (
      <View style={[styles.card, { backgroundColor: colorFor(item.fecha_hora) }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.title}>{item.materia?.nombre_materia}</Text>
          <View style={[styles.badge, { backgroundColor: badgeStyle.backgroundColor }]}>
            <Text style={[styles.badgeText, { color: badgeStyle.color }]}>
              {item.estado}
            </Text>
          </View>
        </View>
        <Text style={styles.row}>
          {item.contraparte.label}: {item.contraparte.nombre}
        </Text>
        <Text style={styles.row}>
          {when.toLocaleDateString()}{" "}
          {when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
        <Text style={styles.row}>Duración: {item.duracion_min} min</Text>
        {canCancel && (
          <TouchableOpacity
            style={styles.cancelBtn}
            onPress={() => handleCancel(item.id_sesion)}
          >
            <Text style={styles.cancelBtnText}>Cancelar Cita</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const isWeb = Platform.OS === 'web';
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <Header title="Próximas Citas" />
      <View style={[styles.content, isWeb && screenWidth > 768 && styles.contentWeb]}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text style={styles.loadingText}>Cargando citas...</Text>
          </View>
        ) : (
          <FlatList
          data={items}
          keyExtractor={(it) => String(it.id_sesion)}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 40 }}>
              No hay citas próximas
            </Text>
          }
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          />
        )}
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  contentWeb: {
    maxWidth: 1000,
    alignSelf: "center",
    width: "100%",
  },
  card: { borderRadius: 12, padding: 16, marginBottom: 12 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  title: { fontWeight: "bold", fontSize: 16, flex: 1 },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  row: { color: "#333", marginBottom: 4 },
  cancelBtn: {
    marginTop: 12,
    backgroundColor: "#EF4444",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});