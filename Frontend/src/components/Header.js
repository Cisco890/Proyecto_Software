import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import { IS_DEV_MODE } from "../utils/config";

export default function Header({ title = "" }) {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ backgroundColor: "#4CAF50" }}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Ionicons name="menu" size={32} color="white" />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>

        {IS_DEV_MODE && (
          <TouchableOpacity
            style={styles.debugButton}
            onPress={() => navigation.navigate("DebugPanel")}
          >
            <Ionicons name="bug-outline" size={28} color="white" />
          </TouchableOpacity>
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
