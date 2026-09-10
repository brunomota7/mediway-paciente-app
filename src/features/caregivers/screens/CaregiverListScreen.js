import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddCaregiverModal from "../screens/AddCaregiverModal";
import AddTeamMemberModal from "../screens/AddTeamMemberModal";
import styles from "../styles/CaregiverListScreenStyles";
import { useAuth } from "../../../auth/useAuth";

/**
 * Tela de listagem da rede de cuidadores do paciente
 * Inclui seções de equipe multidisciplinar e cuidadores
 * Segue padrão MVVM e identidade visual Mediway
 */
export default function CaregiverListScreen({ navigation }) {
  const { user } = useAuth();
  const patientName = user?.name || 'Paciente';

  const [modalEquipeVisible, setModalEquipeVisible] = useState(false);
  const [modalCuidadorVisible, setModalCuidadorVisible] = useState(false);

  // Estado local simulado de membros e cuidadores
  const [equipe, setEquipe] = useState([
    { id: "1", nome: "Dra. Ana Paula", especialidade: "Fisioterapeuta" },
    { id: "2", nome: "Dr. João Carlos", especialidade: "Cardiologista" },
  ]);

  const [cuidadores, setCuidadores] = useState([
    { id: "3", nome: "Maria da Silva", tipo: "Familiar" },
    { id: "4", nome: "João Mendes", tipo: "Voluntário" },
  ]);

  // Confirmação e exclusão de membro ou cuidador
  const confirmarExclusao = (tipo, id) => {
    Alert.alert("Confirmação", "Deseja realmente remover este membro?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: () => {
          if (tipo === "equipe") {
            setEquipe((prev) => prev.filter((m) => m.id !== id));
          } else if (tipo === "cuidadores") {
            setCuidadores((prev) => prev.filter((c) => c.id !== id));
          }
        },
      },
    ]);
  };

  // Adiciona novo membro da equipe vindo do modal
  const adicionarMembroEquipe = (novoMembro) => {
    if (!equipe.some((m) => m.id === novoMembro.id)) {
      setEquipe([...equipe, novoMembro]);
    }
  };

  const adicionarCuidador = (novoCuidador) => {
    if (!cuidadores.some((c) => c.id === novoCuidador.id)) {
      setCuidadores([...cuidadores, novoCuidador]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Identificação do Paciente */}
        <Text style={styles.patientName}>{patientName}</Text>
        <Text style={styles.patientRole}>Paciente</Text>

        {/* Equipe Multidisciplinar */}
        <Text style={styles.sectionTitleEquipe}>Equipe Multidisciplinar</Text>
        <FlatList
          data={equipe}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <MaterialCommunityIcons
                name="account-tie"
                size={24}
                color="#4caf50"
              />
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text style={styles.cardSubtitle}>{item.especialidade}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmarExclusao("equipe", item.id)}
              >
                <MaterialCommunityIcons name="delete" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalEquipeVisible(true)}
        >
          <MaterialCommunityIcons name="account-plus" size={20} color="#fff" />
          <Text style={styles.addButtonText}> Adicionar Membro à Equipe</Text>
        </TouchableOpacity>

        {/* 🔹 Separador visual */}
        <View style={styles.separator} />

        {/* 🤝 Cuidadores */}
        <Text style={styles.sectionTitleCuidadores}>Cuidadores</Text>
        <FlatList
          data={cuidadores}
          numColumns={3}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <MaterialCommunityIcons
                name="account-heart"
                size={24}
                color="#ab47bc"
              />
              <Text style={styles.cardTitle}>{item.nome}</Text>
              <Text style={styles.cardSubtitle}>{item.tipo}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => confirmarExclusao("cuidadores", item.id)}
              >
                <MaterialCommunityIcons name="delete" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalCuidadorVisible(true)}
        >
          <MaterialCommunityIcons name="hand-heart" size={20} color="#fff" />
          <Text style={styles.addButtonText}> Adicionar Cuidador</Text>
        </TouchableOpacity>

        {/* Voltar à Home */}
        <TouchableOpacity
          style={styles.exitButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialCommunityIcons name="arrow-left" size={20} color="#388e3c" />
          <Text style={styles.exitButtonText}> Voltar à Tela Principal</Text>
        </TouchableOpacity>

        {/* Modal: Adição de membro à equipe */}
        <AddTeamMemberModal
          visible={modalEquipeVisible}
          onClose={() => setModalEquipeVisible(false)}
          onSave={adicionarMembroEquipe}
        />

        {/* Modal de Adição de Cuidador */}
        <AddCaregiverModal
          visible={modalCuidadorVisible}
          onClose={() => setModalCuidadorVisible(false)}
          onSave={adicionarCuidador}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
