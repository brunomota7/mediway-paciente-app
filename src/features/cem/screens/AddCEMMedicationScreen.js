// 📁 src/features/cem/screens/AddCEMMedicationScreen.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker'; // usado como seletor
import { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../styles/AddCEMMedicationScreenStyles';

/**
 * Tela para adicionar medicamento manualmente a uma gaveta da CEM
 * Padrão MVVM | Visual clínico e acessível
 */
export default function AddCEMMedicationScreen({ route, navigation }) {
  const { posicao, paciente, serie } = route.params;

  const [tipo, setTipo] = useState('');
  const [nomeMedicamento, setNomeMedicamento] = useState('');
  const [generico, setGenerico] = useState('');
  const [similar, setSimilar] = useState('');
  const [referencia, setReferencia] = useState('');
  const [manipulado, setManipulado] = useState('');
  const [concentracao, setConcentracao] = useState('');
  const [quantidadeDose, setQuantidadeDose] = useState('');
  const [estoque, setEstoque] = useState('');

  const getCorPaciente = (id) => {
    return id === 1 ? '#2196f3' : id === 2 ? '#4caf50' : '#ffeb3b';
  };

  const handleSalvar = () => {
    if (!tipo || !nomeMedicamento || !estoque) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    // Dados simulados enviados para a tela anterior
    navigation.navigate({
      name: 'Visualizar Medicamentos CEM',
      params: {
        novoMedicamento: {
          pos: posicao,
          paciente,
          medicamento: nomeMedicamento
        }
      },
      merge: true
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 🔹 Cabeçalho */}
        <View style={styles.header}>
          {/* <MaterialCommunityIcons name="pill" size={24} color={getCorPaciente(paciente)} /> */}
          <Text style={styles.title}>Adicionar Novo Medicamento na CEM</Text>
          <Text style={styles.subtitle}>
            Paciente:
            <Text style={{ fontWeight: 'bold', color: getCorPaciente(paciente) }}>
              Paciente {paciente}
            </Text>
          </Text>
          <Text style={styles.subtitle}>Série da CEM: {serie} | Gaveta: {posicao}</Text>
        </View>

        {/* 🔹 Tipo de Medicamento */}
        <Text style={styles.label}>Tipo de Medicamento</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={tipo} onValueChange={(value) => setTipo(value)} style={styles.picker}>
            <Picker.Item label="Selecione o tipo" value="" />
            <Picker.Item label="Referência" value="Referência" />
            <Picker.Item label="Genérico" value="Genérico" />
            <Picker.Item label="Similar" value="Similar" />
            <Picker.Item label="Manipulado" value="Manipulado" />
          </Picker>
        </View>

        {/* 🔹 Nome do Medicamento */}
        <Text style={styles.label}>Nome do Medicamento</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite ou selecione o nome do medicamento"
          value={nomeMedicamento}
          onChangeText={(value) => {
            setNomeMedicamento(value);
            // Simulação de preenchimento automático:
            switch (value.toLowerCase()) {
              case 'dipirona':
                setGenerico('Dipirona Sódica');
                setSimilar('Não Informado');
                setReferencia('Dipirona');
                setManipulado('');
                setConcentracao('500mg');
                setQuantidadeDose('1 comprimido');
                break;
              case 'novalgina':
                setGenerico('Dipirona');
                setSimilar('Dipimed');
                setReferencia('Novalgina');
                setManipulado('Cápsulas analgésicas manipuladas');
                setConcentracao('500mg');
                setQuantidadeDose('1 comprimido');
                break;
              case 'losec':
                setGenerico('Omeprazol');
                setSimilar('Dipimed');
                setReferencia('Losec');
                setManipulado('Cápsulas analgésicas manipuladas');
                setConcentracao('500mg');
                setQuantidadeDose('1 comprimido');
                break;
              case 'paracetamol':
                setGenerico('Dipirona');
                setSimilar('Dipimed');
                setReferencia('Paracetamol');
                setManipulado('Cápsulas analgésicas manipuladas');
                setConcentracao('500mg');
                setQuantidadeDose('1 comprimido');
                break;
              case 'glucoformin':
                setGenerico('Dipirona');
                setSimilar('Dipimed');
                setReferencia('Glucoformin');
                setManipulado('Cápsulas analgésicas manipuladas');
                setConcentracao('500mg');
                setQuantidadeDose('1 comprimido');
                break;
              case 'renitec':
                setGenerico('Dipirona');
                setSimilar('Dipimed');
                setReferencia('Renitec');
                setManipulado('Cápsulas analgésicas manipuladas');
                setConcentracao('500mg');
                setQuantidadeDose('1 comprimido');
                break;
              case 'nizoral':
                setGenerico('Dipirona');
                setSimilar('Dipimed');
                setReferencia('Nizoral');
                setManipulado('Cápsulas analgésicas manipuladas');
                setConcentracao('500mg');
                setQuantidadeDose('1 comprimido');
                break;
              case 'amoxil':
                setGenerico('Dipirona');
                setSimilar('Dipimed');
                setReferencia('Amoxil');
                setManipulado('Cápsulas analgésicas manipuladas');
                setConcentracao('500mg');
                setQuantidadeDose('1 comprimido');
                break;
              default:
                // Limpa campos caso nome não reconhecido
                setGenerico('');
                setSimilar('');
                setReferencia('');
                setManipulado('');
                setConcentracao('');
                setQuantidadeDose('');
                break;
            }
          }}
        />

        {/* 🔹 Dados Farmacológicos | Exibição de dados preenchidos */}
        {nomeMedicamento !== '' && (
          <>
            {generico ? <Text style={styles.detail}>Genérico: {generico}</Text> : null}
            {similar ? <Text style={styles.detail}>Similar: {similar}</Text> : null}
            {referencia ? <Text style={styles.detail}>Referência: {referencia}</Text> : null}
            {manipulado ? <Text style={styles.detail}>Manipulado: {manipulado}</Text> : null}
            {concentracao ? <Text style={styles.detail}>Concentração: {concentracao}</Text> : null}
            {quantidadeDose ? <Text style={styles.detail}>Qtd Dose: {quantidadeDose}</Text> : null}
          </>
        )}

        {/* 🔹Quantidade (Estoque a ser inserido) */}
        <Text style={styles.label}>Quantidade a ser colocada na CEM</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 10"
          keyboardType="numeric"
          value={estoque}
          onChangeText={setEstoque}
        />

        {/* 🔹 Botões */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSalvar}>
          <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
          <Text style={styles.saveButtonText}>Salvar Medicamento na CEM</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
          <Text style={styles.cancelButtonText}>Voltar à Visualização da CEM</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
