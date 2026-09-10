// 📁 src/features/home/screens/HomeScreen.js

import * as ImagePicker from 'expo-image-picker';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import DashboardCard from '../../../components/dashboard/DashboardCard';
import styles from '../styles/HomeScreenStyles';
import { SafeAreaView } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import TabIcon from '../../../components/TabBar/TabBarIcon';
import { icons } from '../../../const/icons';
import { useFocusEffect } from '@react-navigation/native';
import { useConsultations } from '../../../hooks/useConsultations';
import { useExams } from '../../../hooks/useExams';
import { useMedications } from '../../../hooks/useMedications';
import { isUpcomingStatus } from '../../../lib/statusColors';

/** Conta itens em aberto x realizados e devolve subtítulo + progresso. */
function summarize(list, loading) {
  const abertos = list.filter((i) => isUpcomingStatus(i.status)).length;
  const realizados = list.filter((i) => i.status === 'REALIZADO').length;
  const total = abertos + realizados;
  return {
    subtitle: loading ? 'Carregando…' : `Marcados: ${abertos} | Realizados: ${realizados}`,
    progress: total > 0 ? Math.round((realizados / total) * 100) : 0,
  };
}

/**
 * Tela principal da área do paciente com dashboard e menu lateral
 */
export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Home');
  const [avatarUri, setAvatarUri] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const consultationsQuery = useConsultations();
  const examsQuery = useExams();
  const medicationsQuery = useMedications();
  const consultasResumo = summarize(consultationsQuery.data ?? [], consultationsQuery.isLoading);
  const examesResumo = summarize(examsQuery.data ?? [], examsQuery.isLoading);

  const meds = medicationsQuery.data ?? [];
  const medsAtivos = meds.filter((m) => m.status === 'ATIVO').length;
  const medsSuspensos = meds.length - medsAtivos;
  const prescricaoResumo = {
    subtitle: medicationsQuery.isLoading
      ? 'Carregando…'
      : `Ativos: ${medsAtivos} | Suspensos: ${medsSuspensos}`,
    progress: meds.length > 0 ? Math.round((medsAtivos / meds.length) * 100) : 0,
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setActiveTab('Home');
    }, [])
  );

  const handleTabPress = (tabName) => {
    setActiveTab(tabName);
    if (tabName === 'Cuidadores') navigation.navigate('Cuidadores');
    else if (tabName === 'Consultas') navigation.navigate('Consultas');
    else if (tabName === 'Exames') navigation.navigate('Exames');
    else if (tabName === 'Medicamentos') navigation.navigate('Medicamentos');
    else if (tabName === 'Vacinas') navigation.navigate('Vacinas');
    else if (tabName === 'Notifications') navigation.navigate('Notifications');
  };

  const escolherFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permissão necessária para acessar as fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* 🔹 Cabeçalho com menu, logo e avatar */}
        <View style={styles.topHeader}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.openDrawer()}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>

          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={styles.logoText}>Mediway</Text>
            <Text style={styles.subLogoText}>Paciente</Text>
          </Animated.View>

          <TouchableOpacity onPress={escolherFoto}>
            <Image
              source={avatarUri ? { uri: avatarUri } : require('../../../../assets/avatar-paciente.png')}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Minha Saúde</Text>

        {/* 🔹 Dashboard de consultas, exames, medicamentos */}
        <Text style={styles.subTitle}>Dashboard</Text>

        <View style={styles.dashboardContainer}>
          <DashboardCard
            icon={icons.consultas}
            title="Consultas"
            subtitle={consultasResumo.subtitle}
            progress={consultasResumo.progress}
          />
          <DashboardCard
            icon={icons.exames}
            title="Exames"
            subtitle={examesResumo.subtitle}
            progress={examesResumo.progress}
          />
          <DashboardCard
            icon={icons.prescricaoMedica}
            title="Prescrição Médica"
            subtitle={prescricaoResumo.subtitle}
            progress={prescricaoResumo.progress}
          />
        </View>

        <Text style={styles.subTitle}>Minha rotina médica</Text>

        {/* Atalhos */}
        <View style={styles.dashboardContainer}>
          <TouchableOpacity
            style={styles.dashboardCard}
            onPress={() => navigation.navigate('Cuidadores')}
          >
            <Image source={require('../../../../assets/icon-rede-cuidadores.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>Cuidadores</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dashboardCard}
            onPress={() => navigation.navigate('Tratamentos')}
          >
            <Image source={require('../../../../assets/icon-tratamento.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>Tratamento</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.dashboardCard}
            onPress={() => navigation.navigate('CEM')}
          >
            <Image source={require('../../../../assets/icon-cem.png')} style={styles.cardIcon} />
            <Text style={styles.cardText}>CEM</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dashboardContainer}>
          <TouchableOpacity
            style={styles.dashboardCard}
            onPress={() => navigation.navigate('Consultas')}
          >
            <Image source={icons.consultas} style={styles.cardIcon} />
            <Text style={styles.cardText}>Consultas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dashboardCard}
            onPress={() => navigation.navigate('Exames')}
          >
            <Image source={icons.exames} style={styles.cardIcon} />
            <Text style={styles.cardText}>Exames</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dashboardCard}
            onPress={() => navigation.navigate('Medicamentos')}
          >
            <Image source={icons.medicamentos} style={styles.cardIcon} />
            <Text style={styles.cardText}>Medicamento</Text>
          </TouchableOpacity>
        </View>

        {/* Navegação inferior (TabBar) */}
        <View style={styles.curvedTabBar}>
          <TabIcon 
            icon={icons.consultas}
            isActive={activeTab === 'Consultas'}
            onPress={() => handleTabPress('Consultas')}
          />
          <TabIcon
            icon={icons.exames}
            isActive={activeTab === 'Exames'}
            onPress={() => handleTabPress('Exames')}
          />
          <TabIcon
            icon={icons.home}
            isActive={activeTab === 'Home'}
            onPress={() => handleTabPress('Home')} 
          />
          <TabIcon 
            icon={icons.vacinas}
            isActive={activeTab === 'Vacinas'}
            onPress={() => handleTabPress('Vacinas')}
          />
          <TabIcon 
            icon={icons.notificacao}
            isActive={activeTab === 'Notifications'}
            onPress={() => handleTabPress('Notifications')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
