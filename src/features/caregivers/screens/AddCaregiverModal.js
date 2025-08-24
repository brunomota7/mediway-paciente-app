// 📁 src/features/caregivers/screens/AddCaregiverModal.js

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { useEffect, useState } from "react";
import {
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "../styles/AddCaregiverModalStyles";

/**
Modal para adicionar um novo cuidador à rede de apoio do paciente.
Segue o padrão MVVM e identidade visual do projeto Mediway.
*/
export default function AddCaregiverModal({ visible, onClose, onSave }) {
  const [selectedCaregiverId, setSelectedCaregiverId] = useState("");
  const [caregiverSelecionado, setCaregiverSelecionado] = useState(null);

  // Lista simulada de cuidadores autorizados
  const cuidadoresAutorizados = [
    { id: "1", nome: "Maria da Silva", tipo: "Filho(a)" },
    { id: "2", nome: "João Mendes", tipo: "Cuidador Profissional" },
    { id: "3", nome: "Ana Beatriz", tipo: "Amigo(a)" },
  ];

  // Atualiza o cuidador selecionado
  useEffect(() => {
    const cuidador = cuidadoresAutorizados.find(
      (c) => c.id === selectedCaregiverId
    );
    setCaregiverSelecionado(cuidador || null);
  }, [selectedCaregiverId]);

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.modalContainer}>
          {/* 🔹 Cabeçalho */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons
                name="hand-heart"
                size={24}
                color="#4caf50"
                style={styles.icon}
              />
              <Text style={styles.title}>Adicionar Cuidador</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#555" />
            </TouchableOpacity>
          </View>

          {/* ⚠️ Aviso */}
          <View style={styles.infoBox}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={20}
              color="#ab47bc"
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              Apenas cuidadores já cadastrados como usuários do aplicativo
              Mediway – Cuidador podem ser adicionados à rede de apoio.
            </Text>
          </View>

          {/* 🔽 Seletor de Cuidador */}
          <Text style={styles.label}>Selecione o cuidador</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedCaregiverId}
              onValueChange={(itemValue) => setSelectedCaregiverId(itemValue)}
              style={styles.picker}
              itemStyle={styles.pickerItem}
            >
              <Picker.Item label="Selecione um cuidador..." value="" />
              {cuidadoresAutorizados.map((cuidador) => (
                <Picker.Item
                  key={cuidador.id}
                  label={cuidador.nome}
                  value={cuidador.id}
                />
              ))}
            </Picker>
          </View>

          {/* 📋 Detalhes */}
          {caregiverSelecionado && (
            <View style={styles.detailsBox}>
              <Text style={styles.detailText}>
                👤 Nome: {caregiverSelecionado.nome}
              </Text>
              <Text style={styles.detailText}>
                🏷️ Tipo: {caregiverSelecionado.tipo}
              </Text>
            </View>
          )}

          {/* 💾 Botões */}
          <TouchableOpacity
            style={styles.buttonPrimary}
            onPress={() => {
              if (caregiverSelecionado) {
                onSave(caregiverSelecionado);
                onClose();
              } else {
                alert("Por favor, selecione um cuidador.");
              }
            }}
          >
            <MaterialCommunityIcons name="check" size={20} color="#fff" />
            <Text style={styles.buttonPrimaryText}>Salvar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttonSecondary} onPress={onClose}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={20}
              color="#388e3c"
            />
            <Text style={styles.buttonSecondaryText}>
              Voltar para Rede de Cuidadores
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
}
