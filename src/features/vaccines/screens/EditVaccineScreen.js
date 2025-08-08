// src/features/vaccines/screens/EditVaccineScreen.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import {
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import styles from '../styles/AddVaccineScreenStyles';

/**
 * Tela para editar um registro vacinal existente
 * Utiliza o mesmo estilo da tela de adição (padrão MVVM, código reutilizável)
 */
export default function EditVaccineScreen({ route, navigation }) {

  const { vacina } = route.params;
    
  // Estados simulados do ViewModel
  const [vacinaSelecionada, setVacinaSelecionada] = useState('Hepatite B');
  const [tipoDose, setTipoDose] = useState('Primeira Dose');
  const [dataVacinou, setDataVacinou] = useState(new Date('2023-02-12T08:30:00'));
  const [dataFabricacao, setDataFabricacao] = useState(new Date('2023-01-01'));
  const [lote, setLote] = useState('A123');
  const [proximaDoseMeses, setProximaDoseMeses] = useState(1);
  const [showDateVacina, setShowDateVacina] = useState(false);
  const [showDateFabricacao, setShowDateFabricacao] = useState(false);

  const calcularProximaDose = () => {
    const proxima = new Date(dataVacinou);
    proxima.setMonth(proxima.getMonth() + proximaDoseMeses);
    return proxima.toLocaleDateString('pt-BR');
  };

  const handleSave = () => {
    // Aqui seria feita a chamada à API para atualizar o registro no backend
    alert('Vacina atualizada com sucesso!');
    navigation.goBack();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <MaterialCommunityIcons name="shield-syringe" size={28} color="#4caf50" />
        <Text style={styles.title}>Carteira de Vacinas</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <MaterialCommunityIcons name="close" size={24} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Identificação do paciente */}
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>Edilson Carlos Silva Lima</Text>
        <Text style={styles.patientDetails}>Nascimento: 23/11/1975  |  Idade: 49  |  Sexo: Masculino</Text>
      </View>

      {/* Formulário de edição */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Vacina</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={vacinaSelecionada} onValueChange={(item) => setVacinaSelecionada(item)}>
            <Picker.Item label="Hepatite B" value="Hepatite B" />
            <Picker.Item label="Tétano" value="Tétano" />
            <Picker.Item label="Influenza" value="Influenza" />
          </Picker>
        </View>

        <Text style={styles.label}>Tipo de Dose</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={tipoDose} onValueChange={(item) => setTipoDose(item)}>
            <Picker.Item label="Ônica Dose" value="Ônica Dose" />
            <Picker.Item label="Primeira Dose" value="Primeira Dose" />
            <Picker.Item label="Segunda Dose" value="Segunda Dose" />
            <Picker.Item label="Terceira Dose" value="Terceira Dose" />
            <Picker.Item label="Reforço" value="Reforço" />
          </Picker>
        </View>

        <Text style={styles.label}>Data da Vacina</Text>
        <TouchableOpacity onPress={() => setShowDateVacina(true)}>
          <TextInput
            style={styles.input}
            value={dataVacinou.toLocaleDateString('pt-BR')}
            editable={false}
          />
        </TouchableOpacity>
        {showDateVacina && (
          <DateTimePicker
            value={dataVacinou}
            mode="date"
            display="default"
            onChange={(e, date) => {
              setShowDateVacina(false);
              if (date) setDataVacinou(date);
            }}
          />
        )}

        <Text style={styles.label}>Lote</Text>
        <TextInput
          style={styles.input}
          value={lote}
          onChangeText={setLote}
        />

        <Text style={styles.label}>Data de Fabricação</Text>
        <TouchableOpacity onPress={() => setShowDateFabricacao(true)}>
          <TextInput
            style={styles.input}
            value={dataFabricacao.toLocaleDateString('pt-BR')}
            editable={false}
          />
        </TouchableOpacity>
        {showDateFabricacao && (
          <DateTimePicker
            value={dataFabricacao}
            mode="date"
            display="default"
            onChange={(e, date) => {
              setShowDateFabricacao(false);
              if (date) setDataFabricacao(date);
            }}
          />
        )}

        <Text style={styles.label}>Próxima Dose Prevista</Text>
        <Text style={styles.readOnlyField}>📌 {calcularProximaDose()}</Text>
      </View>

      {/* Botões */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
        <Text style={styles.saveButtonText}>  Salvar Vacina</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.exitButton} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
        <Text style={styles.exitButtonText}>  Voltar à Carteira</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
