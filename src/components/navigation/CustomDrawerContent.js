// 📁 src/components/navigation/CustomDrawerContent.js

import { Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

import { useAuth } from '../../auth/useAuth';

/**
 * Menu lateral personalizado do Drawer (AppStack).
 */
const CustomDrawerContent = (props) => {
  const { signOut } = useAuth();

  const confirmSignOut = () => {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ backgroundColor: '#fff' }}>
      <DrawerItem
        label="Perfil"
        icon={() => <MaterialIcons name="person" size={24} color="#2e7d32" />}
        labelStyle={{ color: '#2e7d32' }}
        onPress={() => props.navigation.navigate('Perfil')}
      />
      <DrawerItem
        label="Troca de Senha"
        icon={() => <MaterialIcons name="lock" size={24} color="#2e7d32" />}
        labelStyle={{ color: '#2e7d32' }}
        onPress={() => props.navigation.navigate('Troca de Senha')}
      />
      <DrawerItem
        label="Tipo Sanguíneo"
        icon={() => <MaterialIcons name="opacity" size={24} color="#2e7d32" />}
        labelStyle={{ color: '#2e7d32' }}
        onPress={() => props.navigation.navigate('Tipo Sanguíneo')}
      />
      <DrawerItem
        label="Notificações"
        icon={() => <MaterialIcons name="notifications" size={24} color="#2e7d32" />}
        labelStyle={{ color: '#2e7d32' }}
        onPress={() => props.navigation.navigate('Notificações')}
      />
      <DrawerItem
        label="Vacinas"
        icon={() => <MaterialIcons name="local-hospital" size={24} color="#2e7d32" />}
        labelStyle={{ color: '#2e7d32' }}
        onPress={() => props.navigation.navigate('Vacinas')}
      />
      <DrawerItem
        label="Sair"
        icon={() => <MaterialIcons name="logout" size={24} color="#2e7d32" />}
        labelStyle={{ color: '#2e7d32' }}
        onPress={confirmSignOut}
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
