import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { crearInfoTutor, obtenerInfoTutor } from "../../api/api";

export default function TutorProfileScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const opciones = ["virtual", "presencial", "hibrido"];
  const { user, loading: authLoading } = useContext(AuthContext);

  const [descripcion, setDescripcion] = useState("");
  const [tarifa, setTarifa] = useState("");
  const [experiencia, setExperiencia] = useState("");
  const [horario, setHorario] = useState("");
  const [modalidad, setModalidad] = useState("");
  const [loading, setLoading] = useState(true);

  const loadInfo = async () => {
    try {
      const res = await obtenerInfoTutor(user.id_usuario);
      const info = res.data;

      setDescripcion(info.descripcion || "");
      setTarifa(info.tarifa_hora?.toString() || "");
      setExperiencia(info.experiencia?.toString() || "");
      setHorario(info.horario?.toString() || "");
      setModalidad(info.modalidad || "");
    } catch (err) {
      console.warn(
        "ℹ️ No hay información previa del tutor o no se pudo obtener."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("👤 ID del usuario desde contexto:", user?.id_usuario);
    if (user?.id_usuario) {
      loadInfo();
    }
  }, [user?.id_usuario]);

  const handleSubmit = async () => {
    try {
      await crearInfoTutor({
        id_usuario: user.id_usuario,
        descripcion,
        tarifa_hora: parseFloat(tarifa),
        experiencia: parseInt(experiencia),
        horario: parseInt(horario),
        modalidad,
      });

      alert("✅ Información guardada correctamente");
      loadInfo();
    } catch (err) {
      const mensaje =
        err?.response?.data?.error || "Error al guardar la información";
      alert(`❌ ${mensaje}`);
      console.error("❌ Error al guardar la información:", err);
    }
  };

  if (authLoading || !user?.id_usuario) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header title="Perfil de Tutor" />

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
            <Text style={styles.label}>Descripción</Text>
            <TextInput
              style={styles.input}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Describe tu experiencia, logros, etc."
              multiline
            />

            <Text style={styles.label}>Tarifa por hora ($)</Text>
            <TextInput
              style={styles.input}
              value={tarifa}
              onChangeText={setTarifa}
              keyboardType="numeric"
              placeholder="Ej: 20"
            />

            <Text style={styles.label}>Años de experiencia</Text>
            <TextInput
              style={styles.input}
              value={experiencia}
              onChangeText={setExperiencia}
              keyboardType="numeric"
              placeholder="Ej: 3"
            />

            <Text style={styles.label}>Horario (0-23)</Text>
            <TextInput
              style={styles.input}
              value={horario}
              onChangeText={setHorario}
              keyboardType="numeric"
              placeholder="Ej: 14"
            />

            <Text style={styles.label}>Modalidad</Text>
            <TouchableOpacity
              style={styles.selectButton}
              onPress={() => setModalVisible(true)}
            >
              <Text style={styles.selectButtonText}>
                {modalidad ? modalidad : "Selecciona una modalidad"}
              </Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                  {opciones.map((opcion) => (
                    <TouchableOpacity
                      key={opcion}
                      style={styles.modalOption}
                      onPress={() => {
                        setModalidad(opcion);
                        setModalVisible(false);
                      }}
                    >
                      <Text style={styles.modalOptionText}>{opcion}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </Modal>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
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
  },
  content: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 6,
    fontSize: 16,
    color: "#333",
  },
  input: {
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  selectButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
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

  modalOption: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  modalOptionText: {
    fontSize: 16,
    textAlign: "center",
  },
});
