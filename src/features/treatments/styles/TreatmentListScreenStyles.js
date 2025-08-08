// 📁 src/features/treatments/styles/TreatmentListScreenStyles.js

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4caf50',
    marginBottom: 16,
  },
  card: {
    borderWidth: 1,
    borderColor: '#c8e6c9',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  treatmentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2e7d32',
  },
  cardField: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },
  statusAtivo: {
    color: '#388e3c',
    fontWeight: 'bold',
  },
  statusInativo: {
    color: '#999',
    fontWeight: 'bold',
  },
  addButton: {
    marginTop: 16,
    backgroundColor: '#4caf50',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  exitButton: {
    marginTop: 12,
    borderColor: '#81c784',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
  },
  exitButtonText: {
    color: '#388e3c',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default styles;