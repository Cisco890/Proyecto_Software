import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import TutorDetailScreen from "../screens/TutorDetailScreen";
import DrawerNavigator from "./DrawerNavigator";
import AppointmentBookingScreen from "../screens/AppointmentBookingScreen";
import DebugPanelScreen from "../screens/DebugPanelScreen";

const Stack = createNativeStackNavigator();
import { IS_DEV_MODE } from "../utils/config";

export default function MainStack() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return null;
  }

  const allowWithoutLogin = IS_DEV_MODE || user;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {allowWithoutLogin ? (
        <>
          <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
          <Stack.Screen name="TutorDetail" component={TutorDetailScreen} />
          <Stack.Screen
            name="AppointmentBooking"
            component={AppointmentBookingScreen}
          />
          {IS_DEV_MODE && (
            <Stack.Screen name="DebugPanel" component={DebugPanelScreen} />
          )}
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
