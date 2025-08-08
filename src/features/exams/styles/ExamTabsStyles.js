// 📄 src/features/exams/styles/ExamTabsStyles.js

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
    backgroundColor: '#ffffff',
    marginBottom: 12,
  },
  indicator: {
    backgroundColor: '#4caf50',
    height: 3,
  },
  activeTabTitle: {
    color: '#4caf50',
    fontWeight: '600',
    fontSize: 14,
  },
  inactiveTabTitle: {
    color: '#aaa',
    fontWeight: '400',
    fontSize: 14,
  },
  tabView: {
    paddingHorizontal: 16,
    flex: 1,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#a5d6a7',
    padding: 16,
    marginVertical: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  text: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
    fontSize: 14,
  },

  // 🔹 Estilo dinâmico exportado como função
  statusBadge,
});

export default styles;
