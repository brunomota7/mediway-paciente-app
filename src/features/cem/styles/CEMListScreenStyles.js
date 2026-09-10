// 📁 src/features/cem/styles/CEMListScreenStyles.js

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },

  header: {
    marginBottom: 16,
    alignItems: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 8,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },

  list: {
    paddingBottom: 120,
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
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },

  patientCount: {
    fontSize: 14,
    color: '#888',
    marginHorizontal: 8,
  },

  visualizarBtn: {
    padding: 6,
    backgroundColor: '#e8f5e9',
    borderRadius: 6,
  },

  patientIndicatorRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },

  patientDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },

  addButton: {
    backgroundColor: '#4caf50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginTop: 16,
  },

  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },

  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#388e3c',
    marginTop: 12,
  },

  exitButtonText: {
    color: '#388e3c',
    fontWeight: 'bold',
    marginLeft: 8,
  },

  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#4caf50',
  },

  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f8e9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  modalText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },

  modalCancel: {
    marginTop: 20,
    alignItems: 'center',
  },

  modalCancelText: {
    color: '#d32f2f',
    fontSize: 16,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    color: '#666',
    textAlign: 'center',
    marginVertical: 12,
  },
  boxField: {
    fontSize: 13,
    color: '#888',
    marginTop: 8,
  },
  boxValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#4caf50',
    marginTop: 12,
  },
  secondaryButtonText: {
    color: '#2e7d32',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#81c784',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
});

export default styles;
