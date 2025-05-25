import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { filtrarTutoresPorMateria, filtrarTutoresPorModalidad, filtrarTutoresPorExperiencia, filtrarTutoresPorPrecio, buscarTutoresPorNombre } from '../api/api';

export default function FiltersModal({ visible, onClose, onApply }) {
  const [selectedMateria, setSelectedMateria] = useState(null);
  const [modalidad, setModalidad] = useState('');
  const [experiencia, setExperiencia] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    // Simulando materias porque no tenemos un endpoint real para obtenerlas
    setMaterias([
      { id: 1, nombre: 'Matemáticas' },
      { id: 2, nombre: 'Física' },
      { id: 3, nombre: 'Química' },
      { id: 4, nombre: 'Programación' },
      { id: 5, nombre: 'Idiomas' },
    ]);
  }, []);

  const handleApply = async () => {
    try {
      let resultado = null;

      if (selectedMateria) {
        resultado = await filtrarTutoresPorMateria(selectedMateria);
      } else if (modalidad) {
        resultado = await filtrarTutoresPorModalidad(modalidad);
      } else if (experiencia) {
        resultado = await filtrarTutoresPorExperiencia(experiencia);
      } else if (precioMax) {
        resultado = await filtrarTutoresPorPrecio(precioMax);
      }

      if (resultado?.data) {
        onApply(resultado.data);
      }
    } catch (error) {
      console.error('Error aplicando filtros:', error);
    } finally {
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Filtros</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            <Text style={styles.label}>Materia</Text>
            {materias.map((materia) => (
              <TouchableOpacity
                key={materia.id}
                style={[
                  styles.filterButton,
                  selectedMateria === materia.id && styles.filterButtonSelected,
                ]}
                onPress={() => setSelectedMateria(materia.id)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedMateria === materia.id && styles.filterButtonTextSelected,
                  ]}
                >
                  {materia.nombre}
                </Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.label}>Modalidad</Text>
            {['virtual', 'presencial', 'hibrido'].map((mod) => (
              <TouchableOpacity
                key={mod}
                style={[
                  styles.filterButton,
                  modalidad === mod && styles.filterButtonSelected,
                ]}
                onPress={() => setModalidad(mod)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    modalidad === mod && styles.filterButtonTextSelected,
                  ]}
                >
                  {mod}
                </Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.label}>Experiencia mínima (años)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={experiencia}
              onChangeText={setExperiencia}
              placeholder="Ej: 2"
            />

            <Text style={styles.label}>Precio máximo ($/hora)</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={precioMax}
              onChangeText={setPrecioMax}
              placeholder="Ej: 25"
            />
          </ScrollView>

          <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
            <Text style={styles.applyButtonText}>Aplicar filtros</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: '80%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  filterButton: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    marginBottom: 10,
  },
  filterButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  filterButtonText: {
    fontSize: 16,
    color: '#000',
  },
  filterButtonTextSelected: {
    color: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    marginBottom: 15,
  },
  applyButton: {
    marginTop: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});
