import { View, FlatList, StyleSheet, Text } from 'react-native';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchBar from '../components/SearchBar';
import FiltersModal from '../components/FiltersModal';
import TutorCard from '../components/TutorCard';
import { useState } from 'react';

export default function HomeScreen() {
  const [searchText, setSearchText] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);

  // Simulación de tutores
  const tutores = [
    {
      id: '1',
      nombre: 'Cisco Ramírez',
      rating: 4,
      materias: ['Cálculo', 'Física'],
      fecha: '16/06/2024',
      horas: 2,
    },
    {
      id: '2',
      nombre: 'Ana López',
      rating: 5,
      materias: ['Programación', 'Bases de Datos'],
      fecha: '18/06/2024',
      horas: 1.5,
    },
    {
      id: '3',
      nombre: 'Juan Pérez',
      rating: 3,
      materias: ['Química', 'Biología'],
      fecha: '20/06/2024',
      horas: 2.5,
    },
  ];

  const openFilters = () => {
    setFiltersVisible(true);
  };

  const applyFilters = (filters) => {
    console.log('Filtros seleccionados:', filters);
    setSelectedFilters(filters);
    setFiltersVisible(false);
  };

  const filteredTutores = tutores.filter((tutor) => {
    // Filtro básico: por texto de búsqueda
    const matchesSearch = tutor.nombre.toLowerCase().includes(searchText.toLowerCase());
    // Filtro por materias seleccionadas
    const matchesFilters = selectedFilters.length === 0 || tutor.materias.some((materia) =>
      selectedFilters.includes(materia)
    );
    return matchesSearch && matchesFilters;
  });

  return (
    <View style={styles.container}>
      <Header title="Buscar tutores" />

      <View style={styles.content}>
        <SearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          onOpenFilters={openFilters}
        />

        <FlatList
          data={filteredTutores}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TutorCard tutor={item} />}
          ListEmptyComponent={<Text style={styles.emptyText}>No se encontraron tutores</Text>}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      <Footer />

      <FiltersModal
        visible={filtersVisible}
        onClose={() => setFiltersVisible(false)}
        onApply={applyFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#777',
  },
});
