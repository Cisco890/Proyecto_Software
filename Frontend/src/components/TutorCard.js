import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function TutorCard({ tutor }) {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('TutorDetail', { tutor });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/bolamarilla.png')}
          style={styles.profileImage}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{tutor.nombre}</Text>
          <View style={styles.rating}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Ionicons
                key={index}
                name={index < tutor.rating ? 'star' : 'star-outline'}
                size={16}
                color="#FFD700"
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.subjects}>
        {tutor.materias.map((materia, index) => (
          <Text key={index} style={styles.subject}>
            {materia}
          </Text>
        ))}
      </View>

      <View style={styles.extraInfo}>
        <Text style={styles.textSmall}>
          Modalidad: {tutor.modalidad || 'No definida'}
        </Text>
        <Text style={styles.textSmall}>
          Horario: {tutor.horario !== null ? tutor.horario : 'Sin horario'}
        </Text>
      </View>

      {/* <View style={styles.footer}>
        <Text style={styles.date}>{tutor.fecha}</Text>
        <Text style={styles.hours}>{tutor.horas} h</Text>
      </View> */}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    backgroundColor: '#ccc',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  rating: {
    flexDirection: 'row',
    marginTop: 5,
  },
  subjects: {
    marginTop: 10,
    marginBottom: 10,
  },
  subject: {
    fontSize: 14,
    color: '#555',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  date: {
    fontSize: 12,
    color: '#777',
  },
  hours: {
    fontSize: 12,
    color: '#777',
  },
  extraInfo: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 8,
},

textSmall: {
  fontSize: 13,
  color: '#555',
},

});
