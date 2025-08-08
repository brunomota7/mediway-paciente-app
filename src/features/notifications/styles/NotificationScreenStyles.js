// src/features/notifications/styles/NotificationScreenStyles.js

import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4caf50',
    flex: 1,
  },
  patientName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  filterGroup: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#555',
    marginTop: 6,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginTop: 4,
    backgroundColor: '#fff',
  },
  consultButton: {
    marginTop: 12,
    backgroundColor: '#4caf50',
    padding: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  consultButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 6,
  },
  cardDate: {
    fontWeight: '600',
    color: 'red',
    fontSize: 14,
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    marginTop: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#444',
    marginTop: 2,
  },
  cardInfo: {
    fontSize: 13,
    color: '#777',
    marginTop: 2,
  },
  cardWarning: {
    marginTop: 6,
    color: '#d32f2f',
    fontWeight: '600',
  },
  exitButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#4caf50',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 30,
  },
  exitButtonText: {
    color: '#4caf50',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default styles;
