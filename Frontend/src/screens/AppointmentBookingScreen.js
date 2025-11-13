import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { getDisponibilidadTutor, agendarCita } from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function AppointmentBookingScreen({ route }) {
  const { tutor } = route.params;
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [bloquesOcupados, setBloquesOcupados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDisponibilidadTutor(tutor.id_tutor)
      .then((res) => {
        const ocupados = res.data.bloques_ocupados.map((d) =>
          new Date(d).toISOString()
        );
        setBloquesOcupados(ocupados);
      })
      .catch((err) => {
        console.error("Error obteniendo disponibilidad:", err);
        setBloquesOcupados([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const getNextFiveDays = () => {
    const today = new Date();
    return [...Array(5)].map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });
  };

  const getTimeSlots = () => {
    switch (tutor.horario) {
      case "mañana":
        return ["08:00", "09:00", "10:00"];
      case "tarde":
        return ["13:00", "14:00", "15:00"];
      case "noche":
        return ["18:00", "19:00", "20:00"];
      default:
        return [];
    }
  };

  const isSlotOccupied = (date, time) => {
    const slot = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      parseInt(time.split(":")[0])
    );
    return bloquesOcupados.includes(slot.toISOString());
  };

  const isSlotInPast = (date, time) => {
    const slot = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      parseInt(time.split(":")[0])
    );
    return slot < new Date();
  };

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime || !selectedSubject) {
      Alert.alert("Faltan datos", "Selecciona fecha, hora y materia.");
      return;
    }

    const fecha_hora = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      parseInt(selectedTime.split(":")[0])
    );

    if (fecha_hora < new Date()) {
      Alert.alert("Error", "No puedes agendar una cita en el pasado.");
      return;
    }

    const fecha_hora_iso = fecha_hora.toISOString();

    try {
      await agendarCita({
        id_tutor: tutor.id_usuario,
        id_estudiante: user?.id_usuario,
        id_materia: selectedSubject.id_materia,
        fecha_hora: fecha_hora_iso,
      });

      Alert.alert("Cita agendada", "Tu cita ha sido creada exitosamente.", [
  { text: "OK", onPress: () => navigation.navigate("UpcomingAppointments") },
]);
    } catch (err) {
      console.error("Error al agendar:", err);
      Alert.alert("Error", "No se pudo agendar la cita.");
    }
  };

  const isWeb = Platform.OS === 'web';
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <Header title="Agendar Cita" />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Cargando disponibilidad...</Text>
        </View>
      ) : (
        <ScrollView style={[styles.content, isWeb && screenWidth > 768 && styles.contentWeb]}>
          <Text style={styles.sectionTitle}>1. Selecciona una fecha</Text>
        <View style={styles.buttonGroup}>
          {getNextFiveDays().map((date, index) => {
            const label = date.toLocaleDateString();
            const isSelected =
              selectedDate &&
              date.toDateString() === selectedDate.toDateString();
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isSelected && styles.selectedButton,
                ]}
                onPress={() => setSelectedDate(date)}
              >
                <Text
                  style={[styles.optionText, isSelected && styles.selectedText]}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>2. Selecciona un horario</Text>
        <View style={styles.buttonGroup}>
          {getTimeSlots().map((time, index) => {
            const isSelected = selectedTime === time;
            const isPast = selectedDate && isSlotInPast(selectedDate, time);
            const isOccupied = selectedDate && isSlotOccupied(selectedDate, time);
            const isDisabled = isPast || isOccupied;
            return (
              <TouchableOpacity
                key={index}
                disabled={isDisabled}
                style={[
                  styles.optionButton,
                  isSelected && styles.selectedButton,
                  isDisabled && { backgroundColor: "#ccc" },
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.selectedText,
                    isDisabled && { color: "#777" },
                  ]}
                >
                  {time} - {parseInt(time.split(":")[0]) + 1}:00
                  {isPast && " (pasado)"}
                  {isOccupied && " (ocupado)"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>3. Selecciona una materia</Text>
        <View style={styles.buttonGroup}>
          {tutor.materias.map((materia) => {
            const isSelected =
              selectedSubject?.id_materia === materia.id_materia;
            return (
              <TouchableOpacity
                key={materia.id_materia}
                style={[
                  styles.optionButton,
                  isSelected && styles.selectedButton,
                ]}
                onPress={() => setSelectedSubject(materia)}
              >
                <Text
                  style={[styles.optionText, isSelected && styles.selectedText]}
                >
                  {materia.nombre_materia}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {selectedDate && selectedTime && selectedSubject && (
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmText}>Confirmar Cita</Text>
          </TouchableOpacity>
        )}
        </ScrollView>
      )}

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  content: {
    padding: 20,
    backgroundColor: "#fff",
  },
  contentWeb: {
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 40,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 15,
  },
  optionButton: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  selectedButton: {
    backgroundColor: "#4CAF50",
  },
  optionText: {
    color: "#333",
    fontSize: 14,
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontSize: 16,
  },
});
