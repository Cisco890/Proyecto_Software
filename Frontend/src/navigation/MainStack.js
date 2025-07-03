import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import TutorDetailScreen from "../screens/TutorDetailScreen";
import DrawerNavigator from "./DrawerNavigator";
import AppointmentBookingScreen from "../screens/AppointmentBookingScreen";

const Stack = createNativeStackNavigator();

export default function MainStack() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
          <Stack.Screen name="TutorDetail" component={TutorDetailScreen} />
          <Stack.Screen
            name="AppointmentBooking"
            component={AppointmentBookingScreen}
          />
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
