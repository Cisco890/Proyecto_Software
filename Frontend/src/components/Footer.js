import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Footer() {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
      >
        <Ionicons name="arrow-back-outline" size={32} color="black" />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("DrawerNavigator", { screen: "Home" })
        }
        accessibilityRole="button"
      >
        <Ionicons name="home-outline" size={32} color="black" />
      </TouchableOpacity>

      {user?.id_perfil === 2 ? (
        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          accessibilityRole="button"
        >
          <Ionicons name="person-circle-outline" size={32} color="black" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity disabled accessibilityRole="button">
          <Ionicons name="person-circle-outline" size={32} color="#aaa" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#e0e0e0",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 10,
    paddingBottom: 30,
  },
});
