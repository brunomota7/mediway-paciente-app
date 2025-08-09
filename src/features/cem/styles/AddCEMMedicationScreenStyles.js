// 📁 src/features/cem/styles/AddCEMMedicationScreenStyles.js

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    padding: 20,
    flexGrow: 1,
  },
  header: {
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    color: '#4caf50',
    fontWeight: 'bold',
    marginTop: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginTop: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 6,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#388e3c',
    marginTop: 12,
  },
  detail: {
    fontSize: 14,
    color: '#4caf50',
    marginTop: 6,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 6,
    marginTop: 24,
  },
  saveButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 12,
    marginTop:12,
    borderWidth: 1,
    borderColor: '#388e3c',
    borderRadius: 6,
  },
  cancelButtonText: {
    color: '#388e3c',
    fontSize: 16,
  },
});
