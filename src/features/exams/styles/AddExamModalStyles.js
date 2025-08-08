// 📄 src/features/exams/styles/AddExamModalStyles.js

import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#4caf50',
  },

  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },

  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    marginTop: 15,
  },

  input: {
    borderWidth: 1,
    borderColor: '#c8e6c9',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },

  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },

  dateField: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c8e6c9',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#f9f9f9',
  },

  dateText: {
    marginLeft: 10,
    color: '#333',
  },

  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4caf50',
    borderRadius: 8,
    padding: 12,
    marginTop: 20,
  },

  saveButtonText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },

  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4caf50',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },

  cancelButtonText: {
    color: '#388e3c',
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
