// 📁 src/features/cem/styles/EditCEMMedicationScreenStyles.js

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#ffffff',
    flexGrow: 1,
  },

  header: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4caf50',
    marginTop: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },

  label: {
    fontWeight: '600',
    fontSize: 14,
    marginTop: 20,
    color: '#555',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 6,
    backgroundColor: '#f9f9f9',
  },

  detailCard: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    padding: 12,
    marginTop: 10,
  },

  detailTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#333',
  },

  detailValue: {
    fontSize: 14,
    marginBottom: 4,
    color: '#555',
  },

  saveButton: {
    marginTop: 20,
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },

  deleteButton: {
    marginTop: 14,
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },

  cancelButton: {
    marginTop: 16,
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelButtonText: {
    fontWeight: 'bold',
    color: '#388e3c',
    marginLeft: 6,
  },
});
