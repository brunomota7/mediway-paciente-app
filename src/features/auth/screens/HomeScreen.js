import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import styles from '../styles/HomeScreenStyles';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Menu Drawer simulado */}
      <TouchableOpacity style={styles.menuButton}>
        <Text style={styles.menuIcon}>☰</Text>
      </TouchableOpacity>

      {/* Título da seção */}
      <Text style={styles.header}>Minha Saúde</Text>

      {/* Dashboard */}
      <View style={styles.dashboard}>
        <View style={styles.card}><Text>Consultas</Text></View>
        <View style={styles.card}><Text>Exames</Text></View>
        <View style={styles.card}><Text>Prescrição Médica</Text></View>
      </View>

      {/* Ícones Interativos */}
      <View style={styles.grid}>
        <TouchableOpacity style={styles.gridItem}><Text>Rede de Cuidadores</Text></TouchableOpacity>
        <TouchableOpacity style={styles.gridItem}><Text>Tratamento Médico</Text></TouchableOpacity>
        <TouchableOpacity style={styles.gridItem}><Text>Caixa Eletrônica</Text></TouchableOpacity>
        <TouchableOpacity style={styles.gridItem}><Text>Consultas</Text></TouchableOpacity>
        <TouchableOpacity style={styles.gridItem}><Text>Exames</Text></TouchableOpacity>
        <TouchableOpacity style={styles.gridItem}><Text>Medicamentos</Text></TouchableOpacity>
        <TouchableOpacity style={styles.gridItem}><Text>Vacinas</Text></TouchableOpacity>
      </View>

      {/* Rodapé curvo */}
      <View style={styles.footer}>
        <Text style={styles.footerIcon}>🏠</Text>
        <Text style={styles.footerIcon}>🩺</Text>
        <Text style={styles.footerIcon}>🔬</Text>
        <Text style={styles.footerIcon}>💊</Text>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;