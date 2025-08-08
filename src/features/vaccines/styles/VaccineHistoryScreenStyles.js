// 📁 src/features/vaccines/styles/VaccineHistoryScreenStyles.js

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ffffff',
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginLeft: 10,
  },
  patientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2e7d32',
  },
  patientDetails: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderColor: '#c8e6c9',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vaccineName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginLeft: 8,
  },
  cardContent: {
    marginBottom: 12,
  },
  cardField: {
    fontSize: 14,
    color: '#333',
    marginVertical: 2,
  },
  fieldLabel: {
    fontWeight: '600',
    color: '#4caf50',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    flexDirection: 'row',
    backgroundColor: '#4caf50',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  editText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '500',
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#e53935',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  deleteText: {
    color: '#fff',
    marginLeft: 6,
    fontWeight: '500',
  },
  addButton: {
    marginTop: 16,
    backgroundColor: '#4caf50',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  exitButton: {
    marginTop: 12,
    borderColor: '#81c784',
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitButtonText: {
    color: '#388e3c',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default styles;
