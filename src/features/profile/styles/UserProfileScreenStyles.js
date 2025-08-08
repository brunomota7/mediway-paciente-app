// 📁 src/features/profile/styles/UserProfileScreenStyles.js

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#388e3c',
  },
  updated: {
    fontSize: 12,
    color: '#888',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#4caf50',
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#c8e6c9',
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 14,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#c8e6c9',
    borderRadius: 8,
    marginBottom: 12,
  },
  saveButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  exitButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#81c784',
    paddingVertical: 12,
    borderRadius: 8,
  },
  exitButtonText: {
    color: '#388e3c',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default styles;
