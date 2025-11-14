import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { crearInfoTutor, obtenerInfoTutor, actualizarInfoTutor } from "../../api/api";

export default function TutorProfileScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const opciones = ["virtual", "presencial", "hibrido"];
  const { user, loading: authLoading } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    descripcion: "",
    tarifa: "",
    experiencia: "",
    horario: "",
    modalidad: ""
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [tieneInfo, setTieneInfo] = useState(false);

  const updateFormData = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const loadInfo = async () => {
    try {
      const response = await obtenerInfoTutor(user.id_usuario);
      const info = response.data;

      setFormData({
        descripcion: info.descripcion || "",
        tarifa: info.tarifa_hora?.toString() || "",
        experiencia: info.experiencia?.toString() || "",
        horario: info.horario?.toString() || "",
        modalidad: info.modalidad || ""
      });
      setTieneInfo(true);
    } catch (error) {
      console.warn("Información previa del tutor no disponible:", error.message);
      setTieneInfo(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id_usuario) {
      loadInfo();
    }
  }, [user?.id_usuario]);

  const validarFormulario = () => {
    const { descripcion, tarifa, experiencia, horario, modalidad } = formData;

    if (!descripcion || !tarifa || !experiencia || !horario || !modalidad) {
      Alert.alert("Error de validación", "Todos los campos son obligatorios");
      return false;
    }

    if (isNaN(parseFloat(tarifa)) || parseFloat(tarifa) <= 0) {
      Alert.alert("Error de validación", "La tarifa debe ser un número válido mayor a 0");
      return false;
    }

    if (isNaN(parseInt(experiencia)) || parseInt(experiencia) < 0) {
      Alert.alert("Error de validación", "La experiencia debe ser un número válido no negativo");
      return false;
    }

    const horarioNum = parseInt(horario);
    if (isNaN(horarioNum) || horarioNum < 0 || horarioNum > 2) {
      Alert.alert("Error de validación", "El horario debe ser 0 (mañana), 1 (tarde) o 2 (noche)");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validarFormulario()) {
      return;
    }

    setSubmitting(true);

    try {
      const tutorData = {
        descripcion: formData.descripcion.trim(),
        tarifa_hora: parseFloat(formData.tarifa),
        experiencia: parseInt(formData.experiencia),
        horario: parseInt(formData.horario),
        modalidad: formData.modalidad,
      };

      console.log("Enviando datos al servidor:", {
        idUsuario: user.id_usuario,
        data: tutorData
      });

      let response;
      if (tieneInfo) {
        response = await actualizarInfoTutor(user.id_usuario, tutorData);
        Alert.alert("Operación Exitosa", "Información actualizada correctamente");
      } else {
        response = await crearInfoTutor({
          id_usuario: user.id_usuario,
          ...tutorData
        });
        Alert.alert("Operación Exitosa", "Información guardada correctamente");
        setTieneInfo(true);
      }

      console.log("Respuesta del servidor:", response.data);
      await loadInfo();

    } catch (error) {
      console.error("Error completo en operación:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url
      });

      let mensajeError = "Error de conexión con el servidor";
      
      if (error.response?.data?.error) {
        mensajeError = error.response.data.error;
      } else if (error.message) {
        mensajeError = error.message;
      }
      
      Alert.alert("Error del Sistema", `No se pudo completar la operación: ${mensajeError}`);
    } finally {
      setSubmitting(false);
    }
  };

  const getHorarioTexto = (horarioNum) => {
    const horarios = {
      0: "Mañana (0)",
      1: "Tarde (1)", 
      2: "Noche (2)"
    };
    return horarios[parseInt(horarioNum)] || "Selecciona horario";
  };

  if (authLoading || !user?.id_usuario) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={styles.loadingText}>Cargando información de usuario...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Perfil de Tutor" />

      <View style={styles.content}>
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#000" />
            <Text style={styles.loadingText}>Cargando información del tutor...</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={[
              styles.statusIndicator,
              tieneInfo ? styles.statusHasInfo : styles.statusNoInfo
            ]}>
              <Text style={styles.statusText}>
                {tieneInfo ? "Información guardada" : "Complete su información"}
              </Text>
            </View>

            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.descripcion}
              onChangeText={(value) => updateFormData('descripcion', value)}
              placeholder="Describa su experiencia, metodología, logros académicos..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />

            <Text style={styles.label}>Tarifa por hora ($)</Text>
            <TextInput
              style={styles.input}
              value={formData.tarifa}
              onChangeText={(value) => updateFormData('tarifa', value)}
              keyboardType="numeric"
              placeholder="Ejemplo: 20.00"
            />

            <Text style={styles.label}>Años de experiencia</Text>
            <TextInput
              style={styles.input}
              value={formData.experiencia}
              onChangeText={(value) => updateFormData('experiencia', value)}
              keyboardType="numeric"
              placeholder="Ejemplo: 3"
            />

            <Text style={styles.label}>Horario de preferencia</Text>
            <View style={styles.horarioInfo}>
              <Text style={styles.horarioText}>
                0 = Mañana, 1 = Tarde, 2 = Noche
              </Text>
            </View>
            <TextInput
              style={styles.input}
              value={formData.horario}
              onChangeText={(value) => updateFormData('horario', value)}
              keyboardType="numeric"
              placeholder="Ejemplo: 0 (mañana)"
            />
            {formData.horario && (
              <Text style={styles.horarioSelected}>
                Seleccionado: {getHorarioTexto(formData.horario)}
              </Text>
            )}

            <Text style={styles.label}>Modalidad</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.selectButtonText}>
                {formData.modalidad ? formData.modalidad : "Seleccione una modalidad"}
              </Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  <Text style={styles.modalTitle}>Seleccione modalidad</Text>
                  {opciones.map((opcion) => (
                    <TouchableOpacity
                      key={opcion}
                      style={[
                        styles.modalOption,
                        formData.modalidad === opcion && styles.modalOptionSelected
                      ]}
                      onPress={() => {
                        updateFormData('modalidad', opcion);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={[
                        styles.modalOptionText,
                        formData.modalidad === opcion && styles.modalOptionTextSelected
                      ]}>
                        {opcion}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Modal>

            <TouchableOpacity 
              style={[styles.button, submitting && styles.buttonDisabled]} 
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {tieneInfo ? "Actualizar Información" : "Guardar Información"}
                </Text>
              )}
            </TouchableOpacity>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>
                {tieneInfo ? "Información guardada" : "Información importante"}
              </Text>
              <Text style={styles.infoText}>
                {tieneInfo 
                  ? "Puede modificar su información en cualquier momento. Los cambios se reflejarán inmediatamente en su perfil."
                  : "Complete todos los campos para que los estudiantes puedan encontrarlo y agendar tutorías con usted."
                }
              </Text>
            </View>
          </ScrollView>
        )}
      </View>

      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  statusIndicator: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  statusHasInfo: {
    backgroundColor: "#e8f5e8",
    borderColor: "#4caf50",
    borderWidth: 1,
  },
  statusNoInfo: {
    backgroundColor: "#fff3e0",
    borderColor: "#ff9800",
    borderWidth: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 16,
    color: "#333",
  },
  input: {
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  horarioInfo: {
    backgroundColor: "#e3f2fd",
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  horarioText: {
    fontSize: 12,
    color: "#1976d2",
    fontStyle: "italic",
  },
  horarioSelected: {
    fontSize: 14,
    color: "#4caf50",
    marginBottom: 15,
    fontStyle: "italic",
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonDisabled: {
    backgroundColor: "#cccccc",
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectButton: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: "#f8f9fa",
  },
  selectButtonText: {
    fontSize: 16,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#333",
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalOptionSelected: {
    backgroundColor: "#e8f5e8",
    borderRadius: 6,
  },
  modalOptionText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  modalOptionTextSelected: {
    color: "#4caf50",
    fontWeight: "bold",
  },
  infoBox: {
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#2196f3",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});