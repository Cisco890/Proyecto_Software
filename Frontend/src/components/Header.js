import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Platform,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { IS_DEV_MODE } from "../utils/config";

export default function Header({ title = "" }) {
  const navigation = useNavigation();

  const handleMenuPress = () => {
    try {
      // Intenta abrir el drawer si existe
      if (navigation.openDrawer) {
        navigation.openDrawer();
      } else {
        // Si no está en un DrawerNavigator, navega al Home que sí tiene el drawer
        navigation.navigate("DrawerNavigator", { screen: "Home" });
      }
    } catch (error) {
      console.log("Error al abrir menú:", error);
      // Como fallback, intenta navegar al DrawerNavigator
      navigation.navigate("DrawerNavigator");
    }
  };

  const isWeb = Platform.OS === 'web';
  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView style={{ backgroundColor: "#4CAF50" }}>
      <View style={[styles.container, isWeb && screenWidth > 768 && styles.containerWeb]}>
        <TouchableOpacity onPress={handleMenuPress}>
          <Ionicons name="menu" size={32} color="white" />
        </TouchableOpacity>

        <View style={styles.titleWrapper}>
          <Text style={styles.title}>{title}</Text>
        </View>

        {IS_DEV_MODE ? (
          <TouchableOpacity
            style={styles.debugButton}
            onPress={() => navigation.navigate("DebugPanel")}
          >
            <Ionicons name="bug-outline" size={28} color="white" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 32 }} /> // para mantener centrado el título
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: "space-between",
    position: "relative",
  },
  containerWeb: {
    maxWidth: 1200,
    alignSelf: "center",
    width: "100%",
  },
  titleWrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: -1,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  debugButton: {
    marginLeft: "auto",
  },
});
