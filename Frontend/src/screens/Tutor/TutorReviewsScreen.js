import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { obtenerRatingDelTutor, obtenerInfoTutor } from "../../api/api";
import { AuthContext } from "../../context/AuthContext";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function TutorReviewsScreen() {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id_usuario) return;

      try {
        const [ratingRes, infoRes] = await Promise.all([
          obtenerRatingDelTutor(user.id_usuario),
          obtenerInfoTutor(user.id_usuario),
        ]);

        setRating(ratingRes.data?.rating_promedio || 0);
        setReviews(infoRes.data?.comentarios || []);
      } catch (error) {
        console.error("Error cargando reseñas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const renderReview = ({ item }) => (
    <View style={styles.reviewItem}>
      <Text style={styles.reviewText}>⭐ {item.calificacion}</Text>
      <Text style={styles.comment}>{item.comentario || "Sin comentario"}</Text>
      <Text style={styles.date}>
        {new Date(item.fecha).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="Mis reseñas" />

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <>
            <Text style={styles.average}>⭐ Promedio: {rating.toFixed(1)}</Text>
            <FlatList
              data={reviews}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderReview}
              ListEmptyComponent={
                <Text style={styles.emptyText}>No hay reseñas aún.</Text>
              }
            />
          </>
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
    backgroundColor: "#fff",
    padding: 10,
  },
  average: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  reviewItem: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
  },
  reviewText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  comment: {
    fontSize: 15,
    color: "#555",
    marginTop: 5,
  },
  date: {
    fontSize: 13,
    color: "#999",
    marginTop: 3,
  },
  emptyText: {
    textAlign: "center",
    marginTop: 50,
    color: "#888",
  },
});
