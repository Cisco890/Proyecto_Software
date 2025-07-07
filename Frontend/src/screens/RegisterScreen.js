import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { register as registerApi } from '../api/api';
import { useNavigation } from '@react-navigation/native';
import { Modal } from 'react-native';


export default function RegisterScreen() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [telefono, setTelefono] = useState('');
  const [esTutor, setEsTutor] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');


  const { login } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleRegister = async () => {
    if (!nombre || !correo || !contrasena || !telefono) {
      setModalMessage('Todos los campos son obligatorios');
      setModalVisible(true);
    return;
}

  try {
    const userData = {
      nombre,
      correo,
      contrasena,
      telefono,
      tipo_usuario: esTutor ? 'tutor' : 'estudiante'
    };

  console.log('📦 Datos enviados:', userData);
  const response = await registerApi(userData);
  console.log('✅ Registro exitoso:', response.data);

  login(response.data);
  setModalMessage('Registro exitoso. ¡Bienvenido!');
  setModalVisible(true);

    } catch (error) {
      console.error('❌ Error en el registro:', error.response?.data || error.message);
      setModalMessage(error.response?.data?.error || 'Error al registrarse');
      setModalVisible(true);
    }
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
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={styles.container}>
        <Text style={styles.title}>Regístrate</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre completo"
          value={nombre}
          onChangeText={setNombre}
        />

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          value={correo}
          onChangeText={setCorreo}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={contrasena}
          onChangeText={setContrasena}
          secureTextEntry
        />

        <TextInput
          style={styles.input}
          placeholder="Teléfono"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>¿Eres tutor?</Text>
          <Switch value={esTutor} onValueChange={setEsTutor} />
        </View>

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.goBackText}>¿Ya tienes cuenta? Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  switchLabel: {
    color: '#fff',
    fontSize: 16,
    marginRight: 10,
  },
  button: {
    backgroundColor: '#000',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  goBackText: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
