// 📁 src/features/profile/screens/UserProfileScreen.js

import { MaterialIcons } from '@expo/vector-icons'; // Ícones do Expo
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import {
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import styles from '../styles/UserProfileScreenStyles';

/**
 * Tela de edição de perfil do paciente seguindo o padrão MVVM
 */
export default function UserProfileScreen({ navigation }) {
  // 🧠 Estados controlados (ViewModel)
  const [usuario, setUsuario] = useState('edilson.lima');
  const [nome, setNome] = useState('Edilson Carlos Lima');
  const [dataNascimento, setDataNascimento] = useState(new Date('1990-01-01'));
  const [genero, setGenero] = useState('M');
  const [telefone, setTelefone] = useState('(98) 3456-7890');
  const [celular, setCelular] = useState('(98) 98765-4321');

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    // Aqui entraria a lógica de atualização do backend (Model)
    console.log({ usuario, nome, dataNascimento, genero, telefone, celular });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 🔹 Cabeçalho */}
      <View style={styles.header}>
        <Image
          source={require('../../../../assets/avatar-paciente.png')}
          style={styles.avatar}
        />
        <Text style={styles.name}>{nome}</Text>
        <Text style={styles.updated}>Última atualização em: 12/07/2025</Text>
      </View>

      {/* 🔹 Formulário de dados */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Usuário</Text>
        <TextInput
          style={styles.input}
          value={usuario}
          onChangeText={setUsuario}
        />

        <Text style={styles.label}>Nome completo</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
        />

        <Text style={styles.label}>Data de nascimento</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={styles.input}
            value={dataNascimento.toLocaleDateString('pt-BR')}
            editable={false}
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dataNascimento}
            mode="date"
            display="default"
            onChange={(e, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDataNascimento(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>Gênero</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={genero} onValueChange={(item) => setGenero(item)}>
            <Picker.Item label="Masculino" value="M" />
            <Picker.Item label="Feminino" value="F" />
          </Picker>
        </View>

        <Text style={styles.label}>Telefone</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Celular</Text>
        <TextInput
          style={styles.input}
          value={celular}
          onChangeText={setCelular}
          keyboardType="phone-pad"
        />
      </View>

      {/* 🔹 Botões */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <MaterialIcons name="save" size={20} color="#fff" />
        <Text style={styles.saveButtonText}>  Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
        <MaterialIcons name="logout" size={20} color="#388e3c" />
        <Text style={styles.exitButtonText}>  Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
