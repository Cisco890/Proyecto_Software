import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

export default function Sidebar({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <View style={styles.container}>
      {/* Parte de arriba */}
      <View style={styles.topSection}>
        <Ionicons name="person-circle-outline" size={80} color="white" />
        <Text style={styles.username}>{user?.nombre || 'Usuario'}</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Parte del medio */}
      <View style={styles.middleSection}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="time-outline" size={24} color="white" />
          <Text style={styles.menuText}>Sesiones pasadas</Text>
        </TouchableOpacity>
  {user?.id_perfil === 2 ? (
    <>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <Ionicons name="person-outline" size={24} color="white" />
        <Text style={styles.menuText}>Perfil de Tutor</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('Sessions')}
      >
        <Ionicons name="calendar-outline" size={24} color="white" />
        <Text style={styles.menuText}>Sesiones</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.navigate('Reviews')}
      >
        <Ionicons name="star-outline" size={24} color="white" />
        <Text style={styles.menuText}>Reseñas</Text>
      </TouchableOpacity>
    </>
  ) : (
    <Text style={[styles.menuText, { color: '#fff' }]}>
      Bienvenido estudiante
    </Text>
  )}
</View>


      {/* Parte de abajo */}
      <View style={styles.bottomSection}>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="help-circle-outline" size={24} color="white" />
          <Text style={styles.menuText}>Ayuda</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="person-add-outline" size={24} color="white" />
          <Text style={styles.menuText}>Cambiar usuario</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text style={styles.menuText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingTop: 60,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  topSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  username: {
    color: '#fff',
    fontSize: 20,
    marginTop: 10,
    marginBottom: 10,
  },
  middleSection: {
    flex: 1,
  },
  bottomSection: {
    marginBottom: 20,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
});
