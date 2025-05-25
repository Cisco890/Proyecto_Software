import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { crearInfoTutor, obtenerInfoTutor } from '../../api/api';

export default function TutorProfileScreen() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    descripcion: '',
    tarifa_hora: '',
    experiencia: '',
    horario: '',
    modalidad: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await obtenerInfoTutor(user.id_usuario);
        if (res.data) {
          setForm({
            descripcion: res.data.descripcion || '',
            tarifa_hora: String(res.data.tarifa_hora || ''),
            experiencia: String(res.data.experiencia || ''),
            horario: String(res.data.horario || ''),
            modalidad: res.data.modalidad || '',
          });
        }
      } catch (error) {
        console.log('No existing tutor info');
      }
    };

    if (user?.id_usuario) {
      fetchData();
    }
  }, [user]);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        id_usuario: user.id_usuario,
        tarifa_hora: parseFloat(form.tarifa_hora),
        experiencia: parseInt(form.experiencia),
        horario: parseInt(form.horario),
      };
      await crearInfoTutor(payload);
      Alert.alert('Éxito', 'Información registrada correctamente');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo guardar la información');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Tutor Profile</Text>

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={4}
        value={form.descripcion}
        onChangeText={(text) => handleChange('descripcion', text)}
      />

      <Text style={styles.label}>Hourly Rate ($)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.tarifa_hora}
        onChangeText={(text) => handleChange('tarifa_hora', text)}
      />

      <Text style={styles.label}>Experience (years)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.experiencia}
        onChangeText={(text) => handleChange('experiencia', text)}
      />

      <Text style={styles.label}>Available Hour (0-23)</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={form.horario}
        onChangeText={(text) => handleChange('horario', text)}
      />

      <Text style={styles.label}>Modality</Text>
      <TextInput
        style={styles.input}
        placeholder="virtual | presencial | hibrido"
        value={form.modalidad}
        onChangeText={(text) => handleChange('modalidad', text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
