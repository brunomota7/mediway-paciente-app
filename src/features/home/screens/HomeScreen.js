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

/**
 * Tela principal da área do paciente com dashboard e menu lateral
 */
export default function HomeScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Home');
  const [avatarUri, setAvatarUri] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
            subtitle="Marcadas: 3 | Realizadas: 2"
            progress={66}
          />
          <DashboardCard
            icon={icons.exames}
            title="Exames"
            subtitle="Agendados: 2 | Feitos: 1"
            progress={50}
          />
          <DashboardCard
            icon={icons.prescricaoMedica}
            title="Prescrição Médica"
            subtitle="Tomados: 5 | Pendentes: 2"
            progress={71}
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
