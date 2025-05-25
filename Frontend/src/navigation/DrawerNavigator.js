import { createDrawerNavigator } from '@react-navigation/drawer';
import { useContext } from 'react';
import HomeScreen from '../screens/HomeScreen';
import Sidebar from '../components/Sidebar';
import { AuthContext } from '../context/AuthContext';

// Pantallas para tutores
import TutorProfileScreen from '../screens/Tutor/TutorProfileScreen';
import TutorSessionsScreen from '../screens/Tutor/TutorSessionsScreen';
import TutorReviewsScreen from '../screens/Tutor/TutorReviewsScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <Sidebar {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        overlayColor: 'transparent',
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Profile" component={TutorProfileScreen} />
      <Drawer.Screen name="Sessions" component={TutorSessionsScreen} />
      <Drawer.Screen name="Reviews" component={TutorReviewsScreen} />

    </Drawer.Navigator>
  );
}
