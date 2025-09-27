import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import TutorDetailScreen from "../screens/TutorDetailScreen";
import DrawerNavigator from "./DrawerNavigator";
import AppointmentBookingScreen from "../screens/AppointmentBookingScreen";
import DebugPanelScreen from "../screens/DebugPanelScreen";
import UpcomingAppointmentsScreen from "../screens/UpcomingAppointmentsScreen";
import ReviewRequestsScreen from "../screens/Tutor/ReviewRequestsScreen";
import AppointmentDetailScreen from "../screens/Tutor/AppointmentDetailScreen";

import { IS_DEV_MODE } from "../utils/config";

const Stack = createNativeStackNavigator();

export default function MainStack() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;

  const initialRoute =
    IS_DEV_MODE && !user ? "DebugPanel" : user ? "DrawerNavigator" : "Login";

  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={initialRoute}
    >
      {/* Pantallas normales */}
      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
      <Stack.Screen name="TutorDetail" component={TutorDetailScreen} />
      <Stack.Screen name="AppointmentBooking" component={AppointmentBookingScreen}/>
      <Stack.Screen name="UpcomingAppointments" component={UpcomingAppointmentsScreen} />
      <Stack.Screen name="ReviewRequests" component={ReviewRequestsScreen} />
      <Stack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />

      {/* Debug panel solo visible en dev mode */}
      {IS_DEV_MODE && (
        <Stack.Screen name="DebugPanel" component={DebugPanelScreen} />
      )}

      {/* Login solo visible en producción o sin usuario */}
      {!user && !IS_DEV_MODE && (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
