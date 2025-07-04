import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";

// 🔥 Información simulada del tutor
const MOCK_TUTOR = {
  id: 12,
  horario: "mañana", // puede ser: 'mañana' | 'tarde' | 'noche'
  materias: [
    { id: 1, nombre: "Matemáticas" },
    { id: 2, nombre: "Física" },
    { id: 3, nombre: "Química" },
  ],
};

export default function AppointmentBookingScreen() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);

  // 🔢 Fechas simuladas: hoy + 5 días
  const getNextFiveDays = () => {
    const today = new Date();
    return [...Array(5)].map((_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });
  };

  // ⏰ Horarios según disponibilidad general del tutor
  const getTimeSlots = () => {
    switch (MOCK_TUTOR.horario) {
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

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime || !selectedSubject) {
      Alert.alert("Faltan datos", "Selecciona fecha, hora y materia.");
      return;
    }

    // 💡 Esta info se usará en un futuro POST a /sesiones
    const appointmentData = {
      id_tutor: MOCK_TUTOR.id,
      id_estudiante: 45, // Simulado
      id_materia: selectedSubject.id,
      fecha_hora: new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        parseInt(selectedTime.split(":")[0]),
        0,
        0
      ).toISOString(),
    };

    console.log("📦 Datos para enviar:", appointmentData);
    Alert.alert("Cita agendada", "Tu cita ha sido creada (simulada).");
  };

  return (
    <View style={styles.container}>
      <Header title="Agendar Cita" />

      <ScrollView style={styles.content}>
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
            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.optionButton,
                  isSelected && styles.selectedButton,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text
                  style={[styles.optionText, isSelected && styles.selectedText]}
                >
                  {time} - {parseInt(time.split(":")[0]) + 1}:00
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>3. Selecciona una materia</Text>
        <View style={styles.buttonGroup}>
          {MOCK_TUTOR.materias.map((materia) => {
            const isSelected = selectedSubject?.id === materia.id;
            return (
              <TouchableOpacity
                key={materia.id}
                style={[
                  styles.optionButton,
                  isSelected && styles.selectedButton,
                ]}
                onPress={() => setSelectedSubject(materia)}
              >
                <Text
                  style={[styles.optionText, isSelected && styles.selectedText]}
                >
                  {materia.nombre}
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

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    padding: 20,
    backgroundColor: "#fff",
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
