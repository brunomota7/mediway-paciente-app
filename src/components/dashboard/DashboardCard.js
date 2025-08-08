// 📁 src/components/dashboard/DashboardCard.js

import { Image, Text, View } from 'react-native';
import { Rect, Svg } from 'react-native-svg';
import styles from './DashboardCardStyles';

/**
 * Componente reutilizável para bloco do Dashboard
 * Exibe título, subtítulo e barra de progresso (opcional)
 */
const DashboardCard = ({ icon, title, subtitle, progress }) => {
  return (
    <View style={styles.cardContainer}>
      <Image 
        source={icon}
        style={{
          width: 28,
          height: 28,
          marginBottom: 8,
          resizeMode: 'contain',
        }} 
      />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}

      {/* Se progress estiver definido, mostra uma barra visual */}
      {typeof progress === 'number' && (
        <Svg height="8" width="100%" style={styles.progressContainer}>
          <Rect x="0" y="0" width="100%" height="8" rx="4" ry="4" fill="#e0e0e0" />
          <Rect x="0" y="0" width={`${progress}%`} height="8" rx="4" ry="4" fill="#66bb6a" />
        </Svg>
      )}
    </View>
  );
};

export default DashboardCard;