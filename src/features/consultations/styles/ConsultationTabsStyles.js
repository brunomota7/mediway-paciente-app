// 📁 src/features/consultations/styles/ConsultationTabsStyles.js

import { StyleSheet } from 'react-native';

const statusBadge = (color) => ({
  backgroundColor: color,
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 20,
  alignSelf: 'flex-start',
  marginBottom: 8,
});

const styles = StyleSheet.create({
  tabContainer: {
    borderBottomWidth: 1,
    borderColor: '#c8e6c9',
    paddingVertical: 4,
  },

  indicator: {
    backgroundColor: '#4caf50',
    height: 3,
  },

  activeTabTitle: {
    color: '#2e7d32',
    fontWeight: 'bold',
  },

  inactiveTabTitle: {
    color: '#999',
    fontWeight: 'normal',
  },

  tabView: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },

  card: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#c8e6c9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    flex: 1,
    marginRight: 8,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    marginBottom: 2,
  },

  text: {
    fontSize: 13,
    color: '#333',
    marginBottom: 2,
  },

  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },

  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    marginTop: 20,
  },

  // 🔹 Estilo dinâmico exportado como função
  statusBadge,
});

export default styles;
