// 🧩 src/features/medications/screens/EditExamModal.js

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles/AddMedicationModalStyles';

export default function EditExamModal({ visible, onClose, onSave, exame }) {
  const [Nome, setNome] = useState('');
  const [DataExame, setDataExame] = useState(new Date());
  const [HoraExame, setHoraExame] = useState(new Date());
  const [Local, setLocal] = useState('');
  const [Requisito, setRequisito] = useState('');
  const [Situacao, setSituacao] = useState(0);
  const [showDate, setShowDate] = useState(false);
  const [showHour, setShowHour] = useState(false);

  useEffect(() => {
    if (exame) {
      setNome(exame.Nome);
      setDataExame(new Date(exame.DataExame));
      setHoraExame(new Date(exame.HoraExame));
      setLocal(exame.Local);
      setRequisito(exame.Requisito);
      setSituacao(exame.Situacao);
    }
  }, [exame]);

  const handleSave = () => {
    onSave({ ...exame, Nome, DataExame, HoraExame, Local, Requisito, Situacao });
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* similar ao AddExamModal */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons name="flask-outline" size={24} color="#4caf50" />
              <Text style={styles.title}>Editar Exame</Text>
            </View>
            <TouchableOpacity onPress={onClose}><MaterialCommunityIcons name="close" size={24} color="#555" /></TouchableOpacity>
          </View>
          {/* campos com valores iniciais */}
          {/* replicar DataExame/Hora etc */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <MaterialCommunityIcons name="content-save" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
