import React, { useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const AppointmentBookingScreen = ({ navigation }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleDateSelection = (date) => setSelectedDate(date);
  const handleTimeSelection = (time) => setSelectedTime(time);

  const handleConfirm = () => {
    // Aquí se podría guardar la cita en un backend
    alert(`Cita para el ${selectedDate} a las ${selectedTime}`);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Agendar Cita</Text>

      <Text style={styles.label}>Selecciona una fecha:</Text>
      {/* Por ahora usamos botones fijos, luego se reemplaza por un calendario */}
      <View style={styles.buttonGroup}>
        {["2025-07-15", "2025-07-16", "2025-07-17"].map((date) => (
          <Button
            key={date}
            title={date}
            onPress={() => handleDateSelection(date)}
          />
        ))}
      </View>

      {selectedDate && (
        <>
          <Text style={styles.label}>Selecciona una hora:</Text>
          <View style={styles.buttonGroup}>
            {["09:00", "11:00", "14:00"].map((time) => (
              <Button
                key={time}
                title={time}
                onPress={() => handleTimeSelection(time)}
              />
            ))}
          </View>
        </>
      )}

      {selectedDate && selectedTime && (
        <Button title="Confirmar Cita" onPress={handleConfirm} />
      )}
    </View>
  );
};

export default AppointmentBookingScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  heading: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 16, marginTop: 15 },
  buttonGroup: { flexDirection: "column", gap: 10, marginVertical: 10 },
});
