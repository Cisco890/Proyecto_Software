import { Modal, View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

export default function FiltersModal({ visible, onClose, onApply }) {
  const [selectedFilters, setSelectedFilters] = useState([]);

  const filters = [
    'Matemáticas',
    'Física',
    'Química',
    'Programación',
    'Idiomas',
    'Electrónica',
    'Biología',
  ];

  const toggleFilter = (filter) => {
    if (selectedFilters.includes(filter)) {
      setSelectedFilters(selectedFilters.filter((item) => item !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const handleApply = () => {
    onApply(selectedFilters);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Filtros</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter}
                style={[
                  styles.filterButton,
                  selectedFilters.includes(filter) && styles.filterButtonSelected,
                ]}
                onPress={() => toggleFilter(filter)}
              >
                <Text style={[
                  styles.filterButtonText,
                  selectedFilters.includes(filter) && styles.filterButtonTextSelected,
                ]}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
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
    height: '70%',
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
