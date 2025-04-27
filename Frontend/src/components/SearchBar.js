import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBar({ searchText, setSearchText, onOpenFilters }) {
  return (
    <View style={styles.container}>
      <View style={styles.searchSection}>
        <Ionicons name="search-outline" size={24} color="gray" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Busca un tutor o materia"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
      <TouchableOpacity style={styles.filterButton} onPress={onOpenFilters}>
        <Ionicons name="filter-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 10,
    marginHorizontal: 10,
    marginTop: 20,
  },
  searchSection: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  icon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
  },
  filterButton: {
    backgroundColor: '#4CAF50',
    marginLeft: 10,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
