import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import React, { useState, useContext } from "react";
import { login as loginApi } from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { Modal } from "react-native";

export default function LoginScreen({ navigation }) {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const { login } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await loginApi(correo, contrasena);
      console.log("✅ Login exitoso:", response.data);
      login(response.data.user);
      console.log("🚀 Usuario logueado:", response.data.user);

      setModalMessage("Inicio de sesión exitoso");
      setModalVisible(true);
    } catch (error) {
      console.error(
        "❌ Error en el login:",
        error.response?.data || error.message
      );
      setModalMessage("Correo o contraseña incorrectos");
      setModalVisible(true);
    }
  };

  const goToRegister = () => {
    navigation.navigate("Register");
  };

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.container}>
        <Text style={styles.logo}>UVG</Text>

        <Text style={styles.label}>Correo</Text>
        <TextInput
          style={styles.input}
          value={correo}
          onChangeText={setCorreo}
          placeholder="Ingresa tu correo"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={styles.label}>Contraseña</Text>
        <TextInput
          style={styles.input}
          value={contrasena}
          onChangeText={setContrasena}
          placeholder="Ingresa tu contraseña"
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.registerButton} onPress={goToRegister}>
          <Text style={styles.registerButtonText}>
            ¿No tienes cuenta? Regístrate
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4CAF50",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  logo: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 40,
  },
  label: {
    alignSelf: "flex-start",
    color: "#000",
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#000",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
  registerButton: {
    marginTop: 20,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 14,
    textDecorationLine: "underline",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: 300,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalButton: {
    marginTop: 10,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});
