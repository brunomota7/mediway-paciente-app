// 📁 src/components/navigation/CustomDrawerContent.js

import { MaterialIcons } from '@expo/vector-icons'; // ou outro pacote de ícones
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

/**
 * Menu lateral personalizado utilizado pelo Drawer Navigator do app MediWay.
 * Segue o padrão MVVM (View Component isolado).
 */
const CustomDrawerContent = (props) => {
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
        onPress={() => alert('Sair')}
      />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
