// src/features/vaccines/screens/AddVaccineScreen.js

import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../styles/AddVaccineScreenStyles";

/**
 * Tela modal para adicionar vacina à carteira do paciente.
 * Segue padrão MVVM com ViewModel e separação de estilos.
 */
export default function AddVaccineScreen({ navigation }) {
  // 🧠 ViewModel: estados do formulário
  const [vacinaSelecionada, setVacinaSelecionada] = useState("");
  const [tipoDose, setTipoDose] = useState("");
  const [dataVacinou, setDataVacinou] = useState(new Date());
  const [dataFabricacao, setDataFabricacao] = useState(new Date());
  const [lote, setLote] = useState("");
  const [proximaDoseMeses, setProximaDoseMeses] = useState(1);
  const [showDataVacinou, setShowDataVacinou] = useState(false);
  const [showDataFabricacao, setShowDataFabricacao] = useState(false);

  const calcularProximaDose = () => {
    const proxima = new Date(dataVacinou);
    proxima.setMonth(proxima.getMonth() + proximaDoseMeses);
    return proxima.toLocaleDateString("pt-BR");
  };

  const handleSalvar = () => {
    // Lógica para enviar ao backend
    console.log({
      vacinaSelecionada,
      tipoDose,
      dataVacinou,
      lote,
      dataFabricacao,
    });
    alert("Vacina adicionada com sucesso!");
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 🔹 Cabeçalho */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="shield-plus"
            size={28}
            color="#4caf50"
          />
          <Text style={styles.title}>Carteira de Vacinas</Text>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeButton}
          >
            <MaterialCommunityIcons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        {/* 🔹 Info do paciente */}
        <View style={styles.patientInfo}>
          <Text style={styles.patientName}>Edilson Carlos Silva Lima</Text>
          <Text style={styles.patientDetails}>
            Nascimento: 23/11/1975 | Idade: 39 | Sexo: Masculino
          </Text>
        </View>

        {/* 🔹 Formulário */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Vacina</Text>
          <Picker
            selectedValue={vacinaSelecionada}
            onValueChange={setVacinaSelecionada}
            style={styles.picker}
          >
            <Picker.Item label="Selecione" value="" />
            <Picker.Item label="Hepatite B" value="hepatiteb" />
            <Picker.Item label="Tétano" value="tetano" />
          </Picker>

          <Text style={styles.label}>Tipo de Dose</Text>
          <Picker
            selectedValue={tipoDose}
            onValueChange={setTipoDose}
            style={styles.picker}
          >
            <Picker.Item label="Selecione" value="" />
            <Picker.Item label="Única Dose" value="unica" />
            <Picker.Item label="Primeira Dose" value="1" />
            <Picker.Item label="Segunda Dose" value="2" />
            <Picker.Item label="Reforço" value="reforco" />
          </Picker>

          <Text style={styles.label}>Data da Vacina</Text>
          <TouchableOpacity
            onPress={() => setShowDataVacinou(true)}
            style={styles.dateInput}
          >
            <Text>{dataVacinou.toLocaleDateString("pt-BR")}</Text>
          </TouchableOpacity>
          {showDataVacinou && (
            <DateTimePicker
              value={dataVacinou}
              mode="date"
              display="default"
              onChange={(e, date) => {
                setShowDataVacinou(false);
                if (date) setDataVacinou(date);
              }}
            />
          )}

          <Text style={styles.label}>Lote</Text>
          <TextInput
            style={styles.input}
            value={lote}
            onChangeText={setLote}
            maxLength={10}
          />

          <Text style={styles.label}>Data de Fabricação</Text>
          <TouchableOpacity
            onPress={() => setShowDataFabricacao(true)}
            style={styles.dateInput}
          >
            <Text>{dataFabricacao.toLocaleDateString("pt-BR")}</Text>
          </TouchableOpacity>
          {showDataFabricacao && (
            <DateTimePicker
              value={dataFabricacao}
              mode="date"
              display="default"
              onChange={(e, date) => {
                setShowDataFabricacao(false);
                if (date) setDataFabricacao(date);
              }}
            />
          )}

          <Text style={styles.label}>Próxima Dose Prevista</Text>
          <View style={styles.proximaDoseBox}>
            <MaterialCommunityIcons
              name="calendar-check"
              size={20}
              color="#4caf50"
            />
            <Text style={styles.proximaDoseText}>{calcularProximaDose()}</Text>
          </View>
        </View>

        {/* 🔹 Ações */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
          <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
          <Text style={styles.saveButtonText}> Salvar Vacina</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.exitButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
          <Text style={styles.exitButtonText}> Voltar à Carteira</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
