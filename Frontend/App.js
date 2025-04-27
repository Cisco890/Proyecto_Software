import { NavigationContainer } from '@react-navigation/native';
import MainStack from './src/navigation/MainStack';
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <MainStack />
      </AuthProvider>
    </NavigationContainer>
  );
}
