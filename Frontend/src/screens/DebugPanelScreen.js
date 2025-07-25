import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { AuthContext } from "../context/AuthContext";
import { getUsuarios, getEstudiantes } from "../api/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function DebugPanelScreen() {
  const { login } = useContext(AuthContext);
  const [tutores, setTutores] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTutores, setShowTutores] = useState(false);
  const [showEstudiantes, setShowEstudiantes] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tutoresRes, estudiantesRes] = await Promise.all([
          getUsuarios(),
          getEstudiantes(),
        ]);
        setTutores(tutoresRes.data || []);
        setEstudiantes(estudiantesRes.data || []);
      } catch (err) {
        console.error("❌ Error cargando usuarios:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLoginAs = (user) => {
    login(user);
  };

  return (
    <View style={styles.container}>
      <Header title="Debug Panel" />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Seleccionar usuario de prueba</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4CAF50" />
        ) : (
          <>
            {/* Estudiantes */}
            <TouchableOpacity
              style={styles.sectionToggle}
              onPress={() => setShowEstudiantes((prev) => !prev)}
            >
              <Text style={styles.subheading}>
                Estudiantes ({estudiantes.length})
              </Text>
              <Text style={styles.toggleIcon}>
                {showEstudiantes ? "▲" : "▼"}
              </Text>
            </TouchableOpacity>
            {showEstudiantes &&
              estudiantes.map((u) => (
                <TouchableOpacity
                  key={`est-${u.id_usuario}`}
                  style={styles.userButton}
                  onPress={() => handleLoginAs(u)}
                >
                  <Text style={styles.userText}>
                    {u.nombre} (ID: {u.id_usuario})
                  </Text>
                </TouchableOpacity>
              ))}

            {/* Tutores */}
            <TouchableOpacity
              style={styles.sectionToggle}
              onPress={() => setShowTutores((prev) => !prev)}
            >
              <Text style={styles.subheading}>Tutores ({tutores.length})</Text>
              <Text style={styles.toggleIcon}>{showTutores ? "▲" : "▼"}</Text>
            </TouchableOpacity>
            {showTutores &&
              tutores.map((u) => (
                <TouchableOpacity
                  key={`tutor-${u.id_usuario}`}
                  style={styles.userButton}
                  onPress={() => handleLoginAs(u)}
                >
                  <Text style={styles.userText}>
                    {u.nombre} (ID: {u.id_usuario})
                  </Text>
                </TouchableOpacity>
              ))}
          </>
        )}
      </ScrollView>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 100 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  subheading: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  sectionToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
  },
  toggleIcon: {
    fontSize: 16,
    color: "#777",
  },
  userButton: {
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 6,
    marginBottom: 8,
  },
  userText: {
    fontSize: 15,
    color: "#333",
  },
});
