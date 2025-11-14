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
  const [bloquesOcupadosTutor, setBloquesOcupadosTutor] = useState([]);
  const [bloquesOcupadosEstudiante, setBloquesOcupadosEstudiante] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDisponibilidad = async () => {
      try {
        // Para debuggear
        console.log("ID Tutor:", tutor.id_usuario || tutor.id);
        console.log("ID Estudiante:", user?.id_usuario);

        const response = await getDisponibilidadTutor(
          tutor.id_usuario || tutor.id, 
          user?.id_usuario
        );
        
        console.log("Respuesta de disponibilidad:", response.data);

        const ocupadosTutor = response.data.bloques_ocupados.map((d) =>
          new Date(d).toISOString()
        );
        const ocupadosEstudiante = response.data.bloques_ocupados_estudiante?.map((d) =>
          new Date(d).toISOString()
        ) || [];
        
        setBloquesOcupadosTutor(ocupadosTutor);
        setBloquesOcupadosEstudiante(ocupadosEstudiante);

        console.log("Bloques ocupados tutor:", ocupadosTutor);
        console.log("Bloques ocupados estudiante:", ocupadosEstudiante);
      } catch (err) {
        console.error("Error obteniendo disponibilidad:", err);
        Alert.alert("Error", "No se pudo cargar la disponibilidad");
        setBloquesOcupadosTutor([]);
        setBloquesOcupadosEstudiante([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDisponibilidad();
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
        return ["08:00", "09:00", "10:00", "11:00"];
      case "tarde":
        return ["13:00", "14:00", "15:00", "16:00"];
      case "noche":
        return ["18:00", "19:00", "20:00", "21:00"];
      default:
        return ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];
    }
  };

  const isSlotOccupiedByTutor = (date, time) => {
    const slot = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      parseInt(time.split(":")[0])
    );
    const slotISO = slot.toISOString();
    console.log(`Verificando slot tutor: ${slotISO} - Ocupado: ${bloquesOcupadosTutor.includes(slotISO)}`);
    return bloquesOcupadosTutor.includes(slotISO);
  };

  const isSlotOccupiedByStudent = (date, time) => {
    const slot = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      parseInt(time.split(":")[0])
    );
    const slotISO = slot.toISOString();
    console.log(`Verificando slot estudiante: ${slotISO} - Ocupado: ${bloquesOcupadosEstudiante.includes(slotISO)}`);
    return bloquesOcupadosEstudiante.includes(slotISO);
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

  const getSlotStatus = (date, time) => {
    if (!date) return 'available';
    
    if (isSlotInPast(date, time)) return 'past';
    if (isSlotOccupiedByTutor(date, time)) return 'tutor_occupied';
    if (isSlotOccupiedByStudent(date, time)) return 'student_occupied';
    return 'available';
  };

  const getSlotStatusText = (status) => {
    switch (status) {
      case 'past': return ' (pasado)';
      case 'tutor_occupied': return ' (tutor ocupado)';
      case 'student_occupied': return ' (ya tienes cita)';
      default: return '';
    }
  };

  const getSlotStyle = (status, isSelected) => {
    if (isSelected) return styles.selectedButton;
    
    switch (status) {
      case 'past': return styles.pastSlot;
      case 'tutor_occupied': return styles.tutorOccupiedSlot;
      case 'student_occupied': return styles.studentOccupiedSlot;
      default: return styles.availableSlot;
    }
  };

  const getSlotTextStyle = (status, isSelected) => {
    if (isSelected) return styles.selectedText;
    
    switch (status) {
      case 'past': return styles.pastText;
      case 'tutor_occupied': return styles.tutorOccupiedText;
      case 'student_occupied': return styles.studentOccupiedText;
      default: return styles.availableText;
    }
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

    // Validación frontend adicional
    const slotStatus = getSlotStatus(selectedDate, selectedTime);
    if (slotStatus !== 'available') {
      let message = "Este horario no está disponible. ";
      switch (slotStatus) {
        case 'tutor_occupied': 
          message += "El tutor ya tiene una cita en este horario.";
          break;
        case 'student_occupied': 
          message += "Ya tienes una cita programada en este horario.";
          break;
        case 'past': 
          message += "Este horario ya pasó.";
          break;
      }
      Alert.alert("Horario no disponible", message);
      return;
    }

    const fecha_hora_iso = fecha_hora.toISOString();

    try {
      const idTutor = tutor.id_usuario || tutor.id;
      
      console.log("Enviando datos de cita:", {
        id_tutor: idTutor,
        id_estudiante: user?.id_usuario,
        id_materia: selectedSubject.id_materia,
        fecha_hora: fecha_hora_iso,
      });

      await agendarCita({
        id_tutor: idTutor,
        id_estudiante: user?.id_usuario,
        id_materia: selectedSubject.id_materia,
        fecha_hora: fecha_hora_iso,
      });

      // Actualizar bloques ocupados localmente
      setBloquesOcupadosEstudiante(prev => [...prev, fecha_hora_iso]);

      Alert.alert("Cita agendada", "Tu cita ha sido creada exitosamente.", [
        { 
          text: "OK", 
          onPress: () => navigation.navigate("UpcomingAppointments") 
        },
      ]);
    } catch (err) {
      console.error("Error al agendar:", err.response?.data || err.message);
      
      if (err.response?.status === 409) {
        Alert.alert("Conflicto de horario", err.response.data.error);
      } else {
        Alert.alert("Error", err.response?.data?.error || "No se pudo agendar la cita.");
      }
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
          {/* Información del Tutor */}
          <View style={styles.tutorInfo}>
            <Text style={styles.tutorName}>Tutor: {tutor.nombre || tutor.usuario?.nombre}</Text>
            <Text style={styles.tutorSchedule}>Horario: {tutor.horario || "No especificado"}</Text>
          </View>

          {/* Sección de Fechas */}
          <Text style={styles.sectionTitle}>1. Selecciona una fecha</Text>
          <View style={styles.buttonGroup}>
            {getNextFiveDays().map((date, index) => {
              const label = date.toLocaleDateString('es-ES', { 
                weekday: 'short', 
                day: 'numeric', 
                month: 'short' 
              });
              const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dateButton,
                    isSelected && styles.selectedButton,
                  ]}
                  onPress={() => {
                    setSelectedDate(date);
                    setSelectedTime(null);
                  }}
                >
                  <Text style={[styles.dateButtonText, isSelected && styles.selectedText]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Sección de Horarios */}
          {selectedDate && (
            <>
              <Text style={styles.sectionTitle}>2. Selecciona un horario</Text>
              <View style={styles.buttonGroup}>
                {getTimeSlots().map((time, index) => {
                  const isSelected = selectedTime === time;
                  const slotStatus = getSlotStatus(selectedDate, time);
                  const isDisabled = slotStatus !== 'available';
                  
                  return (
                    <TouchableOpacity
                      key={index}
                      disabled={isDisabled}
                      style={[
                        styles.timeButton,
                        getSlotStyle(slotStatus, isSelected),
                      ]}
                      onPress={() => setSelectedTime(time)}
                    >
                      <Text style={[
                        styles.timeButtonText,
                        getSlotTextStyle(slotStatus, isSelected),
                      ]}>
                        {time} - {parseInt(time.split(":")[0]) + 1}:00
                        {getSlotStatusText(slotStatus)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          {/* Sección de Materias */}
          <Text style={styles.sectionTitle}>3. Selecciona una materia</Text>
          <View style={styles.buttonGroup}>
            {tutor.materias && tutor.materias.map((materia) => {
              const isSelected = selectedSubject?.id_materia === materia.id_materia;
              return (
                <TouchableOpacity
                  key={materia.id_materia}
                  style={[
                    styles.subjectButton,
                    isSelected && styles.selectedButton,
                  ]}
                  onPress={() => setSelectedSubject(materia)}
                >
                  <Text style={[styles.subjectButtonText, isSelected && styles.selectedText]}>
                    {materia.nombre_materia}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Botón de confirmación */}
          {selectedDate && selectedTime && selectedSubject && (
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={handleConfirm}
            >
              <Text style={styles.confirmText}>Confirmar Cita</Text>
            </TouchableOpacity>
          )}

          {/* Resumen de la cita seleccionada */}
          {selectedDate && selectedTime && selectedSubject && (
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>Resumen de tu cita:</Text>
              <Text style={styles.summaryText}>
                Fecha: {selectedDate.toLocaleDateString('es-ES', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
              <Text style={styles.summaryText}>
                Hora: {selectedTime} - {parseInt(selectedTime.split(":")[0]) + 1}:00
              </Text>
              <Text style={styles.summaryText}>
                Materia: {selectedSubject.nombre_materia}
              </Text>
              <Text style={styles.summaryText}>
                Tutor: {tutor.nombre || tutor.usuario?.nombre}
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
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
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  contentWeb: {
    maxWidth: 800,
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 40,
  },
  tutorInfo: {
    backgroundColor: "#e3f2fd",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  tutorName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1976d2",
    marginBottom: 5,
  },
  tutorSchedule: {
    fontSize: 14,
    color: "#546e7a",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 15,
    color: "#333",
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  dateButton: {
    backgroundColor: "#e0e0e0",
    padding: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: "center",
  },
  dateButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  timeButton: {
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  timeButtonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  subjectButton: {
    backgroundColor: "#e0e0e0",
    padding: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: "center",
  },
  subjectButtonText: {
    color: "#333",
    fontSize: 14,
    fontWeight: "500",
  },
  availableSlot: {
    backgroundColor: "#e8f5e8",
    borderColor: "#4caf50",
    borderWidth: 1,
  },
  tutorOccupiedSlot: {
    backgroundColor: "#ffebee",
    borderColor: "#f44336",
    borderWidth: 1,
  },
  studentOccupiedSlot: {
    backgroundColor: "#fff3e0",
    borderColor: "#ff9800",
    borderWidth: 1,
  },
  pastSlot: {
    backgroundColor: "#f5f5f5",
    borderColor: "#9e9e9e",
    borderWidth: 1,
  },
  selectedButton: {
    backgroundColor: "#4CAF50",
    borderColor: "#388e3c",
    borderWidth: 2,
  },
  availableText: {
    color: "#2e7d32",
  },
  tutorOccupiedText: {
    color: "#c62828",
  },
  studentOccupiedText: {
    color: "#ef6c00",
  },
  pastText: {
    color: "#9e9e9e",
  },
  selectedText: {
    color: "#fff",
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    padding: 18,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  confirmText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  infoContainer: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  infoTitle: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
  summaryContainer: {
    backgroundColor: "#e8f5e8",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#4CAF50",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#2e7d32",
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 5,
    color: "#333",
  },
});