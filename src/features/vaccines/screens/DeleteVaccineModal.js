import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles/DeleteVaccineModalStyles';

/**
 * Componente de modal de confirmação de exclusão de vacina.
 * Segue o padrão MVVM com propriedades controladas externamente.
 */
const DeleteVaccineModal = ({ visible, vacina, nomePaciente, onClose, onConfirm }) => {
  if (!vacina) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* 🔔 Cabeçalho com ícone e título */}
          <View style={styles.header}>
            <MaterialCommunityIcons name="alert" size={32} color="#d32f2f" />
            <Text style={styles.title}>Excluir Vacina da Carteira?</Text>
          </View>

          {/* 💬 Mensagem de confirmação */}
          <Text style={styles.message}>
            Tem certeza que deseja excluir esta vacina da carteira de <Text style={styles.bold}>{nomePaciente}</Text>?
            {'\n'}Essa ação <Text style={styles.boldDanger}>não poderá ser desfeita</Text>.
          </Text>

          {/* 📋 Informações resumidas da vacina */}
          <View style={styles.vaccineInfo}>
            <Text style={styles.vaccineLabel}>Vacina:</Text>
            <Text style={styles.vaccineValue}>{vacina.nome}</Text>

            <Text style={styles.vaccineLabel}>Dose:</Text>
            <Text style={styles.vaccineValue}>{vacina.tipoDose}</Text>

            <Text style={styles.vaccineLabel}>Data Aplicação:</Text>
            <Text style={styles.vaccineValue}>{vacina.dataVacinou}</Text>

            <Text style={styles.vaccineLabel}>Lote:</Text>
            <Text style={styles.vaccineValue}>{vacina.lote}</Text>
          </View>

          {/* ✅ Botões de ação */}
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={() => onConfirm(vacina.id)}
            >
              <MaterialCommunityIcons name="delete" size={20} color="#fff" />
              <Text style={styles.confirmButtonText}>  Sim, excluir vacina</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <MaterialCommunityIcons name="close" size={20} color="#333" />
              <Text style={styles.cancelButtonText}>  Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DeleteVaccineModal;
