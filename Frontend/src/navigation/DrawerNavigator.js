import { createDrawerNavigator } from "@react-navigation/drawer";
import React, { useContext } from "react";
import { Platform, Dimensions } from "react-native";
import HomeScreen from "../screens/HomeScreen";
import Sidebar from "../components/Sidebar";
import { AuthContext } from "../context/AuthContext";

// Pantallas para tutores
import TutorProfileScreen from "../screens/Tutor/TutorProfileScreen";
import TutorSessionsScreen from "../screens/Tutor/TutorSessionsScreen";
import TutorReviewsScreen from "../screens/Tutor/TutorReviewsScreen";

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const { user } = useContext(AuthContext);

  const isWeb = Platform.OS === 'web';
  const screenWidth = Dimensions.get('window').width;

  return (
    <Drawer.Navigator
      drawerContent={(props) => <Sidebar {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: isWeb && screenWidth > 768 ? "permanent" : "slide",
        overlayColor: "transparent",
        drawerStyle: isWeb && screenWidth > 768 ? {
          width: 300,
        } : undefined,
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={TutorProfileScreen} />
      <Drawer.Screen name="Sessions" component={TutorSessionsScreen} />
      <Drawer.Screen name="Reviews" component={TutorReviewsScreen} />
    </Drawer.Navigator>
  );
}
