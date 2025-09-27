// src/screens/Tutor/AppointmentDetailScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  InteractionManager,
} from "react-native";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useNavigation, useRoute, CommonActions } from "@react-navigation/native";
import { updateSessionStatus } from "../../api/api";

export default function AppointmentDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { session } = route.params || {};
  const [loading, setLoading] = useState(false);

  if (!session) {
    return (
      <View style={styles.container}>
        <Header title="Detalle de la Cita" />
        <View style={[styles.content, { justifyContent: "center", alignItems: "center" }]}>
          <Text>No hay datos de la cita.</Text>
        </View>
        <Footer />
      </View>
    );
  }

  const fecha = new Date(session.fecha_hora);

  // Navega SÍ o SÍ a "UpcomingAppointments"
  const goToUpcoming = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "UpcomingAppointments" }],
      })
    );
  };

  // Actualiza estado en segundo plano (para que la navegación no dependa del PUT)
  const updateInBackground = (nuevoEstado) => {
    InteractionManager.runAfterInteractions(async () => {
      try {
        await updateSessionStatus(session.id_sesion, nuevoEstado);
        if (Platform.OS !== "web") {
          // En nativo mostramos aviso después
          Alert.alert("Listo", nuevoEstado === "confirmada" ? "La cita fue confirmada." : "La cita fue rechazada.");
        }
      } catch (e) {
        console.log("Error al actualizar sesión:", e?.message || e);
        if (Platform.OS !== "web") {
          Alert.alert("Aviso", "No se pudo actualizar en el servidor, intenta más tarde.");
        }
      } finally {
        setLoading(false);
      }
    });
  };

  const handleAccept = () => {
    if (loading) return;
    setLoading(true);
    goToUpcoming();              // 1) Navega ya
    updateInBackground("confirmada"); // 2) PUT en background
  };

  const handleReject = () => {
    if (loading) return;
    setLoading(true);
    goToUpcoming();              // 1) Navega ya
    updateInBackground("rechazada");  // 2) PUT en background
  };

  return (
    <View style={styles.container}>
      <Header title="Detalle de la Cita" />
      <View style={styles.content}>
        <Text style={styles.title}>{session.materia?.nombre_materia || "-"}</Text>
        <Text style={styles.row}>Estudiante: {session.estudiante?.nombre || "-"}</Text>
        <Text style={styles.row}>
          Fecha: {fecha.toLocaleDateString()}{" "}
          {fecha.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </Text>
        <Text style={styles.row}>Duración: {session.duracion_min || 60} min</Text>
        <Text style={styles.row}>Estado: {session.estado}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.btn, styles.accept, loading && { opacity: 0.6 }]}
            onPress={handleAccept}
            disabled={loading}
          >
            <Text style={styles.btnText}>{loading ? "Procesando..." : "Aceptar"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btn, styles.reject, loading && { opacity: 0.6 }]}
            onPress={handleReject}
            disabled={loading}
          >
            <Text style={styles.btnText}>{loading ? "Procesando..." : "Rechazar"}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, backgroundColor: "#fff", padding: 16 },
  title: { fontWeight: "bold", fontSize: 18, marginBottom: 10 },
  row: { color: "#333", marginBottom: 6 },
  actions: { flexDirection: "row", gap: 12, marginTop: 20 },
  btn: { flex: 1, padding: 14, borderRadius: 10, alignItems: "center" },
  accept: { backgroundColor: "#22C55E" },
  reject: { backgroundColor: "#EF4444" },
  btnText: { color: "#fff", fontWeight: "600" },
});