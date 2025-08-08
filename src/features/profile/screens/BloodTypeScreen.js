// 📁 src/features/profile/screens/BloodTypeScreen.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import styles from '../styles/BloodTypeScreenStyles';

/**
 * Tela para visualização e edição do tipo sanguíneo do paciente
 * Segue o padrão MVVM e Design Patterns para modularidade e manutenção
 */
export default function BloodTypeScreen({ navigation }) {
  // 🧠 ViewModel: estados controlados dos campos
  const [tipoSanguineo, setTipoSanguineo] = useState('A');
  const [fatorRh, setFatorRh] = useState('+');

  const nomePaciente = 'Edilson Carlos Silva Lima'; // Simulação do nome do contexto de login

  const handleSalvar = () => {
    // Aqui seria enviada a atualização para a tabela mw03paciente
    console.log({ tipoSanguineo, fatorRh });
    alert('Dados atualizados com sucesso!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🔹 Cabeçalho */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="blood-bag" size={40} color="#e53935" />
        <Text style={styles.title}>Tipo Sanguíneo do Paciente</Text>
        <Text style={styles.name}>{nomePaciente}</Text>
      </View>

      {/* 🔹 Formulário */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Tipo Sanguíneo</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={tipoSanguineo}
            onValueChange={(item) => setTipoSanguineo(item)}
          >
            <Picker.Item label="A" value="A" />
            <Picker.Item label="B" value="B" />
            <Picker.Item label="AB" value="AB" />
            <Picker.Item label="O" value="O" />
          </Picker>
        </View>

        <Text style={styles.label}>Fator RH</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={fatorRh}
            onValueChange={(item) => setFatorRh(item)}
          >
            <Picker.Item label="+" value="+" />
            <Picker.Item label="−" value="−" />
          </Picker>
        </View>
      </View>

      {/* 🔹 Botões */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
        <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
        <Text style={styles.saveButtonText}>  Salvar Dados</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
        <Text style={styles.exitButtonText}>  Sair da Tela</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
