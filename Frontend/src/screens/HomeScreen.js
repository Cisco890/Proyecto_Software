import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
} from "react-native";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SearchBar from "../components/SearchBar";
import FiltersModal from "../components/FiltersModal";
import TutorCard from "../components/TutorCard";
import React, { useState, useEffect } from "react";
import { getUsuarios, obtenerRatingDelTutor } from "../api/api";

export default function HomeScreen() {
  const [searchText, setSearchText] = useState("");
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [tutores, setTutores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar tutores desde el backend
  useEffect(() => {
    const fetchTutores = async () => {
      try {
        const res = await getUsuarios();
        const usuarios = res.data;

        const tutoresConRating = await Promise.all(
          usuarios.map(async (tutor) => {
            const info = tutor.tutorInfo || {};

            let rating = 0;
            try {
              const r = await obtenerRatingDelTutor(tutor.id_usuario);
              rating = r.data?.rating_promedio ?? 0;
            } catch (err) {
              console.warn(
                `⚠️ No se pudo obtener rating para tutor ${tutor.id_usuario}`
              );
            }

            return {
              id: tutor.id_usuario?.toString() || "0",
              nombre: tutor.nombre || "Sin nombre",
              foto: tutor.foto_perfil,
              rating,
              materias: info.tutorMaterias?.map(
                (m) => m?.materia?.nombre_materia || "Materia desconocida"
              ) || ["Sin materias"],
              fecha: info.fecha_disponible || "No definida",
              horas: info.horas_disponibles ?? 0,
              tarifa: info.tarifa_hora ?? 0,
              modalidad: info.modalidad || "No definida",
              descripcion: info.descripcion || "Sin descripción",
              experiencia: info.experiencia ?? 0,
              horario: info.horario ?? null,
            };
          })
        );

        setTutores(tutoresConRating);
      } catch (err) {
        console.error("❌ Error al obtener tutores:", err.message || err);
      } finally {
        setLoading(false);
      }
    };

    fetchTutores();
  }, []);

  const openFilters = () => {
    setFiltersVisible(true);
  };

  const applyFilters = (filters) => {
    console.log("Filtros seleccionados:", filters);
    setSelectedFilters(filters);
    setFiltersVisible(false);
  };

  const filteredTutores = tutores.filter((tutor) => {
    const matchesSearch = tutor.nombre
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesMateria = tutor.materias.some((materia) =>
      selectedFilters.includes(materia)
    );

    const matchesModalidad = selectedFilters.includes(tutor.modalidad);

    const matchesFilters =
      selectedFilters.length === 0 || matchesMateria || matchesModalidad;

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

        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <FlatList
            data={filteredTutores}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TutorCard tutor={item} />}
            ListEmptyComponent={
              <Text style={styles.emptyText}>No se encontraron tutores</Text>
            }
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
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
    backgroundColor: "#fff",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
    color: "#777",
  },
});
