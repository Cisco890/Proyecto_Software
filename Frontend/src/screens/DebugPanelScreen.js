import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button, ScrollView } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { getUsuarios } from "../api/api";

export default function DebugPanelScreen() {
  const { login } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    getUsuarios()
      .then((res) => setUsuarios(res.data))
      .catch(console.error);
  }, []);

  return (
    <ScrollView>
      <Text>👩‍🎓 Estudiantes / 👨‍🏫 Tutores</Text>
      {usuarios.map((u) => (
        <Button
          key={u.id_usuario}
          title={`${u.nombre} (${u.id_perfil === 2 ? "Tutor" : "Estudiante"})`}
          onPress={() => login(u)}
        />
      ))}
    </ScrollView>
  );
}
