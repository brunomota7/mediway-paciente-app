// 📁 src/features/caregivers/components/AddTeamMemberModal.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from '../styles/AddTeamMemberModalStyles';

/**
 * Modal para adicionar um novo membro à Equipe Multidisciplinar
 * Segue o padrão MVVM e identidade visual do projeto Mediway
 */
export default function AddTeamMemberModal({ visible, onClose, onSave }) {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [membroSelecionado, setMembroSelecionado] = useState(null);

  // Simulação de membros cadastrados
  const membrosCadastrados = [
    { id: '1', nome: 'Dra. Ana Paula', especialidade: 'Fisioterapeuta' },
    { id: '2', nome: 'Dr. João Carlos', especialidade: 'Cardiologista' },
    { id: '3', nome: 'Dra. Helena Mendes', especialidade: 'Nutricionista' },
  ];

  // Atualiza detalhes ao mudar seleção
  useEffect(() => {
    const membro = membrosCadastrados.find((m) => m.id === selectedMemberId);
    setMembroSelecionado(membro || null);
  }, [selectedMemberId]);

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={styles.modalContainer}>
        {/* 🔹 Cabeçalho */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons name="account-heart" size={24} color="#4caf50" style={styles.icon} />
            <Text style={styles.title}>Adicionar Membro à Equipe</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons name="close" size={24} color="#555" />
          </TouchableOpacity>
        </View>

        {/* ⚠️ Aviso */}
        <View style={styles.infoBox}>
          <MaterialCommunityIcons name="alert-circle" size={20} color="#ab47bc" style={styles.infoIcon} />
          <Text style={styles.infoText}>
            Apenas cuidadores já cadastrados como membro de Equipe Multidisciplinar no aplicativo Mediway podem ser adicionados. Caso ainda não esteja cadastrado, peça que se cadastre.
          </Text>
        </View>

        {/* 🔽 Seletor */}
        <Text style={styles.label}>Selecione o profissional</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedMemberId}
            onValueChange={(itemValue) => setSelectedMemberId(itemValue)}
          >
            <Picker.Item label="Selecione um membro..." value="" />
            {membrosCadastrados.map((membro) => (
              <Picker.Item key={membro.id} label={membro.nome} value={membro.id} />
            ))}
          </Picker>
        </View>

        {/* 📋 Detalhes */}
        {membroSelecionado && (
          <View style={styles.detailsBox}>
            <Text style={styles.detailText}>👤 Nome: {membroSelecionado.nome}</Text>
            <Text style={styles.detailText}>📌 Especialidade: {membroSelecionado.especialidade}</Text>
          </View>
        )}

        {/* 💾 Botões */}
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => {
            if (membroSelecionado) {
              onSave(membroSelecionado);
              onClose();
            } else {
              alert('Por favor, selecione um membro.');
            }
          }}
        >
          <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
          <Text style={styles.buttonPrimaryText}>Salvar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary} onPress={onClose}>
          <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
          <Text style={styles.buttonSecondaryText}>Voltar para Rede de Cuidadores</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}
