// 📁 src/components/dashboard/DashboardCardStyles.js

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  cardContainer: {
    backgroundColor: '#f1f8e9', // Verde-claro suave
    borderRadius: 12,
    padding: 12,
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 2, // sombra no Android
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1b5e20',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#4caf50',
    textAlign: 'center',
    marginTop: 4,
  },
  progressContainer: {
    marginTop: 8,
  },
});
